# DUI Rules — Incorrect/Correct Pairs

Concrete examples of wrong vs right patterns. Each rule links back to a principle in SKILL.md.

---

## Typography & spacing

### Text elements need explicit spacing — there are no default margins

DUI applies `text-box: trim-both cap alphabetic` and resets margins on all prose elements. Text elements have zero implicit spacing.

❌ **Wrong:**
```html
<!-- Relying on default h1 margin and line-height for spacing -->
<h1>Dashboard</h1>
<p>Overview of recent order activity and key metrics.</p>

<div class="cards">
  ...
</div>
```

✅ **Right:**
```html
<div class="page-header">
  <h1>Dashboard</h1>
  <p>Overview of recent order activity and key metrics.</p>
</div>

<div class="cards">
  ...
</div>
```
```css
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.page-header p {
  color: var(--text-2);
  font-size: var(--text-sm);
}
```

### Card content needs explicit vertical rhythm

❌ **Wrong:**
```html
<!-- No spacing between label, value, and change text -->
<div class="stat-card">
  <span class="label">Total Revenue</span>
  <span class="value">$12,485.25</span>
  <span class="change">+12.5% from last month</span>
</div>
```
```css
.stat-card {
  padding: var(--space-4);
}
```

✅ **Right:**
```html
<div class="stat-card">
  <span class="label">Total Revenue</span>
  <span class="value">$12,485.25</span>
  <span class="change">+12.5% from last month</span>
</div>
```
```css
.stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
}
```

### Use dui-prose for long-form content, flex/gap for app UI

❌ **Wrong:**
```html
<!-- Using dui-prose for a dashboard page header -->
<div class="dui-prose">
  <h1>Settings</h1>
  <p>Manage your account preferences.</p>
</div>
```

❌ **Also wrong:**
```html
<!-- Manually adding margin to every text element in a markdown body -->
<div class="article">
  <h1 style="margin-bottom: 16px">Release Notes</h1>
  <p style="margin-bottom: 12px">Version 2.0 brings...</p>
</div>
```

✅ **Right:**
```html
<!-- App UI: explicit flex/gap -->
<div style="display: flex; flex-direction: column; gap: var(--space-2);">
  <h1>Settings</h1>
  <p>Manage your account preferences.</p>
</div>

<!-- Long-form content: dui-prose -->
<div class="dui-prose">
  <h1>Release Notes</h1>
  <p>Version 2.0 brings...</p>
</div>
```

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
  --button-bg: var(--accent);
  --button-fg: oklch(from var(--accent) 0.98 0.01 h);
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
dui-dialog-popup::part(popup) {
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
  --badge-bg: var(--destructive);
  --badge-fg: oklch(from var(--destructive) 0.98 0.01 h);
}
```

### Dark mode via `data-theme`, not manual overrides

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
<html data-theme="dark">
  <!-- Token stylesheet swaps the 4 primitives automatically -->
</html>
```

```typescript
// Toggle programmatically
document.documentElement.setAttribute("data-theme", "dark");
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
  --input-border: var(--destructive);
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
<div class="field-wrapper">
  <label>Email</label>
  <dui-input placeholder="you@example.com"></dui-input>
  <span class="error">Required</span>
</div>
```

✅ **Right:**
```html
<dui-field>
  <span slot="label">Email</span>
  <dui-input placeholder="you@example.com"></dui-input>
  <span slot="error">Required</span>
</dui-field>
```

---

## Use DUI components, not custom markup

### Separator, not `<hr>` or border divs

❌ **Wrong:**
```html
<hr style="border-top: 1px solid #e5e7eb;">
<!-- or -->
<div style="border-bottom: 1px solid var(--border);"></div>
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
<dui-badge variant="primary">Active</dui-badge>
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

✅ **Right:**
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
<dui-scroll-area max-height="300px">
  <!-- long content -->
</dui-scroll-area>
```

### Card, not custom container divs

❌ **Wrong:**
```html
<div class="card">
  <div class="card-header">
    <h3>Title</h3>
    <p>Description</p>
  </div>
  <div class="card-body">Content</div>
  <div class="card-footer">
    <button>Save</button>
  </div>
</div>
```

✅ **Right:**
```html
<dui-card>
  <span slot="title">Title</span>
  <span slot="description">Description</span>
  Content
  <div slot="footer">
    <dui-button variant="primary">Save</dui-button>
  </div>
</dui-card>
```

### Field with label/error, not manual wiring

❌ **Wrong:**
```html
<div>
  <label for="email">Email</label>
  <dui-input id="email" placeholder="you@example.com"></dui-input>
  <span class="error-msg" style="color: red;">Invalid email</span>
</div>
```

✅ **Right:**
```html
<dui-field invalid>
  <span slot="label">Email</span>
  <dui-input placeholder="you@example.com"></dui-input>
  <span slot="error">Invalid email</span>
</dui-field>
```

---

## Import patterns

### Self-registration via import

❌ **Wrong:**
```typescript
// No setup function needed — this doesn't exist
import { applyTheme } from "@dui/core";
import { defaultTheme } from "@dui/theme-default";
applyTheme(defaultTheme);
```

✅ **Right:**
```typescript
// Just import — components self-register
import "@deepfuture/dui-components/button";
import "@deepfuture/dui-components/dialog";

// Now <dui-button> and <dui-dialog> work in HTML
```

### Theme attributes as HTML attributes

❌ **Wrong:**
```typescript
// Don't set variant/appearance/size as JS properties
const btn = document.querySelector('dui-button');
btn.variant = 'primary';
btn.size = 'lg';
```

✅ **Right:**
```html
<!-- Theme attributes are HTML attributes -->
<dui-button variant="primary" size="lg">Save</dui-button>
```

```typescript
// Or set via setAttribute
btn.setAttribute('variant', 'primary');
btn.setAttribute('size', 'lg');
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
