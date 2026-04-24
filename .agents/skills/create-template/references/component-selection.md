# Component Selection Guide

Which DUI component to use for each scenario. Follow these rules consistently — they encode correct patterns and prevent common mistakes.

---

## Input & Form Controls

### Text input (single line)
**Use:** `dui-input`
```html
<dui-input placeholder="Email address" type="email" @input-change=${...}></dui-input>
```

### Text input (multi-line)
**Use:** `dui-textarea`
```html
<dui-textarea placeholder="Describe your issue…" resize="vertical" @textarea-change=${...}></dui-textarea>
```

### Number input
**Use:** `dui-number-field` (has scrubbing, label, units) or `dui-input type="number"` (simple)
- Need scrubbing/units/fancy label → `dui-number-field`
- Just a plain numeric field → `dui-input type="number"`

### Incrementing a small integer (quantity, count)
**Use:** `dui-stepper`
```html
<dui-stepper .value=${qty} min="1" max="99" @value-change=${...}></dui-stepper>
```

### Binary on/off (settings toggle)
**Use:** `dui-switch`
- Settings panel, account preferences, feature flags → `dui-switch`
- "Agree to terms" checkbox in a form → `dui-checkbox`
```html
<dui-switch @checked-change=${...}>Enable notifications</dui-switch>
```

### Checkbox (form submission, list selection)
**Use:** `dui-checkbox`
```html
<dui-checkbox name="terms" @checked-change=${...}>I agree to the terms</dui-checkbox>
```

### Multiple checkboxes (related group)
**Use:** `dui-checkbox-group` wrapping `dui-checkbox` children
```html
<dui-checkbox-group @value-change=${...}>
  <dui-checkbox value="email">Email</dui-checkbox>
  <dui-checkbox value="sms">SMS</dui-checkbox>
  <dui-checkbox value="push">Push</dui-checkbox>
</dui-checkbox-group>
```

### Single selection from ≤5 options (visible at once)
**Use:** `dui-radio-group` (Base UI radio) containing `dui-radio` elements
```html
<!-- Radio group from Base UI — wrap dui-radio elements -->
<dui-radio value="light">Light</dui-radio>
<dui-radio value="dark">Dark</dui-radio>
<dui-radio value="system">System</dui-radio>
```

### Single selection from dropdown (6–50 options)
**Use:** `dui-select`
```html
<dui-select
  .options=${[{value:"us", label:"United States"}, ...]}
  @value-change=${...}
></dui-select>
```

### Single or multi selection with search/filter
**Use:** `dui-combobox`
```html
<!-- Single select with search -->
<dui-combobox
  .options=${countryOptions}
  placeholder="Search countries…"
  @value-change=${...}
></dui-combobox>

<!-- Multi select -->
<dui-combobox
  .options=${tagOptions}
  multiple
  placeholder="Select tags…"
  @values-change=${...}
></dui-combobox>
```

### Continuous range value (volume, opacity, zoom)
**Use:** `dui-slider`
```html
<dui-slider label="Volume" unit="%" .value=${75} @value-change=${...}></dui-slider>
```

### File upload
**Use:** `dui-dropzone`
```html
<dui-dropzone accept="image/*" @drop=${...}>
  Drop files here or click to browse
</dui-dropzone>
```

### Date selection
**Use:** `dui-calendar`
```html
<dui-calendar @value-change=${...}></dui-calendar>
```

---

## Data Display

### Status label / tag / pill
**Use:** `dui-badge`
- Never use `<span style="...">` for status badges
```html
<dui-badge variant="primary">Active</dui-badge>
<dui-badge variant="neutral">Draft</dui-badge>
<dui-badge variant="danger">Error</dui-badge>
```

### User profile picture
**Use:** `dui-avatar`
```html
<dui-avatar src=${user.avatar} alt=${user.name}>
  ${user.initials}  <!-- fallback when image fails to load -->
</dui-avatar>
```

### Loading indicator (indeterminate)
**Use:** `dui-spinner`
- Never use custom CSS animation for loading spinners
```html
<dui-spinner size="md"></dui-spinner>
<dui-spinner variant="lucide-loader-circle"></dui-spinner>
```

### Task completion / operation progress
**Use:** `dui-progress`
- Indeterminate progress (unknown duration): `<dui-progress .value=${null}>`
- Known progress: `<dui-progress value="60" max="100">`

### Tabular data with sorting and pagination
**Use:** `dui-data-table`
```html
<dui-data-table
  .columns=${columns}
  .data=${rows}
  pageSize=${10}
></dui-data-table>
```

### Horizontal or vertical divider
**Use:** `dui-separator` — never `<hr>` or border divs
```html
<dui-separator></dui-separator>
<dui-separator orientation="vertical"></dui-separator>
```

### Truncated text with tooltip on overflow
**Use:** `dui-trunc`
```html
<dui-trunc maxWidth="200px">${longText}</dui-trunc>
```

### Scrollable region with styled scrollbar
**Use:** `dui-scroll-area` — never `overflow: auto` on a div
```html
<dui-scroll-area style="max-height: 400px;">
  <!-- long content -->
</dui-scroll-area>
```

### Icon
**Use:** `dui-icon` wrapping an SVG — never raw SVG with manual `width`/`height`
```html
<dui-icon style="--icon-size: 1.25rem; --icon-color: var(--text-2);">
  <svg>...</svg>
</dui-icon>
```

---

## Actions

### Button
**Use:** `dui-button`
- Primary action → `variant="primary"`
- Secondary/neutral → `variant="neutral"` (default)
- Dangerous/destructive → `variant="danger"`
- Icon-only or ghost → `appearance="ghost"` or `appearance="outline"`
- Navigation (renders as `<a>`) → add `href` prop
```html
<dui-button variant="primary">Save</dui-button>
<dui-button variant="neutral" appearance="ghost">Cancel</dui-button>
<dui-button variant="danger">Delete Account</dui-button>
```

### Button with dropdown (primary + more options)
**Use:** `dui-split-button`
```html
<dui-split-button variant="primary" @dui-action=${...}>
  Save
  <dui-menu-item slot="menu" @click=${...}>Save as Draft</dui-menu-item>
  <dui-menu-item slot="menu" @click=${...}>Save and Publish</dui-menu-item>
</dui-split-button>
```

### Toggle button (bold, italic, view mode)
**Use:** `dui-toggle` (single) or `dui-toggle-group` (group)
```html
<!-- Single toggle -->
<dui-toggle @pressed-change=${...}>Bold</dui-toggle>

<!-- Exclusive group (like a radio) -->
<dui-toggle-group type="single" @value-change=${...}>
  <dui-toggle value="grid">Grid</dui-toggle>
  <dui-toggle value="list">List</dui-toggle>
</dui-toggle-group>

<!-- Multi-select group -->
<dui-toggle-group type="multiple" @value-change=${...}>
  <dui-toggle value="b">Bold</dui-toggle>
  <dui-toggle value="i">Italic</dui-toggle>
</dui-toggle-group>
```

### Toolbar (actions bar at top of content)
**Use:** `dui-toolbar`
```html
<dui-toolbar>
  <div slot="left">
    <dui-button appearance="ghost">Filter</dui-button>
  </div>
  <div slot="right">
    <dui-button variant="primary">Add New</dui-button>
  </div>
</dui-toolbar>
```

---

## Overlays & Dialogs

### Confirmation for any destructive action
**Use:** `dui-alert-dialog` — NEVER use `window.confirm()` or `dui-dialog` for destructive confirmations
```html
<dui-alert-dialog>
  <dui-alert-dialog-trigger>
    <dui-button variant="danger">Delete Account</dui-button>
  </dui-alert-dialog-trigger>
  <dui-alert-dialog-popup>
    <span slot="title">Delete Account</span>
    <span slot="description">This action cannot be undone. All your data will be permanently deleted.</span>
    <dui-alert-dialog-close>
      <dui-button variant="neutral" appearance="ghost">Cancel</dui-button>
    </dui-alert-dialog-close>
    <dui-button variant="danger" @click=${this.#deleteAccount}>Yes, Delete</dui-button>
  </dui-alert-dialog-popup>
</dui-alert-dialog>
```

### Non-destructive modal (form, details, create)
**Use:** `dui-dialog`
```html
<dui-dialog>
  <dui-dialog-trigger>
    <dui-button>Edit Profile</dui-button>
  </dui-dialog-trigger>
  <dui-dialog-popup width="480px">
    <span slot="title">Edit Profile</span>
    <!-- form content -->
    <dui-dialog-close>
      <dui-button variant="primary">Save</dui-button>
    </dui-dialog-close>
  </dui-dialog-popup>
</dui-dialog>
```

### Contextual info popup (interactive)
**Use:** `dui-popover`
- Interactive content (links, buttons inside) → `dui-popover`
- Read-only label → `dui-tooltip`
```html
<dui-popover>
  <dui-popover-trigger>
    <dui-button appearance="ghost">Help</dui-button>
  </dui-popover-trigger>
  <dui-popover-popup>
    <!-- rich content: links, descriptions, etc. -->
  </dui-popover-popup>
</dui-popover>
```

### Hover label on icon/button
**Use:** `dui-tooltip`
```html
<dui-tooltip>
  <dui-tooltip-trigger>
    <dui-button appearance="ghost" aria-label="Settings">⚙</dui-button>
  </dui-tooltip-trigger>
  <dui-tooltip-popup>Settings</dui-tooltip-popup>
</dui-tooltip>
```

### Dropdown menu (right-click or ⋯ button)
**Use:** `dui-menu`
```html
<dui-menu>
  <dui-button slot="trigger" appearance="ghost">⋯</dui-button>
  <dui-menu-item @click=${this.#edit}>Edit</dui-menu-item>
  <dui-menu-item @click=${this.#duplicate}>Duplicate</dui-menu-item>
  <dui-menu-item variant="danger" @click=${this.#delete}>Delete</dui-menu-item>
</dui-menu>
```

### Command palette / search with keyboard nav
**Use:** `dui-command`
```html
<dui-command>
  <dui-command-input placeholder="Search commands…"></dui-command-input>
  <dui-command-list>
    <dui-command-group heading="Pages">
      <dui-command-item value="dashboard">Dashboard</dui-command-item>
      <dui-command-item value="settings">Settings</dui-command-item>
    </dui-command-group>
  </dui-command-list>
</dui-command>
```

---

## Navigation

### App-level sidebar navigation
**Use:** `dui-sidebar-provider` with all sub-elements
- `collapsible="icon"` — collapses to icon-only strip
- `collapsible="offcanvas"` — slides fully off-screen
- `collapsible="none"` — always visible (only use for wide layouts)

### Page-level tabbed navigation
**Use:** `dui-tabs`
- Horizontal tabs for primary section switching
- `controls="footer"` for bottom-anchored tabs (mobile patterns)
```html
<dui-tabs defaultValue="profile">
  <dui-tabs-list>
    <dui-tab value="profile">Profile</dui-tab>
    <dui-tab value="security">Security</dui-tab>
    <dui-tab value="billing">Billing</dui-tab>
  </dui-tabs-list>
  <dui-tabs-panel value="profile"><!-- content --></dui-tabs-panel>
  <dui-tabs-panel value="security"><!-- content --></dui-tabs-panel>
  <dui-tabs-panel value="billing"><!-- content --></dui-tabs-panel>
</dui-tabs>
```

### Page location breadcrumb
**Use:** `dui-breadcrumb`
```html
<dui-breadcrumb>
  <dui-breadcrumb-item>
    <dui-breadcrumb-link><a href="/dashboard">Dashboard</a></dui-breadcrumb-link>
  </dui-breadcrumb-item>
  <dui-breadcrumb-separator></dui-breadcrumb-separator>
  <dui-breadcrumb-item>
    <dui-breadcrumb-page>Settings</dui-breadcrumb-page>
  </dui-breadcrumb-item>
</dui-breadcrumb>
```

---

## Disclosure & Expansion

### FAQ / expandable settings sections
**Use:** `dui-accordion`
```html
<dui-accordion>
  <dui-accordion-item value="general">
    <span slot="trigger">General Settings</span>
    <!-- panel content -->
  </dui-accordion-item>
  <dui-accordion-item value="advanced">
    <span slot="trigger">Advanced</span>
    <!-- panel content -->
  </dui-accordion-item>
</dui-accordion>
```

### Single expandable section (show more / filters)
**Use:** `dui-collapsible`
```html
<dui-collapsible>
  <span slot="trigger">Advanced Filters</span>
  <!-- expanded content -->
</dui-collapsible>
```

---

## Decision Quick-Reference

| Situation | Component |
|-----------|-----------|
| ≤5 options, pick one | `dui-radio` group |
| 6–50 options, pick one | `dui-select` |
| Many options, needs search | `dui-combobox` |
| Pick many from short list | `dui-checkbox-group` |
| Pick many with search | `dui-combobox` + `multiple` |
| On/off setting | `dui-switch` |
| Form checkbox | `dui-checkbox` |
| Continuous range | `dui-slider` |
| Integer count | `dui-stepper` |
| Dangerous action | `dui-alert-dialog` |
| Non-destructive modal | `dui-dialog` |
| Hover label | `dui-tooltip` |
| Interactive popup | `dui-popover` |
| Row actions | `dui-menu` |
| App navigation | `dui-sidebar-provider` |
| Section switching | `dui-tabs` |
| Status indicator | `dui-badge` |
| Loading | `dui-spinner` |
| Divider | `dui-separator` |
| Scrollable area | `dui-scroll-area` |
