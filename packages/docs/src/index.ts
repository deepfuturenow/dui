import "./docs-demo.ts";
import "./docs-app.ts";
import "./pages/docs-page-layout.ts";
import "./pages/docs-row.ts";
import "./pages/docs-page-components-index.ts";
import "./pages/docs-page-accordion.ts";
import "./pages/docs-page-button.ts";
import "./pages/docs-page-switch.ts";
import "./pages/docs-page-badge.ts";
import "./pages/docs-page-icon.ts";
import "./pages/docs-page-scroll-area.ts";
import "./pages/docs-page-combobox.ts";
import "./pages/docs-page-menu.ts";
import "./pages/docs-page-popover.ts";
import "./pages/docs-page-tooltip.ts";
import "./pages/docs-page-dialog.ts";
import "./pages/docs-page-alert-dialog.ts";
import "./pages/docs-page-breadcrumb.ts";
import "./pages/docs-page-checkbox.ts";
import "./pages/docs-page-collapsible.ts";
import "./pages/docs-page-toolbar.ts";
import "./pages/docs-page-slider.ts";
import "./pages/docs-page-spinner.ts";
import "./pages/docs-page-tabs.ts";
import "./pages/docs-page-textarea.ts";
import "./pages/docs-page-trunc.ts";
import "./pages/docs-page-link.ts";
import "./pages/docs-page-avatar.ts";
import "./pages/docs-page-portal.ts";
import "./pages/docs-page-input.ts";
import "./pages/docs-page-radio.ts";
import "./pages/docs-page-dropzone.ts";
import "./pages/docs-page-select.ts";
import "./pages/docs-page-preview-card.ts";
import "./pages/docs-page-data-table.ts";
import "./pages/docs-page-command.ts";
import "./pages/docs-page-sidebar.ts";
import "./pages/docs-page-separator.ts";
import "./pages/docs-page-split-button.ts";
import "./pages/docs-page-progress.ts";
import "./pages/docs-page-toggle.ts";
import "./pages/docs-page-toggle-group.ts";
import "./pages/docs-page-number-field.ts";
import "./pages/docs-page-stepper.ts";
import "./pages/docs-page-menubar.ts";
import "./pages/docs-page-calendar.ts";
import "./pages/docs-page-styling.ts";
import "./pages/docs-page-theming.ts";
import "./pages/docs-page-colors.ts";
import "./pages/docs-page-typography.ts";
import "./pages/docs-page-prose.ts";
import "./create/docs-page-create.ts";
import "./pages/docs-page-map.ts";
import "./pages/docs-page-feed-item.ts";
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { mapFamily, mapStyles } from "@dui/map";
import { DuiAccordion, DuiAccordionItem } from "@dui/components/accordion";
import { DuiBadge } from "@dui/components/badge";
import { DuiButton } from "@dui/components/button";
import { DuiSwitch } from "@dui/components/switch";
import { DuiIcon } from "@dui/components/icon";
import { DuiScrollArea } from "@dui/components/scroll-area";
import { DuiCombobox } from "@dui/components/combobox";
import { DuiMenu, DuiMenuItem } from "@dui/components/menu";
import { DuiPopover, DuiPopoverTrigger, DuiPopoverPopup, DuiPopoverClose } from "@dui/components/popover";
import { DuiTooltip, DuiTooltipTrigger, DuiTooltipPopup } from "@dui/components/tooltip";
import { DuiDialog, DuiDialogTrigger, DuiDialogPopup, DuiDialogClose } from "@dui/components/dialog";
import { DuiAlertDialog, DuiAlertDialogTrigger, DuiAlertDialogPopup, DuiAlertDialogClose } from "@dui/components/alert-dialog";
import { DuiBreadcrumb, DuiBreadcrumbItem, DuiBreadcrumbLink, DuiBreadcrumbPage, DuiBreadcrumbSeparator, DuiBreadcrumbEllipsis } from "@dui/components/breadcrumb";
import { DuiCheckbox, DuiCheckboxGroup } from "@dui/components/checkbox";
import { DuiCollapsible } from "@dui/components/collapsible";
import { DuiToolbar } from "@dui/components/toolbar";
import { DuiSlider } from "@dui/components/slider";
import { DuiSpinner } from "@dui/components/spinner";
import { DuiTabs, DuiTabsList, DuiTab, DuiTabsPanel, DuiTabsIndicator } from "@dui/components/tabs";
import { DuiTextarea } from "@dui/components/textarea";
import { DuiTrunc } from "@dui/components/trunc";
import { DuiLink } from "@dui/components/link";
import { DuiAvatar } from "@dui/components/avatar";
import { DuiPortal } from "@dui/components/portal";
import { DuiInput } from "@dui/components/input";
import { DuiRadio, DuiRadioGroup } from "@dui/components/radio";
import { DuiDropzone } from "@dui/components/dropzone";
import { DuiSelect } from "@dui/components/select";
import { DuiPreviewCard, DuiPreviewCardTrigger, DuiPreviewCardPopup } from "@dui/components/preview-card";
import { DuiDataTable } from "@dui/components/data-table";
import { DuiCommand, DuiCommandInput, DuiCommandList, DuiCommandGroup, DuiCommandItem, DuiCommandEmpty, DuiCommandSeparator, DuiCommandShortcut } from "@dui/components/command";
import { DuiSidebarProvider, DuiSidebar, DuiSidebarTrigger, DuiSidebarContent, DuiSidebarHeader, DuiSidebarFooter, DuiSidebarGroup, DuiSidebarGroupLabel, DuiSidebarMenu, DuiSidebarMenuItem, DuiSidebarMenuButton, DuiSidebarSeparator, DuiSidebarInset } from "@dui/components/sidebar";
import { DuiSeparator } from "@dui/components/separator";
import { DuiSplitButton } from "@dui/components/split-button";
import { DuiProgress } from "@dui/components/progress";
import { DuiToggle, DuiToggleGroup } from "@dui/components/toggle";
import { DuiNumberField } from "@dui/components/number-field";
import { DuiStepper } from "@dui/components/stepper";
import { DuiMenubar } from "@dui/components/menubar";
import { DuiCalendar } from "@dui/components/calendar";
import { DuiFeedItem } from "@dui/theme-default-templates/feed";

applyTheme({
  theme: {
    ...defaultTheme,
    styles: new Map([...defaultTheme.styles, ...mapStyles]),
  },
  components: [
    ...mapFamily,
    DuiAccordion,
    DuiAccordionItem,
    DuiBadge,
    DuiButton,
    DuiSwitch,
    DuiIcon,
    DuiScrollArea,
    DuiCombobox,
    DuiMenu,
    DuiMenuItem,
    DuiPopover,
    DuiPopoverTrigger,
    DuiPopoverPopup,
    DuiPopoverClose,
    DuiTooltip,
    DuiTooltipTrigger,
    DuiTooltipPopup,
    DuiDialog,
    DuiDialogTrigger,
    DuiDialogPopup,
    DuiDialogClose,
    DuiAlertDialog,
    DuiAlertDialogTrigger,
    DuiAlertDialogPopup,
    DuiAlertDialogClose,
    DuiBreadcrumb,
    DuiBreadcrumbItem,
    DuiBreadcrumbLink,
    DuiBreadcrumbPage,
    DuiBreadcrumbSeparator,
    DuiBreadcrumbEllipsis,
    DuiCheckbox,
    DuiCheckboxGroup,
    DuiCollapsible,
    DuiToolbar,
    DuiSlider,
    DuiSpinner,
    DuiTabs,
    DuiTabsList,
    DuiTab,
    DuiTabsPanel,
    DuiTabsIndicator,
    DuiTextarea,
    DuiTrunc,
    DuiLink,
    DuiAvatar,
    DuiPortal,
    DuiInput,
    DuiRadio,
    DuiRadioGroup,
    DuiDropzone,
    DuiSelect,
    DuiPreviewCard,
    DuiPreviewCardTrigger,
    DuiPreviewCardPopup,
    DuiDataTable,
    DuiCommand,
    DuiCommandInput,
    DuiCommandList,
    DuiCommandGroup,
    DuiCommandItem,
    DuiCommandEmpty,
    DuiCommandSeparator,
    DuiCommandShortcut,
    DuiSidebarProvider,
    DuiSidebar,
    DuiSidebarTrigger,
    DuiSidebarContent,
    DuiSidebarHeader,
    DuiSidebarFooter,
    DuiSidebarGroup,
    DuiSidebarGroupLabel,
    DuiSidebarMenu,
    DuiSidebarMenuItem,
    DuiSidebarMenuButton,
    DuiSidebarSeparator,
    DuiSidebarInset,
    DuiSeparator,
    DuiSplitButton,
    DuiProgress,
    DuiToggle,
    DuiToggleGroup,
    DuiNumberField,
    DuiStepper,
    DuiMenubar,
    DuiCalendar,
    DuiFeedItem,
  ],
});

