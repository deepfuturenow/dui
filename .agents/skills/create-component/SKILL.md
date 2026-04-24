---
name: create-component
description: Create a new styled DUI component by extending an existing dui-primitive. Use when the user asks to add, create, or scaffold a new component, or says "create component", "new component", "create dui-foo", "add a component", etc.
---

# Create a Styled Component

Extend a [dui-primitives](https://github.com/deepfuturenow/dui-primitives) base class into a styled, self-registering component.

## Overview

Each component in `@dui/components` is a thin subclass of an unstyled primitive from `@dui/primitives`. The primitive provides structure, accessibility, and behavior. Your component adds the design — tokens, variant systems, colors, spacing, typography — and registers itself as a custom element.

```
DuiBadgePrimitive (from @dui/primitives)
  → structural CSS, ARIA, keyboard behavior
  → extends LitElement

DuiBadge (this repo)
  → aesthetic CSS (tokens, variants, colors, sizing)
  → extends DuiBadgePrimitive
  → calls customElements.define() to self-register
```

The primitive owns the `render()` method. Your component **only adds CSS** — it never overrides `render()` unless the styled version needs different DOM.

### Files created

```
packages/components/src/{name}/
  {name}.ts              # Component class (extends primitive, aesthetic CSS, self-registers)
  index.ts               # Side-effect import + named re-exports
```

### Files modified

- `packages/components/deno.json` — add export entry
- Root `deno.json` — add `@dui/primitives/{name}` import mapping (if not already present)

### Prerequisite

The primitive must already exist in `@dui/primitives`. Check with:

```bash
ls /Users/joshcarpenter/Documents/dui-primitives/packages/primitives/src/{name}/
```

If the primitive doesn't exist, tell the user it needs to be created in the dui-primitives repo first (that's a separate task).

---

## Steps

### Step 1 — Gather info

Determine from the user:

1. **Component name** — kebab-case (e.g., `badge`, `avatar`, `alert`)
2. **Variants** — what variant values to support (e.g., `neutral | primary | danger`)
3. **Appearances** — what visual treatments to support (e.g., `filled | outline | ghost | soft`)
4. **Sizes** — what size steps to support (e.g., `xs | sm | md | lg`)

If the user provides a reference (shadcn, Base UI), use the `/port-shadcn` or `/port-base-ui` skill instead.

### Step 2 — Read reference files

Before writing any code, read the primitive you're extending and existing components for patterns:

**The primitive you're extending:**
- `/Users/joshcarpenter/Documents/dui-primitives/packages/primitives/src/{name}/{name}.ts`
- `/Users/joshcarpenter/Documents/dui-primitives/packages/primitives/src/{name}/index.ts`

**Existing components in this repo (for patterns):**
- `packages/components/src/badge/badge.ts` — simplest component (variant only)
- `packages/components/src/button/button.ts` — full two-axis variant system + sizes + interaction states
- `packages/components/src/badge/index.ts` — index pattern (side-effect import + re-export)
- `packages/components/src/button/index.ts` — index with re-exported events
- `packages/components/src/_install.ts` — token injection side-effect

Also read `docs/creating-components.md` for the full conventions reference.

### Step 3 — Create the component class

Create `packages/components/src/{name}/{name}.ts`.

The pattern has three parts: import the primitive, write aesthetic CSS, extend and register.

```typescript
import { css } from "lit";
import { Dui{Name}Primitive } from "@dui/primitives/{name}";
import "../_install.ts";

const styles = css`
  /* ... aesthetic CSS ... */
`;

export class Dui{Name} extends Dui{Name}Primitive {
  static override styles = [...Dui{Name}Primitive.styles, styles];
}

customElements.define(Dui{Name}.tagName, Dui{Name});
```

**Key rules:**
- Extends the primitive class — NOT `LitElement`
- `import "../_install.ts"` — injects design tokens into `document.adoptedStyleSheets`
- `static override styles = [...Primitive.styles, styles]` — spreads primitive styles, appends aesthetic
- `customElements.define()` at module level — self-registers on import
- **Never override `render()`** unless you need different DOM structure
- **Never re-declare properties** that the primitive already defines
- All values use design tokens — no hardcoded `px`, `rem`, or color values

#### The aesthetic CSS

Use the two-axis variant system when the component has semantic color intents:

```css
/* ---------------------------------------------------------------
 * Layer 1 — Intent (sets --_intent-* private tokens)
 * --------------------------------------------------------------- */

:host,
:host([variant=""]),
:host([variant="neutral"]) {
  --_intent-base: var(--foreground);
  --_intent-base-fg: var(--background);
  --_intent-subtle: oklch(from var(--foreground) l c h / 0.08);
  --_intent-subtle-fg: var(--text-2);
  --_intent-border: var(--border-strong);
}

:host([variant="primary"]) {
  --_intent-base: var(--accent);
  --_intent-base-fg: oklch(from var(--accent) 0.98 0.01 h);
  --_intent-subtle: var(--accent-subtle);
  --_intent-subtle-fg: var(--accent-text);
  --_intent-border: oklch(from var(--accent) l c h / 0.5);
}

:host([variant="danger"]) {
  --_intent-base: var(--destructive);
  --_intent-base-fg: oklch(from var(--destructive) 0.98 0.01 h);
  --_intent-subtle: var(--destructive-subtle);
  --_intent-subtle-fg: oklch(from var(--destructive-text) l c h / 0.8);
  --_intent-border: oklch(from var(--destructive) l c h / 0.5);
}

/* ---------------------------------------------------------------
 * Layer 2 — Appearance (maps --_intent-* to --{name}-*)
 * --------------------------------------------------------------- */

:host,
:host([appearance=""]),
:host([appearance="filled"]) {
  --{name}-bg: var(--_intent-base);
  --{name}-fg: var(--_intent-base-fg);
  --{name}-border: transparent;
}

:host([appearance="outline"]) {
  --{name}-bg: transparent;
  --{name}-fg: var(--_intent-subtle-fg);
  --{name}-border: var(--_intent-border);
}

:host([appearance="soft"]) {
  --{name}-bg: var(--_intent-subtle);
  --{name}-fg: var(--_intent-subtle-fg);
  --{name}-border: transparent;
}
```

Not every component needs two axes. Simple components (badge, spinner) may use `variant` alone — just set the `--{name}-*` variables directly without the `--_intent-*` indirection layer.

#### Sizes

```css
:host {
  --{name}-height: var(--component-height-md);
  --{name}-padding-x: var(--space-2_5);
  --{name}-font-size: var(--text-sm);
}

:host([size="sm"]) {
  --{name}-height: var(--component-height-sm);
  --{name}-padding-x: var(--space-2);
  --{name}-font-size: var(--text-xs);
}

:host([size="lg"]) {
  --{name}-height: var(--component-height-lg);
  --{name}-padding-x: var(--space-3);
}
```

#### Base element

The `[part="root"]` block consumes the variables:

```css
[part="root"] {
  gap: var(--space-1);
  padding: var(--{name}-padding-y, var(--space-2)) var(--{name}-padding-x);
  height: var(--{name}-height);
  border: var(--border-width-thin) solid var(--{name}-border);
  border-radius: var(--{name}-radius, var(--radius-md));
  background: var(--{name}-bg);
  color: var(--{name}-fg);
  font-family: var(--font-sans);
  font-size: var(--{name}-font-size);
  font-weight: var(--font-weight-medium);
  transition-property: background, box-shadow, filter, transform, border-color;
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--ease-out-3);
}
```

#### Interaction states

```css
/* Filled: darken on hover */
[part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
  filter: brightness(0.88);
}

[part="root"]:active:not(:disabled):not([aria-disabled="true"]) {
  filter: brightness(0.80);
}

/* Focus ring */
[part="root"]:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 var(--focus-ring-offset) var(--background),
    0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
}

/* Disabled */
[part="root"]:disabled,
[part="root"][aria-disabled="true"] {
  opacity: 0.2;
  cursor: not-allowed;
}
```

### Step 4 — Create the component index

Create `packages/components/src/{name}/index.ts`:

```typescript
import "./{name}.ts";

export { Dui{Name} } from "./{name}.ts";
```

The side-effect import triggers `customElements.define()`. The named export provides programmatic access.

**Re-export events and types from the primitive** so consumers have a single import path:

```typescript
import "./{name}.ts";

export { Dui{Name} } from "./{name}.ts";
export { someEvent } from "@dui/primitives/{name}";
```

**For compound components**, import all sub-components:

```typescript
import "./{name}.ts";
import "./{name}-item.ts";

export { Dui{Name} } from "./{name}.ts";
export { Dui{Name}Item } from "./{name}-item.ts";
export { valueChangeEvent } from "@dui/primitives/{name}";
```

### Step 5 — Update configuration

**`packages/components/deno.json`** — add to exports:

```json
"./{name}": "./src/{name}/index.ts"
```

**Root `deno.json`** — add the import mapping for the primitive (if not already present):

```json
"@dui/primitives/{name}": "../dui-primitives/packages/primitives/src/{name}/index.ts"
```

### Step 6 — Add to docs

Use the `/edit-docs` skill to wire the new component into the docs dev server.

### Step 7 — Verify

Run `deno check` from the repo root to verify everything compiles.

---

## Validation checklist

- [ ] Extends the primitive class (not `LitElement` directly)
- [ ] `import "../_install.ts"` for token injection
- [ ] `static override styles = [...Primitive.styles, styles]`
- [ ] `customElements.define()` called at module level
- [ ] Aesthetic CSS uses design tokens only — no hardcoded values
- [ ] Uses two-axis variant system where appropriate
- [ ] Does NOT re-declare properties from the primitive
- [ ] Does NOT override `render()` (unless DOM changes are needed)
- [ ] `index.ts` has side-effect import + named re-exports
- [ ] Events and types re-exported from primitive
- [ ] Export added to `packages/components/deno.json`
- [ ] Import mapping in root `deno.json` for the primitive
- [ ] `deno check` passes
