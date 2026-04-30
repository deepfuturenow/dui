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

### Complex-property components use imperative property setting

Components like `dui-data-table`, `dui-chart`, `dui-select`, and `dui-combobox` have properties that accept arrays or objects. These must be set via JS, not HTML attributes.

❌ **Wrong:**
```html
<!-- Arrays/objects can't be set as HTML attributes -->
<dui-data-table columns='[{"key":"name"}]' data='[{"name":"Alice"}]'></dui-data-table>
```

❌ **Also wrong:**
```typescript
// Don't grab elements from outside your own shadow root
const table = document.querySelector('my-page').shadowRoot.querySelector('dui-data-table');
table.data = DATA; // reaching into another component's shadow DOM
```

✅ **Right:**
```typescript
// Set complex properties on your own light DOM children in firstUpdated()
import type { ColumnDef } from "@dui/components/data-table";

const COLUMNS: ColumnDef<Member>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", render: (v) => html`<dui-badge>${v}</dui-badge>` },
];

override firstUpdated() {
  const table = this.renderRoot.querySelector("dui-data-table") as any;
  if (table) {
    table.columns = COLUMNS;
    table.data = DATA;
    table.pageSize = 10;
  }
}

// Update data when state changes
override updated() {
  const table = this.renderRoot.querySelector("dui-data-table") as any;
  if (table) table.data = this.#filteredData;
}
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

---

## Forms

### Use dui-field for all form rows — not bare divs with manual labels

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

`dui-field` provides ARIA wiring (`aria-labelledby`, `aria-describedby`, `aria-invalid`) automatically. Slots: `label`, `description` (help text), `error` (shown when `invalid` is set).

### Use dui-fieldset to group related controls

❌ **Wrong:**
```html
<div>
  <h3>Notification preferences</h3>
  <dui-switch>Email alerts</dui-switch>
  <dui-switch>Push notifications</dui-switch>
</div>
```

✅ **Right:**
```html
<dui-fieldset>
  <span slot="legend">Notification preferences</span>
  <dui-switch>Email alerts</dui-switch>
  <dui-switch>Push notifications</dui-switch>
</dui-fieldset>
```

### Validation: set `invalid` on dui-field, not on the control

❌ **Wrong:**
```html
<dui-field>
  <span slot="label">Email</span>
  <dui-input aria-invalid="true"></dui-input>
</dui-field>
```

✅ **Right:**
```html
<dui-field invalid>
  <span slot="label">Email</span>
  <dui-input></dui-input>
  <span slot="error">Please enter a valid email</span>
</dui-field>
```

The `invalid` property on `dui-field` styles the label/error and sets `aria-invalid` on the control.

### Form control selection guide

| Need | Use |
| --- | --- |
| Short text | `dui-input` |
| Long text | `dui-textarea` |
| Pick from list | `dui-select` (fixed options) or `dui-combobox` (searchable) |
| Boolean on/off (settings) | `dui-switch` |
| Boolean agree/accept (forms) | `dui-checkbox` |
| Single choice from few options | `dui-radio-group` |
| Toggle between 2-5 options | `dui-toggle-group` |
| Numeric value with range | `dui-slider` |
| Numeric value with precision | `dui-number-field` |
| Numeric value with +/- | `dui-stepper` |
| File upload | `dui-dropzone` |
| Date selection | `dui-calendar` |

### Form layout patterns

```css
/* Vertical form (default) — constrain width for readability */
.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-width: 32rem;
}

/* Horizontal field (label left, control right) */
```
```html
<dui-field orientation="horizontal">
  <span slot="label">Dark mode</span>
  <dui-switch></dui-switch>
</dui-field>
```

---

## Icons

### Use dui-icon with lucide-static — not raw SVG with manual sizing

❌ **Wrong:**
```html
<svg width="16" height="16" style="color: gray;">...</svg>
```

✅ **Right (preferred — lucide-static):**
```ts
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Home } from "lucide-static";

html`<dui-icon>${unsafeHTML(Home)}</dui-icon>`
```

✅ **Also right (fallback — raw SVG in slot):**
```html
<dui-icon>
  <svg>...</svg>
</dui-icon>
```

`dui-icon` inherits `--icon-size` and `--icon-color` from parent components. Don't set `width`/`height` on the SVG.

### Icon-only buttons must have aria-label

❌ **Wrong:**
```html
<dui-button appearance="ghost" size="sm">
  <dui-icon>${unsafeHTML(X)}</dui-icon>
</dui-button>
```

✅ **Right:**
```html
<dui-button appearance="ghost" size="sm" aria-label="Close">
  <dui-icon>${unsafeHTML(X)}</dui-icon>
</dui-button>
```

### Decorative icons: aria-hidden

Icons next to visible text are decorative — hide them from screen readers:

```html
<dui-button variant="primary">
  <dui-icon aria-hidden="true">${unsafeHTML(Plus)}</dui-icon>
  Add item
</dui-button>
```

### Icons inherit sizing from parent components

DUI components set `--icon-size` and `--icon-color` internally. Don't override these unless you need a custom size.

❌ **Wrong:**
```html
<dui-button>
  <dui-icon style="--icon-size: 14px">${unsafeHTML(Save)}</dui-icon>
  Save
</dui-button>
```

✅ **Right:**
```html
<dui-button>
  <dui-icon>${unsafeHTML(Save)}</dui-icon>
  Save
</dui-button>
```

---

## Accessibility

DUI primitives handle most a11y internally: ARIA roles, keyboard navigation, focus trapping (dialogs), and screen reader announcements. These rules cover **consumer-side obligations** — what you must provide.

### Every input needs a visible label

❌ **Wrong:**
```html
<dui-input placeholder="Search..."></dui-input>
```

✅ **Right:**
```html
<dui-field>
  <span slot="label">Search</span>
  <dui-input placeholder="Search..."></dui-input>
</dui-field>
```

If the label must be visually hidden, use a screen-reader-only style — never omit the label:

```html
<dui-field>
  <span slot="label" class="sr-only">Search</span>
  <dui-input placeholder="Search..."></dui-input>
</dui-field>
```

```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

### Dialogs and alert-dialogs always need a title

❌ **Wrong:**
```html
<dui-dialog-popup>
  <p>Are you sure you want to delete this?</p>
  <dui-button variant="danger">Delete</dui-button>
</dui-dialog-popup>
```

✅ **Right:**
```html
<dui-dialog-popup>
  <span slot="title">Confirm deletion</span>
  <span slot="description">This action cannot be undone.</span>
  <dui-button variant="danger">Delete</dui-button>
</dui-dialog-popup>
```

If the title must be visually hidden, apply `class="sr-only"` to the span.

### Use semantic HTML in templates and page layouts

❌ **Wrong:**
```html
<div class="header">Dashboard</div>
<div class="main">...</div>
<div class="nav">...</div>
```

✅ **Right:**
```html
<h1>Dashboard</h1>
<main>...</main>
<nav aria-label="Main navigation">...</nav>
```

Use `<article>`, `<section>`, `<header>`, `<footer>`, `<time>`, `<nav>`, `<main>`, `<h1>`–`<h6>`. DUI components handle their internal semantics; you handle the page structure.

### Announce dynamic content with aria-live

When content updates without a page navigation (e.g., toast messages, loading states, filter results):

```html
<!-- Polite: waits for screen reader to finish -->
<div role="status" aria-live="polite">
  ${this.#resultCount} results found
</div>

<!-- Assertive: interrupts for errors -->
<div role="alert" aria-live="assertive">
  ${this.#errorMessage}
</div>
```

### Don't disable zoom

❌ **Wrong:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

✅ **Right:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Color is not the only indicator

Don't rely on color alone to convey status — combine with text, icons, or badges:

❌ **Wrong:**
```css
.status-active { color: green; }
.status-error { color: red; }
```

✅ **Right:**
```html
<dui-badge variant="primary">Active</dui-badge>
<dui-badge variant="danger">Error</dui-badge>
```

### What DUI handles automatically

You do **not** need to implement these — the primitives do it:
- Focus trapping in dialogs and alert-dialogs
- Keyboard navigation in menus, selects, comboboxes, tabs, accordions, toggle groups
- ARIA roles and states (`role="dialog"`, `aria-expanded`, `aria-selected`, etc.)
- Focus-visible ring styling on all interactive components
- Escape to close overlays
- Arrow key navigation in composite widgets

---

## Data table patterns

### Update data reactively — not just in firstUpdated

❌ **Wrong:**
```typescript
// Only sets data once, never updates when state changes
override firstUpdated() {
  const table = this.renderRoot.querySelector("dui-data-table") as any;
  table.columns = COLUMNS;
  table.data = this.#allData;
}
```

✅ **Right:**
```typescript
override firstUpdated() {
  const table = this.renderRoot.querySelector("dui-data-table") as any;
  if (table) table.columns = COLUMNS;
}

override updated() {
  const table = this.renderRoot.querySelector("dui-data-table") as any;
  if (table) table.data = this.#filteredData;
}
```

### Column definitions with cell renderers

```typescript
import type { ColumnDef } from "@dui/components/data-table";

const COLUMNS: ColumnDef<Order>[] = [
  { key: "id", header: "Order", width: "100px" },
  { key: "customer", header: "Customer", sortable: true },
  {
    key: "status",
    header: "Status",
    render: (value) => html`<dui-badge variant="primary">${value}</dui-badge>`,
  },
  {
    key: "total",
    header: "Total",
    sortable: true,
    render: (value) => html`$${Number(value).toFixed(2)}`,
  },
];
```

---

## Card vs styled div

### Use dui-card for structured content (title + body + actions). Use styled divs for simple containers.

❌ **Wrong — dui-card for a simple stat tile:**
```html
<dui-card>
  <span slot="title">Revenue</span>
  <span>$12,485</span>
</dui-card>
```

✅ **Right — styled div for a stat tile:**
```html
<div class="stat-card">
  <span class="label">Revenue</span>
  <span class="value">$12,485</span>
</div>
```
```css
.stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--surface-1);
  border: var(--border-width-thin) solid var(--border);
  border-radius: var(--radius-lg);
}
```

✅ **Right — dui-card for structured content:**
```html
<dui-card>
  <span slot="title">Recent Orders</span>
  <span slot="description">Last 30 days</span>
  <dui-data-table></dui-data-table>
  <dui-button slot="footer" variant="primary">Export</dui-button>
</dui-card>
```

**Rule of thumb:** If it has a title + body + footer/action, use `dui-card`. If it's just a visual container with content inside, use a styled div with design tokens.
