#!/usr/bin/env -S deno run --allow-all
/**
 * Generate skills/dui/references/inspector.md from docs/inspector.md.
 *
 * docs/inspector.md is the single source of truth for inspector documentation.
 * This script extracts the agent-relevant subset (Console API + agent workflow)
 * and writes it in a compact format optimized for LLM consumption.
 *
 * Run: deno run --allow-all scripts/generate-skill-inspector.ts
 * Also runs as part of: deno task generate
 */

import { resolve, join } from "jsr:@std/path@^1";

const ROOT = resolve(import.meta.dirname!, "..");
const SOURCE = join(ROOT, "docs/inspector.md");
const OUTPUT = join(ROOT, "skills/dui/references/inspector.md");

const source = await Deno.readTextFile(SOURCE);

/**
 * Extract a section from the markdown by its ## heading.
 * Returns everything from the heading line (exclusive) to the next ## heading (exclusive),
 * trimmed of leading/trailing blank lines.
 */
function extractSection(md: string, heading: string): string | null {
  const pattern = new RegExp(`^## ${escapeRegex(heading)}\\s*$`, "m");
  const match = pattern.exec(md);
  if (!match) return null;

  const start = match.index + match[0].length;
  // Find the next ## heading (or end of file)
  const nextH2 = md.indexOf("\n## ", start);
  const end = nextH2 === -1 ? md.length : nextH2;

  return md.slice(start, end).replace(/^\n+/, "").replace(/\n+$/, "").replace(/\n---\s*$/, "");
}

/**
 * Extract a subsection (### heading) from within a section body.
 */
function extractSubSection(sectionBody: string, heading: string): string | null {
  const pattern = new RegExp(`^### ${escapeRegex(heading)}\\s*$`, "m");
  const match = pattern.exec(sectionBody);
  if (!match) return null;

  const start = match.index + match[0].length;
  const nextH3 = sectionBody.indexOf("\n### ", start);
  const end = nextH3 === -1 ? sectionBody.length : nextH3;

  return sectionBody.slice(start, end).replace(/^\n+/, "").replace(/\n+$/, "");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- Extract sections from docs/inspector.md ---

const consoleApi = extractSection(source, "Console API");
if (!consoleApi) {
  console.error("❌ Could not find '## Console API' section in docs/inspector.md");
  Deno.exit(1);
}

const workflows = extractSection(source, "Typical workflows");

// Extract just the agent workflow from the workflows section
let agentWorkflow: string | null = null;
if (workflows) {
  agentWorkflow = extractSubSection(workflows, "Agent prototyping a page");
}

// --- Build output ---

const lines: string[] = [
  "<!-- Auto-generated from docs/inspector.md — do not edit manually. -->",
  "<!-- Run: deno task generate -->",
  "",
  "# DUI Inspector API Reference",
  "",
  "The inspector is available when `@deepfuture/dui-inspector` (or `@dui/inspector`) is installed. It exposes console globals for programmatic access.",
  "",
  "## Installation check",
  "",
  "Look for `@deepfuture/dui-inspector` in `package.json` or `@dui/inspector` in the Deno import map. If the inspector import exists in the app's entry point (often gated behind `import.meta.env?.DEV`), it's available in the dev server's browser context.",
  "",
  "## Console API",
  "",
  consoleApi,
];

if (agentWorkflow) {
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Agent workflow");
  lines.push("");
  lines.push(agentWorkflow);
}

lines.push("");

const output = lines.join("\n");
await Deno.writeTextFile(OUTPUT, output);

console.log(`✅ Generated ${OUTPUT}`);
