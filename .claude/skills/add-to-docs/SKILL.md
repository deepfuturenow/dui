---
name: add-to-docs
description: Wire a component into the DUI docs dev server. Use when the user asks to add a component to the docs, demo page, or dev server, or says "add to docs", "show in docs", etc.
---

# Add to Docs

Wire a DUI component into the multi-page docs site with a dedicated page, registry entry, and sidebar navigation.

## Overview

The docs site (`packages/docs`) uses a shell with sidebar navigation, hash routing, and per-component pages. Adding a component touches 6 files.

### Architecture

```
packages/docs/
├── src/
│   ├── component-registry.ts    # Metadata: properties, events, slots, CSS props
│   ├── component-sources.ts     # Raw source imports for code viewer
│   ├── docs-app.ts              # Shell: sidebar nav + content area + route switch
│   ├── docs-router.ts           # Hash-based router
│   ├── index.ts                 # Entry point: imports + applyTheme
│   └── pages/
│       ├── page-utils.ts        # Shared styles + renderApiTable()
│       ├── docs-page-{name}.ts  # Per-component demo page
│       └── ...
├── serve.ts                     # Dev server + llms.txt generation
└── static/
    ├── index.html               # Just <docs-app>
    └── llms.txt                 # Auto-generated from registry at startup
```

### Files modified

| File | Change |
|------|--------|
| `src/component-registry.ts` | Add `ComponentMeta` entry |
| `src/component-sources.ts` | Add raw source import |
| `src/docs-app.ts` | Add route case in `#renderPage()` |
| `src/index.ts` | Import page component + component class + add to `applyTheme` |
| `src/pages/docs-page-{name}.ts` | **Create** — demo page |
| `serve.ts` | Add export entries to `workspacePackages` (if not already present) |

`llms.txt` regenerates automatically from the registry on server startup.

---

## Steps

### Step 1 — Read current state

Read these files to understand existing setup and patterns:

- `packages/docs/src/component-registry.ts`
- `packages/docs/src/component-sources.ts`
- `packages/docs/src/docs-app.ts`
- `packages/docs/src/index.ts`
- `packages/docs/serve.ts`
- An existing page for reference (e.g., `packages/docs/src/pages/docs-page-button.ts`)
- `packages/docs/src/pages/page-utils.ts`
- The component source (to understand its properties, variants, slots)

### Step 2 — Add to component registry

In `packages/docs/src/component-registry.ts`, add a `ComponentMeta` entry to the `componentRegistry` array:

```typescript
{
  tagName: "dui-{name}",
  name: "{Name}",
  description: "One-line description.",
  importPath: "@dui/components/{name}",
  properties: [
    { name: "variant", type: "string", default: '"default"', description: "..." },
    // ... all @property() declarations from the component
  ],
  events: [
    { name: "value-change", detail: "{ value: string }", description: "..." },
    // ... all dispatched events
  ],
  slots: [
    { name: "default", description: "..." },
    // ... all named slots
  ],
  cssProperties: [
    { name: "--{name}-size", description: "..." },
    // ... all component-level CSS custom properties
  ],
},
```

Extract metadata from JSDoc and `@property()` decorators in the component source. For compound components (e.g., accordion + accordion-item), add separate entries for each.

### Step 3 — Add to component sources

In `packages/docs/src/component-sources.ts`, add a raw import and map entry:

```typescript
import {name}Src from "../../components/src/{name}/{name}.ts?raw";

// Add to the Map:
["dui-{name}", {name}Src],
```

### Step 4 — Update serve.ts

In `packages/docs/serve.ts`, verify the component's exports exist in the `workspacePackages` object. If not, add them:

```typescript
"@dui/components": {
  exports: {
    "./{name}": "./src/{name}/index.ts",       // add if missing
  },
},
"@dui/theme-default": {
  exports: {
    "./components/{name}": "./src/components/{name}.ts",  // add if missing
  },
},
```

### Step 5 — Create the page component

Create `packages/docs/src/pages/docs-page-{name}.ts`:

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-{name}")
export class DocsPage{Name} extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-{name}")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Demo label">
        <!-- Component demos here -->
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
```

**Key patterns:**

- `createRenderRoot() { return this; }` — renders to light DOM so `<dui-docs-demo>` can read `innerHTML` for code display
- Use `pageStyles` from `page-utils.ts` for consistent heading/table styling
- Use `renderApiTable(meta)` for the auto-generated API reference table
- Use `<div class="row">` for horizontal layouts
- For components with JS-only properties (like combobox `.options`), set them in `connectedCallback()` via `requestAnimationFrame()` + `querySelector()`

**What to demonstrate:**

- All variant values
- Size variants (if applicable)
- Interactive states: disabled, checked, read-only
- Key features: slots, custom properties

### Step 6 — Add route to shell

In `packages/docs/src/docs-app.ts`, add a case in the `#renderPage()` method's switch statement:

```typescript
case "{name}": return html`<docs-page-{name}></docs-page-{name}>`;
```

The sidebar nav link is auto-generated from the registry — no manual sidebar edit needed (unless the component's `tagName` is `dui-accordion-item` or similar, which is filtered out of nav).

### Step 7 — Update index.ts

In `packages/docs/src/index.ts`:

1. Add the page import:
```typescript
import "./pages/docs-page-{name}.ts";
```

2. Add the component import and include in `applyTheme`:
```typescript
import { Dui{Name} } from "@dui/components/{name}";

applyTheme({
  components: [..., Dui{Name}],
});
```

### Step 8 — Verify

1. Run `deno check` from the repo root
2. Restart the dev server: `cd packages/docs && deno task dev`
3. Navigate to `http://localhost:4040/#/components/{name}` — page renders with demos + API table
4. Verify sidebar shows the component link
5. Check `http://localhost:4040/llms.txt` includes the new component

---

## For compound components

Components like accordion that have sub-components (accordion-item):

- Add **separate registry entries** for each sub-component
- Add **separate source map entries** for each
- Create **one page** that shows both API tables:

```typescript
const meta = componentRegistry.find((c) => c.tagName === "dui-{name}")!;
const itemMeta = componentRegistry.find((c) => c.tagName === "dui-{name}-item")!;

// In render():
<h2>API Reference — {Name}</h2>
${renderApiTable(meta)}

<h2>API Reference — {Name} Item</h2>
${renderApiTable(itemMeta)}
```

- The sub-component (e.g., `dui-accordion-item`) is filtered out of the sidebar nav in `docs-app.ts`

---

## Validation checklist

- [ ] Registry entry has all properties, events, slots, CSS properties
- [ ] Component source added to `component-sources.ts`
- [ ] `serve.ts` has export entries for both `@dui/components` and `@dui/theme-default`
- [ ] Page component uses light DOM rendering (`createRenderRoot`)
- [ ] Page imports `pageStyles` and `renderApiTable` from `page-utils.ts`
- [ ] Route case added in `docs-app.ts` `#renderPage()`
- [ ] Page and component imported in `index.ts`
- [ ] Component added to `applyTheme` in `index.ts`
- [ ] Demos show all variants, sizes, and interactive states
- [ ] `deno check` passes
- [ ] `llms.txt` includes the new component (auto-generated from registry)
