/**
 * File Generator — Produce tokens.css content with overrides applied
 *
 * Outputs plain CSS (not Lit TypeScript) with :root,
 * :root:not([data-theme="dark"]), and :root[data-theme="dark"] blocks.
 */

import { type TokenDef, type TokenRegistry, overrideKey } from "./token-parser.ts";

/**
 * Generate a complete tokens.css file with overrides applied.
 */
export const generateTokensCSS = (
  registry: TokenRegistry,
  overrides: Record<string, string>,
): string => {
  // Collect tokens by their selector context
  const sharedDecls: string[] = [];
  const lightDecls: string[] = [];
  const darkDecls: string[] = [];

  for (const [_category, tokens] of registry) {
    for (const t of tokens) {
      const value = overrides[overrideKey(t.name, t.theme)] ?? t.value;
      const comment = t.comment ? ` /* ${t.comment} */` : "";
      const decl = `  ${t.name}: ${value};${comment}`;

      if (t.theme === "light") lightDecls.push(decl);
      else if (t.theme === "dark") darkDecls.push(decl);
      else sharedDecls.push(decl);
    }
  }

  const parts: string[] = [];

  if (sharedDecls.length > 0) {
    parts.push(`:root {\n${sharedDecls.join("\n")}\n}`);
  }

  if (lightDecls.length > 0) {
    parts.push(`:root:not([data-theme="dark"]) {\n${lightDecls.join("\n")}\n}`);
  }

  if (darkDecls.length > 0) {
    parts.push(`:root[data-theme="dark"] {\n${darkDecls.join("\n")}\n}`);
  }

  return parts.join("\n\n") + "\n";
};
