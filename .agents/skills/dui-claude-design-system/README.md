# dui-claude-design-system — context & rationale

> This is the **maintainer** README (why it exists, how Claude Design works, what we
> learned). For **how to run it**, see [`SKILL.md`](./SKILL.md).

This skill generates and maintains the **Claude Design ([claude.ai/design](https://claude.ai/design)) design-system version of DUI**: it converts the DUI component library into the layout Claude Design consumes, so the design agent builds UI out of **real, runnable `<dui-*>` web components** — every design it produces is on-brand, made of DUI's actual parts, and maps 1:1 onto shippable code.

---

## 1. Origin — the question that started this

The trigger was: *can hi-fi prototypes in Claude Design use real `<dui-*>` elements instead of hand-styled approximations?* The old "DUI Design System" import was **token-only** — its manifest exported zero runnable components (`"components":[]`), so the agent could only reproduce DUI's *look* with static CSS (`.btn` classes), not use the real components.

We proved (POC, 2026-07) that the answer is **yes**, and built this skill to do it properly. The key empirical findings, all verified in Claude Design's own sandbox:

- **The card sandbox runs the self-registering module bundle.** Loading DUI's CDN bundle registers every `<dui-*>` custom element; shadow-DOM styling, injected design tokens, floating-portal popups, object/array properties, and `CustomEvent`s all work live (verified by selecting an option in a live `<dui-select>` inside a card).
- **The design agent writes React/JSX and prefers raw custom-element tags.** When asked to build a screen, it authored `<dui-select …>` directly in JSX (confirmed via DevTools source-maps), *not* a React wrapper — even when we shipped wrappers. So **we ship no React adapters and no vendored React**; the agent uses the raw tags and they render.

That second finding is the whole architecture: **raw-tag consumption.**

---

## 2. How a Claude Design design system works (the mechanism)

A bound design system is a **snapshot** the app copies into each design project, plus a read-only source pointer. What matters for us is what the app *consumes*, and by whom:

| Artifact | Consumed by | Purpose |
|---|---|---|
| `README.md` | the **design agent** (inlined into its prompt, ~first **32 KB**) | global steering: usage, conventions, composition guidance |
| `components/<group>/<Name>/<Name>.prompt.md` | the design agent | per-component usage ("Usage notes for Claude") |
| `components/…/<Name>.d.ts` | the design agent | typed API (`<Name>Props`) |
| `components/…/<Name>.html` | humans (the component picker) + render | a live preview card; first line is a `@dsCard` marker |
| `components/…/<Name>.jsx` | tooling | a re-export stub (one `.jsx`+`.html` pair per dir) |
| `_ds_bundle.js` | the design runtime | registers all `<dui-*>` elements + injects tokens (it's the CDN bundle) |
| `styles.css` | every rendered design | the token surface — designs receive only its transitive `@import` closure |
| `tokens/tokens.css` | via `styles.css` | the CSS-custom-property tokens |
| `fonts/` | via `styles.css` | brand webfonts (`@font-face`) |
| `thumbnail.html` | humans | the project's homepage tile |
| `_ds_needs_recompile` | the app's self-check | sentinel — fences the manifest/index rebuild; re-write it last on every upload |
| `_ds_manifest.json` | the app | **app-generated** (not us) from `@dsCard` markers + component dirs |

Load-bearing details we learned the hard way:

- **`@dsCard` marker** — the *first line* of each card HTML: `<!-- @dsCard group="…" viewport="WxH" -->`. Only `group` and `viewport` are real attributes. The app builds its card index from these.
- **`_ds_bundle.js` header** — first line `/* @ds-bundle: {…json…} */` with `namespace`, `components[]`, etc. (key is `namespace`, not `globalName`).
- **`styles.css` `@import` closure is the contract** — designs receive *only* what `styles.css` transitively `@import`s (fonts + tokens). Component styling lives in shadow DOM and is injected by `_ds_bundle.js` at runtime, so there's no `_ds_bundle.css` to wire.
- **The token compiler is picky.** It classifies tokens by name/value and only registers colors declared under a real scope. Two transforms make DUI's `tokens.css` legible (both automated in `gen.ts`'s `transformTokens`):
  1. Light primitives declared under `:root:not([data-theme="dark"])` don't register — rewrite to plain `:root` (dark under `:root[data-theme="dark"]` still wins by specificity).
  2. Tokens with time/easing/unitless/em values can't be auto-classified — annotate with `/* @kind spacing|font|other */`.
- **The card pane scales each card's declared `viewport` W×H to fill its display area.** So a *consistent width across all cards* = consistent content scale, and *height = measured content height* = fit-to-content (no dead space, no side gaps). We use `CARD_W` (800) + measured heights baked into `card-heights.json`.
- **The app edits the DS in place.** Its compiler may rewrite `tokens.css` (the two transforms above), add a `thumbnail.html`, and add a PascalCase component index to the README on its own. We *reproduce those edits in the generator* so our re-syncs don't clobber them.

### DESIGN.md is not what you think

In this ecosystem **`DESIGN.md` means the theming/color input** (the 4 OKLCH primitives in an `applyTheme()`-shaped block) that the importer/theming pipeline reads to recolor a system. It is **not** the vehicle for subjective/taste guidance. We upload directly via the DesignSync tool, so we don't rely on it.

---

## 3. Architecture & key decisions

**It's a tailored fork, not the stock converter.** The bundled `/design-sync` skill assumes a **React** library installed via **npm** and bundled from `dist/`. DUI is **Deno + Lit web components** — outside that envelope. So we reuse the framework-neutral bits (`lib/sync-hashes.mjs`, the `@ds-bundle` header format, the upload sequence) and **replace** the React prop-extraction / `.jsx` emission with a data-driven DUI generator.

**Data-driven generation.** `gen.ts` reads three committed inputs and emits the whole layout deterministically:
1. `packages/docs/src/component-registry.ts` — the declarative API contract (props, events, slots, theme attrs) for all 111 registry entries. This is DUI's own source of truth; the React converter reverse-engineers this from `.d.ts`, we have it declaratively.
2. `dist/dui-cdn/dui.min.js` — the published self-registering bundle → `_ds_bundle.js`.
3. `packages/components/src/tokens/tokens.css` → transformed `tokens/tokens.css`.

Plus curated per-component demo cards (`components.ts`) and measured card heights (`card-heights.json`).

**Scope: the 47 styled top-level components.** The 61 registry top-level entries, minus `@dui/map`/`@dui/chart` (separate packages, not in the CDN bundle) and `dui-portal` (no-visual utility).

**Steering strategy — the toolkit/taste split.** DUI is a *flexible toolkit* that should render both a dense enterprise dashboard and a spacious marketing site. So the design-system README carries only **taste-neutral** guidance:
- component-first discipline ("reach for the real component"), with the boundary that a plain styled `<div>` is right for a simple tile (`dui-card` is for structured blocks),
- the **4px base grid** and how to *express* density (dense vs. spacious *levers*, not a mandate),
- overlay selection, page-shell archetypes, icon sourcing.

The actual **taste decision** (dense/spacious/voice) is a *project* property — it belongs in the consuming project's own steering (its `CLAUDE.md`) + `applyTheme()` overrides, never baked into the shared DS.

**Icons.** DUI's `<dui-icon>` renders a slotted SVG. We steer the agent to **Lucide** (matching 24×24 stroke style, ISC-licensed): inline common icons from memory, and fetch less-common ones from the stable per-icon URL `https://unpkg.com/lucide-static/icons/<name>.svg`. Verified the agent recalls common icons correctly and can fetch — so we do **not** vendor the ~1,600-icon set. (`--font-symbol`/Material Symbols is deliberately excluded: ~3.9 MB and not in the token closure.)

**Fonts.** Only **JetBrains Mono** ships — the one brand font the token closure references (`--font-mono`). `--font-sans` is `system-ui` (no Inter), `--font-serif` is a system serif (Cambria — no free webface; its "missing font" warning is expected and benign).

**Cards are Lit-native HTML**, not React. They load `_ds_bundle.js` and use real tags. Layout is eyebrow (`<dui-tag>`) → description → live demo; no redundant title.

---

## 4. Reproducibility

A from-scratch run is **byte-identical and offline** because every input is committed:
- `dist/dui-cdn/dui.min.js` — un-ignored in `.gitignore`; the **publish-to-npm** skill re-commits it every release, so it tracks the published components.
- `fonts/` — committed woff2 + `fonts.css` (refresh via `fetch-fonts.ts`).
- `card-heights.json` — measured heights (re-measure only when demos change).
- `config.json` — pins the target Claude Design `projectId`, so a re-sync **updates the same project** instead of creating a new one.

Normal run: `deno run --allow-read --allow-write .agents/skills/dui-claude-design-system/gen.ts` — no network, no build. The **upload** is the only agent-driven step (create/target project → `finalize_plan` → chunked `write_files` → sentinel); it's documented in `SKILL.md`.

---

## 5. File map

| File | Role |
|---|---|
| `gen.ts` | The generator. Reads registry + bundle + tokens + fonts + heights; emits `.design-sync/ds-bundle/`. Owns the README/steering text, token transforms, thumbnail, card template. |
| `components.ts` | Curated per-component config: group, keywords, hand-authored demo card, example. Add components here + re-run. |
| `card-heights.json` | Per-component measured content height at `CARD_W` (fit-to-content). |
| `config.json` | Target Claude Design `projectId` pin. |
| `fetch-fonts.ts` | Refreshes the committed `fonts/` from Google Fonts (JetBrains Mono). |
| `fonts/` | Committed brand webfonts. |
| `lib/sync-hashes.mjs` | Forked anchor helpers from the stock `/design-sync` (for a future `_ds_sync.json`). |
| `SKILL.md` | Operational how-to-run + the upload sequence. |

---

## 6. Claude Design projects

- **`DUI Design System v2`** — `9d8ba712-dcf5-4337-a755-bb26f289a6d9` — the production DS (all 47 components, live). Pinned in `config.json`.
- `DUI Design System` — `019dcf73-717e-784e-8ca8-a30c2ca5d5ff` — the OLD static token-only import; consumed by the **ETO** design project. Retire once ETO is re-pointed at v2.
- `DUI Live Components (POC)` — `b920e6b6-…` — throwaway POC (raw-tag vs. adapter test). Deletable.

---

## 7. Open threads

- **Cutover**: re-point ETO at v2, then archive the old static DS + POC.
- **`@dui/map` + `@dui/chart`**: separate packages, not in the CDN bundle — would need their own bundle build to add.
- **`_ds_sync.json` anchor**: not yet emitted; `lib/sync-hashes.mjs` is staged for it (enables skip-unchanged re-syncs).
- **Icons at scale**: if the agent needs uncommon icons reliably and can't fetch in some runtime, revisit vendoring a Lucide subset.
