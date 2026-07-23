---
name: dui-design-sync
description: Sync the DUI component library into a Claude Design (claude.ai/design) design system as real, runnable <dui-*> web components. Use when the user wants to publish/update DUI in Claude Design, add components to the DUI design system, or re-run the DUI design sync.
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
3. `packages/components/src/tokens/tokens.css` — design tokens → `tokens/tokens.css`, imported by `styles.css`.

Per component it emits `components/<Group>/<Name>/{<Name>.d.ts, .prompt.md, .jsx, .html}`:
- **`.d.ts`** — `<Name>Props` interface from the registry (+ referenced type defs appended as a prelude).
- **`.prompt.md`** — raw-tag usage doc; documents the **ref + effect recipe** for object/array props (e.g. `<dui-select>` `options`).
- **`.html`** — a live Lit-native preview card (loads `_ds_bundle.js`, uses real tags) with a `@dsCard group="…" viewport="WxH"` first-line marker.
- **`.jsx`** — re-export stub.

## Running it

```bash
# 1. Ensure the CDN bundle is current (rebuild if components changed):
deno task build:cdn

# 2. (once, or when brand fonts change) Vendor the brand webfonts:
deno run --allow-net --allow-read --allow-write .agents/skills/dui-design-sync/fetch-fonts.ts
#    → .design-sync/fonts-src/ (gitignored). gen.ts copies these into fonts/ and
#    @imports fonts/fonts.css from styles.css. Skip and text uses system fallbacks.

# 3. Generate the upload layout:
deno run --allow-read --allow-write .agents/skills/dui-design-sync/gen.ts
#    → .design-sync/ds-bundle/

# 4. (optional) Render-check locally: serve ds-bundle/ and open the cards.

# 5. Upload with the DesignSync tool (see below).
```

**Fonts:** only families the token closure references get a webface. Per `tokens.css`, `--font-sans` = `system-ui` (no Inter), `--font-mono` = `JetBrains Mono` (shipped), `--font-serif` = a system serif (Cambria — no free webfont, stays a fallback). `fetch-fonts.ts` ships JetBrains Mono only. Material Symbols (for `<dui-icon>`, ~3.9 MB) is intentionally excluded — it's not in the token closure; wire it separately if icons are needed.

## Adding components (incremental)

`components.ts` holds all **47** styled top-level components with hand-authored demo cards. (The 61 registry top-level entries minus the 13 `dui-map*`/`dui-chart` tags — separate `@dui/map` + `@dui/chart` packages not in the CDN bundle — and `dui-portal`, a no-visual rendering utility.) To add or revise components:
1. Append `Entry` objects to `COMPONENTS` in `components.ts` (`tag`, `group`, `keywords`, and either a hand-authored `card` body or rely on the `themeAttributes` autoCard fallback + a good `example`).
2. Re-run `gen.ts`.
3. Upload only the **new** `components/<Group>/<Name>/` dirs (plus re-push `_ds_bundle.js`/`styles.css` if the bundle/tokens changed). The existing components are untouched.

Group taxonomy: `Actions, Forms, Data Display, Navigation, Overlays, Feedback, Layout` (see `GROUP_ORDER`). Sub-components (registry entries with a `parent`) are documented via their parent's `.prompt.md` composition, not their own dir.

## Uploading (DesignSync tool)

Target the **production** project (see below). Fresh/empty project → incremental path; existing → atomic. Sequence: `finalize_plan` (writes globs + `localDir: .design-sync/ds-bundle`) → `write_files` the sentinel `_ds_needs_recompile` first → the files (≤256 per call) → re-write the sentinel last so the app rebuilds its card index.

## Projects (Claude Design)

- **`DUI Design System v2`** — `9d8ba712-dcf5-4337-a755-bb26f289a6d9` — the new production DS (real live components). All 47 styled components + JetBrains Mono webfont uploaded.
- `DUI Design System` — `019dcf73-717e-784e-8ca8-a30c2ca5d5ff` — OLD static recreations. Consumed by the "ETO" design project. Retire once v2 is complete, then re-point ETO.
- `DUI Live Components (POC)` — `b920e6b6-…` — the throwaway POC (adapter-vs-raw test). Can be deleted.

## Known follow-ups

- **`@dui/map` + `@dui/chart`** — separate packages, not in the CDN bundle, so not yet synced. Would need their own bundle build to add.
- **Icons** — `<dui-icon>` needs Material Symbols Outlined (~3.9 MB, not in the token closure). If icon-heavy designs are wanted, wire it: add it back to `fetch-fonts.ts` FAMILIES and confirm `<dui-icon>` resolves the font in the design runtime.
- **`_ds_sync.json` anchor** — not yet emitted; add via the copied `lib/sync-hashes.mjs` for skip-unchanged re-syncs.
