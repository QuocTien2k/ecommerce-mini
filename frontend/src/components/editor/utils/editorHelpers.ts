import type { Editor } from "@tiptap/react";

export function toggleBold(editor: Editor) {
  return editor.chain().focus().toggleBold().run();
}

export function toggleItalic(editor: Editor) {
  return editor.chain().focus().toggleItalic().run();
}

export function toggleHeading(editor: Editor, level: 1 | 2 | 3) {
  return editor.chain().focus().toggleHeading({ level }).run();
}

export function toggleUnderline(editor: Editor) {
  return editor.chain().focus().toggleUnderline().run();
}

export function toggleBulletList(editor: Editor) {
  return editor.chain().focus().toggleBulletList().run();
}

export function toggleOrderedList(editor: Editor) {
  return editor.chain().focus().toggleOrderedList().run();
}

export function setLink(editor: Editor, href: string) {
  return editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
}

export function removeLink(editor: Editor) {
  return editor.chain().focus().unsetLink().run();
}

export function clearFormatting(editor: Editor) {
  return editor.chain().focus().unsetAllMarks().clearNodes().run();
}

export function insertTable(editor: Editor) {
  editor
    .chain()
    .focus()
    .insertTable({
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    })
    .run();
}

export function addRow(editor: Editor) {
  editor.chain().focus().addRowAfter().run();
}

export function deleteRow(editor: Editor) {
  editor.chain().focus().deleteRow().run();
}

export function addColumn(editor: Editor) {
  editor.chain().focus().addColumnAfter().run();
}

export function deleteColumn(editor: Editor) {
  editor.chain().focus().deleteColumn().run();
}

export function deleteTable(editor: Editor) {
  editor.chain().focus().deleteTable().run();
}
