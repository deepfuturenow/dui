# DUI — Unstyled Lit Component Library

## Philosophy

Unstyled web components + composable themes. Components provide structure and behavior; themes provide aesthetics. Favor simplicity — avoid over-abstraction and unnecessary indirection.

## Tech stack

- Runtime: Deno
- UI framework: Lit (web components)
- Build: esbuild (bundler in `packages/docs/serve.ts`)
- Testing: Deno's built-in test framework

## Project structure

```
packages/
├── core/            # Base styles, event factory, applyTheme, floating UI utilities
├── components/      # Unstyled component classes (structural CSS only)
├── theme-default/   # Design tokens, themed base, per-component aesthetic styles
└── docs/            # Dev server for visual testing
```

This is a Deno workspace. The root `deno.json` declares all four packages.

## Running commands

- Run all Deno commands from the repo root: `deno check`, `deno lint`, `deno fmt`
- Dev server: `cd packages/docs && deno task dev` (serves on port 4040)
- Always use `git -C /absolute/path <subcommand>` instead of `cd /path && git <subcommand>`

## Key patterns

- Components do NOT use `@customElement`. Registration happens via `applyTheme()` at runtime.
- `static tagName = "dui-foo" as const` identifies each component.
- Structural CSS lives in the component. Aesthetic CSS lives in the theme.
- Properties use `@property()` with `accessor`. Internal state uses `@state() accessor #name`.
- Private methods use native `#private` syntax.
- Events use the `customEvent()` factory from `@dui/core/event`.
- Design tokens are CSS custom properties — never hardcode `px` or `rem` values.

## Screenshots

Before taking a screenshot with `chrome_devtools_take_screenshot`, always resize the viewport first:

```
chrome_devtools_resize_page → { width: 1280, height: 1000 }
```

## Do NOT

- Do not use `@customElement` decorator — registration is done by `applyTheme`
- Do not use React patterns, JSX, or React component conventions
- Do not use `npm` or `node` — this is a Deno project
- Do not hardcode `px`, `rem`, or color values — use design tokens (`--space-*`, `--font-size-*`, etc.)
- Do not put aesthetic styles in components — those belong in the theme
- Do not use `querySelector` to reach into another component's Shadow DOM from outside

## Docs site

The docs dev server (`packages/docs`) is a multi-page site with sidebar navigation, hash routing, and per-component demo pages.

- Adding a component to docs: use the `/add-to-docs` skill
- Component metadata: `packages/docs/src/component-registry.ts` (drives nav, API tables, and `llms.txt`)
- Shell + routing: `packages/docs/src/docs-app.ts` + `docs-router.ts`
- Per-component pages: `packages/docs/src/pages/docs-page-{name}.ts`
- `llms.txt` auto-generates from the registry at server startup

## Detailed conventions

- Architecture & mental model: `docs/architecture.md`
- Creating components: `docs/creating-components.md`
- Theming system: `docs/theming.md`
- App integration: `docs/consuming.md`
