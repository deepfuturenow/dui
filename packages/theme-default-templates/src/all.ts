import { feedFamily } from "./feed/index.ts";
import { dashboardFamily } from "./dashboard/index.ts";

export { DuiFeedItem } from "./feed/index.ts";
export { DuiSectionPanel, DuiPageHeader } from "./dashboard/index.ts";

export const allTemplates = [
  ...feedFamily,
  ...dashboardFamily,
];
