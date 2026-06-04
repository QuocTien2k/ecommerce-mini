import { useEffect } from "react";
import { useEditor as useTipTapEditor } from "@tiptap/react";
import { editorExtensions } from "../extensions";

type UseEditorParams = {
  value?: string;
  onChange?: (value: string) => void;
};

export function useEditor({ value, onChange }: UseEditorParams) {
  const editor = useTipTapEditor({
    extensions: editorExtensions,

    content: value || "",

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "min-h-[240px] p-4 outline-none prose prose-sm max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  /**
   * Sync external value -> editor
   * phục vụ reset form, setValue,...
   */
  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();

    if (currentHtml === (value || "")) {
      return;
    }

    editor.commands.setContent(value || "", {
      emitUpdate: false,
    });
  }, [editor, value]);

  return editor;
}
