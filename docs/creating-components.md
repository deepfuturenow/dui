# Creating Components

Conventions and patterns for unstyled DUI components. For the step-by-step procedure (file creation, config updates, verification), use the `/create-component` skill.

---

## File structure

Every component creates files in two packages:

```
packages/components/src/{name}/
  {name}.ts              # Component class + structural styles
  index.ts               # Re-exports class + types + family array

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
  accessor variant: string = "";

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
accessor variant: string = "";

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

### The dividing line: component types vs. theme types

Every property falls into one of two categories:

**Stays in the component (typed enum)** — changes behaviour, DOM structure, or ARIA semantics:

| Component | Property | Type | Why it stays |
|-----------|----------|------|--------------|
| Toggle Group | `type` | `"single" \| "multiple"` | Changes JS selection logic |
| Accordion | `orientation` | `"vertical" \| "horizontal"` | Changes keyboard nav + `aria-orientation` |
| Separator | `orientation` | `"horizontal" \| "vertical"` | Changes `role` presentation |
| Sidebar | `collapsible` | `"offcanvas" \| "icon" \| "none"` | Changes DOM rendering |
| Sidebar | `side` | `"left" \| "right"` | Changes layout structure |
| Tooltip | `side` | `"top" \| "bottom"` | Drives positioning math |
| Textarea | `resize` | `"none" \| "vertical" \| "horizontal" \| "both" \| "auto"` | Changes JS auto-grow behaviour |

**Moves to theme (bare string)** — only changes CSS variable values:

| Component | Property | Declaration |
|-----------|----------|-------------|
| Button | `variant`, `size` | `accessor variant: string = ""` |
| Badge | `variant` | `accessor variant: string = ""` |
| Spinner | `variant`, `size` | `accessor variant: string = ""` |
| Textarea | `variant` | `accessor variant: string = ""` |
| Sidebar | `variant` | `accessor variant: string = ""` |
| Toolbar | `size` | `accessor size: string = ""` |

**The principle:** If the property changes JavaScript logic, DOM output, or ARIA attributes, it belongs in the component with a typed enum. If it only changes CSS variable values, it belongs in the theme — the component declares it as a bare reflected string.

### Properties vs CSS variables

Properties are the **primary public API**. CSS variables are secondary:

| Use a property when... | Use a CSS variable when... |
|------------------------|---------------------------|
| Consumers frequently set the value | Default is almost always fine |
| Value needs TypeScript type checking | Value is a design token override |
| Value affects behavior or accessibility | Value coordinates parent → child (e.g., `--icon-size`) |

**Defaults always use design tokens** — never hardcoded `px` or `rem`.

### When to create a CSS variable vs. rely on `::part()`

A variable earns its place in the theme if it meets at least one of: (1) variants toggle it, (2) other variables derive from it (e.g., hover colors via `color-mix`), (3) sizes toggle it, or (4) it needs ancestor cascading. If none apply, consumers use `::part(root)` instead — no variable needed. See [theming.md](./theming.md) for the full philosophy.

**Do not** create purely aesthetic attributes on components (e.g., `rounded`, `square`). These belong in the theme layer — consumers achieve the same via variables (e.g., `--button-radius: var(--radius-full)`).

---

## What components must NOT do

- **No token references** — Components contain only structural CSS. No `var(--space-*)`, `var(--accent)`, or any design token.
- **No variant union types** — Variant names are theme concerns. Declare `variant` and `size` as `string = ""`.
- **No variant logic** — No `switch` statements or conditional rendering based on variant values. The component just reflects the attribute; the theme handles the visual meaning.
- **No aesthetic CSS** — No colors, fonts, spacing values, borders, or shadows. Those belong in the theme.

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

## Host styling: protect behavior-critical CSS

The `:host` element is a **public surface** — outer-document styles always beat `:host` rules in the cascade, regardless of specificity. This is per-spec: the host is intentionally an "open surface" the consumer controls.

**Principle:** If a style is functionally critical to the component's behavior (e.g., `display: none` for hiding), it must live on an internal shadow DOM element — not on `:host`. Putting critical styles on `:host` creates a fragile contract where any external `dui-my-component { display: flex }` silently breaks the component.

### What's safe on `:host`

- `display: block` / `display: inline-block` — sane defaults replacing the browser's `inline`
- CSS custom property definitions (`--foo: bar`)
- `box-sizing: border-box`

### What must be on internal elements

- `display: none` toggled by state (show/hide behavior)
- `visibility: hidden` / `opacity: 0` for functional state changes
- Any style where an external override would silently **break** the component

### Pattern: state-driven visibility

For components that toggle visibility (tabs panels, command items, filtered elements), hide the internal element instead of the host:

```css
:host {
  display: block;
}

/* Target shadow DOM child — external styles can't reach .Item */
:host([data-hidden]) .Item {
  display: none;
}
```

For components that always need hidden slot content (portal-based popups), use a wrapper:

```css
:host {
  display: contents; /* host generates no box */
}

.slot-wrapper {
  display: none; /* always hidden — content is rendered via portal */
}
```

### Pattern: always-rendered wrapper

When a component needs to hide even when returning `nothing` (e.g., tabs panels without `keepMounted`), always render a wrapper div so there's always an internal element to hide:

```typescript
override render(): TemplateResult {
  const isActive = this.#isActive;
  return html`
    <div class="wrapper" ?hidden=${!isActive}>
      ${isActive || this.keepMounted
        ? html`<div part="panel" role="tabpanel"><slot></slot></div>`
        : nothing}
    </div>
  `;
}
```

```css
.wrapper { display: contents; }  /* transparent when visible */
.wrapper[hidden] { display: none; }  /* protected hiding */
```

The `data-hidden` attribute can still be set on the host as a **state signal** for external code, but it should not be relied on for CSS hiding.

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
}
```

**Structural properties:** `display`, `position`, `flex`/`grid` layout, `box-sizing`, `cursor`, `user-select`, `overflow`, `pointer-events`.

> **Note:** `transition-property`, `transition-duration`, and `transition-timing-function` all belong in the theme. The theme decides what animates and how fast. Exception: behavioral transitions where the component relies on `transitionend` events (e.g., panel height animations, popup open/close) — these keep `transition-property` in the component.

### Aesthetic CSS (lives in the theme)

Colors, fonts, spacing values, borders, shadows, animations.

```css
:host {
  --badge-bg: var(--accent);
  --badge-fg: oklch(from var(--accent) 0.98 0.01 h);
}

[part="root"] {
  gap: var(--space-1);
  height: var(--space-5);
  padding: 0 var(--space-2);
  border-radius: var(--radius-full);
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
```

> **Note:** Use `background` (the shorthand), not `background-color`. This lets variables accept gradients and images, not just colors.

**Aesthetic properties:** `color`, `background`, `border`, `border-radius`, `padding`, `margin`, `gap`, `height`/`width` (when sizing), `font-*`, `letter-spacing`, `line-height`, `box-shadow`, `opacity`, `transition-property`, `transition-duration`, `transition-timing-function`.

**When in doubt:** If the property references a design token (`var(--space-*)`, `var(--accent)`), it's aesthetic.

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

## Exports

### `index.ts` — re-export class + family array

```typescript
// packages/components/src/badge/index.ts
import { DuiBadge } from "./badge.ts";
export { DuiBadge };

export const badgeFamily = [DuiBadge];
```

For compound components, the family includes all sub-components:

```typescript
// packages/components/src/accordion/index.ts
import { DuiAccordion } from "./accordion.ts";
import { DuiAccordionItem } from "./accordion-item.ts";
export { DuiAccordion, DuiAccordionItem };

export const accordionFamily = [DuiAccordion, DuiAccordionItem];
```

Consumers use families for convenient registration: `applyTheme({ components: [...accordionFamily] })`.

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

---

## Validation checklist

- [ ] **Extends `LitElement`** — not a custom base class
- [ ] **`static tagName`** with `as const` — no `@customElement` decorator
- [ ] **`static override styles = [base, styles]`** — `base` from `@dui/core/base`
- [ ] **Structural CSS only** — no colors, fonts, or spacing values in the component
- [ ] **No behavior-critical styles on `:host`** — `display: none`, `visibility: hidden`, `opacity: 0` for state must be on internal elements
- [ ] **No token references** — no `var(--space-*)`, `var(--accent)`, etc.
- [ ] **No variant union types** — `variant` and `size` are `string = ""`
- [ ] **`part="root"`** on root internal element
- [ ] **Reflected properties** for variant/size (`@property({ reflect: true })`)
- [ ] **All decorated properties** use the `accessor` keyword
- [ ] **All internal state** uses `@state() accessor #name` (native private)
- [ ] **All private methods** use native `#private` syntax
- [ ] **All lifecycle overrides** use the `override` keyword
- [ ] **Events** use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] **JSDoc** with `@slot`, `@csspart`, `@fires` as needed
- [ ] **`index.ts`** re-exports class + family array (no variant types — those go in the theme)
- [ ] **Package exports** added to `deno.json`
- [ ] **Theme styles** created in `packages/theme-default/src/components/`
- [ ] **Theme styles registered** in `defaultTheme.styles` map
- [ ] **Theme exports** added to theme's `deno.json`
- [ ] **Theme variant types** added to `packages/theme-default/src/types.ts`
- [ ] **`@property` declarations** added to `properties.css` for consumer-facing variables
- [ ] **All token values** use design tokens — no hardcoded `px` or `rem`
- [ ] **Provenance comment** at top of file (when ported from external library)
