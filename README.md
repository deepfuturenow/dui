# DUI

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@deepfuture/dui-core.svg)](https://www.npmjs.com/package/@deepfuture/dui-core)

Unstyled [Lit](https://lit.dev) web component library with composable themes.

Components provide structure and behavior with zero visual opinions. Themes provide all aesthetics — colors, spacing, typography, borders. Swap the theme to completely change the look without touching component code.

**[Live Docs & Demos →](https://deepfuturenow.github.io/dui/)**

## Install

**npm / pnpm / yarn:**

```bash
npm install @deepfuture/dui-core @deepfuture/dui-components @deepfuture/dui-theme-default
```

**Deno:**

```typescript
import { applyTheme } from "npm:@deepfuture/dui-core/apply-theme";
import { defaultTheme } from "npm:@deepfuture/dui-theme-default";
import { allComponents } from "npm:@deepfuture/dui-components/all";
```

**CDN (zero setup):**

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@deepfuture/dui-cdn/dui.min.js"></script>
```

## Quick Start

```typescript
import { applyTheme } from "@deepfuture/dui-core/apply-theme";
import { defaultTheme } from "@deepfuture/dui-theme-default";
import { DuiButton } from "@deepfuture/dui-components/button";
import { DuiDialog, DuiDialogTrigger, DuiDialogPopup, DuiDialogClose } from "@deepfuture/dui-components/dialog";

// Register components with a theme — this is the only setup needed
applyTheme({
  theme: defaultTheme,
  components: [DuiButton, DuiDialog, DuiDialogTrigger, DuiDialogPopup, DuiDialogClose],
});
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
      <dui-button variant="outline">Close</dui-button>
    </dui-dialog-close>
  </dui-dialog-popup>
</dui-dialog>
```

Or register everything at once:

```typescript
import { applyTheme } from "@deepfuture/dui-core/apply-theme";
import { defaultTheme } from "@deepfuture/dui-theme-default";
import { allComponents } from "@deepfuture/dui-components/all";

applyTheme({ theme: defaultTheme, components: allComponents });
```

## How It Works

`applyTheme()` takes unstyled component classes and a theme, creates themed subclasses with composed styles, and registers them as custom elements.

```
Component structural CSS → Theme base styles → Theme component styles
```

No build step, no decorators, no code generation — just a function call. Components are standard web components that work in any framework or plain HTML.

## Components

43 component families, 85+ elements total.

| Category | Components |
|----------|-----------|
| **Actions** | Button, Link, Toggle, Toggle Group, Toolbar |
| **Forms** | Input, Textarea, Select, Combobox, Checkbox, Checkbox Group, Radio, Radio Group, Switch, Slider, Number Field, Dropzone |
| **Data Display** | Badge, Avatar, Calendar, Data Table, Progress, Spinner, Separator, Trunc |
| **Overlays** | Dialog, Alert Dialog, Popover, Tooltip, Menu, Menubar, Preview Card, Command |
| **Disclosure** | Accordion, Collapsible, Tabs |
| **Navigation** | Breadcrumb, Sidebar (with 12 sub-components) |
| **Layout** | HStack, VStack, Center, Page Inset, Scroll Area, Portal |
| **Utility** | Icon |

## Styling

DUI uses a two-layer styling approach:

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

DUI uses CSS custom properties for theming. Toggle dark mode by adding `class="dark"` to a parent element:

```html
<body class="dark">
  <!-- All DUI components render in dark mode -->
</body>
```

## Packages

| Package | Purpose |
|---------|---------|
| [`@deepfuture/dui-core`](https://www.npmjs.com/package/@deepfuture/dui-core) | `applyTheme()`, event factory, base styles |
| [`@deepfuture/dui-components`](https://www.npmjs.com/package/@deepfuture/dui-components) | Unstyled component classes |
| [`@deepfuture/dui-theme-default`](https://www.npmjs.com/package/@deepfuture/dui-theme-default) | Design tokens + aesthetic styles |
| [`@deepfuture/dui-cdn`](https://www.npmjs.com/package/@deepfuture/dui-cdn) | Pre-bundled CDN build (all deps inlined) |

## Dev Tools

### Theme Editor

A visual editor for design tokens. Edit colors with OKLCH sliders, tweak spacing and typography, and export your customized `tokens.css`.

### Inspector

A runtime inspector and mutation API for DUI components. Two interfaces:

- **Visual UI** (Ctrl+Shift+I) — hover-highlight components, inspect properties/tokens/styles, edit theme CSS and design tokens live
- **Console API** — `window.__dui_inspect()`, `window.__dui_mutate.*`, `window.__dui_export()` for programmatic access by agents or scripts

Both share a changelog, so agent and human edits are visible to each other. Changes can be exported as structured source file diffs.

See **[Inspector docs](docs/inspector.md)** for the full API reference and usage guide.

## Documentation

- **[Live Docs](https://deepfuturenow.github.io/dui/)** — interactive demos for every component
- [Architecture](docs/architecture.md) — mental model, package responsibilities, design decisions
- [Creating Components](docs/creating-components.md) — guide for adding new components
- [Theming](docs/theming.md) — theme system, design tokens, writing component styles
- [Consuming](docs/consuming.md) — integrating DUI into an app
- [Inspector](docs/inspector.md) — runtime inspection, mutation API, and visual editor
- [Accessibility](docs/accessibility.md) — accessibility patterns and guidelines

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for dev setup, code conventions, and PR guidelines.

## License

[MIT](LICENSE)
