import type { PlotOptions } from "@observablehq/plot";

const DEFAULTS: Partial<PlotOptions> = {
  style: { background: "transparent" },
};

/**
 * Apply DUI conventions to a raw Observable Plot spec.
 *
 * Currently sets `style.background` to `"transparent"` so charts
 * inherit the page/card background. All defaults are overridable —
 * any property you set in `spec` takes precedence.
 *
 * ```ts
 * import { chartSpec } from "@dui/chart";
 *
 * html`<dui-chart .spec=${chartSpec({
 *   marks: [Plot.lineY(data, { x: "date", y: "value" })],
 *   y: { grid: true },
 * })}></dui-chart>`;
 * ```
 */
export function chartSpec(spec: PlotOptions): PlotOptions {
  return {
    ...DEFAULTS,
    ...spec,
    style: {
      ...(DEFAULTS.style as Record<string, string>),
      ...(spec.style as Record<string, string>),
    },
  };
}
