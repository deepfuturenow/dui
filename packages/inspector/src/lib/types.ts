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

export interface EventInfo {
  name: string;
  /** How the listener was attached: 'attribute' | 'addEventListener' | 'dispatches' */
  source: string;
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
  /** Queryable selector — use with __dui_inspect() and __dui_mutate.*() */
  selector: string;
  /** Human-readable path showing component hierarchy */
  path: string;
  events: EventInfo[];
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
  catalog: CatalogEntry[];
}

export interface CatalogEntry {
  tagName: string;
  properties: PropertySchema[];
  slots: string[];
  parts: string[];
}

export interface PropertySchema {
  name: string;
  type: string;
  default: unknown;
  reflect: boolean;
  attribute: string | false;
}

// --- Mutation types ---

export type InsertPosition = "beforebegin" | "afterbegin" | "beforeend" | "afterend";

export interface MutationResult {
  ok: boolean;
  error?: string;
  selector: string;
  inspection: ComponentInspection;
}

export interface ChangelogEntry {
  id: number;
  timestamp: string;
  action: string;
  target: string;
  params: Record<string, unknown>;
  undoable: boolean;
  /** Undo function — stored at runtime, not serialized. */
  _undo?: () => void;
}

// --- Source map types ---

export interface SourceMapConfig {
  components?: Record<string, string>;
  tokens?: string;
  themeStyles?: Record<string, string>;
  page?: string;
}

export interface SourceChange {
  file: string;
  changeType: "prop" | "token" | "theme-style" | "template";
  description: string;
  tokenName?: string;
  tokenValue?: string;
  selector?: string;
  propName?: string;
  propValue?: unknown;
  html?: string;
}
