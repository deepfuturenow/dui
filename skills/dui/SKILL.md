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

1. **Use DUI templates and components first.** Before writing custom markup, check if a DUI template or component exists. Read `references/components.md` for the component catalog. Templates are pre-composed patterns (feed items, social posts, etc.) in `@dui/theme-default-templates`.
2. **Inspect before styling or debugging.** Before overriding any DUI token or adding custom CSS to a DUI component, run `__dui_inspect('dui-component-name')` to see available tokens, parts, slots, and current values. Do the same when debugging unexpected behavior (events not firing, props not updating, context not propagating). The inspector is the ground truth — it's faster and more reliable than guessing token names or reading `node_modules` source.
3. **Style via CSS custom properties, not DOM manipulation.** Components expose `--token-name` custom properties as their styling API. Don't reach into shadow DOM.
4. **Use `::part(root)` for CSS properties that don't have a token.** Every component exposes a `root` part for full CSS expressiveness (backdrop-filter, transforms, box-shadow, etc.).
5. **Use semantic design tokens.** Try tokens (e.g. `--foreground`, `--background`, `--accent`) before hardcoded colors like `#3b82f6`.
6. **Compose, don't reinvent.** A settings page = `dui-tabs` + `dui-input` + `dui-select` + `dui-switch`. A dashboard = `dui-sidebar` + `dui-data-table` + layout primitives.

## Critical rules

### Styling

- **CSS custom properties are the styling API.** Override `--button-bg`, `--button-radius`, etc. — not internal shadow DOM elements.
- **`::part(root)` for everything else.** Filters, transforms, backdrop-filter, box-shadow — anything not covered by a token.
- **No `!important`.** If you need `!important`, you're fighting the system — use the right token or part instead.
- **Semantic tokens for colors.** `--foreground`, `--background`, `--accent`, `--surface-1`/`--surface-2` — never raw color values, unless absolutely necessary.
- **Dark mode via `data-theme="dark"` on `<html>`.** The theme handles the rest via custom property overrides. Never add manual dark-mode color logic.

### Composition

- **Slots are the composition API.** Pass content into components via slots, not by wrapping in divs.
- **Compound components stay together.** `dui-dialog-trigger` belongs inside `dui-dialog`. `dui-select-option` belongs inside `dui-select`. Don't restructure compound component hierarchies.
- **Never reach into shadow DOM.** Don't use `querySelector` on a component's `shadowRoot` from outside. Use CSS custom properties, `::part(root)`, or the inspector API instead.
- **Use standard CSS for layout.** Use flexbox and grid directly for layout (rows, columns, centering, page margins). DUI does not provide layout wrapper components — layout is CSS's job.

See `references/rules.md` for incorrect/correct code pairs for every rule above.

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

See `references/rules.md` for incorrect/correct code pairs for every rule.

## Templates

DUI templates are pre-composed UI patterns in `@dui/theme-default-templates`. They combine DUI components + vanilla HTML/CSS into ready-to-use elements like feed items, social posts, and activity timeline entries. Templates are theme-scoped — they use the default theme's variant vocabulary.

Templates declare their component dependencies via `static dependencies`. When passed to `applyTheme`, dependencies auto-register:

```typescript
import { DuiFeedItem } from "@dui/theme-default-templates/feed";

applyTheme({
  theme: defaultTheme,
  components: [DuiFeedItem],  // DuiBadge auto-registers
});
```

```html
<dui-feed-item
  title="Earthquake detected"
  subtitle="USGS Pacific Northwest"
  timestamp="2 min ago"
  category="Seismic"
  severity="high"
></dui-feed-item>
```

Templates are presentational — feed them props, they render. No data fetching, no global state. They can compose interactive DUI components (tabs, accordion) but don't implement their own interaction logic.

## Theming

DUI's color system is built on 4 primitives with compositional operations via `oklch(from ...)`:

- `--background` — page/app background
- `--foreground` — primary text/foreground
- `--accent` — accent/brand color
- `--destructive` — danger/error color

Everything else is derived: `--surface-1`/`2`/`3` (elevated surfaces), `--text-1`/`2`/`3` (text tiers), `--border`/`--border-strong`, `--accent-subtle`, `--destructive-subtle`. The theme owns all visual decisions.

Themes are composed via `applyTheme()` which layers styles in order:
1. **Base reset** — structural resets from `@dui/core`
2. **Component CSS** — layout and behavior from the component
3. **Theme base** — `:host` defaults (font, color)
4. **Theme component** — per-component aesthetics

### Dark mode

```html
<html data-theme="dark">
  <!-- All DUI components render in dark mode -->
</html>
```

Toggle by setting/removing `data-theme="dark"` on `<html>`. The theme's custom properties handle the color swap.

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
- [references/rules.md](references/rules.md) — Incorrect/correct code pairs for every critical rule
- [references/inspector.md](references/inspector.md) — Complete inspector API reference
