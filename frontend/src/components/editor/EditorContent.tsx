import type { Editor } from "@tiptap/react";
import { EditorContent as TiptapEditorContent } from "@tiptap/react";

type EditorContentProps = {
  editor: Editor | null;
};

export function EditorContent({ editor }: EditorContentProps) {
  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden">
      <TiptapEditorContent editor={editor} className="editor-content" />
    </div>
  );
}
