<!-- Generated from component-registry.ts — do not edit manually. -->
<!-- Run: deno task gen:skill-refs -->

# DUI Component Reference

Compact catalog of all 61 component families. Use the inspector (`__dui_inspect('dui-button')`) for full token, part, and property details. Every component exposes `::part(root)` for CSS access beyond tokens.

---

## Actions

### dui-button `@dui/components/button`
An interactive button. Renders as a native <button> by default, or <a> when href is set.
**Theme:** `variant` ("neutral" | "primary" | "danger") · `appearance` ("filled" | "outline" | "ghost" | "soft" | "link") · `size` ("sm" | "md" | "lg")
**Props:** `disabled`, `focusableWhenDisabled`, `type`, `href`
**Events:** `dui-navigate` → `{ href: string }`
**Slots:** `default` (Button label content)

### dui-toolbar `@dui/components/toolbar`
A 3-column toolbar layout with left, center, and right slots. CSS grid keeps the center slot centered regardless of left/right content width.
**Theme:** `size` ("sm" | "md" | "lg" | "xl")
**Props:** `inset`, `hasButtonLeft`, `hasButtonRight`
**Slots:** `left` (Content aligned to the start), `center` (Content centered in the toolbar), `right` (Content aligned to the end)

### dui-split-button `@dui/components/split-button`
A button with an attached dropdown menu trigger. The action zone (left) performs a primary action. The menu trigger (right) opens a dropdown of dui-menu-item children for secondary actions.
**Theme:** `variant` ("neutral" | "primary" | "danger") · `appearance` ("filled" | "outline" | "ghost" | "soft") · `size` ("xs" | "sm" | "md" | "lg")
**Props:** `popup-min-width`, `disabled`
**Events:** `dui-action` → `{}`
**Slots:** `icon` (Custom icon for the dropdown trigger (defaults to chevron-down)), `menu` (dui-menu-item elements for the dropdown)

### dui-toggle `@dui/components/toggle`
A two-state toggle button. Works standalone or inside a toggle group.
**Theme:** `size` ("sm" | "md" | "lg")
**Props:** `pressed`, `defaultPressed`, `disabled`, `value`
**Events:** `pressed-change` → `{ pressed: boolean }`
**Slots:** `icon` (Optional leading icon)

### dui-toggle-group `@dui/components/toggle`
Groups toggle buttons with shared single or multi selection state.
**Props:** `value`, `defaultValue`, `type`, `orientation`, `disabled`, `loop`
**Events:** `value-change` → `{ value: string[] }`
**Slots:** `default` (dui-toggle children)

## Data Entry

### dui-input `@dui/components/input`
A native input element that integrates with dui-field for accessible labeling and validation.
**Props:** `type`, `value`, `placeholder`, `disabled`, `required`, `readonly`, `minLength`, `maxLength`, `pattern`, `name`, `autocomplete`, `autofocus`
**Events:** `input-change` → `{ value: string }`

### dui-textarea `@dui/components/textarea`
A multi-line text input with resize modes including auto-grow.
**Theme:** `variant` ("default" | "ghost")
**Props:** `value`, `placeholder`, `disabled`, `required`, `readonly`, `rows`, `minLength`, `maxLength`, `name`, `resize`, `maxHeight`
**Events:** `textarea-change` → `{ value: string }`

### dui-select `@dui/components/select`
A dropdown select for choosing from a list of predefined options.
**Props:** `options`, `value`, `placeholder`, `disabled`, `align-item-to-trigger`, `name`
**Events:** `value-change` → `{ value: string; option: SelectOption }`

### dui-combobox `@dui/components/combobox`
Searchable dropdown with single and multi-select modes.
**Props:** `options`, `value`, `values`, `multiple`, `placeholder`, `disabled`, `name`
**Events:** `value-change` → `{ value: string; option: SelectOption }`, `values-change` → `{ value: string; selected: boolean; values: Set<string> }`

### dui-checkbox `@dui/components/checkbox`
A checkbox input with optional indeterminate state and group support.
**Sub-components:** `dui-checkbox-group`
**Props:** `checked`, `defaultChecked`, `indeterminate`, `disabled`, `readOnly`, `required`, `name`, `value`, `parent` · group: `defaultValue`, `allValues`
**Events:** `checked-change` → `{ checked: boolean; indeterminate: boolean }`, `value-change` → `string[]`
**Slots:** `default` (Label content)

### dui-radio-group `@dui/components/radio`
Groups multiple radio buttons with shared state. Only one radio can be selected at a time.
**Sub-components:** `dui-radio`
**Props:** `name`, `value`, `defaultValue`, `disabled`, `readOnly`, `required`
**Events:** `value-change` → `{ value: string }`
**Slots:** `default` (dui-radio children)

### dui-switch `@dui/components/switch`
A toggle switch with checked, disabled, and read-only states.
**Props:** `checked`, `defaultChecked`, `disabled`, `readOnly`, `required`, `name`, `value`
**Events:** `checked-change` → `{ checked: boolean }`
**Slots:** `default` (Label content)

### dui-slider `@dui/components/slider`
A slider for selecting numeric values within a range. Supports a field variant with value readout, label, unit suffix, and gradient track backgrounds.
**Theme:** `variant` ("field")
**Props:** `value`, `min`, `max`, `step`, `disabled`, `name`, `label`, `unit`, `precision`
**Events:** `value-change` → `{ value: number }`, `value-committed` → `{ value: number }`

### dui-number-field `@dui/components/number-field`
A numeric input with optional label, icon, unit suffix, drag-to-scrub, and precision formatting. For simple +/- stepping, use dui-stepper.
**Theme:** `label-position` ("inside-left" | "above" | "below" | "outside-left") · `icon-position` ("inside-left" | "inside-right" | "outside-left")
**Props:** `value`, `defaultValue`, `min`, `max`, `step`, `largeStep`, `disabled`, `readOnly`, `required`, `name`, `label`, `labelPosition`, `iconPosition`, `unit`, `precision`, `scrubLabel`, `scrubValue`, `scrubField`, `clickLabel`, `clickValue`, `clickField`
**Events:** `value-change` → `{ value: number }`, `value-committed` → `{ value: number }`
**Slots:** `icon` (Icon content (SVG, dui-icon, etc.), positioned by icon-position)

### dui-stepper `@dui/components/stepper`
A simple numeric input with increment/decrement buttons. For labels, icons, scrubbing, and units, use dui-number-field.
**Props:** `value`, `defaultValue`, `min`, `max`, `step`, `largeStep`, `disabled`, `readOnly`, `required`, `name`
**Events:** `value-change` → `{ value: number }`, `value-committed` → `{ value: number }`
**Slots:** `decrement` (Custom decrement button content), `increment` (Custom increment button content)

### dui-dropzone `@dui/components/dropzone`
A drag-and-drop file upload area with validation for file type, size, and count.
**Props:** `accept`, `multiple`, `disabled`, `maxFiles`, `maxSize`, `minSize`, `autoFocus`, `noStyle`
**Events:** `drop` → `{ acceptedFiles: File[]; rejectedFiles: RejectedFile[] }`, `drop-accepted` → `{ acceptedFiles: File[] }`, `drop-rejected` → `{ rejectedFiles: RejectedFile[] }`, `dropzone-error` → `{ error: unknown; code: string }`
**Slots:** `default` (Custom content for the dropzone area)

### dui-field `@dui/components/field`
Slot-based form field wrapper. Provides label, description, and error slots with automatic ARIA wiring and field state tracking.
**Props:** `disabled`, `invalid`, `orientation`
**Slots:** `label` (Label text (e.g. <span slot="label">Email</span>)), `description` (Help text (e.g. <span slot="description">…</span>)), `error` (Error message (e.g. <span slot="error">Required</span>))

### dui-fieldset `@dui/components/fieldset`
Semantic grouping for related form fields using a native fieldset element.
**Props:** `disabled`
**Slots:** `legend` (Legend text (e.g. <span slot="legend">Personal Info</span>))

## Data Display

### dui-data-table `@dui/components/data-table`
A sortable, paginated data table with column definitions and custom cell renderers.
**Props:** `columns`, `data`, `pageSize`, `rowKey`, `emptyText`
**Events:** `sort-change` → `SortState | null`, `page-change` → `PageState`

### dui-badge `@dui/components/badge`
An inline status indicator element.
**Theme:** `variant` ("neutral" | "primary" | "danger") · `appearance` ("filled" | "outline" | "soft")
**Slots:** `default` (Badge content)

### dui-avatar `@dui/components/avatar`
Image display with fallback content and loading state management.
**Props:** `src`, `alt`, `size`, `fallbackDelay`
**Events:** `loading-status-change` → `{ status: ImageStatus }`
**Slots:** `default` (Fallback content (e.g. initials or icon))

### dui-calendar `@dui/components/calendar`
A date picker calendar grid with keyboard navigation and locale support.
**Props:** `value`, `defaultValue`, `min`, `max`, `locale`, `disabled`, `readOnly`
**Events:** `value-change` → `{ value: string }`
**Slots:** `prev` (Custom previous month button content), `next` (Custom next month button content)

### dui-progress `@dui/components/progress`
A progress bar indicating completion status. Supports determinate and indeterminate states.
**Props:** `value`, `min`, `max`

### dui-spinner `@dui/components/spinner`
A loading indicator with multiple animation variants.
**Theme:** `size` ("sm" | "md" | "lg")
**Props:** `variant`

## Overlays

### dui-dialog `@dui/components/dialog`
A modal dialog with backdrop, focus trap, and open/close animation. Closes on backdrop click.
**Sub-components:** `dui-dialog-trigger`, `dui-dialog-popup`, `dui-dialog-close`
**Props:** `open`, `defaultOpen` · popup: `keepMounted`, `initialFocus`, `finalFocus`, `width`
**Events:** `open-change` → `{ open: boolean }`
**Slots:** `default` (dui-dialog-trigger and dui-dialog-popup), `title` (popup: Dialog title (rendered as h2)), `description` (popup: Dialog description (rendered as p))

### dui-alert-dialog `@dui/components/alert-dialog`
A modal dialog for critical actions. Does NOT close on backdrop click — requires explicit user action.
**Sub-components:** `dui-alert-dialog-trigger`, `dui-alert-dialog-popup`, `dui-alert-dialog-close`
**Props:** `open`, `defaultOpen` · popup: `keepMounted`, `initialFocus`, `finalFocus`
**Events:** `open-change` → `{ open: boolean }`
**Slots:** `default` (dui-alert-dialog-trigger and dui-alert-dialog-popup), `title` (popup: Alert dialog title (rendered as h2)), `description` (popup: Alert dialog description (rendered as p))

### dui-popover `@dui/components/popover`
A popover with trigger, popup, and close sub-components.
**Sub-components:** `dui-popover-trigger`, `dui-popover-popup`, `dui-popover-close`
**Props:** `open`, `defaultOpen`, `side`, `sideOffset` · popup: `showArrow`, `closeOnClick`
**Events:** `open-change` → `{ open: boolean }`
**Slots:** `default` (dui-popover-trigger and dui-popover-popup)

### dui-tooltip `@dui/components/tooltip`
A tooltip with hover/focus trigger and configurable delay.
**Sub-components:** `dui-tooltip-trigger`, `dui-tooltip-popup`
**Props:** `open`, `defaultOpen`, `side`, `sideOffset`, `delay`, `closeDelay`, `disabled` · popup: `showArrow`
**Events:** `open-change` → `{ open: boolean }`
**Slots:** `default` (dui-tooltip-trigger and dui-tooltip-popup)

### dui-menu `@dui/components/menu`
A popup menu triggered by a slotted element with keyboard navigation.
**Sub-components:** `dui-menu-item`
**Props:** `popup-min-width`
**Slots:** `trigger` (The element that opens the menu on click)

### dui-menubar `@dui/components/menubar`
A horizontal bar of menus with coordinated open/close behavior.
**Props:** `loop`, `orientation`
**Slots:** `default` (dui-menu children)

### dui-command `@dui/components/command`
A searchable command palette with keyboard navigation, filtering, and grouped items.
**Sub-components:** `dui-command-input`, `dui-command-list`, `dui-command-group`, `dui-command-item`, `dui-command-empty`, `dui-command-separator`, `dui-command-shortcut`
**Props:** `loop`, `shouldFilter`, `value`, `filter` · input: `placeholder` · group: `heading` · item: `keywords`
**Events:** `select` → `string`, `search-change` → `string`, `escape`
**Slots:** `default` (Command input, list, groups, and items)

### dui-preview-card `@dui/components/preview-card`
A hover card that shows rich preview content. Stays open when cursor moves to the popup.
**Sub-components:** `dui-preview-card-trigger`, `dui-preview-card-popup`
**Props:** `open`, `defaultOpen`, `side`, `sideOffset`, `delay`, `closeDelay` · popup: `showArrow`
**Events:** `open-change` → `{ open: boolean }`
**Slots:** `default` (dui-preview-card-trigger and dui-preview-card-popup)

## Navigation

### dui-sidebar-provider `@dui/components/sidebar`
Root state manager for the sidebar. Manages open/close state, mobile detection, and provides context.
**Sub-components:** `dui-sidebar`, `dui-sidebar-trigger`, `dui-sidebar-content`, `dui-sidebar-header`, `dui-sidebar-footer`, `dui-sidebar-group`, `dui-sidebar-group-label`, `dui-sidebar-menu`, `dui-sidebar-menu-item`, `dui-sidebar-menu-button`, `dui-sidebar-separator`, `dui-sidebar-inset`
**Props:** `open`, `defaultOpen`, `side`, `variant`, `collapsible` · dui-sidebar-menu-button: `active`, `tooltip`, `href`
**Events:** `open-change` → `{ open: boolean }`, `spa-navigate` → `{ href: string }`
**Slots:** `default` (Sidebar and content areas), `label` (dui-sidebar-group: Group label (use dui-sidebar-group-label)), `icon` (dui-sidebar-menu-button: Icon slot, shown before the label), `suffix` (dui-sidebar-menu-button: Suffix slot, shown after the label)

### dui-breadcrumb `@dui/components/breadcrumb`
Navigation breadcrumb trail showing the current page location.
**Sub-components:** `dui-breadcrumb-item`, `dui-breadcrumb-link`, `dui-breadcrumb-page`, `dui-breadcrumb-separator`, `dui-breadcrumb-ellipsis`
**Slots:** `default` (Breadcrumb items and separators)

### dui-tabs `@dui/components/tabs`
A tabbed interface with animated indicator and keyboard navigation.
**Sub-components:** `dui-tabs-list`, `dui-tab`, `dui-tabs-panel`, `dui-tabs-indicator`
**Props:** `value`, `defaultValue`, `orientation`, `controls` · panel: `keepMounted`
**Events:** `value-change` → `string`
**Slots:** `default` (Tab list and tab panels)

## Disclosure

### dui-accordion `@dui/components/accordion`
Vertically stacked sections with expandable/collapsible panels.
**Sub-components:** `dui-accordion-item`
**Props:** `value`, `defaultValue`, `disabled`, `multiple`, `loopFocus`, `orientation`, `keepMounted`
**Events:** `value-change` → `string[]`, `open-change` → `{ value: string; open: boolean }`
**Slots:** `default` (Container for dui-accordion-item children), `trigger` (item: Header/trigger content)

### dui-collapsible `@dui/components/collapsible`
A standalone disclosure widget with animated open/close transitions.
**Props:** `open`, `defaultOpen`, `disabled`, `keepMounted`
**Events:** `open-change` → `{ open: boolean }`
**Slots:** `trigger` (Trigger label content)

## Content

### dui-card `@dui/components/card`
A container for grouped content with header, body, and footer sections. Uses flex-column + gap for vertical rhythm.
**Props:** `size`
**Slots:** `title` (Card heading text.), `description` (Helper text below the title.), `action` (Top-right header action (button, badge, etc.).), `footer` (Footer content (buttons, links, etc.).)

### dui-card-grid `@dui/components/card-grid`
A responsive grid layout for cards and panels. Distributes children into equal-width columns that collapse at narrow container widths.
**Props:** `columns`
**Slots:** `default` (Grid children (cards, panels, or any block content))

### dui-scroll-area `@dui/components/scroll-area`
Custom scrollbar overlay with fade support.
**Props:** `orientation`, `fade`, `maxHeight`
**Events:** `scrolled-to-bottom`, `scrolled-from-bottom`
**Slots:** `default` (Scrollable content)

### dui-separator `@dui/components/separator`
A visual divider between content sections. Supports horizontal and vertical orientation.
**Props:** `orientation`

## Helpers

### dui-icon `@dui/components/icon`
Slot-based SVG icon container. Use lucide-static imports with unsafeHTML for tree-shakeable icons (recommended), or paste raw SVGs into the default slot. Inherits currentColor and sizes via --icon-size.
**Slots:** `default` (SVG element to display)

### dui-portal `@dui/components/portal`
Teleports light DOM children to a target container elsewhere in the document.
**Props:** `target`, `targetRoot`, `targetElement`
**Slots:** `default` (Content to teleport)

### dui-trunc `@dui/components/trunc`
Text truncation with ellipsis. Single-line by default, or multi-line clamping with max-lines.
**Props:** `maxWidth`, `maxLines`
**Slots:** `default` (Text content to truncate)

## Other

### dui-toast-region `@dui/components/toast`
Viewport and provider for a stack of `<dui-toast>` elements. Owns position, the registry, pause/expand state, hotkey focus, and stack-visual math (cascade-and-expand). Default position is bottom-right; cascade stacking is on by default.
**Props:** `position`, `maxVisible`, `label`, `expandOnHover`, `expanded`, `swipeDirections`, `swipeThreshold`, `hotkey`, `theme`
**Events:** `toast-dismiss` → `{ id: string; reason: ToastDismissReason }`
**Slots:** `default` (One or more `<dui-toast>` elements)

### dui-toast `@dui/components/toast`
A single toast notification. Renders a Sonner-style layout with built-in default icons per type, title, description, optional action and close affordances. Manages auto-dismiss, ARIA live-region wiring, swipe-to-dismiss, and stacking state.
**Sub-components:** `dui-toast-action`, `dui-toast-close`
**Theme:** `appearance` ("default" | "rich")
**Props:** `open`, `defaultOpen`, `duration`, `type`, `priority`, `toastId`, `headless`
**Events:** `open-change` → `{ open: boolean }`, `dismiss` → `{ id: string; reason: ToastDismissReason }`
**Slots:** `title` (Title text (auto-wires aria-labelledby)), `description` (Description text (auto-wires aria-describedby)), `icon` (Custom icon to replace the type-default. Empty = built-in.), `action` (Action button(s); typically a `<dui-toast-action>` wrapper), `close` (Close affordance; typically a `<dui-toast-close>` wrapper)

### dui-tree `@dui/components/tree`
Hierarchical tree view with keyboard navigation, optional single/multiple selection, and async loading. Follows the W3C APG Treeview pattern.
**Sub-components:** `dui-tree-item`
**Props:** `size`, `expandedValues`, `defaultExpandedValues`, `selectionMode`, `selectedValues`, `defaultSelectedValues`, `disabled` · item: `hasChildren`, `loading`
**Events:** `dui-expanded-change` → `{ values: string[] }`, `dui-selection-change` → `{ values: string[] }`, `dui-action` → `{ value: string }`, `dui-load-children` → `{ value: string }`
**Slots:** `default` (dui-tree-item children), `label` (item: The visible label/content for this node (truncated by default)), `end` (item: Trailing content (status icons, badges, counts) — muted, always visible)

### dui-splitter `@dui/components/splitter`
Resizable panel group for dividing an area into draggable, constrained panes. Implements the W3C ARIA Window Splitter pattern. Compose with `<dui-splitter-panel>` and `<dui-splitter-handle>`. Imperative API on the element: `getSizes()`, `setSizes(sizes)`, `resetSizes()`, `collapsePanel(id)`, `expandPanel(id)`, `isPanelCollapsed(id)`.
**Sub-components:** `dui-splitter-panel`, `dui-splitter-handle`
**Props:** `orientation`, `value`, `default-value`, `disabled`, `keyboard-step`, `keyboard-step-large`, `auto-save-id` · panel: `panel-id`, `default-size`, `min-size`, `max-size`, `collapsible`, `order`
**Events:** `value-change` → `number[]`, `collapse-change` → `{ panelId: string; collapsed: boolean }`
**Slots:** `default` (`<dui-splitter-panel>` and `<dui-splitter-handle>` children, alternating.)

### dui-map `@dui/map`
Root map component wrapping MapLibre GL JS. Initializes the map, provides context to children, auto-detects dark/light theme.
**Props:** `center`, `zoom`, `bearing`, `pitch`, `theme`, `styleLight`, `styleDark`, `loading`, `noWorldCopies`, `controlled`, `minZoom`, `maxZoom`, `maxBounds`, `bounds`, `boundsPadding`
**Events:** `dui-map-viewport-change` → `MapViewport`, `dui-map-load`, `dui-map-click` → `MapClickDetail`, `dui-map-dblclick` → `MapClickDetail`, `dui-map-contextmenu` → `MapClickDetail`
**Slots:** `default` (Map overlay content (controls, markers, popups, routes))

### dui-map-controls `@dui/map`
Zoom, compass, locate, and fullscreen map controls.
**Props:** `position`, `showZoom`, `showCompass`, `showLocate`, `showFullscreen`
**Events:** `dui-map-locate` → `{ longitude: number; latitude: number }`

### dui-map-marker `@dui/map`
Places a marker at a coordinate on the map.
**Props:** `longitude`, `latitude`, `draggable`, `rotation`, `offset`
**Events:** `dui-marker-dragstart` → `{ lng: number; lat: number }`, `dui-marker-drag` → `{ lng: number; lat: number }`, `dui-marker-dragend` → `{ lng: number; lat: number }`
**Slots:** `default` (Marker sub-components)

### dui-map-marker-content `@dui/map`
Custom marker DOM content. Renders slotted content into the marker element.
**Slots:** `default` (Custom marker content)

### dui-map-marker-popup `@dui/map`
Click-to-open popup on a marker.
**Props:** `popupOffset`, `closeButton`
**Slots:** `default` (Popup content)

### dui-map-marker-tooltip `@dui/map`
Hover tooltip on a marker.
**Props:** `tooltipOffset`
**Slots:** `default` (Tooltip content)

### dui-map-marker-label `@dui/map`
Static label above or below a marker.
**Props:** `position`
**Slots:** `default` (Label text content)

### dui-map-popup `@dui/map`
Standalone popup at coordinates on the map.
**Props:** `longitude`, `latitude`, `popupOffset`, `closeButton`
**Events:** `dui-map-popup-close`
**Slots:** `default` (Popup content)

### dui-map-route `@dui/map`
GeoJSON LineString route layer on the map.
**Props:** `routeId`, `coordinates`, `color`, `width`, `opacity`, `dashArray`, `interactive`
**Events:** `dui-route-click`

### dui-map-region `@dui/map`
GeoJSON polygon fill layer for regional overlays on the map.
**Props:** `regionId`, `data`, `fillColor`, `fillOpacity`, `strokeColor`, `strokeWidth`, `strokeOpacity`, `interactive`
**Events:** `dui-region-click`

### dui-map-cluster-layer `@dui/map`
Clustered point visualization on the map.
**Props:** `data`, `clusterMaxZoom`, `clusterRadius`, `clusterColors`, `clusterThresholds`, `pointColor`
**Events:** `dui-cluster-point-click` → `{ feature, coordinates }`, `dui-cluster-click` → `{ clusterId, coordinates, pointCount }`

### dui-map-heatmap `@dui/map`
Heatmap density visualization on the map.
**Props:** `data`, `radius`, `intensity`, `opacity`, `weight`, `maxZoom`, `showPoints`, `pointColor`, `colorRamp`, `heatmapId`

### dui-chart `@dui/chart`
Chart component wrapping Observable Plot. Pass a Plot spec object to render SVG charts with automatic theming and responsive sizing.
**Props:** `spec`, `variant`, `tooltip`, `responsive`
**Events:** `dui-chart-render` → `{ element: SVGElement | HTMLElement }`, `dui-chart-input` → `{ value: unknown }`
