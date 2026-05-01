import { DuiSplitterPrimitive } from "@dui/primitives/splitter";
import "../_install.ts";

/**
 * `<dui-splitter>` — Resizable panel group.
 *
 * The root element is layout-only; all aesthetic styling lives on
 * `<dui-splitter-handle>` and (optionally) on each `<dui-splitter-panel>`'s
 * `::part(root)` content surface.
 */
export class DuiSplitter extends DuiSplitterPrimitive {}

customElements.define(DuiSplitter.tagName, DuiSplitter);
