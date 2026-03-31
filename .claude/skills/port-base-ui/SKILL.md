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

## References

These docs contain the full conventions. This skill focuses on Base-UI-specific porting logic and references the docs for shared patterns.

- `docs/creating-components.md` — file structure, properties, events, lifecycle, validation checklist
- `docs/porting.md` — structural vs aesthetic decomposition, React → Lit mapping
- `docs/theming.md` — theme interface, token categories, component style patterns (hover, focus ring, disabled)
- `docs/accessibility.md` — ARIA patterns, keyboard interactions, focus management, disabled patterns, hidden form inputs

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

Split Base UI's CSS Modules demo into structural (component) and aesthetic (theme) CSS. See `docs/porting.md` for the full structural vs aesthetic property classification and `docs/creating-components.md` for examples.

Key Base-UI-specific notes:
- Base UI's CSS Modules demo values map directly to DUI theme styles
- Convert hardcoded values to design tokens (see `docs/theming.md` for token categories)
- Use the component-scoped CSS variable pattern: define on `:host`, override in `:host([attr])`, consume in `[part]`

Standard theme patterns to apply (see `docs/theming.md` for full details):
- **Hover:** `color-mix(in oklch, var(--button-bg) 95%, var(--foreground))` for perceptually correct hover effects
- **Focus ring:** double `box-shadow` approach — `0 0 0 var(--space-0_5) var(--background), 0 0 0 var(--space-1) var(--ring)`
- **Disabled:** `opacity: 0.2; cursor: not-allowed` on `[part]:disabled, [part][aria-disabled="true"]`

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
      tabindex="${isDisabled ? nothing : "0"}"
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

For custom variants not from Base UI, use `:host([attr])` in theme styles:

```css
:host([variant="destructive"]) {
  --switch-checked-bg: var(--destructive);
}
```

### React → Lit

See `docs/porting.md` for the complete React → Lit pattern mapping table.

Base-UI-specific patterns:

| Base UI | DUI |
|---------|-----|
| `data-checked`, `data-disabled`, etc. | Preserved on internal elements via `?data-checked=${...}` |
| `onCheckedChange` | `customEvent("checked-change", ...)` |
| `onValueChange` | `customEvent("value-change", ...)` |
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

## Step 6 — Accessibility

Follow `docs/accessibility.md` for full patterns. Key decisions per component:

### Focus management

- **Components wrapping native `<button>`:** Use `delegatesFocus` so focusing the host delegates to the inner button:
  ```typescript
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  ```
- **Non-native focusable elements** (e.g., `<span role="switch">`): Add `tabindex="0"` and remove when disabled:
  ```typescript
  tabindex="${isDisabled ? nothing : "0"}"
  ```

### Conditional ARIA attributes

Use Lit's `nothing` sentinel — don't render `aria-disabled="false"`:

```typescript
aria-disabled="${this.disabled ? "true" : nothing}"
```

### Disabled pattern selection

- **Native `disabled`** (default): Element removed from tab order, cannot be activated
- **`aria-disabled` + `focusableWhenDisabled`**: Element stays in tab order for screen reader discoverability (e.g., disabled button with explanatory tooltip)

See `docs/accessibility.md` for the full `focusableWhenDisabled` implementation pattern.

### Hidden form inputs

For controls that participate in native `<form>` submission (switch, checkbox, slider, etc.), render a hidden `<input>` inside shadow DOM:

```typescript
<input
  type="checkbox"
  name="${this.name ?? nothing}"
  value="${isChecked ? this.value : this.uncheckedValue}"
  .checked="${isChecked}"
  ?disabled="${isDisabled}"
  ?required="${this.required}"
  class="HiddenInput"
  aria-hidden="true"
  tabindex="-1"
/>
```

See `docs/accessibility.md` for the full hidden input pattern and structural CSS.

---

## Step 7 — Create the files

Create all files using the standard DUI structure. See `/add-component` skill for the full file list and configuration updates.

Add provenance comment:

```typescript
/** Ported from Base UI: https://base-ui.com/react/components/{component} */
```

---

## Step 8 — Field context integration

For form control components (checkbox, input, switch, slider, etc.), consume `FieldContext`:

```typescript
import { consume } from "@lit/context";
import { fieldContext, type FieldContext } from "../field/field-context.ts";

@consume({ context: fieldContext, subscribe: true })
@state()
accessor #fieldCtx!: FieldContext;
```

Use definite assignment (`!`), not `| undefined`. Access with optional chaining: `this.#fieldCtx?.disabled`.

See `docs/accessibility.md` for the full FieldContext shape and ARIA wiring patterns.

---

## Step 9 — Add to docs, verify

Use `/add-to-docs` to wire into the docs dev server. Run `deno check` from the repo root.

---

## Validation checklist

### Component structure
- [ ] Provenance comment: `/** Ported from Base UI: ... */`
- [ ] Extends `LitElement` — not a custom base class
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] `part="root"` on root element, other `part` attributes match Base UI anatomy
- [ ] Structural CSS only — no colors, fonts, spacing in the component
- [ ] Reflected properties for variant/size (`@property({ reflect: true })`)
- [ ] All decorated properties use `accessor` keyword
- [ ] All internal state uses `@state() accessor #name` (native private)
- [ ] All private methods use `#private` syntax
- [ ] All lifecycle overrides use the `override` keyword
- [ ] Events use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] JSDoc with `@slot`, `@csspart`, `@fires` as needed

### Exports and registration
- [ ] `index.ts` re-exports class + types
- [ ] `register.ts` provides standalone registration
- [ ] Package exports added to components `deno.json`
- [ ] Theme exports added to theme's `deno.json`
- [ ] Theme styles registered in `defaultTheme.styles` map

### Theme styles
- [ ] All token values use design tokens — no hardcoded `px` or `rem`
- [ ] Component-scoped CSS variables defined on `:host`, consumed in `[part]`
- [ ] Hover styles use `color-mix(in oklch, ...)` pattern
- [ ] Focus ring uses double `box-shadow` pattern
- [ ] Disabled styles use `opacity: 0.2; cursor: not-allowed`

### Accessibility
- [ ] `data-*` attributes on internal elements match Base UI originals
- [ ] ARIA attributes correct (role, aria-checked, aria-expanded, etc.)
- [ ] `nothing` sentinel used for conditional ARIA attributes
- [ ] `delegatesFocus` set when wrapping native `<button>`
- [ ] `tabindex` managed for non-native focusable elements (removed when disabled)
- [ ] Hidden form `<input>` for form-participating controls
- [ ] Keyboard interactions match Base UI docs

### Behavior
- [ ] Controlled/uncontrolled patterns supported where applicable
- [ ] Animation uses `data-starting-style` / `data-ending-style` on internal elements
- [ ] Compound components use Lit Context (not imperative coordination)
- [ ] Context updates are immutable (spread, not mutation)
- [ ] `deno check` passes
