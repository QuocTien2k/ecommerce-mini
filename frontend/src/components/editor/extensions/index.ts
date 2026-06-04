import { baseExtensions } from "./baseExtensions";
import { linkExtension } from "./linkExtension";
import { tableExtensions } from "./tableExtensions";

export const editorExtensions = [
  ...baseExtensions,

  ...tableExtensions,

  linkExtension,
];
