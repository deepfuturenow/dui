export interface ComponentMeta {
  tagName: string;
  name: string;
  description: string;
  importPath: string;
  /** Tag name of the parent component. Sub-components are hidden from nav. */
  parent?: string;
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
    parent: "dui-accordion",
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
  {
    tagName: "dui-menu",
    name: "Menu",
    description: "A popup menu triggered by a slotted element with keyboard navigation.",
    importPath: "@dui/components/menu",
    properties: [],
    events: [],
    slots: [
      { name: "trigger", description: "The element that opens the menu on click" },
      { name: "default", description: "dui-menu-item children" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-menu-item",
    name: "Menu Item",
    description: "An item within a dui-menu.",
    importPath: "@dui/components/menu",
    parent: "dui-menu",
    properties: [
      { name: "variant", type: '"default" | "danger"', default: '"default"', description: "Visual variant" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the item" },
    ],
    events: [],
    slots: [
      { name: "default", description: "Item content" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-popover",
    name: "Popover",
    description: "A popover with trigger, popup, and close sub-components.",
    importPath: "@dui/components/popover",
    properties: [
      { name: "open", type: "boolean", default: "false", description: "Controlled open state" },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state" },
      { name: "side", type: '"top" | "bottom"', default: '"bottom"', description: "Popup side" },
      { name: "sideOffset", type: "number", default: "8", description: "Offset from trigger (px)" },
    ],
    events: [
      { name: "open-change", detail: "{ open: boolean }", description: "Fired when popover opens/closes" },
    ],
    slots: [
      { name: "default", description: "dui-popover-trigger and dui-popover-popup" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-popover-trigger",
    name: "Popover Trigger",
    description: "Click-to-toggle trigger for the popover.",
    importPath: "@dui/components/popover",
    parent: "dui-popover",
    properties: [],
    events: [],
    slots: [
      { name: "default", description: "Content that triggers the popover" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-popover-popup",
    name: "Popover Popup",
    description: "The popover popup content container.",
    importPath: "@dui/components/popover",
    parent: "dui-popover",
    properties: [
      { name: "showArrow", type: "boolean", default: "true", description: "Show arrow pointing to trigger" },
      { name: "closeOnClick", type: "boolean", default: "false", description: "Close on content click" },
    ],
    events: [],
    slots: [
      { name: "default", description: "Popover content" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-popover-close",
    name: "Popover Close",
    description: "A close button wrapper for the popover.",
    importPath: "@dui/components/popover",
    parent: "dui-popover",
    properties: [],
    events: [],
    slots: [
      { name: "default", description: "Content that closes the popover" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-tooltip",
    name: "Tooltip",
    description: "A tooltip with hover/focus trigger and configurable delay.",
    importPath: "@dui/components/tooltip",
    properties: [
      { name: "open", type: "boolean", default: "false", description: "Controlled open state" },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state" },
      { name: "side", type: '"top" | "bottom"', default: '"top"', description: "Popup side" },
      { name: "sideOffset", type: "number", default: "6", description: "Offset from trigger (px)" },
      { name: "delay", type: "number", default: "500", description: "Open delay (ms)" },
      { name: "closeDelay", type: "number", default: "0", description: "Close delay (ms)" },
      { name: "disabled", type: "boolean", default: "false", description: "Disable the tooltip" },
    ],
    events: [
      { name: "open-change", detail: "{ open: boolean }", description: "Fired when tooltip opens/closes" },
    ],
    slots: [
      { name: "default", description: "dui-tooltip-trigger and dui-tooltip-popup" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-tooltip-trigger",
    name: "Tooltip Trigger",
    description: "The element that triggers the tooltip on hover/focus.",
    importPath: "@dui/components/tooltip",
    parent: "dui-tooltip",
    properties: [
      { name: "disabled", type: "boolean", default: "false", description: "Disable the trigger" },
    ],
    events: [],
    slots: [
      { name: "default", description: "Content that triggers the tooltip" },
    ],
    cssProperties: [],
  },
  {
    tagName: "dui-tooltip-popup",
    name: "Tooltip Popup",
    description: "The tooltip popup content container.",
    importPath: "@dui/components/tooltip",
    parent: "dui-tooltip",
    properties: [
      { name: "showArrow", type: "boolean", default: "true", description: "Show arrow pointing to trigger" },
    ],
    events: [],
    slots: [
      { name: "default", description: "Tooltip content" },
    ],
    cssProperties: [],
  },
];
