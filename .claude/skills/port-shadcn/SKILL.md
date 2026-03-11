---
name: port-shadcn
description: Port a ShadCN/ui component into the DUI unstyled architecture. Use when the user asks to convert, port, or rewrite a ShadCN component, or wants a DUI version of a ShadCN component. Triggers include "port shadcn", "ShadCN to DUI", "convert ShadCN", or any request pairing ShadCN with DUI/Lit.
---

# ShadCN → DUI Port

Port a ShadCN/ui React component into DUI's unstyled component + theme architecture.

## Overview

ShadCN/ui components are React components styled with Tailwind CSS and built on Radix UI primitives. Porting to DUI means:

1. React → Lit (class-based web component)
2. Tailwind classes → design token CSS custom properties
3. Single-file component → split across **component** (structural) and **theme** (aesthetic)
4. `cva()` variants → `:host([attr])` selectors
5. No `@customElement` — registration via `applyTheme`

---

## Step 1 — Fetch the ShadCN source

Fetch the component docs page before writing any code:

```
https://ui.shadcn.com/docs/components/{component}
```

Extract:
- The React source code
- `cva()` variant definitions
- Which Radix primitives are used (if any)
- The Tailwind classes to translate

---

## Step 2 — Analyze the component

From the source, identify:

1. **Props** — become `@property({ reflect: true }) accessor`
2. **Variants** — `cva()` variants become `:host([attr])` selectors in theme styles
3. **Composition** — is it a single element or a compound component?
4. **Accessibility** — ARIA roles, keyboard interactions from Radix

---

## Step 3 — Decompose into structural vs aesthetic

This is the key step in DUI's unstyled architecture. Split the component's CSS into two categories:

### Structural CSS (goes in the component)

Layout and behavior. No visual opinions.

| Property | Example |
|----------|---------|
| `display` | `inline-flex`, `block`, `grid` |
| `position` | `relative`, `absolute` |
| `align-items`, `justify-content` | flex layout |
| `box-sizing` | `border-box` |
| `cursor` | `pointer`, `not-allowed` |
| `user-select` | `none` |
| `overflow` | `hidden`, `auto` |
| `transition-property` | `background-color, box-shadow` |
| `-webkit-tap-highlight-color` | `transparent` |

### Aesthetic CSS (goes in the theme)

Colors, spacing, typography, borders, shadows.

| Property | Token pattern |
|----------|--------------|
| `background-color` | `var(--{name}-bg)` |
| `color` | `var(--{name}-fg)` |
| `padding` | `var(--space-*)` |
| `gap` | `var(--space-*)` |
| `height` / `width` | `var(--component-height-*)` or `var(--space-*)` |
| `border-radius` | `var(--radius-*)` |
| `border` | `var(--border-width-*)` |
| `font-size` | `var(--font-size-*)` |
| `font-weight` | `var(--font-weight-*)` |
| `font-family` | `var(--font-sans)` |
| `letter-spacing` | `var(--letter-spacing-*)` |
| `line-height` | `var(--line-height-*)` |
| `box-shadow` | `var(--shadow-*)` |
| `transition-duration` | `var(--duration-*)` |
| `transition-timing-function` | `var(--ease-*)` |

**Rule of thumb:** If it references a design token, it's aesthetic.

---

## Step 4 — Tailwind → token mapping

### Spacing

| Tailwind | Token |
|----------|-------|
| `p-0` | `var(--space-0)` |
| `p-0.5` | `var(--space-0_5)` |
| `p-1` | `var(--space-1)` |
| `p-1.5` | `var(--space-1_5)` |
| `p-2` | `var(--space-2)` |
| `p-2.5` | `var(--space-2_5)` |
| `p-3` | `var(--space-3)` |
| `p-3.5` | `var(--space-3_5)` |
| `p-4` | `var(--space-4)` |
| `p-5` | `var(--space-5)` |
| `p-6` | `var(--space-6)` |
| `p-8` | `var(--space-8)` |

Same mapping for `m-*`, `gap-*`, `px-*`, `py-*`, etc.

### Typography

| Tailwind | Token |
|----------|-------|
| `text-xs` | `var(--font-size-xs)` |
| `text-sm` | `var(--font-size-sm)` |
| `text-base` | `var(--font-size-md)` |
| `text-lg` | `var(--font-size-lg)` |
| `font-medium` | `var(--font-weight-medium)` |
| `font-semibold` | `var(--font-weight-semibold)` |
| `leading-none` | `var(--line-height-none)` |
| `leading-snug` | `var(--line-height-snug)` |
| `tracking-tight` | `var(--letter-spacing-tight)` |

### Border radius

| Tailwind | Token |
|----------|-------|
| `rounded-sm` | `var(--radius-sm)` |
| `rounded-md` | `var(--radius-md)` |
| `rounded-lg` | `var(--radius-lg)` |
| `rounded-full` | `var(--radius-full)` |

### Heights

| Tailwind | Token |
|----------|-------|
| `h-7` | `var(--component-height-xs)` |
| `h-8` | `var(--component-height-sm)` |
| `h-9` | `var(--component-height-md)` |
| `h-10` | `var(--component-height-lg)` |
| `h-11` | `var(--component-height-xl)` |

### Colors

| Tailwind | Token |
|----------|-------|
| `bg-primary` | `var(--primary)` |
| `text-primary-foreground` | `var(--primary-foreground)` |
| `bg-secondary` | `var(--secondary)` |
| `bg-destructive` | `var(--destructive)` |
| `bg-muted` | `var(--muted)` |
| `text-muted-foreground` | `var(--muted-foreground)` |
| `border-input` | `var(--input)` |
| `ring-ring` | `var(--ring)` |

### Motion

| Tailwind | Token |
|----------|-------|
| `duration-150` | `var(--duration-fast)` |
| `duration-200` / `duration-300` | `var(--duration-normal)` |
| `ease-out` | `var(--ease-out-3)` |
| `ease-in-out` | `var(--ease-in-out-3)` |

---

## Step 5 — Variant translation

ShadCN uses `cva()` for variants. In DUI, variants go in the **theme styles** using `:host([attr])` selectors:

```typescript
// ShadCN cva()
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4",
    }
  }
});

// DUI theme styles (packages/theme-default/src/components/{name}.ts)
export const {name}Styles = css`
  :host {
    --{name}-bg: var(--primary);
    --{name}-fg: var(--primary-foreground);
    --{name}-height: var(--component-height-md);
  }

  :host([variant="secondary"]) {
    --{name}-bg: var(--secondary);
    --{name}-fg: var(--secondary-foreground);
  }

  :host([size="sm"]) {
    --{name}-height: var(--component-height-sm);
    --{name}-font-size: var(--font-size-xs);
  }

  [part="root"] {
    background-color: var(--{name}-bg);
    color: var(--{name}-fg);
    height: var(--{name}-height);
  }
`;
```

The component class just declares the reflected properties:

```typescript
@property({ reflect: true })
accessor variant: {Name}Variant = "default";

@property({ reflect: true })
accessor size: {Name}Size = "md";
```

---

## Step 6 — React → Lit translation

| React | Lit |
|-------|-----|
| `useState(x)` | `@state() accessor #x` |
| `useRef()` | `@query() accessor #el` |
| `useEffect(fn, [])` | `protected override firstUpdated()` |
| `useEffect(fn, [dep])` | `protected override updated(changed)` |
| `useEffect` cleanup | `override disconnectedCallback()` |
| `useContext` | `@consume({ context, subscribe: true })` |
| `forwardRef` | Not needed — element IS the ref |
| `className` | `class` in template |
| `onClick` | `@click` in template |
| `children` | `<slot></slot>` |
| `{condition && <X/>}` | `${condition ? html\`<x></x>\` : nothing}` |

---

## Step 7 — Create the files

Use the `/add-component` skill's file structure. Create:

1. **Component class** — `packages/components/src/{name}/{name}.ts` (structural CSS only)
2. **Index** — `packages/components/src/{name}/index.ts`
3. **Register** — `packages/components/src/{name}/register.ts`
4. **Theme styles** — `packages/theme-default/src/components/{name}.ts` (aesthetic CSS)
5. **Config updates** — both `deno.json` files + theme index

Add a provenance comment at the top of the component file:

```typescript
/** Ported from ShadCN/ui: https://ui.shadcn.com/docs/components/{component} */
```

---

## Step 8 — Hover pattern

For interactive components, use `color-mix(in oklch, ...)` for hover effects in the theme styles:

```css
:host {
  --{name}-hover-bg: color-mix(in oklch, var(--{name}-bg) 95%, var(--foreground));
  --{name}-active-bg: color-mix(in oklch, var(--{name}-bg) 90%, var(--foreground));
}

[part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
  background-color: var(--{name}-hover-bg);
}
```

---

## Step 9 — Focus ring

For focusable components, add the standard focus ring in theme styles:

```css
[part="root"]:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 var(--space-0_5) var(--background),
    0 0 0 var(--space-1) var(--ring);
}
```

---

## Step 10 — Icon support

If the component supports slotted icons, set `--icon-size` and `--icon-fg` in theme styles:

```css
[part="root"] {
  --icon-size: var(--{name}-icon-size);
  --icon-fg: var(--{name}-fg);
}
```

---

## Step 11 — Add to docs

Use the `/add-to-docs` skill to wire into the docs dev server.

---

## Step 12 — Verify

Run `deno check` from the repo root.

---

## Validation checklist

- [ ] Provenance comment: `/** Ported from ShadCN/ui: ... */`
- [ ] Component has structural CSS only — no colors, fonts, spacing
- [ ] Theme styles use design tokens — no hardcoded values
- [ ] No Tailwind classes in output — all translated to tokens
- [ ] No React-isms — no `className`, no JSX, no hooks
- [ ] Variants use `:host([attr])` in theme styles with reflected properties
- [ ] `static tagName` with `as const` — no `@customElement`
- [ ] `static override styles = [base, styles]`
- [ ] `part="root"` on root internal element
- [ ] Properties use `accessor` keyword
- [ ] Private methods use `#private` syntax
- [ ] Events use `customEvent()` factory
- [ ] `index.ts` re-exports, `register.ts` provides standalone registration
- [ ] Config updates in both `deno.json` files
- [ ] Theme styles registered in `defaultTheme.styles` map
- [ ] Keyboard and ARIA attributes match ShadCN behavior
- [ ] `deno check` passes
