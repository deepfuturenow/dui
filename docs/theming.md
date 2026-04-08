# Theming

How the theme system works. For the architectural overview, see [architecture.md](./architecture.md). For how consumers customize components, see [styling.md](./styling.md).

---

## Styling philosophy: variables + `::part`

DUI uses a two-layer approach to styling:

- **CSS custom properties (variables)** — for the variant/state system. These are the small set of values that variants, sizes, and derived states actually toggle.
- **`::part(root)`** — for everything else. Consumers style any CSS property directly on the exposed part — gradients, filters, transforms, clip-paths, backdrop-filters, blend modes — without the library needing to pre-declare a variable.

A variable earns its place if it meets at least one of these criteria:

1. **Variants toggle it.** E.g., `--button-bg` is swapped by `:host([variant="destructive"])`. Without the variable, each variant would need to repeat the full `[part="root"]` rule.
2. **Other variables derive from it.** E.g., `--button-hover-bg: color-mix(in oklch, var(--button-bg) 95%, var(--foreground))`. The hover color is computed from the base color — this composition only works with variables.
3. **Sizes toggle it.** E.g., `--button-height`, `--button-padding-x`, `--button-font-size` change per size. Same reason as variants.
4. **Ancestor cascading.** A parent can set `--button-bg` to theme all descendant buttons. `::part` doesn't cascade from ancestors.

If a value doesn't meet any of these, it should not be a variable. The consumer uses `::part(root)` instead.

### Consumer usage model

```css
/* Variables — for what the variant system controls */
dui-button {
  --button-bg: linear-gradient(135deg, pink, purple);
}

/* ::part(root) — for everything else (unlimited CSS) */
dui-button::part(root) {
  filter: brightness(1.15);
  box-shadow: 0 0 16px oklch(0.7 0.2 280 / 0.4);
  clip-path: var(--clip-bevel);
  backdrop-filter: blur(12px);
}
dui-button::part(root):hover {
  filter: brightness(1.25);
  transform: translateY(-1px);
}
dui-button::part(root):active {
  transform: scale(0.97);
}

/* Ancestor cascading — variables cascade, ::part doesn't */
.my-card {
  --button-bg: var(--accent);
}
```

### Why `background` not `background-color`

Theme styles use the full `background` shorthand instead of `background-color`. This means variables like `--button-bg` accept not just colors but also gradients, images, and multiple layers — no special handling needed.

### Transition readiness

Theme component styles include broad `transition-property` lists (e.g., `background, box-shadow, filter, transform, border-color`) so that expressive overrides via `::part(root)` animate smoothly without the consumer needing to redeclare transitions. All transition declarations (`transition-property`, `transition-duration`, `transition-timing-function`) live in the theme, not the component — a different theme can change or remove animations entirely.

---

## Theme interface

```typescript
interface DuiTheme {
  /** Token stylesheet injected into document.adoptedStyleSheets. */
  tokens: CSSStyleSheet;
  /** Themed :host defaults (font-family, color, line-height). */
  base: CSSResult;
  /** Tag name → component aesthetic styles. */
  styles: Map<string, CSSResult>;
}
```

| Field | Type | Purpose |
|-------|------|---------|
| `tokens` | `CSSStyleSheet` | Design tokens and `@property` declarations. Injected into `document.adoptedStyleSheets` so they cascade into all shadow DOMs. |
| `base` | `CSSResult` | Visual `:host` defaults applied to every component — font-family, color, line-height. |
| `styles` | `Map<string, CSSResult>` | Map from tag name (e.g., `"dui-button"`) to component-specific aesthetic CSS. |

---

## How theme-default uses tokens

Tokens are CSS custom properties that `theme-default` declares on `:root` in `packages/theme-default/src/tokens.css`. They're the theme's internal design vocabulary — spacing scale, color palette, typography, borders, etc.

```typescript
// packages/theme-default/src/tokens.ts
import tokensCSS from "./tokens.css" with { type: "text" };
import propertiesCSS from "./properties.css" with { type: "text" };

const tokenSheet = new CSSStyleSheet();
tokenSheet.replaceSync(propertiesCSS + "\n" + tokensCSS);
export { tokenSheet };
```

A different theme can use entirely different token names, values, or no tokens at all. Tokens are an implementation detail of each theme.

### Token categories and naming patterns (theme-default)

| Category | Pattern | Examples |
|----------|---------|---------|
| **Spacing** | `--space-{n}` | `--space-0`, `--space-1`, `--space-2_5`, `--space-12` |
| **Typography** | `--font-{family}`, `--font-size-{size}`, `--font-weight-{weight}` | `--font-sans`, `--font-size-sm`, `--font-weight-medium` |
| **Line height** | `--line-height-{name}` | `--line-height-tight`, `--line-height-normal` |
| **Letter spacing** | `--letter-spacing-{name}` | `--letter-spacing-tight`, `--letter-spacing-normal` |
| **Borders** | `--radius-{size}`, `--border-width-{size}` | `--radius-md`, `--radius-full`, `--border-width-thin` |
| **Elevation** | `--shadow-{size}`, `--z-{layer}` | `--shadow-md`, `--z-popover` |
| **Motion** | `--duration-{speed}`, `--ease-{name}` | `--duration-fast`, `--ease-out-3` |
| **Component sizing** | `--component-height-{size}` | `--component-height-sm`, `--component-height-md` |
| **Focus** | `--focus-ring-{prop}` | `--focus-ring-color`, `--focus-ring-width` |
| **Colors** | `--{semantic-name}` | `--primary`, `--foreground`, `--destructive` |

### Color tokens

Colors use OKLCH values and are split into light/dark palettes:

```css
/* Light theme (default) */
:root:not([data-theme="dark"]) {
  --primary: oklch(0.205 0.042 265);
  --primary-foreground: oklch(0.985 0.002 248);
  --background: oklch(0.97 0 0);
  --foreground: oklch(0.145 0.005 286);
  /* ... */
}

/* Dark theme */
:root[data-theme="dark"] {
  --primary: oklch(0.985 0.002 243);
  --primary-foreground: oklch(0.205 0.042 243);
  --background: oklch(0.26 0.019 243);
  --foreground: oklch(0.9353 0.0173 243);
  /* ... */
}
```

Dark mode is toggled by setting `data-theme="dark"` on `<html>`.

### Semantic color pairs

Most colors come in pairs — a background and its foreground:

| Background | Foreground | Use case |
|-----------|-----------|----------|
| `--primary` | `--primary-foreground` | Primary actions |
| `--secondary` | `--secondary-foreground` | Secondary actions |
| `--destructive` | `--destructive-foreground` | Destructive actions |
| `--success` | `--success-foreground` | Success states |
| `--warning` | `--warning-foreground` | Warning states |
| `--info` | `--info-foreground` | Informational states |
| `--muted` | `--muted-foreground` | Subdued content |
| `--card` | `--card-foreground` | Card surfaces |
| `--popover` | `--popover-foreground` | Popover surfaces |

Additional standalone tokens: `--background`, `--foreground`, `--border`, `--input`, `--input-bg`, `--ring`, `--accent`, `--accent-foreground`, `--scrim`.

---

## How theme-default declares its API via `@property`

Theme-default registers its component-level CSS custom properties using CSS `@property` declarations in `packages/theme-default/src/properties.css`. These are injected into `document.adoptedStyleSheets` alongside the tokens.

```css
@property --button-bg {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.205 0.042 265);
}

@property --button-height {
  syntax: "<length>";
  inherits: true;
  initial-value: 2rem;
}
```

### Benefits

- **Type safety** — the browser rejects invalid values and falls back to `initial-value` rather than silently inheriting garbage
- **Smooth transitions** — registered properties with known types can be interpolated, enabling animated variant transitions
- **Self-documenting** — the `@property` block is simultaneously the machine-readable schema and the human-readable reference
- **DevTools integration** — Chrome DevTools shows registered properties with syntax and initial value in computed styles

### Which properties are declared

Not every CSS custom property needs `@property`. The rule:

- **Declared:** Component-level properties that consumers override (`--button-bg`, `--button-radius`, `--spinner-size`, etc.) — these benefit from type checking, fallbacks, and transition interpolation
- **Not declared:** Internal tokens referenced only within the theme's own stylesheets (`--space-4`, `--primary`) — these are implementation details that don't need browser-level type enforcement

### Constraint: global scope

`@property` registrations are global — they cannot be scoped to a shadow root. Two themes on the same page could conflict. This is acceptable for DUI's model where one theme is active at a time.

---

## How theme-default defines variants

Variant names are theme-default's vocabulary. Components declare `variant` and `size` as bare reflected strings — the component doesn't know or care what values exist. The theme defines them via `:host([variant="..."])` CSS selectors.

### Button variants

| Value | Appearance |
|-------|-----------|
| `"default"` / `"primary"` | Filled primary background |
| `"secondary"` | Filled secondary background |
| `"destructive"` | Filled destructive background |
| `"outline"` | Bordered, input background |
| `"ghost"` | Transparent, hover muted |
| `"link"` | Transparent, underline on hover |

### Button sizes

| Value | Height |
|-------|--------|
| `"sm"` | `--component-height-sm` |
| `"md"` (default) | `--component-height-md` |
| `"lg"` | `--component-height-lg` |

### Badge variants

`"default"`, `"secondary"`, `"destructive"`, `"outline"`, `"success"`, `"warning"`, `"info"`

### Textarea variants

`"default"`, `"ghost"` (no border/background)

### Spinner variants

`"pulse"` (pulsing circle), `"lucide-loader"` (rotating lines), `"lucide-loader-circle"` (rotating arc)

### Spinner/toolbar sizes

`"sm"`, `"md"`, `"lg"` (toolbar also has `"xl"`)

### Sidebar variants

`"sidebar"` (default), `"floating"`, `"inset"`

A different theme can offer entirely different variant names. For example, a "Material" theme might use `"filled"`, `"tonal"`, `"elevated"`, `"text"` for buttons instead.

### TypeScript types for variant safety

Theme-default exports its variant vocabularies as TypeScript types for consumers who want type safety:

```typescript
import type { ButtonVariant, ButtonSize } from "@dui/theme-default/types";
```

These types are exported from the theme package, not the component package. A different theme exports different types.

---

## Base styles

The themed base (`packages/theme-default/src/base.ts`) sets visual defaults on `:host` for every component:

```typescript
export const themedBase = css`
  :host {
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: inherit;
    letter-spacing: inherit;
    line-height: var(--line-height-normal);
    font-optical-sizing: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
```

This is distinct from `@dui/core/base` which provides structural resets (box-sizing, margin/padding resets). The theme base is opinionated — it sets font family, color, and rendering.

---

## Component styles

Aesthetic CSS for a specific component. The pattern:

1. **Define component-scoped CSS variables on `:host`** with token defaults
2. **Override variables in `:host([attr])` selectors** for variants/sizes
3. **Internal elements consume the variables** via `var()`

### Example: badge styles

```typescript
// packages/theme-default/src/components/badge.ts
import { css } from "lit";

export const badgeStyles = css`
  /* Variables: only what variants toggle */
  :host {
    --badge-bg: var(--primary);
    --badge-fg: var(--primary-foreground);
    --badge-border: transparent;
  }

  /* Variant overrides */
  :host([variant="secondary"]) {
    --badge-bg: var(--secondary);
    --badge-fg: var(--secondary-foreground);
  }

  :host([variant="destructive"]) {
    --badge-bg: var(--destructive);
    --badge-fg: var(--destructive-foreground);
  }

  /* Base appearance — uses `background` (not background-color)
     so variables also accept gradients and images */
  [part="root"] {
    gap: var(--space-1);
    height: var(--space-5);
    padding: 0 var(--space-2);
    border-radius: var(--radius-full);
    background: var(--badge-bg);
    color: var(--badge-fg);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    border: var(--border-width-thin) solid var(--badge-border);
  }
`;
```

### Hover patterns

Use `color-mix(in oklch, ...)` for perceptually correct hover effects. Derived hover/active colors are declared as top-level variables so they compose with the base color:

```css
:host {
  --button-bg: var(--primary);
  --button-hover-bg: color-mix(in oklch, var(--button-bg) 95%, var(--foreground));
  --button-active-bg: color-mix(in oklch, var(--button-bg) 90%, var(--foreground));
}

[part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
  background: var(--button-hover-bg);
}
```

### Focus ring

```css
[part="root"]:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 var(--space-0_5) var(--background),
    0 0 0 var(--space-1) var(--ring);
}
```

### Disabled states

```css
[part="root"]:disabled,
[part="root"][aria-disabled="true"] {
  opacity: 0.2;
  cursor: not-allowed;
}
```

---

## Registering component styles

After creating a component's theme styles, register them in the theme:

```typescript
// packages/theme-default/src/index.ts
import { badgeStyles } from "./components/badge.ts";

export const defaultTheme: DuiTheme = {
  tokens: tokenSheet,
  base: themedBase,
  styles: new Map([
    ["dui-button", buttonStyles],
    ["dui-switch", switchStyles],
    ["dui-badge", badgeStyles],  // Add new entry
  ]),
};

// Also re-export for direct access
export { badgeStyles } from "./components/badge.ts";
```

Add an export to `packages/theme-default/deno.json`:

```json
{
  "exports": {
    "./components/badge": "./src/components/badge.ts"
  }
}
```

---

## Creating a new theme

To create a theme from scratch:

1. **Choose your token system** (optional) — A `.css` file with `:root` custom properties. You can start from `theme-default/src/tokens.css` or invent your own. Or skip tokens entirely and hardcode values in component styles.
2. **Define `@property` declarations** — Register the component-level CSS custom properties your theme uses, with types and default values. This provides type safety, transition interpolation, and a self-documenting API.
3. **Create a base** — A `CSSResult` with `:host` visual defaults.
4. **Create component styles** — One `CSSResult` per component. Define your own variant names (they don't have to match `theme-default`'s).
5. **Export a `DuiTheme` object** — Wire up tokens, base, and styles map.
6. **Export TypeScript types** — Export your variant/size vocabularies so consumers get type safety.

```typescript
import type { DuiTheme } from "@dui/core/apply-theme";

export const myTheme: DuiTheme = {
  tokens: myTokenSheet, // includes your @property declarations + tokens
  base: myThemedBase,
  styles: new Map([
    ["dui-button", myButtonStyles],
    ["dui-badge", myBadgeStyles],
  ]),
};
```

Components not in the styles map will still get `tokens` + `base`, just no component-specific aesthetic CSS.
