/**
 * Side-effect module — injects design tokens and prose styles into the document.
 * Runs once on first import; subsequent imports are no-ops (ES module caching).
 */
import { tokenSheet } from "./tokens/tokens.ts";
import { proseSheet } from "./tokens/prose.ts";

for (const sheet of [tokenSheet, proseSheet]) {
  if (sheet && !document.adoptedStyleSheets.includes(sheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
}
