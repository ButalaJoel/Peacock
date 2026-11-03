// Spreadsheet export. Values starting with = + - @ get a leading apostrophe so a hostile signup cannot run a formula in Excel.
const cell = v => {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

export function toCsv(rows, columns) {
  const head = columns.map(c => cell(c[1])).join(",");
  const body = rows.map(r => columns.map(c => cell(typeof c[0] === "function" ? c[0](r) : r[c[0]])).join(","));
  return "﻿" + [head].concat(body).join("\r\n");
}

export function downloadCsv(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const when = iso => iso ? new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Kampala", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
