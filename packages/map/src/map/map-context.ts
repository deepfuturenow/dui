import { createContext } from "@lit/context";
import type MapLibreGL from "maplibre-gl";

export type MapContext = {
  readonly map: MapLibreGL.Map | null;
  readonly isLoaded: boolean;
};

export const mapContext = createContext<MapContext>(Symbol("dui-map"));
