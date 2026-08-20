/**
 * Side-effect module — injects DUI's design tokens into the document.
 *
 * The ejected components are copies of `@dui/components`, but the *tokens*
 * they reference (`--space-*`, `--text-*`, `--border`, …) are not: they stay a
 * dependency, the same way a shadcn project keeps Tailwind's theme layer while
 * owning `button.tsx`. `@dui/components` ships them as a standalone export, so
 * a consumer can take the tokens without taking a single component.
 */
import { tokenSheet } from "@dui/components/tokens";
import { proseSheet } from "@dui/components/prose";

for (const sheet of [tokenSheet, proseSheet]) {
  if (sheet && !document.adoptedStyleSheets.includes(sheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
}
