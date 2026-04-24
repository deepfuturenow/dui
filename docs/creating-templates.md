# Creating Templates

Guide for adding a new template to `@dui/templates`.

---

## What templates are

Templates are pre-composed UI patterns built from DUI components + vanilla HTML/CSS. Unlike components (which extend primitives), templates are **self-contained** — they own all their CSS and ship a complete look that adapts via design tokens.

### Templates vs. components

| | Component | Template |
|---|---|---|
| Extends | A primitive class | `LitElement` directly |
| Styles | Aesthetic layer on top of primitive | Self-contained — owns all CSS |
| Purpose | Reusable primitive (button, badge) | Ready-to-use pattern (feed item, social post) |
| Package | `@dui/components` | `@dui/templates` |

### What templates should NOT do

- **No data fetching.** Templates are presentational. Feed them props; they render.
- **No global state.** No context providers, no stores.
- **No complex interaction logic.** Templates can compose interactive DUI components (accordion, tabs) — the component owns the interaction. But templates shouldn't implement their own state machines, pagination, or sorting.

---

## File structure

Each template category gets its own folder:

```
packages/templates/src/
  {category}/
    {name}.ts              # Template class
    index.ts               # Re-exports + family array
  all.ts                   # Barrel: all template families
```

---

## The template class

Here's the pattern, using `dui-feed-item` as an example:

```typescript
// packages/templates/src/feed/feed-item.ts
import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base"; // resolves to @dui/primitives/core/base
// Side-effect imports — registers DUI components used in this template
import "@dui/components/badge";

const styles = css`
  :host {
    display: block;
  }

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
    color: var(--foreground);
  }

  .meta {
    font-size: var(--font-size-xs);
    color: var(--text-2);
  }
`;

export class DuiFeedItem extends LitElement {
  static tagName = "dui-feed-item" as const;
  static override styles = [base, styles];

  @property() override accessor title = "";
  @property() accessor subtitle = "";
  @property() accessor timestamp = "";
  @property() accessor severity = "";

  override render(): TemplateResult {
    return html`
      <article part="article">
        <header part="header">
          <span class="title">${this.title}</span>
          ${this.severity
            ? html`<dui-badge appearance="ghost">${this.severity}</dui-badge>`
            : nothing}
        </header>
        <div class="meta" part="meta">
          <span>${this.subtitle}</span>
          <time>${this.timestamp}</time>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </article>
    `;
  }
}

customElements.define(DuiFeedItem.tagName, DuiFeedItem);
```

### Key conventions

| Convention | Details |
|---|---|
| **Tag name** | `dui-{name}` — plain `dui-` prefix |
| **`static tagName`** | Required for the tag name |
| **`customElements.define()`** | At module level — self-registers on import |
| **Component dependencies** | Side-effect imports (`import "@dui/components/badge"`) — triggers registration |
| **`base` import** | Always include `base` from `@dui/core/base` (part of `@dui/primitives`) for structural resets |
| **Design tokens only** | Never hardcode `px`, `rem`, or color values |
| **Semantic HTML** | Use `<article>`, `<header>`, `<time>`, `<nav>` etc. |
| **CSS parts** | Expose meaningful parts (`part="article"`, `part="header"`) |
| **Properties** | Use `@property() accessor`. Use `override` for `title` (inherited from `HTMLElement`). |
| **`nothing` for empty** | Use Lit's `nothing` for conditional rendering |

---

## Index and barrel exports

### Category index

```typescript
// packages/templates/src/feed/index.ts
import { DuiFeedItem } from "./feed-item.ts";

export { DuiFeedItem };

export const feedFamily = [DuiFeedItem];
```

### All templates barrel

```typescript
// packages/templates/src/all.ts
import { feedFamily } from "./feed/index.ts";

export { DuiFeedItem } from "./feed/index.ts";

export const allTemplates = [
  ...feedFamily,
];
```

---

## Register in deno.json

Add the category export to `packages/templates/deno.json`:

```json
{
  "exports": {
    "./feed": "./src/feed/index.ts",
    "./all": "./src/all.ts"
  }
}
```

---

## Wire into docs

1. **Template registry** — Add a `TemplateMeta` entry in `packages/docs/src/template-registry.ts` with properties, slots, and dependencies. Add the slug to `TEMPLATE_NAV_GROUPS`.
2. **Route** — Add a case in `docs-app.ts` `#renderPage()` under `section === "templates"`.
3. **Import** — In `packages/docs/src/index.ts`, import the template category (`import "@dui/templates/{category}"`) and the page file.
4. **Demo page** — Create `packages/docs/src/pages/docs-page-{name}.ts`.

---

## Styling rules

### Use only design tokens

Templates should reference only public tokens:

| Category | Tokens |
|---|---|
| Spacing | `--space-0` through `--space-96` |
| Typography | `--font-sans`, `--font-mono`, `--text-*`, `--font-weight-*`, `--letter-spacing-*`, `--line-height-*` |
| Colors | `--foreground`, `--background`, `--surface-1`/`2`/`3`, `--text-1`/`2`/`3`, `--border`, `--accent`, `--destructive` |
| Borders | `--radius-*`, `--border-width-*` |
| Motion | `--duration-fast`, `--duration-normal` |

### Variant vocabulary

When rendering DUI components, use the variant names from the component set:

| Component | Available variants |
|---|---|
| `dui-badge` | `variant`: `neutral`, `primary`, `danger` / `appearance`: `filled`, `outline`, `ghost`, `soft` |
| `dui-button` | `variant`: `neutral`, `primary`, `danger` / `appearance`: `filled`, `outline`, `ghost`, `soft`, `link` / `size`: `xs`, `sm`, `md`, `lg` |

Badge and button also support custom colors via CSS variables (`--badge-bg`, `--button-bg`, etc.).
