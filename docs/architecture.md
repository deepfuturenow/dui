# Architecture

## Two-layer inheritance model

```
┌─────────────────────────────────────────────┐
│  Templates (pre-composed patterns)          │
│  @dui/templates                             │
│  Combine styled components + vanilla HTML   │
├─────────────────────────────────────────────┤
│  Styled Components                          │
│  @dui/components                            │
│  Extend primitives with aesthetic CSS,      │
│  design tokens, variant systems.            │
│  Self-register via customElements.define()  │
├─────────────────────────────────────────────┤
│  Primitives (separate repo: dui-primitives) │
│  @dui/primitives — unstyled structural      │
│     base classes (accessibility, ARIA,      │
│     keyboard, layout) + core utilities      │
│     (base reset, event factory, floating    │
│     UI, popup coordinator)                  │
└─────────────────────────────────────────────┘
```

**Primitives** provide structure and behavior with zero visual opinions — accessibility, keyboard navigation, ARIA attributes, and layout. **Components** extend primitives with aesthetic CSS: design tokens, variant/appearance/size systems, colors, spacing, typography. **Templates** sit on top: pre-composed patterns that combine styled components with layout.

## How components work

Each component is a class that extends its corresponding primitive and adds aesthetic styles:

```typescript
// packages/components/src/badge/badge.ts
import { css } from "lit";
import { DuiBadgePrimitive } from "@dui/primitives/badge";
import "../_install.ts";

const styles = css`
  :host([variant="primary"]) {
    --badge-bg: var(--accent);
    --badge-fg: oklch(from var(--accent) 0.98 0.01 h);
  }

  [part="root"] {
    background: var(--badge-bg);
    color: var(--badge-fg);
    font-family: var(--font-sans);
    border-radius: var(--radius-full);
    /* ... */
  }
`;

export class DuiBadge extends DuiBadgePrimitive {
  static override styles = [...DuiBadgePrimitive.styles, styles];
}

customElements.define(DuiBadge.tagName, DuiBadge);
```

Three things happen:

1. **Style inheritance** — `[...DuiBadgePrimitive.styles, styles]` layers aesthetic CSS on top of structural CSS. Later entries win in the cascade.
2. **Self-registration** — `customElements.define()` at module scope means importing the component registers it. No setup function needed.
3. **Token injection** — `import "../_install.ts"` injects the design token stylesheet into `document.adoptedStyleSheets` (idempotent — runs once via ES module caching).

### Style composition order

```
[primitive structural CSS,  component aesthetic CSS]
 └── base reset              └── tokens, variants,
     layout                      colors, sizing,
     behavioral CSS              interaction states
```

The aesthetic layer always overrides structural defaults.

## Self-registration model

Components self-register on import. There's no setup function, no `applyTheme()`, no configuration:

```typescript
// Importing registers the component
import "@dui/components/button";

// Now <dui-button> works in HTML
```

Design tokens (`tokens.css`, `prose.css`) are injected into `document.adoptedStyleSheets` via the `_install.ts` side-effect module. Every component imports it, but ES module caching ensures it runs exactly once.

Templates work the same way — they import their component dependencies as side effects:

```typescript
// packages/templates/src/feed/feed-item.ts
import "@dui/components/badge";  // registers dui-badge

export class DuiFeedItem extends LitElement {
  // renders <dui-badge> in its template
}

customElements.define(DuiFeedItem.tagName, DuiFeedItem);
```

## Package responsibilities

### `@dui/primitives` (from dui-primitives)

Unstyled structural base classes plus core utilities. Everything lives in a single package.

**Core utilities** (subpath exports under `./core/*`):

| Export | Purpose |
|--------|---------|
| `@dui/primitives/core/base` | Structural reset styles (box-sizing, margin/padding resets, reduced-motion) |
| `@dui/primitives/core/event` | `customEvent()` factory for typed custom events |
| `@dui/primitives/core/popup-coordinator` | Ensures only one popup is open at a time |
| `@dui/primitives/core/floating-popup-utils` | Floating UI positioning helpers |
| `@dui/primitives/core/floating-portal-controller` | Reactive controller for portal + floating UI lifecycle |
| `@dui/primitives/core/dom` | DOM utilities |

> **Note:** In the dui workspace, the `@dui/core/*` import alias still works (mapped in `deno.json`). On npm, core is published as subpath exports of `@deepfuture/dui-primitives` (e.g. `@deepfuture/dui-primitives/core/base`).

**Primitive base classes** — each primitive is a subpath export:

```typescript
import { DuiButtonPrimitive } from "@dui/primitives/button";
import { DuiBadgePrimitive } from "@dui/primitives/badge";
```

Primitives provide structure and behavior only. Properties like `variant` that only affect CSS are **not** declared on primitives — those are added by the styled component layer. Properties that affect behavior, DOM structure, or ARIA (like `disabled`, `orientation`, `type`) are defined here with typed enums.

### `@dui/components`

Styled components that extend primitives. Each import triggers self-registration:

```typescript
import "@dui/components/button";  // registers <dui-button>
import "@dui/components/badge";   // registers <dui-badge>
```

Components add:
- **Design tokens** — injected via `_install.ts` into `document.adoptedStyleSheets`
- **Variant/appearance/size CSS** — `:host([variant="primary"])` selectors that map to CSS custom properties
- **Aesthetic CSS** — colors, spacing, typography, borders, shadows, transitions
- **`customElements.define()`** — self-registration

### `@dui/templates`

Pre-composed UI patterns built from DUI components. Templates are Lit web components that render styled components + vanilla HTML, styled exclusively with design tokens so they adapt to dark mode and token overrides.

| Export | Purpose |
|--------|---------|
| `@dui/templates/feed` | Feed & events templates (`DuiFeedItem`, etc.) |
| `@dui/templates/dashboard` | Dashboard patterns (`DuiSectionPanel`, `DuiPageHeader`) |
| `@dui/templates/metrics` | Stat cards, gauges, progress bars |
| `@dui/templates/data` | Key-value pairs, tables |
| `@dui/templates/content` | Briefings, empty states |
| `@dui/templates/media` | Avatar rows, media grids |
| `@dui/templates/all` | All template families |

### `@dui/inspector` (separate repo: dui-inspector)

Runtime component inspector — style layers, token resolution, live editing. Consumed via npm as `@deepfuture/dui-inspector`.

## Key design decisions

**Why two-layer inheritance?** — Clean separation between "hard parts" (ARIA, keyboard, focus) and "design parts" (tokens, variants, colors). Primitives are reusable across different design systems. Anyone can build their own styled component library on top of dui-primitives.

**Why self-registration?** — `import "@dui/components/button"` just works. No setup function, no dependency on a specific registration mechanism. ES module semantics guarantee idempotent execution.

**Why tokens in `document.adoptedStyleSheets`?** — Design tokens cascade into shadow DOM via CSS custom property inheritance. Injecting once at the document level means every component can read them without per-component token imports.

**Why not a separate theme package?** — Aesthetic CSS is tightly coupled to the primitive it extends (it targets the same `[part="root"]`, the same `:host` selectors). Keeping them together in one class makes the inheritance explicit and eliminates a coordination layer.

## Import paths

In the dui workspace, `@dui/core/*` and `@dui/primitives/*` are resolved via import mappings in the root `deno.json` that point to the dui-primitives repo on disk. `@dui/core/*` is a convenience alias that maps to the `core/` subdirectory of the primitives package. Published packages use npm dependency resolution — everything is under `@deepfuture/dui-primitives`.

```json
// Root deno.json — dev-time import mappings
{
  "imports": {
    "@dui/core/base": "../dui-primitives/packages/primitives/src/core/base.ts",
    "@dui/primitives/button": "../dui-primitives/packages/primitives/src/button/index.ts"
  }
}
```
