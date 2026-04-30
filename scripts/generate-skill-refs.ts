#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Generate skill reference files from the component registry.
 *
 * Produces:
 *   skills/dui/references/components.md — Compact component catalog
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
 * Compact renderer — one block per family, key info only.
 * Tokens and parts are discoverable via the inspector.
 * ═══════════════════════════════════════════════════════════════════ */

function renderCompact(comp: ComponentMeta, subs: ComponentMeta[]): string {
  const lines: string[] = [];

  // Header: tag + import
  lines.push(`### ${comp.tagName} \`${comp.importPath}\``);
  lines.push(comp.description);

  // Sub-components (one line)
  if (subs.length > 0) {
    lines.push(`**Sub-components:** ${subs.map((s) => `\`${s.tagName}\``).join(", ")}`);
  }

  // Theme attributes (the values agents set in HTML)
  if (comp.themeAttributes && comp.themeAttributes.length > 0) {
    const attrs = comp.themeAttributes.map((a) => `\`${a.name}\` (${a.values})`);
    lines.push(`**Theme:** ${attrs.join(" · ")}`);
  }

  // Key properties — just names, no types/defaults (agents use inspector for details)
  const allProps = comp.properties;
  // Collect sub-component props that are noteworthy (skip obvious ones like disabled, value)
  const subPropLines: string[] = [];
  for (const sub of subs) {
    const interesting = sub.properties.filter(
      (p) => !["disabled", "value"].includes(p.name) && !comp.properties.some((cp) => cp.name === p.name),
    );
    if (interesting.length > 0) {
      const shortTag = sub.tagName.replace(comp.tagName + "-", "");
      subPropLines.push(`${shortTag}: ${interesting.map((p) => `\`${p.name}\``).join(", ")}`);
    }
  }

  if (allProps.length > 0 || subPropLines.length > 0) {
    const mainProps = allProps.map((p) => `\`${p.name}\``).join(", ");
    const parts = [];
    if (mainProps) parts.push(mainProps);
    if (subPropLines.length > 0) parts.push(subPropLines.join(" · "));
    lines.push(`**Props:** ${parts.join(" · ")}`);
  }

  // Events — include sub-component events too
  const allEvents = [...comp.events];
  for (const sub of subs) {
    for (const e of sub.events) {
      if (!allEvents.some((ae) => ae.name === e.name)) {
        allEvents.push(e);
      }
    }
  }
  if (allEvents.length > 0) {
    const evts = allEvents.map((e) => {
      const detail = e.detail ? ` → \`${e.detail}\`` : "";
      return `\`${e.name}\`${detail}`;
    });
    lines.push(`**Events:** ${evts.join(", ")}`);
  }

  // Slots — include key sub-component slots (especially required ones like dialog title)
  const mainSlots = comp.slots.filter((s) => s.name !== "default" || comp.slots.length === 1);
  const subSlots: string[] = [];
  for (const sub of subs) {
    const notable = sub.slots.filter(
      (s) => s.name !== "default" && !mainSlots.some((ms) => ms.name === s.name),
    );
    for (const s of notable) {
      const shortTag = sub.tagName.replace(comp.tagName + "-", "");
      subSlots.push(`\`${s.name}\` (${shortTag}: ${s.description})`);
    }
  }

  const allSlotParts = [
    ...mainSlots.map((s) => `\`${s.name}\` (${s.description})`),
    ...subSlots,
  ];
  if (allSlotParts.length > 0) {
    lines.push(`**Slots:** ${allSlotParts.join(", ")}`);
  }

  return lines.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════
 * Generate the compact components.md
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
  parts.push(`Compact catalog of all ${topLevel.length} component families. Use the inspector (\`__dui_inspect('dui-button')\`) for full token, part, and property details. Every component exposes \`::part(root)\` for CSS access beyond tokens.`);
  parts.push("");
  parts.push("---");

  for (const group of NAV_GROUPS) {
    parts.push("");
    parts.push(`## ${group.label}`);

    for (const tag of group.tags) {
      const comp = componentRegistry.find((c) => c.tagName === tag);
      if (!comp) continue;

      const subs = subComponents.filter((s) => s.parent === tag);
      parts.push("");
      parts.push(renderCompact(comp, subs));
    }
  }

  // Any components not in NAV_GROUPS (catch stragglers)
  const allGroupedTags = new Set(NAV_GROUPS.flatMap((g) => g.tags));
  const ungrouped = topLevel.filter((c) => !allGroupedTags.has(c.tagName));
  if (ungrouped.length > 0) {
    parts.push("");
    parts.push("## Other");
    for (const comp of ungrouped) {
      const subs = subComponents.filter((s) => s.parent === comp.tagName);
      parts.push("");
      parts.push(renderCompact(comp, subs));
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
  const lineCount = md.split("\n").length;
  console.log(`✅ Generated ${outPath} (${md.length} bytes, ${lineCount} lines, ${componentRegistry.filter((c) => !c.parent).length} families)`);
}
