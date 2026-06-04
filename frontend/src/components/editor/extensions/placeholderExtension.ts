import Placeholder from "@tiptap/extension-placeholder";

export const placeholderExtension = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return "Tiêu đề...";
    }

    return "Nhập mô tả sản phẩm...";
  },
});
