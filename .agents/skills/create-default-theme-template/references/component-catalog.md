<!-- Auto-generated from component-registry.ts — do not edit manually. -->
<!-- Run: deno task generate -->

# DUI Component Reference

All 41 component families, 86+ elements. Every component exposes `::part(root)` for CSS access beyond tokens.

When the inspector is available, prefer `__dui_inspect().catalog` for the ground-truth property schemas — this file is a static snapshot.

---

## Actions

### dui-button
**Properties:** `disabled` (boolean), `focusableWhenDisabled` (boolean), `type` (string), `href` (string | undefined), `variant` ("neutral" | "primary" | "danger"), `appearance` ("filled" | "outline" | "ghost" | "link"), `size` ("sm" | "md" | "lg")
**Events:** `dui-navigate` ({ href: string })
**Slots:** default (Button label content)
**Parts:** `root`
**Tokens:** `--button-bg`, `--button-fg`, `--button-border`, `--button-height`, `--button-width`, `--button-padding-y`, `--button-padding-x`, `--button-gap`, `--button-radius`, `--button-font-size`, `--button-icon-size`

### dui-split-button
**Properties:** `disabled` (boolean), `variant` ("neutral" | "primary" | "danger"), `appearance` ("filled" | "outline" | "ghost"), `size` ("xs" | "sm" | "md" | "lg")
**Events:** `dui-action` ({})
**Slots:** default (Action button label content), icon (Custom icon for the dropdown trigger (defaults to chevron-down)), menu (dui-menu-item elements for the dropdown)
**Parts:** `root`, `action`, `divider`, `trigger`
**Tokens:** `--sb-bg`, `--sb-fg`, `--sb-border`, `--sb-divider`, `--sb-height`, `--sb-action-padding-y`, `--sb-action-padding-x`, `--sb-trigger-padding-x`, `--sb-gap`, `--sb-radius`, `--sb-font-size`, `--sb-icon-size`

### dui-link
**Properties:** `href` (string)
**Events:** `spa-navigate` ({ href: string })
**Slots:** default (Link content)
**Parts:** `root`

### dui-toggle
**Properties:** `pressed` (boolean | undefined), `defaultPressed` (boolean), `disabled` (boolean), `value` (string | undefined), `size` ("sm" | "md" | "lg")
**Events:** `pressed-change` ({ pressed: boolean })
**Slots:** default (Toggle content (text and/or icons)), icon (Optional leading icon)
**Parts:** `root`
**Tokens:** `--toggle-gap`, `--toggle-height`, `--toggle-padding-y`, `--toggle-padding-x`, `--toggle-radius`, `--toggle-font-size`, `--toggle-icon-size`

### dui-toggle-group
**Properties:** `value` (string[] | undefined), `defaultValue` (string[]), `type` ("single" | "multiple"), `orientation` ("horizontal" | "vertical"), `disabled` (boolean), `loop` (boolean)
**Events:** `value-change` ({ value: string[] })
**Slots:** default (dui-toggle children)
**Parts:** `root`

### dui-toolbar
**Properties:** `inset` (boolean), `hasButtonLeft` (boolean), `hasButtonRight` (boolean), `size` ("sm" | "md" | "lg" | "xl")
**Slots:** left (Content aligned to the start), center (Content centered in the toolbar), right (Content aligned to the end)
**Parts:** `root`, `left`, `center`, `right`

---

## Forms

### dui-input
**Properties:** `type` (string), `value` (string), `placeholder` (string), `disabled` (boolean), `required` (boolean), `readonly` (boolean), `minLength` (number | undefined), `maxLength` (number | undefined), `pattern` (string | undefined), `name` (string), `autocomplete` (string | undefined), `autofocus` (boolean)
**Events:** `input-change` ({ value: string })
**Slots:** —
**Parts:** `input`

### dui-textarea
**Properties:** `value` (string), `placeholder` (string), `disabled` (boolean), `required` (boolean), `readonly` (boolean), `rows` (number | undefined), `minLength` (number | undefined), `maxLength` (number | undefined), `name` (string), `resize` ("none" | "vertical" | "horizontal" | "both" | "auto"), `maxHeight` (string | undefined), `variant` ("default" | "ghost")
**Events:** `textarea-change` ({ value: string })
**Slots:** —
**Parts:** `textarea`

### dui-select
**Properties:** `options` (SelectOption[]), `value` (string), `placeholder` (string), `disabled` (boolean), `name` (string)
**Events:** `value-change` ({ value: string; option: SelectOption })
**Slots:** —
**Parts:** `trigger`, `value`

### dui-combobox
**Properties:** `options` (SelectOption[]), `value` (string), `values` (Set<string>), `multiple` (boolean), `placeholder` (string), `disabled` (boolean), `name` (string)
**Events:** `value-change` ({ value: string; option: SelectOption }), `values-change` ({ value: string; selected: boolean; values: Set<string> })
**Slots:** —
**Parts:** `root`

### dui-checkbox
**Properties:** `checked` (boolean | undefined), `defaultChecked` (boolean), `indeterminate` (boolean), `disabled` (boolean), `readOnly` (boolean), `required` (boolean), `name` (string | undefined), `value` (string | undefined), `parent` (boolean)
**Events:** `checked-change` ({ checked: boolean; indeterminate: boolean })
**Slots:** default (Label content)
**Parts:** `root`, `indicator`
**Tokens:** `--checkbox-size`
**Sub-elements:** `dui-checkbox-group` — `value` (string[] | undefined), `defaultValue` (string[]), `allValues` (string[]), `disabled` (boolean); Events: `value-change` (string[]); Slots: default (dui-checkbox children); Parts: `root`

### dui-checkbox-group
**Properties:** `value` (string[] | undefined), `defaultValue` (string[]), `allValues` (string[]), `disabled` (boolean)
**Events:** `value-change` (string[])
**Slots:** default (dui-checkbox children)
**Parts:** `root`

### dui-radio
**Properties:** `value` (string), `disabled` (boolean), `readOnly` (boolean)
**Slots:** default (Label content)
**Parts:** `root`, `dot`
**Tokens:** `--radio-size`

### dui-switch
**Properties:** `checked` (boolean | undefined), `defaultChecked` (boolean), `disabled` (boolean), `readOnly` (boolean), `required` (boolean), `name` (string | undefined), `value` (string)
**Events:** `checked-change` ({ checked: boolean })
**Slots:** default (Label content)
**Parts:** `root`, `thumb`
**Tokens:** `--switch-thumb-offset`, `--switch-checked-offset`

### dui-slider
**Properties:** `value` (number), `min` (number), `max` (number), `step` (number), `disabled` (boolean), `name` (string), `label` (string), `unit` (string), `precision` (number | undefined), `variant` ("field")
**Events:** `value-change` ({ value: number }), `value-committed` ({ value: number })
**Slots:** —
**Parts:** `root`, `track`, `indicator`, `thumb`, `label`, `readout`, `unit`
**Tokens:** `--slider-track-height`, `--slider-thumb-size`, `--slider-track-bg`, `--slider-indicator-color`, `--slider-indicator-opacity`

### dui-number-field
**Properties:** `value` (number | undefined), `defaultValue` (number | undefined), `min` (number | undefined), `max` (number | undefined), `step` (number), `largeStep` (number), `disabled` (boolean), `readOnly` (boolean), `required` (boolean), `name` (string | undefined), `label` (string), `labelPosition` (string), `iconPosition` (string), `unit` (string), `precision` (number | undefined), `scrubLabel` (boolean), `scrubValue` (boolean), `scrubField` (boolean), `clickLabel` (boolean), `clickValue` (boolean), `clickField` (boolean), `label-position` ("inside-left" | "above" | "below" | "outside-left"), `icon-position` ("inside-left" | "inside-right" | "outside-left")
**Events:** `value-change` ({ value: number }), `value-committed` ({ value: number })
**Slots:** icon (Icon content (SVG, dui-icon, etc.), positioned by icon-position)
**Parts:** `root`, `label`, `icon`, `input`, `unit`
**Tokens:** `--number-field-bg`, `--number-field-fg`, `--number-field-border`, `--number-field-height`, `--number-field-radius`, `--number-field-font-size`, `--number-field-value-align`, `--number-field-label-bg`, `--number-field-label-fg`, `--number-field-label-width`

### dui-stepper
**Properties:** `value` (number | undefined), `defaultValue` (number | undefined), `min` (number | undefined), `max` (number | undefined), `step` (number), `largeStep` (number), `disabled` (boolean), `readOnly` (boolean), `required` (boolean), `name` (string | undefined)
**Events:** `value-change` ({ value: number }), `value-committed` ({ value: number })
**Slots:** decrement (Custom decrement button content), increment (Custom increment button content)
**Parts:** `root`, `input`, `decrement`, `increment`

### dui-dropzone
**Properties:** `accept` (string | undefined), `multiple` (boolean), `disabled` (boolean), `maxFiles` (number), `maxSize` (number), `minSize` (number), `autoFocus` (boolean), `noStyle` (boolean)
**Events:** `drop` ({ acceptedFiles: File[]; rejectedFiles: RejectedFile[] }), `drop-accepted` ({ acceptedFiles: File[] }), `drop-rejected` ({ rejectedFiles: RejectedFile[] }), `dropzone-error` ({ error: unknown; code: string })
**Slots:** default (Custom content for the dropzone area)
**Parts:** `root`

---

## Data Display

### dui-badge
**Properties:** `variant` ("neutral" | "primary" | "danger"), `appearance` ("filled" | "outline" | "ghost")
**Slots:** default (Badge content)
**Parts:** `root`
**Tokens:** `--badge-bg`, `--badge-fg`, `--badge-border`, `--badge-icon-size`

### dui-avatar
**Properties:** `src` (string | undefined), `alt` (string), `size` (string | undefined), `fallbackDelay` (number | undefined)
**Events:** `loading-status-change` ({ status: ImageStatus })
**Slots:** default (Fallback content (e.g. initials or icon))
**Parts:** `root`, `image`, `fallback`
**Tokens:** `--avatar-size`, `--avatar-bg`, `--avatar-fg`

### dui-calendar
**Properties:** `value` (string | undefined), `defaultValue` (string | undefined), `min` (string | undefined), `max` (string | undefined), `locale` (string), `disabled` (boolean), `readOnly` (boolean)
**Events:** `value-change` ({ value: string })
**Slots:** prev (Custom previous month button content), next (Custom next month button content)
**Parts:** `root`, `header`, `heading`, `prev`, `next`, `grid`, `weekday`, `day`

### dui-data-table
**Properties:** `columns` (ColumnDef<T>[]), `data` (T[]), `pageSize` (number), `rowKey` (((row: T) => string) | undefined), `emptyText` (string)
**Events:** `sort-change` (SortState | null), `page-change` (PageState)
**Slots:** —
**Parts:** `root`, `table-window`, `table`, `pagination`

### dui-progress
**Properties:** `value` (number | null), `min` (number), `max` (number)
**Slots:** —
**Parts:** `root`, `track`, `indicator`
**Tokens:** `--progress-value`

### dui-spinner
**Properties:** `variant` ("pulse" | "lucide-loader" | "lucide-loader-circle"), `size` ("sm" | "md" | "lg")
**Slots:** —
**Parts:** `root`
**Tokens:** `--spinner-size`, `--spinner-color`

### dui-separator
**Properties:** `orientation` ("horizontal" | "vertical")
**Slots:** —
**Parts:** `root`

### dui-trunc
**Properties:** `maxWidth` (string), `maxLines` (number | undefined)
**Slots:** default (Text content to truncate)
**Parts:** `root`

---

## Overlays

### dui-dialog
**Properties:** `open` (boolean | undefined), `defaultOpen` (boolean)
**Events:** `open-change` ({ open: boolean })
**Slots:** default (dui-dialog-trigger and dui-dialog-popup)
**Parts:** `root`
**Sub-elements:** `dui-dialog-trigger`; Slots: default (Content that triggers the dialog); Parts: `root`
**Sub-elements:** `dui-dialog-popup` — `keepMounted` (boolean), `initialFocus` (string | undefined), `finalFocus` (string | undefined), `width` (string | undefined); Slots: title (Dialog title (rendered as h2)), description (Dialog description (rendered as p)), default (Dialog content (actions, form fields, etc.)); Parts: `backdrop`, `popup`, `title`, `description`
**Sub-elements:** `dui-dialog-close`; Slots: default (Content that closes the dialog); Parts: `root`

### dui-alert-dialog
**Properties:** `open` (boolean | undefined), `defaultOpen` (boolean)
**Events:** `open-change` ({ open: boolean })
**Slots:** default (dui-alert-dialog-trigger and dui-alert-dialog-popup)
**Parts:** `root`
**Sub-elements:** `dui-alert-dialog-trigger`; Slots: default (Content that triggers the alert dialog); Parts: `root`
**Sub-elements:** `dui-alert-dialog-popup` — `keepMounted` (boolean), `initialFocus` (string | undefined), `finalFocus` (string | undefined); Slots: title (Alert dialog title (rendered as h2)), description (Alert dialog description (rendered as p)), default (Dialog content (actions, etc.)); Parts: `backdrop`, `popup`, `title`, `description`
**Sub-elements:** `dui-alert-dialog-close`; Slots: default (Content that closes the alert dialog); Parts: `root`

### dui-popover
**Properties:** `open` (boolean), `defaultOpen` (boolean), `side` ("top" | "bottom"), `sideOffset` (number)
**Events:** `open-change` ({ open: boolean })
**Slots:** default (dui-popover-trigger and dui-popover-popup)
**Parts:** `root`
**Sub-elements:** `dui-popover-trigger`; Slots: default (Content that triggers the popover); Parts: `root`
**Sub-elements:** `dui-popover-popup` — `showArrow` (boolean), `closeOnClick` (boolean); Slots: default (Popover content); Parts: `root`
**Sub-elements:** `dui-popover-close`; Slots: default (Content that closes the popover); Parts: `root`

### dui-tooltip
**Properties:** `open` (boolean), `defaultOpen` (boolean), `side` ("top" | "bottom"), `sideOffset` (number), `delay` (number), `closeDelay` (number), `disabled` (boolean)
**Events:** `open-change` ({ open: boolean })
**Slots:** default (dui-tooltip-trigger and dui-tooltip-popup)
**Parts:** `root`
**Sub-elements:** `dui-tooltip-trigger` — `disabled` (boolean); Slots: default (Content that triggers the tooltip); Parts: `root`
**Sub-elements:** `dui-tooltip-popup` — `showArrow` (boolean); Slots: default (Tooltip content); Parts: `root`

### dui-menu
**Properties:** —
**Slots:** trigger (The element that opens the menu on click), default (dui-menu-item children)
**Parts:** `root`
**Sub-elements:** `dui-menu-item` — `disabled` (boolean), `variant` ("default" | "danger"); Slots: default (Item content); Parts: `root`

### dui-menubar
**Properties:** `loop` (boolean), `orientation` ("horizontal" | "vertical")
**Slots:** default (dui-menu children)
**Parts:** `root`

### dui-preview-card
**Properties:** `open` (boolean), `defaultOpen` (boolean), `side` ("top" | "bottom"), `sideOffset` (number), `delay` (number), `closeDelay` (number)
**Events:** `open-change` ({ open: boolean })
**Slots:** default (dui-preview-card-trigger and dui-preview-card-popup)
**Parts:** `root`
**Sub-elements:** `dui-preview-card-trigger`; Slots: default (Content that triggers the preview card (e.g. a link)); Parts: `root`
**Sub-elements:** `dui-preview-card-popup` — `showArrow` (boolean); Slots: default (Preview card content); Parts: `root`

### dui-command
**Properties:** `loop` (boolean), `shouldFilter` (boolean), `value` (string | undefined), `filter` (FilterFn | undefined)
**Events:** `select` (string), `search-change` (string), `escape`
**Slots:** default (Command input, list, groups, and items)
**Parts:** `root`
**Sub-elements:** `dui-command-input` — `placeholder` (string); Slots: —; Parts: `root`
**Sub-elements:** `dui-command-list`; Slots: default (Command groups, items, separators, and empty state); Parts: `root`
**Sub-elements:** `dui-command-group` — `heading` (string); Slots: default (Command items); Parts: `root`
**Sub-elements:** `dui-command-item` — `value` (string), `keywords` (string[]), `disabled` (boolean); Slots: default (Item content); Parts: `root`
**Sub-elements:** `dui-command-empty`; Slots: default (Empty state content); Parts: `root`
**Sub-elements:** `dui-command-separator`; Slots: —; Parts: `root`
**Sub-elements:** `dui-command-shortcut`; Slots: default (Shortcut text (e.g. ⌘K)); Parts: `root`

---

## Disclosure

### dui-accordion
**Properties:** `value` (string[] | undefined), `defaultValue` (string[]), `disabled` (boolean), `multiple` (boolean), `loopFocus` (boolean), `orientation` ("vertical" | "horizontal"), `keepMounted` (boolean)
**Events:** `value-change` (string[])
**Slots:** default (Container for dui-accordion-item children)
**Parts:** `root`
**Sub-elements:** `dui-accordion-item` — `value` (string), `disabled` (boolean); Events: `open-change` ({ value: string; open: boolean }); Slots: trigger (Header/trigger content), default (Panel content); Parts: `item`, `trigger`, `indicator`, `panel`, `content`

### dui-collapsible
**Properties:** `open` (boolean), `defaultOpen` (boolean), `disabled` (boolean), `keepMounted` (boolean)
**Events:** `open-change` ({ open: boolean })
**Slots:** trigger (Trigger label content), default (Panel content)
**Parts:** `trigger`, `indicator`, `panel`, `content`

### dui-tabs
**Properties:** `value` (string | undefined), `defaultValue` (string | undefined), `orientation` ("horizontal" | "vertical"), `controls` ("header" | "footer")
**Events:** `value-change` (string)
**Slots:** default (Tab list and tab panels)
**Parts:** `root`
**Sub-elements:** `dui-tabs-list`; Slots: default (dui-tab elements and optional dui-tabs-indicator); Parts: `list`
**Sub-elements:** `dui-tab` — `value` (string), `disabled` (boolean); Slots: default (Tab label content); Parts: `tab`
**Sub-elements:** `dui-tabs-panel` — `value` (string), `keepMounted` (boolean); Slots: default (Panel content); Parts: `panel`
**Sub-elements:** `dui-tabs-indicator`; Slots: —; Parts: `root`

---

## Navigation

### dui-breadcrumb
**Properties:** —
**Slots:** default (Breadcrumb items and separators)
**Parts:** `root`
**Sub-elements:** `dui-breadcrumb-item`; Slots: default (A breadcrumb link, page, or ellipsis); Parts: `root`
**Sub-elements:** `dui-breadcrumb-link`; Slots: default (An <a> element for navigation); Parts: `root`
**Sub-elements:** `dui-breadcrumb-page`; Slots: default (The current page label text); Parts: `root`
**Sub-elements:** `dui-breadcrumb-separator`; Slots: default (Custom separator content (defaults to "/")); Parts: `root`
**Sub-elements:** `dui-breadcrumb-ellipsis`; Slots: default (Custom ellipsis content (defaults to "…")); Parts: `root`

### dui-sidebar-provider
**Properties:** `open` (boolean | undefined), `defaultOpen` (boolean), `side` ("left" | "right"), `variant` ("sidebar" | "floating" | "inset"), `collapsible` ("offcanvas" | "icon" | "none")
**Events:** `open-change` ({ open: boolean })
**Slots:** default (Sidebar and content areas)
**Parts:** `root`
**Sub-elements:** `dui-sidebar`; Slots: default (Sidebar content (header, content, footer)); Parts: `root`
**Sub-elements:** `dui-sidebar-trigger`; Slots: default (Override the default icon); Parts: `root`
**Sub-elements:** `dui-sidebar-content`; Slots: default (Groups, menus, etc.); Parts: `root`
**Sub-elements:** `dui-sidebar-header`; Slots: default (Header content); Parts: `root`
**Sub-elements:** `dui-sidebar-footer`; Slots: default (Footer content); Parts: `root`
**Sub-elements:** `dui-sidebar-group`; Slots: label (Group label (use dui-sidebar-group-label)), default (Group content); Parts: `root`
**Sub-elements:** `dui-sidebar-group-label`; Slots: default (Label text); Parts: `root`
**Sub-elements:** `dui-sidebar-menu`; Slots: default (Menu items); Parts: `root`
**Sub-elements:** `dui-sidebar-menu-item`; Slots: default (Menu button or content); Parts: `root`
**Sub-elements:** `dui-sidebar-menu-button` — `active` (boolean), `disabled` (boolean), `tooltip` (string), `href` (string | undefined), `size` ("default" | "sm" | "lg"); Events: `spa-navigate` ({ href: string }); Slots: icon (Icon slot, shown before the label), default (Label text), suffix (Suffix slot, shown after the label); Parts: `root`
**Sub-elements:** `dui-sidebar-separator`; Slots: —; Parts: `root`
**Sub-elements:** `dui-sidebar-inset`; Slots: default (Main content); Parts: `root`

---

## Layout

### dui-scroll-area
**Properties:** `orientation` (string), `fade` (boolean), `maxHeight` (string | undefined)
**Events:** `scrolled-to-bottom`, `scrolled-from-bottom`
**Slots:** default (Scrollable content)
**Parts:** `viewport`, `scrollbar-vertical`, `scrollbar-horizontal`, `thumb-vertical`, `thumb-horizontal`
**Tokens:** `--scroll-area-max-height`, `--scroll-area-thumb-color`, `--scroll-fade-color`

### dui-portal
**Properties:** `target` (string), `targetRoot` ("shadow" | "document"), `targetElement` (HTMLElement | undefined)
**Slots:** default (Content to teleport)
**Parts:** `root`

---

## Utility

### dui-icon
**Properties:** —
**Slots:** default (SVG element to display)
**Parts:** `root`
**Tokens:** `--icon-size`, `--icon-color`

---

## Global design tokens

These are set on `:root` by the theme and affect all components:

**Color primitives:**
`--background`, `--foreground`, `--accent`, `--destructive`

**Derived colors:**
`--sunken`, `--surface-1`, `--surface-2`, `--surface-3`, `--text-1`, `--text-2`, `--text-3`, `--border`, `--border-strong`, `--accent-subtle`, `--accent-text`, `--destructive-subtle`, `--destructive-text`, `--scrim`

**Spacing (Tailwind base-4):**
`--space-0` through `--space-96` (e.g. `--space-1` = 0.25rem, `--space-2` = 0.5rem, `--space-4` = 1rem, `--space-6` = 1.5rem, `--space-8` = 2rem)

**Radii:**
`--radius-none`, `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-full`

**Typography:**
`--font-sans`, `--font-serif`, `--font-mono`, `--font-size-xs` through `--font-size-7xl`, `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`, `--line-height-none`, `--line-height-tight`, `--line-height-snug`, `--line-height-normal`, `--line-height-relaxed`

**Shadows:**
`--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`, `--shadow-none`

**Focus:**
`--focus-ring-color`, `--focus-ring-width`, `--focus-ring-offset`

**Motion:**
`--duration-instant`, `--duration-fastest`, `--duration-faster`, `--duration-fast`, `--duration-normal`, `--duration-slow`, `--duration-slower`
