/** TypeScript interfaces for the DUI component inspector. */

export interface PropertyInfo {
  name: string;
  value: unknown;
  type: string;
  reflect: boolean;
  attribute: string | false;
}

export interface TokenInfo {
  name: string;
  specified: string;
  computed: string;
  /** Hex value if the token resolves to a color. */
  hex?: string;
}

export interface SlotInfo {
  name: string;
  assignedNodes: number;
}

export interface PartInfo {
  name: string;
  tagName: string;
}

export interface StyleLayerInfo {
  layer: string;
  properties: string[];
}

export interface ComponentInspection {
  tagName: string;
  className: string;
  properties: PropertyInfo[];
  tokens: TokenInfo[];
  styleLayers: StyleLayerInfo[];
  slots: SlotInfo[];
  parts: PartInfo[];
  shadowSummary: string;
}

export interface PageInspection {
  timestamp: string;
  themeMode: string;
  componentCount: number;
  components: ComponentInspection[];
}
