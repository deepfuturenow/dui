# Creating Components

Step-by-step guide for adding a new unstyled component to dui.

---

## File structure

Every component creates files in two packages:

```
packages/components/src/{name}/
  {name}.ts              # Component class + structural styles
  index.ts               # Re-exports class + types
  register.ts            # Standalone registration (non-theme usage)

packages/theme-default/src/components/
  {name}.ts              # Aesthetic styles for this component
```

---

## The component class

Here's the complete pattern, using `dui-badge` as a minimal example:

```typescript
// packages/components/src/badge/badge.ts
import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "info";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }
`;

/**
 * `<dui-badge>` — A badge/chip component for status indicators and labels.
 *
 * @slot - Badge content — text and/or icons.
 * @csspart root - The badge span element.
 */
export class DuiBadge extends LitElement {
  static tagName = "dui-badge" as const;

  static override styles = [base, styles];

  @property({ reflect: true })
  accessor variant: BadgeVariant = "default";

  override render(): TemplateResult {
    return html`
      <span part="root">
        <slot></slot>
      </span>
    `;
  }
}
```

### Key rules

| Rule | Example |
|------|---------|
| Extends `LitElement` directly | `class DuiBadge extends LitElement` |
| `static tagName` with `as const` | `static tagName = "dui-badge" as const` |
| No `@customElement` decorator | Registration happens via `applyTheme` |
| `static override styles = [base, styles]` | `base` from `@dui/core/base`, `styles` = structural only |
| `part="root"` on root internal element | `<span part="root">` |
| JSDoc with `@slot`, `@csspart`, `@fires` | Document the public API |

---

## Properties

Every public prop uses `@property()` with the `accessor` keyword.

```typescript
@property({ reflect: true })
accessor variant: ButtonVariant = "default";

@property({ type: Boolean, reflect: true })
accessor disabled = false;

@property()
accessor href: string | undefined = undefined;
```

**Rules:**

- `reflect: true` for properties that should appear as HTML attributes (booleans, strings, enums)
- `type: Boolean` for boolean props — Lit handles attribute-to-property conversion
- `type: String` (default, can omit) for string props
- `type: Number` for numeric props
- `type: Array` or `type: Object` for complex props — do NOT reflect these
- For controlled/uncontrolled patterns: support `defaultChecked` (initial) + `checked` (controlled). Track internally with `@state`.

### Properties vs CSS variables

Properties are the **primary public API**. CSS variables are secondary:

| Use a property when... | Use a CSS variable when... |
|------------------------|---------------------------|
| Consumers frequently set the value | Default is almost always fine |
| Value needs TypeScript type checking | Value is a design token override |
| Value affects behavior or accessibility | Value coordinates parent → child (e.g., `--icon-size`) |

**Defaults always use design tokens** — never hardcoded `px` or `rem`.

---

## Internal state and privacy

Use `@state()` with native private fields for internal state:

```typescript
@state() accessor #open = false;
@state() accessor #internalValue = "";
```

All internal methods use native `#private`:

```typescript
#handleClick = (e: MouseEvent): void => {
  if (this.disabled) return;
  this.#open = !this.#open;
};

#handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    this.#handleClick(e);
  }
};
```

Reference them in templates with `this.#methodName`:

```typescript
override render(): TemplateResult {
  return html`
    <button part="root" @click=${this.#handleClick} @keydown=${this.#handleKeyDown}>
      <slot></slot>
    </button>
  `;
}
```

---

## Events

Use the `customEvent()` factory from `@dui/core/event`:

```typescript
import { customEvent } from "@dui/core/event";

/** Fired when a button with `href` is clicked. */
export const navigateEvent = customEvent<{ href: string }>(
  "dui-navigate",
  { bubbles: true, composed: true },
);

// Dispatch in handler:
this.dispatchEvent(navigateEvent({ href: this.href }));
```

**Naming convention:** kebab-case describing the state change — `checked-change`, `value-change`, `open-change`.

Always set `bubbles: true` and `composed: true` so events cross shadow DOM boundaries.

**Public vs internal:** Custom events are the public API for consumers. For internal parent-child coordination in compound components, use Lit Context instead.

---

## Structural vs aesthetic CSS

This is the core distinction in the unstyled architecture.

### Structural CSS (lives in the component)

Layout, display, behavioral properties. No visual opinions.

```css
:host {
  display: inline-block;
}

[part="root"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition-property: background-color, box-shadow;
}
```

**Structural properties:** `display`, `position`, `flex`/`grid` layout, `box-sizing`, `cursor`, `user-select`, `overflow`, `transition-property` (but not `transition-duration`), `pointer-events`.

### Aesthetic CSS (lives in the theme)

Colors, fonts, spacing values, borders, shadows, animations.

```css
:host {
  --badge-bg: var(--primary);
  --badge-fg: var(--primary-foreground);
}

[part="root"] {
  gap: var(--space-1);
  height: var(--space-5);
  padding: 0 var(--space-2);
  border-radius: var(--radius-full);
  background-color: var(--badge-bg);
  color: var(--badge-fg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
```

**Aesthetic properties:** `color`, `background-color`, `border`, `border-radius`, `padding`, `margin`, `gap`, `height`/`width` (when sizing), `font-*`, `letter-spacing`, `line-height`, `box-shadow`, `opacity`, `transition-duration`, `transition-timing-function`.

**When in doubt:** If the property references a design token (`var(--space-*)`, `var(--primary)`), it's aesthetic.

---

## Slots and `::part()` exposure

### Slots

Use `<slot>` for content projection. Default (unnamed) slot for primary content:

```typescript
override render(): TemplateResult {
  return html`
    <button part="root">
      <slot name="icon-start"></slot>
      <slot></slot>
      <slot name="icon-end"></slot>
    </button>
  `;
}
```

### `::part()` for external styling

Expose significant internal elements via `part`:

- Root internal element: `part="root"`
- Thumb: `part="thumb"`
- Trigger: `part="trigger"`

---

## Lifecycle

All lifecycle methods use `override`. All private methods use `#private`.

| Method | When to use |
|--------|-------------|
| `protected override firstUpdated()` | One-time setup after first render |
| `protected override willUpdate(changed: PropertyValues)` | Compute derived values before render |
| `protected override updated(changed: PropertyValues)` | Side effects after render |
| `override disconnectedCallback()` | Cleanup (remove listeners, disconnect observers) |
| `@query() accessor #el` | Reference a shadow DOM element |

---

## Compound components

### Decision rule

| Children need... | Pattern | Example |
|------------------|---------|---------|
| Simple data only | **Data-driven** — `.items` property, rendered in parent shadow DOM | Select options |
| Open-ended HTML content | **Lit Context** — light DOM children, context for coordination | Accordion items |

### Lit Context pattern

Define a context type with state + action callbacks. Parent provides via `@provide`, children consume via `@consume` with `subscribe: true`.

```typescript
// Context type
export type AccordionContext = {
  openValues: string[];
  disabled: boolean;
  toggle: (value: string) => void;
};

export const accordionContext = createContext<AccordionContext>("dui-accordion");
```

Key principles:
- No imperative coordination — no `querySelectorAll`, no `this.closest()`
- Fully reactive — context changes propagate automatically
- Immutable updates — parent creates new context via spread, never mutates

---

## Field context integration

Form controls (checkbox, input, switch, etc.) consume `FieldContext` for integration with `<dui-field>`:

```typescript
import { consume } from "@lit/context";
import { fieldContext, type FieldContext } from "../field/field-context.ts";

@consume({ context: fieldContext, subscribe: true })
@state()
accessor #fieldCtx!: FieldContext;
```

Use definite assignment (`!`), not `| undefined`. Access with optional chaining: `this.#fieldCtx?.disabled`.

---

## Icon support

Set `--icon-size` and `--icon-fg` in theme styles for slotted icons:

```css
[part="root"] {
  --icon-size: var(--badge-icon-size);
  --icon-fg: var(--badge-fg);
}
```

| Token | Size | Typical use |
|-------|------|-------------|
| `var(--space-3)` | 12px | Badges, compact indicators |
| `var(--space-4)` | 16px | Small buttons, inline icons |
| `var(--space-4_5)` | 18px | Default button icons |
| `var(--space-5)` | 20px | Large button icons |

---

## Exports and registration

### `index.ts` — re-export class + types

```typescript
// packages/components/src/badge/index.ts
export { DuiBadge } from "./badge.ts";
export type { BadgeVariant } from "./badge.ts";
```

### `register.ts` — standalone registration

For non-theme usage (testing, simple apps):

```typescript
// packages/components/src/badge/register.ts
import { DuiBadge } from "./index.ts";

if (!customElements.get(DuiBadge.tagName)) {
  customElements.define(DuiBadge.tagName, DuiBadge);
}
```

### Add to package exports

In `packages/components/deno.json`:

```json
{
  "exports": {
    "./badge": "./src/badge/index.ts"
  }
}
```

### Add to theme

See [theming.md](./theming.md) for adding theme styles and registering in the theme's styles map.

---

## Worked example: adding `dui-badge`

### 1. Component class (`packages/components/src/badge/badge.ts`)

```typescript
import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

export type BadgeVariant =
  | "default" | "secondary" | "destructive" | "outline"
  | "success" | "warning" | "info";

const styles = css`
  :host { display: inline-block; }
  [part="root"] { display: inline-flex; align-items: center; }
`;

export class DuiBadge extends LitElement {
  static tagName = "dui-badge" as const;
  static override styles = [base, styles];

  @property({ reflect: true })
  accessor variant: BadgeVariant = "default";

  override render(): TemplateResult {
    return html`<span part="root"><slot></slot></span>`;
  }
}
```

### 2. Index (`packages/components/src/badge/index.ts`)

```typescript
export { DuiBadge } from "./badge.ts";
export type { BadgeVariant } from "./badge.ts";
```

### 3. Register (`packages/components/src/badge/register.ts`)

```typescript
import { DuiBadge } from "./index.ts";
if (!customElements.get(DuiBadge.tagName)) {
  customElements.define(DuiBadge.tagName, DuiBadge);
}
```

### 4. Theme styles (`packages/theme-default/src/components/badge.ts`)

```typescript
import { css } from "lit";

export const badgeStyles = css`
  :host {
    --badge-bg: var(--primary);
    --badge-fg: var(--primary-foreground);
    --badge-border: transparent;
    --badge-icon-size: var(--space-3);
  }

  :host([variant="secondary"]) {
    --badge-bg: var(--secondary);
    --badge-fg: var(--secondary-foreground);
  }

  /* ... more variants ... */

  [part="root"] {
    --icon-size: var(--badge-icon-size);
    --icon-fg: var(--badge-fg);
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

### 5. Register in theme (`packages/theme-default/src/index.ts`)

```typescript
import { badgeStyles } from "./components/badge.ts";

export const defaultTheme: DuiTheme = {
  tokens: tokenSheet,
  base: themedBase,
  styles: new Map([
    // ... existing entries ...
    ["dui-badge", badgeStyles],
  ]),
};
```

### 6. Add exports to `deno.json`

In `packages/components/deno.json`, add `"./badge": "./src/badge/index.ts"`.

In `packages/theme-default/deno.json`, add `"./components/badge": "./src/components/badge.ts"`.

---

## Validation checklist

- [ ] **Extends `LitElement`** — not a custom base class
- [ ] **`static tagName`** with `as const` — no `@customElement` decorator
- [ ] **`static override styles = [base, styles]`** — `base` from `@dui/core/base`
- [ ] **Structural CSS only** — no colors, fonts, or spacing values in the component
- [ ] **`part="root"`** on root internal element
- [ ] **Reflected properties** for variant/size (`@property({ reflect: true })`)
- [ ] **All decorated properties** use the `accessor` keyword
- [ ] **All internal state** uses `@state() accessor #name` (native private)
- [ ] **All private methods** use native `#private` syntax
- [ ] **All lifecycle overrides** use the `override` keyword
- [ ] **Events** use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] **JSDoc** with `@slot`, `@csspart`, `@fires` as needed
- [ ] **`index.ts`** re-exports class + types
- [ ] **`register.ts`** provides standalone registration
- [ ] **Package exports** added to `deno.json`
- [ ] **Theme styles** created in `packages/theme-default/src/components/`
- [ ] **Theme styles registered** in `defaultTheme.styles` map
- [ ] **Theme exports** added to theme's `deno.json`
- [ ] **All token values** use design tokens — no hardcoded `px` or `rem`
- [ ] **Provenance comment** at top of file (when ported from external library)
