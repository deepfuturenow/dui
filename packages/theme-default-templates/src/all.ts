import { feedFamily } from "./feed/index.ts";
import { dashboardFamily } from "./dashboard/index.ts";
import { metricsFamily } from "./metrics/index.ts";
import { dataFamily } from "./data/index.ts";

export { DuiFeedItem, DuiActivityItem, DuiSocialPost, DuiHeadlineItem } from "./feed/index.ts";
export { DuiSectionPanel, DuiPageHeader } from "./dashboard/index.ts";
export { DuiStatCard, DuiScoreItem, DuiRiskGauge, DuiProgressBar } from "./metrics/index.ts";
export { DuiKeyValue, DuiMarketTable } from "./data/index.ts";
export type { MarketRow } from "./data/index.ts";

export const allTemplates = [
  ...feedFamily,
  ...dashboardFamily,
  ...metricsFamily,
  ...dataFamily,
];
