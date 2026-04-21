/**
 * Resolve DUI chart color tokens to concrete color values
 * for use in Plot's color scale range.
 */
export function chartColorScale(element: HTMLElement, count = 8): string[] {
  const cs = getComputedStyle(element);
  return Array.from({ length: count }, (_, i) =>
    cs.getPropertyValue(`--chart-color-${i + 1}`).trim()
  ).filter(Boolean);
}
