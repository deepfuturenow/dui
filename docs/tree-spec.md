# `<dui-tree>` — Styled Component Spec

This is the **styled** layer of the tree component, extending
[`DuiTreePrimitive` /
`DuiTreeItemPrimitive`](https://github.com/deepfuturenow/dui-primitives/blob/main/docs/tree-spec.md)
shipped in `@dui/primitives` v1.2.0 (commit `daa1919`).

The primitive owns **all behavior** — keyboard navigation (W3C APG Treeview),
expanded/selected state (controlled + uncontrolled), `selectionMode`, async
loading via `dui-load-children`, ARIA wiring, roving tabindex, disabled
propagation. This spec covers the **aesthetic / visual** layer only.

For behavior, properties, events, and ARIA mapping, see the primitive spec.

---

## Anatomy (unchanged from primitive)

```
<dui-tree>                              ← role="tree"
  <dui-tree-item value="docs">          ← role="treeitem", branch
    <span slot="label">Documents</span>
    <span slot="end">3 items</span>
    <dui-tree-item value="readme">      ← role="treeitem", leaf
      <span slot="label">README.md</span>
      <span slot="end">✅</span>
    </dui-tree-item>
  </dui-tree-item>
</dui-tree>
```

---

## Visual language

Modeled on `<dui-sidebar-menu-button>` so trees and sidebars look cohesive when
combined:

- **Hover background:** `oklch(from var(--foreground) l c h / 0.05)`
- **Selected background:** `oklch(from var(--foreground) l c h / 0.10)`
- **Row radius:** `var(--radius-sm)`
- **Focus ring:** standard DUI focus ring (`--focus-ring-color` +
  `--focus-ring-width`), matches accordion.
- **Chevron:** Lucide `chevron-right` injected via CSS `mask`, rotates 90° on
  `[data-expanded]` with `--duration-fast` + `--ease-out-3`.
- **Loading:** chevron is replaced in-place with a spinner SVG mask +
  `@keyframes spin` on `[data-loading]`. No layout shift.
- **Disabled:** `opacity: 0.4; cursor: not-allowed` on
  `[data-disabled]::part(content)`.
- **Long labels:** truncated by default
  (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`) via
  `::slotted([slot="label"])`.
- **End slot:** always visible, muted (`color: var(--text-2)`, smaller font per
  size).
- **Top-level container:** no chrome — `<dui-tree>` host has `display: block`
  and no padding/border/background. Compose inside cards/sidebars as needed.

---

## Sizes

`<dui-tree>` accepts `size="sm" | "md" | "lg"`, default `sm`. The size attribute
is **only on `<dui-tree>`**, not on `<dui-tree-item>` — the tree's
`:host([size="…"])` rules write to internal CSS custom properties that all
descendant items inherit.

| Size               | Row height                     | Label font  | Indicator | Indent | End-slot font | Inline gap    |
| ------------------ | ------------------------------ | ----------- | --------- | ------ | ------------- | ------------- |
| **`sm`** (default) | `--component-height-sm` (28px) | `--text-xs` | 14px      | 16px   | `--text-2xs`  | `--space-2`   |
| `md`               | `--component-height-md` (32px) | `--text-sm` | 16px      | 20px   | `--text-xs`   | `--space-2`   |
| `lg`               | `--component-height-lg` (36px) | `--text-sm` | 16px      | 24px   | `--text-xs`   | `--space-2_5` |

---

## Customization tokens

These tokens are written by the size attribute on `:host([size="…"])` but can be
overridden by consumers in their own CSS. Consumer overrides win via the cascade
(same specificity, but loaded later).

| Token                    | Default (size=sm)                            | Default (size=md)            | Default (size=lg)            |
| ------------------------ | -------------------------------------------- | ---------------------------- | ---------------------------- |
| `--dui-tree-row-height`  | `var(--component-height-sm)`                 | `var(--component-height-md)` | `var(--component-height-lg)` |
| `--dui-tree-indent`      | `var(--space-4)` (16px)                      | `var(--space-5)` (20px)      | `var(--space-6)` (24px)      |
| `--dui-tree-row-spacing` | `0`                                          | `0`                          | `0`                          |
| `--dui-tree-row-radius`  | `var(--radius-sm)`                           | `var(--radius-sm)`           | `var(--radius-sm)`           |
| `--dui-tree-hover-bg`    | `oklch(from var(--foreground) l c h / 0.05)` | (same)                       | (same)                       |
| `--dui-tree-selected-bg` | `oklch(from var(--foreground) l c h / 0.10)` | (same)                       | (same)                       |

`--dui-tree-row-spacing` is the **vertical gap between rows** (default `0` for
file-explorer density). The inline gap between indicator/label/end slot is
hardcoded per size, not exposed as a token.

### Consumer override example

```css
/* Tighter, accent-tinted selection on a specific tree */
my-app dui-tree.files {
  --dui-tree-row-height: 26px;
  --dui-tree-selected-bg: oklch(from var(--accent) l c h / 0.15);
}
```

---

## Internal render structure (unchanged from primitive)

```
[part="root"]                      ← role="treeitem", focus target, transparent
  [part="content"]                  ← row visual: padding, height, hover/selected bg, radius
    [part="indicator"]              ← chevron / spinner / empty (leaf)
    <slot name="label">             ← truncated by default
    <span class="spacer">           ← flex: 1
    <slot name="end">               ← muted typography
  [part="group"]                    ← children, hidden when collapsed
    <slot>                          ← child <dui-tree-item> elements
```

**Why styles go on `[part="content"]` not `[part="root"]`:** `[part="root"]`
contains the children group, so `:hover` styling on it would bleed through to
descendant rows. The component layer respects this by applying all backgrounds,
borders, radii, and padding to `[part="content"]`.

---

## Indentation

Indentation is applied as `padding-inline-start` on `[part="content"]`:

```
padding-inline-start: calc(var(--row-px) + (var(--dui-tree-level) - 1) * var(--dui-tree-indent));
```

`--dui-tree-level` is set automatically by the primitive on each
`<dui-tree-item>` host. `--row-px` is the row's inline padding (set per size).

---

## Accessibility

All ARIA wiring is handled by the primitive. The styled layer adds:

- **Focus-visible ring** on `[part="root"]:focus-visible` inside the shadow DOM.
- `prefers-reduced-motion: reduce` disables chevron rotation and spinner
  animation.

---

## Out of scope (defer to primitive Phase 2)

- Drag-and-drop reordering
- Virtualization for large trees
- Checkbox selection mode (with indeterminate parents)
- Inline edit / context menu / filter
- Expand/collapse height animation (primitive uses `[hidden]` on the group; not
  trivially animatable — wait until primitive supports it)

---

## Docs page sections

The dev-server demo page (`packages/docs/src/pages/docs-page-tree.ts`) covers:

1. Basic tree
2. Single selection
3. Multiple selection
4. Disabled subtrees
5. Hover-bleed regression test (proves `:hover` doesn't bleed onto descendants)
6. Async loading (`has-children` + `dui-load-children`)
7. Controlled mode
8. Sizes (sm / md / lg)
9. Long-label truncation
10. Custom styling via tokens (override `--dui-tree-selected-bg`,
    `--dui-tree-indent`, etc.)
11. Keyboard reference table
