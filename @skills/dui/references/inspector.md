<!-- Mirrors the agent-relevant subset of docs/inspector.md. Update both when the API changes. -->

# DUI Inspector API Reference

The inspector is available when `@deepfuture/dui-inspector` (or `@dui/inspector`) is installed. It exposes console globals for programmatic access.

## Installation check

Look for `@deepfuture/dui-inspector` in `package.json` or `@dui/inspector` in the Deno import map. If the inspector import exists in the app's entry point (often gated behind `import.meta.env?.DEV`), it's available in the dev server's browser context.

## Globals

### `__dui_inspect(selector?)`

Inspect the page or a specific component.

**No argument — page inspection:**

```js
const page = __dui_inspect();
// Returns:
// {
//   timestamp: "2026-04-11T...",
//   themeMode: "light" | "dark",
//   componentCount: 12,
//   components: [ ...component inspections ],
//   catalog: [ ...all registered dui-* tags with schemas ]
// }
```

The `catalog` array lists every registered component type — including ones not currently on the page. Each entry has:
- `tagName` — e.g. `"dui-button"`
- `properties` — schema with name, type, default, reflected
- `slots` — slot names
- `parts` — CSS part names

**With selector — component inspection:**

```js
const info = __dui_inspect('dui-button');
const info = __dui_inspect('[data-dui-id="5"]');
// Returns:
// {
//   tagName: "dui-button",
//   className: "DuiButton",
//   selector: "[data-dui-id=\"5\"]",
//   path: "dui-toolbar > dui-button:nth-of-type(2)",
//   properties: { variant: { value: "primary", type: "String", ... } },
//   tokens: { "--button-bg": { computed: "oklch(0.5 0.2 260)", hex: "#3b5cc8" } },
//   styleLayers: { "base-reset": "...", "component": "...", "theme-base": "...", "theme-component": "..." },
//   slots: { "": { assignedCount: 1 }, "prefix": { assignedCount: 0 } },
//   parts: { "root": { innerTag: "button" } },
//   events: { listeners: [...], dispatched: [...] }
// }
```

The `selector` field uses a stable `data-dui-id` attribute stamped on the element. Always use this selector for subsequent API calls.

---

### `__dui_mutate`

All mutations validate inputs, log to the changelog, and return `{ ok: boolean, selector: string, inspection: {...} }` on success or `{ ok: false, error: string }` on failure.

#### `.setProp(selector, propName, value)`
Set a reactive property. Validates against the component's property schema.

```js
__dui_mutate.setProp('[data-dui-id="5"]', 'variant', 'danger')
// Invalid prop → { ok: false, error: 'Unknown property "bogus" on <dui-button>. Available: variant, ...' }
```

#### `.setToken(tokenName, value)`
Set a CSS custom property on `:root` (affects all components).

```js
__dui_mutate.setToken('--radius-md', '1rem')
```

#### `.setComponentToken(selector, tokenName, value)`
Set a CSS custom property on one element's inline style (scoped).

```js
__dui_mutate.setComponentToken('[data-dui-id="5"]', '--button-bg', 'red')
```

#### `.setSlotContent(selector, slotName, html)`
Replace slot content. Use `''` for the default slot.

```js
__dui_mutate.setSlotContent('[data-dui-id="5"]', '', '<span>New label</span>')
```

#### `.insertComponent(parentSelector, position, tagName, props?, slotContent?)`
Insert a new component. Position values: `"beforebegin"`, `"afterbegin"`, `"beforeend"`, `"afterend"`.

```js
__dui_mutate.insertComponent('[data-dui-id="3"]', 'beforeend', 'dui-button',
  { variant: 'primary' }, 'Click me')
```

#### `.removeComponent(selector)`
Remove a component from the DOM.

#### `.moveComponent(selector, targetSelector, position)`
Move a component to a new parent.

---

### `__dui_changelog`

All mutations (console API and visual UI) are recorded.

```js
__dui_changelog.entries()   // View all mutations
__dui_changelog.undo()      // Undo the last mutation
__dui_changelog.clear()     // Clear the log
__dui_changelog.count()     // Get the count
```

---

### `__dui_export()`

Export mutations as structured source file changes.

```js
__dui_export()
// → [
//   { file: "packages/components/src/tokens/tokens.css", changeType: "token",
//     description: "Change --radius-md to 1rem", tokenName: "--radius-md", tokenValue: "1rem" },
//   { file: "src/pages/settings.ts", changeType: "template",
//     description: "Insert <dui-separator> beforeend ...", html: "<dui-separator></dui-separator>" }
// ]
```

File paths require a source map configured at init:

```js
import { init } from "@dui/inspector/api";
init({
  sourceMap: {
    tokens: "packages/components/src/tokens/tokens.css",
    page: "src/pages/dashboard.ts",
    components: { "dui-button": "packages/components/src/button/button.ts" },
  }
});
```

Without a source map, file paths show `"(unknown ...)"`.

---

### `__dui_observe(callback)`

Subscribe to mutations in real time. Returns an unsubscribe function.

```js
const unsub = __dui_observe(entry => {
  console.log(entry.action, entry.target, entry.params);
});
unsub(); // stop observing
```
