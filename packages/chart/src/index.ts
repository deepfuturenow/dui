// --- Components ---
export { DuiChart, chartRenderEvent, chartInputEvent } from "./chart/index.ts";

// --- Scales ---
export { chartColorScale } from "./scales.ts";

// --- Spec helper ---
export { chartSpec } from "./spec.ts";

// --- Family (all components for applyTheme registration) ---
import { DuiChart } from "./chart/index.ts";

/** All chart components for use with `applyTheme({ components: [...chartFamily] })`. */
export const chartFamily = [DuiChart];

// --- Theme styles map for merging into a DuiTheme ---
import type { CSSResult } from "lit";
import { chartStyles as _chartStyles } from "./theme/chart-theme.ts";

/** Map of tag names → themed CSS for chart components. Merge into your theme's `styles` Map. */
export const chartStyles: Map<string, CSSResult> = _chartStyles;
