/**
 * Regression + reachability probe for the "adjustable value declared on an inner
 * element" bug (FINDINGS section: why you can't resize the dropdown arrow).
 *
 * Left column: each affected component, untouched. Screenshot before and after
 * the fix; they must be pixel-identical.
 * Right column: the same components with a consumer override applied from
 * outside. Before the fix these look identical to the left column, because the
 * override cannot reach. After the fix they must differ.
 */
import "@dui/components/select";
import "@dui/components/combobox";
import "@dui/components/breadcrumb";
import "@dui/components/command";
import "@dui/components/icon";
import "@dui/components/scroll-area";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

for (const el of document.querySelectorAll("dui-select, dui-combobox")) {
  (el as HTMLElement & { options: typeof options }).options = options;
}
