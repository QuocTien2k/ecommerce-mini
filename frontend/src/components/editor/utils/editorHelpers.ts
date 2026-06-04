import type { Editor } from "@tiptap/react";

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
