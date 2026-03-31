# DUI

Unstyled Lit web component library with composable themes.

Components provide structure and behavior with zero visual opinions. Themes provide all aesthetics — colors, spacing, typography, borders. Swap the theme to completely change the look without touching component code.

## Packages

| Package | Description |
|---------|-------------|
| `@dui/core` | Base reset styles, `applyTheme()`, event factory, floating UI utilities |
| `@dui/components` | Unstyled component classes (structural CSS only) |
| `@dui/theme-default` | Design tokens, themed base, per-component aesthetic styles |
| `@dui/docs` | Dev server for visual testing |

## Components

| Component | Tag |
|-----------|-----|
| Accordion | `<dui-accordion>`, `<dui-accordion-item>` |
| Badge | `<dui-badge>` |
| Button | `<dui-button>` |
| Combobox | `<dui-combobox>` |
| Icon | `<dui-icon>` |
| Menu | `<dui-menu>`, `<dui-menu-item>` |
| Popover | `<dui-popover>`, `<dui-popover-trigger>`, `<dui-popover-popup>`, `<dui-popover-close>` |
| Scroll Area | `<dui-scroll-area>` |
| Switch | `<dui-switch>` |
| Tooltip | `<dui-tooltip>`, `<dui-tooltip-trigger>`, `<dui-tooltip-popup>` |

## Quick start

```bash
# Run the docs dev server (port 4040)
deno task dev
```

```typescript
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { DuiButton } from "@dui/components/button";
import { DuiTooltip, DuiTooltipTrigger, DuiTooltipPopup } from "@dui/components/tooltip";

applyTheme({
  theme: defaultTheme,
  components: [DuiButton, DuiTooltip, DuiTooltipTrigger, DuiTooltipPopup],
});
```

```html
<dui-tooltip>
  <dui-tooltip-trigger>
    <dui-button>Hover me</dui-button>
  </dui-tooltip-trigger>
  <dui-tooltip-popup>Extra context here</dui-tooltip-popup>
</dui-tooltip>
```

## How it works

`applyTheme()` takes unstyled component classes and a theme, creates themed subclasses with composed styles, and registers them as custom elements. No build step, no decorators, no code generation — just a function call.

Style composition order: component structural CSS → theme base → theme component styles.

## Tech stack

- Runtime: [Deno](https://deno.com)
- UI framework: [Lit](https://lit.dev)
- Build: [esbuild](https://esbuild.github.io)

## Theme Editor

A visual dev tool for editing design token values in real time. Renders a sidebar with token controls alongside an iframe preview of the component gallery.

```bash
deno task dev
# Navigate to http://localhost:4040/theme-editor.html
```

- Edit color tokens with OKLCH sliders (Lightness, Chroma, Hue, Alpha)
- Edit non-color tokens (spacing, typography, borders, etc.) with text inputs
- Changes update the iframe preview instantly
- Modified tokens are marked with a blue dot
- "Copy tokens.css" exports a complete `tokens.css` with your overrides applied
- Overrides persist across page reloads via localStorage

## Inspector

A built-in dev tool for inspecting DUI components at runtime. It provides both a visual overlay UI and a programmatic API designed for LLM agents via Chrome DevTools.

### Visual UI

Toggle with **Ctrl+Shift+I**. When active:

1. **Hover** any DUI component to see a highlight overlay with its tag name
2. **Click** to open a detail panel showing:
   - **Properties** — Lit reactive properties with current values and types
   - **Design Tokens** — all CSS custom properties used in the component's shadow styles, with resolved computed values and color swatches
   - **Style Layers** — the adopted stylesheet stack (`base-reset` → `structural` → `theme-base` → `theme-component`) with the CSS properties each layer sets
   - **Slots** — named slots and how many nodes are assigned
   - **CSS Parts** — exposed `::part()` names and their target elements
   - **Shadow Summary** — child count, slot count, part count
3. **Esc** closes the panel first, then deactivates the inspector on a second press

### Programmatic API

The inspector exposes `window.__dui_inspect()` for use by LLM agents via Chrome DevTools MCP `evaluate_script`:

```js
// Inspect all DUI components on the page
__dui_inspect()
// → { timestamp, themeMode, componentCount, components: [...] }

// Inspect a specific component by selector
__dui_inspect("dui-button")
// → { tagName, className, properties, tokens, styleLayers, slots, parts, shadowSummary }
```

The introspection functions are also available as ES module exports:

```typescript
import { inspectPage, inspectElement, discoverComponents } from "./inspector";
```

### How it's built

The inspector is a self-contained module at `packages/docs/src/inspector/` with three layers:

| Layer | Files | Role |
|-------|-------|------|
| **Lib** | `introspect.ts`, `style-layers.ts`, `types.ts` | Pure functions that walk the DOM, read Lit's `elementProperties`, scan `adoptedStyleSheets` for tokens, and map stylesheets to named layers |
| **Components** | `inspector-overlay.ts`, `inspector-panel.ts` | Lit elements for the highlight overlay and the detail panel |
| **View** | `inspector-view.ts` | Root orchestrator — handles keyboard shortcuts, mouse/pointer/focus events, and composes the overlay + panel |

The entry point (`packages/docs/src/inspector.ts`) mounts `<inspector-view>` onto the page and wires up the `window.__dui_inspect` global. It's bundled as a separate esbuild entry point (`inspector.js`) alongside the docs app, loaded via a `<script>` tag in `index.html`.

## Documentation

- [Architecture](docs/architecture.md) — mental model, package responsibilities, design decisions
- [Creating components](docs/creating-components.md) — step-by-step guide for adding new components
- [Theming](docs/theming.md) — theme system, design tokens, writing component styles
- [Consuming](docs/consuming.md) — integrating dui into an app
- [Porting](docs/porting.md) — porting components from other libraries
- [Accessibility](docs/accessibility.md) — accessibility patterns and guidelines
- [Next steps](docs/next-steps.md) — roadmap and planned work
