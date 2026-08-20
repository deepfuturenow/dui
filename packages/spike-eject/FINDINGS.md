# Findings: copying DUI's styled components into an app

This document reports the results of a throwaway experiment on the branch
`claude/implement-attached-plan-is0bxg`. Every claim in it was measured in a
browser against the running dev server. Nothing is estimated.

## Summary

The experiment tested whether DUI could adopt shadcn's model: keep behavior as a
dependency, and copy the styled layer into the app that uses it, where the app's
developers own and edit it.

**Recommendation: don't build an eject command yet. Fix a CSS bug first.**

The experiment produced three results:

1. **Copying works, and costs nothing in fidelity.** The copied select renders
   identically to the library's. Behavior, keyboard support, and positioning all
   still come from the dependency.

2. **Copying doesn't help with the changes people actually want.** You can
   restyle a copied component freely. You can't change its markup at all,
   because the base class seals every value its template needs. The experiment
   tried and failed to move a single icon.

3. **The problem that prompted the experiment isn't an ownership problem. It's a
   two-line CSS bug.** One property in the styled layer is declared in a place
   your app can't override. Move it, and apps can build the dense select
   themselves, with no copying.

Result 3 is the important one. It's covered in
[Result 3: the dense select
doesn't need copying at all](#result-3-the-dense-select-doesnt-need-copying-at-all).

## Terms used in this document

| Term         | Meaning                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Primitive    | An unstyled base class in the `@dui/primitives` package. It supplies markup, keyboard handling, and positioning.         |
| Styled layer | The subclass in `@dui/components` that adds appearance. It extends a primitive and appends a stylesheet.                 |
| Eject        | Copy a styled component out of the library and into an app, so the app's developers own the file.                        |
| Shadow DOM   | A component's private DOM tree. Your app's CSS selectors can't reach inside it.                                          |
| Part         | An element a component explicitly publishes for outside styling, using `part="name"`. You target it with `::part(name)`. |
| `:host`      | A selector for the component's own outer element, used from inside its stylesheet.                                       |

## What the code looks like today

### Select is one class, not a set of components

The experiment expected to find `dui-select-trigger`, `dui-select-item`, and
similar sub-components. There are none. `DuiSelectPrimitive` (545 lines) renders
the trigger, the popup, the list, and every option into a single shadow DOM tree
from one `render()` method.

This means there was nothing to eject except select itself, plus the two
components its template depends on.

### The styled layer is already shaped like a shadcn file

`packages/components/src/select/select.ts` is 196 lines. Of those, 184 are CSS.
The remaining code is:

```ts
export class DuiSelect extends DuiSelectPrimitive {
  static override styles = [...DuiSelectPrimitive.styles, styles];
}

customElements.define(DuiSelect.tagName, DuiSelect);
```

That's the whole file. Ejecting it is a copy-paste. It doesn't give an app
anything it couldn't already do, which is why result 2 matters so much.

### Other facts worth knowing before you read further

| Topic                                          | What's true today                                                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`                                         | Not a property. `size="xs"`, `size="sm"`, and so on are plain HTML attributes matched by `:host([size="..."])` CSS. Nothing declares or validates them. |
| Tag names                                      | `static tagName = "dui-select"` is defined on the _primitive_, so any subclass inherits it.                                                             |
| Hidden dependencies                            | The primitive's template writes `<dui-icon>` and `<dui-scroll-area>` directly. They aren't slots and can't be swapped.                                  |
| Published parts                                | The primitive publishes 10 parts. The docs registry documents 2 of them.                                                                                |
| `defineComponents()` and `static dependencies` | Don't exist in this codebase. Registration is a plain `customElements.define()` call.                                                                   |
| `applyTheme()`                                 | Adds a document-level stylesheet of CSS variables. It never inspects classes or tag names, so it works with copied components unchanged.                |
| Portal style lookup                            | Doesn't exist. The popup renders in the component's own shadow DOM using the native `popover` attribute, so no cross-tree style lookup is involved.     |

## Result 1: the copy is faithful

### What was copied

```
packages/spike-eject/src/components/dui/
├── select.ts        283 lines   the copied component
├── icon.ts           12 lines   required by select's template
├── scroll-area.ts    49 lines   required by select's template
└── _install.ts       17 lines   design token injection
```

Breakdown of `select.ts`:

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
now owns, will never edit, and has to keep in sync.

### How fidelity was verified

The demo page renders the copied select and the library select from identical
markup, switched by a `?impl=library` URL parameter. Both were screenshotted and
compared pixel by pixel.

**Result: 0 differing pixels** across the whole component area.

Keyboard behavior was also checked in the browser: <kbd>Down arrow</kbd> then
<kbd>Enter</kbd> changes the value and closes the popup, exactly as before.

### One bug this surfaced

The library's styled select doesn't import `<dui-icon>` or `<dui-scroll-area>`,
even though its primitive's template renders both. It only works today because
apps happen to import them by other routes. Rendered on a page that imports
nothing else, the library select's dropdown arrow doesn't upgrade and draws at
the wrong size.

The copied version imports both explicitly, so it doesn't have this bug.

## Result 2: you can restyle a copy, but you can't reshape it

The experiment made two changes to the copied file. The first went well. The
second was impossible.

### Change 1: add a denser size

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

This was the good case. You open one file, add a selector, and you're done.

Two caveats, though:

- It went this smoothly only because `size` isn't a declared property. If sizes
  were a typed union, you'd also have to widen that type, in the primitive,
  which the app doesn't own.
- Three of the four blocks don't need a copy at all. You can write them in your
  app's stylesheet today. Only the `.Icon` block requires one, and that's a bug.
  See [Result 3](#result-3-the-dense-select-doesnt-need-copying-at-all).

### Change 2: move the dropdown arrow to the left

This change requires editing markup, not CSS. In shadcn, you'd move a JSX
element. Here, you can't.

To emit different markup, you override `render()`. But `render()` in Lit is
all-or-nothing: you can't re-emit one branch and inherit the rest. And every
value the primitive's template uses is a JavaScript private field, which
subclasses can't access.

`experiments/attempted-render-override.ts` contains the attempt. Running
`deno check` on it produces **11 errors, and that's only for the trigger half of
the template**:

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
private ones include all of its state, all of its event handlers, its
positioning controller, its form-association object, and both generated element
IDs. None are `protected`.

So overriding `render()` means reimplementing the other 539 lines of the
primitive. At that point behavior is no longer a dependency, and the whole model
stops making sense.

#### What was implemented instead

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

It works. It's also harder to read than the `::part()` code an app would write
without copying anything, which defeats the purpose of copying.

Reordering with `row-reverse` is legitimate. Replacing the icon isn't: the SVG
is hardcoded in the primitive's template, so the only option is to hide it and
paint over it. That worked only because of an implementation detail. The SVG is
a light-DOM child of `<dui-icon>`, so it sits in select's own shadow tree where
the copied stylesheet can reach it. If the primitive had put the SVG inside
`<dui-icon>`'s shadow DOM, there'd be no way to do this at all.

### Other friction worth recording

| Issue                                                 | Effect                                                                                                                                                                                                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Copied CSS targets undocumented class names           | `.Trigger`, `.Icon`, `.Listbox`, `.Value`, `.Item`, `.Popup`, and `.ItemIndicator` are internal names in someone else's shadow DOM. They aren't parts and aren't documented.                                                                                 |
| `:host([attr])` repetition                            | Each variant needs the prefix repeated once per element. One density change took four blocks.                                                                                                                                                                |
| Tag names collide by inheritance                      | See [Registering a copied component](#registering-a-copied-component).                                                                                                                                                                                       |
| Backticks are illegal inside a `css` template literal | You can't reference code identifiers in comments the normal way. This broke one build during the experiment.                                                                                                                                                 |
| `deno fmt` rewrites copied CSS                        | Running the formatter once changed 9 lines of the copied block: comment indentation, one split declaration pair, one rewrapped `box-shadow`. Appearance is unaffected, but the copy no longer matches upstream byte for byte, which diff tooling would need. |

## Result 3: the dense select doesn't need copying at all

This section covers the change that prompted the whole investigation.

### What you can do from an app today

Without copying anything, an app can style select from outside using CSS
variables and `::part()`. Here's the complete stylesheet, from
`src/external-compact.css`:

```css
/* Menu rows. These work. */
dui-select[data-density="compact"] {
  --select-item-font-size: var(--text-2xs);
  --select-item-padding-y: var(--space-0_5);
  --select-item-icon-size: var(--space-2_5);
}

/* The trigger box. This works, because `trigger` is a published part. */
dui-select[data-density="compact"]::part(trigger) {
  height: var(--component-height-xxs);
  gap: var(--space-1);
  padding: var(--space-0_5) var(--space-0_5) var(--space-0_5) var(--space-1_5);
  border-radius: calc(var(--radius-md) * 0.6);
  font-size: var(--text-2xs);
  line-height: var(--text-2xs--line-height);
}

/* Menu padding. This works, because `listbox` is a published part. */
dui-select[data-density="compact"]::part(listbox) {
  padding: var(--space-0_5);
}

/* This one does nothing. See below. */
dui-select[data-density="compact"] {
  --icon-size: var(--space-2_5);
}
```

Everything works except the last rule. The trigger shrinks. The arrow doesn't.

### Why you can't resize the dropdown arrow

The arrow's size comes from a CSS variable named `--icon-size`. The styled layer
sets it like this:

```css
.Icon {
  --icon-size: var(--space-4);
}
```

`.Icon` is an element _inside_ the component's shadow DOM.

CSS variables you set from outside a component do inherit into its shadow DOM.
But a value set directly on an inner element always beats an inherited one. So
your app's `--icon-size` reaches the component and is then overridden before it
gets to the arrow.

There's no other way in. The `.Icon` element publishes no part, so `::part()`
can't select it. And `::part(trigger) dui-icon` isn't valid CSS, because you
can't put a descendant selector after `::part()`.

These are the values measured in the browser on the external-CSS path:

| Measurement                                | Value      | What it shows                               |
| ------------------------------------------ | ---------- | ------------------------------------------- |
| `::part(trigger)` height                   | `20px`     | The part rule works.                        |
| `--select-item-font-size` on the component | `0.625rem` | An app's value beats a `:host` declaration. |
| Menu row font size inside the shadow DOM   | `10px`     | And it reaches the elements that use it.    |
| `--icon-size` on the component             | `0.625rem` | The app's value arrives...                  |
| `--icon-size` on the inner `.Icon` element | `1rem`     | ...and is overridden here.                  |
| Arrow width                                | `16px`     | Unchanged. This is the gap.                 |

Compare rows 2 and 4. The same technique works for one variable and fails for
the other. The only difference is where the styled layer declares them: one on
`:host`, one on an inner element.

`evidence/06-compact-library-vs-ejected.png` shows the visible result at 4x
zoom. The top row is the external-CSS path, with an oversized arrow crowding a
shrunken box. The bottom row is the copied component.

### The fix

Move the declaration from the inner element to `:host`:

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

This was applied and measured, not just proposed. With it in place, the arrow
drops from `16px` to `10px`, and the external-CSS path matches the copied
component at **0 differing pixels**.

`evidence/07-onelinefix-library-vs-ejected.png` is the same comparison after the
fix. Both rows are now identical. The change was reverted afterwards.

### What this means

The one thing that justified copying 361 lines is a misplaced CSS declaration.
Fixing it costs two lines and requires no command-line tool, no changes to the
primitives, no diff tooling, and nothing for app developers to maintain.

It also suggests a different diagnosis. The problem may not be _"apps need to
own the file."_ It may be _"the styled layer declares some of its adjustable
values where apps can't reach them."_ Select's menu-row variables are already
declared correctly on `:host`. Its trigger icon isn't. That looks like an
oversight, not a design decision.

## Registering a copied component

A copied component registers under the same tag name as the library's, because
`tagName` is inherited from the primitive.

### Importing the library version afterwards throws an error

The demo page tests this at runtime. Output from the running page:

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

So if an app copies select and then imports `@dui/components` anywhere, through
the `all.ts` barrel file or through a template that uses select, the failure
breaks the entire module, not just select.

There's no way to opt out. `customElements.define()` has no replace mode, and
the library calls it unconditionally.

### The alternative

Register under a different tag name, such as `app-select`. This avoids the
collision, but every call site has to change, and the copied component is no
longer a drop-in replacement. You also can't replace select inside a template
that renders it internally.

The experiment used `dui-select`, as the brief specified.

## What happens when the library updates

### Adding something to a primitive is safe

The experiment added an `aria-required` attribute to the primitive's trigger.

**The copied component picked it up with no changes.** This was verified in the
DOM, with 0 differing pixels and a clean type check. Accessibility and behavior
fixes flow through the dependency as intended. This is a real advantage over
copying the whole component.

### Renaming something in a primitive breaks copies silently

The experiment renamed the primitive's internal `.Trigger` class and its
`trigger` part.

Nothing reported a problem. `deno check` passed. `deno lint` passed. The browser
console was empty. The copied select simply lost its border, background,
padding, height, focus ring, and every size variant at once, rendering as
unstyled text. See `evidence/04-after-upstream-rename.png`.

Two details make this worse than a clean break:

- **The breakage was partial.** The icon-replacement CSS survived, because it
  targets `.Icon`, which wasn't renamed. The repositioning CSS died, because it
  targets `.Trigger`. A half-styled component is harder to diagnose than a fully
  broken one.
- **No tool can catch it.** The dependency is one string matching another string
  across a repository boundary, through class names that no contract covers.

The primitive was reverted, and restoration was confirmed with a 0-pixel diff.

### What a diff command would need

The experiment made a realistic 4-line polish change to the library's select
styles: a softer hover color, one padding step, and an inset highlight.

A plain two-way diff between the library's current file and the app's copy
prints **75 changed lines, only 4 of which are the actual update**. The other 71
are the app's own work, shown as deletions the app is invited to undo. That
output is actively misleading.

A useful diff command needs three inputs:

1. The library's current styles.
2. **The library's styles at the moment the app copied them.** This doesn't
   exist today. It has to be recorded at copy time as a version and a content
   hash, either in the copied file's header or in a lockfile.
3. The app's copy as it stands now.

It would then show the difference between inputs 1 and 2, offered as a patch to
apply to input 3, flagging conflicts only where the app edited the same rules.
That's a three-way merge, so no new algorithm is needed. But input 2 has to
exist from the first day.

Two less obvious requirements:

- **Rule-level diffing, not line-level.** The app's formatter rewrites the
  copied block on its first commit, so a line-based diff shows changes that
  aren't real.
- **A separate version pin for the primitive.** The rename described above is
  invisible to any diff of the styled layer, because the break lives in
  `@dui/primitives`. Copying the styled layer doesn't insulate an app from
  primitive updates. It removes the layer that used to absorb them.

## What app developers had to learn that isn't documented

To make the two changes, the app had to depend on the following. Only the last
row is documented.

| Knowledge required                                                                                                | Documented?                                                                             |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Internal class names: `.Trigger`, `.Icon`, `.Listbox`, `.Value`, `.Item`, `.Popup`, `.ItemIndicator`              | No                                                                                      |
| That `--select-item-font-size`, `--select-item-padding-y`, and `--select-item-icon-size` control menu row density | No. The select registry entry lists no CSS properties at all.                           |
| That the primitive renders `<dui-icon>` and `<dui-scroll-area>` by tag name, and that both must be registered     | No. The library's own styled select doesn't import them either.                         |
| That the arrow's SVG is a light-DOM child, and therefore reachable from the component's stylesheet                | No. This is what made change 2 possible at all, and it's an accident of implementation. |
| That `render()` can't be overridden                                                                               | No. Nothing warns you before you write the file.                                        |
| Which parts exist                                                                                                 | Partly. The primitive publishes 10; the registry documents 2.                           |
| The six public properties, and the `size` attribute values                                                        | Yes                                                                                     |

Almost everything a copied file depends on is undocumented. Combined with the
silent-breakage result above, that means an eject command would ship files whose
entire dependency surface is unspecified and can change in a patch release.

## Recommendation

Don't build an eject command yet. Do these in order.

1. **Fix the `--icon-size` declaration.** Two lines. This closes the gap that
   prompted the investigation and needs nothing else built.

2. **Audit other components for the same mistake.** Look for adjustable values
   declared on inner elements rather than `:host`. If this pattern is common,
   most of the pressure to copy files disappears, and no command-line tool is
   needed.

3. **If you still want copying after that, add render hooks to the primitives
   first.** Split `render()` into `renderTrigger()`, `renderValue()`,
   `renderIcon()`, `renderPopup()`, and `renderItem(option, index)`, and change
   the fields those need from private to protected: `selectedOption`,
   `displayValue`, `isOpen`, `highlightedIndex`, `triggerId`, `listboxId`, and
   the trigger event handlers.

   This is the change that decides whether copying is viable. Without it,
   copying gives an app no control over markup, which is the main thing people
   copy files to get. It also has a real cost: those hooks become public API,
   and the current private fields are doing useful work keeping primitives easy
   to refactor.

4. **Publish the styling contract.** Either promote the internal class names to
   documented, frozen part names, or have primitives expose `data-*` hooks they
   commit to keeping.

5. **Record the copy source at copy time.** A version and a content hash, so a
   three-way diff is possible. This is cheap and worth doing regardless.

6. **Only then, build the command.** Restrict it to components whose primitives
   have the hooks from step 3. Copying a sealed primitive should be refused, not
   shipped.

### Comparing the two approaches

Both produce the same dense select. The external-CSS column assumes the two-line
fix from step 1.

|                                 | Styling from your app                       | Copying the file                                |
| ------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| Lines you write                 | 24                                          | 27                                              |
| Reaches the target              | Yes, after the two-line fix. No, before it. | Yes                                             |
| Where the code lives            | Your app's stylesheet                       | Alongside the component's other styles          |
| Needs a library change          | Two lines, once, for everyone               | No                                              |
| Survives a primitive rename     | Yes for `::part()`; no for CSS variables    | No. Silent, total breakage.                     |
| Gets library style improvements | Automatically                               | Only with diff tooling that doesn't exist       |
| Ongoing cost                    | 24 lines                                    | 361 lines copied, 78 of them permanently unused |

Note the fifth row. `::part(trigger)` is a published contract and survived the
rename that destroyed the copied file. Copying trades a small, documented,
stable dependency for a large, undocumented, unstable one.

## Known problems with this experiment

Two are specific to the sandbox it ran in and don't affect the conclusions:

- **`jsr.io` is blocked by network policy**, so `jsr:@std/path` and
  `jsr:@std/fs` can't be fetched. Both are imported by `packages/docs/serve.ts`
  and the build scripts, so neither `deno check` nor the dev server would start.
  `vendor/std-path.ts` and `vendor/std-fs.ts` work around this by re-exporting
  `node:path` and Deno's filesystem API, mapped over the `jsr:` specifiers by
  two entries in the root `deno.json`. **Delete those two entries and the
  `vendor/` directory on any machine that can reach jsr.io.** Deno itself also
  wasn't installed and was installed from npm.
- **The `dui-primitives` repository wasn't present.** The import map expects it
  at `../dui-primitives`, so it was cloned there.

One is a real change that any machine needs:

- **`packages/docs/serve.ts` now names its bundle outputs explicitly.** Adding
  an entry point outside `packages/docs/src` changed the directory esbuild
  computes paths from, which renamed every existing bundle. `/index.js` became
  `/docs/src/index.js`, and every docs URL returned 404. Naming the outputs pins
  them. All six URLs were verified unchanged.

  This is a latent bug the experiment surfaced rather than caused. Any future
  entry point outside `src/` hits it.

  The alternative was a separate dev server inside `packages/spike-eject`, which
  touches no existing files but duplicates about 70 lines of the import
  resolver. It was rejected as more code for a throwaway branch, and the brief
  asked to reuse the docs dev server.

No files in `@dui/primitives` or `@dui/core` were changed, apart from the two
deliberate update probes, both reverted.

The `experiments/` directory is excluded from type checking in the package's
`deno.json`, because it contains a file that's supposed to fail. `deno check`
passes at the repository root, and `deno task dev` starts and serves all six
pages.

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
