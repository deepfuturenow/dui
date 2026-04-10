/**
 * Barrel export of all DUI components.
 * Provides the `allComponents` array for one-shot `applyTheme()` registration.
 *
 * @example
 * ```ts
 * import { applyTheme } from "@dui/core/apply-theme";
 * import { defaultTheme } from "@dui/theme-default";
 * import { allComponents } from "@dui/components/all";
 *
 * applyTheme({ theme: defaultTheme, components: allComponents });
 * ```
 */

import type { LitElement } from "lit";

// --- Component families (used to build allComponents) ---
import { accordionFamily } from "./accordion/index.ts";
import { alertDialogFamily } from "./alert-dialog/index.ts";
import { avatarFamily } from "./avatar/index.ts";
import { badgeFamily } from "./badge/index.ts";
import { breadcrumbFamily } from "./breadcrumb/index.ts";
import { buttonFamily } from "./button/index.ts";
import { calendarFamily } from "./calendar/index.ts";
import { centerFamily } from "./center/index.ts";
import { checkboxFamily } from "./checkbox/index.ts";
import { collapsibleFamily } from "./collapsible/index.ts";
import { comboboxFamily } from "./combobox/index.ts";
import { commandFamily } from "./command/index.ts";
import { dataTableFamily } from "./data-table/index.ts";
import { dialogFamily } from "./dialog/index.ts";
import { dropzoneFamily } from "./dropzone/index.ts";
import { hstackFamily } from "./hstack/index.ts";
import { iconFamily } from "./icon/index.ts";
import { inputFamily } from "./input/index.ts";
import { linkFamily } from "./link/index.ts";
import { menuFamily } from "./menu/index.ts";
import { menubarFamily } from "./menubar/index.ts";
import { numberFieldFamily } from "./number-field/index.ts";
import { pageInsetFamily } from "./page-inset/index.ts";
import { popoverFamily } from "./popover/index.ts";
import { portalFamily } from "./portal/index.ts";
import { previewCardFamily } from "./preview-card/index.ts";
import { progressFamily } from "./progress/index.ts";
import { radioFamily } from "./radio/index.ts";
import { scrollAreaFamily } from "./scroll-area/index.ts";
import { selectFamily } from "./select/index.ts";
import { separatorFamily } from "./separator/index.ts";
import { sidebarFamily } from "./sidebar/index.ts";
import { sliderFamily } from "./slider/index.ts";
import { spinnerFamily } from "./spinner/index.ts";
import { switchFamily } from "./switch/index.ts";
import { tabsFamily } from "./tabs/index.ts";
import { textareaFamily } from "./textarea/index.ts";
import { toggleFamily } from "./toggle/index.ts";
import { toolbarFamily } from "./toolbar/index.ts";
import { tooltipFamily } from "./tooltip/index.ts";
import { truncFamily } from "./trunc/index.ts";
import { vstackFamily } from "./vstack/index.ts";

// --- Re-export all families ---
export {
  accordionFamily, alertDialogFamily, avatarFamily, badgeFamily,
  breadcrumbFamily, buttonFamily, calendarFamily, centerFamily,
  checkboxFamily, collapsibleFamily, comboboxFamily, commandFamily,
  dataTableFamily, dialogFamily, dropzoneFamily, hstackFamily,
  iconFamily, inputFamily, linkFamily, menuFamily, menubarFamily,
  numberFieldFamily, pageInsetFamily, popoverFamily, portalFamily,
  previewCardFamily, progressFamily, radioFamily, scrollAreaFamily,
  selectFamily, separatorFamily, sidebarFamily, sliderFamily,
  spinnerFamily, switchFamily, tabsFamily, textareaFamily,
  toggleFamily, toolbarFamily, tooltipFamily, truncFamily, vstackFamily,
};

// --- Re-export component classes and types (explicit to avoid name collisions) ---

// Accordion
export { DuiAccordion, DuiAccordionItem } from "./accordion/index.ts";
export type { AccordionContext } from "./accordion/index.ts";

// Alert Dialog
export { DuiAlertDialog, DuiAlertDialogTrigger, DuiAlertDialogPopup, DuiAlertDialogClose } from "./alert-dialog/index.ts";
export type { AlertDialogOpenChangeDetail, AlertDialogContext } from "./alert-dialog/index.ts";

// Avatar
export { DuiAvatar } from "./avatar/index.ts";
export type { ImageStatus } from "./avatar/index.ts";

// Badge
export { DuiBadge } from "./badge/index.ts";

// Breadcrumb
export { DuiBreadcrumb, DuiBreadcrumbItem, DuiBreadcrumbLink, DuiBreadcrumbPage, DuiBreadcrumbSeparator, DuiBreadcrumbEllipsis } from "./breadcrumb/index.ts";

// Button
export { DuiButton } from "./button/index.ts";

// Calendar
export { DuiCalendar } from "./calendar/index.ts";

// Center
export { DuiCenter } from "./center/index.ts";

// Checkbox
export { DuiCheckbox, DuiCheckboxGroup } from "./checkbox/index.ts";
export type { CheckboxGroupContext } from "./checkbox/index.ts";

// Collapsible
export { DuiCollapsible } from "./collapsible/index.ts";

// Combobox
export { DuiCombobox } from "./combobox/index.ts";
export type { SelectOption as ComboboxSelectOption, ComboboxValueChangeDetail, ComboboxValuesChangeDetail } from "./combobox/index.ts";

// Command
export { DuiCommand, DuiCommandInput, DuiCommandList, DuiCommandGroup, DuiCommandItem, DuiCommandEmpty, DuiCommandSeparator, DuiCommandShortcut } from "./command/index.ts";
export type { CommandContext, CommandItemEntry } from "./command/index.ts";

// Data Table
export { DuiDataTable } from "./data-table/index.ts";
export type { ColumnDef, SortDirection, SortState, PageState } from "./data-table/index.ts";

// Dialog
export { DuiDialog, DuiDialogTrigger, DuiDialogPopup, DuiDialogClose } from "./dialog/index.ts";
export type { DialogOpenChangeDetail, DialogContext } from "./dialog/index.ts";

// Dropzone
export { DuiDropzone } from "./dropzone/index.ts";
export type { DropzoneErrorCode, DropzoneRejectionCode, FileRejectionError, RejectedFile, DropzoneDropDetail, DropzoneAcceptedDetail, DropzoneRejectedDetail, DropzoneErrorDetail } from "./dropzone/index.ts";

// HStack
export { DuiHstack } from "./hstack/index.ts";
export type { HstackAlignment, HstackJustify } from "./hstack/index.ts";

// Icon
export { DuiIcon } from "./icon/index.ts";

// Input
export { DuiInput } from "./input/index.ts";

// Link
export { DuiLink } from "./link/index.ts";

// Menu
export { DuiMenu, DuiMenuItem } from "./menu/index.ts";

// Menubar
export { DuiMenubar } from "./menubar/index.ts";
export type { MenubarContext } from "./menubar/index.ts";

// Number Field
export { DuiNumberField } from "./number-field/index.ts";

// Page Inset
export { DuiPageInset } from "./page-inset/index.ts";

// Popover
export { DuiPopover, DuiPopoverTrigger, DuiPopoverPopup, DuiPopoverClose } from "./popover/index.ts";
export type { PopoverOpenChangeDetail, PopoverContext, PopoverSide } from "./popover/index.ts";

// Portal
export { DuiPortal } from "./portal/index.ts";
export type { QueryRoot } from "./portal/index.ts";

// Preview Card
export { DuiPreviewCard, DuiPreviewCardTrigger, DuiPreviewCardPopup } from "./preview-card/index.ts";
export type { PreviewCardOpenChangeDetail, PreviewCardContext, PreviewCardSide } from "./preview-card/index.ts";

// Progress
export { DuiProgress } from "./progress/index.ts";

// Radio
export { DuiRadio, DuiRadioGroup } from "./radio/index.ts";
export type { RadioGroupContext } from "./radio/index.ts";

// Scroll Area
export { DuiScrollArea } from "./scroll-area/index.ts";

// Select
export { DuiSelect } from "./select/index.ts";
export type { SelectOption } from "./select/index.ts";

// Separator
export { DuiSeparator } from "./separator/index.ts";

// Sidebar
export { DuiSidebarProvider, DuiSidebar, DuiSidebarTrigger, DuiSidebarContent, DuiSidebarHeader, DuiSidebarFooter, DuiSidebarGroup, DuiSidebarGroupLabel, DuiSidebarMenu, DuiSidebarMenuItem, DuiSidebarMenuButton, DuiSidebarSeparator, DuiSidebarInset } from "./sidebar/index.ts";
export type { SidebarContext } from "./sidebar/index.ts";

// Slider
export { DuiSlider } from "./slider/index.ts";

// Spinner
export { DuiSpinner } from "./spinner/index.ts";

// Switch
export { DuiSwitch } from "./switch/index.ts";

// Tabs
export { DuiTabs, DuiTabsList, DuiTab, DuiTabsPanel, DuiTabsIndicator } from "./tabs/index.ts";
export type { TabsContext } from "./tabs/index.ts";

// Textarea
export { DuiTextarea } from "./textarea/index.ts";
export type { TextareaResize } from "./textarea/index.ts";

// Toggle
export { DuiToggle, DuiToggleGroup } from "./toggle/index.ts";
export type { ToggleGroupContext } from "./toggle/index.ts";

// Toolbar
export { DuiToolbar } from "./toolbar/index.ts";

// Tooltip
export { DuiTooltip, DuiTooltipTrigger, DuiTooltipPopup } from "./tooltip/index.ts";
export type { TooltipContext, TooltipSide } from "./tooltip/index.ts";

// Trunc
export { DuiTrunc } from "./trunc/index.ts";

// VStack
export { DuiVstack } from "./vstack/index.ts";

/**
 * All DUI component classes, ready for `applyTheme()`.
 * Includes every component and sub-component.
 */
export const allComponents: Array<typeof LitElement & { tagName: string }> = [
  ...accordionFamily,
  ...alertDialogFamily,
  ...avatarFamily,
  ...badgeFamily,
  ...breadcrumbFamily,
  ...buttonFamily,
  ...calendarFamily,
  ...centerFamily,
  ...checkboxFamily,
  ...collapsibleFamily,
  ...comboboxFamily,
  ...commandFamily,
  ...dataTableFamily,
  ...dialogFamily,
  ...dropzoneFamily,
  ...hstackFamily,
  ...iconFamily,
  ...inputFamily,
  ...linkFamily,
  ...menuFamily,
  ...menubarFamily,
  ...numberFieldFamily,
  ...pageInsetFamily,
  ...popoverFamily,
  ...portalFamily,
  ...previewCardFamily,
  ...progressFamily,
  ...radioFamily,
  ...scrollAreaFamily,
  ...selectFamily,
  ...separatorFamily,
  ...sidebarFamily,
  ...sliderFamily,
  ...spinnerFamily,
  ...switchFamily,
  ...tabsFamily,
  ...textareaFamily,
  ...toggleFamily,
  ...toolbarFamily,
  ...tooltipFamily,
  ...truncFamily,
  ...vstackFamily,
];
