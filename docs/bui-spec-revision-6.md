# BUI spec — Revision 6 edit list

**What this is:** the complete set of edits that turn the BUI specification
(Revision 5) into Revision 6, folding in everything Phase 0 measured. Every edit
cites its evidence in `packages/spike-light/FINDINGS.md` (with raw output under
`packages/spike-light/evidence/`).

**Why an edit list and not the revised document:** the spec source lives outside
this repository and was not available when these results landed. Each edit below
either quotes the Revision 5 text it replaces exactly, or — where the original
wording isn't reproduced here — states the required change as a directive
against a named section. Apply mechanically; re-attaching the spec source to a
working session produces the merged Revision 6 from this list.

---

## 1. Header and status

In the **Status** line, replace:

> **Status:** Revision 5. All design decisions (D1–D8) are recorded in
> [Decisions](#decisions). One verification task remains before Phase 1: the
> editor tooling check described in D7.

with:

> **Status:** Revision 6. All design decisions (D1–D8) are recorded in
> [Decisions](#decisions). Phase 0 is complete: all seven gating probes passed,
> the D7 editor tooling check ran (failed as originally specified; a verified
> mitigation revises D7 — see the decision row), and the exit checklist is
> satisfied. Results: `packages/spike-light/FINDINGS.md` in the `dui`
> repository, branch `claude/implement-attached-plan-is0bxg`.

Add to the revision changelog (or create one):

> Revision 6 — Phase 0 results folded in: D4 revised to the enhancer shape;
> compound-controller conventions extended (element-keyed registration, lazy
> option getters, aux-part fan-out); `alignInner` accepts a virtual element;
> layer order becomes a documented install step; D7 revised with a verified
> completion source; Phase 1 gains three call-site ergonomics requirements and a
> Firefox verification item.

## 2. Decision D4 (button / label projection)

Revise D4 to state (evidence: FINDINGS P1, D4 finding):

> Inner-button label projection is impossible in light DOM — there is no slot to
> project consumer children into rendered chrome. `bui-button` is an
> **enhancer**: the consumer authors the native button and BUI styles and
> augments it in place:
>
> ```html
> <bui-button><button>Save</button></bui-button>
> ```
>
> Open Phase 1 question, recorded in FINDINGS: whether `bui-button` ships as a
> component at all, versus a documented class recipe — the enhancer shape reads
> as duplication at every call site.

Any D4 example showing a `bui-button` that renders its own `<button>` from a
label is superseded by the enhancer form.

## 3. Controller and compound conventions

In the controller/compound conventions section, add four conventions (evidence:
FINDINGS P4, P3, P7):

- **Registration keys on elements.** `CompoundController.register()` and every
  bag lookup match parts by `part.element`, never by part-host object identity:
  parts construct a fresh host object per update, so identity matching silently
  never matches (P4's symptom: `data-selected` never landed).
- **Option getters resolve lazily.** A controller must never invoke an option
  getter at attach time. Class-field initializer order means the host element's
  own fields are not initialized when the controller attaches; eager reads
  capture defaults (P4's symptom: tooltip gap 4px instead of 6px).
- **Parts that render nothing still receive fan-out.** `registerAux()` /
  `notifyParts()` are part of the compound contract, not an optimization:
  container parts apply state as attributes on themselves and go stale without
  an update push (P3's symptom: field label kept `data-disabled` stale).
- **`alignInner` accepts a Floating UI `VirtualElement`.** Text-rect alignment
  (a `Range`-backed `getBoundingClientRect`) is a first-class input to
  `@bui/core`'s inner-alignment, not a cast (P4: option-box alignment lands
  ~30px off; the option's text node is the correct target and has no element to
  point at).

## 4. CSS conventions — layer order is an install step

Add to the CSS conventions / installation documentation (evidence: FINDINGS P8):

> **Layer order cannot be guaranteed from an adopted stylesheet.** Adopted
> stylesheets sort after document stylesheets, so any layered CSS the consumer
> loads first (Tailwind's `@layer theme, base, components,
> utilities;`
> included) establishes its layers ahead of `bui.*`, and `bui.components` then
> beats `@layer utilities` — a utility class on an element BUI styles silently
> loses. The install documentation must require, for any app with layered CSS of
> its own:
>
> ```css
> /* first line of the app's CSS entry, above any framework import */
> @layer bui.reset, bui.components;
> ```
>
> Verified: with this line first, utilities win over `bui.components`; without
> it, they lose.

Also record the token-name observation from P8: Tailwind v4's theme variables
share names with the token set (`--text-sm`, `--radius-md`,
`--font-weight-medium`, …). BUI's unlayered token sheet wins those collisions,
so Tailwind utilities resolve to the design system's values (`.rounded-md`
renders the token's 0.5rem, not Tailwind's 0.375rem). This is coherent,
deliberate, and must be documented where Tailwind users will see it.

## 5. Decision D7 (CSS authoring and tooling)

Replace the D7 row's verification clause. Revision 5 ended with:

> **Verification owed before Phase 1:** confirm that `lit-plugin` completes
> `--space-*` and `--text-*` names from `tokens.css` inside a `css` block. If it
> doesn't, revisit this decision, because the token vocabulary is large and is
> exactly what needs completion.

Replace with:

> **Verified.** `lit-plugin` does not and cannot complete token names from
> `tokens.css` — it completes only custom properties defined in the same `css`
> template, and exposes no configuration surface for external custom-property
> data (evidence: `evidence/d7-tooling-check.txt`). The single-file decision
> stands with a revised tooling row: token completion comes from
> `css-variables-language-server` (the LSP behind the "CSS Var Complete" VS Code
> extension), verified to complete all token names from `tokens.css` inside a
> `css` template in a `.ts` file (evidence: `evidence/d7/drive-lsp.mjs`). It
> runs alongside `lit-plugin` (which keeps property-name completion,
> highlighting, and diagnostics), and, as a standard LSP server, wires into any
> LSP-capable editor. Known caveat: its completion is context-blind — offered
> anywhere in the file, not only inside `css` blocks.

## 6. Phase 0 — exit checklist

Mark all four exit-checklist items complete, pointing at
`packages/spike-light/FINDINGS.md`. Note in the section that the probes ran on
the session's designated branch (`claude/implement-attached-plan-is0bxg`) rather
than the spec's `spike/light-compound` name.

## 7. Phase 1 — new requirements from the scratch-app exercise

Add to Phase 1's deliverables (evidence: FINDINGS, scratch-app section):

1. **Declarative trigger association.** Overlay components accept the native
   invoker attributes (`commandfor` / `command`) — routed through the controller
   so focus management and open-state sync still run — or an equivalent
   declarative attribute. Three imperative call sites to open a dialog is the
   measured status quo to eliminate.
2. **Typed tags.** Every family file augments `HTMLElementTagNameMap` (and
   exports its element classes) so `querySelector` / `getElementById` return
   typed elements without structural casts.
3. **Typed events.** Events go through the `customEvent()` factory pattern with
   a `GlobalEventHandlersEventMap` augmentation so
   `addEventListener("value-change", …)` infers the detail type.

## 8. Cross-browser verification status

Add wherever the spec records verification state:

> **WebKit: verified.** WebKitGTK 2.52 passes every load-bearing Phase 0
> assertion (features, P1 boundary + behavior, P4 positioning including tooltips
> under real hover, P7 geometry) — see FINDINGS "Cross-browser verification" and
> `evidence/webkit-smoke-output.txt`; runner committed at
> `packages/spike-light/runners/webkit-smoke.mjs`.
>
> **Firefox: owed.** No delivery route exists in the remote environment (all
> browser CDNs and archives blocked). Run the same assertions locally before
> Phase 1 is declared browser-complete; until then Gecko support is asserted
> from feature data, not measured.

## 9. Small corrections

- Appendix B (experimental basis) may now also cite Phase 0 itself as a third
  measured source alongside Experiments 1 and 2.
- The P3 open question (`:user-invalid` never engages in the harness) and the
  unmeasured `data-bui` first-frame gap carry into Phase 1's verification list
  unchanged.
