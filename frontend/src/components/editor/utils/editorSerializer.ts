import type { Editor, JSONContent } from "@tiptap/react";

export type EditorOutputFormat = "html" | "json";

export type EditorOutput = {
  html: string;
  json: JSONContent;
  text: string;
};

export function serializeEditorContent(
  editor: Editor,
  format: EditorOutputFormat = "html",
): string | EditorOutput {
  const output: EditorOutput = {
    html: editor.getHTML(),
    json: editor.getJSON(),
    text: editor.getText(),
  };

  switch (format) {
    case "json":
      return output;
    case "html":
    default:
      return output.html;
  }
}
