import { DuiSidebarProvider } from "./sidebar-provider.ts";
import { DuiSidebar } from "./sidebar.ts";
import { DuiSidebarTrigger } from "./sidebar-trigger.ts";
import { DuiSidebarContent } from "./sidebar-content.ts";
import { DuiSidebarHeader } from "./sidebar-header.ts";
import { DuiSidebarFooter } from "./sidebar-footer.ts";
import { DuiSidebarGroup } from "./sidebar-group.ts";
import { DuiSidebarGroupLabel } from "./sidebar-group-label.ts";
import { DuiSidebarMenu } from "./sidebar-menu.ts";
import { DuiSidebarMenuItem } from "./sidebar-menu-item.ts";
import { DuiSidebarMenuButton } from "./sidebar-menu-button.ts";
import { DuiSidebarSeparator } from "./sidebar-separator.ts";
import { DuiSidebarInset } from "./sidebar-inset.ts";

if (!customElements.get(DuiSidebarProvider.tagName)) {
  customElements.define(DuiSidebarProvider.tagName, DuiSidebarProvider);
}

if (!customElements.get(DuiSidebar.tagName)) {
  customElements.define(DuiSidebar.tagName, DuiSidebar);
}

if (!customElements.get(DuiSidebarTrigger.tagName)) {
  customElements.define(DuiSidebarTrigger.tagName, DuiSidebarTrigger);
}

if (!customElements.get(DuiSidebarContent.tagName)) {
  customElements.define(DuiSidebarContent.tagName, DuiSidebarContent);
}

if (!customElements.get(DuiSidebarHeader.tagName)) {
  customElements.define(DuiSidebarHeader.tagName, DuiSidebarHeader);
}

if (!customElements.get(DuiSidebarFooter.tagName)) {
  customElements.define(DuiSidebarFooter.tagName, DuiSidebarFooter);
}

if (!customElements.get(DuiSidebarGroup.tagName)) {
  customElements.define(DuiSidebarGroup.tagName, DuiSidebarGroup);
}

if (!customElements.get(DuiSidebarGroupLabel.tagName)) {
  customElements.define(DuiSidebarGroupLabel.tagName, DuiSidebarGroupLabel);
}

if (!customElements.get(DuiSidebarMenu.tagName)) {
  customElements.define(DuiSidebarMenu.tagName, DuiSidebarMenu);
}

if (!customElements.get(DuiSidebarMenuItem.tagName)) {
  customElements.define(DuiSidebarMenuItem.tagName, DuiSidebarMenuItem);
}

if (!customElements.get(DuiSidebarMenuButton.tagName)) {
  customElements.define(DuiSidebarMenuButton.tagName, DuiSidebarMenuButton);
}

if (!customElements.get(DuiSidebarSeparator.tagName)) {
  customElements.define(DuiSidebarSeparator.tagName, DuiSidebarSeparator);
}

if (!customElements.get(DuiSidebarInset.tagName)) {
  customElements.define(DuiSidebarInset.tagName, DuiSidebarInset);
}
