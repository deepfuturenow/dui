#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * DUI → Claude Design generator.
 *
 * Emits the design-sync upload layout for DUI, driven by the component registry
 * + the published CDN bundle. Components ship as REAL, self-registering `<dui-*>`
 * custom elements (raw-tag consumption — no React adapters); the agent writes the
 * tags directly and they render live. See SKILL.md.
 *
 * Output: .design-sync/ds-bundle/
 */
import { componentRegistry, type ComponentMeta } from "../../../packages/docs/src/component-registry.ts";
import { COMPONENTS, GROUP_ORDER, type Entry } from "./components.ts";
import { join, resolve } from "jsr:@std/path@^1";

const ROOT = resolve(import.meta.dirname!, "../../..");
const OUT = resolve(ROOT, ".design-sync/ds-bundle");
const CDN = resolve(ROOT, "dist/dui-cdn/dui.min.js");
const TOKENS = resolve(ROOT, "packages/components/src/tokens/tokens.css");
const FONTS_SRC = resolve(ROOT, ".design-sync/fonts-src"); // populated by fetch-fonts.ts

const byTag = new Map(componentRegistry.map((c) => [c.tagName, c]));
const meta = (tag: string): ComponentMeta => {
  const m = byTag.get(tag);
  if (!m) throw new Error(`No registry entry for ${tag}`);
  return m;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pascal = (tag: string) =>
  tag.replace(/^dui-/, "").split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");

async function write(rel: string, content: string | Uint8Array) {
  const path = join(OUT, rel);
  await Deno.mkdir(resolve(path, ".."), { recursive: true });
  if (typeof content === "string") await Deno.writeTextFile(path, content);
  else await Deno.writeFile(path, content);
}

/* ── .d.ts ─────────────────────────────────────────────────────────── */
function dts(e: Entry): string {
  const m = meta(e.tag);
  const name = pascal(e.tag);
  const lines: string[] = [];
  // theme attributes (variant/appearance/size) first — they carry the design language
  for (const ta of m.themeAttributes ?? [])
    lines.push(`  /** ${ta.description} */\n  ${camel(ta.name)}?: ${ta.values};`);
  for (const p of m.properties) {
    const opt = /undefined|\?|default/.test(p.type) || p.default !== undefined || !p.type.includes("[]") ? "?" : "";
    lines.push(`  /** ${p.description} */\n  ${camel(p.name)}${opt}: ${tsType(p.type)};`);
  }
  for (const ev of m.events)
    lines.push(`  /** ${ev.description} */\n  ${onName(ev.name)}?: (detail: ${ev.detail ?? "unknown"}, event: CustomEvent) => void;`);
  if ((m.slots ?? []).some((s) => s.name === "default")) lines.push(`  children?: React.ReactNode;`);
  const prelude = typePrelude(m);
  return `import * as React from 'react';\n\n` +
    `/**\n * ${name} — from @dui/components (${m.importPath}).\n` +
    ` * Raw custom element <${e.tag}>. Registered by the root _ds_bundle.js.\n */\n` +
    `export interface ${name}Props {\n${lines.join("\n")}\n}\n\n` +
    (prelude ? prelude + "\n" : "") +
    `/** The custom-element tag name — write <${e.tag}> directly in JSX. */\n` +
    `export declare const ${name}: '${e.tag}';\n`;
}

/** Known shapes for custom types referenced in prop/event types (from @dui/components). */
const KNOWN_TYPES: Record<string, string> = {
  SelectOption: `interface SelectOption { label: string; value: string; disabled?: boolean }`,
};
const BUILTIN = new Set([
  "React", "ReactNode", "Props", "CustomEvent", "Array", "Record", "Partial",
  "Promise", "HTMLElement", "Event", "Date", "Map", "Set",
]);
/** Emit definitions for any non-builtin PascalCase type names referenced by props/events. */
function typePrelude(m: ComponentMeta): string {
  const src = [
    ...m.properties.map((p) => p.type),
    ...m.events.map((e) => e.detail ?? ""),
  ].join(" ");
  const refs = new Set<string>();
  for (const id of src.match(/[A-Z][A-Za-z0-9]+/g) ?? []) if (!BUILTIN.has(id)) refs.add(id);
  return [...refs].map((r) => KNOWN_TYPES[r] ?? `type ${r} = unknown;`).join("\n");
}

const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const onName = (evt: string) => "on" + evt.replace(/^dui-/, "").split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
function tsType(t: string): string {
  return t.replace(/\s*\|\s*undefined/g, "");
}

/* ── .prompt.md ────────────────────────────────────────────────────── */
function promptMd(e: Entry): string {
  const m = meta(e.tag);
  const name = pascal(e.tag);
  const kws = [name.toLowerCase(), ...(e.keywords ?? [])].join(", ");
  const objProps = m.properties.filter((p) => /\[\]|\{/.test(p.type)).map((p) => p.name);
  const subs = componentRegistry.filter((c) => c.parent === e.tag).map((c) => `\`<${c.tagName}>\``);

  let md = `${name} from @dui/components — raw custom element \`<${e.tag}>\`, registered by the root \`_ds_bundle.js\` (import = ready; no React wrapper). ${m.description} Keywords: ${kws}.\n\n`;
  if (subs.length) md += `Composed with: ${subs.join(", ")}.\n\n`;

  md += `## Attributes / props\n\n\`\`\`ts\n`;
  for (const ta of m.themeAttributes ?? []) md += `${ta.name}?: ${ta.values};   // ${ta.description}\n`;
  for (const p of m.properties) md += `${p.name}?: ${tsType(p.type)};${p.default ? ` // default ${p.default}` : ""}\n`;
  md += `\`\`\`\n\n`;

  md += `## Example\n\n\`\`\`jsx\n${e.example ?? defaultExample(e)}\n\`\`\`\n`;

  if (objProps.length) {
    md += `\n## Setting object/array props (${objProps.join(", ")})\n\n` +
      `These are element **properties**, not string attributes. In JSX, set them via a ref + effect:\n\n` +
      `\`\`\`jsx\nconst ref = React.useRef(null);\n` +
      `React.useEffect(() => { if (ref.current) ref.current.${objProps[0]} = ${objProps[0] === "options" ? "myOptions" : "myData"}; }, []);\n` +
      `return <${e.tag} ref={ref} />;\n\`\`\`\n`;
  }
  return md;
}

function defaultExample(e: Entry): string {
  const m = meta(e.tag);
  const ta = m.themeAttributes?.find((t) => t.name === "variant");
  const attr = ta ? ` variant="${ta.values.match(/"([^"]+)"/)?.[1] ?? ""}"` : "";
  const hasChildren = (m.slots ?? []).some((s) => s.name === "default");
  return hasChildren ? `<${e.tag}${attr}>${e.label ?? m.name}</${e.tag}>` : `<${e.tag}${attr}></${e.tag}>`;
}

/* ── card (.html) ──────────────────────────────────────────────────── */
const CARD_CSS = `
  body { margin:0; padding: var(--space-8,2rem); font-family: var(--font-sans, system-ui, sans-serif); background: var(--background,#f7f7f7); color: var(--text-1,#111); }
  .dsc-eyebrow { font-family: var(--font-mono, monospace); font-size: var(--text-2xs,.625rem); text-transform: uppercase; letter-spacing:.12em; color: var(--text-3,#888); margin:0 0 var(--space-3,.75rem); }
  .dsc-sub { color: var(--text-2,#555); font-size: var(--text-sm,.875rem); margin:0 0 var(--space-6,1.5rem); max-width:46rem; }
  .dsc-demo { display:flex; gap: var(--space-3,.75rem); align-items:center; flex-wrap:wrap; }
  .dsc-demo.col { flex-direction:column; align-items:flex-start; }
`;

function cardHtml(e: Entry): string {
  const m = meta(e.tag);
  const [w, h] = (e.viewport ?? "1000x600").split("x");
  const demo = e.card ?? autoCard(e);
  return `<!doctype html>
<!-- @dsCard group="${e.group}" viewport="${w}x${h}" -->
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<title>DUI · ${m.name}</title>
<link rel="stylesheet" href="../../../styles.css">
<script src="../../../_ds_bundle.js"></script>
<style>${CARD_CSS}${e.cardCss ?? ""}</style>
</head>
<body>
  <div class="dsc-eyebrow">&lt;${e.tag}&gt;</div>
  <p class="dsc-sub">${esc(m.description)}</p>
  ${demo}
</body>
</html>
`;
}

/** Fallback card for components without a hand-authored demo: variant grid or a default instance. */
function autoCard(e: Entry): string {
  const m = meta(e.tag);
  const label = e.label ?? m.name;
  const variant = m.themeAttributes?.find((t) => t.name === "variant");
  const appearance = m.themeAttributes?.find((t) => t.name === "appearance");
  const hasChildren = (m.slots ?? []).some((s) => s.name === "default");
  const body = (attrs: string) => hasChildren ? `<${e.tag}${attrs}>${label}</${e.tag}>` : `<${e.tag}${attrs}></${e.tag}>`;
  if (variant && appearance) {
    const vs = [...variant.values.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    const as = [...appearance.values.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    const rows = as.map((a) =>
      `<div class="dsc-demo">${vs.map((v) => body(` variant="${v}" appearance="${a}"`)).join("")}</div>`).join("\n  ");
    return `<div class="dsc-demo col">\n  ${rows}\n</div>`;
  }
  if (variant) {
    const vs = [...variant.values.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    return `<div class="dsc-demo">${vs.map((v) => body(` variant="${v}"`)).join("")}</div>`;
  }
  return `<div class="dsc-demo">${body("")}</div>`;
}

/* ── shared files ──────────────────────────────────────────────────── */
async function emitShared(entries: Entry[]) {
  // _ds_bundle.js = CDN registration bundle + stamped header
  const cdn = await Deno.readTextFile(CDN);
  const header = {
    namespace: "DUI",
    components: entries.map((e) => ({ name: pascal(e.tag), sourcePath: `components/${e.group}/${pascal(e.tag)}/${pascal(e.tag)}.jsx` })),
    sourceHashes: {},
    inlinedExternals: [],
    builtBy: "dui-design-sync",
  };
  const hdr = `/* @ds-bundle: ${JSON.stringify(header).replace(/\*\//g, "*\\/")} */\n`;
  await write("_ds_bundle.js", hdr + cdn);

  await write("tokens/tokens.css", await Deno.readTextFile(TOKENS));

  // Fonts (optional) — copy .design-sync/fonts-src/ → fonts/ if fetch-fonts.ts has run.
  let fontsImport = "";
  try {
    const files = [...Deno.readDirSync(FONTS_SRC)].filter((f) => f.isFile);
    if (files.length) {
      for (const f of files) await write(`fonts/${f.name}`, await Deno.readFile(join(FONTS_SRC, f.name)));
      fontsImport = `@import "./fonts/fonts.css";\n`;
      console.log(`   fonts: ${files.length} file(s) → fonts/`);
    }
  } catch { /* no fonts-src — text renders with system fallbacks */ }

  await write(
    "styles.css",
    `/* DUI — single stylesheet entry. Component styling lives in shadow DOM and is\n * injected at runtime by _ds_bundle.js; only tokens (and fonts, when present)\n * need to be reachable here for the agent's own layout markup. */\n${fontsImport}@import "./tokens/tokens.css";\n`,
  );
  await write("_ds_needs_recompile", `{"by":"dui-design-sync"}\n`);
  await write("README.md", readme(entries));
}

function readme(entries: Entry[]): string {
  const groups = GROUP_ORDER.filter((g) => entries.some((e) => e.group === g));
  const list = groups.map((g) =>
    `- **${g}** — ${entries.filter((e) => e.group === g).map((e) => `\`<${e.tag}>\``).join(", ")}`).join("\n");
  return `# DUI Design System

Real, runnable [Lit](https://lit.dev) web components from **DUI** — not static recreations. Loading \`_ds_bundle.js\` registers every \`<dui-*>\` custom element and injects the design tokens. Components render with full shadow-DOM styling, real interaction, floating popups, and custom events.

## How to use — write the raw custom elements

DUI components are **custom elements**: write the \`<dui-*>\` tag directly in JSX. No wrapper, no import — the tag is registered as soon as \`_ds_bundle.js\` loads. String attributes map straight through:

\`\`\`jsx
<dui-button variant="primary">Save changes</dui-button>
<dui-badge variant="primary">Active</dui-badge>
<dui-input placeholder="Email"></dui-input>
\`\`\`

**Object / array props** (e.g. \`<dui-select>\` \`options\`, \`<dui-data-table>\` \`columns\`) are element *properties*, not string attributes — set them via a ref + effect:

\`\`\`jsx
const ref = React.useRef(null);
React.useEffect(() => { ref.current.options = myOptions; }, []);
return <dui-select ref={ref} placeholder="Pick one..." />;
\`\`\`

Listen to component events with \`addEventListener\` on a ref (e.g. \`value-change\`, \`open-change\`).

## Icons

DUI ships \`<dui-icon>\`, which renders whatever SVG you slot into it and inherits size/color from \`--icon-size\` / \`--icon-color\` (or the parent component's icon tokens). **Source icons from [Lucide](https://lucide.dev)** — its 24×24 stroke icons match DUI's visual style and are MIT-licensed. Paste the icon's SVG markup (\`stroke="currentColor"\`, \`fill="none"\`, no hardcoded colors) into the element:

\`\`\`jsx
<dui-icon style={{ '--icon-size': 'var(--space-5)' }}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
</dui-icon>
\`\`\`

Icons compose inside other components: a leading icon in \`<dui-button>\`, \`<dui-toggle slot="icon">\`, menu items, etc. Keep \`stroke="currentColor"\` so the icon takes the surrounding text/intent color. Prefer Lucide names the user asks for; if unsure which icon, pick the closest Lucide equivalent.

## Tokens

Design tokens are CSS custom properties on \`:root\` (\`tokens/tokens.css\`, imported by \`styles.css\`): \`--space-4\`, \`--accent\`, \`--text-2xl\`, \`--radius-md\`, \`--surface-1\`, etc. Use them for your own layout. Dark mode: set \`data-theme="dark"\` on \`<html>\`.

## Components

${list}

Each component's API is in its \`.d.ts\` and \`.prompt.md\`.
`;
}

/* ── main ──────────────────────────────────────────────────────────── */
async function main() {
  try { await Deno.remove(OUT, { recursive: true }); } catch { /* fresh */ }
  const entries = COMPONENTS;
  for (const e of entries) {
    const name = pascal(e.tag);
    const dir = `components/${e.group}/${name}`;
    await write(`${dir}/${name}.d.ts`, dts(e));
    await write(`${dir}/${name}.prompt.md`, promptMd(e));
    await write(`${dir}/${name}.jsx`, `// Raw-tag component — write <${e.tag}> directly in JSX (registered by _ds_bundle.js).\nexport const ${name} = '${e.tag}';\nexport default ${name};\n`);
    await write(`${dir}/${name}.html`, cardHtml(e));
  }
  await emitShared(entries);
  console.log(`✅ Generated ${entries.length} components → ${OUT}`);
  console.log(`   groups: ${[...new Set(entries.map((e) => e.group))].join(", ")}`);
}

main();
