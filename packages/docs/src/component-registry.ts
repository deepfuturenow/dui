export interface ComponentMeta {
  tagName: string;
  name: string;
  description: string;
  importPath: string;
  properties: { name: string; type: string; default?: string; description: string }[];
  events: { name: string; detail?: string; description: string }[];
  slots: { name: string; description: string }[];
  cssProperties: { name: string; description: string }[];
}

export const componentRegistry: ComponentMeta[] = [
  {
    tagName: "dui-accordion",
    name: "Accordion",
    description: "Vertically stacked sections with expandable/collapsible panels.",
    importPath: "@dui/components/accordion",
    properties: [
      { name: "value", type: "string[] | undefined", description: "Currently open item values" },
      { name: "defaultValue", type: "string[]", default: "[]", description: "Initial open items" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable all items" },
      { name: "multiple", type: "boolean", default: "false", description: "Allow multiple items open" },
      { name: "loopFocus", type: "boolean", default: "true", description: "Cycle focus at ends" },
      { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout orientation" },
      { name: "keepMounted", type: "boolean", default: "false", description: "Keep closed panels in DOM" },
    ],
    events: [
      { name: "value-change", detail: "string[]", description: "Fired when open items change" },
    ],
    slots: [
      { name: "default", description: "Container for dui-accordion-item children" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-accordion-item",
    name: "Accordion Item",
    description: "Individual collapsible item within an accordion.",
    importPath: "@dui/components/accordion",
    properties: [
      { name: "value", type: "string", default: '""', description: "Unique identifier for this item" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable this item" },
    ],
    events: [
      { name: "open-change", detail: "{ value: string; open: boolean }", description: "Fired when item opens/closes" },
    ],
    slots: [
      { name: "trigger", description: "Header/trigger content" },
      { name: "default", description: "Panel content" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-button",
    name: "Button",
    description: "A button with variant, size, and link support.",
    importPath: "@dui/components/button",
    properties: [
      { name: "variant", type: "string", default: '"default"', description: 'Button variant: "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link"' },
      { name: "size", type: "string", default: '"md"', description: 'Button size: "sm" | "md" | "lg"' },
      { name: "rounded", type: "boolean", default: "false", description: "Apply rounded styling" },
      { name: "square", type: "boolean", default: "false", description: "Apply square aspect ratio" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the button" },
      { name: "type", type: "string", default: '"button"', description: 'Button type: "button" | "submit" | "reset"' },
      { name: "href", type: "string | undefined", description: "When set, renders as an anchor" },
    ],
    events: [
      { name: "dui-navigate", detail: "{ href: string }", description: "Fired on link clicks" },
    ],
    slots: [
      { name: "default", description: "Button label content" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-switch",
    name: "Switch",
    description: "A toggle switch with checked, disabled, and read-only states.",
    importPath: "@dui/components/switch",
    properties: [
      { name: "checked", type: "boolean | undefined", description: "Controlled checked state" },
      { name: "defaultChecked", type: "boolean", default: "false", description: "Initial checked state" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the switch" },
      { name: "readOnly", type: "boolean", default: "false", description: "Make the switch read-only" },
      { name: "required", type: "boolean", default: "false", description: "Mark as required" },
      { name: "name", type: "string | undefined", description: "Form field name" },
      { name: "value", type: "string", default: '"on"', description: "Value when checked" },
    ],
    events: [
      { name: "checked-change", detail: "{ checked: boolean }", description: "Fired when toggled" },
    ],
    slots: [
      { name: "default", description: "Label content" },
    ],
    cssProperties: [
      { name: "--switch-thumb-offset", description: "Thumb inset offset" },
      { name: "--switch-checked-offset", description: "Checked state thumb offset" },
    ],
  },
  {
    tagName: "dui-badge",
    name: "Badge",
    description: "A small status indicator with multiple variants.",
    importPath: "@dui/components/badge",
    properties: [
      { name: "variant", type: "string", default: '"default"', description: 'Badge variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"' },
    ],
    events: [],
    slots: [
      { name: "default", description: "Badge content" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-icon",
    name: "Icon",
    description: "Material Symbols icon with configurable size and color.",
    importPath: "@dui/components/icon",
    properties: [
      { name: "icon", type: "string", default: '""', description: "Material Symbols icon name" },
      { name: "color", type: "string | undefined", description: "Icon color as CSS value" },
      { name: "size", type: "string | undefined", description: "Icon size as CSS length" },
    ],
    events: [],
    slots: [],
    cssProperties: [
      { name: "--icon-size", description: "Icon dimensions" },
      { name: "--icon-fg", description: "Icon color" },
    ],
  },
  {
    tagName: "dui-scroll-area",
    name: "Scroll Area",
    description: "Custom scrollbar overlay with fade support.",
    importPath: "@dui/components/scroll-area",
    properties: [
      { name: "orientation", type: "string", default: '"vertical"', description: 'Scroll direction: "vertical" | "horizontal" | "both"' },
      { name: "fade", type: "boolean", default: "false", description: "Show fade overlay at top when scrolled" },
      { name: "maxHeight", type: "string | undefined", description: "Max-height constraint" },
    ],
    events: [
      { name: "scrolled-to-bottom", description: "Fired when scrolled to bottom" },
      { name: "scrolled-from-bottom", description: "Fired when scrolled up from bottom" },
    ],
    slots: [
      { name: "default", description: "Scrollable content" },
    ],
    cssProperties: [
      { name: "--scroll-area-max-height", description: "Max-height constraint" },
      { name: "--scroll-area-thumb-color", description: "Scrollbar thumb color" },
      { name: "--scroll-fade-color", description: "Fade overlay color" },
    ],
  },
  {
    tagName: "dui-combobox",
    name: "Combobox",
    description: "Searchable dropdown with single and multi-select modes.",
    importPath: "@dui/components/combobox",
    properties: [
      { name: "options", type: "SelectOption[]", default: "[]", description: "Available options ({ label, value }[])" },
      { name: "value", type: "string", default: '""', description: "Selected value (single-select)" },
      { name: "values", type: "Set<string>", default: "new Set()", description: "Selected values (multi-select)" },
      { name: "multiple", type: "boolean", default: "false", description: "Enable multi-select mode" },
      { name: "placeholder", type: "string", default: '"Search..."', description: "Input placeholder text" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the combobox" },
      { name: "name", type: "string", default: '""', description: "Form field name" },
    ],
    events: [
      { name: "value-change", detail: "{ value: string; option: SelectOption }", description: "Fired on single-select change" },
      { name: "values-change", detail: "{ value: string; selected: boolean; values: Set<string> }", description: "Fired on multi-select change" },
    ],
    slots: [],
    cssProperties: [],
  },
];
