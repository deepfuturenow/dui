# Findings: a headless `SelectController` and an owned single-file select

Throwaway experiment on the branch `claude/implement-attached-plan-is0bxg`, in
`packages/spike-headless/`. Everything here was measured in a browser or from
the type checker. `dui-primitives` and `@dui/core` are unmodified.

Read `packages/spike-eject/FINDINGS.md` first. This spike exists because that
one failed at exactly one thing: the template wasn't in the copied file.

## Summary

**The model works, and it delivers the thing the previous spike couldn't.**

|                                   | Previous spike (copied subclass)                                                       | This spike (headless controller)     |
| --------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| Move the chevron before the value | **Impossible.** 11 `TS18013` errors, shipped a `row-reverse` + `mask-image` workaround | **Three lines cut and pasted**       |
| Add a count badge to the trigger  | Not attempted; needs markup                                                            | **34 lines, nothing reached into**   |
| Add a compact size                | 27 lines of CSS                                                                        | 20 lines of CSS                      |
| Rename something upstream         | **Silent** total breakage, clean type check                                            | **Compile error at the spread site** |
| Visual fidelity                   | 0 differing pixels                                                                     | 0 differing pixels, closed and open  |

Two costs, both real and neither fatal:

- The consumer now owns ARIA correctness. A forgotten spread is invisible. A
  ~25-line dev check catches most of it; see
  [section 7](#7-what-the-consumer-now-owns).
- The prop-bag contract is enforced by **bag name**, not by contents. Moving a
  handler between bags type-checks cleanly and silently kills the keyboard; see
  [probe 3](#5-update-probes).

---

## 1. Question 1 — is spreading props in Lit tolerable?

**Yes. Better than expected.** Here is the entire `render()` of the owned
select, after all three consumer changes from step 4:

```ts
override render(): TemplateResult {
  const c = this.#select;

  return html`
    <div class="trigger" part="trigger" ${spread(c.triggerProps)}>
      <span class="icon">
        <dui-icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </dui-icon>
      </span>
      <span class="value" part="value" ${spread(c.valueProps)}>
        ${c.hasValue ? c.displayValue : this.placeholder}
      </span>
      ${this.badge && c.hasValue
        ? html`<span class="badge" part="badge">${
          this.#selectedIndex + 1
        }/${c.options.length}</span>`
        : nothing}
    </div>

    <div class="popup" part="popup" ${spread(c.popupProps)}>
      <dui-scroll-area ${spread(c.scrollerProps)}>
        <div class="listbox" part="listbox" ${spread(c.listboxProps)}>
          ${repeat(
            c.options,
            (option) => option.value,
            (option, index) => this.#renderItem(option, index),
          )}
        </div>
      </dui-scroll-area>
    </div>
  `;
}
```

**Would I hand this to a consumer? Yes.** It reads as markup. Every element is
one tag, one class, one part, one spread. There is no directive soup, and the
structure of the component is visible at a glance — which is the whole point,
and is precisely what the copied-subclass model could not offer at any price.

**The ugliest line** is the badge:

```ts
${this.badge && c.hasValue
  ? html`<span class="badge" part="badge">${this.#selectedIndex + 1}/${c.options.length}</span>`
  : nothing}
```

That's Lit's conditional syntax, not the spread model — the same line in
`select.tsx` would be `{badge && hasValue && <span .../>}`. It's the tax for
being in a template literal rather than JSX, and it's unavoidable here.

### One design choice made this work

Lit directives cannot be values inside a spread object; they're only valid in
binding positions. So with an off-the-shelf spread, `ref()` has to be its own
binding and every element needs two:

```ts
<div class="trigger" ${ref(this.#triggerRef)} ${spread(c.triggerProps)}>
```

`@open-wc/lit-helpers` ships a `spread` (v0.7.0, reachable from this sandbox)
and would have forced that. Writing our own — 120 lines including comments —
lets the directive honour a `ref` key inside the bag, because the directive
already holds the element. That halves the bindings and is why the template
above reads the way it does. **The custom directive earned its keep on this one
feature.**

Syntax, chosen to mirror Lit's own so it reads familiarly: `name` attribute,
`.name` property, `?name` boolean attribute, `@name` event, plus the special
`ref` key.

---

## 2. Question 2 — does the floating machinery survive being handed refs?

**Yes, and `FloatingTopLayerController` needed no changes at all.** It already
takes `getAnchor()` and `getPopover()` callbacks and renders nothing. The nine
`querySelector(".Trigger")` calls were `DuiSelectPrimitive`'s choice, not the
controller's. Passing consumer refs instead is a drop-in.

Two things did break. Both were silent, and both are worth the whole spike.

### Break 1: a class name hardcoded two levels down

`resolveScrollContainer()` in `floating-popup-utils.ts` finds the popup's
scroller like this:

```ts
const popup = floating.classList.contains("Popup")
  ? floating
  : floating.shadowRoot?.querySelector(".Popup") ??
    floating.querySelector(".Popup");
```

Consumer-owned markup names its own elements, so this returns `null`. It is
called from two places, and the second one matters more:

```ts
// computeFixedPosition — decides whether macOS inner-alignment is used at all
const scrollContainer = resolveScrollContainer(floating) ?? floating;
const listFits =
  scrollContainer.scrollHeight <= scrollContainer.clientHeight + 1;
```

With the wrong element, `listFits` reads the wrong box. Measured effect on the
15-option select:

|                           | library       | owned, before the fix |
| ------------------------- | ------------- | --------------------- |
| popup offset from trigger | `dx 0, dy 36` | `dx -22, dy -317`     |
| height                    | `453`         | `478.8`               |
| `--dui-available-height`  | `453px`       | `806px`               |

The owned select used inner alignment when it should have fallen back to
anchored positioning — **353 pixels wrong, with nothing logged**. This is the
same failure class the previous spike found in copied CSS, but now in
`@dui/core`, where it affects any consumer who names their own elements.

Fix: an injectable `getScrollContainer`, threaded through both
`AlignInnerOptions` and `FloatingTopLayerControllerOptions` — the latter because
it builds the former from its own flattened `alignToInner*` fields. **Six lines
of real change** across the two copied files.

### Break 2: refs resolve too early

The first attempt captured the scroll viewport at ref time:

```ts
ref: ((el) => this.#scrollerEl = el?.scrollViewport ?? el);
```

A `ref` callback fires when the element is **created**, which for a custom
element is before its own shadow DOM exists. `dui-scroll-area.scrollViewport`
was still `null`, so this silently captured the host element instead of the
viewport, and every `scrollHeight` test downstream read the wrong box.

Resolving lazily on each read fixes it:

```ts
get #scrollerEl(): HTMLElement | null {
  return this.#scrollerHostEl?.scrollViewport ?? this.#scrollerHostEl ?? null;
}
```

**This is a general hazard of the ref-handoff model, not a select quirk.** Any
controller that receives a custom element by ref and reads a property that
element computes must resolve it lazily. Worth stating in whatever documents
this pattern, because the failure is silent.

### Why refs, not `@query`

`@query` needs a selector, which puts a class name back in the controller — the
exact coupling the model exists to remove. Refs are the only mechanism where the
consumer names their own elements and the controller stays ignorant of those
names. The cost is that a ref must actually be attached, which is
[section 7](#7-what-the-consumer-now-owns).

### Would this generalise?

For anything using `FloatingTopLayerController` — popover, tooltip, menu,
combobox, preview-card — **yes, and more easily than select.** Select is the
hard case in this family because it is the only one using `alignInner`, which is
where both breaks live. A tooltip that just needs offset/flip/shift touches
neither.

The one caveat: every one of those components will hit break 2 the moment its
popup contains a `<dui-scroll-area>`.

---

## 3. The controller as shipped

```ts
class SelectController implements ReactiveController {
  constructor(
    host: ReactiveControllerHost & HTMLElement,
    options: SelectControllerOptions,
  );

  // read-only state
  get isOpen(): boolean;
  get options(): SelectOption[];
  get selectedOption(): SelectOption | undefined;
  get displayValue(): string;
  get hasValue(): boolean;
  get highlightedIndex(): number;

  // prop bags, each spread onto exactly one element
  get triggerProps(): SpreadProps;
  get valueProps(): SpreadProps;
  get popupProps(): SpreadProps;
  get scrollerProps(): SpreadProps;
  get listboxProps(): SpreadProps;
  get itemTextProps(): SpreadProps;
  itemProps(index: number): SpreadProps;

  // imperative
  open(): void;
  close(): void;
}

type SelectControllerOptions = {
  getOptions: () => SelectOption[];
  getValue: () => string;
  getPlaceholder: () => string;
  getDisabled: () => boolean;
  getAlignItemToTrigger?: () => boolean;
  onChange: (value: string, option: SelectOption) => void;
};
```

### Options as getters, not a snapshot and not host properties

Three ways to give the controller its inputs, and the choice matters:

| Approach                                      | Verdict                                                                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pass values once at construction              | Wrong. Goes stale on the first update.                                                                                                                  |
| Controller reads `host.value`, `host.options` | Works, but re-couples the controller to a naming convention on the host — the same class of undocumented coupling the class names were, just relocated. |
| **Getters passed at construction**            | Chosen. The controller never knows a property name; host state can live anywhere. Costs the consumer one arrow function per input.                      |

### Line counts

| File                                                              | Lines |
| ----------------------------------------------------------------- | ----: |
| `DuiSelectPrimitive` (original, untouched)                        |   545 |
| `select-controller.ts`                                            |   432 |
| `spread.ts`                                                       |   120 |
| owned `select.ts` (34 imports + 322 CSS + 151 class and template) |   508 |

The primitive's 545 lines went to:

- **~110 lines moved to the owned file** — `render()`, `#renderItem()`, the part
  names, the two inline SVGs.
- **~90 lines genuinely added to the controller** — the seven prop-bag getters,
  which are new API surface that didn't exist before. This is the real cost:
  what used to be attributes inline in a template is now a typed, named,
  documented contract.
- **~40 lines removed** — the nine `querySelector` calls and the scroll/focus
  helpers built on them collapse into ref reads.
- Everything else is unchanged: state, keyboard, selection, events.

`spread.ts` is a one-off. It is not per-component.

---

## 4. The three consumer changes

### Change 1 — `size="compact"`: 20 lines, all CSS

Identical in kind to the previous spike. Four `:host([size="compact"])` blocks.
Nothing outside the style block changed. This was never the hard case, and it
does not require this model — or the previous one. See
[the side-by-side](#6-side-by-side).

**Did it feel like editing `select.tsx`?** Yes, same as before.

### Change 2 — leading chevron: three lines, moved

The entire change to the markup:

```diff
     <div class="trigger" part="trigger" ${spread(c.triggerProps)}>
-      <span class="value" part="value" ${spread(c.valueProps)}>
-        ${c.hasValue ? c.displayValue : this.placeholder}
-      </span>
       <span class="icon">
         ...
       </span>
+      <span class="value" part="value" ${spread(c.valueProps)}>
+        ${c.hasValue ? c.displayValue : this.placeholder}
+      </span>
     </div>
```

Plus three one-line padding flips, because the library's asymmetric trigger
padding (`2 2 2 3`) assumed value-then-icon and now reads wrong. Six changed
lines total.

No `row-reverse`. No `mask-image`. No hidden `<svg>`. No data URI with a
hardcoded colour in it.

**Did it feel like editing `select.tsx`?** Yes — this is literally cut and
paste, which is what it is in `select.tsx` too. This single result is the
strongest argument in this document.

Worth noting what did _not_ happen: no attribute or variant flag was added. You
own the file, so every instance gets the change. A variant flag would only be
needed if you wanted both — which is the library's problem, not the app's.

### Change 3 — count badge: 34 lines, and one API gap found

New markup, a new reflected `badge` property, badge CSS, and derived state
showing "position of total" (`3/5`).

**The controller did not expose what was needed.** `selectedIndex` is private —
kept for the controller's own alignment maths. But nothing had to be reached
into: it recomputes from public state in one line.

```ts
get #selectedIndex(): number {
  return this.#select.options.findIndex((o) => o.value === this.value);
}
```

**This is the important distinction from the previous spike.** An under-exposed
controller API costs one line of recomputation. A sealed template costs the
entire change. The controller should still expose `selectedIndex`; a real
version would.

**Did it feel like editing `select.tsx`?** Yes, including the mild irritation of
recomputing something the library already knew.

---

## 5. Update probes

| Probe                                                | Expected       | Actual                                                                            |
| ---------------------------------------------------- | -------------- | --------------------------------------------------------------------------------- |
| 1. Additive: add `aria-required` to `triggerProps`   | Picked up free | **Confirmed.** `aria-required="true"` in the DOM, zero changes to the owned file. |
| 2. Breaking: rename `triggerProps` → `buttonProps`   | Compile error  | **Confirmed**, at the spread site.                                                |
| 3. Structural: move the keydown handler between bags | Unknown        | **Silent, total keyboard failure.**                                               |

### Probe 2, verbatim

```
TS2339: Property 'triggerProps' does not exist on type 'SelectController'.
      <div class="trigger" part="trigger" ${spread(c.triggerProps)}>
                                                     ~~~~~~~~~~~~
    at .../spike-headless/src/components/dui/select.ts:437:54
```

Compare the equivalent probe in the previous spike — renaming `.Trigger` in the
primitive — which passed `deno check`, passed `deno lint`, logged nothing, and
left an unstyled element on the page. **This is the single clearest improvement
of the model.**

### Probe 3, and what it actually proves

Moving `@keydown` from `triggerProps` to `listboxProps`:

| Behaviour              | library       | owned                    |
| ---------------------- | ------------- | ------------------------ |
| Down opens             | yes           | **no**                   |
| Arrows move highlight  | yes           | **no**                   |
| Enter commits          | `dragonfruit` | **`cherry`** (unchanged) |
| Home / End             | yes           | **no**                   |
| Skips disabled options | yes           | **no**                   |

`deno check` clean. `deno lint` clean. Console empty.

So the prop-bag contract is enforced by **bag name**, not by contents. Both bags
were spread on the right elements; the controller simply put the handler on an
element that never receives focus.

**Be fair about what this shows.** The consumer's code was still correct. This
is a library regression that library tests should catch — the same as any other
behavioural bug. It is a genuinely different failure class from the `.Trigger`
rename, which broke _consumer_ code with no signal to either party. The model
converts "consumer code silently breaks" into "library code has a bug", which is
a large improvement even though it isn't zero risk.

---

## 6. Side-by-side

The same intent — a compact select with a leading chevron — three ways.
`evidence/03-three-approaches.png` shows all three at 4x, in this order.

### A. External CSS against the library `<dui-select>`

```css
dui-select[data-density="compact"] {
  --select-item-font-size: var(--text-2xs);
  --select-item-padding-y: var(--space-0_5);
  --select-item-icon-size: var(--space-2_5);
}
dui-select[data-density="compact"]::part(trigger) {
  height: var(--component-height-xxs);
  gap: var(--space-1);
  padding: var(--space-0_5) var(--space-0_5) var(--space-0_5) var(--space-1_5);
  border-radius: calc(var(--radius-md) * 0.6);
  font-size: var(--text-2xs);
  line-height: var(--text-2xs--line-height);
}
dui-select[data-density="compact"]::part(listbox) {
  padding: var(--space-0_5);
}
```

**Cannot produce the result.** The chevron can't be resized (needs the two-line
`:host` fix from the previous spike) and cannot be moved at all. In the evidence
image, row A has an oversized trailing chevron.

### B. Copied subclass (previous spike)

```css
:host([size="compact"]) {
  /* ...20 lines as in change 1... */
}

:host([leading-chevron]) .Trigger {
  flex-direction: row-reverse;
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-2);
}
:host([leading-chevron]) .Icon svg {
  display: none;
}
:host([leading-chevron]) .Icon dui-icon {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg ... stroke='black' ...%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}
```

Produces a leading icon, but **the glyph is necessarily different** — the
original `<svg>` is unreachable, so it is hidden and a mask painted over it. Row
B shows a stacked up/down glyph, not the original chevron.

### C. Owned file (this spike)

The 20-line CSS block from change 1, plus the three-line markup move quoted in
[change 2](#change-2--leading-chevron-three-lines-moved). The original chevron,
in the new position, at the right size.

### What each approach requires you to know

| Approach | Knowledge needed                                              | Where it lives                                                      |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| A        | `::part(trigger)`, `::part(listbox)`                          | **Documented API** (2 of the 10 parts are in the registry)          |
| A        | `--select-item-*` variables                                   | **Undocumented.** Registry lists no CSS properties.                 |
| A        | That the chevron is unreachable                               | **Nowhere.** You discover it by failing.                            |
| B        | Internal class names `.Trigger`, `.Icon`                      | **Undocumented internals**                                          |
| B        | That the chevron `<svg>` is a light-DOM child of `<dui-icon>` | **Accident of implementation.** The workaround depends on it.       |
| B        | That `render()` can't be overridden                           | **Nowhere.** You discover it after writing the file.                |
| C        | The controller's prop bags and state getters                  | **Typed API.** Autocomplete lists them; renames are compile errors. |
| C        | That every bag must be spread on the right element            | **Nowhere today** — see section 7. This is the model's new tax.     |

The trade is visible in that table: C replaces three rows of undiscoverable
knowledge with one row of typed API and one new obligation.

---

## 7. What the consumer now owns

Every attribute below is correct only because the owned file spreads the right
bag on the right element. In the library select, all of them were the library's
responsibility.

| Attribute                 | Bag             | Element    | Symptom if the spread is missing              |
| ------------------------- | --------------- | ---------- | --------------------------------------------- |
| `role="combobox"`         | `triggerProps`  | trigger    | Not announced as a combobox                   |
| `aria-haspopup="listbox"` | `triggerProps`  | trigger    | No indication a popup exists                  |
| `aria-expanded`           | `triggerProps`  | trigger    | State never announced                         |
| `aria-controls`           | `triggerProps`  | trigger    | Trigger and listbox unlinked                  |
| `aria-activedescendant`   | `triggerProps`  | trigger    | Highlight silent to screen readers            |
| `tabindex`                | `triggerProps`  | trigger    | Not reachable by keyboard                     |
| `id`                      | `triggerProps`  | trigger    | Breaks `aria-controls`/`labelledby`           |
| `role="listbox"`          | `listboxProps`  | listbox    | Options not in a list context                 |
| `aria-labelledby`         | `listboxProps`  | listbox    | Listbox unnamed                               |
| `role="option"`           | `itemProps(i)`  | each item  | Options not announced as options              |
| `aria-selected`           | `itemProps(i)`  | each item  | Selection state silent                        |
| `id`                      | `itemProps(i)`  | each item  | Breaks `aria-activedescendant`                |
| `data-select-item-text`   | `itemTextProps` | item label | Inner alignment misaligns                     |
| `popover="auto"`          | `popupProps`    | popup      | **No top layer, no light dismiss, no Escape** |

Note the last row: it isn't ARIA, and it's the worst one. Forgetting
`popupProps` breaks dismissal entirely.

### The cheapest dev-mode check, implemented

`hostUpdated()` runs once and verifies that every ref attached and one sentinel
attribute per bag actually landed. About 25 lines, and it would be stripped in a
production build.

Silent on correct markup. With `listboxProps` deliberately omitted:

```
[SelectController] on <dui-select-h>:
  - listboxProps was never spread
```

**What it does not catch**, stated plainly: a bag spread on the _wrong_ element,
and probe 3. Neither is reachable by an assertion — the first needs the
controller to know what the elements are for, which is what we removed; the
second is a library bug and needs library tests.

A stronger option worth considering: brand each bag type (`TriggerProps`,
`ListboxProps`, … instead of a shared `SpreadProps`) and have `spread()` accept
a branded type per position. That turns "spread on the wrong element" into a
compile error. It would not help probe 3.

---

## 8. What this model costs the library

The library still ships a ready-to-use `<dui-select>`, and under this model that
is the same file the CLI emits. So the cost is not duplication — it's that
**every primitive has to be turned inside out once.**

From what select showed, per component:

- Delete `render()`, move it to the styled file. Mechanical.
- Convert every attribute in that template into a named prop-bag entry. This is
  the real work and the real API decision: bag boundaries are a public contract
  from then on.
- Replace every `querySelector` with a ref, and audit each one for the
  resolve-too-early hazard from [break 2](#break-2-refs-resolve-too-early).
- Keep form association on the element. `attachInternals()` is element-only, so
  it cannot move to a controller. Five lines per component in the owned file,
  which is fine — the owned file _is_ a custom element.

Select took roughly a day and is a **single-element** component. The three I'd
expect to be hardest:

1. **`sidebar` — 14 elements, coordinated by `@lit/context`.** The context
   provider is an element today. Under a controller model you have to decide
   whether context stays element-to-element (so the owned files must render
   provider elements in the right nesting) or moves into the controller (so one
   controller serves many owned files and has to be shared — a much bigger API
   question than anything select raised).
2. **`toast` — 7 elements plus a global queue and swipe gestures.** State
   outlives any single element, so "the host" is ambiguous. Whose
   `ReactiveControllerHost` owns the queue?
3. **`data-table`** — not context-heavy, but its state (sorting, selection,
   column sizing, virtualisation) is large enough that the prop-bag surface may
   be bigger than the component. The bag-per-cell cost is unproven and
   `itemProps(index)` already hints at the shape of that problem.

Sixteen of the primitives use `@lit/context`. That's the real scope number, not
the component count.

---

## 9. Verdict

**Yes, this delivers what the previous spike couldn't, at a cost I'd accept —
but the cost is a library-wide inversion, not a CLI.** The template really does
end up in the owned file; the render is readable enough to hand to a consumer
without apology; behavior genuinely stays a dependency, proven by 0-pixel
fidelity and full keyboard and form parity; and the discovery surface becomes a
typed API where renames are compile errors instead of silent unstyled elements.
The change that was flatly impossible last time — moving the chevron — became
three lines of cut and paste, which is the single result that decides this.
Against that: the consumer inherits ARIA correctness (mitigable to about 80% by
a 25-line dev check, and further by branding the bag types), the bag contract is
enforced by name and not by contents so probe 3's class of regression is
invisible until something tests it, and `@dui/core` needs the two class-name
couplings fixed before any consumer names their own elements. **Render hooks on
the existing primitives are a legitimate fallback and cheaper, but they buy
strictly less:** `renderTrigger()` and `renderItem()` would have made change 2
possible, but the consumer would still be overriding methods on a base class
whose template they can't see, still writing `:host([attr])` selectors against
class names the primitive owns, and still exposed to the silent `.Trigger`
rename — because the styles would still be targeting someone else's markup.
Hooks fix the _sealed template_; only this model fixes the _split between markup
and styles_, which is what the previous spike identified as the root cause.

If this proceeds, the order I'd suggest: fix the two `@dui/core` class-name
couplings first (they are bugs regardless), brand the prop-bag types, then
convert one compound context-using component — `tabs` or `menu`, not `sidebar` —
because that, not select, is where this model's real cost is still unknown.

---

## 10. Known problems with this experiment

- **One component, and the easy structural case.** Select is a single element.
  Every question about compound components coordinating via context — 16 of the
  primitives — is untouched. Section 8 is an estimate, not a measurement.
- **The controller is a copy, so the update probes are simulated.** Probes 1–3
  edited the spike's own copy, not a published package. A real upgrade also
  carries version resolution and lockfiles, which this can't model.
- **Probe 3 was chosen by me, so it's not a fair sample** of how often a library
  refactor moves a key between bags. It shows the failure is possible and
  silent, not how likely it is.
- **The dev check is unmeasured against real mistakes.** It catches the one
  omission I deliberately introduced. Whether it catches what people actually
  get wrong is unknown.
- **No screen-reader testing.** Section 7 lists attributes and reasons about
  their effect; nothing was verified with an actual assistive technology.
- **Fidelity was verified before step 4.** The owned file now carries the app's
  changes, so the 0-pixel comparison is from commit `3cd852e`. The evidence
  images from after step 4 deliberately differ.
- **The three-way comparison isn't pixel-identical**, and can't be: A can't
  resize or move the chevron, and B must substitute the glyph. The differences
  are the finding, not a flaw in the comparison.

---

## Evidence

| File                                | What it shows                                                       |
| ----------------------------------- | ------------------------------------------------------------------- |
| `evidence/01-closed-comparison.png` | Library and owned selects paired under identical markup             |
| `evidence/02-step4-changes.png`     | The three consumer changes live                                     |
| `evidence/03-three-approaches.png`  | 4x. Top: external CSS. Middle: copied subclass. Bottom: owned file. |

Measured parity, from commit `3cd852e`:

- 7 of 7 closed-state pairs: **0 differing pixels**
- Open state, short list (inner-aligned): **0 differing pixels**, popup geometry
  identical to 0.1px
- Open state, long list (anchored): **0 differing pixels**, identical
  `scrollTop`
- A control run of the library against itself confirmed the harness is
  deterministic before those zeros were trusted

## Running the demo

```bash
deno task dev
```

- `http://localhost:4040/spike-headless.html` — this spike
- `http://localhost:4040/spike-eject.html` — the previous spike, for comparison
