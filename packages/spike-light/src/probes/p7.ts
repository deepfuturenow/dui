/**
 * P7 — CompoundController + tabs rebuild, BUI vs DUI parity.
 *
 * Twin tabs (horizontal + vertical, one disabled tab each) with identical
 * content. The runner compares part geometry relative to each family's root,
 * clip-screenshots both roots for a pixel diff, drives selection on both, and
 * exercises the BUI roving-focus keyboard model that the DUI primitive lacks.
 */
import "../components/tabs.ts";
import "@dui/components/tabs";

const TABS = [
  { value: "account", label: "Account", disabled: false },
  { value: "password", label: "Password", disabled: false },
  { value: "settings", label: "Settings", disabled: true },
  { value: "billing", label: "Billing", disabled: false },
];

const PANEL_TEXT: Record<string, string> = {
  account: "Make changes to your account here.",
  password: "Change your password here.",
  settings: "Settings are disabled in this probe.",
  billing: "Update your billing details here.",
};

function duiBlock(id: string, orientation: string): string {
  return `
    <dui-tabs id="${id}" default-value="account" orientation="${orientation}">
      <dui-tabs-list>
        ${
    TABS.map((t) =>
      `<dui-tab value="${t.value}"${
        t.disabled ? " disabled" : ""
      }>${t.label}</dui-tab>`
    ).join("")
  }
        <dui-tabs-indicator></dui-tabs-indicator>
      </dui-tabs-list>
      ${
    TABS.map((t) =>
      `<dui-tabs-panel value="${t.value}">${
        PANEL_TEXT[t.value]
      }</dui-tabs-panel>`
    ).join("")
  }
    </dui-tabs>`;
}

function buiBlock(id: string, orientation: string): string {
  return `
    <bui-tabs id="${id}" default-value="account" orientation="${orientation}">
      <bui-tabs-list>
        ${
    TABS.map((t) =>
      `<bui-tab value="${t.value}"${
        t.disabled ? " disabled" : ""
      }>${t.label}</bui-tab>`
    ).join("")
  }
        <bui-tabs-indicator></bui-tabs-indicator>
      </bui-tabs-list>
      ${
    TABS.map((t) =>
      `<bui-tabs-panel value="${t.value}">${
        PANEL_TEXT[t.value]
      }</bui-tabs-panel>`
    ).join("")
  }
    </bui-tabs>`;
}

document.getElementById("mount")!.innerHTML = `
  <section>
    <h2>horizontal</h2>
    <div class="pair">
      <div class="cell">${duiBlock("d-h", "horizontal")}</div>
      <div class="cell">${buiBlock("b-h", "horizontal")}</div>
    </div>
  </section>
  <section>
    <h2>vertical</h2>
    <div class="pair">
      <div class="cell">${duiBlock("d-v", "vertical")}</div>
      <div class="cell">${buiBlock("b-v", "vertical")}</div>
    </div>
  </section>
`;

// ---- Measurement API --------------------------------------------------------

type Rect = { x: number; y: number; w: number; h: number };

function rel(root: DOMRect, r: DOMRect): Rect {
  const f = (n: number) => Math.round(n * 100) / 100;
  return {
    x: f(r.x - root.x),
    y: f(r.y - root.y),
    w: f(r.width),
    h: f(r.height),
  };
}

/** Geometry of every part, relative to the family root. */
function measure(rootSel: string): Record<string, Rect> {
  const root = document.querySelector<HTMLElement>(rootSel)!;
  const rootRect = root.getBoundingClientRect();
  const out: Record<string, Rect> = {
    root: rel(rootRect, rootRect),
  };
  const prefix = rootSel.startsWith("#d-") ? "dui" : "bui";
  const list = root.querySelector<HTMLElement>(
    `${prefix}-tabs-list`,
  )!;
  out.list = rel(rootRect, list.getBoundingClientRect());
  root.querySelectorAll<HTMLElement>(`${prefix}-tab`).forEach((tab) => {
    out[`tab:${tab.getAttribute("value")}`] = rel(
      rootRect,
      tab.getBoundingClientRect(),
    );
  });
  const indicator = root.querySelector<HTMLElement>(
    `${prefix}-tabs-indicator`,
  )!;
  out.indicator = rel(rootRect, indicator.getBoundingClientRect());
  root.querySelectorAll<HTMLElement>(`${prefix}-tabs-panel`).forEach((p) => {
    // A hidden DUI panel host is display:block with zero height but full
    // width, so filter on BOTH dimensions to find the visible panel.
    const r = p.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) out.panel = rel(rootRect, r);
  });
  return out;
}

function rootRect(rootSel: string): Rect {
  const r = document.querySelector<HTMLElement>(rootSel)!
    .getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
}

/** Click a tab by value inside a family. */
function clickTab(rootSel: string, value: string): void {
  const prefix = rootSel.startsWith("#d-") ? "dui" : "bui";
  const tab = document.querySelector<HTMLElement>(
    `${rootSel} ${prefix}-tab[value="${value}"]`,
  )!;
  if (prefix === "dui") {
    tab.shadowRoot!.querySelector<HTMLElement>("button")!.click();
  } else {
    tab.click();
  }
}

declare global {
  interface Window {
    __p7: {
      measure: typeof measure;
      rootRect: typeof rootRect;
      clickTab: typeof clickTab;
    };
  }
}

window.__p7 = { measure, rootRect, clickTab };
