# Contributing to DUI

Thanks for your interest in contributing! DUI is an unstyled Lit web component library with composable themes. This guide will help you get set up and understand our conventions.

## Development Setup

### Prerequisites

- [Deno](https://deno.com/) v2.x or later

### Getting started

```bash
# Clone the repo
git clone https://github.com/deepfuturenow/dui.git
cd dui

# Install dependencies
deno install

# Start the docs dev server (port 4040)
deno task dev
```

The docs site at `http://localhost:4040` serves as the primary development environment — every component has a demo page for visual testing.

### Useful commands

| Command | What it does |
|---------|-------------|
| `deno task dev` | Start docs dev server on port 4040 |
| `deno task build` | Compile all packages to `dist/` |
| `deno task build:cdn` | Build CDN bundle |
| `deno task build:all` | Build everything |
| `deno check` | Type-check all packages |
| `deno lint` | Lint all packages |
| `deno fmt` | Format all packages |

Run all Deno commands from the repo root.

## Project Structure

```
packages/
├── core/            # Base styles, applyTheme(), event factory, floating UI utilities
├── components/      # Unstyled component classes (structural CSS only)
├── theme-default/   # Design tokens, themed base, per-component aesthetic styles
└── docs/            # Dev server and documentation site
```

## Code Conventions

### Components

- Components do **not** use `@customElement`. Registration happens via `applyTheme()` at runtime.
- Each component declares `static tagName = "dui-foo" as const`.
- Structural CSS lives in the component. Aesthetic CSS lives in the theme.
- Properties use `@property()` with `accessor`. Internal state uses `@state() accessor #name`.
- Private methods use native `#private` syntax.
- Events use the `customEvent()` factory from `@dui/core/event`.

### Theming

- Design tokens are CSS custom properties — never hardcode `px`, `rem`, or color values.
- Variables are for the variant/state system (variants, sizes, derived values).
- `::part(root)` exposes full CSS expressiveness to consumers.
- Use `background` (not `background-color`) and full `border` shorthands.

### What NOT to do

- Don't use `@customElement` decorator
- Don't hardcode pixel, rem, or color values — use tokens
- Don't put aesthetic styles in components — those go in the theme
- Don't use `querySelector` to reach into another component's Shadow DOM
- Don't use `npm` or `node` — this is a Deno project

## Pull Request Guidelines

1. **Fork and branch** — create a feature branch from `main`.
2. **Keep PRs focused** — one feature or fix per PR. Smaller PRs are easier to review.
3. **Type-check** — run `deno check` before submitting.
4. **Format** — run `deno fmt` before submitting.
5. **Test visually** — verify your changes in the docs dev server (`deno task dev`).
6. **Describe your changes** — explain what and why in the PR description.

### Commit messages

Use clear, descriptive commit messages. We follow a lightweight conventional style:

```
feat: add dui-date-picker component
fix: correct focus trap in dialog
docs: update theming guide
refactor: simplify accordion keyboard navigation
chore: bump dependencies
```

## Adding a New Component

See [docs/creating-components.md](docs/creating-components.md) for the full step-by-step guide. The short version:

1. Create `packages/components/src/{name}/` with the component class
2. Add theme styles in `packages/theme-default/src/styles/{name}.ts`
3. Register in `packages/components/src/all.ts`
4. Add to the component registry in `packages/docs/src/component-registry.ts`
5. Create a docs page at `packages/docs/src/pages/docs-page-{name}.ts`

## Reporting Issues

- **Bug reports** — use the "Bug Report" issue template. Include browser, OS, and steps to reproduce.
- **Feature requests** — use the "Feature Request" issue template. Describe the use case.
- **New component proposals** — use the "New Component" issue template. Explain the component, its API surface, and reference implementations.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
