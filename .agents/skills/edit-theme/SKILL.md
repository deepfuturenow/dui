---
name: edit-theme
description: Edit or extend a DUI theme — modify design tokens, add or change component styles, adjust variant systems, or tweak the color system. Use when the user says "change the theme", "edit tokens", "update button styles", "add a variant", "change the accent color", "modify the theme", "adjust spacing", or wants to make any aesthetic change to a DUI theme. Works for theme-default or any custom theme.
---

# Edit a DUI Theme

Modify an existing DUI theme's tokens, component styles, variant system, or color primitives.

## Prerequisites

Read these reference files before making changes:

1. `docs/theming.md` — color system, alpha compositing, surface depth model, styling philosophy
2. `docs/creating-themes.md` — theme structure, step-by-step creation guide
3. The specific file you're editing (e.g., `packages/theme-default/src/components/button.ts`)

For `theme-default` specifically, also skim:
- `packages/theme-default/src/tokens.css` — design token values
- `packages/theme-default/src/properties.css` — `@property` declarations
- `packages/theme-default/src/typography.ts` — `type()` helper for bundled type steps

## Theme anatomy

A DUI theme is a `DuiTheme` object with four parts:

```
theme/
├── tokens.css        → Design tokens (spacing, typography, colors, borders, motion)
├── properties.css    → @property declarations for consumer-facing CSS variables
├── base.ts           → Themed :host defaults (font-family, color, line-height)
├── components/       → Per-component aesthetic styles (one file per component)
│   ├── button.ts
│   ├── badge.ts
│   └── ...
└── index.ts          → DuiTheme export (tokens + base + styles map)
```

For `theme-default`, these live in `packages/theme-default/src/`.

---

## Common tasks

### Changing the 4 color primitives

The entire color system derives from 4 OKLCH values. Edit `tokens.css`:

```css
:root {
  --background:  oklch(L C H);    /* page canvas */
  --foreground:  oklch(L C H);    /* primary text */
  --accent:      oklch(L C H);    /* brand / interactive */
  --destructive: oklch(L C H);    /* errors, danger */
}

:root[data-theme="dark"] {
  --background:  oklch(L C H);
  --foreground:  oklch(L C H);
  --accent:      oklch(L C H);
  --destructive: oklch(L C H);
}
```

**Do not change the derived token formulas** (surfaces, borders, text tiers). They are universal — the same relative-color operations work for any set of primitives.

### Changing spacing, typography, or borders

Edit the relevant section of `tokens.css`. All spacing uses the `--space-*` scale, typography uses `--font-size-*` / `--font-weight-*` / `--line-height-*` / `--letter-spacing-*`, borders use `--radius-*` and `--border-width-*`.

When changing font families, also update the `<link>` tags or font imports in the consuming app.

### Changing component sizing

Components reference `--component-height-sm`, `--component-height-md`, `--component-height-lg` from tokens. Change these to resize all components proportionally.

---

## Editing component styles

Each component's aesthetic CSS lives in a single file: `components/{name}.ts`. The file exports a `CSSResult` that targets `:host(...)` selectors and `[part="root"]`.

### File to edit

For `theme-default`: `packages/theme-default/src/components/{name}.ts`

### Style architecture

Component styles follow a layered pattern:

```
1. Intent layer    → :host([variant="..."]) sets --_intent-* private tokens
2. Appearance layer → :host([appearance="..."]) maps --_intent-* to --component-*
3. Size layer      → :host([size="..."]) swaps dimension tokens
4. Root styling    → [part="root"] reads the final --component-* values
5. States          → :hover, :active, :focus-visible, :disabled
```

Not every component uses all layers. Simple components (separator, spinner) may only have root styling + states.

### Key conventions

**Private vs. public tokens:**
- `--_intent-*`, `--_interact`, `--_select` — private (prefixed with `--_`). Internal plumbing, not consumer-facing.
- `--button-bg`, `--button-fg`, `--badge-border` — public. Consumers can override these. Must have matching `@property` declarations in `properties.css`.

**The `--_interact` pattern for hover/active:**
```css
:host {
  --_interact: 0;
}

[part="root"]:hover:not(:disabled) {
  --_interact: 0.05;
}

[part="root"]:active:not(:disabled) {
  --_interact: 0.10;
}

[part="root"] {
  background: oklch(from var(--button-bg) l c h / calc(1 - var(--_interact)));
  /* or for transparent backgrounds: */
  background: oklch(from var(--foreground) l c h / var(--_interact));
}
```

Standard alpha values: hover = 0.05, active = 0.10, selected = 0.10, disabled = `opacity: 0.4`.

**Typography via the `type()` helper** (`theme-default` only):
```typescript
import { type } from "../typography.ts";

[part="root"] {
  ${type("sm")}
  /* Expands to: font-size + letter-spacing + line-height */
}
```

**Focus ring pattern:**
```css
[part="root"]:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 var(--focus-ring-offset) var(--background),
    0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
}
```

---

## Adding a new variant

To add a variant to an existing component:

### 1. Add the intent mapping

In the component's style file, add a new `:host([variant="..."])` rule that sets the `--_intent-*` private tokens:

```css
:host([variant="success"]) {
  --_intent-base: var(--success);
  --_intent-base-fg: oklch(from var(--success) 0.98 0.01 h);
  --_intent-subtle: oklch(from var(--success) l c h / 0.10);
  --_intent-subtle-fg: color-mix(in oklch, var(--success) 80%, var(--foreground));
}
```

If the variant uses a new color primitive, add the primitive to `tokens.css` first.

### 2. Update the TypeScript types (if applicable)

In `theme-default`, variant types live in `src/types.ts`:

```typescript
export type ButtonVariant = "neutral" | "primary" | "danger" | "success";
```

### 3. Update the component registry

In `packages/docs/src/component-registry.ts`, update the `themeAttributes` entry for the component to include the new variant value.

### 4. Add a demo

Update the component's docs page to demonstrate the new variant.

---

## Adding a new appearance

Appearances are the second axis of the variant system (filled, outline, ghost, link). To add one:

### 1. Add the appearance mapping

In the component's style file, add a new `:host([appearance="..."])` rule that maps `--_intent-*` to `--component-*`:

```css
:host([appearance="tonal"]) {
  --button-bg: var(--_intent-subtle);
  --button-fg: var(--_intent-subtle-fg);
  --button-border: transparent;
}
```

### 2. Update types and registry

Same pattern as adding a variant — update `types.ts` and `component-registry.ts`.

---

## Adding a new size

Add a `:host([size="..."])` rule that swaps dimension tokens:

```css
:host([size="xs"]) {
  --button-height: var(--space-6);
  --button-padding-x: var(--space-1_5);
  --button-font-size: var(--font-size-2xs);
  --button-icon-size: var(--space-3);
}
```

Update `types.ts` and the component registry.

---

## Adding a @property declaration

When adding a new consumer-facing CSS custom property, add a `@property` declaration in `properties.css`:

```css
@property --button-icon-gap {
  syntax: "<length>";
  inherits: true;
  initial-value: 0.375rem;
}
```

Rules for when a CSS variable should have a `@property` declaration:
1. Variants toggle it
2. Other variables derive from it
3. Sizes toggle it
4. Ancestor cascading is intended (parent sets it for all descendants)

Internal tokens (`--space-4`, `--_interact`) do NOT get `@property` declarations.

---

## Wiring a new component's styles into the theme

When a new unstyled component has been created (via `/create-component`) and needs aesthetic styles:

### 1. Create the style file

Create `packages/theme-default/src/components/{name}.ts`:

```typescript
import { css } from "lit";

export const {name}Styles = css`
  /* Component aesthetic styles */
`;
```

### 2. Add to the theme index

In `packages/theme-default/src/index.ts`:

```typescript
import { {name}Styles } from "./components/{name}.ts";

// In the styles Map:
["dui-{name}", {name}Styles],

// In the re-exports:
export { {name}Styles } from "./components/{name}.ts";
```

### 3. Add to deno.json exports

In `packages/theme-default/deno.json`:

```json
"./components/{name}": "./src/components/{name}.ts"
```

### 4. Add to serve.ts

In `packages/docs/serve.ts`, add the export to the `@dui/theme-default` workspace entry.

### 5. Add @property declarations

For any consumer-facing CSS variables, add declarations to `properties.css`.

---

## Verification

After editing theme styles:

1. **`deno check`** — run from the repo root to catch type errors
2. **Dev server** — `cd packages/docs && deno task dev`, then visually inspect the component
3. **Dark mode** — toggle with the theme button in the docs site to verify both modes
4. **Other components** — if you changed tokens or derived colors, spot-check several components to ensure nothing broke
5. **Inspect** — if the inspector is available, run `__dui_inspect('dui-{name}')` to verify token values at runtime

---

## Rules

- **Never hardcode colors** — use design tokens (`--foreground`, `--accent`, etc.) or relative-color operations (`oklch(from ...)`)
- **Never hardcode sizes** — use `--space-*`, `--font-size-*`, `--component-height-*`
- **All transitions use token durations** — `var(--duration-fast)`, `var(--duration-normal)`
- **Disabled state = `opacity: 0.4` + `cursor: not-allowed`** — don't change colors for disabled
- **Private tokens use `--_` prefix** — never expose these as a consumer API
- **The `background` shorthand**, not `background-color` — so variables accept gradients
- **`@property` declarations only for consumer-facing variables** — not internal tokens
