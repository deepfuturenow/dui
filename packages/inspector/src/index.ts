/**
 * Full DUI Inspector — headless API + visual UI.
 *
 * Import this entry point for the complete inspector experience:
 *   import "@dui/inspector";
 *
 * Or import just the API for agent-only use:
 *   import "@dui/inspector/api";
 */

import "./api.ts";
import "./ui/inspector-view.ts";

// Mount the visual inspector
const inspector = document.createElement("dui-inspector");
document.body.appendChild(inspector);

export { init } from "./api.ts";
export type {
  ComponentInspection,
  PageInspection,
  CatalogEntry,
  PropertySchema,
  MutationResult,
  ChangelogEntry,
  SourceMapConfig,
  SourceChange,
} from "./lib/types.ts";
