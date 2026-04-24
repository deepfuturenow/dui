---
name: dui
description: Build frontend UIs using DUI, a Lit-based styled web component library with design tokens and two-layer inheritance. Use this skill whenever the user wants to build pages, layouts, forms, dashboards, or any frontend UI in a project that uses (or should use) DUI components — look for `@deepfuture/dui-components` or `@dui/components` imports, `dui-*` element tags, or design token variables like `--accent`, `--surface-1`. Also trigger when the user mentions "DUI", "dui components", or asks to add/use web components with design tokens. If a project has DUI installed, always use this skill for frontend work rather than building from scratch.
---

# DUI

DUI is a styled Lit web component library built on two-layer inheritance. Unstyled primitives (in a separate repo) provide structure and behavior; styled components extend them with aesthetic CSS and design tokens. Components self-register on import — no setup function, no configuration.

## Project detection

Before writing any DUI code, check the project's DUI status:

1. Check `package.json` for `@deepfuture/dui-components` deps, or `deno.json` for `@dui/components/*` import map entries
2. If found, note which packages are installed — components self-register on import, so look for `import "@deepfuture/dui-components/button"` or `import "@dui/components/button"` patterns
3. If DUI is not installed, follow the install instructions below
4. Check whether `@deepfuture/dui-inspector` (or `@dui/inspector`) is available — if so, use the inspector workflow below

## Principles

1. **Use DUI components first.** Before writing custom markup, check if a DUI component exists. Read `references/components.md` for the full catalog.
2. **Inspect before styling or debugging.** Before overriding any DUI token or adding custom CSS to a DUI component, run `__dui_inspect('dui-component-name')` to see available tokens, parts, slots, and current values. Do the same when debugging unexpected behavior. The inspector is the ground truth.
3. **Style via CSS custom properties, not DOM manipulation.** Components expose `--token-name` custom properties as their styling API. Don't reach into shadow DOM.
4. **Use `::part(root)` for CSS properties that don't have a token.** Every component exposes a `root` part for full CSS expressiveness (backdrop-filter, transforms, box-shadow, etc.).
5. **Use semantic design tokens.** Use tokens (e.g. `--foreground`, `--background`, `--accent`) before hardcoded colors like `#3b82f6`.
6. **Compose, don't reinvent.** A settings page = `dui-tabs` + `dui-input` + `dui-select` + `dui-switch`. A dashboard = `dui-sidebar` + `dui-data-table` + layout primitives.

## Installation

### npm

```bash
npm install @deepfuture/dui-components
```

### CDN (zero setup)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@deepfuture/dui-cdn/dui.min.js"></script>
```

The CDN bundle registers all components automatically.

### Deno (from source)

Add `@dui/*` entries to your app's `deno.json` import map:

```json
{
  "imports": {
    "@dui/components/button": "../dui/packages/components/src/button/index.ts"
  }
}
```

### Usage

Components self-register on import. No setup function, no configuration:

```typescript
// À la carte — import only what you use
import "@deepfuture/dui-components/button";
import "@deepfuture/dui-components/dialog";

// Or register everything
import "@deepfuture/dui-components";
```

Each import registers the component and all its sub-components. Importing `dialog` registers `dui-dialog`, `dui-dialog-trigger`, `dui-dialog-popup`, and `dui-dialog-close`.

### Templates

Templates are pre-composed UI patterns. Install alongside the components:

```bash
npm install @deepfuture/dui-templates
```

```typescript
import "@deepfuture/dui-templates/feed";  // registers dui-feed-item etc.
```

## Critical rules

### Styling

- **CSS custom properties are the styling API.** Override `--button-bg`, `--button-radius`, etc. — not internal shadow DOM elements.
- **`::part(root)` for everything else.** Filters, transforms, backdrop-filter, box-shadow — anything not covered by a token.
- **No `!important`.** If you need `!important`, you're fighting the system — use the right token or part instead.
- **Semantic tokens for colors.** `--foreground`, `--background`, `--accent`, `--surface-1`/`--surface-2` — never raw color values, unless absolutely necessary.
- **Dark mode via `data-theme="dark"` on `<html>`.** The token stylesheet handles the rest via custom property overrides. Never add manual dark-mode color logic.

### Composition

- **Slots are the composition API.** Pass content into components via slots, not by wrapping in divs.
- **Compound components stay together.** `dui-dialog-trigger` belongs inside `dui-dialog`. `dui-select-option` belongs inside `dui-select`. Don't restructure compound component hierarchies.
- **Never reach into shadow DOM.** Don't use `querySelector` on a component's `shadowRoot` from outside. Use CSS custom properties, `::part(root)`, or the inspector API instead.
- **Use standard CSS for layout.** Use flexbox and grid directly for layout (rows, columns, centering, page margins). DUI does not provide layout wrapper components — layout is CSS's job.

### Icons

- **`dui-icon` with `currentColor` convention.** The icon inherits text color from its parent. Override with `--icon-color` and `--icon-size` custom properties.
- **Slot-based content.** Pass SVG or img into `dui-icon`'s default slot.

See `references/rules.md` for incorrect/correct code pairs for every rule above.

## Component selection

Read `references/components.md` for the full catalog. Quick lookup:

| Need | Use |
| --- | --- |
| Button / action | `dui-button` with `variant` and `size` |
| Split button with dropdown | `dui-split-button` |
| Form inputs | `dui-input`, `dui-textarea`, `dui-select`, `dui-combobox`, `dui-checkbox`, `dui-radio-group`, `dui-switch`, `dui-slider`, `dui-number-field`, `dui-stepper`, `dui-dropzone` |
| Form field with label/error | `dui-field` wrapping a form control |
| Form field grouping | `dui-fieldset` |
| Toggle between options | `dui-toggle-group` |
| Data display | `dui-data-table`, `dui-badge`, `dui-avatar`, `dui-calendar`, `dui-progress`, `dui-spinner` |
| Navigation | `dui-sidebar-provider`, `dui-breadcrumb`, `dui-tabs` |
| Overlays | `dui-dialog` (modal), `dui-alert-dialog` (confirmation), `dui-popover`, `dui-tooltip`, `dui-menu`, `dui-command` |
| Disclosure | `dui-accordion`, `dui-collapsible` |
| Content containers | `dui-card`, `dui-card-grid` |
| Layout | `dui-scroll-area`, `dui-separator` — for rows/columns/centering/page margins, use standard CSS flexbox and grid |
| Text | `dui-trunc` (truncation with `max-lines` or `max-width`) |
| Utility | `dui-icon`, `dui-portal`, `dui-link` |
| Maps | `dui-map` + `dui-map-marker`, `dui-map-controls`, `dui-map-route`, `dui-map-region`, `dui-map-heatmap`, `dui-map-cluster-layer` |
| Charts | `dui-chart` (Observable Plot wrapper) |

### Choosing between overlays

| Use case | Component |
| --- | --- |
| Focused task requiring input | `dui-dialog` |
| Destructive action confirmation | `dui-alert-dialog` |
| Small contextual content on click | `dui-popover` |
| Brief hint on hover | `dui-tooltip` |
| Action menu / context menu | `dui-menu` |
| Search / command palette | `dui-command` |
| Rich preview on hover | `dui-preview-card` |

### Use DUI components, not custom markup

| Instead of... | Use |
| --- | --- |
| `<hr>` or border divs | `dui-separator` |
| Custom styled `<span>` for tags/status | `dui-badge` |
| Custom `animate-spin` div | `dui-spinner` |
| Custom progress bar div | `dui-progress` |
| Raw `<svg>` with manual sizing | `dui-icon` with SVG in its slot |
| `overflow: auto` div | `dui-scroll-area` |
| Raw `<a>` tag | `dui-link` |
| Custom card div with header/footer | `dui-card` |
| Label + input + error div | `dui-field` wrapping the input |

See `references/rules.md` for incorrect/correct code pairs for every rule.

## Theming

DUI's color system is built on 4 OKLCH primitives with compositional derivation:

| Token | Role |
| --- | --- |
| `--background` | Page/app background |
| `--foreground` | Primary text/foreground |
| `--accent` | Accent/brand color |
| `--destructive` | Danger/error color |

Everything else is derived: `--surface-1`/`2`/`3` (elevated surfaces via lightness offsets), `--text-1`/`2`/`3` (text tiers via alpha), `--border`/`--border-strong` (foreground at reduced alpha), `--accent-subtle`, `--destructive-subtle`. Customizing the palette means changing 4 values.

Design tokens are injected into `document.adoptedStyleSheets` at import time. They cascade into shadow DOM via CSS custom property inheritance.

### Dark mode

```html
<html data-theme="dark">
  <!-- All DUI components render in dark mode -->
</html>
```

Toggle by setting/removing `data-theme="dark"` on `<html>`. The token stylesheet redefines the 4 primitives for dark mode; all derived tokens update automatically.

```typescript
// Toggle dark mode
document.documentElement.setAttribute("data-theme", "dark");
// Revert to light
document.documentElement.removeAttribute("data-theme");
```

### Customizing the palette

Override the 4 primitives on `:root`:

```css
:root {
  --accent: oklch(0.6 0.2 280);        /* purple accent */
  --background: oklch(0.96 0.01 80);   /* warm canvas */
}
```

All derived tokens update automatically.

### Two-layer styling

| Layer | Mechanism | Best for |
|-------|-----------|----------|
| **CSS variables** | `dui-button { --button-bg: ... }` | Colors, sizes, spacing |
| **`::part(root)`** | `dui-button::part(root) { ... }` | Filters, transforms, shadows, clip-paths |

Variables cascade from ancestors. `::part()` must target the element directly.

### Theme attributes vs properties

Some attributes like `variant`, `appearance`, and `size` are **theme attributes** — they're reflected HTML attributes that the styled CSS layer selects on (`:host([variant="primary"])`). They appear as attributes in markup:

```html
<dui-button variant="primary" size="lg">Save</dui-button>
<dui-badge variant="danger" appearance="soft">Error</dui-badge>
```

Behavioral **properties** like `disabled`, `open`, `value` are reactive Lit properties that affect component behavior and DOM structure.

## Event handling

### `dui-navigate` for link buttons

When `<dui-button href="...">` is clicked (without modifier keys), it fires `dui-navigate`. Wire into your router:

```typescript
document.addEventListener("dui-navigate", (e: CustomEvent<{ href: string }>) => {
  router.navigate(e.detail.href);
});
```

### Component events

Listen on the element:

```typescript
html`
  <dui-switch @checked-change=${(e: CustomEvent<{ checked: boolean }>) => {
    console.log("Switch toggled:", e.detail.checked);
  }}></dui-switch>
`;
```

## Inspector workflow

When `@dui/inspector` (or `@deepfuture/dui-inspector`) is installed, use the inspector to discover, verify, and prototype with DUI components at runtime. This is the most accurate way to understand what's available and how components behave.

**CRITICAL**: Use the inspector BEFORE writing any DUI styling code — not just for debugging. Run `__dui_inspect('dui-sidebar-menu-button')` before overriding sidebar tokens. Run `__dui_inspect('dui-data-table')` before customizing table appearance. The inspector shows which tokens actually exist, what they're called, and their current values. Guessing at token names wastes iterations.

The inspector provides console globals. If the project has a running dev server with a browser, use these in the browser console or via a Playwright/Puppeteer script.

### Discovery

```js
// See all DUI components on the page + full catalog of registered types
__dui_inspect()

// Inspect a specific component — get properties, tokens, slots, parts, events
__dui_inspect('dui-button')
__dui_inspect('[data-dui-id="5"]')
```

The `catalog` field from `__dui_inspect()` lists every registered `dui-*` tag with its property schema, slots, and parts — including components not currently rendered.

### Prototyping

```js
// Insert a component into the page
__dui_mutate.insertComponent('[data-dui-id="3"]', 'beforeend', 'dui-button',
  { variant: 'primary' }, 'Click me')

// Set a property
__dui_mutate.setProp('[data-dui-id="5"]', 'variant', 'danger')

// Change a design token globally
__dui_mutate.setToken('--radius-md', '1rem')

// Change a token on one instance
__dui_mutate.setComponentToken('[data-dui-id="5"]', '--button-bg', 'red')

// Replace slot content
__dui_mutate.setSlotContent('[data-dui-id="5"]', '', '<span>New label</span>')

// Remove or move components
__dui_mutate.removeComponent('[data-dui-id="5"]')
__dui_mutate.moveComponent('[data-dui-id="5"]', '[data-dui-id="10"]', 'beforeend')
```

### Verify → export → write

```js
// Export all mutations as structured source file changes
__dui_export()
// → [{ file: "...", changeType: "token"|"template", description: "...", ... }]
```

### Typical agent workflow

```
1. __dui_inspect()                              → discover available components via catalog
2. __dui_mutate.insertComponent(...)             → build the UI
3. __dui_mutate.setProp(selector, prop, value)   → configure components
4. __dui_inspect(selector)                       → verify state
5. __dui_export()                                → get structured source changes
6. Write changes to source files                  → done
```

When the inspector is not available, fall back to the static component reference in `references/components.md` and write code directly.

## Detailed references

- [references/components.md](references/components.md) — Full catalog of all 57 component families with properties, theme attributes, slots, parts, and CSS custom properties
- [references/rules.md](references/rules.md) — Incorrect/correct code pairs for every critical rule
- [references/blocks.md](references/blocks.md) — Real-world composition examples: settings forms, chat inputs, dashboards, maps, data tables, and more. Each entry summarizes the pattern and key CSS/layout techniques, with a pointer to the full source. **Read a block's source file when building something similar.**
- [references/inspector.md](references/inspector.md) — Complete inspector API reference
