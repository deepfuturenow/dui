# DUI — Styled Lit Component Library

## Philosophy

Two-layer inheritance: unstyled primitives (in a separate repo) provide structure and behavior; styled components extend them with aesthetic CSS and design tokens. Favor simplicity — avoid over-abstraction and unnecessary indirection.

## Architecture — Three repos

```
dui-primitives/              # @dui/primitives — behavioral foundation (includes core)
└── packages/primitives/     # Unstyled base classes + core utilities (base, event, floating UI)

dui/                         # @dui/components + @dui/templates — styled layer
├── packages/components/     # Extends primitives, adds aesthetic CSS, self-registers
├── packages/templates/      # Pre-composed UI patterns built from components
├── packages/chart/          # Observable Plot wrapper
├── packages/map/            # MapLibre GL wrapper
└── packages/docs/           # Dev server for visual testing

dui-inspector/               # @dui/inspector — runtime component inspector (standalone)
```

## Tech stack

- Runtime: Deno
- UI framework: Lit (web components)
- Build: esbuild (bundler in `packages/docs/serve.ts`), tsc (npm builds)
- Testing: Deno's built-in test framework

## Running commands

- Run all Deno commands from the repo root: `deno check`, `deno lint`, `deno fmt`
- Dev server: `cd packages/docs && deno task dev` (serves on port 4040)
- Always use `git -C /absolute/path <subcommand>` instead of `cd /path && git <subcommand>`

## Key patterns

- **Two-layer inheritance:** Primitives (`DuiFooPrimitive extends LitElement`) in dui-primitives → Components (`DuiFoo extends DuiFooPrimitive`) in dui
- **Self-registering:** Components call `customElements.define()` at module level — importing registers them.
- **Token injection:** `import "../_install.ts"` in each component injects design tokens into `document.adoptedStyleSheets` (runs once via ES module caching)
- `static tagName = "dui-foo" as const` identifies each component
- Properties use `@property()` with `accessor`. Internal state uses `@state() accessor #name`.
- Behavior-critical styles (`display: none`, `opacity: 0` for state) must live on internal shadow DOM elements, never on `:host`. The host is a public surface that consumers legitimately style.
- Private methods use native `#private` syntax.
- Events use the `customEvent()` factory from `@dui/core/event` (part of `@dui/primitives`).
- Design tokens are CSS custom properties — never hardcode `px` or `rem` values.

## Screenshots

Before taking a screenshot with `chrome_devtools_take_screenshot`, always resize the viewport first:

```
chrome_devtools_resize_page → { width: 1280, height: 1000 }
```

Always save screenshots to file to avoid Anthropic's multi-image size limits (inline base64 images over 2000px in either dimension cause unrecoverable 400 errors in long conversations):

```
chrome_devtools_take_screenshot → { filePath: "./screenshots/screenshot.png" }
```

Then use `read` to view the image if needed.

## Do NOT

- Do not use `@customElement` decorator — components self-register via `customElements.define()` at module level
- Do not use React patterns, JSX, or React component conventions
- Do not use `npm` or `node` — this is a Deno project
- Do not hardcode `px`, `rem`, or color values — use design tokens (`--space-*`, `--font-size-*`, etc.)
- Do not put aesthetic styles in primitives — those belong in the component layer
- Do not use `querySelector` to reach into another component's Shadow DOM from outside

## Docs site

The docs dev server (`packages/docs`) is a multi-page site with sidebar navigation, hash routing, and per-component demo pages.

- Adding a component to docs: use the `/edit-docs` skill
- Adding a template: use the `/create-template` skill
- Component metadata: `packages/docs/src/component-registry.ts` (drives nav, API tables, and `llms.txt`)
- Shell + routing: `packages/docs/src/docs-app.ts` + `docs-router.ts`
- Per-component pages: `packages/docs/src/pages/docs-page-{name}.ts`
- `llms.txt` auto-generates from the registry at server startup

## Skill maintenance

When changing component APIs:

- **New components**: add to `component-registry.ts` to drive the docs nav, API tables, and `llms.txt` generation.

## Templates

Templates are pre-composed UI patterns in `packages/templates/`. They combine DUI components + vanilla HTML/CSS, use design tokens for all styling, and depend on components via side-effect imports (e.g., `import "@dui/components/badge"`).

- Templates own all their CSS (no structure/theme split)
- Templates are presentational only — no data fetching, no global state
- Templates self-register via `customElements.define()` at module level
- Templates can compose interactive DUI components (tabs, accordion) but don't implement their own interaction logic

## Detailed conventions

- Architecture & mental model: `docs/architecture.md`
- Creating components: `docs/creating-components.md`
- Creating templates: `docs/creating-templates.md`
- Theming & tokens: `docs/theming.md`
- Styling & customization: `docs/styling.md`
- App integration: `docs/consuming.md`
