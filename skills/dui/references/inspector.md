<!-- Auto-generated from docs/inspector.md — do not edit manually. -->
<!-- Run: deno task generate -->

# DUI Inspector API Reference

The inspector is available when `@deepfuture/dui-inspector` (or `@dui/inspector`) is installed. It exposes console globals for programmatic access.

## Installation check

Look for `@deepfuture/dui-inspector` in `package.json` or `@dui/inspector` in the Deno import map. If the inspector import exists in the app's entry point (often gated behind `import.meta.env?.DEV`), it's available in the dev server's browser context.

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

## Agent workflow

```
1. __dui_inspect()                              → discover available components
2. __dui_inspect().catalog                       → see what can be built
3. __dui_mutate.insertComponent(...)             → add components
4. __dui_mutate.setProp(selector, 'variant', ..) → configure them
5. __dui_inspect(selector)                       → verify state
6. __dui_export()                                → get source changes to write to files
```
