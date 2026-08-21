/**
 * P1 — style boundary on a content-wrapping component.
 *
 * Renders the BUI dialog family with rich consumer content, DUI's dialog for
 * pixel parity, and three page-CSS conditions selected by ?css= :
 *   none       no page stylesheet
 *   preflight  Tailwind v4's real preflight.css, unlayered
 *   hostile    preflight + app reset + deliberately hostile element/class rules
 * ?open=dui|bui opens one dialog for screenshots.
 *
 * window.__p1.measure() returns computed styles for every [data-probe]
 * element so the runner can diff conditions.
 */
import "../components/dialog.ts";
import "../components/button.ts";
import "@dui/components/dialog";
import "@dui/components/button";
// Relative path into node_modules: deno's import map has no entry for a bare
// css specifier, and this is a throwaway probe.
import preflight from "../../../../node_modules/tailwindcss/preflight.css" with {
  type: "text",
};

const params = new URLSearchParams(location.search);
const cssMode = params.get("css") ?? "none";

const APP_RESET = `
  /* typical application reset */
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; }
  img, picture, video, canvas, svg { display: block; max-width: 100%; }
  input, button, textarea, select { font: inherit; }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
`;

const HOSTILE = `
  /* deliberately hostile element rules */
  h2 { color: red; margin: 3rem; }
  button { all: unset; }
  div > * { padding: 20px; }
  /* class rules at specificity (0,2,0) */
  .page .body { background: purple; padding: 40px; }
  .page .trigger { border: 5px dashed red; }
  .page .popup { transform: rotate(3deg); }
`;

if (cssMode === "preflight" || cssMode === "hostile") {
  const s = document.createElement("style");
  s.textContent = preflight;
  document.head.appendChild(s);
}
// Tailwind v4's REAL integration: preflight lives inside @layer base
// (`@layer theme, base, components, utilities`). The raw condition above is
// the degenerate copy-paste case.
if (cssMode === "preflight-layered") {
  const s = document.createElement("style");
  s.textContent = "@layer theme, base, components, utilities;\n@layer base {" +
    preflight + "}";
  document.head.appendChild(s);
}
if (cssMode === "hostile") {
  const s = document.createElement("style");
  s.textContent = APP_RESET + HOSTILE;
  document.head.appendChild(s);
}

// ---- wire the open buttons --------------------------------------------------

const bui = document.querySelector("bui-dialog.popup") as HTMLElement & {
  show(): void;
};
document.getElementById("open-bui")!.addEventListener(
  "click",
  () => bui.show(),
);

const duiRoot = document.querySelector("dui-dialog") as HTMLElement & {
  open: boolean | undefined;
};
document.getElementById("open-dui")!.addEventListener(
  "click",
  () => (duiRoot.open = true),
);

const parity = document.getElementById("bui-parity") as HTMLElement & {
  show(): void;
};
const auto = params.get("open");
requestAnimationFrame(() => {
  if (auto === "bui") bui.show();
  if (auto === "bui-parity") parity.show();
  if (auto === "dui") duiRoot.open = true;
});

// ---- measurement ------------------------------------------------------------

const PROPS = [
  "display",
  "position",
  "box-sizing",
  "margin-top",
  "margin-left",
  "padding-top",
  "padding-left",
  "padding-right",
  "padding-bottom",
  "background-color",
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "border-top-width",
  "border-top-style",
  "border-top-color",
  "border-radius",
  "outline-width",
  "outline-style",
  "transform",
  "opacity",
  "overflow-x",
  "overflow-y",
  "gap",
  "box-shadow",
  "appearance",
  "cursor",
];

type Snapshot = Record<string, Record<string, string>>;

function measure(): Snapshot {
  const out: Snapshot = {};
  for (const el of document.querySelectorAll<HTMLElement>("[data-probe]")) {
    const cs = getComputedStyle(el);
    const row: Record<string, string> = {};
    for (const p of PROPS) row[p] = cs.getPropertyValue(p);
    out[el.dataset.probe!] = row;
  }
  return out;
}

declare global {
  // deno-lint-ignore no-explicit-any
  interface Window {
    __p1: any;
  }
}
window.__p1 = { measure, cssMode };
