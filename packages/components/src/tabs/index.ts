// `tabs` provides the context that `tab`, `tabs-list` and `tabs-panel` consume,
// and a Lit context consumer requests its value exactly once, on connect.
// Defining a consumer first upgrades those elements before a provider exists,
// so the request goes unanswered and is never retried. Provider first.
import "./tabs.ts";
import "./tab.ts";
import "./tabs-indicator.ts";
import "./tabs-list.ts";
import "./tabs-panel.ts";

export { DuiTab } from "./tab.ts";
export { DuiTabs } from "./tabs.ts";
export { DuiTabsIndicator } from "./tabs-indicator.ts";
export { DuiTabsList } from "./tabs-list.ts";
export { DuiTabsPanel } from "./tabs-panel.ts";

export type { TabsContext } from "@dui/primitives/tabs";
export { valueChangeEvent } from "@dui/primitives/tabs";
