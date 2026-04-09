# Creating Themes

How to create a new DUI theme from scratch. For the architectural overview, see [architecture.md](./architecture.md). For how theming works internally, see [theming.md](./theming.md).

---

## Overview

A DUI theme is an object that satisfies the `DuiTheme` interface:

```typescript
interface DuiTheme {
  tokens: CSSStyleSheet;      // Design tokens injected into the document
  base: CSSResult;             // Themed :host defaults for all components
  styles: Map<string, CSSResult>; // Tag name → component aesthetic styles
  prose?: CSSStyleSheet;       // Optional rich-text styling
}
```

You need three things: a **token stylesheet** (colors, spacing, typography, etc.), a **base style** (inherited `:host` defaults), and a **map of per-component aesthetic styles** (variants, sizes, interaction states).

Components you don't provide styles for still work — they just render with structural CSS only.

---

## Step 1: Pick 4 Primitive Colors

The entire color system derives from 4 OKLCH primitives. These are the only color values you choose:

```css
:root {
  --background:  oklch(0.96 0.01 80);      /* page canvas */
  --foreground:  oklch(0.20 0.02 60);      /* primary text direction */
  --accent:      oklch(0.58 0.16 55);      /* brand / interactive */
  --destructive: oklch(0.55 0.20 25);      /* errors, danger */
}

:root[data-theme="dark"] {
  --background:  oklch(0.15 0.015 80);
  --foreground:  oklch(0.93 0 0);
  --accent:      oklch(0.75 0.14 55);
  --destructive: oklch(0.70 0.18 25);
}
```

See [theming.md](./theming.md) for how these primitives feed the derived color system.

---

## Step 2: Define Derived Tokens

In the same `tokens.css`, add the 13 derived color tokens. These formulas are the same for every theme — copy them verbatim:

```css
:root {
  /* Surfaces — lightness offsets from background */
  --sunken:    oklch(from var(--background) calc(l - 0.03) c h);
  --surface-1: oklch(from var(--background) calc(l + 0.02) c h);
  --surface-2: oklch(from var(--background) calc(l + 0.05) c h);
  --surface-3: oklch(from var(--background) calc(l + 0.09) c h);

  /* Borders — foreground at reduced alpha */
  --border:        oklch(from var(--foreground) l c h / 0.15);
  --border-strong: oklch(from var(--foreground) l c h / 0.25);

  /* Text tiers — foreground at reduced alpha */
  --text-1: oklch(from var(--foreground) l c h / 0.90);
  --text-2: oklch(from var(--foreground) l c h / 0.63);
  --text-3: oklch(from var(--foreground) l c h / 0.45);

  /* Accent surfaces */
  --accent-subtle: oklch(from var(--accent) l c h / 0.10);
  --accent-text:   color-mix(in oklch, var(--accent) 80%, var(--foreground));

  /* Destructive surfaces */
  --destructive-subtle: oklch(from var(--destructive) l c h / 0.10);
  --destructive-text:   color-mix(in oklch, var(--destructive) 80%, var(--foreground));
}
```

---

## Step 3: Add Design Tokens

Below the color tokens, define your spacing, typography, border, radius, motion, sizing, and focus tokens. These are your design decisions — they don't need to match `theme-default`.

Use `theme-default/src/tokens.css` as a reference for the full set of tokens that existing components reference. The key categories:

```css
:root {
  /* Spacing (components reference --space-1 through --space-96) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-2_5: 0.625rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  /* ... */

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 0.9375rem;
  --font-weight-medium: 500;
  --line-height-snug: 1.375;
  --letter-spacing-tight: -0.01em;
  /* ... */

  /* Borders */
  --border-width-thin: 1px;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  /* ... */

  /* Component sizing */
  --component-height-sm: 2rem;
  --component-height-md: 2.25rem;
  --component-height-lg: 2.75rem;

  /* Motion */
  --duration-faster: 100ms;
  --duration-fast: 150ms;
  --ease-out-3: cubic-bezier(0.215, 0.61, 0.355, 1);
  /* ... */

  /* Focus ring */
  --focus-ring-color: var(--accent);
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
}
```

---

## Step 4: Add `@property` Declarations (optional but recommended)

Declare the component-level CSS custom properties your theme exposes. This enables browser type-checking, smooth transitions, and DevTools integration:

```css
/* my-theme/properties.css */
@property --button-bg {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.15 0 0);
}

@property --button-fg {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.97 0 0);
}

@property --button-radius {
  syntax: "<length>";
  inherits: true;
  initial-value: 0.375rem;
}

/* One per consumer-facing variable */
```

Only declare properties that consumers are expected to override. Internal tokens (`--space-4`, `--foreground`) are implementation details and should not be declared.

---

## Step 5: Create the Token Stylesheet

Combine properties and tokens into a single `CSSStyleSheet`:

```typescript
// my-theme/tokens.ts
import tokensCSS from "./tokens.css" with { type: "text" };
import propertiesCSS from "./properties.css" with { type: "text" };

const tokenSheet = new CSSStyleSheet();
tokenSheet.replaceSync(propertiesCSS + "\n" + tokensCSS);

export { tokenSheet };
```

If you don't have `@property` declarations, just use `tokensCSS` alone.

---

## Step 6: Create the Themed Base

Minimal `:host` defaults inherited by every component:

```typescript
// my-theme/base.ts
import { css } from "lit";

export const themedBase = css`
  :host {
    font-size: inherit;
    letter-spacing: inherit;
    font-optical-sizing: auto;
  }
`;
```

Keep this minimal. Visual defaults like `color`, `font-family`, and `line-height` typically live on `:root` in `tokens.css` so they cascade naturally through the document.

---

## Step 7: Write Per-Component Aesthetic Styles

One `CSSResult` per component. This is where variants, sizes, colors, borders, and interaction states live. Target `[part="root"]` for the component's root element and `:host([variant="..."])` for variant selectors:

```typescript
// my-theme/components/button.ts
import { css } from "lit";

export const buttonStyles = css`
  /* Intent tokens — set by variant */
  :host,
  :host([variant="neutral"]) {
    --button-bg: var(--foreground);
    --button-fg: var(--background);
    --button-border: transparent;
  }

  :host([variant="primary"]) {
    --button-bg: var(--accent);
    --button-fg: oklch(from var(--accent) 0.98 0.01 h);
    --button-border: transparent;
  }

  :host([variant="danger"]) {
    --button-bg: var(--destructive);
    --button-fg: oklch(from var(--destructive) 0.98 0.01 h);
    --button-border: transparent;
  }

  /* Sizes */
  :host {
    --button-height: var(--component-height-md);
    --button-padding-x: var(--space-2_5);
    --button-radius: var(--radius-md);
    --button-font-size: var(--font-size-sm);
  }

  :host([size="sm"]) {
    --button-height: var(--component-height-sm);
    --button-padding-x: var(--space-2);
    --button-font-size: var(--font-size-xs);
  }

  /* Root element styling */
  [part="root"] {
    padding: var(--space-2) var(--button-padding-x);
    height: var(--button-height);
    border-radius: var(--button-radius);
    background: var(--button-bg);
    color: var(--button-fg);
    font-size: var(--button-font-size);
    font-family: var(--font-sans);
    border: var(--border-width-thin) solid var(--button-border);
    transition: background var(--duration-faster) var(--ease-out-3);
  }

  /* Interaction states */
  [part="root"]:hover:not(:disabled) {
    filter: brightness(0.88);
  }

  [part="root"]:active:not(:disabled) {
    filter: brightness(0.80);
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"]:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
```

**Variant names are your choice.** `theme-default` uses `"neutral" | "primary" | "danger"` with `"filled" | "outline" | "ghost" | "link"` appearances, but your theme can define completely different vocabularies — or none at all.

---

## Step 8: Export the Theme Object

```typescript
// my-theme/index.ts
import type { DuiTheme } from "@dui/core/apply-theme";
import { tokenSheet } from "./tokens.ts";
import { themedBase } from "./base.ts";
import { buttonStyles } from "./components/button.ts";
import { switchStyles } from "./components/switch.ts";

export const myTheme: DuiTheme = {
  tokens: tokenSheet,
  base: themedBase,
  styles: new Map([
    ["dui-button", buttonStyles],
    ["dui-switch", switchStyles],
    // add entries as you style more components
  ]),
};
```

---

## Step 9: Bootstrap Your App

```typescript
import { applyTheme } from "@dui/core/apply-theme";
import { myTheme } from "./my-theme/index.ts";
import { DuiButton } from "@dui/components/button";
import { DuiSwitch } from "@dui/components/switch";

applyTheme({
  theme: myTheme,
  components: [DuiButton, DuiSwitch],
});
```

Call `applyTheme` once before any DUI component is used in the DOM. It injects your token stylesheet into `document.adoptedStyleSheets`, creates themed subclasses with composed styles, and registers the custom elements.

---

## Key Points

- **Only 4 colors to choose** — the 13 derived tokens use identical formulas for any theme.
- **Variant names are yours** — themes own the variant vocabulary, not the library.
- **Incremental adoption** — style only the components you use. Unstyled components still render with structural CSS.
- **No build step** — `applyTheme` does runtime subclassing. Works with any bundler.
- **Use `theme-default` as reference** — `packages/theme-default/src/` has working examples of every pattern described here.

---

## File Structure

A typical theme package:

```
my-theme/
├── index.ts            # DuiTheme export
├── tokens.ts           # CSSStyleSheet from tokens.css + properties.css
├── tokens.css          # Primitives, derived colors, spacing, typography, etc.
├── properties.css      # @property declarations (optional)
├── base.ts             # Themed :host defaults
└── components/
    ├── button.ts       # buttonStyles CSSResult
    ├── switch.ts       # switchStyles CSSResult
    └── ...             # One file per styled component
```
