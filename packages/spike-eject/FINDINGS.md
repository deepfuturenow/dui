# Spike: shadcn-style "eject" for DUI, via primitives (`select`)

Throwaway experiment. Branch: `claude/implement-attached-plan-is0bxg`.
Everything below was measured in a browser, not reasoned about.

**Verdict up front:** the eject works and is genuinely pleasant for *aesthetic*
changes — but only because DUI's styled layer is already a shadcn-shaped file,
so "ejecting" is a copy with no new capability. The moment a change touches the
render tree, the model fails hard: every field the primitive's template binds is
a native `#private`, so `render()` cannot be overridden at all. See §7.

---

## 1. Current-state summary

| | |
|---|---|
| Primitive | `dui-primitives/packages/primitives/src/select/select.ts`, 545 lines. **Separate repo**, not `packages/primitives/` as the brief assumed — reached through the root import map's `../dui-primitives/...` entries. |
| Styled layer | `packages/components/src/select/select.ts`, 196 lines: 184 lines of CSS + `class DuiSelect extends DuiSelectPrimitive { static styles = [...DuiSelectPrimitive.styles, styles] }` + `customElements.define()`. That is the entire file. |
| Composition | **Monolithic.** There is no `dui-select-trigger` / `-item` / `-popup`. One class renders trigger, popup, listbox and every option into **one shadow root**, from a single `render()` with a `repeat()` over `options`. So there were no sub-components to eject. |
| Real dependencies | The primitive's template hardcodes `<dui-icon>` (chevron + check) and `<dui-scroll-area>` (popup scroller) **by tag name**. Not slots, not injectable. Those are the "sub-components" in practice. |
| Parts exposed | `trigger, value, popup, listbox, item, item-selected, item-highlighted, item-disabled, item-indicator, item-text` — 10. The docs registry documents **2** (`trigger`, `value`). |
| `size` | **Not a property.** Not on the primitive, not on `DuiSelect`. `size="xs\|sm\|md\|lg"` is a bare HTML attribute matched only by `:host([size="…"])` CSS in the styled layer. |
| Registration | `static tagName = "dui-select"` lives on the **primitive**, so a subclass inherits the library's tag name for free. Registration is a bare module-level `customElements.define()`. |
| `defineComponents` / `static dependencies` | **Do not exist** in this codebase. The brief assumed them. |
| `floating-portal-controller.ts` | **Does not exist.** It is `FloatingTopLayerController`, and the popup renders in the component's *own* shadow root via native `[popover]`. No cross-root style lookup by tag name, so that entire risk class is absent. |
| `applyTheme()` | Document-level adopted stylesheet of CSS custom properties. Completely class-agnostic — works identically for ejected classes. |
| Docs | `packages/docs/src/index.ts` side-effect-imports `./pages/docs-page-select.ts`. Dev server is esbuild in `packages/docs/serve.ts`. |

**Case A applies.** A `DuiSelectPrimitive` exists, so the spike proceeded.

---

## 2. Inventory of the ejected layer

```
packages/spike-eject/
├── deno.json                              14
├── src/
│   ├── spike-eject.ts                    120   demo app + the Step 3 collision probe
│   ├── external-compact.css               56   the *library* comparison path (§8)
│   └── components/dui/
│       ├── select.ts                     283   ← the ejected component
│       ├── icon.ts                        12
│       ├── scroll-area.ts                 49
│       └── _install.ts                    17   token injection
├── experiments/
│   └── attempted-render-override.ts       67   does not compile, on purpose (§3)
└── vendor/                                34   sandbox workaround, not part of the spike (§6)
```

Plus `packages/docs/static/spike-eject.html` (83 lines) for the demo page.

**Breakdown of `select.ts`, the only file that matters:**

| | lines |
|---|---:|
| (a) aesthetic CSS copied from `@dui/components` | **187** (184 library source lines, reflowed to 187 by `deno fmt`) |
| (b) variant/size selectors added by the consumer | **67** — 27 for `size="compact"`, 40 for `leading-chevron` |
| (c) render overrides duplicated from the primitive | **0** — not by choice; it is impossible (§3) |
| (d) registration / glue | **7** (`export class` … `customElements.define`) |
| header comment + imports | 20 |
| **total** | **283** |

Total ejected: **361 lines** across the four `components/dui/` files, of which
**236 are a straight copy** of `@dui/components` and **67** are the consumer's
own work. The remaining `icon.ts` / `scroll-area.ts` / `_install.ts` are pure
copy — 78 lines the consumer now owns, will never edit, and must maintain.

**Fidelity check:** the ejected select was screenshotted against the library
select under identical markup (same page, `?impl=library` switch) and pixel-
diffed: **0 differing pixels** across the whole component region. Keyboard
behaviour (ArrowDown → Enter → value change → popup close) verified in the
browser. Screenshots `01-*`, `02-*`, `03-*` in `evidence/`.

---

## 3. Ergonomics, as a consumer

### Change 1 — `size="compact"`, denser than the library's smallest

**27 lines, 4 hunks, 100% in the subclass, no primitive knowledge beyond three
class names.**

```css
:host([size="compact"]) {
  --select-item-font-size: var(--text-2xs);
  --select-item-padding-y: var(--space-0_5);
  --select-item-icon-size: var(--space-2_5);
}
:host([size="compact"]) .Trigger {
  height: var(--component-height-xxs);
  gap: var(--space-1);
  padding: var(--space-0_5) var(--space-0_5) var(--space-0_5) var(--space-1_5);
  border-radius: calc(var(--radius-md) * 0.6);
  font-size: var(--text-2xs);
  line-height: var(--text-2xs--line-height);
}
:host([size="compact"]) .Icon    { --icon-size: var(--space-2_5); }
:host([size="compact"]) .Listbox { padding: var(--space-0_5); }
```

**Assessment: this genuinely feels like editing `select.tsx`.** No ceremony, no
base class in the way, no new library knob. Open the file, add a selector, done.

But be honest about *why* it was this easy: `size` was never a declared
property, only a CSS attribute selector, so adding a value required no schema
change anywhere. The same edit against a component whose variants are a typed
`@property` union would have needed the property widened too — in the
primitive, which the consumer does not own.

Note also that this change did **not** require ejecting. Three of its four
hunks are reachable from outside via `::part()` and custom properties. Only the
fourth (`.Icon`) is not. See §8.

### Change 2 — `leading-chevron`: move the chevron and swap the glyph

**This is where the model breaks.**

The intended implementation is an override of `render()`. It does not compile.
`experiments/attempted-render-override.ts` is the attempt, kept verbatim;
`deno check` on it produces **11 errors for the trigger half alone**:

```
TS18013: Property '#selectedOption' is not accessible outside class 'DuiSelectPrimitive' …
TS18013: Property '#triggerId' …
TS18013: Property '#popup' …            (×2)
TS18013: Property '#listboxId' …        (×2)
TS18013: Property '#highlightedIndex' … (×2)
TS18013: Property '#onTriggerClick' …
TS18013: Property '#onTriggerKeyDown' …
TS18013: Property '#displayValue' …
```

The popup half would add `#renderItem`, `#itemPart`, `#onListMouseDown` and
`#popup.handleToggle`. `render()` is all-or-nothing in Lit: you cannot re-emit
one branch of the template and inherit the rest.

`DuiSelectPrimitive` has exactly **six** public members (`options`, `value`,
`placeholder`, `disabled`, `alignItemToTrigger`, `name`) and **17 `#private`
fields**, including all of its state, all of its handlers, its
`FloatingTopLayerController`, its `ElementInternals` and both generated IDs.
There is not a single `protected`. Reimplementing `render()` therefore means
reimplementing the other 539 lines of the primitive — at which point "behavior
stays a dependency" is no longer true and the whole premise collapses.

**What was shipped instead**, because it is what a real consumer would do:

```css
:host([leading-chevron]) .Trigger {
  flex-direction: row-reverse;
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-2);
}
/* hide the primitive's hardcoded chevron … */
:host([leading-chevron]) .Icon svg { display: none; }
/* … and repaint the <dui-icon> box with a masked data URI */
:host([leading-chevron]) .Icon dui-icon {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg …%3E");
  mask-size: contain; mask-repeat: no-repeat; mask-position: center;
}
```

18 CSS rule lines and 19 lines of comment explaining why it looks like that.
It works (screenshot `02-consumer-changes.png`), but:

- Reordering via `row-reverse` is a legitimate layout tool. Fine.
- Replacing the glyph is not. The chevron `<svg>` is hardcoded in the
  primitive's template, so the only route is to hide it and mask-paint over it.
  The one piece of luck: the `<svg>` is a *light* child of `<dui-icon>` living
  in select's own shadow root, so a rule in the subclass's own stylesheet can
  reach it. Had the primitive put the SVG inside `dui-icon`'s shadow DOM, there
  would have been no route at all.
- The data URI contains `stroke='black'` — not a rendered color (a mask reads
  alpha only), but still a hardcoded literal in a codebase whose stated rule is
  "never hardcode color values". A fair signal of how far outside the intended
  path this sits.

**Assessment: this is fighting a base class, not editing `select.tsx`.** In
shadcn, moving an icon is moving a JSX element. Here it is a CSS workaround with
a paragraph of justification, and the consumer ends up with a *worse* artifact
than the `::part()` approach they were trying to escape.

### Named friction points

1. **`#private` closes the render tree completely.** The single biggest finding.
2. **`render()` is all-or-nothing.** No `renderTrigger()` / `renderPopup()`
   seam, so partial reuse is impossible even in principle.
3. **Copied CSS couples to undocumented internals.** `.Trigger`, `.Icon`,
   `.Listbox`, `.Item`, `.Popup`, `.Value`, `.ItemIndicator` are private class
   names in someone else's shadow root. They are not parts, not documented,
   not versioned (§5, probe B).
4. **`:host([attr])` ceremony.** Every variant needs its own `:host([…]) .X`
   prefix repeated per element — 4 hunks for one density. In `select.tsx` this
   is one `cva` entry.
5. **Tag collision is structural**, because `tagName` is inherited from the
   primitive (§4).
6. **Backticks are illegal in comments inside a `` css`` `` template.** The
   ejected file cannot reference code identifiers in comments the way normal
   TS comments do. Cost me one build.
7. **`deno fmt` and "verbatim copy" are in direct conflict.** Running the
   consumer's own formatter once rewrote 9 lines of the copied CSS (comment
   indentation, one `font-size; line-height` pair split across lines, one
   `box-shadow` rewrapped). Semantically identical — still 0 pixel diff — but
   the byte-level correspondence to upstream is gone after the first commit,
   which is exactly what diff tooling would need (§5).

---

## 4. Registration and the tag-name problem

Answers to the three questions, measured in-browser by the probe at the bottom
of the demo page (`spike-eject.ts` → `probeDoubleRegistration`):

**Does importing anything from `@dui/components` cause a double registration
error?** **Yes, a hard one.** Verbatim output from the running page:

```
tag "dui-select" owned by the ejected class before the import: true
import("@dui/components/select") -> DOMException: Failed to execute 'define' on
  'CustomElementRegistry': the name "dui-select" has already been used with this registry
library module finished evaluating: false
tag "dui-select" still owned by the ejected class after: true
```

The important line is the third. The ejected class **wins** the tag (first
define holds), but the throw happens at module-evaluation time and **aborts the
importing module**. Anything downstream of that import in the same module never
runs. So a consumer who ejects `select` and then imports `@dui/components`
(the `all.ts` barrel), or any template that transitively pulls select in, takes
out their whole module graph — not just select.

There is no opt-out. `customElements.define` has no "replace" mode, and the
library's define is unconditional at module scope.

**Does `defineComponents()` / `applyTheme()` work with ejected classes?**
`defineComponents()` does not exist in this codebase, so the question is moot —
registration is already a raw `customElements.define()` and the ejected file
does exactly the same thing, one line, no glue. `applyTheme()` works unchanged:
it appends a document-level adopted stylesheet of custom properties and never
looks at classes or tag names.

**Does the floating/portal controller look up styles by tag name?** No.
`floating-portal-controller.ts` does not exist; it is `FloatingTopLayerController`,
and since the popup renders in the component's own shadow root via native
`[popover]`, the ejected styles apply to it directly with no lookup involved.
Verified: the compact popup opens with correctly-scaled option rows and
macOS-style selected-item alignment (`03-compact-popup-open.png`).

**Judgment call taken:** registered as `dui-select`, per the brief. The
alternative a cautious consumer would pick is a prefixed tag (`app-select`),
which sidesteps the collision entirely but means every call site changes and
the ejected component is no longer a drop-in — you cannot eject one component
of a template's internals that way, only components you instantiate yourself.

---

## 5. Update behavior

### Upstream primitive change — additive

Added `aria-required` to the primitive's trigger. **The ejected subclass picked
it up with zero changes.** Verified in the DOM (`aria-required: "true"` on the
ejected component's trigger), 0 pixel diff, `deno check` clean.

This is the model working exactly as advertised, and it is a real advantage
over vendoring the whole component: accessibility and behaviour fixes flow
through the dependency.

### Upstream primitive change — a rename

Renamed the primitive's internal `.Trigger` class and its `trigger` part.

**It broke silently and totally.** `deno check` clean. `deno lint` clean. Zero
console errors. The ejected select simply lost its border, background, padding,
height, focus ring and *every* size variant at once, rendering as an unstyled
span (`04-after-upstream-rename.png`). All four sizes became indistinguishable.

Two details that make it worse than "loud breakage":

- **It is partial.** The `leading-chevron` glyph swap survived (it targets
  `.Icon`, not renamed) while the reordering died (it targets `.Trigger`). A
  half-styled component is harder to diagnose than a fully broken one.
- **Nothing in the type system or the toolchain can catch it.** The coupling is
  string-to-string across a repo boundary, through class names that are not
  part of any documented contract.

The primitive edit was reverted; restoration verified (0 pixel diff against the
pre-change screenshot).

### Library-side aesthetic change — what a `dui diff` would need

Made a realistic 4-line polish edit to `@dui/components/select`: softened the
hover background `0.05 → 0.04`, tightened the default trigger's left padding
one step, added a resting inset highlight.

A naive two-way diff (library-now vs the consumer's file) prints **75 changed
lines — of which 4 are the actual upstream change.** The other 71 are the
consumer's own `size="compact"` and `leading-chevron` work, rendered as
deletions the consumer is invited to "restore". That output is worse than
useless; a consumer would learn to ignore it.

**A useful `dui diff` needs three inputs, not two:**

1. **library-now** — the current `@dui/components/select` styles.
2. **library-at-eject-time** — the exact version copied. This is the input that
   does not exist today. It has to be recorded at eject time: a version pin
   plus a content hash of the copied CSS block, written into the ejected file
   (a header comment) or a lockfile (`dui.eject.json`).
3. **consumer-now** — the ejected file as it stands.

Then the diff to present is `library-at-eject → library-now`, offered as a
patch to apply onto `consumer-now`, with conflicts surfaced only where the
consumer edited the same rule. That is a three-way merge, i.e. what `git
merge-file` does — the CLI would not need to invent anything, but it *does*
need input 2 to exist from day one.

Two further inputs it would need that are less obvious:

- **A CSS-aware normalizer**, because of friction point 7: the consumer's
  formatter rewrites the copied block on first commit, so a line-based diff
  produces phantom hunks. Diffing at the level of CSS rules and declarations,
  not lines, is required for the output to be readable.
- **A primitive version, separately pinned.** The rename in probe B is invisible
  to any diff of the *styled* layer — the breakage lives in `@dui/primitives`,
  which the consumer still tracks as an ordinary dependency. Ejecting does not
  free them from primitive upgrades; it just removes the one layer that used to
  absorb them.

---

## 6. Blockers and hacks

Two are environment-only and unrelated to the spike's substance:

1. **`jsr.io` is blocked by this sandbox's egress policy**, so
   `jsr:@std/path` / `@std/fs` — imported by `packages/docs/serve.ts` and every
   `scripts/*` build tool — cannot resolve, and neither `deno check` nor the
   dev server would start at all. Worked around with `vendor/std-path.ts` and
   `vendor/std-fs.ts` (thin re-exports of `node:path` and Deno's own FS API),
   mapped over the `jsr:` specifiers by two entries in the root `deno.json`
   import map. **Delete those two entries and `vendor/` on any machine that can
   reach jsr.io.** Deno was also not installed; installed via the `deno` npm
   package.
2. **The primitives repo was not present.** `dui-primitives` is a separate repo
   the import map reaches at `../dui-primitives`; cloned there.

One is a real change to shared code, and would be needed on any machine:

3. **`packages/docs/serve.ts` entry points now carry explicit `out` names.**
   Adding a single entry point outside `packages/docs/src` moved esbuild's
   computed `outbase` and renamed **every** existing bundle — `/index.js`
   became `/docs/src/index.js`, 404-ing the entire docs site. Naming the
   outputs pins them regardless of outbase; all six URLs verified unchanged.
   This is a genuine (small) bug the spike surfaced rather than caused: any
   future entry point outside `src/` would hit it.
   *Alternative considered:* a standalone esbuild server inside
   `packages/spike-eject`, touching zero existing files, at the cost of
   duplicating ~70 lines of the `@dui/*` resolver plugin. Rejected as more
   total code for a throwaway branch, and the brief asked to reuse the docs
   dev server.

Nothing in `@dui/primitives` or `@dui/core` was modified except the two
deliberate Step 5 probes, both reverted.

The `experiments/` directory is excluded from type-checking via the spike
package's `deno.json`, since it contains a file that is *supposed* not to
compile. `deno check` passes at the repo root; `deno task dev` starts and
serves all six pages.

---

## 7. Leakage

To make the two changes, the consumer had to know, and permanently depend on:

| What they needed | Documented? |
|---|---|
| Internal class names `.Trigger`, `.Icon`, `.Listbox`, `.Value`, `.Item`, `.Popup`, `.ItemIndicator` | **No.** Not parts, not in the registry, not in `docs/`. Only readable from the primitive's source. |
| That `--select-item-font-size` / `-padding-y` / `-icon-size` are the item-density convention, set on `:host` and inherited | **No.** Zero `cssProperties` in the select registry entry. Discoverable only from a comment in the styled layer's source. |
| That `size` is a bare attribute, not a property, so a new value needs no schema change | Partially — `themeAttributes` in the registry lists `size` with its four values, but not that it is unenumerated CSS. |
| That the primitive renders `<dui-icon>` and `<dui-scroll-area>` by tag name and they must be registered | **No.** And the library's own styled select **does not import them** — it works today only because apps pull them in by other routes. Rendered in isolation, the library select's chevron is un-upgraded and mis-sized. The ejected copy imports them explicitly, which is strictly better. |
| That the chevron `<svg>` is a light child of `<dui-icon>`, hence reachable from select's own stylesheet | **No.** This is the load-bearing fact behind change 2, and it is an accident of implementation. |
| Which parts exist | **Mostly not.** The primitive exposes 10; the docs registry documents 2. |
| That `render()` is unoverridable | **No.** Nothing warns you before you write the file. |

Only two facts a consumer needs are documented anywhere: the six public
properties, and the two parts in the registry. **Everything an ejected file
actually depends on is undocumented**, which means today an eject would ship a
file whose entire coupling surface is unspecified — and, per §5 probe B, can
change in a patch release without anything noticing.

---

## 8. Side-by-side: a denser select, both ways

Same visual target, both code paths in full.

### (a) The library way today — tokens + `::part()` from a consuming app

No eject. `src/external-compact.css`, applied from the app's own stylesheet to
`<dui-select data-density="compact">`:

```css
/* Option rows. These land: the styled layer declares them in a :host rule, and
   an outer-tree declaration outranks a :host declaration on the same element. */
dui-select[data-density="compact"] {
  --select-item-font-size: var(--text-2xs);
  --select-item-padding-y: var(--space-0_5);
  --select-item-icon-size: var(--space-2_5);
}

/* Trigger box. Lands: `trigger` is an exported part. */
dui-select[data-density="compact"]::part(trigger) {
  height: var(--component-height-xxs);
  gap: var(--space-1);
  padding: var(--space-0_5) var(--space-0_5) var(--space-0_5) var(--space-1_5);
  border-radius: calc(var(--radius-md) * 0.6);
  font-size: var(--text-2xs);
  line-height: var(--text-2xs--line-height);
}

/* Popup padding. Lands: `listbox` is an exported part. */
dui-select[data-density="compact"]::part(listbox) {
  padding: var(--space-0_5);
}

/* No effect — see below. */
dui-select[data-density="compact"] { --icon-size: var(--space-2_5); }
```

**This does not reach the same visual result.** The trigger's chevron cannot be
shrunk from outside, by any of the three available routes:

1. `.Icon` carries no `part` attribute — there is nothing to select.
2. `--icon-size` set on the host *does* inherit inwards, but the styled layer
   declares `.Icon { --icon-size: var(--space-4) }` on an **inner** element.
   That is not a `:host` rule, so the outer-tree cascade exception does not
   apply and the inner declaration wins.
3. `::part(trigger) dui-icon` is not a valid selector — no descendant
   combinator may follow `::part()`.

Result: a compact trigger with a full-size chevron crowding it. All three
routes were measured in the browser rather than assumed:

| measured on the library + `::part()` path | value | meaning |
|---|---|---|
| `::part(trigger)` computed height | `20px` | the part rule lands (`--component-height-xxs`) |
| `--select-item-font-size` on the host | `0.625rem` | outer-tree declaration **beats** the `:host` declaration |
| resulting `.Item` font-size inside the shadow root | `10px` | …and actually takes effect on the option rows |
| `--icon-size` on the host | `0.625rem` | the consumer's value is there… |
| `--icon-size` on the inner `.Icon` span | `1rem` | …and is **shadowed** by the inner rule |
| chevron box | `16px` | unchanged — the gap |

`evidence/06-compact-library-vs-ejected.png`: top row is this path, bottom
row is the ejected one, both at 4× device pixel ratio.

Closing that last gap requires a change to `@dui/components`: a new exported
part, a new `--dui-select-icon-size` property, or a new value in the size enum.
**That is the "every unanticipated need becomes a new knob" problem in one
screenshot**, and it is the strongest single argument the eject model has.

### (b) The ejected way

`packages/spike-eject/src/components/dui/select.ts`, 27 lines, quoted in full
in §3. Reaches the target exactly, including the chevron, and lives next to the
rest of the component's styles rather than in a stylesheet three directories
away.

### The honest comparison

| | library way | ejected way |
|---|---|---|
| Lines the consumer writes | 24 | 27 |
| Reaches the target | **No** — chevron unreachable | **Yes** |
| Locality | app stylesheet, far from the component | in the component file |
| Requires a library change | Yes, to finish | No |
| Survives a primitive-internals rename | **Yes** for `::part(trigger)`; no for the custom properties | **No** — silent total breakage (§5) |
| Survives a library style upgrade | Automatically | Only with three-way diff tooling that does not exist (§5) |
| Cost to adopt | 24 lines | 361 lines copied, 78 of them permanently owned dead weight |

Note the row that cuts the other way: `::part(trigger)` is a **published
contract** and survives the rename that destroyed the ejected file. Ejecting
trades a small, documented, stable surface for a large, undocumented, unstable
one.

---

## 9. Verdict and recommendation

**Do not build `dui add --eject` as it stands** — and before building it at
all, apply the two-line cascade fix at the end of this section, which closes
the gap that motivated the whole investigation. The locality win is real but
small, and it is bought at a price the spike measured precisely.

The win: change 1 was a pleasure, and §8 shows a real need the external API
genuinely cannot serve. Locality is not nothing — the ejected file is where you
look for the component's appearance, and adding a density there felt like
`select.tsx`.

The loss: for the class of change that motivates ejecting in the first place —
*"I need the component shaped slightly differently"* — the shadow-DOM subclass
model eats the entire benefit. `render()` is a sealed, all-or-nothing method
over 17 private fields. A consumer who ejects to gain control over the markup
gains none, discovers this only after writing the file, and lands on a CSS
workaround uglier than the `::part()` code they were escaping. Meanwhile they
have taken on 361 lines, 78 of which they will never touch, coupled to seven
undocumented class names that a patch release can rename with no warning from
any tool (§5, §7). shadcn's copied `select.tsx` has none of these properties:
it is the markup, its dependency surface (Radix's props) is public and typed,
and its formatter-normalized diff is a solved problem.

**What would make it viable**, in the order I would do them:

1. **Split `render()` into protected seams** — `renderTrigger()`,
   `renderValue()`, `renderIcon()`, `renderPopup()`, `renderItem(option, i)` —
   and promote the handful of fields those need (`selectedOption`,
   `displayValue`, `isOpen`, `highlightedIndex`, `triggerId`, `listboxId`, the
   trigger handlers) from `#private` to `protected`. This is the one change
   that turns a "no" into a "yes"; without it nothing else matters. It is also
   the change with real cost: those seams become API, and `#private` is
   currently doing genuine work keeping the primitives refactorable.
2. **Make the styling contract explicit and versioned.** Either promote the
   internal class names to documented, frozen part names, or have the primitive
   expose `data-*` hooks it commits to. Today's ejected file couples to
   implementation details by accident.
3. **Record the eject base at eject time** — version pin plus a content hash of
   the copied block — so a three-way `dui diff` is possible at all (§5). Cheap,
   and worth doing even if nothing else here happens.
4. Only then, the CLI. And scope it to components whose primitives have the
   seams from (1); an eject of a sealed primitive should be refused, not
   shipped.

**A cheaper alternative, which I tested rather than merely proposed.** Given
that §8 is the one place the external API demonstrably fails, I moved the
styled layer's `--icon-size` declaration off the inner `.Icon` element and onto
`:host`, where — as the table in §8 proves for `--select-item-font-size` — an
outer-tree declaration wins:

```diff
   :host {
+    --icon-size: var(--space-4);
     --select-item-font-size: var(--text-sm);

   .Icon {
     display: flex;
     align-items: center;
-    --icon-size: var(--space-4);
     color: var(--text-1);
   }
```

With that applied, the library + `::part()` path reproduces the ejected result
**exactly: 0 differing pixels** at 4× DPR, chevron included
(`evidence/07-onelinefix-library-vs-ejected.png` — both rows now identical;
compare `06`, which is the same comparison before the fix). Reverted afterwards.

So the entire motivating gap — the one thing that justified 361 copied lines —
closes with a **two-line move in the styled layer**. No CLI, no primitive
refactor, no diff tooling, no tag collision, nothing for the consumer to
maintain. That reframes the diagnosis: the problem is not *"consumers need to
own the file"*, it is *"the styled layer declares its knobs at the wrong
cascade level"* — an inner-element declaration is unreachable, a `:host`
declaration is a public knob for free.

I would audit three or four more components for the same mistake before
committing anything to the eject model. If the pattern holds — and the fact
that select's *item* variables are already correctly declared on `:host`, while
its *trigger* icon is not, suggests it is an inconsistency rather than a design
— then most of the "unanticipated need" pressure is a cascade bug, and the CLI
is solving a problem the library gave itself.

---

## Running it

```bash
deno task dev                                   # from the repo root
open http://localhost:4040/spike-eject.html               # the ejected select
open http://localhost:4040/spike-eject.html?impl=library  # the library + ::part() path
```

## Evidence

All screenshots are in `evidence/`, produced by the running dev server via
headless Chromium at the viewport the repo conventions specify (1280×1000).

| file | what it shows |
|---|---|
| `01-ejected-verbatim.png` / `01-library-baseline.png` | the ejected select and the library select under identical markup; 0 differing pixels |
| `02-consumer-changes.png` | both Step 4 changes live — `size="compact"` and `leading-chevron` |
| `03-compact-popup-open.png` | the compact popup open, option rows scaled, selected item aligned to the trigger |
| `04-after-upstream-rename.png` | §5 probe B — the silent, total, *partial* breakage after the primitive renamed `.Trigger` |
| `05-library-external-part-way.png` | the library + `::part()` path |
| `06-compact-library-vs-ejected.png` | §8, 4× DPR. Top: library + `::part()`. Bottom: ejected. The chevron is the gap. |
| `07-onelinefix-library-vs-ejected.png` | the same comparison after the two-line cascade fix in §9 — 0 differing pixels |
