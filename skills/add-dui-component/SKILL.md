---
name: add-dui-component
description: Add a DUI component to a consuming application. Use when the user says "add a component", "use dui-dialog in my app", "register a new component", "add dui-X to my project", or needs to wire up a DUI component in their app's bootstrap file. Handles import map entries, bootstrap registration, and usage examples.
---

# Add a DUI Component to a Consuming App

Wire up a DUI component in an application that consumes the DUI library.

## Prerequisites

The app must already have the DUI bootstrap pattern set up:
- `@dui/core/apply-theme` imported
- `@dui/theme-default` imported
- An `applyTheme()` call in the app's bootstrap file

If not, read `docs/consuming.md` in the DUI repo first and set up the bootstrap pattern.

## Steps

### 1. Identify the component

Ask the user which component to add. Available components:

accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, checkbox, collapsible, combobox, command, data-table, dialog, dropzone, icon, input, link, menu, menubar, number-field, popover, portal, preview-card, progress, radio, scroll-area, select, separator, sidebar, slider, spinner, switch, tabs, textarea, toggle, toolbar, tooltip, trunc

### 2. Check if it's a compound component

Read the component's `index.ts` to see what it exports:

```bash
cat packages/components/src/<component>/index.ts
```

Look for a `*Family` export (e.g., `dialogFamily`, `sidebarFamily`). This tells you all sub-components that need registering.

**Simple components** (single class, e.g., button, badge, spinner) export one class and a family array of one.

**Compound components** (multiple sub-components, e.g., dialog, popover, sidebar, tabs) export multiple classes and a family array containing all of them.

### 3. Update the app's import map

In the app's `deno.json` (for Deno source imports) or verify the npm package is installed.

**Deno (from source):**
```json
{
  "imports": {
    "@dui/components/<component>": "../dui/packages/components/src/<component>/index.ts"
  }
}
```

**npm:**
```json
{
  "imports": {
    "@dui/components/<component>": "npm:@deepfuture/dui-components/<component>"
  }
}
```

The path is relative to the app's `deno.json`. Adjust `../dui/` based on where DUI lives relative to the app.

### 4. Update bootstrap.ts

Import the family and spread it into the `applyTheme` call:

```typescript
import { <component>Family } from "@dui/components/<component>";

applyTheme({
  theme: defaultTheme,
  components: [
    // ... existing components ...
    ...<component>Family,
  ],
});
```

**Do NOT import and register sub-components individually.** Always use the `*Family` export — it includes all sub-components automatically.

**Alternative — register everything:**
```typescript
import { allComponents } from "@dui/components/all";

applyTheme({ theme: defaultTheme, components: allComponents });
```

This is simpler but includes every component in the bundle.

### 5. Use in a template

**Simple component example (button):**
```typescript
html`<dui-button variant="outline">Click me</dui-button>`
```

**Compound component example (dialog):**
```typescript
html`
  <dui-dialog>
    <dui-dialog-trigger>
      <dui-button>Open</dui-button>
    </dui-dialog-trigger>
    <dui-dialog-popup>
      <p>Content here</p>
      <dui-dialog-close>
        <dui-button variant="outline">Close</dui-button>
      </dui-dialog-close>
    </dui-dialog-popup>
  </dui-dialog>
`
```

For compound components, check the DUI docs site for usage examples and available properties/slots/events.

### 6. Verify

If the app's dev server is running, check the browser. The component should render with theme styles applied. If it shows as an unknown element (no shadow DOM), check:

1. The import path is correct in `deno.json`
2. The family is spread into the `applyTheme` components array
3. `applyTheme` is called before the component renders

## Common patterns

### Event handling

Components fire custom events. Listen with Lit's `@event` syntax:

```typescript
html`
  <dui-switch @checked-change=${(e: CustomEvent<{ checked: boolean }>) => {
    console.log(e.detail.checked);
  }}></dui-switch>
`
```

### Link buttons with router integration

`<dui-button href="...">` fires `dui-navigate` instead of navigating. Wire into your router:

```typescript
document.addEventListener("dui-navigate", (e: CustomEvent<{ href: string }>) => {
  router.navigate(e.detail.href);
});
```

## Reference

- Component API details: `packages/docs/src/component-registry.ts`
- Full consuming guide: `docs/consuming.md`
- Theme system: `docs/theming.md`
- Creating new components (for DUI library development): `docs/creating-components.md`
