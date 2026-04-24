# UX Design Principles

Apply these principles when generating every UI layout. Good design is not decoration — it's the structure that makes software learnable, efficient, and trustworthy. Each principle below includes concrete implications for DUI component usage.

---

## 1. Visual Hierarchy

**Principle:** Guide the eye through a predictable order — primary → secondary → tertiary. Users should know what to look at first without thinking.

**How to achieve it:**
- **Size:** page titles use `--font-size-2xl` or `--font-size-3xl`, body text `--font-size-base` or `--font-size-sm`
- **Weight:** headings at `--font-weight-semibold` (600), body at `--font-weight-regular` (400)
- **Color:** primary content uses `--text-1`, supporting content `--text-2`, metadata `--text-3`
- **Contrast:** the primary action (CTA button) uses `variant="primary"`, secondary uses `variant="neutral"`, danger uses `variant="danger"`
- **Spacing:** larger gaps between sections than between related items — 32px between sections, 8–16px between items in a group

**DUI pattern:**
```html
<!-- Page header with clear hierarchy -->
<div style="padding: var(--space-6) var(--space-8);">
  <h1 style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); color: var(--foreground);">
    Account Settings
  </h1>
  <p style="font-size: var(--font-size-sm); color: var(--text-2); margin-top: var(--space-1);">
    Manage your profile and preferences
  </p>
</div>
```

---

## 2. Whitespace and Breathing Room

**Principle:** Empty space is not wasted space. Whitespace creates grouping, focus, and visual rest. Cramped layouts feel stressful; spacious layouts feel professional.

**Spacing guidelines:**
- Page padding: `var(--space-6)` to `var(--space-8)` (24–32px) from edges
- Section spacing: `var(--space-8)` to `var(--space-12)` (32–48px) between major sections
- Item spacing within a group: `var(--space-3)` to `var(--space-4)` (12–16px)
- Label-to-control gap: `var(--space-2)` to `var(--space-3)` (8–12px)
- Card internal padding: `var(--space-5)` to `var(--space-6)` (20–24px)

**Common mistakes to avoid:**
- Don't stack full-width elements without padding — always use `padding: var(--space-6)`
- Don't use `margin: auto` for centering — use flexbox with `align-items` / `justify-content`
- Don't crowd action buttons — minimum `var(--space-2)` gap between buttons

---

## 3. Progressive Disclosure

**Principle:** Show only what's needed for the current task. Hide complexity until the user requests it. This reduces cognitive load and makes interfaces learnable.

**Patterns:**
- **Settings pages:** show the most-used settings first; hide advanced/dangerous settings in a collapsible section or separate "Advanced" tab
- **Forms:** show required fields first, optional fields labeled as optional, conditional fields only when relevant
- **Tables:** show key columns; allow expanding rows for details
- **Dialogs:** only open a confirmation dialog (`dui-alert-dialog`) for destructive/irreversible actions

**DUI components for progressive disclosure:**
- `dui-accordion` — collapsible sections for advanced settings
- `dui-tabs` — separate concerns without hiding them entirely
- `dui-collapsible` — single expandable section
- `dui-popover` — inline additional info without a full modal
- `dui-tooltip` — explain icons/abbreviations on hover

---

## 4. Action Placement

**Principle:** Place primary actions where users complete their journey. Secondary actions should be less prominent and further from the primary CTA.

**Rules:**
- **Forms:** submit button at the bottom-right, cancel at bottom-left (or inline before submit)
- **Dialogs:** confirm (primary) on the right, cancel on the left — this matches browser conventions
- **Toolbars:** primary action on the right, secondary/filtering on the left
- **Tables:** row actions (Edit, Delete) in the last column or in a `dui-menu` triggered by a `⋯` button
- **Empty states:** single primary CTA centered in the empty area

**DUI pattern:**
```html
<!-- Form footer with correct action placement -->
<div style="display: flex; justify-content: flex-end; gap: var(--space-2); padding-top: var(--space-4); border-top: 1px solid var(--border);">
  <dui-button variant="neutral" appearance="ghost">Cancel</dui-button>
  <dui-button variant="primary">Save Changes</dui-button>
</div>
```

---

## 5. Feedback and System Status

**Principle:** Users should always know what's happening. Provide immediate, specific feedback for every action.

**Patterns:**
- **Loading:** show `dui-spinner` inline where the result will appear — not a full-page overlay unless necessary
- **Progress:** use `dui-progress` for operations with a known duration/steps
- **Empty states:** never show a blank page — explain why it's empty and what to do
- **Error messages:** show errors close to where they occurred (field-level validation, not just a banner)
- **Success:** brief visual confirmation (button state change, inline confirmation text) — avoid modal dialogs for success

**DUI pattern:**
```html
<!-- Inline loading state in a button -->
<dui-button variant="primary" ?disabled=${this.submitting}>
  ${this.submitting
    ? html`<dui-spinner size="sm"></dui-spinner> Saving…`
    : "Save Changes"
  }
</dui-button>
```

---

## 6. Consistent Interaction Patterns

**Principle:** Use the same component for the same type of interaction everywhere. Consistency reduces learning time and errors.

**Mapping:**
- Text input → always `dui-input` (never `<input>` directly)
- Long text → `dui-textarea`
- Binary toggle → `dui-switch` (for settings), `dui-checkbox` (for forms)
- Single selection from short list (≤5) → `dui-radio-group`
- Single selection from long list → `dui-select` or `dui-combobox`
- Multi selection → `dui-checkbox-group` (short list) or `dui-combobox` with `multiple` (long list)
- Dangerous confirmation → `dui-alert-dialog` (never just `confirm()`)
- Contextual info → `dui-tooltip` (read-only) or `dui-popover` (interactive)
- Navigation → `dui-sidebar-provider` for app nav, `dui-tabs` for sub-sections
- Status → `dui-badge` (categorical), `dui-progress` (progress)

---

## 7. Layout Architecture

**Principle:** Every screen has one dominant layout pattern. Use it consistently before adding exceptions.

### App Shell (sidebar layout)
```
┌─────────────────────────────────────────────┐
│  dui-sidebar-provider                        │
│  ┌──────────┐ ┌───────────────────────────┐ │
│  │ sidebar  │ │   dui-sidebar-inset        │ │
│  │  nav     │ │   ┌─ toolbar ──────────┐  │ │
│  │          │ │   │  dui-toolbar       │  │ │
│  │          │ │   └────────────────────┘  │ │
│  │          │ │   ┌─ content ──────────┐  │ │
│  │          │ │   │  (page content)    │  │ │
│  └──────────┘ └───────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Settings Page (two-column form)
```
┌─────────────────────────────────────────────┐
│  Page Header                                 │
├─────────────────────────────────────────────┤
│  dui-tabs (Profile | Security | Billing)     │
├──────────────────┬──────────────────────────┤
│  Section label   │  Form controls           │
│  Section desc    │  (dui-input, dui-switch) │
├──────────────────┼──────────────────────────┤
│  Section label   │  Form controls           │
└──────────────────┴──────────────────────────┘
```

### Dashboard (card grid)
```
┌─────────────────────────────────────────────┐
│  Page Header + action buttons                │
├────────────────┬────────────────┬────────────┤
│  Stat Card     │  Stat Card     │ Stat Card  │
├────────────────┴────────────────┴────────────┤
│  Main Chart / Table (full width)             │
├────────────────┬────────────────────────────┤
│  Secondary list│  Activity feed             │
└────────────────┴────────────────────────────┘
```

---

## 8. Responsive Patterns

**Principle:** Design for narrow viewports first; expand gracefully. Don't assume wide layouts.

**Practical rules:**
- Sidebar collapses to icon-only or off-canvas on narrow screens — use `dui-sidebar-provider` with `collapsible="icon"` or `collapsible="offcanvas"`
- Card grids use `grid-template-columns: repeat(auto-fill, minmax(min, max))` — never fixed column counts
- Tables on narrow screens: either allow horizontal scroll inside `dui-scroll-area`, or collapse to card list
- Forms stack vertically on narrow screens — label above, control below (not side by side)
- Dialogs use `width: min(480px, 95vw)` so they don't overflow on mobile

---

## 9. Typography Rhythm

**Principle:** Consistent type sizing creates visual flow. Every text element should sit on the scale — no one-off sizes.

**Common assignments:**
- Page title: `--font-size-2xl` / semibold / `--foreground`
- Section heading: `--font-size-lg` / semibold / `--foreground`
- Card title: `--font-size-base` or `--font-size-md` / semibold / `--text-1`
- Body text: `--font-size-base` / regular / `--text-1`
- Supporting text: `--font-size-sm` / regular / `--text-2`
- Captions, labels, metadata: `--font-size-xs` / medium / `--text-3`

---

## 10. Error States and Edge Cases

Always generate components that handle these states:

1. **Empty state** — what does the UI look like with no data? Provide a centered message + primary action.
2. **Loading state** — show skeleton or spinner; never a blank area.
3. **Error state** — show a clear message with a recovery action (Retry, Go Back, etc.).
4. **Single item** — does the list/table look reasonable with just one row?
5. **Overflow** — does long text truncate gracefully? (`dui-trunc`, `text-overflow: ellipsis`)

```html
<!-- Empty state pattern -->
<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-4); padding: var(--space-16); color: var(--text-2); text-align: center;">
  <dui-icon style="--icon-size: 2.5rem; opacity: 0.4;"><!-- icon --></dui-icon>
  <div>
    <p style="font-weight: var(--font-weight-medium); color: var(--text-1);">No items yet</p>
    <p style="font-size: var(--font-size-sm); margin-top: var(--space-1);">Add your first item to get started</p>
  </div>
  <dui-button variant="primary">Add Item</dui-button>
</div>
```
