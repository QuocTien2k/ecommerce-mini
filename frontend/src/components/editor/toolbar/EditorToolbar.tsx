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
  Rows3,
  Columns3,
  Trash2,
  Eraser,
  Link as LinkIcon,
  Unlink,
  UnderlineIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { ToolbarButton } from "./ToolbarButton";
import Underline from "@tiptap/extension-underline";
import {
  insertTable,
  addRow,
  deleteRow,
  addColumn,
  deleteColumn,
  deleteTable,
  clearFormatting,
  removeLink,
  setLink,
  toggleBold,
  toggleItalic,
  toggleBulletList,
  toggleOrderedList,
  toggleHeading,
  toggleUnderline,
} from "../utils/editorHelpers";

type Props = {
  editor: Editor | null;
};
export const underlineExtension = Underline;

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  const isTableActive = editor.isActive("table");

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
        onClick={() => toggleBold(editor)}
      />

      {/* Italic */}
      <ToolbarButton
        active={editor.isActive("italic")}
        icon={<Italic size={16} />}
        onClick={() => toggleItalic(editor)}
      />

      {/* Underline */}
      <ToolbarButton
        active={editor.isActive("underline")}
        icon={<UnderlineIcon size={16} />}
        onClick={() => toggleUnderline(editor)}
      />

      {/* Heading */}
      <ToolbarButton
        active={editor.isActive("heading", {
          level: 2,
        })}
        icon={<Heading2 size={16} />}
        onClick={() => toggleHeading(editor, 2)}
      />

      <ToolbarButton
        active={editor.isActive("heading", {
          level: 3,
        })}
        icon={<Heading3 size={14} />}
        onClick={() => toggleHeading(editor, 3)}
      />

      {/* Link */}
      <ToolbarButton
        active={editor.isActive("link")}
        icon={<LinkIcon size={16} />}
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;

          const url = window.prompt("Nhập URL", previousUrl || "https://");

          if (!url) return;

          setLink(editor, url);
        }}
      />

      {/* Remove Link */}
      <ToolbarButton
        icon={<Unlink size={16} />}
        onClick={() => removeLink(editor)}
      />

      {/* Bullet List */}
      <ToolbarButton
        active={editor.isActive("bulletList")}
        icon={<List size={16} />}
        onClick={() => toggleBulletList(editor)}
      />

      {/* Ordered Lists */}
      <ToolbarButton
        active={editor.isActive("orderedList")}
        icon={<ListOrdered size={16} />}
        onClick={() => toggleOrderedList(editor)}
      />

      {/* Insert Table */}
      <ToolbarButton
        icon={<Table size={16} />}
        onClick={() => insertTable(editor)}
      />

      {isTableActive && (
        <>
          {/* Add Row */}
          <ToolbarButton
            icon={<Rows3 size={16} />}
            onClick={() => addRow(editor)}
          />

          {/* Add Column */}
          <ToolbarButton
            icon={<Columns3 size={16} />}
            onClick={() => addColumn(editor)}
          />

          {/* Delete Row */}
          <ToolbarButton
            icon={<Rows3 size={16} />}
            onClick={() => deleteRow(editor)}
          />

          {/* Delete Column */}
          <ToolbarButton
            icon={<Columns3 size={16} />}
            onClick={() => deleteColumn(editor)}
          />

          {/* Delete Table */}
          <ToolbarButton
            icon={<Trash2 size={16} />}
            onClick={() => deleteTable(editor)}
          />
        </>
      )}

      {/* Clear Format */}
      <ToolbarButton
        icon={<Eraser size={16} />}
        onClick={() => clearFormatting(editor)}
      />
    </div>
  );
}
