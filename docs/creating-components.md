# Creating Components

How to create a styled component by extending a [dui-primitives](https://github.com/deepfuturenow/dui-primitives) base class. This guide is written for anyone building components on top of `@dui/primitives` — whether in this repo or your own.

For the step-by-step procedure with all file creation and config updates, use the `/create-component` skill.

---

## The model

A DUI component is a styled subclass of an unstyled primitive:

```
DuiBadgePrimitive (from @dui/primitives)
  → structural CSS, ARIA, keyboard behavior
  → extends LitElement

DuiBadge (your component)
  → aesthetic CSS (tokens, variants, colors, sizing)
  → extends DuiBadgePrimitive
  → calls customElements.define() to self-register
```

The primitive handles the hard parts (accessibility, keyboard navigation, focus management). Your component adds the design — tokens, variant systems, colors, spacing, typography.

---

## Minimal example: Badge

### The primitive (from `@dui/primitives`)

This is what you're extending — you don't write this, it comes from the primitives package:

```typescript
// @dui/primitives/badge — provided by dui-primitives
export class DuiBadgePrimitive extends LitElement {
  static tagName = "dui-badge" as const;
  static override styles = [base, styles]; // structural CSS only

  override render(): TemplateResult {
    return html`<span part="root"><slot></slot></span>`;
  }
}
```

### Your styled component

```typescript
// your-components/src/badge/badge.ts
import { css } from "lit";
import { DuiBadgePrimitive } from "@dui/primitives/badge";
import "../_install.ts";  // inject design tokens (see below)

const styles = css`
  :host,
  :host([variant=""]),
  :host([variant="neutral"]) {
    --badge-bg: var(--foreground);
    --badge-fg: var(--background);
  }

  :host([variant="primary"]) {
    --badge-bg: var(--accent);
    --badge-fg: oklch(from var(--accent) 0.98 0.01 h);
  }

  :host([variant="danger"]) {
    --badge-bg: var(--destructive);
    --badge-fg: oklch(from var(--destructive) 0.98 0.01 h);
  }

  [part="root"] {
    gap: var(--space-1);
    height: var(--space-5);
    padding: 0 var(--space-2);
    border-radius: var(--radius-full);
    background: var(--badge-bg);
    color: var(--badge-fg);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
  }
`;

export class DuiBadge extends DuiBadgePrimitive {
  static override styles = [...DuiBadgePrimitive.styles, styles];
}

customElements.define(DuiBadge.tagName, DuiBadge);
```

That's the complete pattern:

1. **Import the primitive** and extend it
2. **Add aesthetic CSS** — variants, tokens, colors, sizing, interaction states
3. **Spread the primitive's styles** and append yours: `[...Primitive.styles, styles]`
4. **Call `customElements.define()`** at module level to self-register

---

## Style composition

Styles are layered via the Lit `styles` array. Later entries override earlier ones:

```
[...DuiBadgePrimitive.styles, styles]
     └── structural CSS              └── aesthetic CSS
         (from primitive)                (your addition)
```

Your aesthetic CSS targets the same `[part="root"]` and `:host` selectors that the primitive defines. Because it comes later in the array, it wins in the cascade.

**Never override `render()`** unless you need to change the DOM structure. The primitive owns the template — you only add CSS.

---

## Token injection

Design tokens (CSS custom properties like `--space-4`, `--accent`, `--font-sans`) need to be available globally so shadow DOM can inherit them. DUI injects them into `document.adoptedStyleSheets` via a side-effect module:

```typescript
// _install.ts — runs once via ES module caching
import { tokenSheet } from "./tokens/tokens.ts";
import { proseSheet } from "./tokens/prose.ts";

for (const sheet of [tokenSheet, proseSheet]) {
  if (sheet && !document.adoptedStyleSheets.includes(sheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
}
```

Every component imports this: `import "../_install.ts"`. ES module semantics guarantee it executes exactly once.

If you're building your own component set, create your own `_install.ts` with your own token stylesheet.

---

## The two-axis variant system

DUI components use a two-axis pattern for variants:

- **Variant** (intent): `neutral`, `primary`, `danger` — what the color means
- **Appearance** (treatment): `filled`, `outline`, `ghost`, `soft` — how it's rendered

This is implemented with two layers of CSS custom properties:

```css
/* Layer 1: Intent — sets --_intent-* private tokens */
:host([variant="primary"]) {
  --_intent-base: var(--accent);
  --_intent-base-fg: oklch(from var(--accent) 0.98 0.01 h);
  --_intent-subtle: var(--accent-subtle);
  --_intent-subtle-fg: var(--accent-text);
}

/* Layer 2: Appearance — maps --_intent-* to --button-* */
:host([appearance="filled"]) {
  --button-bg: var(--_intent-base);
  --button-fg: var(--_intent-base-fg);
}

:host([appearance="outline"]) {
  --button-bg: transparent;
  --button-fg: var(--_intent-subtle-fg);
  --button-border: var(--_intent-border);
}

/* Base element — consumes final --button-* values */
[part="root"] {
  background: var(--button-bg);
  color: var(--button-fg);
  border: var(--border-width-thin) solid var(--button-border);
}
```

Adding a new intent (e.g., `warning`) or a new appearance (e.g., `soft`) only requires adding the corresponding `:host([...])` block. The two axes compose independently.

Not every component needs two axes. Simple components (badge, spinner) may just use `variant` alone.

---

## What belongs in the component vs. the primitive

| In the primitive | In your component |
|-----------------|-------------------|
| `render()` — DOM structure, slots, ARIA | Aesthetic CSS — colors, spacing, typography |
| Behavioral properties (`disabled`, `orientation`, `type`) | Appearance properties (`variant`, `size`, `appearance`) |
| Keyboard handling, focus management | Variant system (`:host([variant="..."])` selectors) |
| Event dispatching (`customEvent()`) | Sizing system (`:host([size="..."])` selectors) |
| Structural CSS (`display`, `position`, `flex`) | Interaction states (hover, active, focus-visible) |
| Compound component coordination (Lit Context) | Transitions and animations |

**Variant and size properties** are typically bare reflected strings on the primitive (`accessor variant: string = ""`), but the primitive doesn't know or care what values exist. Your component's CSS defines the vocabulary through its `:host([variant="..."])` selectors.

---

## Index and exports

### Component index

The index does a side-effect import (which triggers `customElements.define()`) and re-exports the class:

```typescript
// src/badge/index.ts
import "./badge.ts";

export { DuiBadge } from "./badge.ts";
```

For compound components, import all sub-components:

```typescript
// src/accordion/index.ts
import "./accordion.ts";
import "./accordion-item.ts";

export { DuiAccordion } from "./accordion.ts";
export { DuiAccordionItem } from "./accordion-item.ts";
export { valueChangeEvent, openChangeEvent } from "@dui/primitives/accordion";
```

### Re-exporting events and types

Events and types are defined on the primitive. Re-export them from your component index so consumers have a single import path:

```typescript
export { navigateEvent } from "@dui/primitives/button";
export type { AccordionContext } from "@dui/primitives/accordion";
```

### Package exports (deno.json)

```json
{
  "exports": {
    "./badge": "./src/badge/index.ts",
    "./button": "./src/button/index.ts"
  }
}
```

---

## Properties

Properties are split between primitive and component:

**Primitive declares behavioral properties** (typed enums):

```typescript
// In the primitive — changes JS logic, DOM, or ARIA
@property({ type: Boolean, reflect: true })
accessor disabled = false;

@property()
accessor type: "button" | "submit" | "reset" = "button";
```

**Primitive declares appearance properties as bare strings** (component CSS defines the vocabulary):

```typescript
// In the primitive — just a reflected attribute
@property({ reflect: true })
accessor variant: string = "";

@property({ reflect: true })
accessor size: string = "";
```

**Your component does NOT re-declare properties** that the primitive already defines. The CSS handles variant/size logic entirely.

### Properties vs CSS variables

Properties are the **primary public API**. CSS variables are secondary:

| Use a property when... | Use a CSS variable when... |
|------------------------|---------------------------|
| Consumers frequently set the value | Default is almost always fine |
| Value needs TypeScript type checking | Value is a design token override |
| Value affects behavior or accessibility | Value coordinates parent → child (e.g., `--icon-size`) |

### When to create a CSS variable vs. rely on `::part()`

A variable earns its place if it meets at least one of: (1) variants toggle it, (2) other variables derive from it, (3) sizes toggle it, or (4) it needs ancestor cascading. If none apply, consumers use `::part(root)` instead. See [theming.md](./theming.md) for the full philosophy.

---

## Internal state and privacy

Use `@state()` with native private fields for internal state:

```typescript
@state() accessor #open = false;
```

All internal methods use native `#private`:

```typescript
#handleClick = (e: MouseEvent): void => {
  if (this.disabled) return;
  this.#open = !this.#open;
};
```

---

## Events

Use the `customEvent()` factory from `@dui/core/event`:

```typescript
import { customEvent } from "@dui/core/event";

export const navigateEvent = customEvent<{ href: string }>(
  "dui-navigate",
  { bubbles: true, composed: true },
);
```

Events are typically defined on the primitive (since they relate to behavior), then re-exported from the component index.

---

## Host styling: protect behavior-critical CSS

The `:host` element is a **public surface** — outer-document styles always beat `:host` rules. If a style is functionally critical (e.g., `display: none` for hiding), it must live on an internal shadow DOM element, not on `:host`.

### Safe on `:host`

- `display: block` / `display: inline-block` — sane defaults
- CSS custom property definitions
- `box-sizing: border-box`

### Must be on internal elements

- `display: none` toggled by state
- `visibility: hidden` / `opacity: 0` for functional state changes

---

## Compound components

### Decision rule

| Children need... | Pattern | Example |
|------------------|---------|---------|
| Simple data only | **Data-driven** — `.items` property, rendered in parent shadow DOM | Select options |
| Open-ended HTML content | **Lit Context** — light DOM children, context for coordination | Accordion items |

Compound component coordination (context, events) lives in the primitive. Your styled components just extend each sub-primitive.

---

## Icon support

Set `--icon-size` and `--icon-color` in your component's aesthetic CSS so slotted `<dui-icon>` elements size correctly:

```css
[part="root"] {
  --icon-size: var(--button-icon-size);
  --icon-color: var(--button-fg);
}
```

---

## Validation checklist

- [ ] Extends the primitive class (not `LitElement` directly)
- [ ] `import "../_install.ts"` for token injection
- [ ] `static override styles = [...Primitive.styles, styles]`
- [ ] `customElements.define()` called at module level
- [ ] Aesthetic CSS uses design tokens only — no hardcoded values
- [ ] Does NOT re-declare properties from the primitive
- [ ] Does NOT override `render()` (unless DOM changes are needed)
- [ ] Uses two-axis variant system where appropriate
- [ ] `index.ts` has side-effect import + named re-exports
- [ ] Events and types re-exported from primitive
- [ ] Export added to `deno.json`
- [ ] `deno check` passes
