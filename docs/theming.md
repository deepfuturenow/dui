# Theming

How the theme system works. For the architectural overview, see [architecture.md](./architecture.md).

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
| `tokens` | `CSSStyleSheet` | Design tokens declared on `:root`. Injected into `document.adoptedStyleSheets` so they cascade into all shadow DOMs. |
| `base` | `CSSResult` | Visual `:host` defaults applied to every component — font-family, color, line-height. |
| `styles` | `Map<string, CSSResult>` | Map from tag name (e.g., `"dui-button"`) to component-specific aesthetic CSS. |

---

## Design tokens

Tokens are CSS custom properties declared on `:root` in `packages/theme-default/src/tokens.css`. They're loaded as raw text and applied via `CSSStyleSheet`:

```typescript
// packages/theme-default/src/tokens.ts
import tokensCSS from "./tokens.css" with { type: "text" };

const tokenSheet = new CSSStyleSheet();
tokenSheet.replaceSync(tokensCSS);
export { tokenSheet };
```

### Token categories and naming patterns

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
  /* 1. Defaults on :host */
  :host {
    --badge-bg: var(--primary);
    --badge-fg: var(--primary-foreground);
    --badge-border: transparent;
  }

  /* 2. Variant overrides */
  :host([variant="secondary"]) {
    --badge-bg: var(--secondary);
    --badge-fg: var(--secondary-foreground);
  }

  :host([variant="destructive"]) {
    --badge-bg: var(--destructive);
    --badge-fg: var(--destructive-foreground);
  }

  /* 3. Internal elements consume variables */
  [part="root"] {
    gap: var(--space-1);
    height: var(--space-5);
    padding: 0 var(--space-2);
    border-radius: var(--radius-full);
    background-color: var(--badge-bg);
    color: var(--badge-fg);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    border: var(--border-width-thin) solid var(--badge-border);
  }
`;
```

### Hover patterns

Use `color-mix(in oklch, ...)` for perceptually correct hover effects:

```css
:host {
  --button-hover-bg: color-mix(in oklch, var(--button-bg) 95%, var(--foreground));
  --button-active-bg: color-mix(in oklch, var(--button-bg) 90%, var(--foreground));
}

[part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
  background-color: var(--button-hover-bg);
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

1. **Create tokens** — A `.css` file with `:root` custom properties. You can start from `theme-default/src/tokens.css` and change values.
2. **Create a base** — A `CSSResult` with `:host` visual defaults.
3. **Create component styles** — One `CSSResult` per component, using your tokens.
4. **Export a `DuiTheme` object** — Wire up tokens, base, and styles map.

```typescript
import type { DuiTheme } from "@dui/core/apply-theme";

export const myTheme: DuiTheme = {
  tokens: myTokenSheet,
  base: myThemedBase,
  styles: new Map([
    ["dui-button", myButtonStyles],
    ["dui-badge", myBadgeStyles],
  ]),
};
```

Components not in the styles map will still get `tokens` + `base`, just no component-specific aesthetic CSS.
