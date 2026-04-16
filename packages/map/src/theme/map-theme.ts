/**
 * Default theme styles for DUI map components.
 *
 * Uses DUI design tokens for consistency with the rest of the component library.
 * These styles provide aesthetic treatment — the structural CSS lives in each component.
 *
 * IMPORTANT: MapLibre renders popups, tooltips, markers, and attribution
 * inside the `dui-map` shadow root. All chrome for those elements must be
 * in the `dui-map` theme entry, not in the sub-component entries.
 */
import { css, type CSSResult } from "lit";

// ---------------------------------------------------------------------------
// dui-map — main theme (includes all MapLibre-rendered DOM)
// ---------------------------------------------------------------------------
const mapThemeStyles = css`
  /* --- Loader overlay --------------------------------------------------- */
  [part="loader"] {
    background: oklch(from var(--background) l c h / 0.5);
    backdrop-filter: blur(2px);
  }

  .loader-dot {
    background: oklch(from var(--foreground) l c h / 0.6);
  }

  /* --- Attribution ------------------------------------------------------- */
  .maplibregl-ctrl-attrib {
    font-family: var(--font-sans);
    font-size: var(--font-size-2xs);
    color: oklch(from var(--foreground) l c h / 0.5);
    background: oklch(from var(--background) l c h / 0.65);
    backdrop-filter: blur(4px);
    border-radius: var(--radius-sm) 0 0 0;
  }

  .maplibregl-ctrl-attrib a {
    color: oklch(from var(--foreground) l c h / 0.6);
  }

  .maplibregl-ctrl-attrib a:hover {
    color: var(--foreground);
  }

  .maplibregl-ctrl-attrib-button {
    background-color: oklch(from var(--background) l c h / 0.65);
    backdrop-filter: blur(4px);
  }

  /* --- Default marker dot ----------------------------------------------- */
  .dui-default-marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    background: var(--accent, #3b82f6);
    box-shadow: var(--shadow-sm);
    transition: transform var(--duration-faster) var(--ease-out-3),
                box-shadow var(--duration-faster) var(--ease-out-3);
  }

  .dui-default-marker:hover {
    transform: scale(1.15);
    box-shadow: var(--shadow-md);
  }

  /* --- Marker label ------------------------------------------------------ */
  .dui-marker-label {
    font-family: var(--font-sans);
    font-size: var(--font-size-2xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-1);
    text-shadow:
      0 0 3px var(--background),
      0 0 3px var(--background),
      0 0 3px var(--background);
  }

  /* --- Popup chrome (shared reset) -------------------------------------- */
  .maplibregl-popup.dui-popup .maplibregl-popup-content,
  .maplibregl-popup.dui-tooltip .maplibregl-popup-content {
    /* Reset MapLibre defaults */
    padding: 0;
    background: none;
    border-radius: 0;
    box-shadow: none;
  }

  /* --- Popup (click-to-open, popover-like) ------------------------------ */
  .maplibregl-popup.dui-popup .maplibregl-popup-content > div {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    color: var(--text-1);
    background: var(--surface-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    box-shadow: var(--shadow-md);
  }

  .maplibregl-popup.dui-popup .maplibregl-popup-tip {
    border-top-color: var(--surface-3);
    border-bottom-color: var(--surface-3);
    border-left-color: var(--surface-3);
    border-right-color: var(--surface-3);
  }

  /* Only the anchor direction's tip is visible; the rest are transparent.
     MapLibre sets the visible side via its anchor classes. Override just
     the transparent reset to use the surface color. The solid side inherits. */
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-top .maplibregl-popup-tip {
    border-bottom-color: var(--surface-3);
  }
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
    border-top-color: var(--surface-3);
  }
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-left .maplibregl-popup-tip {
    border-right-color: var(--surface-3);
  }
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-right .maplibregl-popup-tip {
    border-left-color: var(--surface-3);
  }
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-top-left .maplibregl-popup-tip {
    border-bottom-color: var(--surface-3);
  }
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-top-right .maplibregl-popup-tip {
    border-bottom-color: var(--surface-3);
  }
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip {
    border-top-color: var(--surface-3);
  }
  .maplibregl-popup.dui-popup.maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip {
    border-top-color: var(--surface-3);
  }

  /* --- Tooltip (hover, inverted) ---------------------------------------- */
  .maplibregl-popup.dui-tooltip .maplibregl-popup-content > div {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-snug);
    color: var(--background);
    background: color-mix(
      in oklch,
      var(--foreground) 90%,
      oklch(0 0 0 / 0)
    );
    backdrop-filter: blur(4px);
    border-radius: var(--radius-sm);
    padding: var(--space-0_5) var(--space-1_5);
    box-shadow: var(--shadow-sm);
    max-width: var(--space-80);
  }

  .maplibregl-popup.dui-tooltip .maplibregl-popup-tip {
    display: none;
  }

  /* --- Popup close button ------------------------------------------------ */
  .maplibregl-popup-close-button {
    font-family: var(--font-sans);
    color: var(--text-1);
    opacity: 0.5;
    transition: opacity var(--duration-faster) var(--ease-out-3);
    padding: var(--space-0_5) var(--space-1);
  }

  .maplibregl-popup-close-button:hover {
    background: oklch(from var(--foreground) l c h / 0.06);
    opacity: 1;
  }
`;

// ---------------------------------------------------------------------------
// dui-map-controls — themed control buttons
// ---------------------------------------------------------------------------
const mapControlsThemeStyles = css`
  [part="group"] {
    border: var(--border-width-thin) solid var(--border);
    background: var(--background);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }

  [part="group"] > [part="control-button"]:not(:last-child) {
    border-bottom: var(--border-width-thin) solid var(--border);
  }

  [part="control-button"] {
    color: var(--text-1);
    transition: background var(--duration-faster) var(--ease-out-3);
  }

  [part="control-button"]:hover:not(:disabled) {
    background: oklch(from var(--foreground) l c h / 0.06);
  }

  [part="control-button"]:active:not(:disabled) {
    background: oklch(from var(--foreground) l c h / 0.1);
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// ---------------------------------------------------------------------------
// Sub-component entries (empty — all chrome lives in the dui-map entry above)
// ---------------------------------------------------------------------------
const mapMarkerThemeStyles = css``;
const mapMarkerContentThemeStyles = css``;
const mapMarkerPopupThemeStyles = css``;
const mapMarkerTooltipThemeStyles = css``;
const mapMarkerLabelThemeStyles = css``;
const mapPopupThemeStyles = css``;
const mapRouteThemeStyles = css``;
const mapRegionThemeStyles = css``;
const mapClusterLayerThemeStyles = css``;
const mapHeatmapThemeStyles = css``;

/** Tag name → themed CSS map. Merge into your DuiTheme's `styles` Map. */
export const mapStyles: Map<string, CSSResult> = new Map([
  ["dui-map", mapThemeStyles],
  ["dui-map-controls", mapControlsThemeStyles],
  ["dui-map-marker", mapMarkerThemeStyles],
  ["dui-map-marker-content", mapMarkerContentThemeStyles],
  ["dui-map-marker-popup", mapMarkerPopupThemeStyles],
  ["dui-map-marker-tooltip", mapMarkerTooltipThemeStyles],
  ["dui-map-marker-label", mapMarkerLabelThemeStyles],
  ["dui-map-popup", mapPopupThemeStyles],
  ["dui-map-route", mapRouteThemeStyles],
  ["dui-map-region", mapRegionThemeStyles],
  ["dui-map-cluster-layer", mapClusterLayerThemeStyles],
  ["dui-map-heatmap", mapHeatmapThemeStyles],
]);
