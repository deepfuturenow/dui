import { tokenSheet } from "@dui/theme-default/tokens";
import "./theme-editor/views/theme-editor-view.ts";

// Inject design tokens into :root so they cascade into shadow DOM
if (!document.adoptedStyleSheets.includes(tokenSheet)) {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, tokenSheet];
}
