# Consuming DUI

How to integrate DUI components into an application.

---

## Install

**npm / pnpm / yarn:**

```bash
npm install @deepfuture/dui-components
```

**CDN (zero setup):**

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@deepfuture/dui-cdn/dui.min.js"></script>
```

The CDN bundle registers all components automatically. No imports, no config — just use the elements in your HTML.

**Deno (from source):**

Add `@dui/*` entries to your app's `deno.json` import map, pointing to the DUI package source:

```json
{
  "imports": {
    "@dui/components/button": "../dui/packages/components/src/button/index.ts",
    "@dui/components/dialog": "../dui/packages/components/src/dialog/index.ts"
  }
}
```

Paths are relative to your `deno.json`. Add entries for each component you use.

---

## Usage

Components self-register on import. No setup function, no configuration:

### À la carte

Import only the components you use:

```typescript
import "@deepfuture/dui-components/button";
import "@deepfuture/dui-components/dialog";
import "@deepfuture/dui-components/sidebar";
```

Each import registers the component and all its sub-components. Importing `dialog` registers `dui-dialog`, `dui-dialog-trigger`, `dui-dialog-popup`, and `dui-dialog-close`.

### Everything

Register all components at once:

```typescript
import "@deepfuture/dui-components";
```

### TypeScript tag names

`HTMLElementTagNameMap` declarations ship with `@dui/components` automatically. You get type-safe `document.querySelector("dui-button")` etc. without any manual declarations.

---

## Using templates

Templates are pre-composed UI patterns. Install alongside the components:

```bash
npm install @deepfuture/dui-templates
```

Templates self-register on import, just like components. They import their component dependencies internally:

```typescript
// Registers dui-feed-item and its component dependencies (dui-badge, etc.)
import "@deepfuture/dui-templates/feed";
```

Then use in HTML:

```html
<dui-feed-item
  title="Earthquake detected"
  subtitle="USGS Pacific Northwest"
  timestamp="2 min ago"
  category="Seismic"
  severity="high"
  description="Magnitude 4.2 recorded near Portland, OR."
></dui-feed-item>
```

Or register all templates at once:

```typescript
import "@deepfuture/dui-templates/all";
```

---

## Event handling

### `dui-navigate` for link buttons

When `<dui-button href="...">` is clicked (without modifier keys), it fires `dui-navigate` instead of navigating. Wire this into your app's router:

```typescript
document.addEventListener("dui-navigate", (e: CustomEvent<{ href: string }>) => {
  router.navigate(e.detail.href);
});
```

### Component events

Each component may fire specific events. Listen on the element:

```typescript
html`
  <dui-switch @checked-change=${(e: CustomEvent<{ checked: boolean }>) => {
    console.log("Switch toggled:", e.detail.checked);
  }}></dui-switch>
`;
```

---

## Dark mode

Toggle dark mode by setting `data-theme="dark"` on the `<html>` element:

```typescript
document.documentElement.setAttribute("data-theme", "dark");
// or remove for light mode:
document.documentElement.removeAttribute("data-theme");
```

The token stylesheet uses `:root[data-theme="dark"]` selectors to swap color tokens automatically.

---

## Programmatic access to classes

If you need the component class (e.g., for `instanceof` checks), use named imports:

```typescript
import { DuiButton } from "@deepfuture/dui-components/button";
import { DuiDialog } from "@deepfuture/dui-components/dialog";
```

The side-effect import (registration) happens automatically when you import the module — named imports don't skip it.
