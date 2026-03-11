# Consuming DUI

How to integrate dui components into an application.

---

## Import map setup

Add `@dui/*` entries to your app's `deno.json` (or equivalent import map). Each entry points to the dui package source:

```json
{
  "imports": {
    "@dui/core": "../dui/packages/core/src/index.ts",
    "@dui/core/base": "../dui/packages/core/src/base.ts",
    "@dui/core/event": "../dui/packages/core/src/event.ts",
    "@dui/core/apply-theme": "../dui/packages/core/src/apply-theme.ts",
    "@dui/components/button": "../dui/packages/components/src/button/index.ts",
    "@dui/components/switch": "../dui/packages/components/src/switch/index.ts",
    "@dui/components/badge": "../dui/packages/components/src/badge/index.ts",
    "@dui/theme-default": "../dui/packages/theme-default/src/index.ts"
  }
}
```

Paths are relative to your `deno.json`. Adjust based on where dui lives relative to your project.

---

## Bootstrap pattern

Call `applyTheme` before the first render. This registers all components as custom elements with theme styles composed in.

```typescript
// bootstrap.ts — import early in your app's entry point
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { DuiButton } from "@dui/components/button";
import { DuiSwitch } from "@dui/components/switch";
import { DuiBadge } from "@dui/components/badge";

applyTheme({
  theme: defaultTheme,
  components: [DuiButton, DuiSwitch, DuiBadge],
});
```

### HTMLElementTagNameMap declarations

Declare tag name → class mappings so TypeScript knows about your components in templates:

```typescript
declare global {
  interface HTMLElementTagNameMap {
    "dui-button": InstanceType<typeof DuiButton>;
    "dui-switch": InstanceType<typeof DuiSwitch>;
    "dui-badge": InstanceType<typeof DuiBadge>;
  }
}
```

Put these declarations in the bootstrap file or a shared types file.

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
      // Check if the importer uses `with { type: "text" }`
      const text = await Deno.readTextFile(args.path);
      return { contents: text, loader: "text" };
    });
  },
};
```

The dui docs package (`packages/docs/serve.ts`) has a working implementation of this plugin for reference.

---

## Adding a new component

When a new component is added to dui, here's what the consuming app needs to do:

1. **Add import map entries** — Add `@dui/components/{name}` and optionally `@dui/theme-default/components/{name}` to your `deno.json`
2. **Import the component class** — `import { DuiFoo } from "@dui/components/foo";`
3. **Add to `applyTheme` call** — Include the class in the `components` array
4. **Add tag name declaration** — Add to `HTMLElementTagNameMap`

```typescript
// Updated bootstrap
import { DuiFoo } from "@dui/components/foo";

applyTheme({
  theme: defaultTheme,
  components: [DuiButton, DuiSwitch, DuiBadge, DuiFoo],  // add here
});

declare global {
  interface HTMLElementTagNameMap {
    "dui-foo": InstanceType<typeof DuiFoo>;  // add here
  }
}
```

---

## Dark mode

Toggle dark mode by setting `data-theme="dark"` on the `<html>` element:

```typescript
document.documentElement.setAttribute("data-theme", "dark");
// or remove for light mode:
document.documentElement.removeAttribute("data-theme");
```

The theme's `tokens.css` uses `:root[data-theme="dark"]` selectors to swap color tokens automatically.
