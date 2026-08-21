# Findings: headless controllers and app-owned components

Throwaway experiment on the branch `claude/implement-attached-plan-is0bxg`, in
`packages/spike-headless/`. Everything here was measured in a browser or from
the type checker. `dui-primitives` and `@dui/core` are unmodified.

Read `packages/spike-eject/FINDINGS.md` first. This spike exists because that
one failed at exactly one thing: the template wasn't in the copied file.

This document covers three conversions and one variant:

|                                                                           | What it tested                                                                          |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **select** (sections 1–7)                                                 | One element. Does the model work at all?                                                |
| **tabs** ([section 8](#8-converting-a-compound-component-tabs))           | Five elements coordinated through `@lit/context`. Does a compound component work?       |
| **light DOM** ([section 9](#9-light-dom--does-dropping-shadow-dom-help))  | The same select without a shadow root. Is shadow DOM worth keeping?                     |
| **toast** ([section 10](#10-toast--the-case-expected-to-break-the-model)) | A queue outliving every element, plus an imperative API. The case expected to break it. |

Sections 1–7 were written from select and still hold.

## Summary

**The model works, and it delivers the thing the previous spike couldn't.**

|                                   | Previous spike (copied subclass)                                                       | This spike (headless controller)     |
| --------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| Move the chevron before the value | **Impossible.** 11 `TS18013` errors, shipped a `row-reverse` + `mask-image` workaround | **Three lines cut and pasted**       |
| Add a count badge to the trigger  | Not attempted; needs markup                                                            | **34 lines, nothing reached into**   |
| Add a compact size                | 27 lines of CSS                                                                        | 20 lines of CSS                      |
| Rename something upstream         | **Silent** total breakage, clean type check                                            | **Compile error at the spread site** |
| Visual fidelity                   | 0 differing pixels                                                                     | 0 differing pixels, closed and open  |

Tabs then answered the question select couldn't: a compound component works too,
but it costs **two registration protocols**, and the second one is not obvious
until something breaks silently. See
[section 8](#8-converting-a-compound-component-tabs).

Converting tabs also turned up **two shipped components that are completely
non-functional** — unrelated to this model, fixed in a separate commit. See
[section 8.5](#85-two-library-bugs-found-on-the-way).

**Toast, the case expected to break the model, converted and got smaller doing
it** — 696 lines against the library's 3,028, with the imperative DOM-building
layer not relocated but eliminated. The obstacle was not the queue outliving
elements, which was never hard; it was that `toast()` is a markup generator, and
markup is exactly what the owned file is supposed to own. See
[section 10](#10-toast--the-case-expected-to-break-the-model).

**Light DOM is a real improvement and costs less than expected.** The stylesheet
conversion was fully mechanical, parity was exact, and the leakage it admits has
a boundary that favours the component on ties. See
[section 9](#9-light-dom--does-dropping-shadow-dom-help).

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

## 8. Converting a compound component: tabs

Select is one element. Tabs is five — `dui-tabs`, `dui-tabs-list`, `dui-tab`,
`dui-tabs-panel`, `dui-tabs-indicator` — **composed by the consuming app in its
own light DOM** and coordinated through `@lit/context`. This is the case that
decides whether the model scales, so it was converted rather than estimated.

**It works. Parity is exact.** Measured against the library under identical
markup:

| State                                      | Differing pixels |
| ------------------------------------------ | ---------------: |
| Horizontal, initial                        | **0** of 106,080 |
| Horizontal, after selecting the second tab | **0** of 106,080 |
| Vertical, initial                          |  **0** of 97,920 |

Panel switching, click, <kbd>Enter</kbd>, <kbd>Space</kbd>, and disabled-tab
handling all match. So does the library's _absence_ of arrow-key navigation —
deliberately, at that point, to keep the comparison honest.

### The design decision: the context payload is the controller

Two ways to wire a compound controller:

| Approach                                                                               | Verdict                                                                                                                                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Keep a plain `{value, orientation, select}` context; give each part its own controller | Rejected. The interesting logic — which tab is active, where the indicator goes, where focus moves — is about the **set** of tabs, and no per-part controller can see the set. |
| **Provide the controller instance itself through context**                             | Chosen. One controller on the root; every part pulls its own bag.                                                                                                              |

That choice is what makes the good results below possible. It also has a price,
paid twice, and both instalments were discovered by something breaking rather
than by design.

### Cost 1: tabs must register themselves

The controller cannot find the tabs. They are consumer-authored elements, in
light DOM, named whatever the owned file names them. So each tab announces
itself on connect and withdraws on disconnect.

What this replaces is worth quoting, because it is the same disease the previous
spike diagnosed, one layer deeper:

```ts
// dui-tabs-list, in the library
const activeTab = slottedElements.find(
  (el) =>
    el.tagName === "DUI-TAB" && el.getAttribute("value") === this._ctx?.value,
);
```

A **tag name hardcoded into the behaviour layer**. An app that owns its tabs
file and calls the element anything else loses the indicator, silently.
Registration removes the guess entirely.

### Cost 2: _every_ part must register — and this one is nasty

`@consume` re-renders a consumer when the context value changes **identity**.
The library rebuilds its plain context object on every change:

```ts
override willUpdate(): void {
  this._ctx = this.#buildContext();   // new object every time
}
```

so its consumers re-render for free. A controller instance is deliberately
**stable**, so nothing propagates. Selecting a tab updated the tabs (they were
registered) and updated nothing else: the list never re-rendered, so the
indicator never moved.

There was no error. No warning. `deno check` clean. The only symptom was
**17,805 differing pixels** in the after-selection screenshot.

The fix is a second registration protocol: list and panel join an update set the
controller drives by hand.

**This is the finding select could not have produced.** Making the controller
the context payload means giving up Lit's propagation semantics and
reimplementing the part of them you gave up. Any conversion of a context-using
family will hit it. It is not hard — it is just invisible until you diff pixels.

### The payoff: an accessibility gap the library structurally cannot close

The library's tabs have **no arrow-key navigation at all**. `tabindex` is 0 on
the active tab and −1 on the rest — the roving-tabindex _shape_ — but nothing
ever moves focus. A keyboard user can Tab onto the active tab and reach **no
other tab**. Those are unreachable controls, not a styling nit.

Adding it to the controller took ~45 lines. Verified: wraps, skips the disabled
tab in both directions, <kbd>Home</kbd>/<kbd>End</kbd> land on the first and
last _enabled_ tab, and orientation picks the axis.

The point isn't the feature, it's **where it can live**. The controller already
knows the whole tab set from registration, so this is local and obvious. In the
library the only element that can see the set is `dui-tabs-list`, through
`slot.assignedElements()` filtered by tag name — so the library would have to
_extend_ the exact coupling this model exists to remove.

One cost recorded: the controller holds host elements, not the buttons inside
their shadow roots, so it moves focus with `host.focus()` and the owned file
must set `delegatesFocus`. Another entry for
[the ownership table](#7-what-the-consumer-now-owns).

### Size

|                                                     | Lines |
| --------------------------------------------------- | ----: |
| Library tabs (5 primitives + 5 styled files)        |   599 |
| `tabs-controller.ts`                                |   278 |
| owned `tabs.ts` (all five elements, styles, wiring) |   481 |

The owned file is **one file, not five**, matching the analogue — shadcn ships a
single `tabs.tsx` exporting Tabs, TabsList, TabsTrigger and TabsContent. The
parts are meaningless apart, and splitting them would put the composition
contract back into import paths.

### What this implies for the rest of the library

Tabs took about half of what select took, because the pattern was known. The
scope number is not "16 primitives use `@lit/context`" — several of those only
provide. The ones still genuinely unknown:

1. **`sidebar` — 14 elements.** Untouched by this conversion, and the largest.
2. **`toast` — 7 elements plus a global queue and swipe gestures.** State
   outlives any single element, so "the host" is ambiguous: whose
   `ReactiveControllerHost` owns the queue?
3. **`data-table`** — not context-heavy, but sorting, selection, column sizing
   and virtualisation may make the prop-bag surface larger than the component.

Tabs makes me more confident about 1 and less worried in general: the two
registration protocols are the whole pattern, and they generalise.

---

## 8.5 Two library bugs found on the way

Neither is related to this model. Both are one-line import-order fixes,
committed separately (`8da9dad`) so they can be cherry-picked.

A Lit `ContextConsumer` dispatches its `context-request` **exactly once**, in
`hostConnected()`, and never retries — that is what `ContextRoot` is for, and
DUI doesn't use one. `customElements.define()` upgrades every matching element
in the document immediately. So whichever family member `index.ts` imports first
upgrades first, and if that is a _consumer_, it connects and asks for a context
whose provider is still an undefined element. **The answer never comes.**

**`tabs`** imported `tab.ts` before `tabs.ts`. Measured in isolation, importing
nothing but `@dui/components/tabs`:

```
before:  one:sel=false,ti=-1   two:sel=false,ti=-1
after:   one:sel=true,ti=0     two:sel=false,ti=-1
```

Before the fix, clicking a tab did nothing and panels never switched. With
`tabindex="-1"` on every tab, the tab list could not be reached by keyboard at
all. This wasn't obvious because the _indicator still highlighted the right tab_
— `dui-tabs-list` and `dui-tabs-panel` are imported after `dui-tabs` and were
fine. Only `dui-tab` was starved.

**`toggle`** has the same shape, `toggle.ts` before `toggle-group.ts`. A/B'd
with identical valid markup (`default-value='["left"]'`):

```
before:  initial selection ignored; single-select never deselected, so
         "center" and "right" were both pressed at once
after:   initial selection honoured; single-select deselects correctly
```

I swept every family in `packages/components` whose primitive provides a
context. These two are the only ones affected.
`packages/docs/static/context-order-probe.html` reproduces both in isolation.

Worth adding a regression test that asserts `aria-selected` on first paint.
Neither bug is visible to a type checker, a linter, or a screenshot.

---

## 9. Light DOM — does dropping shadow DOM help?

Both spikes kept hitting shadow-DOM tax: the `--icon-size` cascade trap, the
`.Popup` class lookup in `@dui/core`, `::part()` export ceremony. This section
tests whether the owned-file model is better without a shadow root at all.
`<dui-select-l>` is the same file as `<dui-select-h>` with two changes:
`createRenderRoot()` returns `this`, and the stylesheet is adopted into the
document instead of the shadow root.

### The conversion is mechanical

A script rewrote the stylesheet: `:host` → `dui-select-l`, everything else → a
descendant selector. **51 selector lines rewritten, zero needing hand editing**,
no `:host` left behind. All **8 `part=` attributes deleted** — they do nothing
outside a shadow root, which is the point: a consumer writes
`dui-select-l .trigger` instead of `::part(trigger)`, so there is nothing to
export and nothing to publish.

### Parity

**0 differing pixels** against the shadow-DOM owned select across default,
`size="xs"`, disabled, and restyled rows. The popup opens in the light DOM,
positions correctly, and keyboard selection works. Form association survives. A
consumer restyle written as `dui-select-l .trigger` produced exactly the same
computed result as `::part(trigger)` did on the other two.

### What it costs, measured

Style leakage is **one-directional**. Tag-prefixed selectors stop the component
polluting the page — a plain `.trigger` div elsewhere on the page was untouched.
Nothing stops the page reaching in, but there is a real boundary:

| Page rule             | Specificity | Result                                   |
| --------------------- | ----------- | ---------------------------------------- |
| `.trigger`            | (0,1,0)     | no effect — component's (0,1,1) wins     |
| `div .trigger`        | (0,1,1)     | no effect — ties go to the adopted sheet |
| `.row .trigger`       | (0,2,0)     | **overrides**                            |
| `.trigger !important` | —           | **overrides**                            |

Note the inversion, which is the interesting part. In shadow DOM an outer-tree
rule **beats** a `:host` rule on a tie. In light DOM with adopted stylesheets
the **component** wins ties, so an app must out-specify it deliberately.
Accidental collisions lose; intentional overrides win. That is a better default
than either "sealed" or "wide open".

Two other costs:

- **The shared `base` reset cannot come along.** It contains
  `* { box-sizing: border-box }`, and adopting that document-wide from inside a
  component is an unacceptable side effect. Each light-DOM component needs a
  scoped stand-in, which is four lines but has to be remembered.
- **`::part()` consumers break.** Anyone already styling through parts has to
  rewrite to plain selectors. For an app that owns the file this is a one-time
  edit; for the library's own ready-made components it would be a breaking
  change.

### The `--icon-size` trap changes character rather than disappearing

The declaration is still on an inner element, so a host-level override still
fails. But `.row dui-select-l .icon` reaches it, which no selector could do
through a shadow root. **Escapable rather than absent.** Light DOM does not
remove the need for the cascade fix in `packages/spike-eject/FINDINGS.md`; it
removes the need for the library to have anticipated it.

### Read

Light DOM is a real improvement to this model and costs less than expected. It
is not free, and the encapsulation it gives up matters most for the embedding
story rather than for ordinary app use. If the inversion proceeds, this is worth
deciding early — converting to light DOM later means rewriting every stylesheet
again, even if that rewrite is scriptable.

---

## 10. Toast — the case expected to break the model

Toast was named at the end of section 9's predecessor as the last open question:
a queue that outlives any element. It converted, and got smaller doing it, but
it needed a different move than select or tabs.

### The obstacle was not what was predicted

"State that outlives an element" was never the problem. The queue is module
state today and stays module state; nothing about that is hard.

The actual obstacle is that **toast's imperative API is a markup generator**.
`toast("Saved")` calls `document.createElement(DuiToastPrimitive.tagName)`,
wraps the description in a `<span slot="description">`, builds a
`<dui-toast-action>` containing a `<button>`, force-registers four primitive
classes, and appends the result to an auto-created `<dui-toast-region>`. Roughly
**150 lines of `toast-imperative.ts` are DOM plumbing of that kind**.

That is fatal to an owned file. The imperative API would keep producing the
library's elements and slot names, silently bypassing whatever the app wrote —
the deepest coupling found anywhere in either spike, because it is not a class
name or a part name but whole elements.

### The fix is to invert the API

`toast()` pushes a plain record into a store; the app's own region component
renders the records with `repeat()`. Call sites do not move: `toast()`,
`toast.success()`, `toast.dismiss(id)` all keep their shape.

The DOM plumbing does not relocate to the app. **It stops existing.** So do
three coordination mechanisms:

| Library mechanism                                                                                                                                                        | Why it existed                                              | What replaces it                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| `registerToast` / `unregisterToast` and a `Map<string, HTMLElement>`                                                                                                     | The region had to find children it did not render           | Refs from `toastProps`, still needed only for height measurement |
| `toastItemContext` — a second context, provided per toast                                                                                                                | So a close button could learn its own toast's id            | `closeProps(id)` closes over the id                              |
| `#applyMirroredState` / `#updateIndices` — imperative writes of `--toast-index`, `--toasts-total`, `data-front`, `data-overflow` onto children, outside the render cycle | The children were slotted, so they were not template output | Return values from `toastProps(record, index)`                   |

### Size

|                                                    | Files |   Lines |
| -------------------------------------------------- | ----: | ------: |
| Library primitives (`dui-primitives/src/toast/`)   |     8 |   2,040 |
| Library styled (`packages/components/src/toast/`)  |     6 |     988 |
| **Headless: store + controller + owned component** | **3** | **696** |

Not a like-for-like ratio — see what was skipped below — but the direction is
the opposite of what was expected of the hardest component.

### Verified in the browser

- A burst of five stacks with correct indices (0 at the front, 4 at the back),
  cumulative before-heights of 0/20/40/60/80px, `data-front` on the front toast
  and `data-overflow` past `max-visible`.
- Hover expands the stack and pauses every timer: a 4s toast survives 5s of
  hover and dismisses 4.2s after the pointer leaves.
- `duration: 0` never dismisses. Action buttons fire their handler and dismiss.
  Close buttons dismiss. Type variants render their icon and colour.

### Not converted, and deliberately so

Swipe-to-dismiss (`toast-swipe-controller.ts`, 263 lines), the region hotkey and
focus-restore machinery, and `toast.promise()`. None of them look structurally
different from what did convert — swipe is pointer events on an element the
controller already has a ref to — but none of them were measured, so the 696
figure is not the finished number.

### One change the shared spread directive needed

Prop bags have to carry CSS custom properties, and until toast nothing did. A
custom property cannot ride on an attribute, and `element.style = {...}`
stringifies to `"[object Object]"`. The directive gained a `style` key that
takes an object and applies it with `setProperty`, compared by value rather than
identity because the bag is rebuilt every render. Twenty lines, and it is the
only change any of the four conversions forced on shared code.

### Two self-inflicted bugs worth recording

- **The fan-out silently did not apply.** `data-expanded` is published by
  `regionProps` onto the list element, and the CSS targeted `:host`. Right bag,
  wrong element, no error, feature quietly absent. This is precisely the failure
  mode [section 7](#7-what-the-consumer-now-owns) says the dev-mode check cannot
  catch, encountered for real rather than hypothesised.
- **Backticks in a comment inside a `css` template literal broke the build** —
  the same trap already recorded for select, walked into again while writing a
  comment about a different bug.

---

## 11. Verdict

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

**Tabs did not change this verdict; it strengthened it.** The compound case was
the open question, and it converted to exact pixel parity with two registration
protocols and no architectural surprises. The second protocol — every part must
register, because a stable controller instance never triggers `@consume` — is a
genuine trap, but it is one pattern, learned once, and it announces itself the
moment you diff pixels.

**Toast was the last open question, and it closed favourably.** The prediction
in an earlier draft of this section — that toast was hard because its state
outlives any element — was wrong. Module state stays module state; that part is
trivial. The real obstacle was that its imperative API builds DOM, which is a
worse coupling than anything select or tabs had, and the fix inverts the API
rather than porting the plumbing. The result is smaller than what it replaces.
Nothing in the four conversions produced a structural surprise the model could
not absorb.

**Light DOM sharpens the recommendation rather than changing it.** It is the
same model with less ceremony, and the decision is worth making early: switching
later means rewriting every stylesheet, even scriptably.

If this proceeds, the order I'd suggest: fix the two `@dui/core` class-name
couplings first (they are bugs regardless), decide shadow versus light DOM
before converting anything else, brand the prop-bag types, then work through the
remaining components. `data-table` is now the only one whose shape is still
unmeasured — its prop-bag surface may exceed the component, and nothing in these
four conversions predicts that either way.

---

## 12. Known problems with this experiment

- **Three components, and `data-table` is still untouched.** Select, tabs and
  toast are converted and measured. `data-table` — state larger than the
  component, and a prop-bag surface that may exceed it — is inference, not
  measurement.
- **Toast is not finished.** Swipe-to-dismiss (263 lines), the region hotkey and
  focus-restore machinery, and `toast.promise()` were not converted, so the
  696-line figure understates the real total. None of them look structurally
  different from what did convert, but that is a judgement, not a result.
- **Toast has no pixel-parity number**, unlike the other conversions. The two
  implementations generate different DOM by design — that is the whole point of
  the inversion — so an identical-markup comparison is not available. Its
  verification is behavioural: stack indices, before-heights, timer pause and
  resume, dismissal reasons.
- **The light-DOM variant was tested on select only**, and only for the states
  the probe page renders. A component that slots consumer content would exercise
  the leakage question much harder than select does.
- **Tabs' parity was measured against a library I had just fixed.** The
  import-order bugs in section 8.5 meant the library's tabs were non-functional
  when the comparison began. The fix is one line and independently A/B'd, but
  the baseline is not the code as it shipped.
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

| File                                  | What it shows                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `evidence/01-closed-comparison.png`   | Library and owned selects paired under identical markup                                 |
| `evidence/02-step4-changes.png`       | The three consumer changes live                                                         |
| `evidence/03-three-approaches.png`    | 4x. Top: external CSS. Middle: copied subclass. Bottom: owned file.                     |
| `evidence/04-tabs-comparison.png`     | Library and owned tabs, horizontal and vertical, under identical markup                 |
| `evidence/05-cascade-fix.png`         | The unreachable-knob fix: each component plain, and with a consumer override            |
| `evidence/06-light-dom-three-way.png` | Library, owned-shadow and owned-light selects, plus the same restyle written three ways |
| `evidence/07-toast-collapsed.png`     | Five toasts stacked, two past `max-visible` faded out                                   |
| `evidence/08-toast-expanded.png`      | The same stack fanned out on hover, timers paused                                       |
| `evidence/09-toast-types.png`         | Type icon, description and close button on an error toast                               |

Measured parity, from commit `3cd852e`:

- 7 of 7 closed-state pairs: **0 differing pixels**
- Open state, short list (inner-aligned): **0 differing pixels**, popup geometry
  identical to 0.1px
- Open state, long list (anchored): **0 differing pixels**, identical
  `scrollTop`
- A control run of the library against itself confirmed the harness is
  deterministic before those zeros were trusted

Light DOM, from commit `8471b6f`:

- Owned-light against owned-shadow, 4 rows at 3x: **0 differing pixels** each

Toast has no pixel number by design — the two implementations generate different
DOM, which is the point of the inversion. It was verified behaviourally instead;
see [section 10](#10-toast--the-case-expected-to-break-the-model).

## Running the demo

```bash
deno task dev
```

- `http://localhost:4040/spike-headless.html` — select and tabs, paired against
  the library versions
- `http://localhost:4040/light-dom-probe.html` — library, owned-shadow and
  owned-light selects side by side
- `http://localhost:4040/toast-probe.html` — the headless toast; buttons post
  records, hover the stack to expand and pause
- `http://localhost:4040/cascade-probe.html` — the unreachable-knob fix, each
  component plain and with a consumer override
- `http://localhost:4040/spike-eject.html` — the previous spike, for comparison
- `http://localhost:4040/context-order-probe.html` — reproduces the two library
  bugs from section 8.5 in isolation (revert commit `8da9dad` to see them fail)
