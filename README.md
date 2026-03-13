# DUI

Unstyled Lit web component library with composable themes.

Components provide structure and behavior with zero visual opinions. Themes provide all aesthetics — colors, spacing, typography, borders. Swap the theme to completely change the look without touching component code.

## Packages

| Package | Description |
|---------|-------------|
| `@dui/core` | Base reset styles, `applyTheme()`, event factory, floating UI utilities |
| `@dui/components` | Unstyled component classes (structural CSS only) |
| `@dui/theme-default` | Design tokens, themed base, per-component aesthetic styles |
| `@dui/docs` | Dev server for visual testing |

## Quick start

```bash
# Run the docs dev server (port 4040)
cd packages/docs && deno task dev
```

```typescript
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { DuiButton } from "@dui/components/button";

applyTheme({
  theme: defaultTheme,
  components: [DuiButton],
});
```

## How it works

`applyTheme()` takes unstyled component classes and a theme, creates themed subclasses with composed styles, and registers them as custom elements. No build step, no decorators, no code generation — just a function call.

Style composition order: component structural CSS → theme base → theme component styles.

## Tech stack

- Runtime: [Deno](https://deno.com)
- UI framework: [Lit](https://lit.dev)
- Build: [esbuild](https://esbuild.github.io)

## Theme Editor

A visual dev tool for editing design token values in real time. Renders a sidebar with token controls alongside an iframe preview of the component gallery.

```bash
cd packages/docs && deno task dev
# Navigate to http://localhost:4040/theme-editor.html
```

- Edit color tokens with OKLCH sliders (Lightness, Chroma, Hue, Alpha)
- Edit non-color tokens (spacing, typography, borders, etc.) with text inputs
- Changes update the iframe preview instantly
- Modified tokens are marked with a blue dot
- "Copy tokens.css" exports a complete `tokens.css` with your overrides applied
- Overrides persist across page reloads via localStorage

## Documentation

- [Architecture](docs/architecture.md) — mental model, package responsibilities, design decisions
- [Creating components](docs/creating-components.md) — step-by-step guide for adding new components
- [Theming](docs/theming.md) — theme system, design tokens, writing component styles
- [Consuming](docs/consuming.md) — integrating dui into an app
