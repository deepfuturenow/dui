/**
 * Barrel export of all DUI components.
 * Provides the `allComponents` array for one-shot `applyTheme()` registration.
 *
 * @example
 * ```ts
 * import { applyTheme } from "@deepfuture/dui-core";
 * import { defaultTheme } from "@deepfuture/dui-theme-default";
 * import { allComponents } from "@deepfuture/dui-components/all";
 *
 * applyTheme({ theme: defaultTheme, components: allComponents });
 * ```
 */

import type { LitElement } from "lit";

// --- Accordion ---
import { DuiAccordion, DuiAccordionItem } from "./accordion/index.ts";
export { DuiAccordion, DuiAccordionItem };
export type { AccordionContext } from "./accordion/index.ts";

// --- Alert Dialog ---
import { DuiAlertDialog,
  DuiAlertDialogTrigger,
  DuiAlertDialogPopup,
  DuiAlertDialogClose, } from "./alert-dialog/index.ts";
export { DuiAlertDialog,
  DuiAlertDialogTrigger,
  DuiAlertDialogPopup,
  DuiAlertDialogClose, };
export type {
  AlertDialogOpenChangeDetail,
  AlertDialogContext,
} from "./alert-dialog/index.ts";

// --- Avatar ---
import { DuiAvatar } from "./avatar/index.ts";
export { DuiAvatar };
export type { ImageStatus } from "./avatar/index.ts";

// --- Badge ---
import { DuiBadge } from "./badge/index.ts";
export { DuiBadge };

// --- Breadcrumb ---
import { DuiBreadcrumb,
  DuiBreadcrumbItem,
  DuiBreadcrumbLink,
  DuiBreadcrumbPage,
  DuiBreadcrumbSeparator,
  DuiBreadcrumbEllipsis, } from "./breadcrumb/index.ts";
export { DuiBreadcrumb,
  DuiBreadcrumbItem,
  DuiBreadcrumbLink,
  DuiBreadcrumbPage,
  DuiBreadcrumbSeparator,
  DuiBreadcrumbEllipsis, };

// --- Button ---
import { DuiButton } from "./button/index.ts";
export { DuiButton };

// --- Calendar ---
import { DuiCalendar } from "./calendar/index.ts";
export { DuiCalendar };

// --- Card ---
import { DuiCard } from "./card/index.ts";
export { DuiCard };



// --- Checkbox ---
import { DuiCheckbox, DuiCheckboxGroup } from "./checkbox/index.ts";
export { DuiCheckbox, DuiCheckboxGroup };
export type { CheckboxGroupContext } from "./checkbox/index.ts";

// --- Collapsible ---
import { DuiCollapsible } from "./collapsible/index.ts";
export { DuiCollapsible };

// --- Combobox ---
import { DuiCombobox } from "./combobox/index.ts";
export { DuiCombobox };
export type {
  SelectOption as ComboboxSelectOption,
  ComboboxValueChangeDetail,
  ComboboxValuesChangeDetail,
} from "./combobox/index.ts";

// --- Command ---
import { DuiCommand,
  DuiCommandInput,
  DuiCommandList,
  DuiCommandGroup,
  DuiCommandItem,
  DuiCommandEmpty,
  DuiCommandSeparator,
  DuiCommandShortcut, } from "./command/index.ts";
export { DuiCommand,
  DuiCommandInput,
  DuiCommandList,
  DuiCommandGroup,
  DuiCommandItem,
  DuiCommandEmpty,
  DuiCommandSeparator,
  DuiCommandShortcut, };
export type { CommandContext, CommandItemEntry } from "./command/index.ts";

// --- Data Table ---
import { DuiDataTable } from "./data-table/index.ts";
export { DuiDataTable };
export type {
  ColumnDef,
  SortDirection,
  SortState,
  PageState,
} from "./data-table/index.ts";

// --- Dialog ---
import { DuiDialog,
  DuiDialogTrigger,
  DuiDialogPopup,
  DuiDialogClose, } from "./dialog/index.ts";
export { DuiDialog,
  DuiDialogTrigger,
  DuiDialogPopup,
  DuiDialogClose, };
export type { DialogOpenChangeDetail, DialogContext } from "./dialog/index.ts";

// --- Dropzone ---
import { DuiDropzone } from "./dropzone/index.ts";
export { DuiDropzone };

// --- Field ---
import { DuiField } from "./field/index.ts";
export { DuiField };

// --- Fieldset ---
import { DuiFieldset } from "./fieldset/index.ts";
export { DuiFieldset };
export type {
  DropzoneErrorCode,
  DropzoneRejectionCode,
  FileRejectionError,
  RejectedFile,
  DropzoneDropDetail,
  DropzoneAcceptedDetail,
  DropzoneRejectedDetail,
  DropzoneErrorDetail,
} from "./dropzone/index.ts";



// --- Icon ---
import { DuiIcon } from "./icon/index.ts";
export { DuiIcon };

// --- Input ---
import { DuiInput } from "./input/index.ts";
export { DuiInput };


// --- Menu ---
import { DuiMenu, DuiMenuItem } from "./menu/index.ts";
export { DuiMenu, DuiMenuItem };

// --- Menubar ---
import { DuiMenubar } from "./menubar/index.ts";
export { DuiMenubar };
export type { MenubarContext } from "./menubar/index.ts";

// --- Number Field ---
import { DuiNumberField } from "./number-field/index.ts";
export { DuiNumberField };

// --- Stepper ---
import { DuiStepper } from "./stepper/index.ts";
export { DuiStepper };



// --- Popover ---
import { DuiPopover,
  DuiPopoverTrigger,
  DuiPopoverPopup,
  DuiPopoverClose, } from "./popover/index.ts";
export { DuiPopover,
  DuiPopoverTrigger,
  DuiPopoverPopup,
  DuiPopoverClose, };
export type {
  PopoverOpenChangeDetail,
  PopoverContext,
  PopoverSide,
} from "./popover/index.ts";

// --- Portal ---
import { DuiPortal } from "./portal/index.ts";
export { DuiPortal };
export type { QueryRoot } from "./portal/index.ts";

// --- Preview Card ---
import { DuiPreviewCard,
  DuiPreviewCardTrigger,
  DuiPreviewCardPopup, } from "./preview-card/index.ts";
export { DuiPreviewCard,
  DuiPreviewCardTrigger,
  DuiPreviewCardPopup, };
export type {
  PreviewCardOpenChangeDetail,
  PreviewCardContext,
  PreviewCardSide,
} from "./preview-card/index.ts";

// --- Progress ---
import { DuiProgress } from "./progress/index.ts";
export { DuiProgress };

// --- Radio ---
import { DuiRadio, DuiRadioGroup } from "./radio/index.ts";
export { DuiRadio, DuiRadioGroup };
export type { RadioGroupContext } from "./radio/index.ts";

// --- Scroll Area ---
import { DuiScrollArea } from "./scroll-area/index.ts";
export { DuiScrollArea };

// --- Select ---
import { DuiSelect } from "./select/index.ts";
export { DuiSelect };
export type { SelectOption } from "./select/index.ts";

// --- Separator ---
import { DuiSeparator } from "./separator/index.ts";
export { DuiSeparator };

// --- Split Button ---
import { DuiSplitButton } from "./split-button/index.ts";
export { DuiSplitButton };

// --- Sidebar ---
import { DuiSidebarProvider,
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
  DuiSidebarInset, } from "./sidebar/index.ts";
export { DuiSidebarProvider,
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
  DuiSidebarInset, };
export type { SidebarContext } from "./sidebar/index.ts";

// --- Slider ---
import { DuiSlider } from "./slider/index.ts";
export { DuiSlider };

// --- Spinner ---
import { DuiSpinner } from "./spinner/index.ts";
export { DuiSpinner };

// --- Switch ---
import { DuiSwitch } from "./switch/index.ts";
export { DuiSwitch };

// --- Tabs ---
import { DuiTabs,
  DuiTabsList,
  DuiTab,
  DuiTabsPanel,
  DuiTabsIndicator, } from "./tabs/index.ts";
export { DuiTabs,
  DuiTabsList,
  DuiTab,
  DuiTabsPanel,
  DuiTabsIndicator, };
export type { TabsContext } from "./tabs/index.ts";

// --- Textarea ---
import { DuiTextarea } from "./textarea/index.ts";
export { DuiTextarea };
export type { TextareaResize } from "./textarea/index.ts";

// --- Toggle ---
import { DuiToggle, DuiToggleGroup } from "./toggle/index.ts";
export { DuiToggle, DuiToggleGroup };
export type { ToggleGroupContext } from "./toggle/index.ts";

// --- Toolbar ---
import { DuiToolbar } from "./toolbar/index.ts";
export { DuiToolbar };

// --- Tooltip ---
import { DuiTooltip,
  DuiTooltipTrigger,
  DuiTooltipPopup, } from "./tooltip/index.ts";
export { DuiTooltip,
  DuiTooltipTrigger,
  DuiTooltipPopup, };
export type { TooltipContext, TooltipSide } from "./tooltip/index.ts";

// --- Trunc ---
import { DuiTrunc } from "./trunc/index.ts";
export { DuiTrunc };



/**
 * All DUI component classes, ready for `applyTheme()`.
 * Includes every component and sub-component.
 */
export const allComponents: Array<typeof LitElement & { tagName: string }> = [
  DuiAccordion,
  DuiAccordionItem,
  DuiAlertDialog,
  DuiAlertDialogTrigger,
  DuiAlertDialogPopup,
  DuiAlertDialogClose,
  DuiAvatar,
  DuiBadge,
  DuiBreadcrumb,
  DuiBreadcrumbItem,
  DuiBreadcrumbLink,
  DuiBreadcrumbPage,
  DuiBreadcrumbSeparator,
  DuiBreadcrumbEllipsis,
  DuiButton,
  DuiCalendar,

  DuiCard,
  DuiCheckbox,
  DuiCheckboxGroup,
  DuiCollapsible,
  DuiCombobox,
  DuiCommand,
  DuiCommandInput,
  DuiCommandList,
  DuiCommandGroup,
  DuiCommandItem,
  DuiCommandEmpty,
  DuiCommandSeparator,
  DuiCommandShortcut,
  DuiDataTable,
  DuiDialog,
  DuiDialogTrigger,
  DuiDialogPopup,
  DuiDialogClose,
  DuiDropzone,
  DuiField,
  DuiFieldset,

  DuiIcon,
  DuiInput,
  DuiMenu,
  DuiMenuItem,
  DuiMenubar,
  DuiNumberField,
  DuiStepper,

  DuiPopover,
  DuiPopoverTrigger,
  DuiPopoverPopup,
  DuiPopoverClose,
  DuiPortal,
  DuiPreviewCard,
  DuiPreviewCardTrigger,
  DuiPreviewCardPopup,
  DuiProgress,
  DuiRadio,
  DuiRadioGroup,
  DuiScrollArea,
  DuiSelect,
  DuiSeparator,
  DuiSplitButton,
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
  DuiSlider,
  DuiSpinner,
  DuiSwitch,
  DuiTabs,
  DuiTabsList,
  DuiTab,
  DuiTabsPanel,
  DuiTabsIndicator,
  DuiTextarea,
  DuiToggle,
  DuiToggleGroup,
  DuiToolbar,
  DuiTooltip,
  DuiTooltipTrigger,
  DuiTooltipPopup,
  DuiTrunc,

];
