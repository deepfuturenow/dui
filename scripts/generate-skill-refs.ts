#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Generate skill reference files from the component registry.
 *
 * Produces:
 *   skills/dui/references/components.md — Full component catalog
 *
 * Run manually:
 *   deno task gen:skill-refs
 *
 * Also runs automatically on `deno task dev` (via serve.ts).
 */

import { componentRegistry, type ComponentMeta } from "../packages/docs/src/component-registry.ts";

/* ═══════════════════════════════════════════════════════════════════
 * Group components by category (matches the registry order/grouping)
 * ═══════════════════════════════════════════════════════════════════ */

interface NavGroup {
  label: string;
  tags: string[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Actions",
    tags: ["dui-button", "dui-toolbar", "dui-split-button", "dui-toggle", "dui-toggle-group"],
  },
  {
    label: "Data Entry",
    tags: [
      "dui-input", "dui-textarea", "dui-select", "dui-combobox", "dui-checkbox",
      "dui-radio-group", "dui-switch", "dui-slider", "dui-number-field", "dui-stepper",
      "dui-dropzone", "dui-field", "dui-fieldset",
    ],
  },
  {
    label: "Data Display",
    tags: ["dui-data-table", "dui-badge", "dui-avatar", "dui-calendar", "dui-progress", "dui-spinner"],
  },
  {
    label: "Overlays",
    tags: [
      "dui-dialog", "dui-alert-dialog", "dui-popover", "dui-tooltip",
      "dui-menu", "dui-menubar", "dui-command", "dui-preview-card",
    ],
  },
  {
    label: "Navigation",
    tags: ["dui-sidebar-provider", "dui-breadcrumb", "dui-tabs"],
  },
  {
    label: "Disclosure",
    tags: ["dui-accordion", "dui-collapsible"],
  },
  {
    label: "Content",
    tags: ["dui-card", "dui-card-grid", "dui-scroll-area", "dui-separator"],
  },
  {
    label: "Helpers",
    tags: ["dui-icon", "dui-portal", "dui-trunc", "dui-link"],
  },
];

/* ═══════════════════════════════════════════════════════════════════
 * Render a component entry
 * ═══════════════════════════════════════════════════════════════════ */

function renderComponent(c: ComponentMeta, isSubComponent: boolean): string {
  const lines: string[] = [];
  const heading = isSubComponent ? "####" : "###";

  lines.push(`${heading} ${c.tagName}`);
  lines.push(c.description);
  lines.push(`**Import:** \`${c.importPath}\``);

  // Properties
  if (c.properties.length > 0) {
    const props = c.properties.map((p) => {
      const def = p.default !== undefined ? `, default: ${p.default}` : "";
      return `\`${p.name}\` (${p.type}${def})`;
    });
    lines.push(`**Properties:** ${props.join(", ")}`);
  }

  // Theme attributes
  if (c.themeAttributes && c.themeAttributes.length > 0) {
    const attrs = c.themeAttributes.map((a) => `\`${a.name}\` (${a.values})`);
    lines.push(`**Theme attributes:** ${attrs.join(", ")}`);
  }

  // Events
  if (c.events.length > 0) {
    const evts = c.events.map((e) => {
      const detail = e.detail ? ` (${e.detail})` : "";
      return `\`${e.name}\`${detail}`;
    });
    lines.push(`**Events:** ${evts.join(", ")}`);
  }

  // Slots
  if (c.slots.length > 0) {
    const slots = c.slots.map((s) => `\`${s.name}\` (${s.description})`);
    lines.push(`**Slots:** ${slots.join(", ")}`);
  }

  // Parts
  if (c.cssParts && c.cssParts.length > 0) {
    const parts = c.cssParts.map((p) => `\`${p.name}\``);
    lines.push(`**Parts:** ${parts.join(", ")}`);
  } else {
    lines.push(`**Parts:** \`root\``);
  }

  // CSS custom properties (tokens)
  const allTokens = [...c.cssProperties, ...(c.themeCssProperties ?? [])];
  if (allTokens.length > 0) {
    const tokens = allTokens.map((t) => `\`${t.name}\``);
    lines.push(`**Tokens:** ${tokens.join(", ")}`);
  }

  return lines.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════
 * Generate the full components.md
 * ═══════════════════════════════════════════════════════════════════ */

export function generateComponentsMd(): string {
  const topLevel = componentRegistry.filter((c) => !c.parent);
  const subComponents = componentRegistry.filter((c) => c.parent);

  const parts: string[] = [];
  parts.push("<!-- Generated from component-registry.ts — do not edit manually. -->");
  parts.push(`<!-- Run: deno task gen:skill-refs -->`);
  parts.push("");
  parts.push("# DUI Component Reference");
  parts.push("");
  parts.push(`All ${topLevel.length} component families. Every component exposes \`::part(root)\` for CSS access beyond tokens.`);
  parts.push("");
  parts.push("---");

  for (const group of NAV_GROUPS) {
    parts.push("");
    parts.push(`## ${group.label}`);

    for (const tag of group.tags) {
      const comp = componentRegistry.find((c) => c.tagName === tag);
      if (!comp) continue;

      parts.push("");
      parts.push(renderComponent(comp, false));

      // Render sub-components
      const subs = subComponents.filter((s) => s.parent === tag);
      for (const sub of subs) {
        parts.push("");
        parts.push(renderComponent(sub, true));
      }
    }
  }

  // Any components not in NAV_GROUPS (catch stragglers)
  const allGroupedTags = new Set(NAV_GROUPS.flatMap((g) => g.tags));
  const ungrouped = topLevel.filter((c) => !allGroupedTags.has(c.tagName));
  if (ungrouped.length > 0) {
    parts.push("");
    parts.push("## Other");
    for (const comp of ungrouped) {
      parts.push("");
      parts.push(renderComponent(comp, false));
      const subs = subComponents.filter((s) => s.parent === comp.tagName);
      for (const sub of subs) {
        parts.push("");
        parts.push(renderComponent(sub, true));
      }
    }
  }

  parts.push("");
  return parts.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════
 * CLI
 * ═══════════════════════════════════════════════════════════════════ */

if (import.meta.main) {
  const outPath = "skills/dui/references/components.md";
  const md = generateComponentsMd();
  await Deno.writeTextFile(outPath, md);
  console.log(`✅ Generated ${outPath} (${md.length} bytes, ${componentRegistry.length} components)`);
}
