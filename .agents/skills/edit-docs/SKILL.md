---
name: edit-docs
description: Wire a component or template into the DUI docs dev server, or modify existing doc pages. Use when the user asks to add something to the docs, edit a demo page, update the docs site, or says "add to docs", "show in docs", "edit docs", "update the docs page", etc.
---

# Edit Docs

Wire a DUI component or template into the multi-page docs site, or modify existing pages.

## Overview

The docs site (`packages/docs`) uses a shell with sidebar navigation, hash routing, and per-page demo layouts. Components and templates self-register via side-effect imports.

### Architecture

```
packages/docs/
├── src/
│   ├── component-registry.ts    # Component metadata: properties, events, slots, CSS props
│   ├── template-registry.ts     # Template metadata: properties, slots, dependencies
│   ├── component-sources.ts     # Raw source imports for code viewer
│   ├── docs-app.ts              # Shell: top nav + sidebar + content area + route switch
│   ├── docs-router.ts           # Hash-based router (#/section/slug)
│   ├── index.ts                 # Entry point: side-effect imports for all components + templates
│   └── pages/
│       ├── docs-page-layout.ts      # Shared layout for component pages (title + API table)
│       ├── docs-template-layout.ts  # Shared layout for template pages (title + API table)
│       ├── docs-row.ts              # Horizontal layout helper for demos
│       ├── api-table.ts             # Auto-generated API table from registry
│       ├── docs-page-{name}.ts      # Per-component/template demo pages
│       └── ...
├── serve.ts                     # Dev server + esbuild + llms.txt generation
└── static/
    └── index.html               # Just <docs-app>
```

### Registration model

Components and templates self-register via `customElements.define()` on import. The docs entry point (`index.ts`) uses side-effect imports:

```typescript
// Self-registering imports — no applyTheme needed
import "@dui/components";            // registers all components
import "@dui/templates/feed";        // registers feed templates
import "@dui/templates/dashboard";   // registers dashboard templates
// ...
```

## Prerequisites

Before making changes, read:

- `packages/docs/src/docs-app.ts` — to understand the nav structure and routing
- An existing page for reference (e.g., `packages/docs/src/pages/docs-page-button.ts` for components, or `packages/docs/src/pages/docs-page-feed-item.ts` for templates)

---

## Adding a Component to Docs

### Files to modify

| File | Change |
|------|--------|
| `src/component-registry.ts` | Add `ComponentMeta` entry |
| `src/component-sources.ts` | Add raw source import |
| `src/docs-app.ts` | Add slug to `NAV_GROUPS` + route case in `#renderPage()` |
| `src/index.ts` | Import page file |
| `src/pages/docs-page-{name}.ts` | **Create** — demo page |
| `serve.ts` | Add export entries to `workspacePackages` (if not already present) |

### Step 1 — Add to component registry

In `packages/docs/src/component-registry.ts`, add a `ComponentMeta` entry:

```typescript
{
  tagName: "dui-{name}",
  name: "{Name}",
  description: "One-line description.",
  importPath: "@dui/components/{name}",
  properties: [
    { name: "variant", type: "string", default: '"default"', description: "..." },
  ],
  events: [
    { name: "value-change", detail: "{ value: string }", description: "..." },
  ],
  slots: [
    { name: "default", description: "..." },
  ],
  cssProperties: [],
  cssParts: [
    { name: "root", description: "The root element" },
  ],
  themeAttributes: [
    { name: "variant", values: '"neutral" | "primary" | "danger"', description: "Semantic color intent" },
  ],
},
```

For compound components (accordion + accordion-item), add separate entries. Sub-components set `parent: "dui-accordion"` to hide from nav.

### Step 2 — Add to component sources

In `packages/docs/src/component-sources.ts`:

```typescript
import {name}Src from "../../components/src/{name}/{name}.ts?raw";

// Add to the Map:
["dui-{name}", {name}Src],
```

### Step 3 — Add to sidebar nav

In `packages/docs/src/docs-app.ts`, add the slug to the appropriate group in `NAV_GROUPS`:

```typescript
const NAV_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "",
    slugs: [
      "accordion", ..., "{name}",  // add alphabetically
    ],
  },
  // ...
];
```

The sidebar is NOT auto-generated from the registry — you must add the slug manually.

### Step 4 — Add route

In the same file, add a case in `#renderPage()` under `section === "components"`:

```typescript
case "{name}": return html`<docs-page-{name}></docs-page-{name}>`;
```

### Step 5 — Update serve.ts

Verify the component's exports exist in `workspacePackages`. The `@dui/components` entry auto-reads from `packages/components/deno.json`, so new components should be picked up automatically as long as the component's export was added to `packages/components/deno.json`.

### Step 6 — Create the demo page

Create `packages/docs/src/pages/docs-page-{name}.ts`:

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-{name}")
export class DocsPage{Name} extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-{name}">
        <dui-docs-demo label="Variants">
          <docs-row>
            <dui-{name}>Default</dui-{name}>
            <dui-{name} variant="primary">Primary</dui-{name}>
          </docs-row>
        </dui-docs-demo>

        <!-- More demos... -->
      </docs-page-layout>
    `;
  }
}
```

**Key patterns:**
- `createRenderRoot() { return this; }` — light DOM so `<dui-docs-demo>` can read innerHTML for code display
- `<docs-page-layout tag="dui-{name}">` — auto-renders title, description, and API table from the registry
- `<dui-docs-demo label="...">` — wraps each demo with a label and code viewer
- `<docs-row>` — horizontal flex layout for placing items side by side
- For compound components, use `<docs-page-layout tag="dui-{name}" .additionalTags=${["dui-{name}-item"]}>` to show multiple API tables

### Step 7 — Import the page

In `packages/docs/src/index.ts`, add the page import near the other page imports:

```typescript
import "./pages/docs-page-{name}.ts";
```

No component registration is needed — `import "@dui/components"` at the top of `index.ts` already registers all components via their side-effect imports. If you added a new component to `@dui/components`, it's automatically included.

### Step 8 — Verify

1. `deno check` from the repo root
2. Start dev server: `cd packages/docs && deno task dev`
3. Navigate to `http://localhost:{port}/#/components/{name}`
4. Verify: sidebar link appears, page renders with demos + API table, code viewer works
5. Check `llms.txt` includes the new component (auto-generated at startup)

---

## Adding a Template to Docs

Templates use a parallel but slightly different system. This is also covered in the `/create-template` skill, but here's the docs-specific summary.

### Files to modify

| File | Change |
|------|--------|
| `src/template-registry.ts` | Add `TemplateMeta` entry + slug to `TEMPLATE_NAV_GROUPS` |
| `src/docs-app.ts` | Add route case in `#renderPage()` under `section === "templates"` |
| `src/index.ts` | Import page + import template category (if new) |
| `src/pages/docs-page-{name}.ts` | **Create** — demo page |

### Demo page pattern for templates

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-{name}")
export class DocsPage{Name} extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-{name}">
        <dui-docs-demo label="Basic">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-{name} title="Example" ...></dui-{name}>
          </div>
        </dui-docs-demo>
      </docs-template-layout>
    `;
  }
}
```

Note: `<docs-template-layout>` instead of `<docs-page-layout>`. It reads from `templateRegistry` and shows a "Template" badge, properties table, slots table, and component dependencies.

### Registration in index.ts

For templates, `index.ts` imports template categories as side effects:

```typescript
import "@dui/templates/{category}";
```

If the category is already imported, no change needed — adding a template to an existing category's index automatically picks it up.

---

## Editing an Existing Page

To modify a demo page:

1. Find the page: `packages/docs/src/pages/docs-page-{name}.ts`
2. Edit the demos inside the `<docs-page-layout>` or `<docs-template-layout>` wrapper
3. Use `<dui-docs-demo label="...">` to wrap each demo section
4. Use `<docs-row>` for side-by-side layouts
5. Dev server hot-reloads — save and check the browser

To update API documentation (properties, events, slots):

1. Edit the entry in `component-registry.ts` or `template-registry.ts`
2. The API table auto-updates since it reads from the registry at render time
3. `llms.txt` regenerates on next server start

---

## Validation checklist

- [ ] Registry entry has all properties, events, slots, CSS properties, theme attributes
- [ ] Component source added to `component-sources.ts` (components only)
- [ ] Slug added to `NAV_GROUPS` or `TEMPLATE_NAV_GROUPS`
- [ ] Route case added in `#renderPage()`
- [ ] `serve.ts` exports present for all relevant packages
- [ ] Page uses light DOM (`createRenderRoot() { return this; }`)
- [ ] Page uses `<docs-page-layout>` (components) or `<docs-template-layout>` (templates)
- [ ] Demos show all variants, sizes, and key features
- [ ] Page imported in `index.ts`
- [ ] Template category imported in `index.ts` (templates only, if new category)
- [ ] `deno check` passes
