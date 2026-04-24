---
name: create-template
description: Create a new DUI template in the templates package. Use when the user says "create a template", "new template", "add a template", "build a feed-item template", or wants to create a pre-composed UI pattern from DUI components. Handles the template class, exports, docs wiring, and registry entry.
---

# Add a DUI Template

Create a new template in `packages/templates/` and wire it into the docs site.

## Prerequisites

Read these reference files before starting:

1. An existing template for reference: `packages/templates/src/feed/feed-item.ts`
2. The template registry: `packages/docs/src/template-registry.ts`
3. `packages/docs/src/docs-app.ts` — routing and sidebar nav

## Reference documents

Read these references before writing the template. They provide the design vocabulary and component API knowledge needed for high-quality output.

| Reference | Path | Purpose |
|-----------|------|---------|
| UX principles | [references/ux-principles.md](references/ux-principles.md) | Visual hierarchy, whitespace, typography rhythm, action placement |
| Component selection | [references/component-selection.md](references/component-selection.md) | When to use which DUI component — decision table for every UI scenario |
| Component catalog | [references/component-catalog.md](references/component-catalog.md) | All DUI component families — properties, slots, parts, CSS custom properties |
| Design tokens | [references/design-tokens.md](references/design-tokens.md) | Full token reference — colors, spacing, typography, radii, shadows, motion |
| Styling rules | [references/styling-rules.md](references/styling-rules.md) | Correct/incorrect code pairs for DUI styling idioms |

## Overview

Templates are pre-composed Lit web components that combine DUI components + vanilla HTML/CSS. They:

- Own all their CSS (no structure/theme split)
- Use only design tokens for styling (`--space-*`, `--font-size-*`, `--foreground`, etc.)
- Depend on DUI components via **side-effect imports** (e.g., `import "@dui/components/badge"`)
- Are presentational only (no data fetching, no global state)
- Use semantic HTML (`<article>`, `<header>`, `<time>`, etc.)
- Self-register via `customElements.define()` at module level

### Files to create/modify

| File | Action |
|------|--------|
| `packages/templates/src/{category}/{name}.ts` | **Create** — template class |
| `packages/templates/src/{category}/index.ts` | **Create or update** — re-exports + family array |
| `packages/templates/src/all.ts` | **Update** — add family to barrel |
| `packages/templates/deno.json` | **Update** — add export entry (if new category) |
| `packages/docs/serve.ts` | **Update** — add export to workspace resolver (if new category) |
| `packages/docs/src/template-registry.ts` | **Update** — add `TemplateMeta` + nav group |
| `packages/docs/src/docs-app.ts` | **Update** — add route case |
| `packages/docs/src/index.ts` | **Update** — import page + import template category |
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

Before writing code, consult the reference documents:

1. **Select components.** Use [references/component-selection.md](references/component-selection.md) to choose the right DUI component for each UI element. Prefer DUI components over custom markup in every case (e.g., `dui-separator` not `<hr>`, `dui-badge` not a styled `<span>`, `dui-icon` not raw `<svg>`).
2. **Apply UX principles.** Follow [references/ux-principles.md](references/ux-principles.md) — clear visual hierarchy (size → weight → color), generous whitespace between sections, tighter spacing within groups, correct action placement.
3. **Look up component APIs.** Use [references/component-catalog.md](references/component-catalog.md) to verify property names, slot names, and available variants for each DUI component the template will render.
4. **Style with tokens.** Use semantic tokens from [references/design-tokens.md](references/design-tokens.md). Never hardcode colors, spacing, or typography values.
5. **Verify against rules.** Check [references/styling-rules.md](references/styling-rules.md) for correct/incorrect patterns. No hardcoded hex colors, no `!important`, no raw HTML where a DUI component exists.

Create `packages/templates/src/{category}/{name}.ts`:

```typescript
import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
// Side-effect imports — registers DUI components used in this template
import "@dui/components/badge";

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

  /* Override display:flex when hidden attribute is set by slotchange handler */
  .actions[hidden] {
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

  @property() accessor title = "";
  // ... more props

  /** Toggle hidden on slot wrapper when slotted content changes. */
  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    return html`
      <article part="article">
        <!-- Semantic HTML + DUI components -->
        <div class="actions" hidden>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </div>
      </article>
    `;
  }
}

customElements.define(Dui{Name}.tagName, Dui{Name});
```

**Critical conventions:**
- `static tagName = "dui-{name}" as const` — required for the tag name
- `customElements.define()` at module level — self-registers on import
- **Side-effect imports** for DUI component dependencies (e.g., `import "@dui/components/badge"`) — this triggers their registration. No `static dependencies` array.
- `[base, styles]` — always include `base` from `@dui/core/base`
- Props use `@property() accessor` (not `@state()`)
- `title` prop needs `override` keyword: `@property() override accessor title = ""` (because `HTMLElement` already has a `title` property)
- Use `nothing` from Lit for conditional rendering (not empty strings)
- Use semantic HTML: `<article>`, `<header>`, `<time>`, `<nav>`, `<section>`
- Expose CSS parts for consumer overrides: `part="article"`, `part="header"`, etc.

### Step 3 — Preview & iterate

Before wiring the template into docs, preview it in the standalone harness so the user can review and provide feedback. Only the template class file from Step 2 exists at this point — nothing else has been modified.

1. **Write `packages/docs/src/preview-template.ts`** to import the template via a relative path and render sample instances:

   ```typescript
   import { html, render } from "lit";
   // Side-effect imports — register components used by the template
   import "@dui/components";
   // Import the template directly via relative path (no export-map changes needed)
   import "../../templates/src/{category}/{name}.ts";

   // Render preview samples with realistic data
   render(html`
     <h2 style="margin: 0; font-family: var(--font-sans); color: var(--foreground);">
       Template Preview: &lt;dui-{name}&gt;
     </h2>
     <dui-{name} title="Example title" ...other-props></dui-{name}>
     <dui-{name} title="Another example" ...other-props></dui-{name}>
   `, document.querySelector('#preview')!);
   ```

   Use Lit's `html` + `render` so property bindings (`.prop=${value}`) work correctly. Show multiple instances with varied, realistic sample data to demonstrate the template's range.

2. **Ensure the dev server is running.** Check if `http://localhost:4040` is reachable. If not, start it:

   ```bash
   cd packages/docs && deno task dev &
   ```

   Wait a few seconds for the server to start. Note the port in the output (may differ from 4040 if that port is in use).

3. **Navigate and screenshot** (always resize first per project conventions):

   ```
   chrome_devtools_navigate_page → url: "http://localhost:{port}/preview-template.html"
   chrome_devtools_resize_page  → { width: 1280, height: 1000 }
   chrome_devtools_take_screenshot → { filePath: "./screenshots/screenshot.png" }
   ```

4. **Ask the user for feedback.** Present the screenshot and ask:

   > Here's how the template looks. Would you like to:
   > - **Approve** and proceed with docs wiring, or
   > - **Request changes** (describe what to adjust), or
   > - **Reject** and discard the template?

5. **Handle the response:**
   - **Changes requested** → Edit the template class file, update `preview-template.ts` if the sample data needs adjusting, reload the browser, take a new screenshot. Repeat from sub-step 4.
   - **Approved** → Restore `preview-template.ts` to its default stub content (see below) and proceed to Step 4.
   - **Rejected** → Restore `preview-template.ts` to its default stub, delete the template class file. Stop here — nothing else to clean up.

6. **Restore the preview stub** (on approve or reject):

   ```typescript
   // Rewritten by the create-template skill to preview templates
   // before committing to full docs wiring.
   //
   // Navigate to http://localhost:4040/preview-template.html
   console.log("No template preview configured.");
   ```

### Step 4 — Create or update the category index

If this is a **new category**, create `packages/templates/src/{category}/index.ts`:

```typescript
import { Dui{Name} } from "./{name}.ts";

export { Dui{Name} };

export const {category}Family = [Dui{Name}];
```

If the category already exists, add the new template to the existing index and family array.

### Step 5 — Update all.ts

In `packages/templates/src/all.ts`:

```typescript
import { {category}Family } from "./{category}/index.ts";

export { Dui{Name} } from "./{category}/index.ts";

export const allTemplates = [
  ...feedFamily,
  ...{category}Family,  // add new family
];
```

### Step 6 — Update deno.json exports (new categories only)

If you created a new category, add its export path to `packages/templates/deno.json`:

```json
{
  "exports": {
    "./{category}": "./src/{category}/index.ts",
    "./all": "./src/all.ts"
  }
}
```

### Step 7 — Update the docs dev server resolver (new categories only)

In `packages/docs/serve.ts`, the `@dui/templates` workspace entry auto-reads exports from `packages/templates/deno.json`, so no manual update is needed as long as Step 6 was done.

### Step 8 — Add to the template registry

In `packages/docs/src/template-registry.ts`:

1. Add a `TemplateMeta` entry to `templateRegistry`:

```typescript
{
  tagName: "dui-{name}",
  name: "{Name}",
  description: "One-line description.",
  importPath: "@dui/templates/{category}",
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

### Step 9 — Add the route

In `packages/docs/src/docs-app.ts`, add a case in the `#renderPage()` method inside the `section === "templates"` switch:

```typescript
case "{name}": return html`<docs-page-{name}></docs-page-{name}>`;
```

### Step 10 — Import and register

In `packages/docs/src/index.ts`:

1. Add the page import (near other page imports):
```typescript
import "./pages/docs-page-{name}.ts";
```

2. Add the template category import if it's a new category (near other template imports):
```typescript
import "@dui/templates/{category}";
```

If the category already exists and is already imported, no change needed — the side-effect import of the category already registers all templates in that category.

### Step 11 — Create the demo page

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

### Step 12 — Verify

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

## Default theme variant vocabulary

| Component | Variants |
|---|---|
| `dui-badge` | `variant`: `neutral`, `primary`, `danger` / `appearance`: `filled`, `outline`, `ghost`, `soft` |
| `dui-button` | `variant`: `neutral`, `primary`, `danger` / `appearance`: `filled`, `outline`, `ghost`, `soft`, `link` / `size`: `xs`, `sm`, `md`, `lg` |

Badge also supports custom colors via `--badge-bg`, `--badge-fg`, `--badge-border`.

---

## Validation checklist

- [ ] Template uses `static tagName` and `[base, styles]`
- [ ] `customElements.define()` called at module level
- [ ] DUI component dependencies imported via side-effect imports (`import "@dui/components/..."`)
- [ ] All CSS uses design tokens only (no hardcoded values)
- [ ] Semantic HTML internally (`<article>`, `<time>`, etc.)
- [ ] CSS parts exposed for key regions
- [ ] `slot="actions"` available as extension point
- [ ] **Preview approved by user before docs wiring**
- [ ] Category index re-exports the template with a family array
- [ ] `all.ts` updated with the new family
- [ ] `deno.json` exports updated (if new category)
- [ ] Template registry entry with all properties, slots, dependencies
- [ ] Nav group updated in template registry
- [ ] Route case added in `docs-app.ts`
- [ ] Template category imported in `index.ts` (if new category)
- [ ] Demo page created with realistic sample data
- [ ] `deno check` passes
- [ ] Dark mode renders correctly
