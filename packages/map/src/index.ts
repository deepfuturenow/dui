// --- Components ---
export {
  DuiMap,
  viewportChangeEvent,
  mapLoadEvent,
  mapClickEvent,
  mapDblClickEvent,
  mapContextMenuEvent,
  mapContext,
} from "./map/index.ts";
export type { MapContext, MapViewport, MapClickDetail } from "./map/index.ts";

export {
  DuiMapMarker,
  DuiMapMarkerContent,
  DuiMapMarkerPopup,
  DuiMapMarkerTooltip,
  DuiMapMarkerLabel,
  dragStartEvent,
  dragEvent,
  dragEndEvent,
  markerContext,
} from "./marker/index.ts";
export type { MarkerContext, LngLat } from "./marker/index.ts";

export { DuiMapControls, locateEvent } from "./controls/index.ts";
export { DuiMapPopup, popupCloseEvent } from "./popup/index.ts";
export { DuiMapRoute, routeClickEvent } from "./route/index.ts";
export { DuiMapRegion, regionClickEvent } from "./region/index.ts";
export { DuiMapClusterLayer, pointClickEvent, clusterClickEvent } from "./cluster-layer/index.ts";
export { DuiMapHeatmap } from "./heatmap/index.ts";

// --- Family (all components for applyTheme registration) ---
import { DuiMap } from "./map/index.ts";
import { DuiMapMarker, DuiMapMarkerContent, DuiMapMarkerPopup, DuiMapMarkerTooltip, DuiMapMarkerLabel } from "./marker/index.ts";
import { DuiMapControls } from "./controls/index.ts";
import { DuiMapPopup } from "./popup/index.ts";
import { DuiMapRoute } from "./route/index.ts";
import { DuiMapRegion } from "./region/index.ts";
import { DuiMapClusterLayer } from "./cluster-layer/index.ts";
import { DuiMapHeatmap } from "./heatmap/index.ts";

/** All map components for use with `applyTheme({ components: [...mapFamily] })`. */
export const mapFamily = [
  DuiMap,
  DuiMapMarker,
  DuiMapMarkerContent,
  DuiMapMarkerPopup,
  DuiMapMarkerTooltip,
  DuiMapMarkerLabel,
  DuiMapControls,
  DuiMapPopup,
  DuiMapRoute,
  DuiMapRegion,
  DuiMapClusterLayer,
  DuiMapHeatmap,
];

// --- Theme styles map for merging into a DuiTheme ---
import type { CSSResult } from "lit";
import { mapStyles as _mapComponentStyles } from "./theme/map-theme.ts";

/** Map of tag names → themed CSS for map components. Merge into your theme's `styles` Map. */
export const mapStyles: Map<string, CSSResult> = _mapComponentStyles;
