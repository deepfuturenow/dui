import { feedFamily } from "./feed/index.ts";
import { dashboardFamily } from "./dashboard/index.ts";
import { metricsFamily } from "./metrics/index.ts";

export { DuiFeedItem, DuiActivityItem, DuiSocialPost } from "./feed/index.ts";
export { DuiSectionPanel, DuiPageHeader } from "./dashboard/index.ts";
export { DuiStatCard, DuiScoreItem, DuiRiskGauge, DuiProgressBar } from "./metrics/index.ts";

export const allTemplates = [
  ...feedFamily,
  ...dashboardFamily,
  ...metricsFamily,
];
