import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Eraser,
  Link,
} from "lucide-react";

import type { Editor } from "@tiptap/react";
import { ToolbarButton } from "./ToolbarButton";

type Props = {
  editor: Editor | null;
};

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 border-b p-2">
      <ToolbarButton
        icon={<Undo2 size={16} />}
        onClick={() => editor.chain().focus().undo().run()}
      />

      <ToolbarButton
        icon={<Redo2 size={16} />}
        onClick={() => editor.chain().focus().redo().run()}
      />

      <ToolbarButton
        active={editor.isActive("bold")}
        icon={<Bold size={16} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <ToolbarButton
        active={editor.isActive("italic")}
        icon={<Italic size={16} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <ToolbarButton
        active={editor.isActive("heading", {
          level: 2,
        })}
        icon={<Heading2 size={16} />}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 2,
            })
            .run()
        }
      />

      <ToolbarButton
        active={editor.isActive("heading", {
          level: 3,
        })}
        icon={<Heading3 size={16} />}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 3,
            })
            .run()
        }
      />

      {/* Bullet List */}
      <ToolbarButton
        active={editor.isActive("bulletList")}
        icon={<List size={16} />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      {/* Ordered Lists */}
      <ToolbarButton
        active={editor.isActive("orderedList")}
        icon={<ListOrdered size={16} />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      {/* Clear Format */}
      <ToolbarButton
        icon={<Eraser size={16} />}
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      />
    </div>
  );
}
