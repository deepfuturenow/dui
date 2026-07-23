---
name: dui-claude-design-system
description: Generate/update the Claude Design (claude.ai/design) design-system version of DUI — the DUI component library published as real, runnable <dui-*> web components with tokens, per-component docs, and composition steering. Use when the user wants to build/publish/update the DUI design system in Claude Design, add components to it, or re-run the DUI → Claude Design sync.
---

# DUI → Claude Design sync

Publishes DUI into a **Claude Design** design-system project as **real, self-registering `<dui-*>` custom elements** — not static recreations. The design agent writes the raw tags (`<dui-button variant="primary">`) directly in its JSX and they render live, on-brand, with full shadow-DOM styling, interaction, floating popups, and events.

This is a **tailored fork** of the bundled `/design-sync` skill. DUI is Deno + Lit web components (outside the stock React/npm converter's envelope), and we proved (POC, 2026-07) that:
- Claude Design's sandbox runs the self-registering module bundle and renders live custom elements.
- The design agent **prefers raw `<dui-*>` tags over React adapters** — so we ship no adapters, no vendored React.

## How it works

`gen.ts` reads three things and emits the upload layout to `.design-sync/ds-bundle/`:
1. `packages/docs/src/component-registry.ts` — the declarative API contract (props, events, slots, theme attrs).
2. `dist/dui-cdn/dui.min.js` — the published self-registering bundle (from `deno task build:cdn`). Becomes `_ds_bundle.js` (header stamped).
3. `packages/components/src/tokens/tokens.css` — design tokens → `tokens/tokens.css`, imported by `styles.css`. `transformTokens()` makes it legible to the Claude Design token compiler: rewrites the light-primitive scope `:root:not([data-theme="dark"])` → `:root` (so the base colors register as tokens; dark still wins by specificity) and adds `/* @kind spacing|font|other */` to time/easing/unitless/em tokens the compiler can't auto-classify.

The generator also emits `thumbnail.html` (brand-mark homepage tile) and a PascalCase **Component names** line in `README.md` (the compiler matches built components by those names). These reproduce edits Claude Design's compiler makes on its own — reproduced here so a re-sync doesn't clobber them.

Per component it emits `components/<Group>/<Name>/{<Name>.d.ts, .prompt.md, .jsx, .html}`:
- **`.d.ts`** — `<Name>Props` interface from the registry (+ referenced type defs appended as a prelude).
- **`.prompt.md`** — raw-tag usage doc; documents the **ref + effect recipe** for object/array props (e.g. `<dui-select>` `options`).
- **`.html`** — a live Lit-native preview card (loads `_ds_bundle.js`, uses real tags) with a `@dsCard group="…" viewport="WxH"` first-line marker. Every card uses one fixed width (`CARD_W` in gen.ts) so content renders at a consistent scale in the pane; the height per card comes from `card-heights.json` (measured content height at `CARD_W`) so cards fit their content — no dead space, no side gaps. **Re-measure when demos change:** render each card in a `CARD_W`-wide iframe, read `body.scrollHeight`, and rewrite `card-heights.json` (`{ "<tag>": <height> }`).
- **`.jsx`** — re-export stub.

## Running it

Inputs are committed for reproducibility: the CDN bundle (`dist/dui-cdn/dui.min.js`, un-ignored in `.gitignore`), the brand fonts (`fonts/`), and the measured card heights (`card-heights.json`). A from-scratch run needs only `gen.ts` — no network, no build — and produces byte-identical output. The two refresh scripts below are only for when their upstreams change.

```bash
# Generate the upload layout (deterministic; only step needed for a normal sync):
deno run --allow-read --allow-write .agents/skills/dui-claude-design-system/gen.ts
#    → .design-sync/ds-bundle/  (gitignored, regenerable)

# (optional) Render-check locally: serve ds-bundle/ and open the cards.
# Then upload with the DesignSync tool (see below).
```

Refresh scripts (run only when the upstream changes, then commit the result):
```bash
# CDN bundle — rebuilt on every DUI publish by the publish-to-npm skill, which
# commits dist/dui-cdn/dui.min.js. Rebuild manually if you changed components:
deno task build:cdn && git add -f dist/dui-cdn/dui.min.js

# Brand webfonts — refresh the committed fonts/ dir from Google Fonts:
deno run --allow-net --allow-read --allow-write .agents/skills/dui-claude-design-system/fetch-fonts.ts
```

**Fonts:** only families the token closure references get a webface. Per `tokens.css`, `--font-sans` = `system-ui` (no Inter), `--font-mono` = `JetBrains Mono` (shipped), `--font-serif` = a system serif (Cambria — no free webfont, stays a fallback). `fetch-fonts.ts` ships JetBrains Mono only. Material Symbols (for `<dui-icon>`, ~3.9 MB) is intentionally excluded — it's not in the token closure; wire it separately if icons are needed.

## Adding components (incremental)

`components.ts` holds all **47** styled top-level components with hand-authored demo cards. (The 61 registry top-level entries minus the 13 `dui-map*`/`dui-chart` tags — separate `@dui/map` + `@dui/chart` packages not in the CDN bundle — and `dui-portal`, a no-visual rendering utility.) To add or revise components:
1. Append `Entry` objects to `COMPONENTS` in `components.ts` (`tag`, `group`, `keywords`, and either a hand-authored `card` body or rely on the `themeAttributes` autoCard fallback + a good `example`).
2. Re-run `gen.ts`.
3. Upload only the **new** `components/<Group>/<Name>/` dirs (plus re-push `_ds_bundle.js`/`styles.css` if the bundle/tokens changed). The existing components are untouched.

Group taxonomy: `Actions, Forms, Data Display, Navigation, Overlays, Feedback, Layout` (see `GROUP_ORDER`). Sub-components (registry entries with a `parent`) are documented via their parent's `.prompt.md` composition, not their own dir.

## Uploading (DesignSync tool)

**Target project — the pin.** `config.json` records the target `projectId` (currently `DUI Design System v2`). A re-sync **updates that same project** (`DesignSync(get_project)` to confirm it exists, then `finalize_plan` + `write_files` against it) — do **not** `create_project`. Only create a new project when `config.json` has no `projectId` (or the user asks for a fresh one / a different environment can't access the pinned one), and then write the new id back into `config.json`.

Upload sequence: `finalize_plan` (writes globs + `localDir: .design-sync/ds-bundle`) → `write_files` the sentinel `_ds_needs_recompile` first → the files (≤256 per call) → re-write the sentinel last so the app rebuilds its card index. Fresh/empty project → incremental path; existing (the normal case) → atomic.

## Projects (Claude Design)

- **`DUI Design System v2`** — `9d8ba712-dcf5-4337-a755-bb26f289a6d9` — the new production DS (real live components). All 47 styled components + JetBrains Mono webfont uploaded.
- `DUI Design System` — `019dcf73-717e-784e-8ca8-a30c2ca5d5ff` — OLD static recreations. Consumed by the "ETO" design project. Retire once v2 is complete, then re-point ETO.
- `DUI Live Components (POC)` — `b920e6b6-…` — the throwaway POC (adapter-vs-raw test). Can be deleted.

## Known follow-ups

- **`@dui/map` + `@dui/chart`** — separate packages, not in the CDN bundle, so not yet synced. Would need their own bundle build to add.
- **Icons** — `<dui-icon>` needs Material Symbols Outlined (~3.9 MB, not in the token closure). If icon-heavy designs are wanted, wire it: add it back to `fetch-fonts.ts` FAMILIES and confirm `<dui-icon>` resolves the font in the design runtime.
- **`_ds_sync.json` anchor** — not yet emitted; add via the copied `lib/sync-hashes.mjs` for skip-unchanged re-syncs.
