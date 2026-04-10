# Inspector

The DUI Inspector lets you introspect and mutate DUI components at runtime. It has two interfaces:

- **Console API** — `window.__dui_inspect()`, `window.__dui_mutate`, etc. for programmatic access by agents, scripts, or anyone in DevTools
- **Visual UI** — a panel overlay toggled with **Ctrl+Shift+I** for interactive inspection and editing

Both interfaces share the same engine and changelog, so changes made in the UI are visible to the console API and vice versa.

## Installation

The inspector is a separate package. Import it in your app's entry point:

```typescript
// Full inspector: console API + visual UI
import "@dui/inspector";

// Headless: console API only (no UI overlay)
import "@dui/inspector/api";
```

For npm consumers:

```bash
npm install @deepfuture/dui-inspector
```

```typescript
import "@deepfuture/dui-inspector";
// or
import "@deepfuture/dui-inspector/api";
```

The inspector is intended for development. Don't ship it to production — gate it behind an environment check or a dev-only entry point.

---

## Console API

All globals are available in the browser's DevTools console.

### Inspecting

```js
// Inspect the entire page — all DUI components + a catalog of registered component types
__dui_inspect()

// Inspect a specific component by CSS selector
__dui_inspect('dui-button')
__dui_inspect('[data-dui-id="5"]')
```

**Page inspection** returns:

| Field | Description |
|-------|-------------|
| `timestamp` | ISO timestamp |
| `themeMode` | Current theme (`"light"`, `"dark"`, etc.) |
| `componentCount` | Number of DUI component instances on the page |
| `components` | Array of component inspections (see below) |
| `catalog` | Array of all registered `dui-*` tag names with their property schemas, slots, and parts — including components not currently on the page |

**Component inspection** returns:

| Field | Description |
|-------|-------------|
| `tagName` | e.g. `"dui-button"` |
| `className` | Lit class name (e.g. `"DuiButton"` or `"ThemedClass"`) |
| `selector` | Queryable selector — use this in subsequent API calls |
| `path` | Human-readable hierarchy path for display |
| `properties` | Reactive properties with current values, types, and reflection info |
| `tokens` | CSS custom properties used by this component, with computed values and hex colors |
| `styleLayers` | Adopted stylesheets mapped to named layers (base-reset, component, theme-base, theme-component) |
| `slots` | Shadow DOM slots and their assigned node counts |
| `parts` | CSS `::part()` names and their inner element tags |
| `events` | Detected event listeners and dispatched event types |

The `selector` field is a stable reference stamped on the element as `data-dui-id`. Use it for all subsequent inspect/mutate calls — it works across shadow DOM boundaries.

### Mutating

Every mutation validates inputs, logs to the changelog, and returns a post-mutation inspection so you can verify the result.

```js
// Set a reactive property (validates against the component's property schema)
__dui_mutate.setProp('[data-dui-id="5"]', 'variant', 'danger')
// → { ok: true, selector: '...', inspection: {...} }

// Invalid prop → error with available properties listed
__dui_mutate.setProp('[data-dui-id="5"]', 'bogus', true)
// → { ok: false, error: 'Unknown property "bogus" on <dui-button>. Available: variant, ...' }

// Global token change (sets on :root — affects all components)
__dui_mutate.setToken('--radius-md', '1rem')

// Scoped token change (sets on one element's inline style)
__dui_mutate.setComponentToken('[data-dui-id="5"]', '--button-bg', 'red')

// Replace slot content
__dui_mutate.setSlotContent('[data-dui-id="5"]', '', '<span>New label</span>')

// Insert a new component
__dui_mutate.insertComponent('[data-dui-id="3"]', 'beforeend', 'dui-separator')

// Insert with props and slot content
__dui_mutate.insertComponent('[data-dui-id="3"]', 'afterbegin', 'dui-button',
  { variant: 'primary' }, 'Click me')

// Remove a component
__dui_mutate.removeComponent('[data-dui-id="5"]')

// Move a component to a new parent
__dui_mutate.moveComponent('[data-dui-id="5"]', '[data-dui-id="10"]', 'beforeend')
```

**Insert positions:** `"beforebegin"`, `"afterbegin"`, `"beforeend"`, `"afterend"` — same as `Element.insertAdjacentElement()`.

### Changelog

All mutations (from both the console API and the visual UI) are recorded in an ordered log.

```js
// View all mutations
__dui_changelog.entries()

// Undo the last mutation
__dui_changelog.undo()

// Clear the log
__dui_changelog.clear()

// Get the count
__dui_changelog.count()
```

### Source export

After making mutations, export them as structured source file changes. This is designed for agents that need to write changes back to code.

```js
__dui_export()
// → [
//   { file: "packages/theme-default/src/tokens.css", changeType: "token",
//     description: "Change --radius-md to 1rem", tokenName: "--radius-md", tokenValue: "1rem" },
//   { file: "src/pages/settings.ts", changeType: "template",
//     description: "Insert <dui-separator> beforeend ...", html: "<dui-separator></dui-separator>" }
// ]
```

For source export to include real file paths, configure the source map at init time:

```typescript
import { init } from "@dui/inspector/api";

init({
  sourceMap: {
    components: {
      "dui-button": "packages/components/src/button/button.ts",
    },
    tokens: "packages/theme-default/src/tokens.css",
    themeStyles: {
      "dui-button": "packages/theme-default/src/components/button.ts",
    },
    page: "src/pages/settings.ts",
  }
});
```

Without a source map, file paths in the export will show `"(unknown ...)"`.

### Observing changes

Subscribe to mutations in real time. This lets an agent watch for changes made by a human in the visual UI.

```js
const unsub = __dui_observe(entry => {
  console.log('Change:', entry.action, entry.target, entry.params);
});

// Later:
unsub();
```

---

## Visual UI

Toggle with **Ctrl+Shift+I**. Press **Esc** to close the panel, then **Esc** again to deactivate.

### Inspect mode

When active, hover over any DUI component to see a blue highlight overlay with the tag name. Click to select — the inspector panel opens on the right side.

### Inspect tab

Shows the selected component's:

- **Path** — human-readable hierarchy (e.g. `dui-toolbar > dui-button:nth-of-type(2)`)
- **Selector** — queryable selector for API use
- **Properties** — reactive properties with current values and types
- **CSS Parts** — `::part()` names and their inner elements
- **Slots** — slot names and assigned node counts
- **Shadow summary** — child/slot/part counts

### Tokens tab

Shows all CSS custom properties used by the selected component. Two editing modes:

- **Global** — changes the token on `:root` (affects all components)
- **This instance** — changes the token on the element's inline style (scoped)

Color tokens get a color picker. All tokens have a text input for direct value entry. Changes are applied live.

### Styles tab

Shows the component's style layers as syntax-highlighted CSS:

| Layer | Description | Editable |
|-------|-------------|----------|
| **base-reset** | Structural resets from `@dui/core/base` | No |
| **component** | The component's own layout CSS | No |
| **theme-base** | Themed `:host` defaults (font, color) | No |
| **theme-component** | Per-component aesthetic styles from the theme | Yes |
| **user overrides** | Your custom additions | Yes |

Read-only layers are collapsed by default. The theme-component layer is expanded and shows an **Edit** button on hover (or double-click) to switch to a textarea for editing. CSS parse errors are shown inline.

The layer model shows exactly where each style comes from and which layer to edit for the change you want.

### Toolbar

At the bottom of the panel:

- **Copy changes** — copies the full changeset as JSON to the clipboard (same format as `__dui_export()`)
- **Undo** — reverts the last mutation
- **Change count** — shows how many mutations have been made this session

---

## Typical workflows

### Agent prototyping a page

```
1. __dui_inspect()                              → discover available components
2. __dui_inspect().catalog                       → see what can be built
3. __dui_mutate.insertComponent(...)             → add components
4. __dui_mutate.setProp(selector, 'variant', ..) → configure them
5. __dui_inspect(selector)                       → verify state
6. __dui_export()                                → get source changes to write to files
```

### Human tweaking a design

```
1. Ctrl+Shift+I                                  → activate inspector
2. Click a component                              → inspect it
3. Tokens tab → edit colors, spacing              → see changes live
4. Styles tab → edit theme-component CSS          → fine-tune aesthetics
5. Copy changes                                   → paste into a Claude conversation or PR
```

### Agent observing human edits

```js
__dui_observe(entry => {
  // Human edits a token in the UI → agent sees it here
  // Agent can then call __dui_export() to get the file changes
});
```

---

## Architecture

```
@dui/inspector
  src/
    api.ts              ← Headless entry: exposes window globals, no UI
    index.ts            ← Full entry: api.ts + mounts visual UI
    lib/
      introspect.ts     ← Read API: discover, inspect, catalog
      mutate.ts         ← Write API: setProp, setToken, insert, remove, move
      changelog.ts      ← Ordered mutation log with undo
      source-map.ts     ← Maps mutations to source file paths
      selector.ts       ← Stable selector generation (data-dui-id)
      deep-query.ts     ← querySelector across shadow DOM boundaries
      style-layers.ts   ← Maps adoptedStyleSheets to named layers
      types.ts          ← All TypeScript interfaces
    ui/
      inspector-view.ts ← Root orchestrator, keyboard shortcuts, tabs
      inspector-overlay.ts ← Hover highlight
      inspector-panel.ts   ← Inspect tab
      token-editor-panel.ts ← Tokens tab
      style-editor-panel.ts ← Styles tab
```

The UI components use `@customElement` directly (not `applyTheme`) and have their own Catppuccin-dark aesthetic. They're deliberately not DUI components — this avoids circular inspection, theme dependency, and style leakage.
