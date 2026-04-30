# DUI Blocks — Composition Examples

Real-world UI blocks that demonstrate how to compose DUI components with CSS layout and design tokens. Each block is a self-contained Lit component in the docs site source.

**When building a UI that resembles one of these patterns, fetch the source file for the exact composition and CSS techniques.** Source links point to raw files on GitHub — fetch them with your HTTP/curl tool when you need the full code.

---

## Page Shells

Full-page layout patterns from `dui-sidebar-provider` down to content. Use these as the starting point for any page with sidebar navigation.

### block-dashboard-shell
**Components:** `dui-sidebar-provider`, `dui-sidebar`, `dui-sidebar-header`, `dui-sidebar-content`, `dui-sidebar-group`, `dui-sidebar-group-label`, `dui-sidebar-menu`, `dui-sidebar-menu-item`, `dui-sidebar-menu-button`, `dui-sidebar-footer`, `dui-sidebar-inset`, `dui-sidebar-trigger`, `dui-breadcrumb`, `dui-card-grid`, `dui-data-table`
**Pattern:** Dashboard with sidebar nav, breadcrumbs, stat cards, and a data table

Component tree:
```html
<dui-sidebar-provider>
  <dui-sidebar>
    <dui-sidebar-header>
      <!-- Logo / app name -->
    </dui-sidebar-header>
    <dui-sidebar-content>
      <dui-sidebar-group>
        <dui-sidebar-group-label slot="label">Main</dui-sidebar-group-label>
        <dui-sidebar-menu>
          <dui-sidebar-menu-item>
            <dui-sidebar-menu-button href="/dashboard" active>
              <dui-icon slot="icon">...</dui-icon>
              Dashboard
            </dui-sidebar-menu-button>
          </dui-sidebar-menu-item>
          <!-- more items -->
        </dui-sidebar-menu>
      </dui-sidebar-group>
    </dui-sidebar-content>
    <dui-sidebar-footer>
      <!-- User avatar / settings -->
    </dui-sidebar-footer>
  </dui-sidebar>

  <dui-sidebar-inset>
    <!-- Top bar with trigger + breadcrumbs -->
    <header class="top-bar">
      <dui-sidebar-trigger></dui-sidebar-trigger>
      <dui-separator orientation="vertical"></dui-separator>
      <dui-breadcrumb>
        <dui-breadcrumb-item><dui-breadcrumb-link><a href="/">Home</a></dui-breadcrumb-link></dui-breadcrumb-item>
        <dui-breadcrumb-separator></dui-breadcrumb-separator>
        <dui-breadcrumb-item><dui-breadcrumb-page>Dashboard</dui-breadcrumb-page></dui-breadcrumb-item>
      </dui-breadcrumb>
    </header>

    <!-- Page content -->
    <main class="page-content">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Overview of recent activity and key metrics.</p>
      </div>

      <!-- Stat cards -->
      <dui-card-grid columns="4">
        <div class="stat-card">...</div>
        <div class="stat-card">...</div>
        <div class="stat-card">...</div>
        <div class="stat-card">...</div>
      </dui-card-grid>

      <!-- Data table in a card -->
      <dui-card>
        <span slot="title">Recent Orders</span>
        <dui-data-table></dui-data-table>
      </dui-card>
    </main>
  </dui-sidebar-inset>
</dui-sidebar-provider>
```

Key CSS: Provider needs `min-height: 100dvh`. Top bar: `display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4); border-bottom: var(--border-width-thin) solid var(--border)`. Page content: `padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-6)`. Stat tiles are styled divs (not `dui-card`) — see rules.md → Card vs styled div.

---

### block-settings-shell
**Components:** `dui-sidebar-provider`, `dui-sidebar`, `dui-sidebar-inset`, `dui-breadcrumb`, `dui-tabs`, `dui-field`, `dui-input`, `dui-select`, `dui-switch`, `dui-button`
**Pattern:** Settings page with sidebar nav and tabbed form sections

Component tree:
```html
<dui-sidebar-provider>
  <dui-sidebar>
    <!-- Same sidebar structure as dashboard-shell -->
  </dui-sidebar>

  <dui-sidebar-inset>
    <header class="top-bar">...</header>

    <main class="page-content">
      <div class="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      <dui-tabs default-value="profile">
        <dui-tabs-list>
          <dui-tab value="profile">Profile</dui-tab>
          <dui-tab value="notifications">Notifications</dui-tab>
          <dui-tab value="billing">Billing</dui-tab>
          <dui-tabs-indicator></dui-tabs-indicator>
        </dui-tabs-list>

        <dui-tabs-panel value="profile">
          <div class="form-section">
            <dui-field>
              <span slot="label">Display Name</span>
              <dui-input value="Jane Doe"></dui-input>
            </dui-field>
            <dui-field>
              <span slot="label">Email</span>
              <dui-input type="email" value="jane@acme.co"></dui-input>
            </dui-field>
            <dui-button variant="primary">Save Changes</dui-button>
          </div>
        </dui-tabs-panel>

        <dui-tabs-panel value="notifications">
          <div class="form-section">
            <dui-switch>Email notifications</dui-switch>
            <dui-switch>Push notifications</dui-switch>
          </div>
        </dui-tabs-panel>
      </dui-tabs>
    </main>
  </dui-sidebar-inset>
</dui-sidebar-provider>
```

Key CSS: Form sections use `.form-section { display: flex; flex-direction: column; gap: var(--space-5); max-width: 32rem; }`. Save button is the last flex child.

---

### block-list-shell
**Components:** `dui-sidebar-provider`, `dui-sidebar`, `dui-sidebar-inset`, `dui-breadcrumb`, `dui-input`, `dui-select`, `dui-button`, `dui-data-table`, `dui-badge`
**Pattern:** List view with sidebar nav, filter bar, and data table

Component tree:
```html
<dui-sidebar-provider>
  <dui-sidebar>
    <!-- Same sidebar structure as dashboard-shell -->
  </dui-sidebar>

  <dui-sidebar-inset>
    <header class="top-bar">...</header>

    <main class="page-content">
      <div class="page-header">
        <h1>Members</h1>
        <p>Manage team members and their roles.</p>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <dui-input placeholder="Search members..."></dui-input>
        <dui-select .options=${[{ label: "All roles", value: "" }, { label: "Admin", value: "admin" }]}></dui-select>
        <dui-button variant="primary">Invite</dui-button>
      </div>

      <!-- Data table (set columns/data imperatively in firstUpdated) -->
      <dui-data-table></dui-data-table>
    </main>
  </dui-sidebar-inset>
</dui-sidebar-provider>
```

Key CSS: Filter bar uses `display: flex; gap: var(--space-2); dui-input { flex: 1; }`. Data table columns/data set imperatively in `firstUpdated()`. Badge cell renderers via column `render` functions.

---

## Card-Level Blocks

---

## block-settings
**Source:** [`block-settings.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-settings.ts) (122 lines)
**Components:** `dui-card`, `dui-switch`, `dui-checkbox`, `dui-slider`
**Pattern:** Settings panel with toggle rows inside a card

Key patterns: Toggle rows use `flex-direction: row-reverse; justify-content: space-between` to push controls right. Section dividers via `border-bottom` on `:not(:last-child)`.

---

## block-chat
**Source:** [`block-chat.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-chat.ts) (157 lines)
**Components:** `dui-select`, `dui-textarea`, `dui-button`, `dui-icon`, `dui-tooltip`, `dui-separator`
**Pattern:** Chat input with model selector, toolbar, and source chips

Key patterns: Ghost textarea inside a `.input-card` div with `focus-within` ring. Toolbar split with `justify-content: space-between`. Tooltip compound: `dui-tooltip > dui-tooltip-trigger > dui-button`. Icon buttons: `appearance="ghost" size="icon-sm"` with `dui-icon` + `lucide-static`.

---

## block-events
**Source:** [`block-events.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-events.ts) (169 lines)
**Components:** `dui-card`, `dui-badge`, `dui-toggle-group`, `dui-toggle`, `dui-button`, `dui-icon`
**Pattern:** Card with event timeline, badges, and toggle-group filter in footer

Key patterns: Timeline via CSS pseudo-elements (`.event::before` for line, `::after` for dot). Badge variants for categories. Toggle group in card footer slot. Card part overrides: `::part(header)`, `::part(footer)` for backgrounds.

---

## block-payment
**Source:** [`block-payment.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-payment.ts) (197 lines)
**Components:** `dui-card`, `dui-collapsible`, `dui-icon`
**Pattern:** Payment/order card with collapsible cart and order total footer

Key patterns: Rich content in title slot (avatar + text stack). Collapsible inside card body with `::part(trigger/content) { padding-inline: 0 }`. Card footer for totals. Gap override: `dui-card::part(root) { gap: ... }`.

---

## block-members
**Source:** [`block-members.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-members.ts) (119 lines)
**Components:** `dui-card`, `dui-data-table`, `dui-badge`, `dui-input`, `dui-button`
**Pattern:** Card with search filter, data table, and badge cell renderer

Key patterns: Badge cell renderer in column definitions. Search filter with reactive `#filteredData` updating `table.data` in `updated()`. Card action slot for header buttons.

---

## block-analytics
**Source:** [`block-analytics.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-analytics.ts) (144 lines)
**Components:** `dui-chart`
**Pattern:** Chart card with data loaded from CSV

Key patterns: Chart uses `display: block; width: 100%` with negative margin to bleed. Plot spec with custom fills using `var(--chart-color-1)`. Async CSV loading in `connectedCallback()`.

---

## block-traffic
**Source:** [`block-traffic.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-traffic.ts) (124 lines)
**Components:** `dui-card`, `dui-chart`, `dui-toggle-group`, `dui-toggle`
**Pattern:** Bar chart card with toggle-group period selector and stat footer

Key patterns: Toggle group as card action. Action alignment: `--card-action-offset-top: 0; --card-action-offset-end: 0`. Stat grid in footer (3-column grid). Bar chart with `Plot.barY()` and hover tip.

---

## block-token-usage
**Source:** [`block-token-usage.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-token-usage.ts) (151 lines)
**Components:** `dui-card`, `dui-button`
**Pattern:** Usage dashboard with model budget cards, progress bars, and full-width footer button

Key patterns: Nested styled divs (`.model-card`) inside a `dui-card`. Custom progress bar with `.progress-track`/`.progress-fill`. Full-width footer: `--button-width: 100%`. Footer styling: `::part(footer) { border-top; background-color: var(--sunken-1) }`.

---

## block-create-project
**Source:** [`block-create-project.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-create-project.ts) (61 lines)
**Components:** `dui-card`, `dui-field`, `dui-input`, `dui-textarea`, `dui-button`, `dui-icon`
**Pattern:** Simple form card with labeled fields and footer actions

Key patterns: `dui-field` for ARIA wiring. Content gap: `flex-direction: column; gap: var(--space-5)`. Multiple footer buttons (cancel + submit). Close icon in card action slot.

---

## block-user-account
**Source:** [`block-user-account.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-user-account.ts) (75 lines)
**Components:** `dui-avatar`, `dui-menu`, `dui-menu-item`, `dui-button`, `dui-icon`
**Pattern:** Profile card with avatar, menu dropdown, and link button

Key patterns: Menu trigger: `dui-button[slot="trigger"] appearance="ghost" size="icon-sm"`. Danger menu item. Large avatar: `size="var(--space-20)"`. Absolute-positioned menu in card corner.

---

## block-invite-team
**Source:** [`block-invite-team.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-invite-team.ts) (103 lines)
**Components:** `dui-card`, `dui-input`, `dui-select`, `dui-button`, `dui-separator`, `dui-icon`
**Pattern:** Invite form with repeating rows, separator, and share link section

Key patterns: Input + select row with `flex: 1` on input. Separator between sections. Read-only input for share link. Full-width footer: `--button-width: 100%`. Select options as `{ label, value }` objects.

---

## block-faq
**Source:** [`block-faq.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-faq.ts) (63 lines)
**Components:** `dui-accordion`, `dui-accordion-item`
**Pattern:** FAQ section with accordion

Key patterns: Default open via `default-value='["q3"]'` (JSON array string). Trigger slot for questions, default slot for answers with `color: var(--text-2)`.

---

## block-calendar
**Source:** [`block-calendar.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-calendar.ts) (105 lines)
**Components:** `dui-card`, `dui-calendar`, `dui-button`
**Pattern:** Date/time picker with calendar and time slot buttons

Key patterns: Container query for responsive layout (`@container (min-width: 420px)` switches to row). Calendar with `default-value="${iso}"`. Full-width time slot buttons. Card gap override.

---

## block-watchlist
**Source:** [`block-watchlist.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-watchlist.ts) (223 lines)
**Components:** (none — pure vanilla Lit + SVG)
**Pattern:** Stock ticker chips with inline sparkline charts

Key patterns: Two-column grid. SVG sparkline generation via `sparklinePath()`. Color-coded `.up`/`.down` classes. All spacing, typography, and colors use design tokens.

---

## block-map
**Source:** [`block-map.ts`](https://raw.githubusercontent.com/deepfuturenow/dui/main/packages/docs/src/create/blocks/block-map.ts) (220 lines)
**Components:** `dui-map`, `dui-map-controls`, `dui-map-marker`, `dui-map-marker-content`, `dui-map-marker-tooltip`
**Pattern:** Map with location list and click-to-fly interaction

Key patterns: Map in fixed-height container. Markers from data array. Click-to-fly via `map.flyTo()`. Active state with `outline: ... var(--accent)`. Sunken surface for list items.
