---
name: create-default-theme-template
description: Create a new DUI template in the theme-default-templates package. Use when the user says "create a template", "new template", "add a template", "build a feed-item template", or wants to create a pre-composed UI pattern from DUI components for the default theme. Handles the template class, exports, docs wiring, and registry entry.
---

# Add a DUI Template

Create a new template in `packages/theme-default-templates/` and wire it into the docs site.

## Prerequisites

Read these reference files before starting:

1. `docs/creating-templates.md` — full conventions and patterns
2. An existing template for reference: `packages/theme-default-templates/src/feed/feed-item.ts`
3. The template registry: `packages/docs/src/template-registry.ts`
4. `packages/docs/src/docs-app.ts` — routing and sidebar nav

## Overview

Templates are theme-scoped, pre-composed Lit web components that combine DUI components + vanilla HTML/CSS. They:

- Own all their CSS (no structure/theme split)
- Use only design tokens for styling (`--space-*`, `--font-size-*`, `--foreground`, etc.)
- Declare component dependencies via `static dependencies`
- Are presentational only (no data fetching, no global state)
- Use semantic HTML (`<article>`, `<header>`, `<time>`, etc.)

### Files to create/modify

| File | Action |
|------|--------|
| `packages/theme-default-templates/src/{category}/{name}.ts` | **Create** — template class |
| `packages/theme-default-templates/src/{category}/index.ts` | **Create or update** — re-exports + family array |
| `packages/theme-default-templates/src/all.ts` | **Update** — add family to barrel |
| `packages/theme-default-templates/deno.json` | **Update** — add export entry (if new category) |
| `packages/docs/serve.ts` | **Update** — add export to workspace resolver (if new category) |
| `packages/docs/src/template-registry.ts` | **Update** — add `TemplateMeta` + nav group |
| `packages/docs/src/docs-app.ts` | **Update** — add route case |
| `packages/docs/src/index.ts` | **Update** — import + register + import page |
| `packages/docs/src/pages/docs-page-{name}.ts` | **Create** — demo page |

---

## Steps

### Step 1 — Understand the template

Before writing code, clarify:

- **What category does it belong to?** (e.g., "Feed & Events", "Metrics", "Cards")
- **What props does it expose?** (title, timestamp, severity, etc.)
- **What DUI components does it render internally?** (badge, icon, avatar, etc.)
- **What slots should it offer?** (at minimum, `slot="actions"`)

### Step 2 — Create the template class

Create `packages/theme-default-templates/src/{category}/{name}.ts`:

```typescript
import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
// Import any DUI components this template renders
import { DuiBadge } from "@dui/components/badge";

const styles = css`
  :host {
    display: block;
  }

  /* Use ONLY design tokens — never hardcode px, rem, or color values */
  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-1_5);
    padding: var(--space-3) var(--space-4);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
  }

  .title {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
  }

  /* Hide actions container when slot is empty */
  .actions:not(:has(*)) {
    display: none;
  }
`;

/**
 * `<dui-{name}>` — One-line description.
 *
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer container.
 */
export class Dui{Name} extends LitElement {
  static tagName = "dui-{name}" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiBadge];

  @property() accessor title = "";
  // ... more props

  override render(): TemplateResult {
    return html`
      <article part="article">
        <!-- Semantic HTML + DUI components -->
        <slot name="actions"></slot>
      </article>
    `;
  }
}
```

**Critical conventions:**
- `static tagName = "dui-{name}" as const` — required for registration
- `static dependencies` — list ALL DUI component classes rendered in the template
- `[base, styles]` — always include `base` from `@dui/core/base`
- Props use `@property() accessor` (not `@state()`)
- `title` prop needs `override` keyword: `@property() override accessor title = ""` (because `HTMLElement` already has a `title` property)
- Use `nothing` from Lit for conditional rendering (not empty strings)
- Use semantic HTML: `<article>`, `<header>`, `<time>`, `<nav>`, `<section>`
- Expose CSS parts for consumer overrides: `part="article"`, `part="header"`, etc.

### Step 3 — Create or update the category index

If this is a **new category**, create `packages/theme-default-templates/src/{category}/index.ts`:

```typescript
import { Dui{Name} } from "./{name}.ts";

export { Dui{Name} };

export const {category}Family = [Dui{Name}];
```

If the category already exists, add the new template to the existing index and family array.

### Step 4 — Update all.ts

In `packages/theme-default-templates/src/all.ts`:

```typescript
import { {category}Family } from "./{category}/index.ts";

export { Dui{Name} } from "./{category}/index.ts";

export const allTemplates = [
  ...feedFamily,
  ...{category}Family,  // add new family
];
```

### Step 5 — Update deno.json exports (new categories only)

If you created a new category, add its export path to `packages/theme-default-templates/deno.json`:

```json
{
  "exports": {
    "./{category}": "./src/{category}/index.ts",
    "./all": "./src/all.ts"
  }
}
```

### Step 6 — Update the docs dev server resolver (new categories only)

In `packages/docs/serve.ts`, add the export to the `@dui/theme-default-templates` workspace entry:

```typescript
"@dui/theme-default-templates": {
  dir: join(WORKSPACE_ROOT, "packages/theme-default-templates"),
  exports: {
    "./{category}": "./src/{category}/index.ts",  // add
    "./all": "./src/all.ts",
  },
},
```

### Step 7 — Add to the template registry

In `packages/docs/src/template-registry.ts`:

1. Add a `TemplateMeta` entry to `templateRegistry`:

```typescript
{
  tagName: "dui-{name}",
  name: "{Name}",
  description: "One-line description.",
  importPath: "@dui/theme-default-templates/{category}",
  category: "{Category Label}",
  properties: [
    { name: "title", type: "string", default: '""', description: "Primary label" },
    // ... all @property() declarations
  ],
  slots: [
    { name: "actions", description: "Optional action buttons or links" },
  ],
  events: [],
  cssProperties: [],
  dependencies: ["dui-badge"],  // tag names of component dependencies
},
```

2. Add the slug to `TEMPLATE_NAV_GROUPS`. If this is a new category, add a new group:

```typescript
export const TEMPLATE_NAV_GROUPS = [
  { label: "Feed & Events", slugs: ["feed-item"] },
  { label: "{Category Label}", slugs: ["{name}"] },  // new category
];
```

If the category already exists, add the slug to its `slugs` array.

### Step 8 — Add the route

In `packages/docs/src/docs-app.ts`, add a case in the `#renderPage()` method inside the `section === "templates"` switch:

```typescript
case "{name}": return html`<docs-page-{name}></docs-page-{name}>`;
```

### Step 9 — Import and register

In `packages/docs/src/index.ts`:

1. Add the page import (near other page imports):
```typescript
import "./pages/docs-page-{name}.ts";
```

2. Add the template import (near other template imports):
```typescript
import { Dui{Name} } from "@dui/theme-default-templates/{category}";
```

3. Add to the `applyTheme` components array:
```typescript
applyTheme({
  components: [
    ...,
    Dui{Name},
  ],
});
```

### Step 10 — Create the demo page

Create `packages/docs/src/pages/docs-page-{name}.ts`:

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
            <dui-{name}
              title="Example title"
              ...other props
            ></dui-{name}>
          </div>
        </dui-docs-demo>

        <!-- Add more demos showing different prop combinations -->

      </docs-template-layout>
    `;
  }
}
```

**Demo page conventions:**
- Use `createRenderRoot() { return this; }` for light DOM (so `dui-docs-demo` can read innerHTML)
- Use `<docs-template-layout tag="dui-{name}">` for the page wrapper (renders title, description, API table)
- Wrap demos in `<dui-docs-demo label="...">` for consistent formatting
- Show realistic sample data (not "Lorem ipsum")
- Demonstrate all prop variations and optional features
- Constrain width with `max-width: 560px` for card-style templates

### Step 11 — Verify

1. Run `deno check` from the repo root
2. Start the dev server: `cd packages/docs && deno task dev`
3. Navigate to `http://localhost:{port}/#/templates/{name}`
4. Verify:
   - Template renders correctly with sample data
   - All prop variations work
   - Dark mode works (toggle with the theme button)
   - Properties table shows all props
   - Slots table shows available slots
   - Component Dependencies section lists internal DUI components
   - Sidebar shows the template under the correct category

---

## Available design tokens

| Category | Tokens |
|---|---|
| Spacing | `--space-0` through `--space-96` |
| Typography | `--font-sans`, `--font-mono`, `--font-size-2xs` through `--font-size-7xl`, `--font-weight-regular`/`medium`/`semibold`/`bold`, `--letter-spacing-*`, `--line-height-*` |
| Colors | `--foreground`, `--background`, `--surface-1`/`2`/`3`, `--sunken`, `--text-1`/`2`/`3`, `--border`, `--border-strong`, `--accent`, `--accent-subtle`, `--accent-text`, `--destructive`, `--destructive-subtle`, `--destructive-text` |
| Borders | `--radius-none`/`xs`/`sm`/`md`/`lg`/`xl`/`2xl`/`full`, `--border-width-hairline`/`thin`/`medium`/`thick` |
| Motion | `--duration-fast`, `--duration-normal`, `--duration-slow`, `--ease-out-3` |
| Shadows | `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg` |

## Default theme variant vocabulary

| Component | Variants |
|---|---|
| `dui-badge` | `variant`: `neutral`, `primary`, `danger` / `appearance`: `filled`, `outline`, `ghost` |
| `dui-button` | `variant`: `default`, `outline`, `ghost`, `link`, `danger` / `size`: `sm`, `md`, `lg`, `icon` |

Badge also supports custom colors via `--badge-bg`, `--badge-fg`, `--badge-border`.

---

## Validation checklist

- [ ] Template uses `static tagName`, `static dependencies`, and `[base, styles]`
- [ ] All CSS uses design tokens only (no hardcoded values)
- [ ] Semantic HTML internally (`<article>`, `<time>`, etc.)
- [ ] CSS parts exposed for key regions
- [ ] `slot="actions"` available as extension point
- [ ] Category index re-exports the template with a family array
- [ ] `all.ts` updated with the new family
- [ ] `deno.json` exports updated (if new category)
- [ ] `serve.ts` workspace resolver updated (if new category)
- [ ] Template registry entry with all properties, slots, dependencies
- [ ] Nav group updated in template registry
- [ ] Route case added in `docs-app.ts`
- [ ] Template imported and registered in `index.ts`
- [ ] Demo page created with realistic sample data
- [ ] `deno check` passes
- [ ] Dark mode renders correctly
