#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Generate packages/docs/static/llms.txt from the component registry.
 *
 * Kept standalone (like generate-skill-refs.ts) so llms.txt can be regenerated
 * without starting the docs dev server. serve.ts imports generateLlmsTxt() from
 * here and writes the file on `deno task dev` / `build:docs`.
 *
 * Run manually:
 *   deno task gen:llms
 */

import { componentRegistry } from "../packages/docs/src/component-registry.ts";

// Generate llms.txt from component registry
export function generateLlmsTxt(): string {
  const lines: string[] = [
    "# DUI — Unstyled Lit Component Library",
    "",
    "> Unstyled web components + composable themes. Components provide structure",
    "> and behavior; themes provide aesthetics.",
    "",
    "## Getting Started",
    "",
    "Install: (Deno workspace package)",
    'Import: import "@dui/components/button"; // self-registers',
    'Or: import { DuiButton } from "@dui/components/button"; // also self-registers',
    "",
    "## Styling Model",
    "",
    "DUI uses a two-layer styling approach:",
    "",
    "### Layer 1: CSS Variables",
    "Each component exposes CSS custom properties for values that variants and sizes toggle.",
    "Variables cascade from ancestor elements, so a parent can theme all descendant components.",
    "The theme uses `background` (shorthand), so variables accept gradients and images, not just colors.",
    "",
    "```css",
    "/* Override button colors */",
    "dui-button {",
    "  --button-bg: linear-gradient(135deg, pink, purple);",
    "  --button-fg: white;",
    "}",
    "",
    "/* Ancestor cascading — all buttons inside .card inherit this */",
    ".card {",
    "  --button-bg: var(--accent);",
    "}",
    "```",
    "",
    "### Layer 2: ::part(root)",
    "For any CSS property not covered by variables — filters, transforms, shadows, clip-paths,",
    "backdrop-filter, blend modes — use ::part(root) on the component. Every component exposes",
    "at least a `root` part. Complex components expose additional parts (e.g., `track`, `thumb`).",
    "",
    "```css",
    "/* Frosted glass */",
    "dui-button::part(root) {",
    "  backdrop-filter: blur(12px) saturate(1.8);",
    "}",
    "",
    "/* Glow shadow */",
    "dui-button::part(root) {",
    "  box-shadow: 0 0 20px oklch(0.7 0.2 280 / 0.4);",
    "}",
    "",
    "/* Bouncy press */",
    "dui-button::part(root):hover { transform: translateY(-1px); }",
    "dui-button::part(root):active { transform: scale(0.97); }",
    "```",
    "",
    "Components include broad transition-property lists (background, box-shadow, filter,",
    "transform, border-color) so ::part() overrides animate smoothly.",
    "",
    "## Theme Configuration",
    "",
    "DUI ships blue defaults. To apply your brand colors, use `applyTheme()` after importing",
    "any component. It appends an adopted stylesheet in the correct cascade position.",
    "",
    "```typescript",
    'import { applyTheme } from "@deepfuture/dui-components/theme";',
    "",
    "applyTheme({",
    "  light: {",
    '    background:  "oklch(0.97 0.00 0)",',
    '    foreground:  "oklch(0.15 0.00 0)",',
    '    accent:      "oklch(0.55 0.25 160)",   // your brand color',
    '    destructive: "oklch(0.55 0.22 25)",',
    "  },",
    "  dark: {",
    '    accent:      "oklch(0.75 0.18 160)",',
    '    destructive: "oklch(0.70 0.18 25)",',
    "  },",
    '  fonts: { sans: "Inter", mono: "Geist Mono" },',
    '  radius: "0.5rem",',
    "});",
    "```",
    "",
    "The 4 color primitives are `background`, `foreground`, `accent`, `destructive`.",
    "All derived tokens (surfaces, borders, text tiers, accent-subtle, etc.) update automatically.",
    "Omit `dark` to auto-derive dark mode from light values.",
    "If the project has a DESIGN.md, extract the OKLCH values and pass them to `applyTheme()`.",
    "",
    "## Components",
    "",
  ];

  for (const c of componentRegistry) {
    lines.push(`### ${c.name}`);
    lines.push(`- Tag: \`<${c.tagName}>\``);
    lines.push(`- Import: \`${c.importPath}\``);
    lines.push(`- Description: ${c.description}`);

    if (c.properties.length > 0) {
      const props = c.properties
        .map((p) => `${p.name} (${p.type}${p.default ? `, ${p.default}` : ""})`)
        .join(", ");
      lines.push(`- Properties: ${props}`);
    }

    if (c.events.length > 0) {
      const events = c.events
        .map((e) => `${e.name}${e.detail ? ` (${e.detail})` : ""}`)
        .join(", ");
      lines.push(`- Events: ${events}`);
    } else {
      lines.push("- Events: none");
    }

    if (c.slots.length > 0) {
      const slots = c.slots
        .map((s) => `${s.name} (${s.description})`)
        .join(", ");
      lines.push(`- Slots: ${slots}`);
    }

    if (c.cssProperties.length > 0) {
      const cssProps = c.cssProperties
        .map((p) => `${p.name} (${p.description})`)
        .join(", ");
      lines.push(`- CSS Variables: ${cssProps}`);
    }

    if (c.cssParts && c.cssParts.length > 0) {
      const parts = c.cssParts
        .map((p) => `${p.name} (${p.description})`)
        .join(", ");
      lines.push(`- CSS Parts: ${parts}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

if (import.meta.main) {
  const outPath = "packages/docs/static/llms.txt";
  const txt = generateLlmsTxt();
  await Deno.writeTextFile(outPath, txt);
  console.log(
    `✅ Generated ${outPath} (${txt.length} bytes, ${componentRegistry.length} components)`,
  );
}
