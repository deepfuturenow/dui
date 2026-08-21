# Phase 0 findings

**TL;DR:** All seven gating probes pass. The optional P8 passes with one
layer-order footgun that needs an install-step fix. The D7 editor tooling check
**fails** — `lit-plugin` cannot complete token names from `tokens.css` — so
decision D7 needs to be revisited before Phase 1, as D7 itself requires. Nothing
found in Phase 0 requires revising the architecture; two conventions (D4 button
shape, registration keyed on elements) and one install-step requirement (layer
order) should be folded into the spec.

| Probe                   | Result                                                                                       | Evidence                        |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------- |
| P1 style boundary       | Pass — 0 differing pixels vs `dui-dialog`; zero BUI→consumer leaks                           | `evidence/p1-run-output.txt`    |
| P2 framework parent     | Pass — Lit, vanilla, and React 18 all clean                                                  | `evidence/p2-run-output.txt`    |
| P3 form + field         | Pass — `FormData` byte-equal; BUI's accessible names resolve where DUI's are empty           | `evidence/p3-run-output.txt`    |
| P4 floating + top layer | Pass — 12/12 placements match within 1 px                                                    | `evidence/p4-run-output.txt`    |
| P5 branded bags         | Pass — wrong bag is a compile error; omitted bag warns; moved handler documented as residual | `experiments/`                  |
| P6 core fixes           | Pass — zero name lookups; select still positions                                             | `evidence/p4-run-output.txt`    |
| P7 CompoundController   | Pass — 0 differing pixels; controller 329 → 259 lines, no `lit` import                       | `evidence/p7-run-output.txt`    |
| P8 utilities (optional) | Pass, with a layer-order footgun                                                             | `evidence/p8-run-output.txt`    |
| D7 tooling check        | **Fail** — no token completion from `tokens.css`                                             | `evidence/d7-tooling-check.txt` |

All probes ran against the docs dev server pages `bui-p1.html`, `bui-p2.html`,
`bui-p3.html`, `bui-p4.html`, and `bui-p7.html`, driven by Playwright/CDP. Raw
runner output and screenshots are in `evidence/`.

---

## P1: Style boundary on a content-wrapping component

**Pass criterion:** Under preflight only, zero unexpected differences on the
chrome. Under the full hostile set, every chrome difference is attributable to
an unlayered page rule, and every consumer-content difference is attributable to
the page stylesheet. Any BUI rule that reaches consumer content is a failure.

**Result: pass.**

- **Pixel parity:** the BUI dialog and `dui-dialog` render identically — same
  sub-pixel geometry (384 × 143.875 at the same origin) and **0 differing pixels
  of 219,648**.
- **BUI → consumer direction:** zero. Across every condition, no BUI rule
  reached the headings, form, inputs, table, or `<pre>` placed in the body. The
  `@scope (bui-dialog-body) to (bui-dialog-body > *)` boundary plus tag-prefixed
  selectors held.
- **Page → BUI direction, layered preflight (Tailwind v4's real integration):**
  chrome is pixel-unchanged. The computed-style diffs that do appear are
  properties BUI never declares (container `line-height`, 0-width
  `border-style`) and are visually inert. One rendered change exists — the
  consumer's own `<p>` grows 38 → 48 px from preflight's
  `html { line-height: 1.5 }` — and that is consumer content styled by the page
  stylesheet, the intended behavior. DUI's slotted light-DOM children receive
  page styles the same way.
- **Page → BUI direction, raw unlayered preflight:** the degenerate copy-paste
  case does strip chrome (`h2` font-weight 600 → 400). Unlayered page rules beat
  `@layer bui.components` by design; the conditions matrix records both so the
  docs can say "put your reset in a layer, as Tailwind already does."
- **Hostile set:** every chrome hit (`h2 { color: red; margin: 3rem }`,
  `.body { background: purple }`) traces to an unlayered page rule. That is the
  contract working, not failing: the page owns final say.
- **Behavior:** focus trap cycles through consumer content including a nested
  `bui-button`, Escape closes, backdrop click closes.

**Judgment call:** the parity screenshot uses a content-identical twin
(`#bui-parity`) because the rich hostile instance deliberately contains extra
consumer content and cannot be pixel-compared against DUI.

## P2: Compound elements under a framework parent

**Pass criterion:** No Lit or React errors. Conditional child, reorder, and
mid-family insertion land where the framework put them. Input keeps focus and
video doesn't restart across 50 parent re-renders. The focus trap still finds
the correct focusables after reorder.

**Result: pass** — in Lit, plain `innerHTML`, and a React 18 wrapper (the "if
cheap" case was cheap).

- 50 timed parent re-renders: focus kept, `videoRestarts: 0` (`videoTime` still
  advancing), `repeat()` reorder landed exactly, conditional child present, zero
  console errors in all three hosts.
- Mid-family insertion between header and body stayed exactly where the
  framework put it: `[header, mid-insert, body, footer, close]`.
- Focus trap tracked the reordered focusables (tab cycle in evidence).

**Structural answer the probe was designed to produce:** a rendering part must
render into its **own** element only, and a wrapping part must be a pure
container that applies its bag with `applyProps()` and renders no markup. Two
`lit-html` renders never target one container, so the parent's markers and the
part's markers never interleave. This is now the convention every BUI component
in this spike follows.

## P3: Form participation and field

**Pass criterion:** `FormData` matches DUI's byte for byte. Accessible name and
description resolve. Field state propagation (disabled, invalid, touched)
matches DUI's.

**Result: pass**, with one accessibility headline and one open question.

- `FormData` byte-equal with DUI, both as loaded and after toggling controls:
  `[["project","alpha"],["sync","yes"]]`.
- Label click activates the control; `:invalid` on the host and form submission
  blocking both work; field `disabled` propagates to parts and control
  (including the restore-on-enable bookkeeping DUI does).
- **Headline:** the CDP accessibility tree shows DUI's field-wrapped controls
  have **empty accessible names** — `aria-labelledby` set on a shadow host
  cannot reference across the shadow boundary to the real `<input>` inside, so
  `name=""` for DUI's textbox, checkbox, and switch. BUI's all resolve
  (`"Project name"` + description, `"Enable sync"`, `"Beta features"`). Light
  DOM didn't just match DUI here; it fixed a structural accessibility bug DUI
  cannot fix without cross-root ARIA.
- **Open question, not claimed:** `:user-invalid` never engaged on host or inner
  input in the harness, even after real typed edits and blur. Recorded for Phase
  1 rather than asserted.

**Convention lesson:** parts that render nothing still need update fan-out. The
field's label part went stale until `CompoundController` grew
`registerAux()`/`notifyParts()` — which P7 then validated as the general
mechanism.

## P4: Floating positioning and top layer

**Pass criterion:** Positions match within 1 px in every placement, or the
failure is one DUI also has.

**Result: pass — 12/12 comparisons MATCH**, most exactly.

- Contexts: plain, `transform`, `overflow: hidden`, `position: fixed` toolbar,
  `contain: layout`, and inside the P1 dialog. Select and tooltip in each. Flip
  cases match to the fraction of a pixel (`rel(-22,-393.75)` both), the dialog
  context matches (`tw=376 rel(0,36)` both), tooltip gaps are 6 px on both.
- Align-inner (macOS-style select) matches only after aligning the option's
  **text** via a `Range`-backed virtual element — the option box includes the
  check-indicator gutter, which put BUI 30 px off until the text rect was used.
  `@bui/core`'s `alignInner` should accept a Floating UI `VirtualElement`; the
  current cast is recorded as debt.
- Scroll-into-view on open for long lists was ported and verified under a 300 px
  viewport (selected option visible, popup on-screen, scrollTop 229 vs DUI's 212
  — different scroller anatomy, same outcome).
- **Eager-capture hazard (convention material):** an option getter read at
  attach time sees the host before its constructor body has run. The tooltip's
  `getSideOffset()` was captured eagerly and produced a 4 px gap against
  DUI's 6. Controllers must resolve option getters lazily at use time, never at
  attach time.

## P5: Branded bags and the development-mode check

**Pass criterion:** Wrong-position spread is a readable compile error; omitted
bag warns naming the bag and host; the moved-handler case is documented as
residual risk with a recommended test pattern.

**Result: pass.**

- `spread<SelectTriggerBag>(c.popupProps)` fails to compile with a TS2345 at the
  spread site naming both brands.
- Omitting a bag produces a dev-mode warning naming the bag and the host
  (`bui-select`), driven from the bag's dev mark — no DOM queries.
- Moving a keydown handler between bags compiles clean, as expected. **Residual
  risk and mitigation:** bags carry handlers as plain `@keydown` values, so the
  type system cannot see which element they land on. Recommended library-side
  pattern: controller unit tests that attach fake refs and assert the
  interaction contract (e.g. "keydown ArrowDown on the trigger element opens") —
  these fail if a handler migrates to the wrong bag.

## P6: Core fixes

**Pass criterion:** Zero `querySelector(` / `classList.contains(` /
`tagName ===` hits in `@bui/core` outside tests, and Experiment 2's select still
positions correctly.

**Result: pass.**

- `resolveScrollContainer()` is deleted from the copied core;
  `AlignInnerOptions.getScrollContainer` is **required**, and
  `FloatingTopLayerController` threads it through. The grep set returns zero
  hits in `vendor-core/`.
- `FloatingTopLayerController` also shed its Lit dependency in the same pass
  (`MinimalHost = { requestUpdate() }` + `dispose()`), which is what lets
  controllers import it without dragging `lit` types in.
- Runtime proof rides on P4: the select positions, flips, aligns inner, and
  centers its selection in a capped popup purely through the injected getter.
- **Upstreamable to DUI** (spec requirement): the injectable
  `getScrollContainer` and the `VirtualElement` acceptance above are both
  applicable to `@dui/core/floating-popup-utils` as-is.

## P7: Compound registration helpers

**Pass criterion:** Tabs pixel parity unchanged. The controller shrinks by the
protocols it no longer implements and has no `lit` import. The indicator moves
on selection without manual `requestUpdate()` in tabs code. `@lit/context`
absent from the probe package.

**Result: pass.**

- **0 differing pixels of 131,040** vs `dui-tabs`, both before and after
  selecting another tab; all part geometry within 1 px in both orientations.
- Controller: 329 lines (Experiment 2) → 259, with registration, document-order
  sorting, and update fan-out gone — absorbed by the 74-line
  `CompoundController` shared with select and field. Zero `lit` imports;
  `@lit/context` appears nowhere in the package.
- The only `requestUpdate` occurrences in the tabs component file are the
  `PartHost` adapter closures (`requestUpdate: () =>
    this.requestUpdate()`)
  — plumbing that hands each part's own re-render to the controller, not manual
  fan-out.
- Roving focus (W3C APG) came along: arrows skip the disabled tab and wrap,
  Home/End hit edges, orientation flips the axis. The DUI primitive still cannot
  move focus off the active tab at all.
- The family is the degenerate compound case — no part renders any markup; it is
  pure `applyProps()` + CSS.

## P8 (optional): Utility classes

**Pass criterion (non-gating):** record whether Tailwind v4 works on the P1 page
and whether anything in the CSS conventions conflicts with it.

**Result: works, with one collision and one footgun.**

- Utilities on consumer markup work: the dialog trigger restyled entirely with
  utility classes in the markup, and adding the Tailwind sheet changed **zero**
  computed styles and zero pixels on the open BUI dialog. The sheet is generated
  statically (`tailwindcss@4.3.3 compile()`, utilities inside `@layer utilities`
  as real Tailwind emits them) — Tailwind stays a consumer build-step concern,
  not a BUI dependency.
- **Token-name collision, resolved in BUI's favor:** Tailwind's `@layer theme`
  defines `--text-sm`, `--radius-md`, `--font-weight-medium` — the same names as
  DUI's (Tailwind-derived) tokens. BUI's token sheet is unlayered, so it wins:
  `.rounded-md` renders 8 px (BUI's 0.5rem), not Tailwind's 6 px. Utilities
  silently inherit the design system's scale — coherent, but it deviates from
  Tailwind's documented values.
- **Layer-order footgun:** adopted stylesheets sort after document sheets, so
  Tailwind's `@layer theme, base, components, utilities;` establishes its layers
  before `bui.*`, making `bui.components` beat `@layer utilities`. A utility on
  an element `bui.components` styles (`text-sm` on the dialog title) silently
  loses. **Verified mitigation:** the consumer declares
  `@layer bui.reset,
    bui.components;` first — one line at the top of their
  CSS entry, above the Tailwind import — and utilities win again. Phase 1 must
  make this an explicit install step; an adopted sheet cannot guarantee layer
  order by itself in a Tailwind app.

## D7 editor tooling check

**Required by the exit checklist:** confirm that `lit-plugin` completes
`--space-*` and `--text-*` names from `tokens.css` inside a `css` block. D7 says
to revisit the single-file decision if it doesn't, because the token vocabulary
is large and is exactly what needs completion.

**Result: fail.** Driven through a real tsserver (typescript 5.9.3 +
ts-lit-plugin 2.0.2) with `completionInfo` requests inside a `css` template:

- The plugin itself works — 757 standard CSS property-name completions and CSS
  diagnostics inside the block.
- Inside `var()` it completes **only custom properties defined in the same
  template literal** (`--locally-defined` completes; `--space-*` / `--text-*`
  from a sibling `tokens.css` never appear). `lit-analyzer` instantiates the VS
  Code CSS service per template with no cross-file custom-property data, and
  `ts-lit-plugin` exposes no `customData` configuration surface.
- **Untested mitigations for the Phase 1 decision:** workspace CSS-variable
  indexer extensions (they scan configured files such as `tokens.css` and
  complete inside `.ts`), or a build-time editor artifact (VS Code custom-data /
  snippets) generated from `tokens.css`. Neither preserves D7's "works in any TS
  editor via the TS plugin" property; that is the trade to revisit.

Harness preserved under `evidence/d7/`.

---

## Scratch-app consumption: three call-site ergonomics changes

Per the exit checklist, the P1 dialog and P4 select were consumed from a scratch
application (`scratch-app/app.ts` + `bui-scratch.html`, served at
`/bui-scratch.html`): a settings card with an environment select and a
delete-confirmation dialog, consumer-styled with tokens, including one unlayered
consumer override of the trigger background (verified to win). Every flow works:
select → status update, trigger display, dialog open,
light-dismiss/cancel/confirm, focus return. Screenshots in `evidence/`.

The three changes to make in Phase 1, in priority order:

1. **Declarative trigger association.** Opening the dialog is `getElementById` +
   `addEventListener` + `.show()`, three call sites for one intent, and the
   footer buttons repeat it for `.close()`. Because the dialog root _is_ a
   `[popover]` element, the native invoker attributes
   (`commandfor`/`command="show-popover"`) are the obvious shape — but they must
   route through the controller so the focus trap and open-state sync still run.
   Phase 1 should support `commandfor` (or a `data-bui-close`-style attribute on
   any button in the family) and document it as the default wiring.
2. **Type the tags.** Nothing augments `HTMLElementTagNameMap` or exports the
   element interfaces prominently, so every lookup needs a structural cast
   (`as HTMLElement & { show(): void }`). Each family file should ship
   `declare global { interface HTMLElementTagNameMap
    { "bui-dialog": BuiDialog; … } }`
   so `querySelector`/`getElementById` return typed elements for free.
3. **Typed events.** `value-change` and `open-change` are anonymous
   `CustomEvent`s; the consumer casts to `CustomEvent<{ value: string }>` by
   convention. DUI already solved this with the `customEvent()` factory in
   `@dui/core/event`; BUI should keep that pattern and add a
   `GlobalEventHandlersEventMap` augmentation so
   `addEventListener("value-change", …)` infers the detail type.

Honorable mention, not top-three: the `<bui-button><button>…` enhancer shape
(the D4 revision from P1) reads as duplication at every call site. It is the
price of light-DOM label ownership; Phase 1 should document the rationale where
consumers will see it, and consider whether `bui-button` is worth shipping at
all versus a documented class recipe.

## Spec-convention deltas Phase 0 produced

Findings that should be folded back into the spec rather than left here:

- **D4 revision (from P1):** inner-button label projection is impossible in
  light DOM — there is no slot to project through. The button family uses the
  enhancer shape (`<bui-button><button>Save</button></bui-button>`); the spec's
  D4 example needs updating.
- **Registration should key on elements (from P4):** `register()` matches parts
  by `PartHost` identity, but parts construct a fresh host object per update;
  `optionProps`/`tabProps` had to match on `.part.element === part.element`.
  Silent symptom: `data-selected` never landed. `CompoundController.register()`
  should key on the element.
- **Option getters resolve lazily (from P4):** never read a controller-option
  getter at attach time; field-initializer order means the host is not
  constructed yet.
- **Parts that render nothing still need fan-out (from P3):**
  `registerAux()`/`notifyParts()` are part of the compound contract, not an
  optimization.
- **`alignInner` should accept a `VirtualElement` (from P4):** the Range-backed
  text-rect alignment currently rides on a cast.
- **Layer order is an install step (from P8):** consumers with any layered CSS
  of their own (Tailwind included) must declare
  `@layer bui.reset, bui.components;` at the top of their CSS entry.

## Open questions carried into Phase 1

- `:user-invalid` on form-associated hosts never engaged in the P3 harness;
  determine whether this is a platform gap or a harness gap.
- The `data-bui` stamp lands in `createRenderRoot`; whether a first-frame
  unstyled flash is observable was not measured.
- D7 replacement tooling (see above) — pick and verify one mitigation.

## Exit checklist state

- [x] P1 through P7 have recorded results in this file.
- [x] P1 and P2 passed (no architecture revision needed).
- [x] The D7 editor tooling check has been run and its result recorded — **it
      failed**; D7 must be revisited before the CSS-authoring decision is
      treated as settled. This blocks nothing else in the checklist but is a
      real Phase 1 input.
- [x] The P1 dialog and P4 select were consumed from a scratch application and
      the three call-site ergonomics changes are recorded above.

**Branch note:** the spec names the probe branch `spike/light-compound`. This
work lives on `claude/implement-attached-plan-is0bxg`, the branch designated for
this session; all Phase 0 commits are on it.
