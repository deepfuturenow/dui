<!-- Generated from component-registry.ts — do not edit manually. -->
<!-- Run: deno task gen:skill-refs -->

# DUI Component Reference

All 57 component families. Every component exposes `::part(root)` for CSS access beyond tokens.

---

## Actions

### dui-button
An interactive button. Renders as a native <button> by default, or <a> when href is set.
**Import:** `@dui/components/button`
**Properties:** `disabled` (boolean, default: false), `focusableWhenDisabled` (boolean, default: false), `type` (string, default: "button"), `href` (string | undefined)
**Theme attributes:** `variant` ("neutral" | "primary" | "danger"), `appearance` ("filled" | "outline" | "ghost" | "soft" | "link"), `size` ("sm" | "md" | "lg")
**Events:** `dui-navigate` ({ href: string })
**Slots:** `default` (Button label content)
**Parts:** `root`
**Tokens:** `--button-bg`, `--button-fg`, `--button-border`, `--button-height`, `--button-width`, `--button-padding-y`, `--button-padding-x`, `--button-gap`, `--button-radius`, `--button-font-size`, `--button-icon-size`

### dui-toolbar
A 3-column toolbar layout with left, center, and right slots. CSS grid keeps the center slot centered regardless of left/right content width.
**Import:** `@dui/components/toolbar`
**Properties:** `inset` (boolean, default: false), `hasButtonLeft` (boolean, default: false), `hasButtonRight` (boolean, default: false)
**Theme attributes:** `size` ("sm" | "md" | "lg" | "xl")
**Slots:** `left` (Content aligned to the start), `center` (Content centered in the toolbar), `right` (Content aligned to the end)
**Parts:** `root`, `left`, `center`, `right`
**Tokens:** `--toolbar-padding-x`, `--toolbar-padding-y`, `--toolbar-padding-x-button`

### dui-split-button
A button with an attached dropdown menu trigger. The action zone (left) performs a primary action. The menu trigger (right) opens a dropdown of dui-menu-item children for secondary actions.
**Import:** `@dui/components/split-button`
**Properties:** `popup-min-width` (string, default: "var(--space-28)"), `disabled` (boolean, default: false)
**Theme attributes:** `variant` ("neutral" | "primary" | "danger"), `appearance` ("filled" | "outline" | "ghost" | "soft"), `size` ("xs" | "sm" | "md" | "lg")
**Events:** `dui-action` ({})
**Slots:** `default` (Action button label content), `icon` (Custom icon for the dropdown trigger (defaults to chevron-down)), `menu` (dui-menu-item elements for the dropdown)
**Parts:** `root`, `action`, `divider`, `trigger`
**Tokens:** `--sb-bg`, `--sb-fg`, `--sb-border`, `--sb-trigger-bg`, `--sb-divider`, `--sb-height`, `--sb-action-padding-y`, `--sb-action-padding-x`, `--sb-trigger-padding-x`, `--sb-gap`, `--sb-radius`, `--sb-font-size`, `--sb-icon-size`, `--sb-trigger-icon-size`

### dui-toggle
A two-state toggle button. Works standalone or inside a toggle group.
**Import:** `@dui/components/toggle`
**Properties:** `pressed` (boolean | undefined), `defaultPressed` (boolean, default: false), `disabled` (boolean, default: false), `value` (string | undefined)
**Theme attributes:** `size` ("sm" | "md" | "lg")
**Events:** `pressed-change` ({ pressed: boolean })
**Slots:** `default` (Toggle content (text and/or icons)), `icon` (Optional leading icon)
**Parts:** `root`
**Tokens:** `--toggle-gap`, `--toggle-height`, `--toggle-padding-y`, `--toggle-padding-x`, `--toggle-gap`, `--toggle-radius`, `--toggle-font-size`, `--toggle-icon-size`

### dui-toggle-group
Groups toggle buttons with shared single or multi selection state.
**Import:** `@dui/components/toggle`
**Properties:** `value` (string[] | undefined), `defaultValue` (string[], default: []), `type` ("single" | "multiple", default: "single"), `orientation` ("horizontal" | "vertical", default: "horizontal"), `disabled` (boolean, default: false), `loop` (boolean, default: true)
**Events:** `value-change` ({ value: string[] })
**Slots:** `default` (dui-toggle children)
**Parts:** `root`

## Data Entry

### dui-input
A native input element that integrates with dui-field for accessible labeling and validation.
**Import:** `@dui/components/input`
**Properties:** `type` (string, default: "text"), `value` (string, default: ""), `placeholder` (string, default: ""), `disabled` (boolean, default: false), `required` (boolean, default: false), `readonly` (boolean, default: false), `minLength` (number | undefined), `maxLength` (number | undefined), `pattern` (string | undefined), `name` (string, default: ""), `autocomplete` (string | undefined), `autofocus` (boolean, default: false)
**Events:** `input-change` ({ value: string })
**Parts:** `input`

### dui-textarea
A multi-line text input with resize modes including auto-grow.
**Import:** `@dui/components/textarea`
**Properties:** `value` (string, default: ""), `placeholder` (string, default: ""), `disabled` (boolean, default: false), `required` (boolean, default: false), `readonly` (boolean, default: false), `rows` (number | undefined), `minLength` (number | undefined), `maxLength` (number | undefined), `name` (string, default: ""), `resize` ("none" | "vertical" | "horizontal" | "both" | "auto", default: "vertical"), `maxHeight` (string | undefined)
**Theme attributes:** `variant` ("default" | "ghost")
**Events:** `textarea-change` ({ value: string })
**Parts:** `textarea`

### dui-select
A dropdown select for choosing from a list of predefined options.
**Import:** `@dui/components/select`
**Properties:** `options` (SelectOption[], default: []), `value` (string, default: ""), `placeholder` (string, default: "Select..."), `disabled` (boolean, default: false), `align-item-to-trigger` (boolean, default: true), `name` (string, default: "")
**Events:** `value-change` ({ value: string; option: SelectOption })
**Parts:** `trigger`, `value`

### dui-combobox
Searchable dropdown with single and multi-select modes.
**Import:** `@dui/components/combobox`
**Properties:** `options` (SelectOption[], default: []), `value` (string, default: ""), `values` (Set<string>, default: new Set()), `multiple` (boolean, default: false), `placeholder` (string, default: "Search..."), `disabled` (boolean, default: false), `name` (string, default: "")
**Events:** `value-change` ({ value: string; option: SelectOption }), `values-change` ({ value: string; selected: boolean; values: Set<string> })
**Parts:** `root`

### dui-checkbox
A checkbox input with optional indeterminate state and group support.
**Import:** `@dui/components/checkbox`
**Properties:** `checked` (boolean | undefined), `defaultChecked` (boolean, default: false), `indeterminate` (boolean, default: false), `disabled` (boolean, default: false), `readOnly` (boolean, default: false), `required` (boolean, default: false), `name` (string | undefined), `value` (string | undefined), `parent` (boolean, default: false)
**Events:** `checked-change` ({ checked: boolean; indeterminate: boolean })
**Slots:** `default` (Label content)
**Parts:** `root`, `indicator`
**Tokens:** `--checkbox-size`

#### dui-checkbox-group
Groups multiple checkboxes with shared state management.
**Import:** `@dui/components/checkbox`
**Properties:** `value` (string[] | undefined), `defaultValue` (string[], default: []), `allValues` (string[], default: []), `disabled` (boolean, default: false)
**Events:** `value-change` (string[])
**Slots:** `default` (dui-checkbox children)
**Parts:** `root`

### dui-radio-group
Groups multiple radio buttons with shared state. Only one radio can be selected at a time.
**Import:** `@dui/components/radio`
**Properties:** `name` (string | undefined), `value` (string | undefined), `defaultValue` (string | undefined), `disabled` (boolean, default: false), `readOnly` (boolean, default: false), `required` (boolean, default: false)
**Events:** `value-change` ({ value: string })
**Slots:** `default` (dui-radio children)
**Parts:** `root`

#### dui-radio
A radio button input. Must be used within a dui-radio-group.
**Import:** `@dui/components/radio`
**Properties:** `value` (string, default: ""), `disabled` (boolean, default: false), `readOnly` (boolean, default: false)
**Slots:** `default` (Label content)
**Parts:** `root`, `dot`
**Tokens:** `--radio-size`

### dui-switch
A toggle switch with checked, disabled, and read-only states.
**Import:** `@dui/components/switch`
**Properties:** `checked` (boolean | undefined), `defaultChecked` (boolean, default: false), `disabled` (boolean, default: false), `readOnly` (boolean, default: false), `required` (boolean, default: false), `name` (string | undefined), `value` (string, default: "on")
**Events:** `checked-change` ({ checked: boolean })
**Slots:** `default` (Label content)
**Parts:** `root`, `thumb`
**Tokens:** `--switch-width`, `--switch-height`, `--switch-thumb-size`, `--switch-thumb-offset`, `--switch-checked-offset`

### dui-slider
A slider for selecting numeric values within a range. Supports a field variant with value readout, label, unit suffix, and gradient track backgrounds.
**Import:** `@dui/components/slider`
**Properties:** `value` (number, default: 0), `min` (number, default: 0), `max` (number, default: 100), `step` (number, default: 1), `disabled` (boolean, default: false), `name` (string, default: ""), `label` (string, default: ""), `unit` (string, default: ""), `precision` (number | undefined)
**Theme attributes:** `variant` ("field")
**Events:** `value-change` ({ value: number }), `value-committed` ({ value: number })
**Parts:** `root`, `track`, `indicator`, `thumb`, `label`, `readout`, `unit`
**Tokens:** `--slider-track-height`, `--slider-thumb-size`, `--slider-track-bg`, `--slider-indicator-color`, `--slider-indicator-opacity`

### dui-number-field
A numeric input with optional label, icon, unit suffix, drag-to-scrub, and precision formatting. For simple +/- stepping, use dui-stepper.
**Import:** `@dui/components/number-field`
**Properties:** `value` (number | undefined), `defaultValue` (number | undefined), `min` (number | undefined), `max` (number | undefined), `step` (number, default: 1), `largeStep` (number, default: 10), `disabled` (boolean, default: false), `readOnly` (boolean, default: false), `required` (boolean, default: false), `name` (string | undefined), `label` (string, default: ""), `labelPosition` (string, default: ""), `iconPosition` (string, default: ""), `unit` (string, default: ""), `precision` (number | undefined), `scrubLabel` (boolean, default: false), `scrubValue` (boolean, default: false), `scrubField` (boolean, default: false), `clickLabel` (boolean, default: false), `clickValue` (boolean, default: false), `clickField` (boolean, default: false)
**Theme attributes:** `label-position` ("inside-left" | "above" | "below" | "outside-left"), `icon-position` ("inside-left" | "inside-right" | "outside-left")
**Events:** `value-change` ({ value: number }), `value-committed` ({ value: number })
**Slots:** `icon` (Icon content (SVG, dui-icon, etc.), positioned by icon-position)
**Parts:** `root`, `label`, `icon`, `input`, `unit`
**Tokens:** `--number-field-bg`, `--number-field-fg`, `--number-field-border`, `--number-field-height`, `--number-field-radius`, `--number-field-font-size`, `--number-field-value-align`, `--number-field-label-bg`, `--number-field-label-fg`, `--number-field-label-width`

### dui-stepper
A simple numeric input with increment/decrement buttons. For labels, icons, scrubbing, and units, use dui-number-field.
**Import:** `@dui/components/stepper`
**Properties:** `value` (number | undefined), `defaultValue` (number | undefined), `min` (number | undefined), `max` (number | undefined), `step` (number, default: 1), `largeStep` (number, default: 10), `disabled` (boolean, default: false), `readOnly` (boolean, default: false), `required` (boolean, default: false), `name` (string | undefined)
**Events:** `value-change` ({ value: number }), `value-committed` ({ value: number })
**Slots:** `decrement` (Custom decrement button content), `increment` (Custom increment button content)
**Parts:** `root`, `input`, `decrement`, `increment`

### dui-dropzone
A drag-and-drop file upload area with validation for file type, size, and count.
**Import:** `@dui/components/dropzone`
**Properties:** `accept` (string | undefined), `multiple` (boolean, default: false), `disabled` (boolean, default: false), `maxFiles` (number, default: Infinity), `maxSize` (number, default: Infinity), `minSize` (number, default: 0), `autoFocus` (boolean, default: false), `noStyle` (boolean, default: false)
**Events:** `drop` ({ acceptedFiles: File[]; rejectedFiles: RejectedFile[] }), `drop-accepted` ({ acceptedFiles: File[] }), `drop-rejected` ({ rejectedFiles: RejectedFile[] }), `dropzone-error` ({ error: unknown; code: string })
**Slots:** `default` (Custom content for the dropzone area)
**Parts:** `root`

### dui-field
Slot-based form field wrapper. Provides label, description, and error slots with automatic ARIA wiring and field state tracking.
**Import:** `@dui/components/field`
**Properties:** `disabled` (boolean, default: false), `invalid` (boolean, default: false), `orientation` ("vertical" | "horizontal", default: "vertical")
**Slots:** `label` (Label text (e.g. <span slot="label">Email</span>)), `default` (The form control), `description` (Help text (e.g. <span slot="description">…</span>)), `error` (Error message (e.g. <span slot="error">Required</span>))
**Parts:** `root`, `label`, `description`, `error`

### dui-fieldset
Semantic grouping for related form fields using a native fieldset element.
**Import:** `@dui/components/fieldset`
**Properties:** `disabled` (boolean, default: false)
**Slots:** `legend` (Legend text (e.g. <span slot="legend">Personal Info</span>)), `default` (Field children)
**Parts:** `root`, `legend`

## Data Display

### dui-data-table
A sortable, paginated data table with column definitions and custom cell renderers.
**Import:** `@dui/components/data-table`
**Properties:** `columns` (ColumnDef<T>[], default: []), `data` (T[], default: []), `pageSize` (number, default: 10), `rowKey` (((row: T) => string) | undefined), `emptyText` (string, default: "No results.")
**Events:** `sort-change` (SortState | null), `page-change` (PageState)
**Parts:** `root`, `table-window`, `table`, `pagination`

### dui-badge
An inline status indicator element.
**Import:** `@dui/components/badge`
**Theme attributes:** `variant` ("neutral" | "primary" | "danger"), `appearance` ("filled" | "outline" | "soft")
**Slots:** `default` (Badge content)
**Parts:** `root`
**Tokens:** `--badge-bg`, `--badge-fg`, `--badge-border`, `--badge-icon-size`

### dui-avatar
Image display with fallback content and loading state management.
**Import:** `@dui/components/avatar`
**Properties:** `src` (string | undefined), `alt` (string, default: ""), `size` (string | undefined), `fallbackDelay` (number | undefined)
**Events:** `loading-status-change` ({ status: ImageStatus })
**Slots:** `default` (Fallback content (e.g. initials or icon))
**Parts:** `root`, `image`, `fallback`
**Tokens:** `--avatar-size`, `--avatar-bg`, `--avatar-fg`

### dui-calendar
A date picker calendar grid with keyboard navigation and locale support.
**Import:** `@dui/components/calendar`
**Properties:** `value` (string | undefined), `defaultValue` (string | undefined), `min` (string | undefined), `max` (string | undefined), `locale` (string, default: "en-US"), `disabled` (boolean, default: false), `readOnly` (boolean, default: false)
**Events:** `value-change` ({ value: string })
**Slots:** `prev` (Custom previous month button content), `next` (Custom next month button content)
**Parts:** `root`, `header`, `heading`, `prev`, `next`, `grid`, `weekday`, `day`

### dui-progress
A progress bar indicating completion status. Supports determinate and indeterminate states.
**Import:** `@dui/components/progress`
**Properties:** `value` (number | null, default: null), `min` (number, default: 0), `max` (number, default: 100)
**Parts:** `root`, `track`, `indicator`
**Tokens:** `--progress-height`, `--progress-value`

### dui-spinner
A loading indicator with multiple animation variants.
**Import:** `@dui/components/spinner`
**Properties:** `variant` ("pulse" | "lucide-loader" | "lucide-loader-circle", default: "pulse")
**Theme attributes:** `size` ("sm" | "md" | "lg")
**Parts:** `root`
**Tokens:** `--spinner-size`, `--spinner-color`

## Overlays

### dui-dialog
A modal dialog with backdrop, focus trap, and open/close animation. Closes on backdrop click.
**Import:** `@dui/components/dialog`
**Properties:** `open` (boolean | undefined), `defaultOpen` (boolean, default: false)
**Events:** `open-change` ({ open: boolean })
**Slots:** `default` (dui-dialog-trigger and dui-dialog-popup)
**Parts:** `root`

#### dui-dialog-trigger
Behavioral wrapper that opens the dialog on click.
**Import:** `@dui/components/dialog`
**Slots:** `default` (Content that triggers the dialog)
**Parts:** `root`

#### dui-dialog-popup
The dialog overlay with backdrop, centered popup, focus trap, and animation.
**Import:** `@dui/components/dialog`
**Properties:** `keepMounted` (boolean, default: false), `initialFocus` (string | undefined), `finalFocus` (string | undefined), `width` (string | undefined)
**Slots:** `title` (Dialog title (rendered as h2)), `description` (Dialog description (rendered as p)), `default` (Dialog content (actions, form fields, etc.))
**Parts:** `backdrop`, `popup`, `title`, `description`

#### dui-dialog-close
A close button wrapper that closes the dialog on click.
**Import:** `@dui/components/dialog`
**Slots:** `default` (Content that closes the dialog)
**Parts:** `root`

### dui-alert-dialog
A modal dialog for critical actions. Does NOT close on backdrop click — requires explicit user action.
**Import:** `@dui/components/alert-dialog`
**Properties:** `open` (boolean | undefined), `defaultOpen` (boolean, default: false)
**Events:** `open-change` ({ open: boolean })
**Slots:** `default` (dui-alert-dialog-trigger and dui-alert-dialog-popup)
**Parts:** `root`

#### dui-alert-dialog-trigger
Behavioral wrapper that opens the alert dialog on click.
**Import:** `@dui/components/alert-dialog`
**Slots:** `default` (Content that triggers the alert dialog)
**Parts:** `root`

#### dui-alert-dialog-popup
The alert dialog overlay with backdrop, centered popup, focus trap, and animation.
**Import:** `@dui/components/alert-dialog`
**Properties:** `keepMounted` (boolean, default: false), `initialFocus` (string | undefined), `finalFocus` (string | undefined)
**Slots:** `title` (Alert dialog title (rendered as h2)), `description` (Alert dialog description (rendered as p)), `default` (Dialog content (actions, etc.))
**Parts:** `backdrop`, `popup`, `title`, `description`

#### dui-alert-dialog-close
A close button wrapper that closes the alert dialog on click.
**Import:** `@dui/components/alert-dialog`
**Slots:** `default` (Content that closes the alert dialog)
**Parts:** `root`

### dui-popover
A popover with trigger, popup, and close sub-components.
**Import:** `@dui/components/popover`
**Properties:** `open` (boolean, default: false), `defaultOpen` (boolean, default: false), `side` ("top" | "bottom", default: "bottom"), `sideOffset` (number, default: 8)
**Events:** `open-change` ({ open: boolean })
**Slots:** `default` (dui-popover-trigger and dui-popover-popup)
**Parts:** `root`

#### dui-popover-trigger
Click-to-toggle trigger for the popover.
**Import:** `@dui/components/popover`
**Slots:** `default` (Content that triggers the popover)
**Parts:** `root`

#### dui-popover-popup
The popover popup content container.
**Import:** `@dui/components/popover`
**Properties:** `showArrow` (boolean, default: true), `closeOnClick` (boolean, default: false)
**Slots:** `default` (Popover content)
**Parts:** `root`
**Tokens:** `--popover-popup-padding`

#### dui-popover-close
A close button wrapper for the popover.
**Import:** `@dui/components/popover`
**Slots:** `default` (Content that closes the popover)
**Parts:** `root`

### dui-tooltip
A tooltip with hover/focus trigger and configurable delay.
**Import:** `@dui/components/tooltip`
**Properties:** `open` (boolean, default: false), `defaultOpen` (boolean, default: false), `side` ("top" | "bottom", default: "top"), `sideOffset` (number, default: 6), `delay` (number, default: 500), `closeDelay` (number, default: 0), `disabled` (boolean, default: false)
**Events:** `open-change` ({ open: boolean })
**Slots:** `default` (dui-tooltip-trigger and dui-tooltip-popup)
**Parts:** `root`

#### dui-tooltip-trigger
The element that triggers the tooltip on hover/focus.
**Import:** `@dui/components/tooltip`
**Properties:** `disabled` (boolean, default: false)
**Slots:** `default` (Content that triggers the tooltip)
**Parts:** `root`

#### dui-tooltip-popup
The tooltip popup content container.
**Import:** `@dui/components/tooltip`
**Properties:** `showArrow` (boolean, default: true)
**Slots:** `default` (Tooltip content)
**Parts:** `root`

### dui-menu
A popup menu triggered by a slotted element with keyboard navigation.
**Import:** `@dui/components/menu`
**Properties:** `popup-min-width` (string, default: "var(--space-28)")
**Slots:** `trigger` (The element that opens the menu on click), `default` (dui-menu-item children)
**Parts:** `root`

#### dui-menu-item
An item within a dui-menu.
**Import:** `@dui/components/menu`
**Properties:** `disabled` (boolean, default: false)
**Theme attributes:** `variant` ("default" | "danger")
**Slots:** `default` (Item content)
**Parts:** `root`

### dui-menubar
A horizontal bar of menus with coordinated open/close behavior.
**Import:** `@dui/components/menubar`
**Properties:** `loop` (boolean, default: true), `orientation` ("horizontal" | "vertical", default: "horizontal")
**Slots:** `default` (dui-menu children)
**Parts:** `root`

### dui-command
A searchable command palette with keyboard navigation, filtering, and grouped items.
**Import:** `@dui/components/command`
**Properties:** `loop` (boolean, default: false), `shouldFilter` (boolean, default: true), `value` (string | undefined), `filter` (FilterFn | undefined)
**Events:** `select` (string), `search-change` (string), `escape`
**Slots:** `default` (Command input, list, groups, and items)
**Parts:** `root`

#### dui-command-input
Search input for the command palette.
**Import:** `@dui/components/command`
**Properties:** `placeholder` (string, default: "Search...")
**Parts:** `root`

#### dui-command-list
Scrollable list container for command items and groups.
**Import:** `@dui/components/command`
**Slots:** `default` (Command groups, items, separators, and empty state)
**Parts:** `root`

#### dui-command-group
Groups related command items with an optional heading. Hides when no items match the search.
**Import:** `@dui/components/command`
**Properties:** `heading` (string, default: "")
**Slots:** `default` (Command items)
**Parts:** `root`

#### dui-command-item
A selectable item within a command group or list.
**Import:** `@dui/components/command`
**Properties:** `value` (string, default: ""), `keywords` (string[], default: []), `disabled` (boolean, default: false)
**Slots:** `default` (Item content)
**Parts:** `root`

#### dui-command-empty
Shown when no command items match the search query.
**Import:** `@dui/components/command`
**Slots:** `default` (Empty state content)
**Parts:** `root`

#### dui-command-separator
A visual separator between command groups or items.
**Import:** `@dui/components/command`
**Parts:** `root`

#### dui-command-shortcut
Displays a keyboard shortcut hint within a command item.
**Import:** `@dui/components/command`
**Slots:** `default` (Shortcut text (e.g. ⌘K))
**Parts:** `root`

### dui-preview-card
A hover card that shows rich preview content. Stays open when cursor moves to the popup.
**Import:** `@dui/components/preview-card`
**Properties:** `open` (boolean, default: false), `defaultOpen` (boolean, default: false), `side` ("top" | "bottom", default: "top"), `sideOffset` (number, default: 8), `delay` (number, default: 400), `closeDelay` (number, default: 300)
**Events:** `open-change` ({ open: boolean })
**Slots:** `default` (dui-preview-card-trigger and dui-preview-card-popup)
**Parts:** `root`

#### dui-preview-card-trigger
The element that triggers the preview card on hover/focus.
**Import:** `@dui/components/preview-card`
**Slots:** `default` (Content that triggers the preview card (e.g. a link))
**Parts:** `root`

#### dui-preview-card-popup
The preview card popup content container. Stays open on hover.
**Import:** `@dui/components/preview-card`
**Properties:** `showArrow` (boolean, default: true)
**Slots:** `default` (Preview card content)
**Parts:** `root`
**Tokens:** `--preview-card-popup-padding`

## Navigation

### dui-sidebar-provider
Root state manager for the sidebar. Manages open/close state, mobile detection, and provides context.
**Import:** `@dui/components/sidebar`
**Properties:** `open` (boolean | undefined), `defaultOpen` (boolean, default: true), `side` ("left" | "right", default: "left"), `variant` ("sidebar" | "floating" | "inset", default: "sidebar"), `collapsible` ("offcanvas" | "icon" | "none", default: "offcanvas")
**Events:** `open-change` ({ open: boolean })
**Slots:** `default` (Sidebar and content areas)
**Parts:** `root`

#### dui-sidebar
The sidebar panel itself. Renders desktop or mobile layout based on viewport.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Sidebar content (header, content, footer))
**Parts:** `root`
**Tokens:** `--sidebar-width`, `--sidebar-width-icon`, `--sidebar-width-mobile`, `--sidebar-bg`, `--sidebar-fg`, `--sidebar-border`, `--sidebar-ring`, `--sidebar-muted-fg`, `--sidebar-separator`, `--sidebar-button-fg`, `--sidebar-button-bg`, `--sidebar-button-inset`, `--sidebar-group-padding-y`, `--sidebar-group-label-inset`, `--sidebar-header-content-gap`

#### dui-sidebar-trigger
Toggle button for the sidebar.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Override the default icon)
**Parts:** `root`

#### dui-sidebar-content
Scrollable content section of the sidebar.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Groups, menus, etc.)
**Parts:** `root`

#### dui-sidebar-header
Header section at the top of the sidebar.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Header content)
**Parts:** `root`

#### dui-sidebar-footer
Footer section at the bottom of the sidebar.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Footer content)
**Parts:** `root`

#### dui-sidebar-group
Section container within the sidebar for grouping related items.
**Import:** `@dui/components/sidebar`
**Slots:** `label` (Group label (use dui-sidebar-group-label)), `default` (Group content)
**Parts:** `root`

#### dui-sidebar-group-label
Heading for a sidebar group. Hides in icon-collapsed mode.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Label text)
**Parts:** `root`

#### dui-sidebar-menu
Navigation menu container within a sidebar group.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Menu items)
**Parts:** `root`

#### dui-sidebar-menu-item
Individual item within a sidebar menu.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Menu button or content)
**Parts:** `root`

#### dui-sidebar-menu-button
Interactive button or link within a sidebar menu. Renders as anchor when href is set.
**Import:** `@dui/components/sidebar`
**Properties:** `active` (boolean, default: false), `disabled` (boolean, default: false), `tooltip` (string, default: ""), `href` (string | undefined)
**Theme attributes:** `size` ("default" | "sm" | "lg")
**Events:** `spa-navigate` ({ href: string })
**Slots:** `icon` (Icon slot, shown before the label), `default` (Label text), `suffix` (Suffix slot, shown after the label)
**Parts:** `root`
**Tokens:** `--smb-height`, `--smb-padding-x`, `--smb-gap`, `--smb-radius`, `--smb-font-size`, `--smb-icon-size`

#### dui-sidebar-separator
A visual separator within the sidebar.
**Import:** `@dui/components/sidebar`
**Parts:** `root`

#### dui-sidebar-inset
Main content area that adjusts its width based on the sidebar state.
**Import:** `@dui/components/sidebar`
**Slots:** `default` (Main content)
**Parts:** `root`

### dui-breadcrumb
Navigation breadcrumb trail showing the current page location.
**Import:** `@dui/components/breadcrumb`
**Slots:** `default` (Breadcrumb items and separators)
**Parts:** `root`

#### dui-breadcrumb-item
List item wrapper for a single breadcrumb entry.
**Import:** `@dui/components/breadcrumb`
**Slots:** `default` (A breadcrumb link, page, or ellipsis)
**Parts:** `root`

#### dui-breadcrumb-link
Styled wrapper for a clickable breadcrumb link.
**Import:** `@dui/components/breadcrumb`
**Slots:** `default` (An <a> element for navigation)
**Parts:** `root`

#### dui-breadcrumb-page
Current page indicator (not clickable).
**Import:** `@dui/components/breadcrumb`
**Slots:** `default` (The current page label text)
**Parts:** `root`

#### dui-breadcrumb-separator
Visual separator between breadcrumb items. Defaults to "/".
**Import:** `@dui/components/breadcrumb`
**Slots:** `default` (Custom separator content (defaults to "/"))
**Parts:** `root`

#### dui-breadcrumb-ellipsis
Collapsed breadcrumb indicator. Defaults to "…".
**Import:** `@dui/components/breadcrumb`
**Slots:** `default` (Custom ellipsis content (defaults to "…"))
**Parts:** `root`

### dui-tabs
A tabbed interface with animated indicator and keyboard navigation.
**Import:** `@dui/components/tabs`
**Properties:** `value` (string | undefined), `defaultValue` (string | undefined), `orientation` ("horizontal" | "vertical", default: "horizontal"), `controls` ("header" | "footer", default: "header")
**Events:** `value-change` (string)
**Slots:** `default` (Tab list and tab panels)
**Parts:** `root`
**Tokens:** `--tabs-indicator-bg`, `--tabs-indicator-height`, `--tabs-indicator-radius`, `--tabs-indicator-duration`, `--tabs-indicator-easing`, `--tabs-list-justify`, `--tabs-panel-padding`, `--tabs-panel-background`, `--tabs-panel-border-width`, `--tabs-panel-border-color`, `--tabs-panel-border-radius`

#### dui-tabs-list
Container for tab triggers. Manages indicator positioning.
**Import:** `@dui/components/tabs`
**Slots:** `default` (dui-tab elements and optional dui-tabs-indicator)
**Parts:** `list`
**Tokens:** `--tabs-list-justify`

#### dui-tab
Individual tab trigger button.
**Import:** `@dui/components/tabs`
**Properties:** `value` (string, default: ""), `disabled` (boolean, default: false)
**Slots:** `default` (Tab label content)
**Parts:** `tab`

#### dui-tabs-panel
Content panel for a tab. Shown when the matching tab is active.
**Import:** `@dui/components/tabs`
**Properties:** `value` (string, default: ""), `keepMounted` (boolean, default: false)
**Slots:** `default` (Panel content)
**Parts:** `panel`
**Tokens:** `--tabs-panel-padding`, `--tabs-panel-background`, `--tabs-panel-border-width`, `--tabs-panel-border-color`, `--tabs-panel-border-radius`

#### dui-tabs-indicator
Animated background indicator for the active tab.
**Import:** `@dui/components/tabs`
**Parts:** `root`
**Tokens:** `--tabs-indicator-bg`, `--tabs-indicator-height`, `--tabs-indicator-radius`, `--tabs-indicator-duration`, `--tabs-indicator-easing`

## Disclosure

### dui-accordion
Vertically stacked sections with expandable/collapsible panels.
**Import:** `@dui/components/accordion`
**Properties:** `value` (string[] | undefined), `defaultValue` (string[], default: []), `disabled` (boolean, default: false), `multiple` (boolean, default: false), `loopFocus` (boolean, default: true), `orientation` ("vertical" | "horizontal", default: "vertical"), `keepMounted` (boolean, default: false)
**Events:** `value-change` (string[])
**Slots:** `default` (Container for dui-accordion-item children)
**Parts:** `root`
**Tokens:** `--accordion-item-border`

#### dui-accordion-item
Individual collapsible item within an accordion.
**Import:** `@dui/components/accordion`
**Properties:** `value` (string, default: ""), `disabled` (boolean, default: false)
**Events:** `open-change` ({ value: string; open: boolean })
**Slots:** `trigger` (Header/trigger content), `default` (Panel content)
**Parts:** `item`, `trigger`, `indicator`, `panel`, `content`

### dui-collapsible
A standalone disclosure widget with animated open/close transitions.
**Import:** `@dui/components/collapsible`
**Properties:** `open` (boolean, default: false), `defaultOpen` (boolean, default: false), `disabled` (boolean, default: false), `keepMounted` (boolean, default: false)
**Events:** `open-change` ({ open: boolean })
**Slots:** `trigger` (Trigger label content), `default` (Panel content)
**Parts:** `trigger`, `indicator`, `panel`, `content`
**Tokens:** `--collapsible-indicator-display`

## Content

### dui-card
A container for grouped content with header, body, and footer sections. Uses flex-column + gap for vertical rhythm.
**Import:** `@dui/components/card`
**Properties:** `size` ("" | "sm", default: "")
**Slots:** `default` (Main card content (body).), `title` (Card heading text.), `description` (Helper text below the title.), `action` (Top-right header action (button, badge, etc.).), `footer` (Footer content (buttons, links, etc.).)
**Parts:** `root`, `header`, `header-text`, `action`, `content`, `footer`
**Tokens:** `--card-gap`, `--card-px`, `--card-py-top`, `--card-py-bottom`, `--card-action-offset-top`, `--card-action-offset-end`

### dui-card-grid
A responsive grid layout for cards and panels. Distributes children into equal-width columns that collapse at narrow container widths.
**Import:** `@dui/components/card-grid`
**Properties:** `columns` (string, default: "3")
**Slots:** `default` (Grid children (cards, panels, or any block content))
**Parts:** `root`

### dui-scroll-area
Custom scrollbar overlay with fade support.
**Import:** `@dui/components/scroll-area`
**Properties:** `orientation` (string, default: "vertical"), `fade` (boolean, default: false), `maxHeight` (string | undefined)
**Events:** `scrolled-to-bottom`, `scrolled-from-bottom`
**Slots:** `default` (Scrollable content)
**Parts:** `viewport`, `scrollbar-vertical`, `scrollbar-horizontal`, `thumb-vertical`, `thumb-horizontal`
**Tokens:** `--scroll-area-max-height`, `--scroll-area-thumb-color`, `--scroll-fade-size`

### dui-separator
A visual divider between content sections. Supports horizontal and vertical orientation.
**Import:** `@dui/components/separator`
**Properties:** `orientation` ("horizontal" | "vertical", default: "horizontal")
**Parts:** `root`
**Tokens:** `--separator-margin`

## Helpers

### dui-icon
Slot-based SVG icon container. Provide your own SVG via the default slot; inherits currentColor and sizes via --icon-size.
**Import:** `@dui/components/icon`
**Slots:** `default` (SVG element to display)
**Parts:** `root`
**Tokens:** `--icon-size`, `--icon-color`

### dui-portal
Teleports light DOM children to a target container elsewhere in the document.
**Import:** `@dui/components/portal`
**Properties:** `target` (string, default: "body"), `targetRoot` ("shadow" | "document", default: "document"), `targetElement` (HTMLElement | undefined)
**Slots:** `default` (Content to teleport)
**Parts:** `root`

### dui-trunc
Text truncation with ellipsis. Single-line by default, or multi-line clamping with max-lines.
**Import:** `@dui/components/trunc`
**Properties:** `maxWidth` (string, default: "20rem"), `maxLines` (number | undefined)
**Slots:** `default` (Text content to truncate)
**Parts:** `root`

## Other

### dui-map
Root map component wrapping MapLibre GL JS. Initializes the map, provides context to children, auto-detects dark/light theme.
**Import:** `@dui/map`
**Properties:** `center` ([number, number], default: [0, 0]), `zoom` (number, default: 1), `bearing` (number, default: 0), `pitch` (number, default: 0), `theme` ("light" | "dark" | undefined), `styleLight` (string | undefined), `styleDark` (string | undefined), `loading` (boolean, default: false), `noWorldCopies` (boolean, default: false), `controlled` (boolean, default: false), `minZoom` (number, default: 0), `maxZoom` (number, default: 22), `maxBounds` ([[number, number], [number, number]] | undefined), `bounds` ([[number, number], [number, number]] | undefined), `boundsPadding` (number, default: 50)
**Events:** `dui-map-viewport-change` (MapViewport), `dui-map-load`, `dui-map-click` (MapClickDetail), `dui-map-dblclick` (MapClickDetail), `dui-map-contextmenu` (MapClickDetail)
**Slots:** `default` (Map overlay content (controls, markers, popups, routes))
**Parts:** `container`, `loader`

### dui-map-controls
Zoom, compass, locate, and fullscreen map controls.
**Import:** `@dui/map`
**Properties:** `position` ("top-left" | "top-right" | "bottom-left" | "bottom-right", default: "bottom-right"), `showZoom` (boolean, default: true), `showCompass` (boolean, default: false), `showLocate` (boolean, default: false), `showFullscreen` (boolean, default: false)
**Events:** `dui-map-locate` ({ longitude: number; latitude: number })
**Parts:** `root`, `group`, `control-button`

### dui-map-marker
Places a marker at a coordinate on the map.
**Import:** `@dui/map`
**Properties:** `longitude` (number, default: 0), `latitude` (number, default: 0), `draggable` (boolean, default: false), `rotation` (number, default: 0), `offset` ([number, number], default: [0, 0])
**Events:** `dui-marker-dragstart` ({ lng: number; lat: number }), `dui-marker-drag` ({ lng: number; lat: number }), `dui-marker-dragend` ({ lng: number; lat: number })
**Slots:** `default` (Marker sub-components)
**Parts:** `root`

### dui-map-marker-content
Custom marker DOM content. Renders slotted content into the marker element.
**Import:** `@dui/map`
**Slots:** `default` (Custom marker content)
**Parts:** `root`

### dui-map-marker-popup
Click-to-open popup on a marker.
**Import:** `@dui/map`
**Properties:** `popupOffset` (number, default: 16), `closeButton` (boolean, default: false)
**Slots:** `default` (Popup content)
**Parts:** `popup`

### dui-map-marker-tooltip
Hover tooltip on a marker.
**Import:** `@dui/map`
**Properties:** `tooltipOffset` (number, default: 16)
**Slots:** `default` (Tooltip content)
**Parts:** `tooltip`

### dui-map-marker-label
Static label above or below a marker.
**Import:** `@dui/map`
**Properties:** `position` ("top" | "bottom", default: "top")
**Slots:** `default` (Label text content)
**Parts:** `label`

### dui-map-popup
Standalone popup at coordinates on the map.
**Import:** `@dui/map`
**Properties:** `longitude` (number, default: 0), `latitude` (number, default: 0), `popupOffset` (number, default: 16), `closeButton` (boolean, default: false)
**Events:** `dui-map-popup-close`
**Slots:** `default` (Popup content)
**Parts:** `popup`

### dui-map-route
GeoJSON LineString route layer on the map.
**Import:** `@dui/map`
**Properties:** `routeId` (string), `coordinates` ([number, number][], default: []), `color` (string, default: "#4285F4"), `width` (number, default: 3), `opacity` (number, default: 0.8), `dashArray` ([number, number] | undefined), `interactive` (boolean, default: true)
**Events:** `dui-route-click`
**Parts:** `root`

### dui-map-region
GeoJSON polygon fill layer for regional overlays on the map.
**Import:** `@dui/map`
**Properties:** `regionId` (string), `data` (string | GeoJSON.Feature | GeoJSON.FeatureCollection), `fillColor` (string, default: "rgba(59, 130, 246, 0.3)"), `fillOpacity` (number, default: 1), `strokeColor` (string, default: "#3b82f6"), `strokeWidth` (number, default: 2), `strokeOpacity` (number, default: 1), `interactive` (boolean, default: true)
**Events:** `dui-region-click`
**Parts:** `root`

### dui-map-cluster-layer
Clustered point visualization on the map.
**Import:** `@dui/map`
**Properties:** `data` (string | GeoJSON.FeatureCollection), `clusterMaxZoom` (number, default: 14), `clusterRadius` (number, default: 50), `clusterColors` ([string, string, string], default: ["#22c55e", "#eab308", "#ef4444"]), `clusterThresholds` ([number, number], default: [100, 750]), `pointColor` (string, default: "#3b82f6")
**Events:** `dui-cluster-point-click` ({ feature, coordinates }), `dui-cluster-click` ({ clusterId, coordinates, pointCount })
**Parts:** `root`

### dui-map-heatmap
Heatmap density visualization on the map.
**Import:** `@dui/map`
**Properties:** `data` (string | GeoJSON.FeatureCollection), `radius` (number, default: 20), `intensity` (number, default: 1), `opacity` (number, default: 0.8), `weight` (string, default: ""), `maxZoom` (number, default: 9), `showPoints` (boolean, default: true), `pointColor` (string, default: "#3b82f6"), `colorRamp` (string[]), `heatmapId` (string)
**Parts:** `root`

### dui-chart
Chart component wrapping Observable Plot. Pass a Plot spec object to render SVG charts with automatic theming and responsive sizing.
**Import:** `@dui/chart`
**Properties:** `spec` (PlotOptions), `variant` (string, default: ""), `tooltip` (boolean, default: true), `responsive` (boolean, default: true)
**Events:** `dui-chart-render` ({ element: SVGElement | HTMLElement }), `dui-chart-input` ({ value: unknown })
**Parts:** `root`, `tooltip`
**Tokens:** `--chart-color-1`, `--chart-color-2`, `--chart-color-3`, `--chart-color-4`, `--chart-color-5`, `--chart-color-6`, `--chart-color-7`, `--chart-color-8`, `--chart-bg`, `--chart-grid-color`, `--chart-axis-color`, `--chart-font-family`, `--chart-font-size`, `--chart-tooltip-bg`, `--chart-tooltip-color`, `--chart-tooltip-border`, `--chart-tooltip-radius`, `--chart-tooltip-padding`, `--chart-tooltip-font-size`, `--chart-tooltip-line-height`
