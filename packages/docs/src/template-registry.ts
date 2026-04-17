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
    slugs: ["feed-item"],
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
];
