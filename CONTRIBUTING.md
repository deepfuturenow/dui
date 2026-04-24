# Contributing to DUI

Thanks for your interest in contributing! DUI is a styled Lit web component library built on [dui-primitives](https://github.com/deepfuturenow/dui-primitives). This guide will help you get set up and understand our conventions.

## Development Setup

### Prerequisites

- [Deno](https://deno.com/) v2.x or later
- The [dui-primitives](https://github.com/deepfuturenow/dui-primitives) repo cloned alongside this one (the root `deno.json` import maps point to it)

### Getting started

```bash
# Clone both repos
git clone https://github.com/deepfuturenow/dui.git
git clone https://github.com/deepfuturenow/dui-primitives.git

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
├── components/      # Styled components — extend dui-primitives, self-register
├── templates/       # Pre-composed UI patterns built from components
├── chart/           # Observable Plot wrapper
├── map/             # MapLibre GL wrapper
└── docs/            # Dev server and documentation site
```

Components extend unstyled primitives from the separate `dui-primitives` repo (`@dui/primitives`, which also includes core utilities).

## Code Conventions

### Components

- Each component extends a primitive from `@dui/primitives` (e.g., `class DuiBadge extends DuiBadgePrimitive`).
- Components self-register via `customElements.define()` at module level — importing registers them.
- `import "../_install.ts"` injects design tokens into `document.adoptedStyleSheets`.
- Each component declares `static tagName = "dui-foo" as const`.
- Properties use `@property()` with `accessor`. Internal state uses `@state() accessor #name`.
- Private methods use native `#private` syntax.
- Events use the `customEvent()` factory from `@dui/core/event` (part of `@dui/primitives`; defined on the primitive, re-exported from the component index).

### Styling

- Design tokens are CSS custom properties — never hardcode `px`, `rem`, or color values.
- Variables are for the variant/state system (variants, sizes, derived values).
- `::part(root)` exposes full CSS expressiveness to consumers.
- Use `background` (not `background-color`) and full `border` shorthands.

### What NOT to do

- Don't use `@customElement` decorator — components self-register via `customElements.define()`
- Don't hardcode pixel, rem, or color values — use tokens
- Don't put aesthetic styles in primitives — those belong in the component layer
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

See [docs/creating-components.md](docs/creating-components.md) for the full guide. The short version:

1. Ensure the primitive exists in `@dui/primitives` (if not, that's a separate task in the dui-primitives repo)
2. Create `packages/components/src/{name}/` with a component class that extends the primitive
3. Add the export to `packages/components/deno.json`
4. Add the `@dui/primitives/{name}` import mapping to root `deno.json`
5. Add to the component registry in `packages/docs/src/component-registry.ts`
6. Create a docs page at `packages/docs/src/pages/docs-page-{name}.ts`

## Reporting Issues

- **Bug reports** — use the "Bug Report" issue template. Include browser, OS, and steps to reproduce.
- **Feature requests** — use the "Feature Request" issue template. Describe the use case.
- **New component proposals** — use the "New Component" issue template. Explain the component, its API surface, and reference implementations.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
