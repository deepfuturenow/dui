/**
 * Scratch consumer app for the eject spike.
 *
 * This is what an app that ran `dui add --eject select` would look like: it
 * imports its *own* `select.ts` (under `src/components/dui/`) and never touches
 * `@dui/components/select`.
 *
 * `?impl=library` swaps in the library's styled select instead, so the same
 * markup can be screenshotted under both implementations and diffed. Both
 * register the tag `dui-select`, so only one may be loaded per page — which is
 * itself the Step 3 finding.
 */
import type { SelectOption } from "@dui/primitives/select";
import externalCompactCss from "./external-compact.css" with { type: "text" };

const impl = new URLSearchParams(location.search).get("impl") === "library"
  ? "library"
  : "ejected";

if (impl === "library") {
  await import("@dui/components/select");
  // The library's styled select does NOT import these, even though its
  // primitive renders both by tag name. Import them here so the comparison is
  // fair — without them the chevron renders un-upgraded and the diff below is
  // not measuring the CSS. See FINDINGS "Leakage".
  await import("@dui/components/icon");
  await import("@dui/components/scroll-area");
} else {
  await import("./components/dui/select.ts");
}

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

/** Fill every `<dui-select>` on the page with options. */
function hydrate(): void {
  for (const el of document.querySelectorAll("dui-select")) {
    const set = el.getAttribute("data-options") === "many" ? many : fruits;
    (el as HTMLElement & { options: SelectOption[] }).options = set;
  }
}

/**
 * Step 3 experiment — the tag-name collision, measured rather than assumed.
 *
 * The ejected class registers as `dui-select`, the same tag the library's
 * styled select claims at module scope. Pull the library module in afterwards
 * (as any transitive `@dui/components` import would) and report exactly what
 * the browser does, and which class ends up owning the tag.
 */
async function probeDoubleRegistration(): Promise<void> {
  const out = document.querySelector("#collision");
  if (!out) return;

  const registered = customElements.get("dui-select");
  const ejected = (await import("./components/dui/select.ts")).DuiSelect;

  let result: string;
  let sideEffectsRan = false;
  try {
    const mod = await import("@dui/components/select");
    sideEffectsRan = mod.DuiSelect != null;
    result = "no error thrown";
  } catch (error) {
    result = `${(error as Error).constructor.name}: ${
      (error as Error).message
    }`;
  }

  const after = customElements.get("dui-select");
  out.textContent = [
    `page loaded with impl=${impl}`,
    `tag "dui-select" owned by the ejected class before the import: ${
      registered === ejected
    }`,
    `import("@dui/components/select") -> ${result}`,
    `library module finished evaluating: ${sideEffectsRan}`,
    `tag "dui-select" still owned by the ejected class after: ${
      after === ejected
    }`,
  ].join("\n");
}

/**
 * The library-side half of the side-by-side. With `?impl=library`, apply the
 * external stylesheet a consuming app would write today and re-point the
 * `size="compact"` demos at it, so the two code paths can be screenshotted
 * under identical markup and diffed.
 */
function applyExternalCompact(): void {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(externalCompactCss);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  for (const el of document.querySelectorAll('dui-select[size="compact"]')) {
    el.setAttribute("data-density", "compact");
  }
}

hydrate();
if (impl === "library") applyExternalCompact();
if (impl === "ejected") queueMicrotask(() => void probeDoubleRegistration());
