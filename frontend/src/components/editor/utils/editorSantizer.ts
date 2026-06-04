import DOMPurify from "dompurify";

export function sanitizeEditorHtml(html: string) {
  return DOMPurify.sanitize(html);
}
