# DUI Design Tokens

All tokens are CSS custom properties declared on `:root` by the default theme. They cascade into shadow DOM via CSS custom property inheritance — every `dui-*` component can read them.

Dark mode is activated by `data-theme="dark"` on `<html>`. Token values switch automatically.

---

## Color Primitives (Theme Author Picks)

These 4 values are the only things that change between light/dark and custom themes. Everything else is derived.

```css
/* Light (default) */
--background:  oklch(0.97 0 0);     /* Near-white page background */
--foreground:  oklch(0.15 0 0);     /* Near-black text */
--accent:      oklch(0.55 0.25 260); /* Blue-purple primary */
--destructive: oklch(0.55 0.22 25);  /* Red-orange for danger */

/* Dark */
--background:  oklch(0.15 0.015 260);
--foreground:  oklch(0.93 0 0);
--accent:      oklch(0.75 0.18 260);
--destructive: oklch(0.70 0.18 25);
```

## Derived Color Tokens

Computed from the 4 primitives. Use these in your components — never hardcode hex/rgb values.

### Surfaces
```css
--sunken:    /* background darkened 3% — for input backgrounds, inset areas */
--surface-1: /* background lightened 2% — cards, panels */
--surface-2: /* background lightened 5% — slightly raised elements */
--surface-3: /* background lightened 9% — most elevated surfaces */
```

### Borders
```css
--border:        /* foreground at 15% opacity — standard borders */
--border-strong: /* foreground at 25% opacity — emphasized borders */
```

### Text Tiers
```css
--text-1: /* foreground at 90% opacity — primary body text */
--text-2: /* foreground at 63% opacity — secondary/muted text */
--text-3: /* foreground at 45% opacity — placeholder/disabled text */
```

### Accent Surfaces
```css
--accent-subtle: /* accent at 10% opacity — tinted backgrounds */
--accent-text:   /* accent mixed with foreground — readable accent text */
```

### Destructive Surfaces
```css
--destructive-subtle: /* destructive at 10% opacity — error backgrounds */
--destructive-text:   /* destructive mixed with foreground — error text */
```

### Utility
```css
--scrim: /* foreground at 35% opacity — modal/dialog backdrop overlay */
```

---

## Spacing

Tailwind base-4 system. Every value is a multiple of 0.25rem (4px).

```css
--space-0:    0
--space-px:   1px
--space-0_5:  0.125rem   /* 2px */
--space-1:    0.25rem    /* 4px */
--space-1_5:  0.375rem   /* 6px */
--space-2:    0.5rem     /* 8px */
--space-2_5:  0.625rem   /* 10px */
--space-3:    0.75rem    /* 12px */
--space-3_5:  0.875rem   /* 14px */
--space-4:    1rem       /* 16px */
--space-4_5:  1.125rem   /* 18px */
--space-5:    1.25rem    /* 20px */
--space-6:    1.5rem     /* 24px */
--space-7:    1.75rem    /* 28px */
--space-8:    2rem       /* 32px */
--space-9:    2.25rem    /* 36px */
--space-10:   2.5rem    /* 40px */
--space-12:   3rem      /* 48px */
--space-14:   3.5rem    /* 56px */
--space-16:   4rem      /* 64px */
--space-20:   5rem      /* 80px */
--space-24:   6rem      /* 96px */
--space-32:   8rem      /* 128px */
--space-40:   10rem     /* 160px */
--space-48:   12rem     /* 192px */
--space-64:   16rem     /* 256px */
--space-80:   20rem     /* 320px */
--space-96:   24rem     /* 384px */
```

---

## Typography

### Font Families
```css
--font-sans:  'Inter', system-ui, -apple-system, sans-serif
--font-serif: ui-serif, Georgia, Cambria, Times, serif
--font-mono:  'JetBrains Mono', ui-monospace, Menlo, monospace
```

### Font Sizes
```css
--font-size-2xs:  0.65rem
--font-size-xs:   0.75rem   /* 12px */
--font-size-sm:   0.875rem  /* 14px */
--font-size-base: 0.9375rem /* 15px — body default */
--font-size-md:   1rem      /* 16px */
--font-size-lg:   1.125rem  /* 18px */
--font-size-xl:   1.25rem   /* 20px */
--font-size-2xl:  1.5rem    /* 24px — h2 headings */
--font-size-3xl:  1.875rem  /* 30px */
--font-size-4xl:  2.25rem   /* 36px */
--font-size-5xl:  3rem      /* 48px */
--font-size-6xl:  3.75rem   /* 60px */
--font-size-7xl:  4.5rem    /* 72px */
```

### Font Weights
```css
--font-weight-regular:  400
--font-weight-medium:   500
--font-weight-semibold: 600
--font-weight-bold:     700
```

### Line Heights
```css
--line-height-none:    1
--line-height-tight:   1.25
--line-height-snug:    1.375
--line-height-normal:  1.5   /* default */
--line-height-relaxed: 1.625
```

---

## Border Radii

```css
--radius-none: 0
--radius-xs:   0.125rem   /* 2px — subtle */
--radius-sm:   0.25rem    /* 4px — small inputs */
--radius-md:   0.5rem     /* 8px — buttons, cards */
--radius-lg:   1rem       /* 16px — dialogs */
--radius-xl:   1.5rem     /* 24px — large cards */
--radius-2xl:  2rem       /* 32px */
--radius-full: 9999px     /* pills, avatars */
```

---

## Shadows / Elevation

```css
--shadow-none: 0 0 0 0 transparent
--shadow-xs:   0 1px 2px 0 rgb(0 0 0 / 0.05)           /* hairline */
--shadow-sm:   0 1px 3px 0 rgb(0 0 0 / 0.1), ...       /* card */
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1), ...    /* dropdown */
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1), ...  /* overlay */
--shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1), ...  /* modal */
--shadow-2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25)     /* deep */
```

---

## Motion

```css
--duration-instant:  50ms
--duration-fastest:  75ms
--duration-faster:   100ms
--duration-fast:     150ms   /* default micro-interactions */
--duration-normal:   250ms   /* standard transitions */
--duration-slow:     400ms
--duration-slower:   700ms
```

---

## Component Sizing Scale

Consistent height scale for interactive controls:

```css
--component-height-xxs: 1.25rem   /* 20px */
--component-height-xs:  1.5rem    /* 24px */
--component-height-sm:  1.75rem   /* 28px */
--component-height-md:  2rem      /* 32px — default */
--component-height-lg:  2.25rem   /* 36px */
--component-height-xl:  2.5rem    /* 40px */
```

---

## Focus Ring

```css
--focus-ring-color:  var(--accent)
--focus-ring-width:  2px
--focus-ring-offset: 2px
```

---

## Z-index Scale

```css
--z-base:     0
--z-dropdown: 700
--z-sticky:   800
--z-overlay:  900
--z-modal:    1000
--z-popover:  1100
--z-toast:    1200
--z-tooltip:  1300
```

---

## Usage Rules

1. **Always use semantic tokens** (`--foreground`, `--surface-1`, `--text-2`), never hardcode colors.
2. **Dark mode is automatic** — just use the tokens and `data-theme="dark"` handles everything.
3. **Use spacing tokens for all margins/padding/gaps** — `var(--space-4)` not `16px`.
4. **Use font-size tokens** — `var(--font-size-sm)` not `14px`.
5. **Use radius tokens** — `var(--radius-md)` not `8px`.
6. The 4 color primitives (`--background`, `--foreground`, `--accent`, `--destructive`) are the only values a theme author changes. Everything else derives automatically.
