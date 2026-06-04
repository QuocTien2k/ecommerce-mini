import DOMPurify, { type Config } from "dompurify";
import type { EditorOutput } from "./editorSerializer";

const SANITIZE_CONFIG: Config = {
  USE_PROFILES: { html: true },

  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "code",
    "pre",
    "h1",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],

  ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class"],

  FORBID_TAGS: ["script", "iframe", "object", "embed"],
};

export function sanitizeHTML(html: string): string {
  const clean = DOMPurify.sanitize(html, SANITIZE_CONFIG);

  return clean as string;
}

export function sanitizeEditorOutput(output: EditorOutput): EditorOutput {
  return {
    html: sanitizeHTML(output.html),
    json: output.json,
    text: output.text,
  };
}
