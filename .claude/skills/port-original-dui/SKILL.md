---
name: port-original-dui
description: Port an original DUI component from deep-future-app into the new unstyled architecture. Use when the user asks to port, migrate, or rewrite an original DUI component, or references deep-future-app components. Triggers include "port original", "port from deep-future", "migrate dui component", or any request to bring an existing DUI component into the new architecture.
---

# Original DUI → New DUI Port

Port a component from the original DUI library (`deep-future-app/app/client/components/dui/`) into the new unstyled component + theme architecture.

## Overview

The original DUI components used heavy sub-component nesting (e.g., accordion had 6 sub-components). The new architecture favors slots and `::part()` to reduce consumer complexity. Porting means:

1. Collapsing fixed-structure sub-components into internal parts with named slots
2. Splitting CSS into structural (component) and aesthetic (theme)
3. Preserving all keyboard navigation and ARIA attributes
4. Preserving animations using the `data-starting-style` / `data-ending-style` pattern
5. No `@customElement` — registration via `applyTheme`

**Guiding principle:** Collapse sub-component recipes into slots/parts wherever the internal structure is fixed. Only keep separate components when children need open-ended content or independent lifecycle.

---

## Step 1 — Read the original component source

Read all files in the original component directory:

```
deep-future-app/app/client/components/dui/{name}/
```

Inventory and document:

1. **Sub-components** — list every sub-component and its role (e.g., `accordion-header`, `accordion-trigger`, `accordion-panel`)
2. **Lit Context** — map the context type, what state it carries, and how it flows
3. **Public properties** — all `@property()` declarations across all sub-components
4. **Events** — all dispatched events and their payloads
5. **Keyboard interactions** — all `@keydown` handlers, key mappings
6. **ARIA attributes** — all `role`, `aria-*` attributes
7. **Animations** — any transitions, height measurements, `requestAnimationFrame` usage
8. **CSS** — both structural layout and visual styling

---

## Step 2 — Sub-component simplification analysis

Apply this decision framework to each sub-component:

| Original sub-component role | Action | Example |
|---|---|---|
| Fixed internal structure (always used together, no rearrangement) | Collapse → `part` + named `slot` | header + trigger → `part="trigger"` with `slot="trigger"` |
| Content container (just wraps arbitrary user content) | Collapse → default `slot` + `part` | panel → `part="panel"` with default slot |
| State manager / context provider (root) | Keep as component | accordion root stays |
| Context consumer needing open-ended content | Keep as component | accordion-item stays |
| Context type definition (not a component) | Keep as file | accordion-context.ts stays as a file |

Produce a mapping table for the specific component being ported:

```markdown
| Original sub-component | Role | Action | New location |
|---|---|---|---|
| {name} | Root / context provider | Keep as component | {name}.ts |
| {name}-item | Context consumer, open-ended content | Keep as component | {name}-item.ts |
| {name}-header | Fixed wrapper around trigger | Collapse | part="trigger" in {name}-item |
| {name}-trigger | Fixed interactive element | Collapse | part="trigger" in {name}-item |
| {name}-panel | Content container | Collapse | part="panel" in {name}-item |
| {name}-context | Type definition | Keep as file | {name}-context.ts |
```

Show the before/after consumer API:

```html
<!-- BEFORE: Original DUI (6 elements) -->
<dui-accordion>
  <dui-accordion-item value="a">
    <dui-accordion-header>
      <dui-accordion-trigger>Section A</dui-accordion-trigger>
    </dui-accordion-header>
    <dui-accordion-panel>Content A</dui-accordion-panel>
  </dui-accordion-item>
</dui-accordion>

<!-- AFTER: New DUI (2 elements) -->
<dui-accordion>
  <dui-accordion-item value="a">
    <span slot="trigger">Section A</span>
    Content A
  </dui-accordion-item>
</dui-accordion>
```

Get user approval on the simplification plan before proceeding.

---

## Step 3 — Design the new consumer API

Document the complete API for each kept component:

### Root component (`dui-{name}`)

| Aspect | Details |
|---|---|
| Properties | `type` ("single" \| "multiple"), `value`, `default-value`, `disabled` |
| Events | `value-change` (detail: string[]) |
| Slots | default (accepts child items) |
| CSS Parts | `root` |
| Context | Provides `{Name}Context` |

### Child component (`dui-{name}-item`)

| Aspect | Details |
|---|---|
| Properties | `value`, `disabled` |
| Slots | `trigger` (named), default (panel content) |
| CSS Parts | `trigger`, `panel`, `indicator` |
| Context | Consumes `{Name}Context` |
| Data attributes | `data-open`, `data-disabled` |

Verify: the new API is simpler without losing any functionality from the original.

---

## Step 4 — Map structural vs aesthetic CSS

Pull CSS from the original and split it:

### Structural CSS (component file)

Properties that control layout and behavior with no visual opinion:

```css
:host {
  display: block;
}

[part="trigger"] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  transition-property: background-color;
}

[part="panel"] {
  overflow: hidden;
  transition-property: height;
}
```

### Aesthetic CSS (theme file)

Convert all hardcoded values to design tokens:

```css
[part="trigger"] {
  padding: var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-bottom: var(--border-width-thin) solid var(--border);
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-out-3);
}

[part="trigger"]:hover {
  background-color: color-mix(in oklch, var(--muted) 50%, transparent);
}
```

### Animation CSS split

- `transition-property` → **structural** (defines what animates)
- `transition-duration`, `transition-timing-function` → **aesthetic** (defines how it looks)

---

## Step 5 — Preserve keyboard navigation and ARIA

### Keyboard handlers

Copy all keyboard interaction handlers from the original. Common patterns:

| Key | Action |
|---|---|
| Enter / Space | Toggle current item |
| ArrowDown | Focus next item |
| ArrowUp | Focus previous item |
| Home | Focus first item |
| End | Focus last item |

### Cross-item keyboard navigation

For components where keyboard nav spans multiple items (accordion, tabs), use context callbacks so the parent manages the ordered registry:

```typescript
// In context type
export type AccordionContext = {
  readonly openValues: string[];
  readonly disabled: boolean;
  readonly toggle: (value: string) => void;
  readonly registerItem: (value: string, el: HTMLElement) => void;
  readonly unregisterItem: (value: string) => void;
  readonly focusItem: (value: string, direction: "next" | "prev" | "first" | "last") => void;
};
```

The parent maintains an ordered registry of items. Children call `ctx.focusItem()` on arrow key presses. No imperative DOM queries (`querySelectorAll`, `this.closest()`).

### ARIA attributes

Preserve all ARIA attributes from the original:

```typescript
<div part="trigger"
  role="button"
  tabindex="0"
  aria-expanded=${this.#open}
  aria-controls=${this.#panelId}
  aria-disabled=${this.#isDisabled}>

<div part="panel"
  role="region"
  aria-labelledby=${this.#triggerId}
  ?hidden=${!this.#open && !this.#ending}>
```

Generate unique IDs for `aria-controls` / `aria-labelledby` linkage using a counter or `crypto.randomUUID()`.

---

## Step 6 — Preserve animations

Use the `data-starting-style` / `data-ending-style` pattern for enter/exit animations.

### Height animation pattern (for collapsible panels)

```typescript
@state() accessor #starting = false;
@state() accessor #ending = false;
@state() accessor #panelHeight = 0;

async #animateOpen(): Promise<void> {
  this.#open = true;
  this.#starting = true;
  await this.updateComplete;

  // Measure content height
  const panel = this.shadowRoot?.querySelector("[part='panel']") as HTMLElement;
  if (panel) {
    this.#panelHeight = panel.scrollHeight;
  }

  // Double rAF to ensure the starting state is painted before transitioning
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  this.#starting = false;
}

#animateClose(): void {
  // Measure current height before closing
  const panel = this.shadowRoot?.querySelector("[part='panel']") as HTMLElement;
  if (panel) {
    this.#panelHeight = panel.scrollHeight;
  }

  this.#ending = true;

  panel?.addEventListener("transitionend", () => {
    this.#ending = false;
    this.#open = false;
  }, { once: true });
}
```

### Template usage

```typescript
<div part="panel"
  role="region"
  style=${this.#open || this.#ending ? `height: ${this.#panelHeight}px` : ""}
  ?data-open=${this.#open && !this.#starting}
  ?data-starting-style=${this.#starting}
  ?data-ending-style=${this.#ending}
  ?hidden=${!this.#open && !this.#ending}>
  <slot></slot>
</div>
```

### Theme CSS for animation

```css
[part="panel"] {
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-out-3);
}

[part="panel"][data-starting-style],
[part="panel"][data-ending-style] {
  height: 0;
}
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  [part="panel"] {
    transition-duration: 0s;
  }
}
```

---

## Step 7 — Create files

Delegate to `/add-component` for file scaffolding. For compound components, the directory structure is:

```
packages/components/src/{name}/
  {name}.ts              # Root component (context provider)
  {name}-item.ts         # Child component (context consumer)
  {name}-context.ts      # Context type + createContext
  index.ts               # Re-exports all classes + types
  register.ts            # Standalone registration for all components

packages/theme-default/src/components/
  {name}.ts              # Theme styles for root
  {name}-item.ts         # Theme styles for child
```

### Context file pattern

```typescript
import { createContext } from "@lit/context";

export type {Name}Context = {
  readonly openValues: string[];
  readonly disabled: boolean;
  readonly toggle: (value: string) => void;
  readonly registerItem: (value: string, el: HTMLElement) => void;
  readonly unregisterItem: (value: string) => void;
  readonly focusItem: (value: string, direction: "next" | "prev" | "first" | "last") => void;
};

export const {name}Context = createContext<{Name}Context>("dui-{name}");
```

### Provenance comment

Add at the top of each component file:

```typescript
/** Ported from original DUI: deep-future-app/app/client/components/dui/{name} */
```

### Configuration updates

Follow `/add-component` Step 7 for `deno.json` and theme index updates. For compound components with multiple theme files, add an export and theme map entry for each.

### Docs

Wire into docs via `/add-to-docs`.

---

## Validation checklist

### Standard (from /add-component)

- [ ] Component extends `LitElement` directly
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] Structural CSS only in component — no colors, fonts, spacing
- [ ] `part="root"` or appropriate part names on all internal elements
- [ ] Properties use `@property()` with `accessor`
- [ ] Internal state uses `@state() accessor #name`
- [ ] Private methods use `#private` syntax
- [ ] Events use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] `index.ts` re-exports all classes + types
- [ ] `register.ts` provides standalone registration for all components
- [ ] `deno.json` exports added in both packages
- [ ] Theme styles use design tokens only
- [ ] Theme styles registered in `defaultTheme.styles` map
- [ ] `deno check` passes

### Porting-specific

- [ ] Provenance comment: `/** Ported from original DUI: deep-future-app/app/client/components/dui/{name} */`
- [ ] Original feature parity verified (enumerate each feature from Step 1)
- [ ] Sub-component simplification documented (which collapsed, which kept, why)
- [ ] Before/after consumer API comparison shown and approved
- [ ] Keyboard navigation tested for all key combinations from original
- [ ] ARIA attributes match WAI-ARIA pattern for the component type
- [ ] Animation works for both opening and closing
- [ ] `prefers-reduced-motion` respected
- [ ] Controlled and uncontrolled modes both work
- [ ] Disabled state works globally and per-item (for compound components)
- [ ] Context updates are immutable (spread, never mutate)
- [ ] Cross-item keyboard navigation uses context callbacks (no imperative DOM queries)
