// Spam trap. Every public form has a hidden "company_website" field (see components/common/Honeypot.jsx).
// Real visitors never see it, so never fill it in. Spam bots that fill every field give themselves away,
// and their submission is quietly dropped (the bot is told it worked).
export const looksLikeBot = () => {
  if (typeof document === "undefined") return false;
  return Array.from(document.querySelectorAll('input[name="company_website"]')).some(i => i.value.trim() !== "");
};
