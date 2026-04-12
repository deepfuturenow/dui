---
name: dui
description: Build frontend UIs using DUI, a Lit-based web component design system with composable themes. Use this skill whenever the user wants to build pages, layouts, forms, dashboards, or any frontend UI in a project that uses (or should use) DUI components — look for `@deepfuture/dui-*` or `@dui/*` imports, `dui-*` element tags, or `applyTheme` calls. Also trigger when the user mentions "DUI", "dui components", "dui theme", or asks to add/use unstyled web components with theming. If a project has DUI installed, always use this skill for frontend work rather than building from scratch.
---

# DUI

DUI is an unstyled Lit web component library with composable themes. Components provide structure and behavior with zero visual opinions. Themes provide all aesthetics — colors, spacing, typography, borders. `applyTheme()` composes the layers and registers themed custom elements.

## Project detection

Before writing any DUI code, check the project's DUI status:

1. Check `package.json` for `@deepfuture/dui-*` deps, or `deno.json` for `@dui/*` import map entries
2. If found, note which packages are installed and look for an existing `applyTheme()` call — every DUI app has one
3. If DUI is not installed, follow the install and setup instructions in the [DUI README](https://github.com/deepfuturenow/dui#readme)
4. Check whether `@deepfuture/dui-inspector` (or `@dui/inspector`) is available — if so, use the inspector workflow below

## Principles

1. **Use DUI components first.** Before writing custom markup, check if a DUI component exists. Read `references/components.md` for the full catalog.
2. **Debug via the inspector first.** When a DUI component isn't behaving as expected (events not firing, props not updating, context not propagating), use `__dui_inspect()` in the browser before reading `node_modules` source. The inspector shows live property values, context state, slots, and events — it's faster and more reliable than source-diving.
3. **Style via CSS custom properties, not DOM manipulation.** Components expose `--token-name` custom properties as their styling API. Don't reach into shadow DOM.
4. **Use `::part(root)` for CSS properties that don't have a token.** Every component exposes a `root` part for full CSS expressiveness (backdrop-filter, transforms, box-shadow, etc.).
5. **Use semantic design tokens.** Use `--color-fg`, `--color-bg`, `--color-primary` — never hardcoded colors like `#3b82f6`.
6. **Compose, don't reinvent.** A settings page = `dui-tabs` + `dui-input` + `dui-select` + `dui-switch`. A dashboard = `dui-sidebar` + `dui-data-table` + layout primitives.

## Critical rules

### Styling

- **CSS custom properties are the styling API.** Override `--button-bg`, `--button-radius`, etc. — not internal shadow DOM elements.
- **`::part(root)` for everything else.** Filters, transforms, backdrop-filter, box-shadow — anything not covered by a token.
- **No `!important`.** If you need `!important`, you're fighting the system — use the right token or part instead.
- **Semantic tokens for colors.** `--color-fg`, `--color-bg`, `--color-primary`, `--color-surface` — never raw color values.
- **Dark mode via `class="dark"` on a parent.** The theme handles the rest via custom property overrides. Never add manual dark-mode color logic.

### Composition

- **Slots are the composition API.** Pass content into components via slots, not by wrapping in divs.
- **Compound components stay together.** `dui-dialog-trigger` belongs inside `dui-dialog`. `dui-select-option` belongs inside `dui-select`. Don't restructure compound component hierarchies.
- **Use standard CSS for layout.** Use flexbox and grid directly for layout (rows, columns, centering, page margins). DUI does not provide layout wrapper components — layout is CSS's job.

### Icons

- **`dui-icon` with `currentColor` convention.** The icon inherits text color from its parent. Override with `--icon-color` and `--icon-size` custom properties.
- **Slot-based content.** Pass SVG or img into `dui-icon`'s default slot.

## Component selection

Read `references/components.md` for the full catalog. Quick lookup:

| Need | Use |
| --- | --- |
| Button / action | `dui-button` with `variant` and `size` |
| Form inputs | `dui-input`, `dui-textarea`, `dui-select`, `dui-combobox`, `dui-checkbox`, `dui-radio-group`, `dui-switch`, `dui-slider`, `dui-number-field`, `dui-dropzone` |
| Toggle between options | `dui-toggle-group` |
| Data display | `dui-data-table`, `dui-badge`, `dui-avatar`, `dui-calendar`, `dui-progress`, `dui-spinner` |
| Navigation | `dui-sidebar`, `dui-breadcrumb`, `dui-tabs` |
| Overlays | `dui-dialog` (modal), `dui-alert-dialog` (confirmation), `dui-popover`, `dui-tooltip`, `dui-menu`, `dui-command` |
| Disclosure | `dui-accordion`, `dui-collapsible` |
| Layout | `dui-scroll-area`, `dui-separator` — for rows/columns/centering/page margins, use standard CSS flexbox and grid |
| Text | `dui-trunc` (truncation with `max-chars`) |
| Utility | `dui-icon`, `dui-portal`, `dui-link` |

## Theming

DUI's color system is built on 4 primitives with compositional operations via `oklch(from ...)`:

- `--color-bg` — page/app background
- `--color-fg` — primary text/foreground
- `--color-primary` — accent/brand color
- `--color-surface` — elevated surfaces (cards, dialogs)

Everything else is derived: hover states, muted text, borders, focus rings. The theme owns all visual decisions.

Themes are composed via `applyTheme()` which layers styles in order:
1. **Base reset** — structural resets from `@dui/core`
2. **Component CSS** — layout and behavior from the component
3. **Theme base** — `:host` defaults (font, color)
4. **Theme component** — per-component aesthetics

### Dark mode

```html
<body class="dark">
  <!-- All DUI components render in dark mode -->
</body>
```

Toggle by adding/removing the `dark` class. The theme's custom properties handle the color swap.

## Inspector workflow

When `@dui/inspector` (or `@deepfuture/dui-inspector`) is installed, use the inspector to discover, verify, and prototype with DUI components at runtime. This is the most accurate way to understand what's available and how components behave.

The inspector provides console globals. If the project has a running dev server with a browser, use these in the browser console or via a Playwright/Puppeteer script.

### Discovery

```js
// See all DUI components on the page + full catalog of registered types
__dui_inspect()

// Inspect a specific component — get properties, tokens, slots, parts, events
__dui_inspect('dui-button')
__dui_inspect('[data-dui-id="5"]')
```

The `catalog` field from `__dui_inspect()` lists every registered `dui-*` tag with its property schema, slots, and parts — including components not currently rendered. This is the ground truth for what's available.

### Prototyping

```js
// Insert a component into the page
__dui_mutate.insertComponent('[data-dui-id="3"]', 'beforeend', 'dui-button',
  { variant: 'primary' }, 'Click me')

// Set a property (validates against the component's schema)
__dui_mutate.setProp('[data-dui-id="5"]', 'variant', 'danger')

// Change a design token globally
__dui_mutate.setToken('--radius-md', '1rem')

// Change a token on one component instance
__dui_mutate.setComponentToken('[data-dui-id="5"]', '--button-bg', 'red')

// Replace slot content
__dui_mutate.setSlotContent('[data-dui-id="5"]', '', '<span>New label</span>')

// Remove or move components
__dui_mutate.removeComponent('[data-dui-id="5"]')
__dui_mutate.moveComponent('[data-dui-id="5"]', '[data-dui-id="10"]', 'beforeend')
```

Every mutation validates inputs and returns a post-mutation inspection. Invalid props return an error with available properties listed.

### Verify → export → write

After prototyping in the inspector:

```js
// Export all mutations as structured source file changes
__dui_export()
// → [{ file: "...", changeType: "token"|"template", description: "...", ... }]
```

The export maps mutations back to source files (if a source map was configured at init). Use the export to write changes back to the project's actual source files.

### Observing human edits

```js
// Watch for changes made by a human in the visual UI
const unsub = __dui_observe(entry => {
  console.log('Change:', entry.action, entry.target, entry.params);
});
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

- [references/components.md](references/components.md) — Full catalog of all 43 component families with properties, slots, parts, and CSS custom properties
- [references/inspector.md](references/inspector.md) — Complete inspector API reference
