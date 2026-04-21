# @dui/chart

Chart component for DUI, wrapping [Observable Plot](https://observablehq.com/plot/).

Pass an Observable Plot spec via the `spec` property. The component renders Plot's SVG output inside its shadow DOM, applies DUI theme tokens for consistent aesthetics, and re-renders responsively on container resize. Tooltips animate smoothly on hover.

```html
<dui-chart .spec=${{
  marks: [
    Plot.barY(data, { x: "month", y: "value", fill: "var(--chart-color-1)" }),
    Plot.ruleY([0]),
  ],
  y: { grid: true },
  style: { background: "transparent" },
}}></dui-chart>
```

## Installation

```ts
import { chartFamily, chartStyles } from "@dui/chart";

applyTheme({
  components: [...otherComponents, ...chartFamily],
  styles: new Map([...defaultTheme.styles, ...chartStyles]),
});
```

## Properties

| Property     | Type          | Default | Description                                   |
| ------------ | ------------- | ------- | --------------------------------------------- |
| `spec`       | `PlotOptions` | —       | Observable Plot options object                 |
| `variant`    | `string`      | `""`    | Theme variant (e.g. `"sparkline"`)             |
| `responsive` | `boolean`     | `true`  | Auto re-render on container resize             |

## Events

| Event              | Detail                                | Description                              |
| ------------------ | ------------------------------------- | ---------------------------------------- |
| `dui-chart-render` | `{ element: SVGElement \| HTMLElement }` | Fired after Plot renders                 |
| `dui-chart-input`  | `{ value: unknown }`                  | Fired when pointer-selected datum changes |

## Styling

`<dui-chart>` offers three layers of styling control. From most direct to most global:

### 1. Plot spec options

Every mark in Observable Plot accepts styling options directly. This is the primary way to control the look of individual chart elements.

**Bar rounding** — [barY docs](https://observablehq.com/plot/marks/bar)

```js
Plot.barY(data, {
  x: "month", y: "value",
  fill: "var(--chart-color-1)",
  rx: 4,                          // rounded top corners
})
```

**Line styling** — [line docs](https://observablehq.com/plot/marks/line)

```js
Plot.lineY(data, {
  x: "date", y: "value",
  stroke: "var(--chart-color-1)",
  strokeWidth: 2,
  curve: "natural",               // catmull-rom interpolation
})
```

**Area fills** — [area docs](https://observablehq.com/plot/marks/area)

```js
Plot.areaY(data, {
  x: "date", y: "value",
  fill: "var(--chart-color-1)",
  fillOpacity: 0.15,
  curve: "natural",
})
```

**Rule lines** (baselines, reference lines) — [rule docs](https://observablehq.com/plot/marks/rule)

```js
Plot.ruleY([0], {
  stroke: "var(--border)",        // softer than default
  strokeWidth: 0.5,
  strokeDasharray: "4,2",        // dashed
})
// or remove entirely by omitting Plot.ruleY from marks
```

**Dots** (scatter, active-point) — [dot docs](https://observablehq.com/plot/marks/dot)

```js
Plot.dot(data, {
  x: "x", y: "y",
  fill: "var(--chart-color-1)",
  r: 5,
  fillOpacity: 0.7,
})
```

**Tooltips** — [tip docs](https://observablehq.com/plot/marks/tip)

```js
// Quick: add tip: true to any mark
Plot.barY(data, { x: "month", y: "value", tip: true })

// Explicit: separate tip mark with pointer transform
Plot.tip(data, Plot.pointerX({ x: "date", y: "value" }))
```

> **Note:** Plot draws the tip background as an SVG `<path>` with the pointer arrow
> integrated into the path data. There is no `rx` option for rounded corners — the
> corners are hardcoded as straight lines. CSS `border-radius` does not apply to
> SVG `<path>` elements. The DUI theme softens the appearance with a subtle drop
> shadow and opaque fill instead.

**Crosshairs** — [crosshair docs](https://observablehq.com/plot/interactions/crosshair)

```js
Plot.crosshairX(data, { x: "date", y: "value" })
```

**Active dot on hover** — combine [dot](https://observablehq.com/plot/marks/dot) with [pointer](https://observablehq.com/plot/interactions/pointer)

```js
Plot.dot(data, Plot.pointerX({
  x: "date", y: "value",
  fill: "var(--chart-color-1)",
  r: 4,
  stroke: "white",
  strokeWidth: 2,
}))
```

**Axis configuration** — [axes docs](https://observablehq.com/plot/features/scales#axis-options)

```js
{
  x: {
    label: null,             // hide axis label
    tickSize: 0,             // hide tick marks
    line: false,             // hide axis line
    tickFormat: (d) => d.charAt(0).toUpperCase() + d.slice(1), // Title Case
  },
  y: {
    grid: true,              // show grid lines
    label: "Revenue ($)",
    ticks: 5,                // number of ticks
    tickFormat: "s",         // SI-prefix format
  },
}
```

**Global style** — applies CSS to Plot's root `<svg>`, cascading to all children

```js
{
  style: {
    background: "transparent",
    fontSize: "11px",
    color: "var(--text-3)",
  },
}
```

**Layout** — control chart dimensions and margins

```js
{
  height: 120,
  marginTop: 4,
  marginBottom: 24,
  marginLeft: 0,
  marginRight: 0,
}
```

For the full list of options, see the [Observable Plot documentation](https://observablehq.com/plot/features/plots).

### 2. DUI theme tokens (CSS custom properties)

These tokens are set by the default theme and can be overridden per-instance via inline `style`, or globally via a custom theme.

| Token                  | Default             | Description             |
| ---------------------- | ------------------- | ----------------------- |
| `--chart-color-1`      | `var(--accent)`     | Series color 1          |
| `--chart-color-2` – `8`| hue-rotated accent | Series colors 2–8       |
| `--chart-bg`           | `transparent`       | Chart background        |
| `--chart-grid-color`   | `var(--border)`     | Grid line color         |
| `--chart-axis-color`   | `var(--text-2)`     | Axis text and line color |
| `--chart-font-family`  | `var(--font-sans)`  | All chart text          |
| `--chart-font-size`    | `var(--font-size-xs)` | Axis/tick label size  |

**Per-instance override:**

```html
<dui-chart
  style="--chart-axis-color: var(--text-3); --chart-font-size: 11px;"
  .spec=${...}
></dui-chart>
```

**Multi-series color scale** — use tokens in Plot's `color.range`:

```js
{
  color: {
    legend: true,
    range: [
      "var(--chart-color-1)",
      "var(--chart-color-2)",
      "var(--chart-color-3)",
    ],
  },
}
```

**Resolving tokens to concrete values** (for computed scales):

```ts
import { chartColorScale } from "@dui/chart";

// Returns an array of resolved color strings from --chart-color-N tokens
const colors = chartColorScale(chartElement, 4);
// → ["oklch(0.55 0.25 260)", "oklch(0.55 0.25 320)", ...]
```

### 3. Theme CSS (inside a custom theme)

The default theme targets Plot's SVG structure via `aria-label` selectors on the shadow DOM `[part="root"]` container. These selectors are available when writing a custom theme — they cannot be used from outside the component because `::part()` does not allow descendant selectors.

```css
/* Axis tick labels */
[part="root"] [aria-label="x-axis tick label"] text {
  fill: var(--text-3);
  font-size: 11px;
}

/* Axis lines */
[part="root"] [aria-label="x-axis"] line {
  stroke: var(--border);
}

/* Grid lines */
[part="root"] [aria-label*="grid"] line {
  stroke: var(--chart-grid-color);
  stroke-dasharray: 2,2;
}

/* Bar shapes */
[part="root"] [aria-label="bar"] rect {
  rx: 4;
}

/* Rule (baseline) */
[part="root"] [aria-label="rule"] line {
  stroke: var(--border);
  stroke-width: 0.5;
}

/* Tooltip background */
[part="root"] [aria-label="tip"] path {
  fill: var(--surface-1);
  stroke: var(--border);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
}
```

Plot groups marks into `<g>` elements with these `aria-label` values:

| aria-label              | Element          | Description                   |
| ----------------------- | ---------------- | ----------------------------- |
| `x-axis`                | `<g>`            | X axis group                  |
| `y-axis`                | `<g>`            | Y axis group                  |
| `x-axis tick`           | `<g>` → `<line>` | X axis tick marks             |
| `x-axis tick label`     | `<g>` → `<text>` | X axis tick text              |
| `y-axis tick`           | `<g>` → `<line>` | Y axis tick marks             |
| `y-axis tick label`     | `<g>` → `<text>` | Y axis tick text              |
| `x-grid`                | `<g>` → `<line>` | X grid lines                  |
| `y-grid`                | `<g>` → `<line>` | Y grid lines                  |
| `line`                  | `<g>` → `<path>` | Line mark paths               |
| `area`                  | `<g>` → `<path>` | Area mark fills               |
| `bar`                   | `<g>` → `<rect>` | Bar mark rectangles           |
| `dot`                   | `<g>` → `<circle>` | Dot mark circles            |
| `rule`                  | `<g>` → `<line>` | Rule (reference) lines        |
| `tip`                   | `<g>` → `<path>` + `<text>` | Tooltip mark       |

## Sparkline variant

The `sparkline` variant strips axes and margins for compact inline use:

```html
<dui-chart variant="sparkline" style="height: 40px;" .spec=${{
  axis: null,
  margin: 0,
  marginTop: 2,
  marginBottom: 2,
  marks: [
    Plot.areaY(data, { x: "x", y: "y", fill: "var(--chart-color-1)", fillOpacity: 0.15, curve: "natural" }),
    Plot.lineY(data, { x: "x", y: "y", stroke: "var(--chart-color-1)", strokeWidth: 1.5, curve: "natural" }),
  ],
  style: { background: "transparent" },
}}></dui-chart>
```

## Interactive features

The component automatically provides:

- **Smooth tooltip animation** — tooltips fade in on first appearance and glide between data points with a 150ms ease-out transition
- **Responsive sizing** — re-renders when the container width changes (disable with `responsive="false"`)
- **Input events** — listen for `dui-chart-input` to react to pointer-selected data points

```html
<dui-chart
  .spec=${spec}
  @dui-chart-input=${(e) => console.log("Selected:", e.detail.value)}
  @dui-chart-render=${(e) => console.log("Rendered:", e.detail.element)}
></dui-chart>
```
