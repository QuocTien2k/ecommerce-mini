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
  Link as LinkIcon,
  Unlink,
  UnderlineIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { ToolbarButton } from "./ToolbarButton";
import Underline from "@tiptap/extension-underline";

type Props = {
  editor: Editor | null;
};
export const underlineExtension = Underline;
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

      {/* Bold */}
      <ToolbarButton
        active={editor.isActive("bold")}
        icon={<Bold size={16} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      {/* Italic */}
      <ToolbarButton
        active={editor.isActive("italic")}
        icon={<Italic size={16} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      {/* Underline */}
      <ToolbarButton
        active={editor.isActive("underline")}
        icon={<UnderlineIcon size={16} />}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
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

      {/* Link */}
      <ToolbarButton
        active={editor.isActive("link")}
        icon={<LinkIcon size={16} />}
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;

          const url = window.prompt("Nhập URL", previousUrl || "https://");

          if (!url) return;

          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      />

      {/* Remove Link */}
      <ToolbarButton
        icon={<Unlink size={16} />}
        onClick={() => {
          editor.chain().focus().unsetLink().run();
        }}
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
