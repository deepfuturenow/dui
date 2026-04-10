# Consuming DUI

How to integrate DUI components into an application.

---

## Install

**npm / pnpm / yarn:**

```bash
npm install @deepfuture/dui-core @deepfuture/dui-components @deepfuture/dui-theme-default
```

**CDN (zero setup):**

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@deepfuture/dui-cdn/dui.min.js"></script>
```

The CDN bundle registers all components with the default theme automatically. No imports, no config — just use the elements in your HTML. For custom themes or tree-shaking, use the npm packages below.

**Deno (from source):**

Add `@dui/*` entries to your app's `deno.json` import map, pointing to the DUI package source:

```json
{
  "imports": {
    "@dui/core": "../dui/packages/core/src/index.ts",
    "@dui/core/apply-theme": "../dui/packages/core/src/apply-theme.ts",
    "@dui/core/event": "../dui/packages/core/src/event.ts",
    "@dui/components/button": "../dui/packages/components/src/button/index.ts",
    "@dui/components/dialog": "../dui/packages/components/src/dialog/index.ts",
    "@dui/components/all": "../dui/packages/components/src/all.ts",
    "@dui/theme-default": "../dui/packages/theme-default/src/index.ts"
  }
}
```

Paths are relative to your `deno.json`. Add entries for each component family you use (or just `@dui/components/all` for everything).

---

## Bootstrap pattern

Call `applyTheme` before the first render. This registers component classes as custom elements with theme styles composed in.

### All components

The simplest setup — register everything:

```typescript
// bootstrap.ts — import early in your app's entry point
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { allComponents } from "@dui/components/all";

applyTheme({ theme: defaultTheme, components: allComponents });
```

### À la carte with families

Each component exports a `*Family` array containing the component and all its sub-components. Use this for smaller bundles:

```typescript
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { buttonFamily } from "@dui/components/button";
import { dialogFamily } from "@dui/components/dialog";
import { sidebarFamily } from "@dui/components/sidebar";

applyTheme({
  theme: defaultTheme,
  components: [...buttonFamily, ...dialogFamily, ...sidebarFamily],
});
```

This avoids needing to know every sub-component — `dialogFamily` includes `DuiDialog`, `DuiDialogTrigger`, `DuiDialogPopup`, and `DuiDialogClose`. `sidebarFamily` includes all 13 sidebar sub-components.

### TypeScript tag names

`HTMLElementTagNameMap` declarations ship with `@dui/components` automatically. You get type-safe `document.querySelector("dui-button")` etc. without any manual declarations.

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

## esbuild considerations

The theme's `tokens.css` is imported as raw text using Deno's `with { type: "text" }` import attribute. If your app uses esbuild, you need a CSS raw text plugin:

```typescript
// In your esbuild config
const cssRawTextPlugin: esbuild.Plugin = {
  name: "css-raw-text",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const text = await Deno.readTextFile(args.path);
      return { contents: text, loader: "text" };
    });
  },
};
```

The DUI docs package (`packages/docs/serve.ts`) has a working implementation of this plugin for reference.

---

## Dark mode

Toggle dark mode by setting `data-theme="dark"` on the `<html>` element:

```typescript
document.documentElement.setAttribute("data-theme", "dark");
// or remove for light mode:
document.documentElement.removeAttribute("data-theme");
```

The theme's `tokens.css` uses `:root[data-theme="dark"]` selectors to swap color tokens automatically.
