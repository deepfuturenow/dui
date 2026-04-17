# Dashboard Templates Plan

> Adapted from gen-ui-1's dashboard-templates plan for the DUI component library.

## Context

We audited three real-world monitoring dashboards and identified recurring composable patterns. This plan defines a template set for assembling dense, multi-panel dashboard UIs from DUI components and templates.

## Key Architectural Decision: Components vs Templates

The Tier 1 "structural" items from the original plan split across two layers:

| Item | Layer | Rationale |
|---|---|---|
| `card-grid` | **Component** (`@dui/components`) | Pure CSS grid layout — no internal composition, theme-agnostic, any theme re-skins it |
| `toolbar` | **Component** (already exists) | Pure 3-slot layout — theme-agnostic |
| `section-panel` | **Template** (`@dui/theme-default-templates`) | Composes badge, icon, tooltip, collapsible — makes theme-specific variant choices |
| `page-header` | **Template** (`@dui/theme-default-templates`) | Composes breadcrumb, arranges title/subtitle/actions — theme-specific layout opinions |

**The litmus test:** Would a different theme want to re-implement this from scratch, or just re-skin it?
- Re-skin → component
- Re-implement → template

## Status

### Done

- [x] `dui-card-grid` component — responsive grid, `columns` prop (1–4), `@media` breakpoints
- [x] `dui-toolbar` component — already existed

### Next: Templates

#### ~~Section Panel~~ ✅
- Bordered container with header bar (title, icon, badge count, LIVE indicator, help tooltip, trailing actions) and slotted body
- The fundamental dashboard building block — every panel in a monitoring dashboard is a section-panel
- Internally renders: `dui-badge`, `dui-icon`, `dui-collapsible` (when collapsible), potentially `dui-tooltip`
- Props: `title`, `icon`, `badge`, `live` (boolean), `help` (tooltip text), `collapsible` (boolean)
- Slots: default (body content), `actions` (header trailing actions)

#### ~~Page Header~~ ✅
- Full-width top bar: title, subtitle, breadcrumb trail, trailing actions
- Internally renders: `dui-breadcrumb`, `dui-breadcrumb-item`, `dui-breadcrumb-link`, `dui-breadcrumb-page`
- Props: `title`, `subtitle`, `breadcrumbs` (comma-separated string)
- Slots: `actions` (trailing buttons/controls)

---

## Full Template Set (by tier)

### ~~Tier 2: Badges & Indicators~~ Skipped

These are thin wrappers around existing `dui-badge` variants and simple styled markup — not genuine composed patterns. Consumers can achieve the same results with `dui-badge` (variant/appearance props + `--badge-bg`/`--badge-fg`/`--badge-border` tokens) and inline CSS.

| Template | Status |
|---|---|
| ~~`category-badge`~~ | Skipped — use `dui-badge` with custom color tokens |
| ~~`severity-badge`~~ | Skipped — use `dui-badge` variant/appearance combos |
| ~~`live-badge`~~ | Skipped — already embedded in `section-panel` |
| ~~`trend-indicator`~~ | Skipped — already embedded in `stat-card` |
| ~~`confidence-indicator`~~ | Skipped — use `dui-badge` with custom color tokens |

### ~~Tier 3: Metrics & Gauges~~ ✅

| Template | Description |
|---|---|
| ~~`stat-card`~~ ✅ | Single metric with label, value, trend indicator, description |
| ~~`score-item`~~ ✅ | Entity + prominent score + sub-metric breakdown |
| ~~`risk-gauge`~~ ✅ | Semicircular arc gauge with central value, severity label, trend |
| ~~`progress-bar`~~ ✅ | Labeled capacity/completion indicator wrapping dui-progress |

### ~~Tier 4: Feed & Events~~ ✅

| Template | Description |
|---|---|
| `feed-item` | Core event card — title, subtitle, timestamp, category/severity badges (already built) |
| `headline-item` | Minimal: title + source + timestamp |
| `social-post` | Social signal card — handle, timestamp, body, source icon |
| `activity-item` | Timestamped event in a vertical timeline |

### ~~Tier 5: Data Display~~ ✅

| Template | Description |
|---|---|
| `key-value` | Label–value pair |
| ~~`key-value-group`~~ | ~~Grid of key-value pairs~~ — Skipped |
| ~~`data-table`~~ | ~~Sortable rows (wraps `dui-data-table`)~~ — Skipped, thin wrapper |
| `market-table` | Compact financial ticker |
| ~~`status-list`~~ | ~~Entities with status indicators~~ — Skipped |
| ~~`theater-status`~~ | ~~Named entity with severity + metric rows~~ — Skipped |

### ~~Tier 6: Content Blocks~~ ✅

| Template | Description |
|---|---|
| `briefing-block` | AI-generated summary with header + metadata + body |
| `empty-state` | Centered placeholder for no-data panels |
| `numbered-insight` | Ordinal + title + badges + description |

### Tier 7: Controls & Filtering

| Template | Description |
|---|---|
| `filter-chip-group` | Row of toggleable filter chips |
| `severity-toggle` | Button group for severity levels |
| `legend` | Horizontal row of colored dots + labels |

### Tier 8: Media

| Template | Description |
|---|---|
| `avatar-row` | Horizontal scrollable row of circular icons with labels |
| `media-grid` | Grid of image/video thumbnails with location labels |

---

## Composition Model

A dashboard is assembled by nesting templates inside structural containers:

```
page-header
toolbar
  filter-chip-group
  severity-toggle
card-grid (columns=3)
  section-panel (title="Metrics")
    stat-card
    stat-card
    stat-card
  section-panel (title="Risk Overview", live)
    risk-gauge
  section-panel (title="Country Scores")
    score-item
    score-item
    score-item
card-grid (columns=2)
  section-panel (title="Live Feed", live, badge="27")
    feed-item
    feed-item
    feed-item
  section-panel (title="Signals", badge="3")
    social-post
    social-post
    social-post
section-panel (title="Details")
  data-table
```

## What's NOT a Template

| Pattern | Use instead |
|---|---|
| Sidebar navigation | `dui-sidebar` component |
| Tab groups | `dui-tabs` component |
| Buttons/actions | `dui-button` component |
| Search input | `dui-input` component |
| Accordion sections | `dui-accordion` component |
| Map panel | Out of scope (requires mapping library) |
| Charts | Out of scope for v1 |
| Video player | Out of scope for v1 |
| Scrolling ticker | Defer to v2 |

## Implementation Notes

- Templates own all their CSS (no structure/theme split)
- Templates use design tokens exclusively — no hardcoded values
- Templates declare `static dependencies` for auto-registration
- Templates are presentational only — no data fetching, no global state
- `@media` queries (not `@container`) for responsive breakpoints — container-type: inline-size causes sizing issues in flex contexts
- Layout components use `min-width: 100%` on `:host` to ensure proper sizing in flex parents
