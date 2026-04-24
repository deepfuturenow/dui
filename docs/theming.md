# Theming

How the design token system and variant CSS work. For how consumers customize individual components, see [styling.md](./styling.md).

---

## Color system overview

DUI's color system is built on two principles:

1. **Operations on a base** — colors are not fixed values but relationships. Hover is "foreground at 5% opacity over whatever surface I'm on." Text color is "foreground at 90% opacity." Surfaces are "background, but brighter."
2. **Fewer named tokens, more compositional operations** — instead of dozens of semantic tokens, we define 4 primitives and derive everything else via relative color syntax (`oklch(from ...)`).

The entire design is defined by **4 primitive OKLCH colors**. All surfaces, borders, text tiers, and semantic colors are derived at runtime in CSS. No build step. Dark mode is achieved by redefining the same 4 primitives.

### Layer 1: Primitives

These are the only color values chosen:

```css
:root {
  --background:  oklch(0.97 0 0);      /* page canvas */
  --foreground:  oklch(0.15 0 0);      /* primary text direction */
  --accent:      oklch(0.55 0.25 260); /* brand / interactive */
  --destructive: oklch(0.55 0.22 25);  /* errors, danger */
}

:root[data-theme="dark"] {
  --background:  oklch(0.15 0.015 260);
  --foreground:  oklch(0.93 0 0);
  --accent:      oklch(0.75 0.18 260);
  --destructive: oklch(0.70 0.18 25);
}
```

### Layer 2: Derived tokens

Defined once — same rules for light and dark:

```css
:root {
  /* Surfaces — lightness offsets from background */
  --sunken:    oklch(from var(--background) calc(l - 0.03) c h);
  --surface-1: oklch(from var(--background) calc(l + 0.02) c h);
  --surface-2: oklch(from var(--background) calc(l + 0.05) c h);
  --surface-3: oklch(from var(--background) calc(l + 0.09) c h);

  /* Borders — foreground at reduced alpha */
  --border:        oklch(from var(--foreground) l c h / 0.15);
  --border-strong: oklch(from var(--foreground) l c h / 0.25);

  /* Text tiers — foreground at reduced alpha */
  --text-1: oklch(from var(--foreground) l c h / 0.90);
  --text-2: oklch(from var(--foreground) l c h / 0.63);
  --text-3: oklch(from var(--foreground) l c h / 0.45);

  /* Accent surfaces */
  --accent-subtle:      oklch(from var(--accent) l c h / 0.10);
  --accent-text:        color-mix(in oklch, var(--accent) 80%, var(--foreground));

  /* Destructive surfaces */
  --destructive-subtle: oklch(from var(--destructive) l c h / 0.10);
  --destructive-text:   color-mix(in oklch, var(--destructive) 80%, var(--foreground));
}
```

### Token summary

| Token | Type | Derivation |
|-------|------|------------|
| `--background` | **Primitive** | Author-defined |
| `--foreground` | **Primitive** | Author-defined |
| `--accent` | **Primitive** | Author-defined |
| `--destructive` | **Primitive** | Author-defined |
| `--sunken` | Derived | `oklch(from bg calc(l - 0.03) c h)` |
| `--surface-1` | Derived | `oklch(from bg calc(l + 0.02) c h)` |
| `--surface-2` | Derived | `oklch(from bg calc(l + 0.05) c h)` |
| `--surface-3` | Derived | `oklch(from bg calc(l + 0.09) c h)` |
| `--border` | Derived | `oklch(from fg l c h / 0.15)` |
| `--border-strong` | Derived | `oklch(from fg l c h / 0.25)` |
| `--text-1` | Derived | `oklch(from fg l c h / 0.90)` |
| `--text-2` | Derived | `oklch(from fg l c h / 0.63)` |
| `--text-3` | Derived | `oklch(from fg l c h / 0.45)` |
| `--accent-subtle` | Derived | `oklch(from accent l c h / 0.10)` |
| `--accent-text` | Derived | `color-mix(accent 80%, fg)` |
| `--destructive-subtle` | Derived | `oklch(from destructive l c h / 0.10)` |
| `--destructive-text` | Derived | `color-mix(destructive 80%, fg)` |

**Total: 4 primitives + 13 derived = 17 color tokens.** Customizing the palette means changing 4 values.

---

## Alpha compositing pattern

**Principle**: all derived colors except `--accent-text` and `--destructive-text` are semi-transparent. They composite against whatever surface they're painted on, automatically adapting to any depth level.

### Text

Use `--text-1/2/3` for standard tiers. For custom intensities:

```css
color: oklch(from var(--foreground) l c h / N);  /* N is 0–1 */
```

### Borders

`--border` and `--border-strong` are semi-transparent foreground. They work on any surface without adjustment.

### Interaction states

Components use numeric properties for hover/active overlays:

```css
:host {
  --_select: 0;
  --_interact: 0;
  background: oklch(from var(--foreground) l c h / calc(var(--_select) + var(--_interact)));
}

:host([selected]) { --_select: 0.10; }
:host(:hover)     { --_interact: 0.05; }
:host(:active)    { --_interact: 0.10; }
```

Standard alpha values:

| State | Alpha |
|---|---|
| Default | 0 (transparent) |
| Hover | 0.05 |
| Active | 0.10 |
| Selected | 0.10 |
| Selected + hover | 0.15 |
| Disabled | `opacity: 0.2` on `[part="root"]` |

---

## Surface depth model

The depth system uses a single signed axis: lightness offset from the background.

```
sunken  ◄── bg ──► s1 ──► s2 ──► s3
(-0.03)    (0)   (+0.02) (+0.05) (+0.09)
darker              brighter ──────►
```

- **Sunken** (`l - 0.03`): input fields, code blocks, inset wells
- **Background** (baseline): the page canvas
- **Surface-1** (`l + 0.02`): sidebars, metric cards, first-level containers
- **Surface-2** (`l + 0.05`): content cards, panels, dialogs
- **Surface-3** (`l + 0.09`): elevated panels, popovers, menus

In dark mode, positive offsets still brighten and sunken still darkens.

---

## Styling philosophy: variables + `::part`

DUI uses a two-layer approach to styling:

- **CSS custom properties (variables)** — for the variant/state system. These are the small set of values that variants, sizes, and derived states actually toggle.
- **`::part(root)`** — for everything else. Consumers style any CSS property directly on the exposed part.

A variable earns its place if it meets at least one of:

1. **Variants toggle it.** E.g., `--button-bg` is swapped by `:host([variant="danger"])`.
2. **Other variables derive from it.** E.g., hover colors computed from the base color.
3. **Sizes toggle it.** E.g., `--button-height` changes per size.
4. **Ancestor cascading.** A parent can set `--button-bg` to theme all descendant buttons.

If a value doesn't meet any of these, it should not be a variable. The consumer uses `::part(root)` instead.

### Why `background` not `background-color`

Component styles use the full `background` shorthand so variables like `--button-bg` accept gradients, images, and multiple layers — not just flat colors.

---

## How DUI defines variants

### Two-axis system (intent × appearance)

Most components use a two-axis pattern. See [creating-components.md](./creating-components.md) for the full implementation pattern.

**Variant** (intent): `"neutral"` (default), `"primary"`, `"danger"`
**Appearance** (treatment): `"filled"` (default), `"outline"`, `"ghost"`, `"soft"`, `"link"`

| Intent | Filled bg | Ghost/Outline text |
|--------|----------|-------------------|
| neutral | `--foreground` | `--text-1` |
| primary | `--accent` | `--accent-text` |
| danger | `--destructive` | `--destructive-text` |

### Sizes

| Value | Height token |
|-------|--------|
| `"xs"` | `--component-height-xs` |
| `"sm"` | `--component-height-sm` |
| `"md"` (default) | `--component-height-md` |
| `"lg"` | `--component-height-lg` |

---

## `@property` declarations

Component-level CSS custom properties are registered via `@property` in `properties.css`:

```css
@property --button-bg {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.15 0 0);
}
```

This enables:
- **Browser type-checking** — rejects invalid values
- **Smooth transitions** — registered properties can be interpolated
- **DevTools integration** — shows syntax and initial-value in computed styles

Only consumer-facing properties are declared (`--button-bg`, `--button-radius`, etc.). Internal tokens (`--space-4`, `--foreground`) are not declared.

---

## Customizing the palette

Override the 4 primitive colors to change the entire color system:

```css
:root {
  --accent: oklch(0.6 0.2 280);        /* purple accent */
  --destructive: oklch(0.55 0.22 25);  /* keep red for danger */
}
```

All derived tokens (surfaces, borders, text tiers, accent-subtle, etc.) update automatically.

### Example palettes

**Warm neutral** (4 primitives):
```css
--background:  oklch(0.96 0.01 80);
--foreground:  oklch(0.20 0.02 60);
--accent:      oklch(0.58 0.16 55);
--destructive: oklch(0.55 0.20 25);
```

**Ocean** (4 primitives):
```css
--background:  oklch(0.97 0.01 230);
--foreground:  oklch(0.18 0.02 240);
--accent:      oklch(0.55 0.20 230);
--destructive: oklch(0.58 0.20 25);
```

---

## Browser support

Relative color syntax (`oklch(from ...)`) requires Chrome 119+, Safari 16.4+, Firefox 128+.
`color-mix(in oklch, ...)` requires Chrome 111+, Safari 16.2+, Firefox 113+.
Both are Baseline Widely Available. No fallbacks necessary.
