import { feedFamily } from "./feed/index.ts";
import { dashboardFamily } from "./dashboard/index.ts";
import { metricsFamily } from "./metrics/index.ts";
import { dataFamily } from "./data/index.ts";
import { contentFamily } from "./content/index.ts";
import { mediaFamily } from "./media/index.ts";

export { DuiFeedItem, DuiActivityItem, DuiSocialPost, DuiHeadlineItem } from "./feed/index.ts";
export { DuiSectionPanel, DuiPageHeader } from "./dashboard/index.ts";
export { DuiStatCard, DuiScoreItem, DuiRiskGauge, DuiProgressBar } from "./metrics/index.ts";
export { DuiKeyValue, DuiMarketTable } from "./data/index.ts";
export type { MarketRow } from "./data/index.ts";
export { DuiBriefingBlock, DuiEmptyState, DuiNumberedInsight } from "./content/index.ts";
export { DuiAvatarRow, DuiMediaGrid } from "./media/index.ts";
export type { AvatarItem } from "./media/index.ts";
export type { MediaItem } from "./media/index.ts";

export const allTemplates = [
  ...feedFamily,
  ...dashboardFamily,
  ...metricsFamily,
  ...dataFamily,
  ...contentFamily,
  ...mediaFamily,
];
