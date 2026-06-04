import Link from "@tiptap/extension-link";

export const linkExtension = Link.configure({
  openOnClick: false,

  autolink: true,

  linkOnPaste: true,

  HTMLAttributes: {
    target: "_blank",
    rel: "noopener noreferrer",
  },
});
