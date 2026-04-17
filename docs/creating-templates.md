# Creating Templates

Step-by-step guide for adding a new template to `@dui/theme-default-templates`.

---

## What templates are

Templates are pre-composed UI patterns built from DUI components + vanilla HTML/CSS. Unlike unstyled components (which separate structure from aesthetics), templates are **opinionated about both** — they ship a complete look that adapts to the active theme via design tokens.

Templates are **theme-scoped**: they use `theme-default`'s variant vocabulary (`variant="danger"`, `appearance="ghost"`, etc.) and token names. A different theme would ship its own templates.

### Templates vs. components

| | Component | Template |
|---|---|---|
| Styles | Structure only — aesthetics in theme | Self-contained — owns all CSS |
| Theme coupling | None (theme-agnostic) | Coupled to a specific theme's variants + tokens |
| Purpose | Reusable primitive (button, badge) | Ready-to-use pattern (feed item, social post) |
| Package | `@dui/components` | `@dui/theme-default-templates` |

### What templates should NOT do

- **No data fetching.** Templates are presentational. Feed them props; they render.
- **No global state.** No context providers, no stores.
- **No complex interaction logic.** Templates can compose interactive DUI components (accordion, tabs) — the component owns the interaction. But templates shouldn't implement their own state machines, pagination, or sorting.

---

## File structure

Each template category gets its own folder:

```
packages/theme-default-templates/src/
  {category}/
    {name}.ts              # Template class
    index.ts               # Re-exports + family array
  all.ts                   # Barrel: all template families
```

---

## The template class

Here's the complete pattern, using `dui-feed-item` as an example:

```typescript
// packages/theme-default-templates/src/feed/feed-item.ts
import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";

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
  static dependencies: DuiComponentClass[] = [DuiBadge];

  @property() accessor title = "";
  @property() accessor subtitle = "";
  @property() accessor timestamp = "";
  @property() accessor category = "";
  @property() accessor severity = "";
  @property() accessor description = "";

  override render(): TemplateResult {
    return html`
      <article part="article">
        <header part="header">
          <span class="title">${this.title}</span>
          ${this.category
            ? html`<dui-badge appearance="ghost">${this.category}</dui-badge>`
            : nothing}
        </header>
        <div class="meta" part="meta">
          <span>${this.subtitle}</span>
          <time>${this.timestamp}</time>
        </div>
        ${this.description
          ? html`<p class="body" part="body">${this.description}</p>`
          : nothing}
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </article>
    `;
  }
}
```

### Key conventions

| Convention | Details |
|---|---|
| **Tag name** | `dui-{name}` — plain `dui-` prefix, no infix like `-t-` |
| **`static tagName`** | Required — used by `applyTheme` for registration |
| **`static dependencies`** | List DUI component classes rendered internally. `applyTheme` auto-registers them. |
| **`base` import** | Always include `base` from `@dui/core/base` in styles for structural resets |
| **Design tokens only** | Never hardcode `px`, `rem`, or color values. Use `--space-*`, `--font-size-*`, `--foreground`, etc. |
| **Semantic HTML** | Use `<article>`, `<header>`, `<time>`, `<nav>` etc. — not just `<div>` soup |
| **CSS parts** | Expose meaningful parts (`part="article"`, `part="header"`) for consumer overrides |
| **Properties** | Use `@property()` with `accessor` for reactive props. All string type by default. Use `override` for `title` (inherited from `HTMLElement`). |
| **Slots** | Include `<slot name="actions">` as a generic extension point. Use named slots sparingly. |
| **`nothing` for empty** | Use Lit's `nothing` for conditional rendering, not empty strings |

---

## Index and barrel exports

### Category index

```typescript
// packages/theme-default-templates/src/feed/index.ts
import { DuiFeedItem } from "./feed-item.ts";

export { DuiFeedItem };

export const feedFamily = [DuiFeedItem];
```

### All templates barrel

```typescript
// packages/theme-default-templates/src/all.ts
import { feedFamily } from "./feed/index.ts";

export { DuiFeedItem } from "./feed/index.ts";

export const allTemplates = [
  ...feedFamily,
];
```

When adding a new category, add its family to `all.ts`.

---

## Register in deno.json

Add the category export to `packages/theme-default-templates/deno.json`:

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

### 1. Add to the dev server resolver

In `packages/docs/serve.ts`, add the export path to the `@dui/theme-default-templates` entry in `workspacePackages`.

### 2. Add to the template registry

In `packages/docs/src/template-registry.ts`, add a `TemplateMeta` entry with all properties, slots, and dependencies. Add the slug to `TEMPLATE_NAV_GROUPS` under the appropriate category.

### 3. Import and register

In `packages/docs/src/index.ts`:
- Import the template class
- Add it to the `applyTheme()` components array
- Import the new docs page

### 4. Add to docs-app routing

In `packages/docs/src/docs-app.ts`, add a `case` for the template slug in the `#renderPage()` switch under `section === "templates"`.

### 5. Create a demo page

Create `packages/docs/src/pages/docs-page-{name}.ts` with representative demos showing the template with different prop combinations.

---

## Styling rules

### Use only public design tokens

Templates should reference only public tokens from the theme:

| Category | Tokens |
|---|---|
| Spacing | `--space-0` through `--space-96` |
| Typography | `--font-sans`, `--font-mono`, `--font-size-*`, `--font-weight-*`, `--letter-spacing-*`, `--line-height-*` |
| Colors | `--foreground`, `--background`, `--surface-1`/`2`/`3`, `--text-1`/`2`/`3`, `--border`, `--accent`, `--destructive` |
| Borders | `--radius-*`, `--border-width-*` |
| Motion | `--duration-fast`, `--duration-normal` |

### Theme variant vocabulary

When rendering DUI components, use the default theme's variant names:

| Component | Available variants |
|---|---|
| `dui-badge` | `variant`: `neutral`, `primary`, `danger` / `appearance`: `filled`, `outline`, `ghost` |
| `dui-button` | `variant`: `default`, `outline`, `ghost`, `link`, `danger` / `size`: `sm`, `md`, `lg`, `icon` |

Templates can also use `--badge-bg`, `--badge-fg`, etc. for custom badge colors beyond the built-in variants.
