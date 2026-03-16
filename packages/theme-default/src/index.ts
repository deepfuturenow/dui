import type { DuiTheme } from "@dui/core/apply-theme";
import { themedBase } from "./base.ts";
import { accordionStyles } from "./components/accordion.ts";
import { accordionItemStyles } from "./components/accordion-item.ts";
import { buttonStyles } from "./components/button.ts";
import { switchStyles } from "./components/switch.ts";
import { badgeStyles } from "./components/badge.ts";
import { scrollAreaStyles } from "./components/scroll-area.ts";
import { comboboxStyles } from "./components/combobox.ts";
import { menuStyles } from "./components/menu.ts";
import { menuItemStyles } from "./components/menu-item.ts";
import { popoverStyles } from "./components/popover.ts";
import { popoverPopupStyles } from "./components/popover-popup.ts";
import { tooltipStyles } from "./components/tooltip.ts";
import { tooltipPopupStyles } from "./components/tooltip-popup.ts";
import { dialogStyles } from "./components/dialog.ts";
import { dialogPopupStyles } from "./components/dialog-popup.ts";
import { alertDialogStyles } from "./components/alert-dialog.ts";
import { alertDialogPopupStyles } from "./components/alert-dialog-popup.ts";
import { breadcrumbStyles } from "./components/breadcrumb.ts";
import { breadcrumbItemStyles } from "./components/breadcrumb-item.ts";
import { breadcrumbLinkStyles } from "./components/breadcrumb-link.ts";
import { breadcrumbPageStyles } from "./components/breadcrumb-page.ts";
import { breadcrumbSeparatorStyles } from "./components/breadcrumb-separator.ts";
import { breadcrumbEllipsisStyles } from "./components/breadcrumb-ellipsis.ts";
import { checkboxStyles } from "./components/checkbox.ts";
import { checkboxGroupStyles } from "./components/checkbox-group.ts";
import { collapsibleStyles } from "./components/collapsible.ts";
import { toolbarStyles } from "./components/toolbar.ts";
import { sliderStyles } from "./components/slider.ts";
import { spinnerStyles } from "./components/spinner.ts";
import { tabStyles } from "./components/tab.ts";
import { tabsStyles } from "./components/tabs.ts";
import { tabsIndicatorStyles } from "./components/tabs-indicator.ts";
import { tabsListStyles } from "./components/tabs-list.ts";
import { tabsPanelStyles } from "./components/tabs-panel.ts";
import { textareaStyles } from "./components/textarea.ts";
import { truncStyles } from "./components/trunc.ts";
import { centerStyles } from "./components/center.ts";
import { hstackStyles } from "./components/hstack.ts";
import { vstackStyles } from "./components/vstack.ts";
import { pageInsetStyles } from "./components/page-inset.ts";
import { linkStyles } from "./components/link.ts";
import { avatarStyles } from "./components/avatar.ts";
import { portalStyles } from "./components/portal.ts";
import { inputStyles } from "./components/input.ts";
import { radioStyles } from "./components/radio.ts";
import { radioGroupStyles } from "./components/radio-group.ts";
import { dropzoneStyles } from "./components/dropzone.ts";
import { selectStyles } from "./components/select.ts";
import { previewCardStyles } from "./components/preview-card.ts";
import { previewCardPopupStyles } from "./components/preview-card-popup.ts";
import { dataTableStyles } from "./components/data-table.ts";
import { commandStyles } from "./components/command.ts";
import { commandInputStyles } from "./components/command-input.ts";
import { commandItemStyles } from "./components/command-item.ts";
import { commandListStyles } from "./components/command-list.ts";
import { commandGroupStyles } from "./components/command-group.ts";
import { commandEmptyStyles } from "./components/command-empty.ts";
import { commandSeparatorStyles } from "./components/command-separator.ts";
import { commandShortcutStyles } from "./components/command-shortcut.ts";
import { sidebarProviderStyles } from "./components/sidebar-provider.ts";
import { sidebarStyles } from "./components/sidebar.ts";
import { sidebarTriggerStyles } from "./components/sidebar-trigger.ts";
import { sidebarContentStyles } from "./components/sidebar-content.ts";
import { sidebarHeaderStyles } from "./components/sidebar-header.ts";
import { sidebarFooterStyles } from "./components/sidebar-footer.ts";
import { sidebarGroupStyles } from "./components/sidebar-group.ts";
import { sidebarGroupLabelStyles } from "./components/sidebar-group-label.ts";
import { sidebarMenuStyles } from "./components/sidebar-menu.ts";
import { sidebarMenuItemStyles } from "./components/sidebar-menu-item.ts";
import { sidebarMenuButtonStyles } from "./components/sidebar-menu-button.ts";
import { sidebarSeparatorStyles } from "./components/sidebar-separator.ts";
import { sidebarInsetStyles } from "./components/sidebar-inset.ts";
import { tokenSheet } from "./tokens.ts";

export const defaultTheme: DuiTheme = {
  tokens: tokenSheet,
  base: themedBase,
  styles: new Map([
    ["dui-accordion", accordionStyles],
    ["dui-accordion-item", accordionItemStyles],
    ["dui-button", buttonStyles],
    ["dui-switch", switchStyles],
    ["dui-badge", badgeStyles],
    ["dui-scroll-area", scrollAreaStyles],
    ["dui-combobox", comboboxStyles],
    ["dui-menu", menuStyles],
    ["dui-menu-item", menuItemStyles],
    ["dui-popover", popoverStyles],
    ["dui-popover-popup", popoverPopupStyles],
    ["dui-tooltip", tooltipStyles],
    ["dui-tooltip-popup", tooltipPopupStyles],
    ["dui-dialog", dialogStyles],
    ["dui-dialog-popup", dialogPopupStyles],
    ["dui-alert-dialog", alertDialogStyles],
    ["dui-alert-dialog-popup", alertDialogPopupStyles],
    ["dui-breadcrumb", breadcrumbStyles],
    ["dui-breadcrumb-item", breadcrumbItemStyles],
    ["dui-breadcrumb-link", breadcrumbLinkStyles],
    ["dui-breadcrumb-page", breadcrumbPageStyles],
    ["dui-breadcrumb-separator", breadcrumbSeparatorStyles],
    ["dui-breadcrumb-ellipsis", breadcrumbEllipsisStyles],
    ["dui-checkbox", checkboxStyles],
    ["dui-checkbox-group", checkboxGroupStyles],
    ["dui-collapsible", collapsibleStyles],
    ["dui-toolbar", toolbarStyles],
    ["dui-slider", sliderStyles],
    ["dui-spinner", spinnerStyles],
    ["dui-tab", tabStyles],
    ["dui-tabs", tabsStyles],
    ["dui-tabs-indicator", tabsIndicatorStyles],
    ["dui-tabs-list", tabsListStyles],
    ["dui-tabs-panel", tabsPanelStyles],
    ["dui-textarea", textareaStyles],
    ["dui-trunc", truncStyles],
    ["dui-center", centerStyles],
    ["dui-hstack", hstackStyles],
    ["dui-vstack", vstackStyles],
    ["dui-page-inset", pageInsetStyles],
    ["dui-link", linkStyles],
    ["dui-avatar", avatarStyles],
    ["dui-portal", portalStyles],
    ["dui-input", inputStyles],
    ["dui-radio", radioStyles],
    ["dui-radio-group", radioGroupStyles],
    ["dui-dropzone", dropzoneStyles],
    ["dui-select", selectStyles],
    ["dui-preview-card", previewCardStyles],
    ["dui-preview-card-popup", previewCardPopupStyles],
    ["dui-data-table", dataTableStyles],
    ["dui-command", commandStyles],
    ["dui-command-input", commandInputStyles],
    ["dui-command-item", commandItemStyles],
    ["dui-command-list", commandListStyles],
    ["dui-command-group", commandGroupStyles],
    ["dui-command-empty", commandEmptyStyles],
    ["dui-command-separator", commandSeparatorStyles],
    ["dui-command-shortcut", commandShortcutStyles],
    ["dui-sidebar-provider", sidebarProviderStyles],
    ["dui-sidebar", sidebarStyles],
    ["dui-sidebar-trigger", sidebarTriggerStyles],
    ["dui-sidebar-content", sidebarContentStyles],
    ["dui-sidebar-header", sidebarHeaderStyles],
    ["dui-sidebar-footer", sidebarFooterStyles],
    ["dui-sidebar-group", sidebarGroupStyles],
    ["dui-sidebar-group-label", sidebarGroupLabelStyles],
    ["dui-sidebar-menu", sidebarMenuStyles],
    ["dui-sidebar-menu-item", sidebarMenuItemStyles],
    ["dui-sidebar-menu-button", sidebarMenuButtonStyles],
    ["dui-sidebar-separator", sidebarSeparatorStyles],
    ["dui-sidebar-inset", sidebarInsetStyles],
  ]),
};

export { themedBase } from "./base.ts";
export { accordionStyles } from "./components/accordion.ts";
export { accordionItemStyles } from "./components/accordion-item.ts";
export { buttonStyles } from "./components/button.ts";
export { switchStyles } from "./components/switch.ts";
export { badgeStyles } from "./components/badge.ts";
export { scrollAreaStyles } from "./components/scroll-area.ts";
export { comboboxStyles } from "./components/combobox.ts";
export { menuStyles } from "./components/menu.ts";
export { menuItemStyles } from "./components/menu-item.ts";
export { popoverStyles } from "./components/popover.ts";
export { popoverPopupStyles } from "./components/popover-popup.ts";
export { tooltipStyles } from "./components/tooltip.ts";
export { tooltipPopupStyles } from "./components/tooltip-popup.ts";
export { dialogStyles } from "./components/dialog.ts";
export { dialogPopupStyles } from "./components/dialog-popup.ts";
export { alertDialogStyles } from "./components/alert-dialog.ts";
export { alertDialogPopupStyles } from "./components/alert-dialog-popup.ts";
export { breadcrumbStyles } from "./components/breadcrumb.ts";
export { breadcrumbItemStyles } from "./components/breadcrumb-item.ts";
export { breadcrumbLinkStyles } from "./components/breadcrumb-link.ts";
export { breadcrumbPageStyles } from "./components/breadcrumb-page.ts";
export { breadcrumbSeparatorStyles } from "./components/breadcrumb-separator.ts";
export { breadcrumbEllipsisStyles } from "./components/breadcrumb-ellipsis.ts";
export { checkboxStyles } from "./components/checkbox.ts";
export { checkboxGroupStyles } from "./components/checkbox-group.ts";
export { collapsibleStyles } from "./components/collapsible.ts";
export { toolbarStyles } from "./components/toolbar.ts";
export { sliderStyles } from "./components/slider.ts";
export { spinnerStyles } from "./components/spinner.ts";
export { tabStyles } from "./components/tab.ts";
export { tabsStyles } from "./components/tabs.ts";
export { tabsIndicatorStyles } from "./components/tabs-indicator.ts";
export { tabsListStyles } from "./components/tabs-list.ts";
export { tabsPanelStyles } from "./components/tabs-panel.ts";
export { textareaStyles } from "./components/textarea.ts";
export { truncStyles } from "./components/trunc.ts";
export { centerStyles } from "./components/center.ts";
export { hstackStyles } from "./components/hstack.ts";
export { vstackStyles } from "./components/vstack.ts";
export { pageInsetStyles } from "./components/page-inset.ts";
export { linkStyles } from "./components/link.ts";
export { avatarStyles } from "./components/avatar.ts";
export { portalStyles } from "./components/portal.ts";
export { inputStyles } from "./components/input.ts";
export { radioStyles } from "./components/radio.ts";
export { radioGroupStyles } from "./components/radio-group.ts";
export { dropzoneStyles } from "./components/dropzone.ts";
export { selectStyles } from "./components/select.ts";
export { previewCardStyles } from "./components/preview-card.ts";
export { previewCardPopupStyles } from "./components/preview-card-popup.ts";
export { dataTableStyles } from "./components/data-table.ts";
export { commandStyles } from "./components/command.ts";
export { commandInputStyles } from "./components/command-input.ts";
export { commandItemStyles } from "./components/command-item.ts";
export { commandListStyles } from "./components/command-list.ts";
export { commandGroupStyles } from "./components/command-group.ts";
export { commandEmptyStyles } from "./components/command-empty.ts";
export { commandSeparatorStyles } from "./components/command-separator.ts";
export { commandShortcutStyles } from "./components/command-shortcut.ts";
export { sidebarProviderStyles } from "./components/sidebar-provider.ts";
export { sidebarStyles } from "./components/sidebar.ts";
export { sidebarTriggerStyles } from "./components/sidebar-trigger.ts";
export { sidebarContentStyles } from "./components/sidebar-content.ts";
export { sidebarHeaderStyles } from "./components/sidebar-header.ts";
export { sidebarFooterStyles } from "./components/sidebar-footer.ts";
export { sidebarGroupStyles } from "./components/sidebar-group.ts";
export { sidebarGroupLabelStyles } from "./components/sidebar-group-label.ts";
export { sidebarMenuStyles } from "./components/sidebar-menu.ts";
export { sidebarMenuItemStyles } from "./components/sidebar-menu-item.ts";
export { sidebarMenuButtonStyles } from "./components/sidebar-menu-button.ts";
export { sidebarSeparatorStyles } from "./components/sidebar-separator.ts";
export { sidebarInsetStyles } from "./components/sidebar-inset.ts";
