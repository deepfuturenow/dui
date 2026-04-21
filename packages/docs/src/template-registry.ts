export interface TemplateMeta {
  tagName: string;
  name: string;
  description: string;
  importPath: string;
  category: string;
  properties: { name: string; type: string; default?: string; description: string }[];
  slots: { name: string; description: string }[];
  events: { name: string; detail?: string; description: string }[];
  cssProperties: { name: string; description: string }[];
  /** Tag names of DUI components this template renders internally. */
  dependencies: string[];
}

/** Sidebar navigation groups for the Templates section. */
export const TEMPLATE_NAV_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "Dashboard",
    slugs: ["section-panel", "page-header"],
  },
  {
    label: "Metrics & Gauges",
    slugs: ["stat-card", "score-item", "risk-gauge", "progress-bar"],
  },
  {
    label: "Feed & Events",
    slugs: ["feed-item", "headline-item", "activity-item", "social-post"],
  },
  {
    label: "Data Display",
    slugs: ["key-value", "market-table"],
  },
  {
    label: "Content Blocks",
    slugs: ["briefing-block", "empty-state", "numbered-insight"],
  },
  {
    label: "Media",
    slugs: ["avatar-row", "media-grid"],
  },
];

export const templateRegistry: TemplateMeta[] = [
  {
    tagName: "dui-section-panel",
    name: "Section Panel",
    description:
      "A bordered container with a header bar — the fundamental building block for dashboard panels. Supports an optional icon, badge count, LIVE indicator, help tooltip, trailing actions, and collapsible mode.",
    importPath: "@dui/theme-default-templates/dashboard",
    category: "Dashboard",
    properties: [
      { name: "title", type: "string", default: '""', description: "Panel title displayed in the header" },
      { name: "badge", type: "string", default: '""', description: "Badge count shown after the title" },
      { name: "live", type: "boolean", default: "false", description: "Show a pulsing LIVE indicator" },
      { name: "help", type: "string", default: '""', description: "Tooltip text for a help \"?\" indicator" },
      { name: "collapsible", type: "boolean", default: "false", description: "Enable collapsible mode" },
      { name: "default-open", type: "boolean", default: "true", description: "Whether the collapsible panel starts open" },
    ],
    slots: [
      { name: "(default)", description: "Body content" },
      { name: "icon", description: "Optional leading icon (dui-icon recommended)" },
      { name: "actions", description: "Trailing actions in the header bar" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-badge", "dui-icon", "dui-collapsible", "dui-tooltip", "dui-tooltip-trigger", "dui-tooltip-popup"],
  },
  {
    tagName: "dui-feed-item",
    name: "Feed Item",
    description:
      "An event card for feeds and monitoring dashboards. Renders a title, subtitle, timestamp, optional category and severity badges, and an optional description body.",
    importPath: "@dui/theme-default-templates/feed",
    category: "Feed & Events",
    properties: [
      { name: "title", type: "string", default: '""', description: "Primary label for the event" },
      { name: "subtitle", type: "string", default: '""', description: "Secondary context — location, source, or origin" },
      { name: "timestamp", type: "string", default: '""', description: 'Display timestamp (e.g. "2 min ago", "14:23 UTC")' },
      { name: "category", type: "string", default: '""', description: "Category label — renders as a neutral badge" },
      { name: "severity", type: '"critical" | "high" | "medium" | "low"', default: '""', description: "Severity level — maps to badge variant" },
      { name: "description", type: "string", default: '""', description: "Optional body text" },
    ],
    slots: [
      { name: "actions", description: "Optional action buttons or links below the body" },
      { name: "description", description: "Rich description content (overrides description prop)" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-badge"],
  },
  {
    tagName: "dui-headline-item",
    name: "Headline Item",
    description:
      "A minimal headline row: title, source, and timestamp. Designed for dense headline lists and news tickers where space is at a premium.",
    importPath: "@dui/theme-default-templates/feed",
    category: "Feed & Events",
    properties: [
      { name: "title", type: "string", default: '""', description: "Primary headline text" },
      { name: "source", type: "string", default: '""', description: "Source or publication name" },
      { name: "timestamp", type: "string", default: '""', description: 'Display timestamp (e.g. "2 min ago", "14:23 UTC")' },
      { name: "href", type: "string", default: '""', description: "Optional URL — when set, the title renders as an anchor" },
    ],
    slots: [
      { name: "actions", description: "Optional trailing action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: [],
  },
  {
    tagName: "dui-page-header",
    name: "Page Header",
    description:
      "Full-width top bar for dashboard pages. Renders an optional breadcrumb trail, a title, an optional subtitle, and trailing action buttons with a bottom separator.",
    importPath: "@dui/theme-default-templates/dashboard",
    category: "Dashboard",
    properties: [
      { name: "title", type: "string", default: '""', description: "Page title displayed prominently" },
      { name: "subtitle", type: "string", default: '""', description: "Supporting text below the title" },
      { name: "breadcrumbs", type: "string", default: '""', description: 'Comma-separated breadcrumb trail (e.g. "Home, Settings, Profile")' },
    ],
    slots: [
      { name: "actions", description: "Trailing action buttons or controls" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-breadcrumb", "dui-breadcrumb-item", "dui-breadcrumb-link", "dui-breadcrumb-page", "dui-breadcrumb-separator", "dui-separator"],
  },
  {
    tagName: "dui-stat-card",
    name: "Stat Card",
    description:
      "A single metric card displaying a label, prominent value, optional trend indicator, and description text. Ideal for KPI rows at the top of dashboards.",
    importPath: "@dui/theme-default-templates/metrics",
    category: "Metrics & Gauges",
    properties: [
      { name: "label", type: "string", default: '""', description: "Metric label (e.g. \"Total Events\")" },
      { name: "value", type: "string", default: '""', description: "Primary metric value (e.g. \"1,284\")" },
      { name: "trend", type: "string", default: '""', description: "Trend text (e.g. \"+12%\")" },
      { name: "trend-direction", type: '"up" | "down" | "stable"', default: '""', description: "Trend direction — determines arrow and color" },
      { name: "description", type: "string", default: '""', description: "Supporting context text" },
    ],
    slots: [
      { name: "actions", description: "Optional action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-icon"],
  },
  {
    tagName: "dui-score-item",
    name: "Score Item",
    description:
      "An entity with a prominent score and optional sub-metric breakdown. Use for ranked lists, country risk scores, or leaderboards.",
    importPath: "@dui/theme-default-templates/metrics",
    category: "Metrics & Gauges",
    properties: [
      { name: "entity", type: "string", default: '""', description: "Entity name (e.g. country, department, agent)" },
      { name: "subtitle", type: "string", default: '""', description: "Secondary context below the entity name" },
      { name: "score", type: "string", default: '""', description: "Prominent score value (e.g. \"87\", \"A+\")" },
      { name: "score-label", type: "string", default: '""', description: "Label beneath the score (e.g. \"Risk Score\")" },
      { name: "severity", type: "string", default: '""', description: "Severity level for optional tagging" },
    ],
    slots: [
      { name: "sub-metrics", description: "Additional metric breakdowns below the main row" },
      { name: "actions", description: "Optional action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-badge", "dui-separator"],
  },
  {
    tagName: "dui-risk-gauge",
    name: "Risk Gauge",
    description:
      "A semicircular arc gauge with a central value, severity label, and optional trend indicator. The arc fills proportionally to value (0–100).",
    importPath: "@dui/theme-default-templates/metrics",
    category: "Metrics & Gauges",
    properties: [
      { name: "label", type: "string", default: '""', description: "Metric label displayed below the gauge" },
      { name: "value", type: "number", default: "0", description: "Gauge value (0–100)" },
      { name: "severity", type: '"critical" | "high" | "medium" | "low" | "info"', default: '""', description: "Severity level — determines arc color" },
      { name: "trend", type: "string", default: '""', description: "Trend text (e.g. \"+5 pts\")" },
      { name: "trend-direction", type: '"up" | "down" | "stable"', default: '""', description: "Trend direction — determines arrow and color" },
    ],
    slots: [
      { name: "actions", description: "Optional action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: [],
  },
  {
    tagName: "dui-progress-bar",
    name: "Progress Bar",
    description:
      "A labeled capacity/completion indicator wrapping dui-progress. Displays a metric label, value text, progress bar, and optional description.",
    importPath: "@dui/theme-default-templates/metrics",
    category: "Metrics & Gauges",
    properties: [
      { name: "label", type: "string", default: '""', description: "Metric label (e.g. \"CPU Usage\")" },
      { name: "value", type: "number", default: "0", description: "Current value (0–max)" },
      { name: "max", type: "number", default: "100", description: "Maximum value" },
      { name: "value-text", type: "string", default: '""', description: "Custom display text (overrides auto percentage)" },
      { name: "description", type: "string", default: '""', description: "Supporting description text" },
    ],
    slots: [
      { name: "actions", description: "Optional action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-progress"],
  },
  {
    tagName: "dui-activity-item",
    name: "Activity Item",
    description:
      "A timestamped event in a vertical timeline. Stack multiple items to form a timeline. Color-coded dots indicate status, with optional status badges and descriptions.",
    importPath: "@dui/theme-default-templates/feed",
    category: "Feed & Events",
    properties: [
      { name: "title", type: "string", default: '""', description: "Event title" },
      { name: "timestamp", type: "string", default: '""', description: 'Display timestamp (e.g. "2 min ago")' },
      { name: "description", type: "string", default: '""', description: "Optional description text" },
      { name: "status", type: '"success" | "error" | "warning" | "info" | "pending"', default: '""', description: "Status \u2014 determines dot color" },
      { name: "status-label", type: "string", default: '""', description: "Optional status label \u2014 renders as a badge" },
      { name: "last", type: "boolean", default: "false", description: "Hide the trailing timeline line" },
    ],
    slots: [
      { name: "actions", description: "Optional action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-badge"],
  },
  {
    tagName: "dui-social-post",
    name: "Social Post",
    description:
      "A social signal card for monitoring dashboards. Displays an author, handle, timestamp, body text, optional source badge, and avatar.",
    importPath: "@dui/theme-default-templates/feed",
    category: "Feed & Events",
    properties: [
      { name: "author", type: "string", default: '""', description: "Display name of the post author" },
      { name: "handle", type: "string", default: '""', description: 'Handle / username (e.g. "@analyst_jane")' },
      { name: "timestamp", type: "string", default: '""', description: 'Display timestamp (e.g. "2 min ago")' },
      { name: "body", type: "string", default: '""', description: "Post body text" },
      { name: "source", type: "string", default: '""', description: 'Source platform label (e.g. "X", "Bluesky", "Telegram")' },
    ],
    slots: [
      { name: "avatar", description: "Profile picture (dui-avatar recommended)" },
      { name: "actions", description: "Optional action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-avatar", "dui-badge"],
  },
  {
    tagName: "dui-key-value",
    name: "Key Value",
    description:
      "A label\u2013value pair for metadata display. Supports stacked (label above value) and inline (side by side) layouts. Compose multiple pairs in grids or lists for detail panels.",
    importPath: "@dui/theme-default-templates/data",
    category: "Data Display",
    properties: [
      { name: "label", type: "string", default: '""', description: "The label text (e.g. \"Status\", \"Region\")" },
      { name: "value", type: "string", default: '""', description: "The value text (e.g. \"Active\", \"142ms\")" },
      { name: "description", type: "string", default: '""', description: "Optional supporting description below the value" },
      { name: "layout", type: '"stacked" | "inline"', default: '"stacked"', description: "Layout mode: stacked (label above value) or inline (side by side)" },
    ],
    slots: [
      { name: "(default)", description: "Custom value content (overrides value prop)" },
    ],
    events: [],
    cssProperties: [],
    dependencies: [],
  },
  {
    tagName: "dui-briefing-block",
    name: "Briefing Block",
    description:
      "An AI-generated summary block with header, metadata, and body. Use for intelligence briefings, AI summaries, analysis blocks, or any authored content with clear attribution and source metadata.",
    importPath: "@dui/theme-default-templates/content",
    category: "Content Blocks",
    properties: [
      { name: "title", type: "string", default: '""', description: "Primary title for the briefing" },
      { name: "source", type: "string", default: '""', description: 'Source or author attribution (e.g. "AI Analysis", "GPT-4o")' },
      { name: "timestamp", type: "string", default: '""', description: 'Display timestamp (e.g. "2 min ago", "14:23 UTC")' },
      { name: "category", type: "string", default: '""', description: "Category or topic label — renders as a neutral badge" },
      { name: "confidence", type: "string", default: '""', description: 'Confidence level label — renders as a primary badge (e.g. "High", "Medium")' },
      { name: "body", type: "string", default: '""', description: "Body text content" },
    ],
    slots: [
      { name: "body", description: "Rich body content (overrides body prop)" },
      { name: "actions", description: "Optional action buttons or links below the body" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-badge", "dui-separator", "dui-icon"],
  },
  {
    tagName: "dui-empty-state",
    name: "Empty State",
    description:
      "A centered placeholder for no-data panels. Shows an optional icon, heading, description, and action slot for a primary CTA.",
    importPath: "@dui/theme-default-templates/content",
    category: "Content Blocks",
    properties: [
      { name: "heading", type: "string", default: '""', description: 'Primary heading text (e.g. "No events yet")' },
      { name: "description", type: "string", default: '""', description: "Supporting description text" },
    ],
    slots: [
      { name: "icon", description: "Custom icon content (overrides the default empty-box icon)" },
      { name: "actions", description: "Primary call-to-action button(s)" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-icon"],
  },
  {
    tagName: "dui-numbered-insight",
    name: "Numbered Insight",
    description:
      "An ordinal-numbered insight with title, badges, and description. Use for ranked findings, prioritized recommendations, or numbered takeaways in analysis panels.",
    importPath: "@dui/theme-default-templates/content",
    category: "Content Blocks",
    properties: [
      { name: "ordinal", type: "number", default: "1", description: "Ordinal number (e.g. 1, 2, 3)" },
      { name: "title", type: "string", default: '""', description: "Primary insight title" },
      { name: "category", type: "string", default: '""', description: "Category label — renders as a neutral badge" },
      { name: "severity", type: '"critical" | "high" | "medium" | "low"', default: '""', description: "Severity level — maps to badge variant" },
      { name: "description", type: "string", default: '""', description: "Descriptive body text" },
    ],
    slots: [
      { name: "actions", description: "Optional action buttons or links" },
    ],
    events: [],
    cssProperties: [],
    dependencies: ["dui-badge"],
  },
  {
    tagName: "dui-avatar-row",
    name: "Avatar Row",
    description:
      "A horizontal scrollable row of circular avatars with labels. Ideal for displaying teams, participants, agents, or any list of people/entities in a compact horizontal strip.",
    importPath: "@dui/theme-default-templates/media",
    category: "Media",
    properties: [
      { name: "data", type: "AvatarItem[]", default: "[]", description: "Array of avatar items ({ src?, name, label? })" },
      { name: "empty-text", type: "string", default: '"No items"', description: "Text shown when data is empty" },
    ],
    slots: [
      { name: "actions", description: "Optional trailing action (e.g. an \"Add\" button)" },
    ],
    events: [],
    cssProperties: [
      { name: "--avatar-row-size", description: "Avatar diameter (default: 3rem)" },
    ],
    dependencies: ["dui-avatar", "dui-scroll-area"],
  },
  {
    tagName: "dui-media-grid",
    name: "Media Grid",
    description:
      "A responsive grid of image/video thumbnails with label and timestamp overlays. Ideal for camera feeds, location galleries, media libraries, or any visual monitoring grid.",
    importPath: "@dui/theme-default-templates/media",
    category: "Media",
    properties: [
      { name: "data", type: "MediaItem[]", default: "[]", description: "Array of media items ({ src, alt?, label?, timestamp? })" },
      { name: "empty-text", type: "string", default: '"No media"', description: "Text shown when data is empty" },
    ],
    slots: [
      { name: "actions", description: "Optional action buttons below the grid" },
    ],
    events: [],
    cssProperties: [
      { name: "--media-grid-min-width", description: "Minimum cell width for the auto-fill grid (default: 10rem)" },
    ],
    dependencies: ["dui-badge"],
  },
  {
    tagName: "dui-market-table",
    name: "Market Table",
    description:
      "A compact financial ticker table. Renders rows of symbols with prices, absolute change, and percentage change. Positive changes are colored with accent; negative with destructive.",
    importPath: "@dui/theme-default-templates/data",
    category: "Data Display",
    properties: [
      { name: "data", type: "MarketRow[]", default: "[]", description: "Array of market data rows ({ symbol, name?, price, change, changePercent })" },
      { name: "price-precision", type: "number", default: "2", description: "Decimal places for price formatting" },
      { name: "currency-symbol", type: "string", default: '"$"', description: "Currency symbol prepended to prices" },
      { name: "empty-text", type: "string", default: '"No market data"', description: "Text shown when data is empty" },
    ],
    slots: [],
    events: [],
    cssProperties: [],
    dependencies: ["dui-icon"],
  },
];
