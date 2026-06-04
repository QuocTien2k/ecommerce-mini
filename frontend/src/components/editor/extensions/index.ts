import { baseExtensions } from "./baseExtensions";
import { linkExtension } from "./linkExtension";
import { placeholderExtension } from "./placeholderExtension";
import { tableExtensions } from "./tableExtensions";

export const editorExtensions = [
  ...baseExtensions,

  ...tableExtensions,

  linkExtension,
  placeholderExtension,
];
