# Architecture

## Two-layer architecture

```
┌─────────────────────────────────────────────┐
│  Theme (owns all aesthetics)                │
│  ├── @property declarations (typed API)     │
│  ├── Tokens (theme-internal, optional)      │
│  ├── Base styles                            │
│  └── Component styles + variant selectors   │
├─────────────────────────────────────────────┤
│  Library                                    │
│  ├── @dui/components (structural only)      │
│  └── @dui/core (reset, applyTheme,         │
│       event factory, floating UI utils)     │
└─────────────────────────────────────────────┘
```

The **library** provides structure and behaviour with zero visual opinions. **Themes** own all aesthetics — tokens, variant vocabularies, component-level CSS custom property contracts, and `@property` declarations.

`theme-default` ships a comprehensive token system and a ShadCN-inspired variant vocabulary — but those are its design choices, not library requirements. A different theme can use entirely different token names, variant names, or no tokens at all.

Swap the theme to completely change the look without touching component code.

## How `applyTheme` works

Called once before any DUI component is used. Here's what it does step by step:

1. **Injects tokens** — Adds the theme's `CSSStyleSheet` (tokens + `@property` declarations) to `document.adoptedStyleSheets`. Idempotent — skips if already present.
2. **Creates themed subclasses** — For each component class, creates `class extends Base` with composed styles.
3. **Registers custom elements** — Calls `customElements.define(tagName, ThemedClass)`. Skips if already registered.

```typescript
applyTheme({
  theme: defaultTheme,
  components: [DuiButton, DuiSwitch, DuiBadge],
});
```

### Style composition order

The composed styles array is built in this order:

```
[...component structural styles, theme base, theme component styles]
```

1. **Component structural styles** — `base` reset + component's own layout CSS
2. **Theme base** — `:host` visual defaults (font-family, color, line-height)
3. **Theme component styles** — Aesthetic CSS for this specific component (colors, spacing, borders, variant selectors)

Later entries override earlier ones. This means theme styles always win over structural defaults.

## Package responsibilities

### `@dui/core`

| Export | Purpose |
|--------|---------|
| `@dui/core/base` | Structural reset styles (box-sizing, margin/padding resets, reduced-motion) |
| `@dui/core/event` | `customEvent()` factory for typed custom events |
| `@dui/core/apply-theme` | `applyTheme()` function and `DuiTheme` interface |
| `@dui/core/popup-coordinator` | Ensures only one popup is open at a time |
| `@dui/core/floating-popup-utils` | Floating UI positioning helpers |
| `@dui/core/floating-portal-controller` | Reactive controller for portal + floating UI lifecycle |

### `@dui/components`

Unstyled component classes. Each component is a subpath export:

```typescript
import { DuiButton } from "@dui/components/button";
import { DuiSwitch } from "@dui/components/switch";
import { DuiBadge } from "@dui/components/badge";
```

Components provide structure and behaviour only. Properties like `variant` and `size` are bare reflected strings — the component doesn't know or care what values exist. Variant names are defined by the theme.

### `@dui/theme-default`

| Export | Purpose |
|--------|---------|
| `@dui/theme-default` | `defaultTheme` object (tokens + `@property` declarations + base + styles map) |
| `@dui/theme-default/types` | TypeScript variant/size types (`ButtonVariant`, `ButtonSize`, etc.) |
| `@dui/theme-default/components/button` | `buttonStyles` CSSResult |
| `@dui/theme-default/components/switch` | `switchStyles` CSSResult |
| `@dui/theme-default/components/badge` | `badgeStyles` CSSResult |

The theme includes its own token system, variant vocabulary, and typed CSS custom property API via `@property` declarations. These are all `theme-default`'s design choices — a different theme defines its own.

### `@dui/docs`

Dev server for visual testing. Run with `cd packages/docs && deno task dev`. Uses esbuild with custom plugins to resolve `@dui/*` imports and load `.css` as raw text.

## Key design decisions

**Why unstyled base?** — Themes are swappable without modifying components. Clear separation between structure (component author's job) and aesthetics (theme author's job). Smaller bundles when tree-shaking unused themes.

**Why runtime subclassing?** — No build step required. Works with any bundler. `applyTheme` is a single function call — no decorators, no build plugins, no code generation.

**Why themes own tokens and variants?** — Tokens (`--primary`, `--space-4`) are aesthetic vocabulary. Variant names (`"primary" | "ghost"`) are aesthetic semantics. Both are design decisions that belong in the theme, not the library. This lets themes be fully self-contained aesthetic systems.

**Why `@property` declarations?** — CSS `@property` provides type safety (browser rejects invalid values), smooth transitions (registered properties can be interpolated), self-documenting API (machine-readable schema), and DevTools integration.

## Import paths

`@dui/*` mappings are defined in each package's `deno.json` exports field. In a consuming app, add import map entries pointing to the dui packages:

```json
{
  "imports": {
    "@dui/core": "./path/to/dui/packages/core/src/index.ts",
    "@dui/core/base": "./path/to/dui/packages/core/src/base.ts",
    "@dui/core/apply-theme": "./path/to/dui/packages/core/src/apply-theme.ts",
    "@dui/components/button": "./path/to/dui/packages/components/src/button/index.ts"
  }
}
```

Within the dui workspace, Deno resolves `@dui/*` automatically from the workspace member exports.
