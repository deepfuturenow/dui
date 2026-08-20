/**
 * Demo app for the headless-controller spike.
 *
 * Renders `<dui-select>` (library, unchanged) and `<dui-select-h>` (owned,
 * built on SelectController) from identical markup so the two can be
 * screenshotted and pixel-diffed. Different tag names, so both coexist.
 */
import "@dui/components/select";
import "@dui/components/icon";
import "@dui/components/scroll-area";
import "@dui/components/tabs";
import "./components/dui/select.ts";
import "./components/dui/tabs.ts";

import type { SelectOption } from "./select-controller.ts";

const fruits: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragonfruit", value: "dragonfruit" },
  { label: "Elderberry", value: "elderberry" },
];

const many: SelectOption[] = [
  ...fruits,
  { label: "Fig", value: "fig" },
  { label: "Grape", value: "grape" },
  { label: "Honeydew", value: "honeydew" },
  { label: "Kiwi", value: "kiwi" },
  { label: "Lemon", value: "lemon" },
  { label: "Mango", value: "mango" },
  { label: "Nectarine", value: "nectarine" },
  { label: "Orange", value: "orange" },
  { label: "Papaya", value: "papaya" },
  { label: "Quince", value: "quince" },
];

const disabledSet: SelectOption[] = [
  { label: "Option A", value: "a" },
  { label: "Option B (disabled)", value: "b", disabled: true },
  { label: "Option C", value: "c" },
];

for (const el of document.querySelectorAll("dui-select, dui-select-h")) {
  const which = el.getAttribute("data-options");
  const set = which === "many"
    ? many
    : which === "disabled"
    ? disabledSet
    : fruits;
  (el as HTMLElement & { options: SelectOption[] }).options = set;
}

// Surface value changes so keyboard behaviour is observable from the page.
for (const el of document.querySelectorAll("dui-select, dui-select-h")) {
  el.addEventListener("value-change", (event) => {
    const out = document.querySelector("#events");
    if (!out) return;
    const detail = (event as CustomEvent<{ value: string }>).detail;
    out.textContent = `${el.tagName.toLowerCase()} -> ${detail.value}`;
  });
}
