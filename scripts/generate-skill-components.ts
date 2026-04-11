#!/usr/bin/env -S deno run --allow-all
/**
 * Generate skills/dui/references/components.md from the component registry.
 *
 * The component registry (packages/docs/src/component-registry.ts) is the single
 * source of truth for component metadata. This script formats it into the compact
 * reference format used by the DUI skill.
 *
 * Run: deno run --allow-all scripts/generate-skill-components.ts
 * Also runs as part of: deno task generate
 */

import { resolve, join } from "jsr:@std/path@^1";
import { componentRegistry, type ComponentMeta } from "../packages/docs/src/component-registry.ts";

const ROOT = resolve(import.meta.dirname!, "..");
const OUTPUT = join(ROOT, "skills/dui/references/components.md");

/** Category groupings — maps tag names to sections. */
const CATEGORIES: { name: string; tags: string[] }[] = [
  {
    name: "Actions",
    tags: ["dui-button", "dui-link", "dui-toggle", "dui-toggle-group", "dui-toolbar"],
  },
  {
    name: "Forms",
    tags: [
      "dui-input", "dui-textarea", "dui-select", "dui-combobox",
      "dui-checkbox", "dui-checkbox-group", "dui-radio",
      "dui-switch", "dui-slider", "dui-number-field", "dui-dropzone",
    ],
  },
  {
    name: "Data Display",
    tags: [
      "dui-badge", "dui-avatar", "dui-calendar", "dui-data-table",
      "dui-progress", "dui-spinner", "dui-separator", "dui-trunc",
    ],
  },
  {
    name: "Overlays",
    tags: [
      "dui-dialog", "dui-alert-dialog", "dui-popover", "dui-tooltip",
      "dui-menu", "dui-menubar", "dui-preview-card", "dui-command",
    ],
  },
  {
    name: "Disclosure",
    tags: ["dui-accordion", "dui-collapsible", "dui-tabs"],
  },
  {
    name: "Navigation",
    tags: ["dui-breadcrumb", "dui-sidebar-provider"],
  },
  {
    name: "Layout",
    tags: [
      "dui-hstack", "dui-vstack", "dui-center", "dui-page-inset",
      "dui-scroll-area", "dui-portal",
    ],
  },
  {
    name: "Utility",
    tags: ["dui-icon"],
  },
];

/** Build a lookup from tag name to ComponentMeta. */
const byTag = new Map<string, ComponentMeta>();
for (const c of componentRegistry) {
  byTag.set(c.tagName, c);
}

/** Get all sub-components (children) of a parent tag. */
function getChildren(parentTag: string): ComponentMeta[] {
  return componentRegistry.filter((c) => c.parent === parentTag);
}

/** Format properties as a compact string. Merges component props + theme attributes. */
function formatProperties(c: ComponentMeta): string {
  const parts: string[] = [];

  // Component's own reactive properties
  for (const p of c.properties) {
    parts.push(`\`${p.name}\` (${p.type})`);
  }

  // Theme attributes (variant, appearance, size) — these aren't in properties
  if (c.themeAttributes) {
    for (const ta of c.themeAttributes) {
      // Skip if already covered by a property with the same name
      if (c.properties.some((p) => p.name === ta.name)) continue;
      parts.push(`\`${ta.name}\` (${ta.values})`);
    }
  }

  return parts.length > 0 ? parts.join(", ") : "—";
}

/** Format slots as a compact string. */
function formatSlots(c: ComponentMeta): string {
  if (c.slots.length === 0) return "—";
  return c.slots
    .map((s) => s.name === "default" ? `default${s.description ? ` (${s.description})` : ""}` : `${s.name}${s.description ? ` (${s.description})` : ""}`)
    .join(", ");
}

/** Format CSS parts. */
function formatParts(c: ComponentMeta): string {
  if (!c.cssParts || c.cssParts.length === 0) return "`root`";
  return c.cssParts.map((p) => `\`${p.name}\``).join(", ");
}

/** Format CSS custom properties (tokens). Merges cssProperties + themeCssProperties. */
function formatTokens(c: ComponentMeta): string | null {
  const tokens: string[] = [];
  for (const p of c.cssProperties) tokens.push(`\`${p.name}\``);
  if (c.themeCssProperties) {
    for (const p of c.themeCssProperties) {
      if (!tokens.includes(`\`${p.name}\``)) tokens.push(`\`${p.name}\``);
    }
  }
  return tokens.length > 0 ? tokens.join(", ") : null;
}

/** Format events. */
function formatEvents(c: ComponentMeta): string | null {
  if (c.events.length === 0) return null;
  return c.events
    .map((e) => `\`${e.name}\`${e.detail ? ` (${e.detail})` : ""}`)
    .join(", ");
}

/** Render a single component entry. */
function renderComponent(c: ComponentMeta, isSubElement = false): string {
  const lines: string[] = [];

  if (!isSubElement) {
    lines.push(`### ${c.tagName}`);
  }

  lines.push(`**Properties:** ${formatProperties(c)}`);

  const events = formatEvents(c);
  if (events) lines.push(`**Events:** ${events}`);

  lines.push(`**Slots:** ${formatSlots(c)}`);
  lines.push(`**Parts:** ${formatParts(c)}`);

  const tokens = formatTokens(c);
  if (tokens) lines.push(`**Tokens:** ${tokens}`);

  // Render sub-elements
  const children = getChildren(c.tagName);
  if (children.length > 0) {
    for (const child of children) {
      const childProps = formatProperties(child);
      const childSlots = formatSlots(child);
      const childParts = formatParts(child);
      const childTokens = formatTokens(child);
      const childEvents = formatEvents(child);

      let line = `**Sub-elements:** \`${child.tagName}\``;
      if (childProps !== "—") line += ` — ${childProps}`;
      if (childEvents) line += `; Events: ${childEvents}`;
      line += `; Slots: ${childSlots}`;
      line += `; Parts: ${childParts}`;
      if (childTokens) line += `; Tokens: ${childTokens}`;

      lines.push(line);
    }
  }

  return lines.join("\n");
}

/** Count unique component families (top-level, no parent). */
function countFamilies(): number {
  return componentRegistry.filter((c) => !c.parent).length;
}

/** Count total elements. */
function countTotal(): number {
  return componentRegistry.length;
}

// --- Generate ---

const lines: string[] = [
  "<!-- Auto-generated from component-registry.ts — do not edit manually. -->",
  `<!-- Run: deno task generate -->`,
  "",
  "# DUI Component Reference",
  "",
  `All ${countFamilies()} component families, ${countTotal()}+ elements. Every component exposes \`::part(root)\` for CSS access beyond tokens.`,
  "",
  "When the inspector is available, prefer `__dui_inspect().catalog` for the ground-truth property schemas — this file is a static snapshot.",
];

for (const category of CATEGORIES) {
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`## ${category.name}`);

  for (const tag of category.tags) {
    const comp = byTag.get(tag);
    if (!comp) {
      console.warn(`⚠️  Tag "${tag}" not found in component registry`);
      continue;
    }
    lines.push("");
    lines.push(renderComponent(comp));
  }
}

// Global design tokens section
lines.push("");
lines.push("---");
lines.push("");
lines.push("## Global design tokens");
lines.push("");
lines.push("These are set on `:root` by the theme and affect all components:");
lines.push("");
lines.push("**Colors:**");
lines.push("`--color-bg`, `--color-fg`, `--color-primary`, `--color-surface`, `--color-border`, `--color-muted-fg`, `--color-danger`, `--color-success`, `--color-warning`");
lines.push("");
lines.push("**Spacing:**");
lines.push("`--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`");
lines.push("");
lines.push("**Radii:**");
lines.push("`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`");
lines.push("");
lines.push("**Typography:**");
lines.push("`--font-sans`, `--font-mono`, `--text-base`, `--text-sm`, `--text-lg`, `--text-xl`, `--font-weight-normal`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`, `--leading-normal`, `--leading-tight`");
lines.push("");
lines.push("**Shadows:**");
lines.push("`--shadow-sm`, `--shadow-md`, `--shadow-lg`");
lines.push("");
lines.push("**Focus:**");
lines.push("`--focus-ring-color`, `--focus-ring-width`, `--focus-ring-offset`");
lines.push("");
lines.push("**Transitions:**");
lines.push("`--transition-fast`, `--transition-normal`, `--transition-slow`");
lines.push("");

const output = lines.join("\n");
await Deno.writeTextFile(OUTPUT, output);

console.log(`✅ Generated ${OUTPUT}`);
console.log(`   ${countFamilies()} families, ${countTotal()} total elements`);
