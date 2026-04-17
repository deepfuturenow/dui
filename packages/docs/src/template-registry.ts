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
    label: "Feed & Events",
    slugs: ["feed-item"],
  },
];

export const templateRegistry: TemplateMeta[] = [
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
];
