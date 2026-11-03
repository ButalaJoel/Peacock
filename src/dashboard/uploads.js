import { supabase } from "../lib/supabase.js";

// Size after shrinking so the longest side is at most `max` (never enlarges).
export function fitSize(w, h, max) {
  const scale = Math.min(1, max / Math.max(w, h));
  return { w: Math.max(1, Math.round(w * scale)), h: Math.max(1, Math.round(h * scale)) };
}

// Shrinks a photo to a web-sized JPEG in the browser BEFORE upload (a 6 MB phone photo becomes a few hundred KB).
export async function compressImage(file, max = 1800, quality = 0.82) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Please use a JPG, PNG or WebP photo.");
  const bmp = await createImageBitmap(file);
  const { w, h } = fitSize(bmp.width, bmp.height, max);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  if (bmp.close) bmp.close();
  const blob = await new Promise(res => c.toBlob(res, "image/jpeg", quality));
  if (!blob) throw new Error("That image could not be processed.");
  return blob;
}

const stamp = () => Date.now() + "-" + Math.random().toString(36).slice(2, 8);

// Compresses, uploads to the public "media" storage and returns the public web address.
export async function uploadImage(file, folder) {
  const blob = await compressImage(file);
  const path = folder + "/" + stamp() + ".jpg";
  const { error } = await supabase.storage.from("media").upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export const MAX_PDF_MB = 50;

// Uploads a PDF (newsletter, brochure) as it is and returns the public web address.
export async function uploadPdf(file, folder) {
  if (file.type !== "application/pdf") throw new Error("Please choose a PDF file.");
  if (file.size > MAX_PDF_MB * 1024 * 1024) throw new Error("That PDF is larger than " + MAX_PDF_MB + " MB. Please compress it first.");
  const path = folder + "/" + stamp() + ".pdf";
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: "application/pdf", cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
