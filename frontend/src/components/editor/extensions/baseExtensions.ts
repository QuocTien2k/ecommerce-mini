import StarterKit from "@tiptap/starter-kit";

export const baseExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },

    blockquote: false,

    code: false,

    codeBlock: false,

    horizontalRule: false,
  }),
];
