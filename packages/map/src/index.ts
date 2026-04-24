// --- Components (self-registering) ---
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
