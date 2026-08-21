/**
 * P4 — floating positioning and top layer, BUI vs DUI, in hostile ancestors.
 *
 * Contexts: plain, transform, overflow:hidden, inside the P1 dialog,
 * position:fixed toolbar, contain:layout. Each context holds a DUI select,
 * a BUI select, a DUI tooltip, and a BUI tooltip. The runner opens each and
 * compares the popup's offset RELATIVE TO ITS OWN TRIGGER across
 * implementations, which cancels the different page positions out.
 */
import "../components/select.ts";
import "../components/tooltip.ts";
import "../components/dialog.ts";
import "@dui/components/select";
import "@dui/components/tooltip";
import "@dui/components/dialog";
import "@dui/components/button";
import "@dui/components/icon";
import "@dui/components/scroll-area";

const FRUITS = [
  "Apple",
  "Banana",
  "Cherry",
  "Dragonfruit",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Nectarine",
  "Orange",
  "Papaya",
  "Quince",
];
const VALUE = "mango"; // mid-list: exercises align-inner scroll compensation

const CONTEXTS: Record<string, string> = {
  plain: "",
  transform: "transform: translate(6px, 3px) scale(1);",
  overflow: "overflow: hidden; height: 120px;",
  fixed:
    "position: fixed; bottom: 8px; right: 8px; z-index: 5; background: var(--background);",
  contain: "contain: layout;",
};

function block(ctx: string): string {
  return `
    <div class="ctx" id="ctx-${ctx}" style="${CONTEXTS[ctx]}">
      <div class="row">
        <dui-select id="d-sel-${ctx}" value="${VALUE}"></dui-select>
        <bui-select id="b-sel-${ctx}" value="${VALUE}">
          <bui-select-trigger></bui-select-trigger>
          <bui-select-popup>
            ${
    FRUITS.map((f) =>
      `<bui-select-option value="${f.toLowerCase()}">${f}</bui-select-option>`
    ).join("")
  }
          </bui-select-popup>
        </bui-select>
        <dui-tooltip id="d-tip-${ctx}" delay="0">
          <dui-tooltip-trigger><button>d?</button></dui-tooltip-trigger>
          <dui-tooltip-popup>DUI tip ${ctx}</dui-tooltip-popup>
        </dui-tooltip>
        <bui-tooltip id="b-tip-${ctx}" delay="0">
          <bui-tooltip-trigger><button>b?</button></bui-tooltip-trigger>
          <bui-tooltip-content>BUI tip ${ctx}</bui-tooltip-content>
        </bui-tooltip>
      </div>
    </div>`;
}

const mount = document.getElementById("mount")!;
mount.innerHTML = Object.keys(CONTEXTS).map(block).join("\n");

// The dialog context gets real dialog wrappers.
mount.insertAdjacentHTML(
  "beforeend",
  `
  <dui-dialog id="d-dialog"><dui-dialog-popup width="26rem">
    <span slot="title">DUI dialog context</span>
    <dui-select id="d-sel-dialog" value="${VALUE}"></dui-select>
    <dui-tooltip id="d-tip-dialog" delay="0">
      <dui-tooltip-trigger><button>d?</button></dui-tooltip-trigger>
      <dui-tooltip-popup>DUI tip dialog</dui-tooltip-popup>
    </dui-tooltip>
  </dui-dialog-popup></dui-dialog>
  <bui-dialog id="b-dialog" style="--popup-width: 26rem">
    <bui-dialog-header><h2>BUI dialog context</h2></bui-dialog-header>
    <bui-dialog-body>
      <bui-select id="b-sel-dialog" value="${VALUE}">
        <bui-select-trigger></bui-select-trigger>
        <bui-select-popup>
          ${
    FRUITS.map((f) =>
      `<bui-select-option value="${f.toLowerCase()}">${f}</bui-select-option>`
    ).join("")
  }
        </bui-select-popup>
      </bui-select>
      <bui-tooltip id="b-tip-dialog" delay="0">
        <bui-tooltip-trigger><button>b?</button></bui-tooltip-trigger>
        <bui-tooltip-content>BUI tip dialog</bui-tooltip-content>
      </bui-tooltip>
    </bui-dialog-body>
  </bui-dialog>`,
);

// Give every DUI select its options.
const options = FRUITS.map((f) => ({ label: f, value: f.toLowerCase() }));
for (const el of document.querySelectorAll("dui-select")) {
  // deno-lint-ignore no-explicit-any
  (el as any).options = options;
}

declare global {
  // deno-lint-ignore no-explicit-any
  interface Window {
    __p4: any;
  }
}
window.__p4 = {
  openDialog(which: "d" | "b") {
    // deno-lint-ignore no-explicit-any
    const d = document.getElementById(`${which}-dialog`) as any;
    if (which === "d") d.open = true;
    else d.show();
  },
};
