/**
 * Step 3: does dropping shadow DOM improve the owned-file model?
 *
 * Renders the library select, the shadow-DOM owned select, and the light-DOM
 * owned select from identical markup so all three can be pixel-diffed.
 */
import "@dui/components/select";
import "@dui/components/icon";
import "@dui/components/scroll-area";
import "./components/dui/select.ts";
import "./components/dui/select-light.ts";

import type { SelectOption } from "./select-controller.ts";

const fruits: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragonfruit", value: "dragonfruit" },
  { label: "Elderberry", value: "elderberry" },
];

for (
  const el of document.querySelectorAll(
    "dui-select, dui-select-h, dui-select-l",
  )
) {
  (el as HTMLElement & { options: SelectOption[] }).options = fruits;
}
