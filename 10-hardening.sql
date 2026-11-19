-- 10-hardening.sql  Peacock Paints. Run in Supabase SQL editor AFTER 01-09. Safe to re-run.
-- Adds: size limits on free-form JSON, and a per-IP rate limit on public inserts (the real protection against
-- someone posting straight to the REST API and bypassing the website's honeypot).

-- 1) Size caps on JSON columns (stops huge payloads). NOT VALID = existing rows are not re-checked.
do $$ begin
  begin alter table public.quote_requests add constraint quote_customer_size check (pg_column_size(customer) < 4000) not valid; exception when duplicate_object or undefined_column then null; end;
  begin alter table public.quote_requests add constraint quote_items_size check (pg_column_size(items) < 20000) not valid; exception when duplicate_object or undefined_column then null; end;
  begin alter table public.enquiries add constraint enquiry_details_size check (pg_column_size(details) < 8000) not valid; exception when duplicate_object or undefined_column then null; end;
end $$;

-- 2) Per-IP rate limit
create table if not exists private.rate_hits (ip text not null, tbl text not null, at timestamptz not null default now());
create index if not exists rate_hits_idx on private.rate_hits (ip, tbl, at);
revoke all on private.rate_hits from anon, authenticated;

create or replace function private.rate_limit() returns trigger
language plpgsql security definer set search_path = private, public as $fn$
declare v_ip text; v_lim int := tg_argv[0]::int; v_n int;
begin
  begin
    v_ip := trim(split_part(coalesce((current_setting('request.headers', true)::json)->>'x-forwarded-for', 'unknown'), ',', 1));
  exception when others then v_ip := 'unknown';
  end;
  if v_ip = '' then v_ip := 'unknown'; end if;
  delete from private.rate_hits where at < now() - interval '1 day';
  select count(*) into v_n from private.rate_hits h where h.ip = v_ip and h.tbl = tg_table_name and h.at > now() - interval '1 hour';
  if v_n >= v_lim then
    raise exception 'Too many submissions, please try again later' using errcode = 'P0001';
  end if;
  insert into private.rate_hits (ip, tbl) values (v_ip, tg_table_name);
  return new;
end $fn$;

-- Limits per IP per hour. Staff using the dashboard are not affected (they do not insert into these tables).
drop trigger if exists rl_quotes on public.quote_requests;
create trigger rl_quotes before insert on public.quote_requests for each row execute function private.rate_limit(20);
drop trigger if exists rl_enquiries on public.enquiries;
create trigger rl_enquiries before insert on public.enquiries for each row execute function private.rate_limit(20);
drop trigger if exists rl_subscribers on public.subscribers;
create trigger rl_subscribers before insert on public.subscribers for each row execute function private.rate_limit(10);
drop trigger if exists rl_feedback on public.feedback;
create trigger rl_feedback before insert on public.feedback for each row execute function private.rate_limit(10);
drop trigger if exists rl_dealers on public.dealer_applications;
create trigger rl_dealers before insert on public.dealer_applications for each row execute function private.rate_limit(5);
drop trigger if exists rl_pros on public.professional_requests;
create trigger rl_pros before insert on public.professional_requests for each row execute function private.rate_limit(10);

-- Check: should list six rl_* triggers.
select event_object_table, trigger_name from information_schema.triggers where trigger_name like 'rl\_%' order by 1;
