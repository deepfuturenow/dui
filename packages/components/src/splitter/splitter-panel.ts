import { DuiSplitterPanelPrimitive } from "@dui/primitives/splitter";
import "../_install.ts";

/**
 * `<dui-splitter-panel>` — A single resizable panel.
 *
 * The host owns `flex-basis` (set inline by the parent splitter); consumers
 * paint content onto `::part(root)`. No default aesthetic styling — panels
 * are content surfaces and should adopt the surrounding application's look.
 */
export class DuiSplitterPanel extends DuiSplitterPanelPrimitive {}

customElements.define(DuiSplitterPanel.tagName, DuiSplitterPanel);
