---
name: port-base-ui
description: Port a Base UI React component into the DUI unstyled architecture. Use when the user asks to convert, port, or rewrite a Base UI component, or wants a DUI version of a Base UI component. Triggers include "port base-ui", "Base UI to DUI", "convert Base UI", or any request pairing Base UI with DUI/Lit.
---

# Base UI → DUI Port

Port a Base UI (`@base-ui/react`) component into DUI's unstyled component + theme architecture.

## Overview

Base UI is an unstyled React component library with composable "parts" (e.g. `Switch.Root`, `Switch.Thumb`). Porting to DUI means:

1. React parts → single Lit `LitElement` class (simple) or Lit Context compound (complex)
2. CSS Modules demo → split across **component** (structural) and **theme** (aesthetic)
3. `data-*` attributes → preserved on internal elements for CSS targeting
4. No `@customElement` — registration via `applyTheme`

Base UI is already unstyled, so the decomposition is more natural than ShadCN — the CSS Modules demo styles map cleanly to DUI's theme styles.

---

## Step 1 — Fetch the Base UI docs

Fetch the component documentation before writing code:

```
https://base-ui.com/react/components/{component}.md
```

Also fetch if needed:
- `https://base-ui.com/llms.txt` — component index
- `https://base-ui.com/react/handbook/styling.md`
- `https://base-ui.com/react/handbook/animation.md`

Extract:
1. **Anatomy** — composable parts (Root, Trigger, Panel, Thumb, etc.)
2. **Props per part** — public props, callback props
3. **Data attributes** — `data-checked`, `data-disabled`, `data-open`, etc.
4. **CSS variables** — `--accordion-panel-height`, etc.
5. **CSS Modules demo** — the reference stylesheet
6. **Accessibility** — ARIA roles, keyboard interactions

---

## Step 2 — Decompose CSS into structural vs aesthetic

Base UI's CSS Modules demo contains both structural and aesthetic properties. Split them:

### Structural CSS (component file)

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
  position: relative;
  transition-property: background-color, box-shadow;
}
```

### Aesthetic CSS (theme file)

Convert Base UI's hardcoded values to design tokens:

```css
/* Base UI original */
.Switch {
  width: 2.5rem;
  height: 1.5rem;
  border-radius: 1.5rem;
  background-color: var(--color-gray-300);
}

/* DUI theme translation */
:host {
  --switch-width: var(--space-9);
  --switch-height: var(--space-5);
}

[part="root"] {
  width: var(--switch-width);
  height: var(--switch-height);
  border-radius: calc(var(--switch-height) / 2);
  background-color: color-mix(in oklch, var(--input) 50%, transparent);
}
```

---

## Step 3 — Map Base UI patterns to DUI

### Data attributes on internal elements

Base UI uses `data-*` attributes for CSS targeting. Preserve these on internal elements:

```typescript
override render(): TemplateResult {
  return html`
    <span
      part="root"
      role="switch"
      aria-checked=${this.#checked}
      ?data-checked=${this.#checked}
      ?data-unchecked=${!this.#checked}
      ?data-disabled=${this.#isDisabled}
      tabindex="0"
      @click=${this.#handleClick}
      @keydown=${this.#handleKeyDown}
    >
      <span
        part="thumb"
        ?data-checked=${this.#checked}
        ?data-unchecked=${!this.#checked}
      ></span>
    </span>
  `;
}
```

Theme styles target these attributes:

```css
[part="root"][data-checked] {
  background-color: var(--primary);
}
```

### Variant/size styling

For custom variants not from Base UI, use `:host([attr])` in theme styles (same as ShadCN port):

```css
:host([variant="destructive"]) {
  --switch-checked-bg: var(--destructive);
}
```

### React → Lit

| React | Lit |
|-------|-----|
| `useState(x)` | `@state() accessor #x` |
| `useRef()` | `@query() accessor #el` |
| `useEffect(fn, [])` | `protected override firstUpdated()` |
| `useEffect(fn, [dep])` | `protected override updated(changed)` |
| `useEffect` cleanup | `override disconnectedCallback()` |
| `useContext` | `@consume({ context, subscribe: true })` |
| `onCheckedChange` | `customEvent("checked-change", ...)` |
| `onValueChange` | `customEvent("value-change", ...)` |
| `className` | `class` in template |
| `children` | `<slot></slot>` |
| `<Component.Portal>` | Not needed in shadow DOM (or use floating portal) |

### Controlled/uncontrolled

Support both patterns. Provide `defaultChecked` for initial value and `checked` for controlled:

```typescript
@property({ type: Boolean, reflect: true })
accessor checked: boolean | undefined = undefined;

@property({ type: Boolean, attribute: "default-checked" })
accessor defaultChecked = false;

@state() accessor #internalChecked = false;

get #checked(): boolean {
  return this.checked ?? this.#internalChecked;
}
```

---

## Step 4 — Compound components

For multi-part Base UI components (Accordion, Tabs, Menu), decide the coordination pattern:

| Children need... | Pattern | Example |
|------------------|---------|---------|
| Simple data only | **Data-driven** — `.items` property, rendered in shadow DOM | Select options |
| Open-ended HTML | **Lit Context** — light DOM children, context coordination | Accordion items |

### Lit Context pattern

```typescript
// {name}-context.ts
import { createContext } from "@lit/context";

export type {Name}Context = {
  readonly openValues: string[];
  readonly disabled: boolean;
  readonly toggle: (value: string) => void;
};

export const {name}Context = createContext<{Name}Context>("dui-{name}");
```

Parent provides via `@provide`, children consume via `@consume` with `subscribe: true`.

Key principles:
- No imperative coordination — no `querySelectorAll`, no `this.closest()`
- Immutable context updates — spread, never mutate
- Actions via context callbacks — children call `ctx.toggle()` directly
- Public events still dispatched for consumers

---

## Step 5 — Animation

Base UI uses `data-starting-style` and `data-ending-style` for enter/exit animations. Preserve these on internal elements:

```typescript
@state() accessor #starting = false;
@state() accessor #ending = false;

async #animateOpen(): Promise<void> {
  this.#starting = true;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  this.#starting = false;
}

#animateClose(): void {
  this.#ending = true;
  const el = this.shadowRoot?.querySelector("[part='panel']");
  el?.addEventListener("transitionend", () => {
    this.#ending = false;
    this.#open = false;
  }, { once: true });
}
```

Thread to internal elements:

```typescript
<div part="panel"
  ?data-starting-style=${this.#starting}
  ?data-ending-style=${this.#ending}>
```

Theme CSS targets these unchanged:

```css
[part="panel"][data-starting-style],
[part="panel"][data-ending-style] {
  height: 0;
}
```

---

## Step 6 — Create the files

Create all files using the standard DUI structure. See `/add-component` skill for the full file list and configuration updates.

Add provenance comment:

```typescript
/** Ported from Base UI: https://base-ui.com/react/components/{component} */
```

---

## Step 7 — Field context integration

For form control components (checkbox, input, switch, slider, etc.), consume `FieldContext`:

```typescript
import { consume } from "@lit/context";
import { fieldContext, type FieldContext } from "../field/field-context.ts";

@consume({ context: fieldContext, subscribe: true })
@state()
accessor #fieldCtx!: FieldContext;
```

Use definite assignment (`!`), not `| undefined`. Access with optional chaining: `this.#fieldCtx?.disabled`.

---

## Step 8 — Add to docs, verify

Use `/add-to-docs` to wire into the docs dev server. Run `deno check` from the repo root.

---

## Validation checklist

- [ ] Provenance comment: `/** Ported from Base UI: ... */`
- [ ] Component has structural CSS only — no colors, fonts, spacing
- [ ] Theme styles use design tokens — no hardcoded `px` or color values
- [ ] `data-*` attributes on internal elements match Base UI originals
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] `part="root"` on root element, other `part` attributes match Base UI anatomy
- [ ] Properties use `accessor` keyword
- [ ] Private methods use `#private` syntax
- [ ] Events use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] Controlled/uncontrolled patterns supported where applicable
- [ ] Keyboard interactions match Base UI docs
- [ ] ARIA attributes correct (role, aria-checked, aria-expanded, etc.)
- [ ] Animation uses `data-starting-style` / `data-ending-style` on internal elements
- [ ] Compound components use Lit Context (not imperative coordination)
- [ ] Context updates are immutable (spread, not mutation)
- [ ] `index.ts` re-exports, `register.ts` provides standalone registration
- [ ] Config updates in both `deno.json` files
- [ ] Theme styles registered in `defaultTheme.styles` map
- [ ] `deno check` passes
