import { DuiTabs } from "./tabs.ts";
import { DuiTabsList } from "./tabs-list.ts";
import { DuiTab } from "./tab.ts";
import { DuiTabsPanel } from "./tabs-panel.ts";
import { DuiTabsIndicator } from "./tabs-indicator.ts";

for (const C of [DuiTabs, DuiTabsList, DuiTab, DuiTabsPanel, DuiTabsIndicator]) {
  if (!customElements.get(C.tagName)) {
    customElements.define(C.tagName, C);
  }
}
