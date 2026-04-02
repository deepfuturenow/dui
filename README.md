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

## Distribution & Packaging

DUI publishes four scoped npm packages under `@deepfuture`. The source workspace maps nearly 1:1 to the published packages — no import rewriting or assembly needed by consumers.

### npm packages

| Package | What's inside | Install size |
|---------|---------------|-------------|
| `@deepfuture/dui-core` | `applyTheme()`, `setup()`, event factory, base styles | ~8 KB |
| `@deepfuture/dui-components` | All unstyled component classes (structural CSS only) | ~100 KB |
| `@deepfuture/dui-theme-default` | Design tokens (`tokens.css`) + per-component aesthetic styles | ~22 KB |
| `@deepfuture/dui-cdn` | Pre-bundled: all components + default theme + Lit inlined | ~184 KB (78 KB gzip) |

### Install

**npm / pnpm / yarn** (recommended for bundled apps):

```bash
npm install @deepfuture/dui-core @deepfuture/dui-components @deepfuture/dui-theme-default
```

**Deno** via `npm:` specifiers:

```typescript
import { applyTheme } from "npm:@deepfuture/dui-core/apply-theme";
import { defaultTheme } from "npm:@deepfuture/dui-theme-default";
import { allComponents } from "npm:@deepfuture/dui-components/all";

applyTheme({ theme: defaultTheme, components: allComponents });
```

**CDN** (zero setup, script tag):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@deepfuture/dui-cdn/dui.min.js"></script>

<!-- All components are registered automatically -->
<dui-button variant="primary">Click me</dui-button>
```

### What gets published

Following [Lit's publishing guidance](https://lit.dev/docs/tools/publishing/):

- **Compiled JS + `.d.ts`** — TypeScript is compiled, but output is not bundled or minified. Consumer bundlers (Vite, Rollup, webpack) handle tree-shaking and deduplication of shared deps like Lit.
- **ES modules only** — `"type": "module"` with proper `exports` maps.
- **`HTMLElementTagNameMap`** — `@deepfuture/dui-components` ships a `global.d.ts` so `document.querySelector("dui-button")` is type-safe.
- **CSS tokens inlined** — `tokens.css` is inlined as a string in the JS module so no special CSS loader is needed. The raw `.css` file is also included for consumers who want it.

The CDN package (`@deepfuture/dui-cdn`) is the exception — it bundles everything with esbuild, inlines Lit and all dependencies, and auto-registers all components on import. Intended for prototyping and script-tag usage.

### Dependency graph

```
@deepfuture/dui-cdn  (zero deps — everything inlined)

@deepfuture/dui-components  →  @deepfuture/dui-core
                                ├── lit
                                └── @floating-ui/dom

@deepfuture/dui-theme-default  →  @deepfuture/dui-core
                                   └── lit
```

### Build scripts

All build scripts live in `scripts/` and run with Deno:

| Command | What it does |
|---------|-------------|
| `deno task build` | Compile all three packages → `dist/dui-core/`, `dist/dui-components/`, `dist/dui-theme-default/` |
| `deno task build:cdn` | Build CDN bundle → `dist/dui-cdn/dui.min.js` + `dui.js` |
| `deno task build:all` | Both of the above |
| `deno task publish` | Build + dry-run `npm publish` for all four packages |
| `deno task publish:live` | Build + real `npm publish` (requires `npm login` to `@deepfuture`) |
| `deno task version <bump>` | Lockstep version bump across all packages (`patch`, `minor`, `major`, or `x.y.z`) |

#### `scripts/build.ts`

Compiles each source package with `tsc`:
1. Runs `tsc` with `experimentalDecorators` to emit JS + `.d.ts` files
2. Rewrites all `@dui/*` workspace imports → `@deepfuture/dui-*`
3. Rewrites `.ts` import extensions → `.js`
4. Inlines `tokens.css` into the theme's JS modules (replaces `import ... with { type: "text" }`)
5. Generates `package.json` with proper `exports` map derived from each package's `deno.json`
6. Copies `global.d.ts` (HTMLElementTagNameMap) into the components output

#### `scripts/build-cdn.ts`

Creates a single pre-bundled ES module with esbuild:
1. Generates a virtual entry that imports all components + default theme and calls `applyTheme()`
2. Bundles with all deps inlined (Lit, @floating-ui/dom, etc.)
3. Outputs minified (`dui.min.js`) and unminified (`dui.js`) versions
4. Reports sizes including gzip estimate

#### `scripts/version.ts`

Updates `version` in all four `packages/*/deno.json` files simultaneously. All packages share the same version number (lockstep).

#### `scripts/publish.ts`

Orchestrates the full publish flow:
1. Runs `build.ts` and `build-cdn.ts`
2. Verifies all four `dist/*/package.json` files exist
3. Publishes in dependency order: core → components → theme-default → cdn

Dry-run by default. Pass `--publish` for real.

### CI publish

`.github/workflows/publish.yml` triggers on `v*` tags:

```bash
# To release:
deno task version 0.2.0
git add -A && git commit -m "chore: bump to 0.2.0"
git tag v0.2.0
git push && git push --tags
# CI builds and publishes all four packages
```

Requires an `NPM_TOKEN` secret configured in GitHub repo settings.

### Key source files

| File | Purpose |
|------|--------|
| `packages/components/src/all.ts` | Barrel export of all components + `allComponents` array |
| `packages/components/src/global.d.ts` | `HTMLElementTagNameMap` declarations for all DUI tags |
| `packages/core/src/setup.ts` | Convenience `setup()` function (alias for `applyTheme`) |
| `scripts/build.ts` | Main build: tsc → JS + .d.ts per package |
| `scripts/build-cdn.ts` | CDN bundle: esbuild → single file with all deps |
| `scripts/version.ts` | Lockstep version bump |
| `scripts/publish.ts` | Build + npm publish orchestrator |

---

## Documentation

- [Architecture](docs/architecture.md) — mental model, package responsibilities, design decisions
- [Creating components](docs/creating-components.md) — step-by-step guide for adding new components
- [Theming](docs/theming.md) — theme system, design tokens, writing component styles
- [Consuming](docs/consuming.md) — integrating dui into an app
- [Porting](docs/porting.md) — porting components from other libraries
- [Accessibility](docs/accessibility.md) — accessibility patterns and guidelines
- [Next steps](docs/next-steps.md) — roadmap and planned work
