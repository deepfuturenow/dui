# Porting Guide

How to port a component from ShadCN/ui or Base UI into dui's unstyled architecture.

For step-by-step workflows, use the `/port-shadcn` or `/port-base-ui` skills. This guide covers the mental model and principles.

---

## The key mental shift: structural vs aesthetic decomposition

Source components (ShadCN, Base UI) mix layout and visual CSS together. Porting to dui means splitting every CSS property into one of two buckets:

| Structural (component file) | Aesthetic (theme file) |
|-----------------------------|------------------------|
| `display`, `position` | `color`, `background-color` |
| `align-items`, `justify-content` | `padding`, `margin`, `gap` |
| `box-sizing`, `overflow` | `height`, `width` (sizing) |
| `cursor`, `user-select` | `border`, `border-radius` |
| `transition-property` | `font-*`, `letter-spacing`, `line-height` |
| `pointer-events` | `box-shadow`, `opacity` |
| `-webkit-tap-highlight-color` | `transition-duration`, `transition-timing-function` |

**Rule of thumb:** If the value references a design token (`var(--space-*)`, `var(--primary)`), it's aesthetic. If it controls layout or behavior with no visual opinion, it's structural.

The component file gets structural CSS. The theme file in `packages/theme-default/src/components/` gets aesthetic CSS with all values expressed as design tokens.

---

## React to Lit pattern mapping

| React | Lit |
|-------|-----|
| `useState(x)` | `@state() accessor #x` |
| `useRef()` | `@query() accessor #el` |
| `useEffect(fn, [])` | `protected override firstUpdated()` |
| `useEffect(fn, [dep])` | `protected override updated(changed)` |
| `useEffect` cleanup | `override disconnectedCallback()` |
| `useContext` | `@consume({ context, subscribe: true })` |
| `forwardRef` | Not needed — the element IS the ref |
| `className` | `class` in template |
| `onClick` | `@click` in template |
| `children` | `<slot></slot>` |
| `{cond && <X/>}` | `${cond ? html\`<x></x>\` : nothing}` |
| `onCheckedChange` callback | `customEvent("checked-change", ...)` |
| `<Component.Portal>` | Not needed in shadow DOM (or use floating portal) |

---

## Tailwind to token naming convention

Tailwind utility classes map to design tokens with a consistent naming pattern. A few representative examples:

| Category | Tailwind | Token |
|----------|----------|-------|
| Spacing | `p-2`, `gap-4` | `var(--space-2)`, `var(--space-4)` |
| Typography | `text-sm`, `font-medium` | `var(--font-size-sm)`, `var(--font-weight-medium)` |
| Radius | `rounded-md` | `var(--radius-md)` |
| Heights | `h-9` | `var(--component-height-md)` |
| Colors | `bg-primary`, `text-muted-foreground` | `var(--foreground)`, `var(--text-2)` (see `/port-shadcn` skill for full mapping) |
| Motion | `duration-200`, `ease-out` | `var(--duration-normal)`, `var(--ease-out-3)` |

The full mapping tables are in the `/port-shadcn` skill (Step 4). DUI does NOT use ShadCN's token names — see the skill for the correct mapping from ShadCN colors to DUI's 4-primitive system.

---

## ShadCN variant translation

ShadCN uses `cva()` for variants. In dui, variants become `:host([attr])` selectors in the **theme** file, not the component:

```typescript
// ShadCN cva()
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "bg-primary ...", secondary: "bg-secondary ..." },
    size: { sm: "h-8 px-3 text-xs", md: "h-9 px-4" },
  }
});

// DUI theme styles — uses two-axis intent/appearance pattern
export const buttonStyles = css`
  /* Layer 1: Intent */
  :host, :host([variant="neutral"]) {
    --_intent-base: var(--foreground);
    --_intent-base-fg: var(--background);
  }
  :host([variant="primary"]) {
    --_intent-base: var(--accent);
    --_intent-base-fg: oklch(from var(--accent) 0.98 0.01 h);
  }
  /* Layer 2: Appearance */
  :host, :host([appearance="filled"]) {
    --button-bg: var(--_intent-base);
    --button-fg: var(--_intent-base-fg);
  }
  :host([appearance="ghost"]) {
    --button-bg: transparent;
    --button-fg: var(--text-1);
  }
  :host([size="sm"]) {
    --button-height: var(--component-height-sm);
  }
`;
```

The component class just declares reflected properties — no styling logic:

```typescript
@property({ reflect: true })
accessor variant: ButtonVariant = "default";
```

---

## Base UI data attributes

Base UI uses `data-*` attributes (`data-checked`, `data-disabled`, `data-open`) for CSS targeting. Preserve these on internal elements so theme styles can target them:

```typescript
<span part="root" role="switch"
  ?data-checked=${this.#checked}
  ?data-disabled=${this.#isDisabled}>
```

```css
/* In theme styles */
[part="root"][data-checked] { background: var(--accent); }
```

---

## Common gotchas

| Gotcha | Details |
|--------|---------|
| No JSX | Use Lit `html` tagged templates. `className` → `class`. |
| No `@customElement` | Registration happens via `applyTheme`, not decorators. Use `static tagName`. |
| Shadow DOM encapsulation | External CSS cannot reach into a component. Expose styling via `::part()` and CSS custom properties. |
| No `querySelector` across shadows | Don't reach into another component's shadow DOM from outside. |
| `accessor` keyword required | All `@property()` and `@state()` decorators need it. |
| Native `#private` | Use `#methodName` for internal methods and state, not TypeScript `private`. |
| `nothing` not `undefined` | Use Lit's `nothing` sentinel for conditional attribute rendering. |

---

## Provenance comments

When porting, add an attribution comment at the top of the component file:

```typescript
/** Ported from ShadCN/ui: https://ui.shadcn.com/docs/components/{name} */
```

```typescript
/** Ported from Base UI: https://base-ui.com/react/components/{name} */
```

---

## See also

- [Creating Components](./creating-components.md) — full file structure and conventions
- [Theming](./theming.md) — how theme styles are structured and applied
- [Accessibility](./accessibility.md) — ARIA patterns, keyboard interactions, focus management
