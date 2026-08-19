# Proposal: cross-package versioning between dui-primitives and dui

**Status: not adopted.** Written 2026-08-19 for future consideration. Nothing in this document
describes current behaviour — see §1 for what actually ships today.

**Problem in one line:** `@deepfuture/dui-components` pins `@deepfuture/dui-primitives` to an exact
version, so every primitives release requires rebuilding and republishing dui before consumers can
receive it.

---

## 1. Current behaviour

`scripts/build.ts:369` writes the primitives dependency as a bare version string:

```js
deps["@deepfuture/dui-primitives"] = primVer;   // no caret
```

`scripts/build.ts:373` does the same for templates → components:

```js
deps["@deepfuture/dui-components"] = version;   // no caret
```

The published artifact confirms it:

```json
"dependencies": {
  "@deepfuture/dui-primitives": "2.1.0",
  "lit": "^3.3.2",
  "@lit/context": "^1.1.3"
}
```

No `peerDependencies` are declared. All four published packages — components, templates, chart, map
— pin primitives exactly. Templates additionally pins components exactly.

Version state at time of writing: **components 2.1.0, primitives 2.2.0** — already drifted, which is
itself part of the problem (§3).

### Consequences

1. A primitives bug fix cannot reach consumers without a dui rebuild + republish, even when nothing
   in dui changed.
2. A consumer who installs `@deepfuture/dui-primitives` directly gets **two copies** if their range
   does not include the pinned version (§3).
3. "Which version of DUI am I on?" has no single answer.

---

## 2. Why the pin exists, and why it is defensible

The coupling between the layers is tighter than a normal package boundary.

**101 of 102 styled component source files never override `render()`.** The styled layer is almost
purely CSS appended to `static styles`. Every class selector it writes — `.DataTable`,
`.TableWindow`, `.Pagination`, `.EmptyRow`, `.PageButton`, and their equivalents across 22
components — targets DOM that the *primitive* renders.

So the interface between the two packages is not the primitive's public API. It is the primitive's
**private DOM structure**.

Rename `.TableWindow` in a primitives patch release and every styled table silently loses its
border. Nothing in either package's types, tests, or exports would notice. An exact pin makes that
impossible, which is a real protection and the reason not to change this casually.

---

## 3. Why the pin is also a problem

### 3.1 Duplicate installs for mixed consumers

A consumer using both layers — styled components plus the unstyled primitives — hits this:

```
their package.json:  "@deepfuture/dui-primitives": "^2.2.0"
components pins:     "@deepfuture/dui-primitives": "2.1.0"
```

Exact `2.1.0` and `^2.2.0` cannot overlap, so npm nests rather than dedupes and installs both.
Results:

- `DuiDataTable extends DuiDataTablePrimitive` resolves against copy A, while the consumer's
  `instanceof DuiDataTablePrimitive` checks copy B → `false`
- Two sets of `base` styles, two Lit `ReactiveElement` registrations
- Doubled bundle weight for the primitives layer

A caret range would let npm collapse both to a single install.

**Mitigating factor:** primitives do not self-register. Only `toast/toast-imperative.ts` calls
`customElements.define()`; every other primitive exports classes only, and the styled layer does the
defining. So duplicate copies do **not** produce a hard "tag name already used" crash — the failure
is quieter, which arguably makes it worse to diagnose.

### 3.2 Undeliverable primitives fixes

A security or correctness fix in primitives is stranded until dui cuts a release. For a solo
maintainer this is minutes of work, but it is unconditional — it applies even to releases where dui
itself has no changes.

### 3.3 Version drift

Components 2.1.0 depending on primitives 2.2.0 is legible to the maintainer and opaque to everyone
else.

---

## 4. Proposal

Two changes.

### 4.1 Caret ranges

```diff
- deps["@deepfuture/dui-primitives"] = primVer;
+ deps["@deepfuture/dui-primitives"] = `^${primVer}`;
```

```diff
- deps["@deepfuture/dui-components"] = version;
+ deps["@deepfuture/dui-components"] = `^${version}`;
```

`scripts/build.ts:369` and `:373`.

### 4.2 Lockstep version numbers

Both repos share one version number. DUI 2.3.0 means primitives 2.3.0 **and** components 2.3.0,
released together, even when one side is a no-op bump.

This is what makes `^` trivially correct rather than merely probable: within a major, the two are
guaranteed compatible because they were cut from the same moment.

### 4.3 The discipline this requires

The proposal is 90% a commitment and 10% a code change. It only holds if:

> **Primitives' internal DOM structure — element hierarchy and the class names the styled layer
> targets — is part of its public semver surface. Renaming `.TableWindow` is a major version bump,
> not a patch.**

This is already true in practice; it is simply written nowhere. Adopting this proposal means adding
that sentence to `dui-primitives/CLAUDE.md` and meaning it.

### 4.4 Safety net

A smoke test in dui CI that builds and renders the component set against the latest primitives minor
would catch structural drift if the discipline slips. Without it, the first sign of a violation is a
consumer bug report about missing borders.

### What this buys

| | Today | With the proposal |
| --- | --- | --- |
| Primitives patch reaches consumers | requires a dui release | automatically |
| Mixed-layer consumers | two nested copies | one deduped copy |
| "What version of DUI is this?" | two numbers | one |
| dui releases | on every primitives release | only when dui changes |

---

## 5. Alternatives considered and rejected

### `peerDependencies`

The npm-idiomatic way to express "there must be exactly one of these." Correctly solves §3.1.

Rejected because it makes consumers install and version primitives explicitly, when for most of them
primitives is an implementation detail they have never heard of. It exports an internal architectural
decision into every consumer's `package.json`.

### Bundle primitives into components

Guarantees internal consistency and removes the dependency entirely.

Rejected on two grounds: it *guarantees* the duplicate-copy problem for anyone who also uses the
unstyled layer, and it contradicts the policy stated in `scripts/build.ts`'s own header — "Don't
bundle (let consumer bundlers deduplicate Lit)."

### Single package with subpath exports

Publish one `@deepfuture/dui` with `@deepfuture/dui/primitives` and `@deepfuture/dui/components`
subpaths. This is the actual structural fix — it deletes the entire class of problem rather than
managing it, and makes the version question unanswerable-by-construction.

Rejected **for now** rather than on merit. It is a migration across two repos and a breaking change
for every consumer. If it ever happens it should ride a major version, and it would supersede this
entire proposal.

### Automate the republish

Keep exact pins, add tooling so a primitives release triggers a dui rebuild + publish.

Rejected as a solution, though worth doing anyway: it addresses maintainer toil (§3.2) but neither of
the correctness problems (§3.1, §3.3). The existing `/publish-to-npm` skill already covers most of
the toil.

---

## 6. When to revisit

Adopt if any of these become true:

- **A consumer reports duplicate-install symptoms** — `instanceof` failures, doubled styles, or an
  unexpectedly large primitives footprint in their bundle. This is the strongest trigger; it means
  §3.1 stopped being theoretical.
- **Anyone other than the maintainer consumes both layers.** The current arrangement is safe largely
  because one person controls both repos and both release cadences.
- **Primitives release cadence outpaces dui's.** If primitives starts shipping fixes weekly and dui
  monthly, the forced-republish tax compounds.
- **A second styled layer appears** — a fork, a white-label build, anything that consumes primitives
  independently. Exact pinning makes that arrangement unworkable.

Reconsider the single-package option instead if a major version is already on the table for other
reasons.

## 7. Open questions

- Does anything currently depend on `@deepfuture/dui-primitives` directly? `dui-app-template` and
  `dui-kit` are worth checking before assuming §3.1 is hypothetical.
- Does `dui-inspector` — which is versioned independently and consumed via npm at `^0.0.22` — have
  the same coupling to primitives' internal DOM? It inspects components at runtime, so it may.
- Would lockstep versioning be confusing for `chart` and `map`, which are thinner wrappers with
  genuinely independent release needs?
