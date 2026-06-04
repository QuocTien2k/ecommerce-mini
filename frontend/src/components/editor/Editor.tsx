import { EditorContent } from "./EditorContent";
import { useEditor } from "./hooks/useEditor";
import { EditorToolbar } from "./toolbar/EditorToolbar";

type EditorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export function Editor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    value,
    onChange,
  });

  return (
    <>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}
