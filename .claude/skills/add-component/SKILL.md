---
name: add-component
description: Scaffold a new unstyled DUI component with all required files. Use when the user asks to add, create, or scaffold a new component, or says "add component", "new component", "create dui-foo", etc.
---

# Add Component

Scaffold a new unstyled DUI component with all required files across both packages.

## Overview

Every new component requires files in two packages plus configuration updates. This skill generates all the boilerplate and wires everything together.

### Files created

```
packages/components/src/{name}/
  {name}.ts              # Component class + structural styles
  index.ts               # Re-exports class + types
  register.ts            # Standalone registration

packages/theme-default/src/components/
  {name}.ts              # Aesthetic styles
```

### Files modified

- `packages/components/deno.json` — add export entry
- `packages/theme-default/deno.json` — add export entry
- `packages/theme-default/src/index.ts` — import styles + add to theme map + re-export

---

## Steps

### Step 1 — Gather info

Determine from the user:

1. **Component name** — kebab-case (e.g., `badge`, `avatar`, `alert`)
2. **Display type** — `block` or `inline-block` (default: `inline-block` for small components, `block` for containers)
3. **Variants** — what variant values to support (e.g., `default | secondary | destructive`)
4. **Properties** — what configurable properties the component needs
5. **Root element tag** — `span`, `button`, `div`, etc.
6. **Slots** — what content projection points are needed

If the user provides a reference (shadcn, Base UI, existing component), use the `/port-shadcn` or `/port-base-ui` skill instead.

### Step 2 — Read reference files

Before writing any code, read these existing files for patterns:

- `packages/components/src/badge/badge.ts` — simplest component reference
- `packages/components/src/badge/index.ts` — index pattern
- `packages/components/src/badge/register.ts` — register pattern
- `packages/theme-default/src/components/badge.ts` — theme styles pattern
- `packages/theme-default/src/index.ts` — theme registration pattern
- `packages/components/deno.json` — export map pattern
- `packages/theme-default/deno.json` — export map pattern

### Step 3 — Create the component class

Create `packages/components/src/{name}/{name}.ts`:

```typescript
import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

export type {Name}Variant = "default" | "secondary" | "destructive";

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
 * `<dui-{name}>` — {Description}.
 *
 * @slot - {Slot description}.
 * @csspart root - The {name} element.
 */
export class Dui{Name} extends LitElement {
  static tagName = "dui-{name}" as const;

  static override styles = [base, styles];

  @property({ reflect: true })
  accessor variant: {Name}Variant = "default";

  override render(): TemplateResult {
    return html`
      <{tag} part="root">
        <slot></slot>
      </{tag}>
    `;
  }
}
```

**Key rules:**
- `static tagName` with `as const` — NO `@customElement` decorator
- `static override styles = [base, styles]` — `base` from `@dui/core/base`
- Structural CSS only — no colors, fonts, spacing values, border-radius
- `part="root"` on root internal element
- All properties use `accessor` keyword
- All internal state uses `@state() accessor #name`
- All private methods use native `#private` syntax

### Step 4 — Create the index

Create `packages/components/src/{name}/index.ts`:

```typescript
export { Dui{Name} } from "./{name}.ts";
export type { {Name}Variant } from "./{name}.ts";
```

### Step 5 — Create the register

Create `packages/components/src/{name}/register.ts`:

```typescript
import { Dui{Name} } from "./index.ts";

if (!customElements.get(Dui{Name}.tagName)) {
  customElements.define(Dui{Name}.tagName, Dui{Name});
}
```

### Step 6 — Create the theme styles

Create `packages/theme-default/src/components/{name}.ts`:

```typescript
import { css } from "lit";

export const {name}Styles = css`
  :host {
    --{name}-bg: var(--primary);
    --{name}-fg: var(--primary-foreground);
    --{name}-border: transparent;
  }

  :host([variant="secondary"]) {
    --{name}-bg: var(--secondary);
    --{name}-fg: var(--secondary-foreground);
  }

  :host([variant="destructive"]) {
    --{name}-bg: var(--destructive);
    --{name}-fg: var(--destructive-foreground);
  }

  [part="root"] {
    gap: var(--space-1);
    background-color: var(--{name}-bg);
    color: var(--{name}-fg);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    border: var(--border-width-thin) solid var(--{name}-border);
  }
`;
```

**Key rules:**
- All values use design tokens — no hardcoded `px` or `rem`
- Define component-scoped CSS variables on `:host`
- Override variables in `:host([attr])` selectors for variants
- Internal elements consume variables via `var()`

### Step 7 — Update configuration

**`packages/components/deno.json`** — add to exports:

```json
"./{name}": "./src/{name}/index.ts"
```

**`packages/theme-default/deno.json`** — add to exports:

```json
"./components/{name}": "./src/components/{name}.ts"
```

**`packages/theme-default/src/index.ts`** — add import, map entry, and re-export:

```typescript
import { {name}Styles } from "./components/{name}.ts";

// Add to styles map:
["dui-{name}", {name}Styles],

// Add re-export:
export { {name}Styles } from "./components/{name}.ts";
```

### Step 8 — Add to docs

Use the `/add-to-docs` skill to wire the new component into the docs dev server.

### Step 9 — Verify

Run `deno check` from the repo root to verify everything compiles.

---

## Validation checklist

- [ ] Component extends `LitElement` directly
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] Structural CSS only in component — no colors, fonts, spacing
- [ ] `part="root"` on root internal element
- [ ] Properties use `@property()` with `accessor`
- [ ] Internal state uses `@state() accessor #name`
- [ ] Private methods use `#private` syntax
- [ ] Events use `customEvent()` factory with `bubbles: true, composed: true`
- [ ] `index.ts` re-exports class + types
- [ ] `register.ts` provides standalone registration
- [ ] `deno.json` exports added in both packages
- [ ] Theme styles use design tokens only
- [ ] Theme styles registered in `defaultTheme.styles` map
- [ ] Theme styles re-exported from theme index
- [ ] `deno check` passes
