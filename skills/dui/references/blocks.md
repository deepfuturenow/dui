# DUI Blocks — Composition Examples

Real-world UI blocks that demonstrate how to compose DUI components with CSS layout and design tokens. Each block is a self-contained Lit component in the docs site source.

**When building a UI that resembles one of these patterns, read the source file for the exact composition and CSS techniques.** The source files are at `packages/docs/src/create/blocks/`.

---

## block-settings
**Source:** `packages/docs/src/create/blocks/block-settings.ts` (122 lines)
**Components:** `dui-card`, `dui-switch`, `dui-checkbox`, `dui-slider`
**Pattern:** Settings panel with toggle rows inside a card

Key techniques:
- **Toggle rows with labels:** Each setting is a flex column with a label, description, and a `dui-switch` or `dui-checkbox`. The switch/checkbox uses `flex-direction: row-reverse; justify-content: space-between` to push the control to the right.
- **Section dividers:** Sections separated by `padding-bottom` + `border-bottom` on `:not(:last-child)` — no `dui-separator` needed when the dividers are structural.
- **Slider with header:** A flex row with `justify-content: space-between` for the label and current value readout above the slider.
- **Card part override:** `dui-card::part(root) { padding-bottom: ... }` to adjust card spacing.

---

## block-chat
**Source:** `packages/docs/src/create/blocks/block-chat.ts` (157 lines)
**Components:** `dui-select`, `dui-textarea`, `dui-button`, `dui-icon`, `dui-tooltip`, `dui-separator`
**Pattern:** Chat input with model selector, toolbar, and source chips

Key techniques:
- **Ghost textarea inside a styled card div:** A `.input-card` div with border/radius/background wraps a `dui-textarea variant="ghost"`. Focus ring is drawn on the card via `.input-card:focus-within { box-shadow: ... }` using focus ring tokens.
- **Toolbar with left/right groups:** Flex with `justify-content: space-between`. Left group has icon buttons, right group has settings + send.
- **Tooltip wrapping a button:** `dui-tooltip > dui-tooltip-trigger > dui-button` — the full compound hierarchy.
- **Vertical separator between buttons:** `dui-separator orientation="vertical"` with explicit height and padding.
- **Icon buttons:** `dui-button appearance="ghost" size="icon-sm"` with `dui-icon` containing inline SVG.

---

## block-events
**Source:** `packages/docs/src/create/blocks/block-events.ts` (169 lines)
**Components:** `dui-card`, `dui-badge`, `dui-toggle-group`, `dui-toggle`, `dui-button`, `dui-icon`
**Pattern:** Card with event timeline, badges, and toggle-group filter in footer

Key techniques:
- **Timeline with CSS pseudo-elements:** `.event::before` draws the vertical line, `.event::after` draws the dot. Pure CSS, no extra DOM.
- **Badge variants for categories:** `dui-badge variant="info"`, `variant="success"`, `variant="danger"` for event types. Outline badges for tags.
- **Toggle group in card footer slot:** `dui-toggle-group slot="footer"` places the filter controls in the card's footer. Footer background set via `dui-card::part(footer) { background: var(--sunken-1) }`.
- **Card header styling:** `dui-card::part(header) { border-bottom: ...; background-color: var(--surface-3) }` for a distinct header region.
- **Ghost icon button as card action:** `dui-button slot="action" appearance="ghost" size="icon-sm"`.

---

## block-payment
**Source:** `packages/docs/src/create/blocks/block-payment.ts` (197 lines)
**Components:** `dui-card`, `dui-collapsible`, `dui-icon`
**Pattern:** Payment/order card with collapsible cart and order total footer

Key techniques:
- **Rich content in card title slot:** The title slot contains a flex row with an avatar div and text stack, not just plain text.
- **Collapsible inside card body:** `dui-collapsible default-open` in the default slot. Trigger styled with `::part(trigger) { padding-inline: 0 }` and `::part(content) { padding-inline: 0 }` to remove default padding.
- **Card footer for totals:** `dui-card::part(footer) { border-top: ...; padding-top: ... }` — the footer slot contains line items and a total with a top border.
- **Card gap override:** `dui-card::part(root) { gap: var(--space-4) }` to tighten internal spacing.

---

## block-members
**Source:** `packages/docs/src/create/blocks/block-members.ts` (119 lines)
**Components:** `dui-card`, `dui-data-table`, `dui-badge`, `dui-input`, `dui-button`
**Pattern:** Card with search filter, data table, and badge cell renderer

Key techniques:
- **Data table with custom cell renderer:** Column definition uses `render: (value) => html\`<dui-badge ...>\`\`` to render status badges inside table cells.
- **Column definitions typed:** `ColumnDef<Member>[]` with `key`, `header`, `sortable`, `width`, and `render`.
- **Search filter above table:** A flex row with `dui-input` (flex: 1) and button. Filter state drives a computed `#filteredData` getter that updates the table's `data` property.
- **Card action slot:** `dui-button slot="action" size="sm"` for the "Invite" button in the card header.

---

## block-analytics
**Source:** `packages/docs/src/create/blocks/block-analytics.ts` (144 lines)
**Components:** `dui-chart`
**Pattern:** Chart card with data loaded from CSV

Key techniques:
- **Chart sizing:** `dui-chart { display: block; width: 100% }` inside a wrapper with negative margin to bleed to card edges.
- **Observable Plot spec:** Area mark + rule mark composed in a `.spec` object with typed data, custom fills using `var(--chart-color-1)`, and margin configuration.
- **Async data loading:** `connectedCallback()` fetches CSV, parses it, sets `@state()` data, which triggers re-render with the chart spec.

---

## block-traffic
**Source:** `packages/docs/src/create/blocks/block-traffic.ts` (124 lines)
**Components:** `dui-card`, `dui-chart`, `dui-toggle-group`, `dui-toggle`
**Pattern:** Bar chart card with toggle-group period selector and stat footer

Key techniques:
- **Toggle group as card action:** `dui-toggle-group slot="action"` places the period selector in the card header's action area.
- **Card action alignment:** `dui-card::part(root) { --card-action-offset-top: 0; --card-action-offset-end: 0 }` to align the action flush.
- **Stat grid in footer:** A 3-column CSS grid in the footer slot with label/value pairs. Accent color for positive values via `color: var(--accent)`.
- **Bar chart spec:** `Plot.barY()` with `fill: "var(--chart-color-1)"`, rounded top corners via `ry1: 3`, and `Plot.pointerX()` tip for hover.

---

## block-token-usage
**Source:** `packages/docs/src/create/blocks/block-token-usage.ts` (151 lines)
**Components:** `dui-card`, `dui-button`
**Pattern:** Usage dashboard with model budget cards, progress bars, and full-width footer button

Key techniques:
- **Nested cards inside a card:** `.model-card` divs with `background: var(--surface-1); border: ... var(--border); border-radius: var(--radius-md)` create inner cards within the main card body.
- **Custom progress bar:** A `.progress-track` div with inner `.progress-fill` div sized via `width: ${pct}%`. Uses `--accent` for the fill color and semi-transparent foreground for the track.
- **Full-width footer button:** `dui-button slot="footer" variant="primary"` with `--button-width: 100%` to stretch across the card footer.
- **Card footer styling:** `dui-card::part(footer) { border-top: ...; background-color: var(--sunken-1) }` for a distinct footer region.
- **Number formatting:** Helper functions for human-readable token counts (`18.4M`) and costs (`$55.20`).

---

## block-create-project
**Source:** `packages/docs/src/create/blocks/block-create-project.ts` (61 lines)
**Components:** `dui-card`, `dui-field`, `dui-input`, `dui-textarea`, `dui-button`, `dui-icon`
**Pattern:** Simple form card with labeled fields and footer actions

Key techniques:
- **dui-field for label wiring:** `dui-field > span[slot="label"] + dui-input` — the field component handles ARIA association between label and input.
- **Content gap:** `.content { display: flex; flex-direction: column; gap: var(--space-5) }` for vertical spacing between fields.
- **Multiple footer buttons:** Two `dui-button slot="footer"` elements — a soft cancel and a primary submit — laid out by the card's footer grid.
- **Close icon in card action:** `dui-button slot="action" appearance="ghost" size="icon-sm"` with an X icon.

---

## block-user-account
**Source:** `packages/docs/src/create/blocks/block-user-account.ts` (75 lines)
**Components:** `dui-avatar`, `dui-menu`, `dui-menu-item`, `dui-button`, `dui-icon`
**Pattern:** Profile card with avatar, menu dropdown, and link button

Key techniques:
- **Menu with button trigger:** `dui-menu > dui-button[slot="trigger"] appearance="ghost" size="icon-sm"` — the three-dot icon button opens a dropdown.
- **Danger menu item:** `dui-menu-item variant="danger"` for destructive actions.
- **Large avatar:** `dui-avatar size="var(--space-20)"` with fallback initials and image URL.
- **Link-style button:** `dui-button appearance="link"` for a "View network" action.
- **Absolute-positioned menu:** The `.more-btn` wrapper uses `position: absolute; top; right` to place the menu in the card corner.

---

## block-invite-team
**Source:** `packages/docs/src/create/blocks/block-invite-team.ts` (103 lines)
**Components:** `dui-card`, `dui-input`, `dui-select`, `dui-button`, `dui-separator`, `dui-icon`
**Pattern:** Invite form with repeating rows, separator, and share link section

Key techniques:
- **Input + select row:** Flex row with `dui-input { flex: 1 }` and `dui-select { width: 120px }` for email + role pairs.
- **Separator between sections:** `dui-separator` divides the invite form from the share link section.
- **Read-only input for share link:** `dui-input value="..." readonly` paired with an icon-only copy button.
- **Full-width footer button:** `--button-width: 100%` on the Send Invites button.
- **Select with object options:** `.options=${[{ label: "Editor", value: "editor" }, ...]}` — options passed as array of objects.

---

## block-faq
**Source:** `packages/docs/src/create/blocks/block-faq.ts` (63 lines)
**Components:** `dui-accordion`, `dui-accordion-item`
**Pattern:** FAQ section with accordion

Key techniques:
- **Default open item:** `dui-accordion default-value='["q3"]'` opens the third item on load. Value is a JSON array string of item values.
- **Trigger and content slots:** `span[slot="trigger"]` for the question, `span` in default slot for the answer. Answer styled with `color: var(--text-2)`.
- **Standalone block (no card):** Uses `blockBase` styles directly on `:host` for the card appearance, rather than wrapping in `dui-card`.

---

## block-calendar
**Source:** `packages/docs/src/create/blocks/block-calendar.ts` (105 lines)
**Components:** `dui-card`, `dui-calendar`, `dui-button`
**Pattern:** Date/time picker with calendar and time slot buttons

Key techniques:
- **Container query for responsive layout:** `container-type: inline-size` on `:host`. At narrow widths, calendar and time slots stack vertically. `@container (min-width: 420px)` switches to side-by-side with `flex-direction: row`.
- **Calendar with default date:** `dui-calendar default-value="${iso}"` using today's date as ISO string.
- **Full-width buttons in a column:** Time slot buttons with `--button-width: 100%` inside a flex column.
- **Card gap override:** `dui-card::part(root) { gap: var(--space-2) }` for tighter spacing.

---

## block-watchlist
**Source:** `packages/docs/src/create/blocks/block-watchlist.ts` (223 lines)
**Components:** (none — pure vanilla Lit + SVG)
**Pattern:** Stock ticker chips with inline sparkline charts

Key techniques:
- **Two-column grid:** `.chips { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3) }`.
- **SVG sparkline generation:** `sparklinePath()` function computes SVG path data from a number array. Renders a `<path>` for the line and a gradient-filled area.
- **Color-coded positive/negative:** Conditional CSS classes (`.up` / `.down`) with green/red colors for price changes.
- **Design token usage throughout:** Spacing (`--space-*`), typography (`--text-sm`, `--font-weight-semibold`, `--font-mono`), borders, radii, and surface colors.

---

## block-map
**Source:** `packages/docs/src/create/blocks/block-map.ts` (220 lines)
**Components:** `dui-map`, `dui-map-controls`, `dui-map-marker`, `dui-map-marker-content`, `dui-map-marker-tooltip`
**Pattern:** Map with location list and click-to-fly interaction

Key techniques:
- **Map in a fixed-height container:** `.map-wrap { height: 14rem }` with `dui-map { width: 100%; height: 100% }`.
- **Markers from data:** `LOCATIONS.map()` renders `dui-map-marker` with `.longitude` and `.latitude` properties. Each marker has a `dui-map-marker-tooltip` sub-component.
- **Click-to-fly:** Clicking a location card calls `map.flyTo({ center, zoom, duration })` on the `dui-map` element.
- **Active state on location cards:** Conditional `.active` class with `background: var(--surface-2); outline: ... var(--accent)` for the selected location.
- **Sunken background for list items:** `.location { background: var(--sunken-1) }` — uses the sunken surface token for inset cards.
