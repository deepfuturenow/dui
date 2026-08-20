# Findings: copying DUI's styled components into an app

This document reports the results of a throwaway experiment on the branch
`claude/implement-attached-plan-is0bxg`. Every claim in it was measured, either
in a browser against the running dev server or from this repository's git
history. Nothing is estimated.

## Summary

The experiment tested the model described as option B in the initial evaluation:
keep behavior as a dependency (`@dui/primitives`), and copy the styled layer
into the app that uses it, where the app's developers own and edit it. The
question it had to answer was whether editing a copied `select.ts` feels like
editing shadcn's `select.tsx`, or whether you end up fighting the primitive's
render tree.

**It splits cleanly by the kind of change, and the split is the finding.**

| Kind of change                                 | Copying a file                             | Styling from outside              |
| ---------------------------------------------- | ------------------------------------------ | --------------------------------- |
| Adjust something the library anticipated       | Works                                      | Works                             |
| Adjust something the library didn't anticipate | **Works. 27 lines, one file, no release.** | Fails. Requires a library change. |
| Change the component's markup                  | **Fails completely.**                      | Fails completely.                 |

Row 2 is a large, real win, and the first version of this document undersold it.
Row 3 is where the model runs out, and no amount of CSS strategy fixes it.

**Recommendation: pursue option B, but treat protected render hooks in the
primitives as the whole project, not a follow-up.** Without them, copying gives
your app ownership of appearance and no ownership of structure — which means a
consumer who needs an unanticipated _shape_ still files a library request, and
the anticipation burden survives intact for exactly the cases where it hurts
most.

A separate, smaller CSS fix is described in
[Why you can't resize the dropdown arrow](#why-you-cant-resize-the-dropdown-arrow).
It's worth making. It is not an alternative to option B, and an earlier draft of
this document was wrong to present it as one. See
[A correction to the first draft](#a-correction-to-the-first-draft).

## The two problems, kept separate

The initial evaluation separates two complaints that usually get merged. This
document uses that split throughout, because the experiment produces a different
answer for each.

**Locality.** Your customization lives far from the thing it customizes. Making
select denser means editing a stylesheet somewhere else in your app, expressed
through an indirection layer you have to learn, rather than editing the
component.

**Anticipation burden.** The library has to pre-build every adjustment any
consumer might want. When an adjustment isn't there, you can't make it at all
without changing the library.

Styling from outside with `::part()` and CSS variables addresses **neither**. It
is the status quo, and it is what prompted this investigation. The rest of this
document treats "you can reach it with `::part()`" as a description of today's
pain, not as a solution.

## What an unanticipated adjustment costs today

This is measured from this repository's history, not argued.

Of 37 non-release commits touching `packages/components`, **11 add or fix an
adjustment knob** — roughly 30% of all component work.

The clearest case is the `size` rollout on 3 and 4 August: **14 commits over two
days, 31 files, 1,198 insertions, 430 deletions.** It spans four areas:

| Area                             | What had to change                                                       |
| -------------------------------- | ------------------------------------------------------------------------ |
| `packages/components`            | The styled CSS for ten components                                        |
| `packages/docs`                  | The component registry plus eight demo pages                             |
| `skills/`                        | Regenerated reference material                                           |
| `dui-primitives` (separate repo) | A coordinated `forwardProperties` change, per commit `69df8f9`'s message |

Then a version bump and an npm publish.

Commit `69df8f9`, "feat(select,combobox): size variants with chevron + popup-row
scaling", is **the same change this experiment made in the copied file**. In the
library it cost 141 insertions across two components and needed the coordinated
change in the other repository. The docs tax alone, commit `694fcef`, was 163
insertions across the registry, eight demo pages, and the regenerated skill
references.

In the copied file, the same capability was **27 lines in one file**, with no
cross-repo coordination, no registry entry, no demo page, no regenerated
references, and no release.

The line ratio understates the difference. The processes aren't comparable. A
library knob has to be right for every component, every size, and every future
consumer, and it has to be documented before it ships. An app's copy has to be
right for that app.

This is the anticipation burden with a number attached, and it is the strongest
argument for option B in this document.

## Terms used in this document

| Term         | Meaning                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| Primitive    | An unstyled base class in `@dui/primitives`. It supplies markup, keyboard handling, and positioning.          |
| Styled layer | The subclass in `@dui/components` that adds appearance. It extends a primitive and appends a stylesheet.      |
| Eject        | Copy a styled component out of the library into an app, so the app's developers own the file.                 |
| Shadow DOM   | A component's private DOM tree. Your app's CSS selectors can't reach inside it.                               |
| Part         | An element a component publishes for outside styling, using `part="name"`. You target it with `::part(name)`. |
| `:host`      | A selector for the component's own outer element, used from inside its stylesheet.                            |

## Answering the open question: is the primitives split live?

Yes, and the situation is more favourable to option B than the initial
evaluation assumed.

`DuiSelectPrimitive` exists in a separate repository, `dui-primitives`, reached
through the root import map. And `packages/components/src/select/select.ts` is
**already exactly the file option B proposes to copy**. It's 196 lines: 184 of
CSS, and then this:

```ts
export class DuiSelect extends DuiSelectPrimitive {
  static override styles = [...DuiSelectPrimitive.styles, styles];
}

customElements.define(DuiSelect.tagName, DuiSelect);
```

That's the whole styled layer. `defineComponents()` and `static dependencies`
don't exist in this codebase; registration is one plain call.

Two consequences:

- **A `dui add select` command is nearly free to build.** There's no
  transformation step. The file the CLI would emit already exists in the shape
  it needs to be in.
- **Because it's free to build, the CLI is not the decision.** The decision is
  whether the emitted file is editable enough to be worth owning. That's what
  the rest of this document measures.

One structural surprise: select is **one class**, not a set of sub-components.
`DuiSelectPrimitive` (545 lines) renders the trigger, popup, list, and every
option into a single shadow DOM tree from one `render()` method. There is no
`dui-select-trigger` or `dui-select-item` to copy or to compose.

## Result 1: the copy is faithful

### What was copied

```
packages/spike-eject/src/components/dui/
├── select.ts        283 lines   the copied component
├── icon.ts           12 lines   required by select's template
├── scroll-area.ts    49 lines   required by select's template
└── _install.ts       17 lines   design token injection
```

| Category                                   |   Lines |
| ------------------------------------------ | ------: |
| CSS copied from `@dui/components`          |     187 |
| New size variant added by the app          |      27 |
| New icon-position variant added by the app |      40 |
| Class declaration and registration         |       7 |
| Imports and header comment                 |      20 |
| **Total**                                  | **283** |

Across all four files: **361 lines**, of which **236 are an unmodified copy**.
The 78 lines in `icon.ts`, `scroll-area.ts`, and `_install.ts` are files the app
now owns and will probably never edit.

### How fidelity was verified

The demo page renders the copied select and the library select from identical
markup, switched by a `?impl=library` URL parameter. Both were screenshotted and
compared pixel by pixel.

**Result: 0 differing pixels** across the whole component area.

Keyboard behavior was also checked: <kbd>Down arrow</kbd> then <kbd>Enter</kbd>
changes the value and closes the popup, exactly as before. Positioning, focus
management, and form association all still come from the dependency.

This is worth stating plainly because it's the thing the April merge document
worried about. Copying the styled layer does **not** copy 500 lines of keyboard
handling and floating-UI wiring. It copies 184 lines of CSS. The fork-divergence
risk that ruled out option D doesn't apply here.

### One bug this surfaced

The library's styled select doesn't import `<dui-icon>` or `<dui-scroll-area>`,
even though its primitive's template renders both. It works today only because
apps import them by other routes. On a page that imports nothing else, the
library select's dropdown arrow doesn't upgrade and draws at the wrong size. The
copied version imports both explicitly.

## Result 2: locality is real for appearance

Adding `size="compact"`, smaller than the library's smallest size, took 27 lines
in four blocks:

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
:host([size="compact"]) .Icon {
  --icon-size: var(--space-2_5);
}
:host([size="compact"]) .Listbox {
  padding: var(--space-0_5);
}
```

This was the good case. You open one file, add a selector, and you're done. No
round trip, no discovering which knob exists, no release.

Compare that with the same capability shipped as a library knob: 141 insertions,
two components, a coordinated change in another repository, and a docs tax. See
[What an unanticipated adjustment costs
today](#what-an-unanticipated-adjustment-costs-today).

Two honest caveats:

- It went this smoothly partly because `size` isn't a declared property, just an
  attribute matched by CSS. If sizes were a typed union you'd also have to widen
  that type, in the primitive, which the app doesn't own.
- You're still writing `:host([size="compact"]) .Trigger` selectors, not editing
  a class string. Locality improves. The amount of CSS architecture you have to
  know does not. This is the Tailwind half of shadcn's advantage, and copying
  files doesn't reproduce it.

## Result 3: you cannot change the markup at all

Moving the dropdown arrow to the leading edge requires editing markup. In
shadcn, you move a JSX element. Here, you can't.

To emit different markup you override `render()`. But `render()` in Lit is
all-or-nothing: you can't re-emit one branch and inherit the rest. And every
value the primitive's template uses is a JavaScript private field, which
subclasses can't access.

`experiments/attempted-render-override.ts` contains the attempt. Running
`deno check` on it produces **11 errors, and that's only the trigger half of the
template**:

```
TS18013: Property '#selectedOption' is not accessible outside class 'DuiSelectPrimitive'
TS18013: Property '#triggerId' ...
TS18013: Property '#popup' ...            (x2)
TS18013: Property '#listboxId' ...        (x2)
TS18013: Property '#highlightedIndex' ... (x2)
TS18013: Property '#onTriggerClick' ...
TS18013: Property '#onTriggerKeyDown' ...
TS18013: Property '#displayValue' ...
```

Reproducing the popup half would add four more.

`DuiSelectPrimitive` has **6 public members** and **17 private fields**. The
private ones include all state, all event handlers, the positioning controller,
the form-association object, and both generated element IDs. None are
`protected`.

So overriding `render()` means reimplementing the other 539 lines. At that point
behavior is no longer a dependency, and the model collapses into option D, which
was already ruled out.

### Why this matters more than it first appears

**For markup changes, copying the file removes none of the anticipation
burden.** An app that wants a leading chevron, or a count badge in the trigger,
still has to ask the library for it — exactly as it does today. Ejecting buys
locality for appearance and nothing at all for structure.

That is the precise limit of option B as it stands. It is not a partial win on
row 3 of the summary table; it is a total loss.

### What was implemented instead

A CSS workaround, because that's what an app developer would actually do:

```css
:host([leading-chevron]) .Trigger {
  flex-direction: row-reverse;
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-2);
}
/* Hide the primitive's arrow ... */
:host([leading-chevron]) .Icon svg {
  display: none;
}
/* ... and repaint the box with a masked data URI. */
:host([leading-chevron]) .Icon dui-icon {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg ...%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}
```

It works, and it's worse than what the app was trying to escape.

Reordering with `row-reverse` is legitimate. Replacing the icon isn't: the SVG
is hardcoded in the primitive's template, so the only option is to hide it and
paint over it. That worked only because of an implementation detail — the SVG is
a light-DOM child of `<dui-icon>`, so it sits in select's own shadow tree where
the copied stylesheet can reach it. Had the primitive put the SVG inside
`<dui-icon>`'s shadow DOM, there would have been no route at all.

### A note on option C

That detail is a small data point for the light-DOM option. In light DOM, every
part of this change would have been reachable with ordinary selectors, and no
copying would have been needed for it.

But light DOM solves _reach_, not _reshape_. Moving an icon becomes possible;
adding a count badge that isn't in the template still isn't. Any approach that
leaves the template with the library hits row 3 of the summary table. **Only
render hooks or full template ownership clear it.**

## Why you can't resize the dropdown arrow

This section describes a genuine CSS bug. Read the correction after it before
weighing it.

An app styling select from outside can shrink the trigger box with
`::part(trigger)` and the menu rows with the `--select-item-*` variables. It
can't shrink the arrow.

The arrow's size comes from a CSS variable named `--icon-size`, which the styled
layer sets on an element **inside** the shadow DOM:

```css
.Icon {
  --icon-size: var(--space-4);
}
```

CSS variables you set from outside do inherit inward. But a value set directly
on an inner element beats an inherited one, so your value is overridden one step
before it reaches the arrow. There's no other route: `.Icon` publishes no part,
and `::part(trigger) dui-icon` isn't valid CSS, because you can't put a
descendant selector after `::part()`.

Measured in the browser:

| Measurement                                | Value      | What it shows                               |
| ------------------------------------------ | ---------- | ------------------------------------------- |
| `::part(trigger)` height                   | `20px`     | The part rule works.                        |
| `--select-item-font-size` on the component | `0.625rem` | An app's value beats a `:host` declaration. |
| Menu row font size inside the shadow DOM   | `10px`     | And it reaches the elements that use it.    |
| `--icon-size` on the component             | `0.625rem` | The app's value arrives...                  |
| `--icon-size` on the inner `.Icon` element | `1rem`     | ...and is overridden here.                  |
| Arrow width                                | `16px`     | Unchanged.                                  |

Moving the declaration to `:host` reverses the outcome:

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

This was applied and measured. The arrow drops from `16px` to `10px`, and the
external-CSS path matches the copied component at **0 differing pixels**
(`evidence/07-onelinefix-library-vs-ejected.png`). The change was reverted.

### A correction to the first draft

The first version of this document led with that fix and recommended against
option B on the strength of it. That was wrong, for two reasons.

**It's the treadmill, not an exit from it.** The fix makes one previously
unreachable value reachable. The next unanticipated need is another library
round trip. Presenting "add the missing knob" as an alternative to changing the
distribution model assumes the set of needed knobs is finite and knowable, which
is the assumption the whole investigation is questioning.

**Those exact lines are 16 days old.** The
`:host([size="xs"]) .Icon
{ --icon-size: ... }` declarations the fix moves were
added by commit `69df8f9` on 3 August, as part of the size rollout. The
recommendation amounted to redoing a knob shipped two weeks earlier, slightly
differently.

The fix is still worth making — it's two lines and it removes a real gap. But it
belongs in a list of cheap cleanups, not at the head of a strategy
recommendation, and it says nothing about whether option B is the right
distribution model.

## Registering a copied component

A copied component registers under the same tag name as the library's, because
`static tagName = "dui-select"` is defined on the primitive and subclasses
inherit it.

### Importing the library version afterwards throws an error

Tested at runtime. Output from the running page:

```
tag "dui-select" owned by the copied class before the import: true
import("@dui/components/select") -> DOMException: Failed to execute 'define' on
  'CustomElementRegistry': the name "dui-select" has already been used with this registry
library module finished evaluating: false
tag "dui-select" still owned by the copied class after: true
```

The copied class keeps the tag, because the first registration wins. But the
error is thrown while the library's module is evaluating, which **stops that
module from finishing**. Anything after the import statement never runs.

So if an app copies select and then imports `@dui/components` anywhere — through
the `all.ts` barrel file, or through a template that renders select — the
failure breaks the entire module, not just select.

There's no way to opt out. `customElements.define()` has no replace mode, and
the library calls it unconditionally.

### The options, none of which are free

| Approach                                  | Cost                                                                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Register as `dui-select` anyway           | Any transitive `@dui/components` import breaks the app. Templates that render select internally are unusable.               |
| Register as `app-select`                  | Every call site changes. The copy is no longer a drop-in, and you still can't replace select inside a library template.     |
| Make the library's `define()` conditional | Smallest change, but it means the library silently accepts whatever registered first, so a stale copy wins with no warning. |

The experiment used `dui-select`, as the brief specified. If option B proceeds,
this needs a decision before the CLI exists, not after.

## What happens when the library updates

### Adding something to a primitive is safe

The experiment added an `aria-required` attribute to the primitive's trigger.
**The copied component picked it up with no changes**, verified in the DOM, with
0 differing pixels and a clean type check.

Accessibility and behavior fixes flow through the dependency as intended. This
is the core advantage of option B over option D, and it held.

### Renaming something in a primitive breaks copies silently

The experiment renamed the primitive's internal `.Trigger` class and its
`trigger` part.

Nothing reported a problem. `deno check` passed. `deno lint` passed. The console
was empty. The copied select lost its border, background, padding, height, focus
ring, and every size variant at once, rendering as unstyled text
(`evidence/04-after-upstream-rename.png`).

Two details make this worse than a clean break:

- **The breakage was partial.** The icon-replacement CSS survived, because it
  targets `.Icon`, which wasn't renamed. The repositioning CSS died, because it
  targets `.Trigger`. A half-styled component is harder to diagnose than a fully
  broken one.
- **No tool can catch it.** The dependency is one string matching another across
  a repository boundary, through class names that no contract covers.

The primitive was reverted, and restoration confirmed with a 0-pixel diff.

### What a diff command would need

A realistic 4-line polish change to the library's select styles produces a
two-way diff of **75 changed lines, only 4 of which are the update**. The other
71 are the app's own work, shown as deletions it's invited to undo. That output
is actively misleading, and matches what the shadcn community reports about
`--diff`.

A useful diff command needs three inputs:

1. The library's current styles.
2. **The library's styles at the moment the app copied them.** This doesn't
   exist today. It has to be recorded at copy time as a version and a content
   hash, in the copied file's header or a lockfile.
3. The app's copy as it stands.

It then shows the difference between 1 and 2 as a patch against 3, flagging
conflicts only where the app edited the same rules. That's a three-way merge, so
no new algorithm is needed — but input 2 must exist from the first day.

Two less obvious requirements:

- **Rule-level diffing, not line-level.** The app's formatter rewrites the
  copied block on its first commit. Running `deno fmt` once changed 9 lines of
  copied CSS: comment indentation, one split declaration pair, one rewrapped
  `box-shadow`. Appearance is unaffected, but a line-based diff would report
  changes that aren't real.
- **A separate version pin for the primitive.** The rename above is invisible to
  any diff of the styled layer, because the break lives in `@dui/primitives`.
  Copying doesn't insulate an app from primitive updates. It removes the layer
  that used to absorb them.

## What app developers had to learn that isn't documented

To make the two changes, the app had to depend on the following. Only the last
row is documented.

| Knowledge required                                                                                                | Documented?                                                                               |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Internal class names: `.Trigger`, `.Icon`, `.Listbox`, `.Value`, `.Item`, `.Popup`, `.ItemIndicator`              | No                                                                                        |
| That `--select-item-font-size`, `--select-item-padding-y`, and `--select-item-icon-size` control menu row density | No. The select registry entry lists no CSS properties at all.                             |
| That the primitive renders `<dui-icon>` and `<dui-scroll-area>` by tag name, and both must be registered          | No. The library's own styled select doesn't import them either.                           |
| That the arrow's SVG is a light-DOM child, and therefore reachable                                                | No. This is what made the second change possible, and it's an accident of implementation. |
| That `render()` can't be overridden                                                                               | No. Nothing warns you before you write the file.                                          |
| Which parts exist                                                                                                 | Partly. The primitive publishes 10; the registry documents 2.                             |
| The six public properties, and the `size` attribute values                                                        | Yes                                                                                       |

Almost everything a copied file depends on is undocumented. Combined with the
silent-breakage result, an eject command today would ship files whose entire
dependency surface is unspecified and can change in a patch release.

Note that this cuts both ways. Under the status quo the same knowledge gap
exists, but it's the library author's problem rather than the app author's — and
in a one-consumer project those are the same person.

## Recommendation

**Pursue option B. Treat render hooks as the project, not a follow-up.**

The locality win in result 2 is real and the cost data justifies it. The limit
in result 3 is equally real, and it's the half that matters most for
unanticipated needs.

In order:

1. **Decide the render-hook question first, because everything else depends on
   it.** Split `render()` into `renderTrigger()`, `renderValue()`,
   `renderIcon()`, `renderPopup()`, and `renderItem(option, index)`, and promote
   the fields those need from private to protected: `selectedOption`,
   `displayValue`, `isOpen`, `highlightedIndex`, `triggerId`, `listboxId`, and
   the trigger handlers.

   This is not cheap. Those hooks become public API on the primitives, and the
   private fields are doing real work keeping primitives refactorable — as the
   rename probe demonstrated. But without them, option B ships locality for CSS
   and leaves the anticipation burden fully in place for markup.

2. **Before committing to step 1, classify your actual backlog.** Take the
   adjustments you've wanted and couldn't make, and sort them into "CSS only"
   and "needs different markup". That ratio decides the scope:

   - Mostly CSS: option B is worth shipping _without_ render hooks. The 27-lines
     versus 31-files comparison stands on its own.
   - Substantially markup: hooks first, or option B delivers half a solution and
     you'll be back here.

   This experiment can't produce that ratio. It tested one change of each kind
   because the brief asked for one of each.

3. **Settle the tag-name collision before building any CLI.** See
   [the options table](#the-options-none-of-which-are-free). This is a design
   decision with no free answer, and it's cheaper to make now than to migrate
   later.

4. **Publish the styling contract.** Either promote the internal class names to
   documented, frozen part names, or have primitives expose `data-*` hooks they
   commit to. Copied files depend on these whether or not they're documented.

5. **Record the copy source at copy time** — a version and a content hash — so a
   three-way diff is possible later. Cheap, and worth doing regardless of
   everything above.

6. **Build the CLI last, and keep it small.** The file it emits already exists
   in the right shape, so there's no transformation to write. Restrict it to
   components whose primitives have the hooks from step 1; copying a sealed
   primitive should be refused, not shipped.

Separately, and unrelated to the strategy: fix the `--icon-size` declaration
described [above](#why-you-cant-resize-the-dropdown-arrow), and check whether
other components declare adjustable values on inner elements rather than
`:host`. Two lines each, and it makes the status quo less painful while the
larger question is settled.

## Known problems with this experiment

- **It tested one component and two changes.** Select turned out to be
  monolithic, which is favourable to copying — there was nothing to compose. A
  component built from several elements might behave differently.
- **It can't tell you how often you need markup changes**, which is the number
  the recommendation actually turns on. See step 2.
- **The cost comparison isn't perfectly like-for-like.** The 31-file size
  rollout covered ten components and produced documented, reusable API; the
  27-line copy served one app. The docs and registry tax is partly the product,
  not overhead — `llms.txt` and the skill references are DUI's agent-readability
  story. But even per component the ratio is roughly four to one, and the
  release process is a categorical difference, not a scaling one.

Two environment issues, specific to the sandbox this ran in:

- **`jsr.io` is blocked by network policy**, so `jsr:@std/path` and
  `jsr:@std/fs` can't be fetched. Both are imported by `packages/docs/serve.ts`
  and the build scripts, so neither `deno check` nor the dev server would start.
  `vendor/std-path.ts` and `vendor/std-fs.ts` re-export `node:path` and Deno's
  filesystem API, mapped over the `jsr:` specifiers by two entries in the root
  `deno.json`. **Delete those entries and `vendor/` on any machine that can
  reach jsr.io.** Deno itself was installed from npm.
- **The `dui-primitives` repository wasn't present.** The import map expects it
  at `../dui-primitives`, so it was cloned there.

One real change that any machine needs:

- **`packages/docs/serve.ts` now names its bundle outputs explicitly.** Adding
  an entry point outside `packages/docs/src` changed the directory esbuild
  computes paths from, renaming every existing bundle: `/index.js` became
  `/docs/src/index.js`, and every docs URL returned 404. Naming the outputs pins
  them; all six URLs verified unchanged. This is a latent bug the experiment
  surfaced rather than caused.

No files in `@dui/primitives` or `@dui/core` were changed, apart from the two
deliberate update probes, both reverted. `deno check` passes at the repository
root, and `deno task dev` starts and serves all six pages.

## Evidence

Screenshots are in `evidence/`, captured from the running dev server with
headless Chromium at 1280x1000.

| File                                                 | What it shows                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `01-ejected-verbatim.png`, `01-library-baseline.png` | The copied and library selects under identical markup. 0 differing pixels.            |
| `02-consumer-changes.png`                            | Both app changes working: the denser size and the repositioned arrow.                 |
| `03-compact-popup-open.png`                          | The compact menu open, with scaled rows and the selected item aligned to the trigger. |
| `04-after-upstream-rename.png`                       | The silent, partial breakage after the primitive renamed `.Trigger`.                  |
| `05-library-external-part-way.png`                   | The external-CSS path.                                                                |
| `06-compact-library-vs-ejected.png`                  | 4x zoom. Top: external CSS. Bottom: copied component. The arrow is the gap.           |
| `07-onelinefix-library-vs-ejected.png`               | The same comparison after the two-line fix. 0 differing pixels.                       |

## Running the demo

```bash
deno task dev
```

Then open:

- `http://localhost:4040/spike-eject.html` for the copied select.
- `http://localhost:4040/spike-eject.html?impl=library` for the library select
  styled from outside with `::part()`.
