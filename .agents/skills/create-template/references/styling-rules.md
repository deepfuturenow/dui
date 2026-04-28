# DUI Rules — Incorrect/Correct Pairs

Concrete examples of wrong vs right patterns. Each rule links back to a principle in SKILL.md.

---

## Styling

### Use CSS custom properties, not direct CSS on host or shadow DOM

❌ **Wrong:**
```css
dui-button {
  color: white;
  background: #3b82f6;
  border-radius: 8px;
}
```

✅ **Right:**
```css
dui-button {
  --button-bg: var(--color-primary);
  --button-fg: var(--color-bg);
  --button-radius: var(--radius-md);
}
```

### Use `::part(root)` for CSS properties that don't have a token

❌ **Wrong:**
```css
/* Trying to target internal shadow DOM elements */
dui-dialog-popup > div {
  backdrop-filter: blur(12px);
}
```

✅ **Right:**
```css
dui-dialog-popup::part(root) {
  backdrop-filter: blur(12px);
}
```

### Use semantic tokens, not hardcoded colors

❌ **Wrong:**
```css
dui-badge {
  --badge-bg: #ef4444;
  --badge-fg: #ffffff;
}
```

✅ **Right:**
```css
dui-badge {
  --badge-bg: var(--color-destructive);
  --badge-fg: var(--color-bg);
}
```

### Dark mode via class, not manual overrides

❌ **Wrong:**
```css
@media (prefers-color-scheme: dark) {
  dui-button {
    --button-bg: #1e293b;
    --button-fg: #f8fafc;
  }
}
```

✅ **Right:**
```html
<body class="dark">
  <!-- Theme tokens swap automatically -->
</body>
```

### No `!important`

❌ **Wrong:**
```css
dui-input {
  --input-border: red !important;
}
```

✅ **Right:**
```css
/* Scope more specifically, or use the right token */
.error-field dui-input {
  --input-border: var(--color-destructive);
}
```

---

## Composition

### Don't reach into shadow DOM with querySelector

❌ **Wrong:**
```ts
const btn = document.querySelector('dui-button');
const inner = btn.shadowRoot.querySelector('button');
inner.style.background = 'red';
```

✅ **Right:**
```css
dui-button {
  --button-bg: red;
}
/* or */
dui-button::part(root) {
  filter: brightness(1.2);
}
```

### Keep compound components together

❌ **Wrong:**
```html
<!-- Trigger outside the dialog — breaks the component's internal wiring -->
<dui-dialog-trigger>
  <dui-button>Open</dui-button>
</dui-dialog-trigger>
<dui-dialog>
  <dui-dialog-popup>Content here</dui-dialog-popup>
</dui-dialog>
```

✅ **Right:**
```html
<dui-dialog>
  <dui-dialog-trigger>
    <dui-button>Open</dui-button>
  </dui-dialog-trigger>
  <dui-dialog-popup>Content here</dui-dialog-popup>
</dui-dialog>
```

### Use slots, not wrapper divs

❌ **Wrong:**
```html
<div class="input-wrapper">
  <span class="prefix-icon">🔍</span>
  <dui-input placeholder="Search..."></dui-input>
</div>
```

✅ **Right:**
```html
<dui-input placeholder="Search...">
  <dui-icon slot="prefix">🔍</dui-icon>
</dui-input>
```

---

## Use DUI components, not custom markup

### Separator, not `<hr>` or border divs

❌ **Wrong:**
```html
<hr style="border-top: 1px solid #e5e7eb;">
<!-- or -->
<div style="border-bottom: 1px solid var(--color-border);"></div>
```

✅ **Right:**
```html
<dui-separator></dui-separator>
```

### Badge, not custom styled spans

❌ **Wrong:**
```html
<span style="background: green; color: white; padding: 2px 8px; border-radius: 9999px;">Active</span>
```

✅ **Right:**
```html
<dui-badge variant="success">Active</dui-badge>
```

### Spinner, not custom loading animation

❌ **Wrong:**
```html
<div class="spinner" style="animation: spin 1s linear infinite;">⟳</div>
```

✅ **Right:**
```html
<dui-spinner size="md"></dui-spinner>
```

### Progress, not custom bar

❌ **Wrong:**
```html
<div class="progress-track">
  <div class="progress-bar" style="width: 60%;"></div>
</div>
```

✅ **Right:**
```html
<dui-progress value="60"></dui-progress>
```

### Icon, not raw SVG with manual sizing

❌ **Wrong:**
```html
<svg width="16" height="16" style="color: gray;">...</svg>
```

✅ **Right (recommended — import from `lucide-static`):**
```ts
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Home } from "lucide-static";

html`<dui-icon>${unsafeHTML(Home)}</dui-icon>`
```

✅ **Also right (fallback — raw SVG in slot):**
```html
<dui-icon style="--icon-size: 16px;">
  <svg>...</svg>
</dui-icon>
```

### Scroll area, not `overflow: auto` divs

❌ **Wrong:**
```html
<div style="overflow: auto; max-height: 300px;">
  <!-- long content -->
</div>
```

✅ **Right:**
```html
<dui-scroll-area style="max-height: 300px;">
  <!-- long content -->
</dui-scroll-area>
```

---

## Inspector

### Inspect before guessing token names

❌ **Wrong:**
```css
/* Guessing at token names that may not exist */
dui-sidebar-menu-button {
  --sidebar-menu-button-hover-bg: red;
  --sidebar-menu-button-font-size: 14px;
}
```

✅ **Right:**
```js
// First, discover the actual tokens:
__dui_inspect('dui-sidebar-menu-button')
// → tokens: { "--sidebar-item-hover-bg": ..., "--sidebar-font-size": ... }

// Then use the real names:
```
```css
dui-sidebar-menu-button {
  --sidebar-item-hover-bg: red;
  --sidebar-font-size: 14px;
}
```

### Verify mutations, don't fire and forget

❌ **Wrong:**
```js
__dui_mutate.setProp('[data-dui-id="5"]', 'variant', 'primary')
// Move on without checking
```

✅ **Right:**
```js
const result = __dui_mutate.setProp('[data-dui-id="5"]', 'variant', 'primary')
if (!result.ok) {
  console.error(result.error) // Shows available properties
}
// Verify with inspection
__dui_inspect('[data-dui-id="5"]')
```
