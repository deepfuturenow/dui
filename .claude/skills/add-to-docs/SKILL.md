---
name: add-to-docs
description: Wire a component into the DUI docs dev server. Use when the user asks to add a component to the docs, demo page, or dev server, or says "add to docs", "show in docs", etc.
---

# Add to Docs

Wire a DUI component into the docs dev server for visual testing.

## Overview

The docs dev server (`packages/docs`) provides a visual testing page for all DUI components. Adding a component requires updating three files.

### Files modified

- `packages/docs/src/index.ts` — import component class and add to `applyTheme`
- `packages/docs/static/index.html` — add demo HTML section
- `packages/docs/serve.ts` — add export entry to `workspacePackages` (if not already present)

---

## Steps

### Step 1 — Read current state

Read these files to understand the current setup:

- `packages/docs/src/index.ts`
- `packages/docs/static/index.html`
- `packages/docs/serve.ts`
- The component source (to understand its properties, variants, and slots)

### Step 2 — Update serve.ts

In the `workspacePackages` object, verify the component's export exists in the `@dui/components` and `@dui/theme-default` entries. If not, add them:

```typescript
"@dui/components": {
  dir: join(WORKSPACE_ROOT, "packages/components"),
  exports: {
    // ... existing entries ...
    "./{name}": "./src/{name}/index.ts",       // add if missing
  },
},
"@dui/theme-default": {
  dir: join(WORKSPACE_ROOT, "packages/theme-default"),
  exports: {
    // ... existing entries ...
    "./components/{name}": "./src/components/{name}.ts",  // add if missing
  },
},
```

### Step 3 — Update index.ts

Add the component import and include it in the `applyTheme` call:

```typescript
import { Dui{Name} } from "@dui/components/{name}";

applyTheme({
  theme: defaultTheme,
  components: [DuiButton, DuiSwitch, DuiBadge, Dui{Name}],  // add here
});
```

Keep imports in alphabetical order by component name.

### Step 4 — Update index.html

Add a demo `<section>` for the component. Place it in alphabetical order among existing sections.

```html
<section>
  <h2>{Component Name}</h2>
  <div class="row">
    <!-- Show all variants -->
    <dui-{name}>Default</dui-{name}>
    <dui-{name} variant="secondary">Secondary</dui-{name}>
    <dui-{name} variant="destructive">Destructive</dui-{name}>
  </div>
  <!-- Add more rows for sizes, states, etc. -->
</section>
```

**What to demonstrate:**

- All variant values in a single row
- Size variants (if applicable)
- Interactive states: disabled, checked, etc.
- Key features: slots, custom properties

Use realistic but brief content. Keep it simple — this is for quick visual verification, not comprehensive documentation.

### Step 5 — Verify

Restart the dev server (`cd packages/docs && deno task dev`) and verify the component renders correctly with all variants.
