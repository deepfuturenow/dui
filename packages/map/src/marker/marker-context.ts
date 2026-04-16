import { createContext } from "@lit/context";
import type MapLibreGL from "maplibre-gl";

export type MarkerContext = {
  readonly marker: MapLibreGL.Marker;
  readonly map: MapLibreGL.Map | null;
};

export const markerContext = createContext<MarkerContext>(Symbol("dui-map-marker"));
