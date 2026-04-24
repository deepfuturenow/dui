# DUI

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@deepfuture/dui-components.svg)](https://www.npmjs.com/package/@deepfuture/dui-components)

Styled [Lit](https://lit.dev) web component library built on [dui-primitives](https://github.com/deepfuturenow/dui-primitives).

DUI extends unstyled, accessible primitive components with a complete design system — design tokens, variant systems, and aesthetic CSS. Import a component and it's ready to use. No setup, no configuration.

**[Live Docs & Demos →](https://deepfuturenow.github.io/dui/)**

## Install

**npm / pnpm / yarn:**

```bash
npm install @deepfuture/dui-components
```

**CDN (zero setup):**

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@deepfuture/dui-cdn/dui.min.js"></script>
```

## Quick Start

Import the components you need — they self-register on import:

```typescript
import "@deepfuture/dui-components/button";
import "@deepfuture/dui-components/dialog";
```

```html
<dui-dialog>
  <dui-dialog-trigger>
    <dui-button>Open Dialog</dui-button>
  </dui-dialog-trigger>
  <dui-dialog-popup>
    <h2>Hello</h2>
    <p>This is a dialog.</p>
    <dui-dialog-close>
      <dui-button appearance="outline">Close</dui-button>
    </dui-dialog-close>
  </dui-dialog-popup>
</dui-dialog>
```

Or register everything at once:

```typescript
import "@deepfuture/dui-components";
```

## How It Works

DUI uses a two-layer inheritance model:

1. **Primitives** (`@dui/primitives`) — unstyled base classes with accessibility, keyboard behavior, and ARIA built in
2. **Components** (`@dui/components`) — extend primitives with design tokens, variant systems, and aesthetic CSS

Each component self-registers via `customElements.define()` when imported. Design tokens are automatically injected into `document.adoptedStyleSheets` on first import.

```
DuiButtonPrimitive (structure, ARIA, keyboard)
       ↓ extends
DuiButton (tokens, variants, aesthetic CSS, customElements.define())
```

No build step, no setup function, no configuration — just import and use.

## Components

43 component families, 85+ elements total.

| Category | Components |
|----------|-----------|
| **Actions** | Button, Toggle, Toggle Group, Toolbar, Split Button |
| **Forms** | Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, Number Field, Dropzone, Field, Fieldset |
| **Data Display** | Badge, Avatar, Calendar, Data Table, Progress, Spinner, Separator, Trunc |
| **Overlays** | Dialog, Alert Dialog, Popover, Tooltip, Menu, Menubar, Preview Card, Command |
| **Disclosure** | Accordion, Collapsible, Tabs |
| **Navigation** | Breadcrumb, Sidebar (with 12 sub-components), Stepper |
| **Layout** | Card, Card Grid, Scroll Area, Portal |
| **Utility** | Icon |

## Styling

DUI uses a two-layer approach to styling:

### CSS Variables — for the variant system

Variables control values that variants, sizes, and states toggle:

```css
/* Override variant colors */
dui-button {
  --button-bg: linear-gradient(135deg, pink, purple);
  --button-radius: var(--radius-full);
}
```

### `::part(root)` — for everything else

Every component exposes a `root` CSS part for full CSS expressiveness:

```css
/* Frosted glass effect */
dui-dialog-popup::part(root) {
  backdrop-filter: blur(12px);
}

/* Custom hover animation */
dui-button::part(root):hover {
  filter: brightness(1.25);
  transform: translateY(-1px);
}

/* Glow shadow */
dui-badge::part(root) {
  box-shadow: 0 0 16px oklch(0.7 0.2 280 / 0.4);
}
```

No need for the library to anticipate every CSS property — `::part()` gives you direct access.

## Dark Mode

Toggle dark mode by setting `data-theme="dark"` on the `<html>` element:

```html
<html data-theme="dark">
  <!-- All DUI components render in dark mode -->
</html>
```

## Templates

Pre-composed UI patterns built from DUI components — ready-to-use cards, feed items, and other building blocks. Templates adapt automatically to dark mode and token overrides.

```bash
npm install @deepfuture/dui-templates
```

```typescript
import "@deepfuture/dui-templates/feed";
```

```html
<dui-feed-item
  title="Earthquake detected"
  subtitle="USGS Pacific Northwest"
  timestamp="2 min ago"
  category="Seismic"
  severity="high"
  description="Magnitude 4.2 recorded near Portland, OR."
></dui-feed-item>
```

Templates self-register on import, just like components.

## Packages

| Package | Purpose |
|---------|---------|
| [`@deepfuture/dui-components`](https://www.npmjs.com/package/@deepfuture/dui-components) | Styled components (extends dui-primitives) |
| [`@deepfuture/dui-templates`](https://www.npmjs.com/package/@deepfuture/dui-templates) | Pre-composed UI patterns |
| [`@deepfuture/dui-cdn`](https://www.npmjs.com/package/@deepfuture/dui-cdn) | Pre-bundled CDN build (all deps inlined) |
| [`@deepfuture/dui-inspector`](https://www.npmjs.com/package/@deepfuture/dui-inspector) | Runtime inspector & mutation API |

**Foundation (separate repo):**

| Package | Purpose |
|---------|---------|
| `@deepfuture/dui-primitives/core` | Base reset, event factory, floating UI utilities (part of dui-primitives) |
| [`@deepfuture/dui-primitives`](https://www.npmjs.com/package/@deepfuture/dui-primitives) | Unstyled accessible component classes |

## Dev Tools

### Theme Editor

A visual editor for design tokens. Edit colors with OKLCH sliders, tweak spacing and typography, and export your customized `tokens.css`.

### Inspector

A runtime inspector and mutation API for DUI components ([separate package](https://github.com/deepfuturenow/dui-inspector)). Two interfaces:

- **Visual UI** (Ctrl+Shift+I) — hover-highlight components, inspect properties/tokens/styles, edit theme CSS and design tokens live
- **Console API** — `window.__dui_inspect()`, `window.__dui_mutate.*`, `window.__dui_export()` for programmatic access by agents or scripts

## Documentation

- **[Live Docs](https://deepfuturenow.github.io/dui/)** — interactive demos for every component
- [Architecture](docs/architecture.md) — two-layer inheritance model, package responsibilities
- [Creating Components](docs/creating-components.md) — extending primitives into styled components
- [Creating Templates](docs/creating-templates.md) — building pre-composed UI patterns
- [Theming](docs/theming.md) — color system, design tokens, variant CSS
- [Styling](docs/styling.md) — customizing components with variables and `::part()`
- [Consuming](docs/consuming.md) — integrating DUI into an app

## Building Your Own Component Set

DUI itself is an example of extending [dui-primitives](https://github.com/deepfuturenow/dui-primitives). You can build your own styled component library the same way:

1. Install `@deepfuture/dui-primitives`
2. Extend primitives with your own aesthetic CSS
3. Call `customElements.define()` to self-register

See [Creating Components](docs/creating-components.md) for the full pattern.

## License

[MIT](LICENSE)
