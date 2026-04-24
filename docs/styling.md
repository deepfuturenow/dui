# Styling & Customization

How to customize DUI components. For the token system internals, see [theming.md](./theming.md).

---

## Two-layer model

DUI gives you two ways to style components, each suited to different needs:

| Layer | Mechanism | Best for |
|-------|-----------|----------|
| **CSS variables** | `dui-button { --button-bg: ... }` | Colors, sizes, spacing — the values the variant system controls |
| **`::part(root)`** | `dui-button::part(root) { ... }` | Everything else — filters, transforms, shadows, clip-paths, gradients, animations |

Variables cascade from ancestors. `::part()` does not — it must target the element directly. Use variables when a parent should theme all descendant components; use `::part()` for targeted visual effects.

---

## Discovering the API

Each component exposes CSS custom properties that you can override:

- **Inspect in DevTools** — Chrome shows registered `@property` declarations with syntax and initial-value in computed styles
- **Read `properties.css`** — The `@property` declarations in `packages/components/src/tokens/properties.css` are the machine-readable schema
- **Read component source** — Each file in `packages/components/src/*/` shows the variables and their token defaults

---

## Styling with variables

Each component's styles expose CSS custom properties that control its appearance. These are the values that variants (`variant="danger"`) and sizes (`size="lg"`) toggle internally.

```css
/* Change the button's base color */
dui-button {
  --button-bg: var(--accent);
  --button-fg: oklch(from var(--accent) 0.98 0.01 h);
}

/* Gradient backgrounds work because the theme uses `background`, not `background-color` */
dui-button {
  --button-bg: linear-gradient(135deg, oklch(0.7 0.15 330), oklch(0.6 0.2 280));
  --button-fg: white;
}

/* Size overrides */
dui-button {
  --button-height: 3rem;
  --button-padding-x: var(--space-6);
  --button-font-size: var(--font-size-lg);
}

/* Round buttons */
dui-button {
  --button-radius: var(--radius-full);
}

/* Square icon buttons */
dui-button {
  --button-width: var(--button-height);
  --button-padding-x: 0;
  --button-gap: 0;
}
```

### Ancestor cascading

Variables cascade through the DOM, so a parent can theme all its descendant components:

```css
.danger-zone {
  --button-bg: var(--destructive);
  --button-fg: oklch(from var(--destructive) 0.98 0.01 h);
}
```

Every `<dui-button>` inside `.danger-zone` inherits those colors automatically.

---

## Styling with `::part(root)`

For CSS properties the variable system doesn't cover, use `::part(root)`. This gives you full access to any CSS property — no pre-declared variables needed.

### Frosted glass

```css
dui-button::part(root) {
  backdrop-filter: blur(12px) saturate(1.8);
  background: oklch(0.95 0 0 / 0.6);
  border: 1px solid oklch(1 0 0 / 0.2);
}
```

### Glow shadow

```css
dui-button::part(root) {
  box-shadow: 0 0 20px oklch(0.7 0.2 280 / 0.5);
}
```

### Bouncy press feedback

```css
dui-button::part(root):hover {
  transform: translateY(-1px);
}
dui-button::part(root):active {
  transform: scale(0.97);
}
```

### Custom clip-path

```css
dui-button::part(root) {
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
}
```

### Combining both layers

Variables and `::part()` work together naturally:

```css
/* Variables — for what the variant system controls */
dui-button {
  --button-bg: linear-gradient(135deg, pink, purple);
  --button-fg: white;
}

/* ::part for visual effects */
dui-button::part(root) {
  box-shadow: 0 0 16px oklch(0.7 0.2 280 / 0.4);
  filter: brightness(1.1);
}
dui-button::part(root):hover {
  filter: brightness(1.25);
  transform: translateY(-1px);
}
```

---

## Available parts

Every component exposes at least `::part(root)` on its main internal element. Complex components expose additional parts:

| Component | Parts |
|-----------|-------|
| `dui-button` | `root` |
| `dui-slider` | `root`, `track`, `indicator`, `thumb` |
| `dui-switch` | `root`, `thumb` |
| `dui-checkbox` | `root`, `indicator` |
| `dui-dialog-popup` | `backdrop`, `popup`, `title`, `description` |
| `dui-accordion-item` | `item`, `trigger`, `indicator`, `panel`, `content` |
| `dui-calendar` | `root`, `header`, `heading`, `prev`, `next`, `grid`, `weekday`, `day` |

See each component's API reference for the full list of exposed parts.

---

## Transitions

Component styles include broad `transition-property` lists (e.g., `background, box-shadow, filter, transform, border-color`). This means your `::part()` overrides for filters, transforms, and shadows animate smoothly without redeclaring transitions.

Additionally, `@property` declarations register CSS custom properties with types, enabling smooth animated transitions between variant values (e.g., color changes when switching variants).

---

## Global token overrides

Override design tokens on `:root` to change the entire look:

```css
:root {
  --accent: oklch(0.6 0.2 280);
  --radius-md: 0.75rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

The color system is built on 4 primitives: `--background`, `--foreground`, `--accent`, `--destructive`. All other colors are derived. See [theming.md](./theming.md) for the full color system.

See `packages/components/src/tokens/tokens.css` for the full token list.
