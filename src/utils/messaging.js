// Helpers for forms that hand a message to WhatsApp or the visitor's email app.
// Nothing is stored on a server: the visitor presses send in WhatsApp or their email app.
export const makeReference = prefix => {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + "-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + rand;
};
export const whatsappReady = number => /^\d{8,15}$/.test(number || "");
export const whatsappUrl = (number, text) => "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
export const mailtoUrl = (email, subject, text) => "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
