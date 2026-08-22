/**
 * WebKit smoke of P1/P4/P7 via raw W3C WebDriver against WebKitGTK.
 *
 * Why this exists: the remote environment's network policy blocks every
 * Firefox delivery route and Playwright's browser CDN, but WebKitGTK +
 * webkit2gtk-driver install from the Ubuntu archive. This drives Epiphany
 * (WebKitGTK engine) through WebKitWebDriver with plain fetch — no client
 * library — and re-asserts the load-bearing Phase 0 claims in WebKit.
 *
 * Prereqs (Ubuntu): apt install webkit2gtk-driver epiphany-browser xvfb
 * Run: node webkit-smoke.mjs            (docs server on :4040,
 *      WebKitWebDriver on :4444 under xvfb-run)
 *
 * Scope: feature support, P1 parity geometry + boundary + Esc/backdrop,
 * P4 select positioning per context (rel popup-vs-trigger, DUI vs BUI),
 * tooltip hover via synthetic pointer events (best effort, recorded either
 * way), P7 tabs geometry before/after selection. Same-browser DUI-vs-BUI
 * comparisons only — cross-engine pixel diffs are meaningless.
 */

const DRIVER = "http://127.0.0.1:4444";
const BASE = "http://127.0.0.1:4040";

async function wd(method, path, body) {
  const res = await fetch(DRIVER + path, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${path}: ${JSON.stringify(json).slice(0, 300)}`);
  return json.value;
}

const session = await wd("POST", "/session", {
  capabilities: {
    alwaysMatch: {
      browserName: "MiniBrowser",
      "webkitgtk:browserOptions": {
        binary: "/usr/lib/x86_64-linux-gnu/webkit2gtk-4.1/MiniBrowser",
        args: ["--automation"],
      },
    },
  },
});
const sid = session.sessionId;
const S = `/session/${sid}`;

const go = (url) => wd("POST", `${S}/url`, { url });
const js = (script, ...args) =>
  wd("POST", `${S}/execute/sync`, { script, args });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Press a key (real input, so the platform sees it — needed for Esc). */
const key = (value) =>
  wd("POST", `${S}/actions`, {
    actions: [{
      type: "key",
      id: "kb",
      actions: [
        { type: "keyDown", value },
        { type: "keyUp", value },
      ],
    }],
  });

/** Real pointer click at viewport coordinates (for backdrop dismiss). */
const clickAt = (x, y) =>
  wd("POST", `${S}/actions`, {
    actions: [{
      type: "pointer",
      id: "mouse",
      parameters: { pointerType: "mouse" },
      actions: [
        { type: "pointerMove", duration: 0, x: Math.round(x), y: Math.round(y) },
        { type: "pointerDown", button: 0 },
        { type: "pointerUp", button: 0 },
      ],
    }],
  });

const out = [];
const log = (line) => {
  out.push(line);
  console.log(line);
};

// ---- 0. engine + feature support -------------------------------------------
await go(`${BASE}/bui-p1.html`);
await sleep(1500);
const features = await js(`
  const d = document.createElement("div");
  return {
    ua: navigator.userAgent,
    popover: "showPopover" in d,
    scopeRule: typeof CSSScopeRule !== "undefined",
    startingStyle: typeof CSSStartingStyleRule !== "undefined",
    adoptedSheets: "adoptedStyleSheets" in document,
    layerRule: typeof CSSLayerBlockRule !== "undefined",
    elementInternals: "attachInternals" in HTMLElement.prototype,
    oklch: CSS.supports("color", "oklch(0.5 0.1 200)"),
    textBox: CSS.supports("text-box", "trim-both cap alphabetic"),
    anchorCenter: CSS.supports("position-area", "center"),
  };`);
log("features: " + JSON.stringify(features));

// ---- 1. P1: parity geometry, boundary, behavior ----------------------------
{
  // geometry parity: dui shadow popup vs bui parity twin, same browser
  await go(`${BASE}/bui-p1.html?open=dui`);
  await sleep(1200);
  const duiBox = await js(`
    const r = document.querySelector("dui-dialog-popup").shadowRoot
      .querySelector('[part="popup"]').getBoundingClientRect();
    return { w: r.width, h: r.height };`);
  await go(`${BASE}/bui-p1.html?open=bui-parity`);
  await sleep(1200);
  const buiBox = await js(`
    const r = document.querySelector("#bui-parity").getBoundingClientRect();
    return { w: r.w ?? r.width, h: r.height };`);
  const dw = Math.abs(duiBox.w - buiBox.w), dh = Math.abs(duiBox.h - buiBox.h);
  log(`P1 geometry parity: dui ${duiBox.w}x${duiBox.h} bui ${buiBox.w}x${buiBox.h} -> ${
    dw <= 1 && dh <= 1 ? "MATCH" : "DIFFER"
  }`);

  // boundary: title weight is BUI's under layered preflight; consumer h2 untouched by BUI
  await go(`${BASE}/bui-p1.html?open=bui&css=none`);
  await sleep(1000);
  const none = await js(`
    const cs = (sel) => getComputedStyle(document.querySelector(sel));
    return {
      titleWeight: cs('[data-probe="bui-title"]').fontWeight,
      contentH2Size: cs('[data-probe="content-h2"]').fontSize,
      contentH2Weight: cs('[data-probe="content-h2"]').fontWeight,
    };`);
  await go(`${BASE}/bui-p1.html?open=bui&css=preflight-layered`);
  await sleep(1000);
  const layered = await js(`
    return { titleWeight: getComputedStyle(document.querySelector('[data-probe="bui-title"]')).fontWeight };`);
  await go(`${BASE}/bui-p1.html?open=bui&css=hostile`);
  await sleep(1000);
  const hostile = await js(`
    const cs = (sel) => getComputedStyle(document.querySelector(sel));
    return {
      titleColor: cs('[data-probe="bui-title"]').color,
      bodyBg: cs('[data-probe="bui-body"]').backgroundColor,
    };`);
  log(`P1 boundary: css=none title-weight=${none.titleWeight} (expect 600), ` +
    `consumer h2 ${none.contentH2Size}/${none.contentH2Weight} (expect UA 24px/700 — BUI must not touch it)`);
  log(`P1 boundary: preflight-LAYERED title-weight=${layered.titleWeight} (expect 600 — layered page reset must lose)`);
  log(`P1 boundary: hostile title-color=${hostile.titleColor} bodyBg=${hostile.bodyBg} ` +
    `(expect red / purple — unlayered page rules must win)`);

  // behavior: open state, Esc (real key), backdrop click (real pointer)
  await go(`${BASE}/bui-p1.html?open=bui`);
  await sleep(1000);
  const isOpen = () =>
    js(`return document.querySelector("bui-dialog.popup").matches(":popover-open");`);
  const open1 = await isOpen();
  await key(""); // Escape
  await sleep(400);
  const afterEsc = await isOpen();
  await js(`document.querySelector("bui-dialog.popup").show();`);
  await sleep(500);
  await clickAt(20, 700);
  await sleep(400);
  const afterBackdrop = await isOpen();
  log(`P1 behavior: open=${open1} afterEsc=${afterEsc} afterBackdropClick=${afterBackdrop} ` +
    `(expect true/false/false)`);
}

// ---- 2. P4: select positioning per context ---------------------------------
{
  await go(`${BASE}/bui-p4.html`);
  await sleep(1500);
  const contexts = ["plain", "transform", "overflow", "fixed", "contain"];
  for (const ctx of contexts) {
    const rel = await js(`
      const ctx = arguments[0];
      const round = (n) => Math.round(n * 100) / 100;
      // open DUI select via its shadow trigger, measure popup rel to trigger
      const d = document.getElementById("d-sel-" + ctx);
      const dTrig = d.shadowRoot.querySelector('[part="trigger"]');
      dTrig.click();
      const dPop = d.shadowRoot.querySelector('[part="popup"]');
      const dr = () => {
        const p = dPop.getBoundingClientRect(), t = dTrig.getBoundingClientRect();
        return { x: round(p.x - t.x), y: round(p.y - t.y), w: round(p.width), h: round(p.height) };
      };
      return new Promise((resolve) => setTimeout(() => {
        const dui = dr();
        dPop.hidePopover?.();
        // open BUI select
        const b = document.getElementById("b-sel-" + ctx);
        const bTrig = b.querySelector("bui-select-trigger button");
        bTrig.click();
        const bPop = b.querySelector("bui-select-popup");
        setTimeout(() => {
          const p = bPop.getBoundingClientRect(), t = bTrig.getBoundingClientRect();
          const bui = { x: round(p.x - t.x), y: round(p.y - t.y), w: round(p.width), h: round(p.height) };
          bPop.hidePopover?.();
          resolve({ dui, bui });
        }, 450);
      }, 450));`, ctx);
    const d = rel.dui, b = rel.bui;
    const ok = ["x", "y", "w", "h"].every((k) => Math.abs(d[k] - b[k]) <= 1);
    log(`P4 select ${ctx.padEnd(9)} dui rel(${d.x},${d.y}) ${d.w}x${d.h} | bui rel(${b.x},${b.y}) ${b.w}x${b.h} | ${
      ok ? "MATCH" : "DIFFER"
    }`);
  }

  // tooltips: REAL pointer hover via WebDriver Actions (production input path)
  for (const [label, sel] of [["dui", "#d-tip-plain"], ["bui", "#b-tip-plain"]]) {
    const pos = await js(`
      const el = document.querySelector(arguments[0] + " button");
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };`, sel);
    await wd("POST", `${S}/actions`, {
      actions: [{
        type: "pointer",
        id: "mouse",
        parameters: { pointerType: "mouse" },
        actions: [{ type: "pointerMove", duration: 50, x: Math.round(pos.x), y: Math.round(pos.y) }],
      }],
    });
    await sleep(700);
    const gap = await js(`
      const root = document.querySelector(arguments[0]);
      const trig = root.querySelector("button");
      let pop = root.querySelector("bui-tooltip-content");
      if (!pop) {
        // DUI's shadow surface is class-named .Popup (no part attribute)
        pop = root.querySelector("dui-tooltip-popup")?.shadowRoot
          ?.querySelector(".Popup") ?? null;
      }
      if (!pop) return null;
      const p = pop.getBoundingClientRect(), t = trig.getBoundingClientRect();
      if (p.width === 0) return null;
      const round = (n) => Math.round(n * 100) / 100;
      return round(Math.min(Math.abs(t.y - p.bottom), Math.abs(p.y - t.bottom)));`, sel);
    log(`P4 tooltip ${label} (real hover): gap=${gap} (expect 6)`);
    await wd("POST", `${S}/actions`, {
      actions: [{
        type: "pointer",
        id: "mouse",
        parameters: { pointerType: "mouse" },
        actions: [{ type: "pointerMove", duration: 50, x: 5, y: 5 }],
      }],
    });
    await sleep(400);
  }
}

// ---- 3. P7: tabs geometry before/after selection ---------------------------
{
  await go(`${BASE}/bui-p7.html`);
  await sleep(1500);
  const cmp = async (label) => {
    const r = await js(`
      const a = window.__p7.measure("#d-h"), b = window.__p7.measure("#b-h");
      const bad = [];
      for (const k of Object.keys(a)) {
        const ra = a[k], rb = b[k];
        if (!rb) { bad.push(k + ":missing"); continue; }
        for (const dim of ["x","y","w","h"]) {
          if (Math.abs(ra[dim] - rb[dim]) > 1) { bad.push(k + "." + dim + ":" + ra[dim] + "vs" + rb[dim]); }
        }
      }
      return bad;`);
    log(`P7 ${label}: ${r.length === 0 ? "MATCH (all parts within 1px)" : "DIFFER " + r.join(" ")}`);
  };
  await cmp("initial");
  await js(`window.__p7.clickTab("#d-h", "password"); window.__p7.clickTab("#b-h", "password");`);
  await sleep(700);
  await cmp("after select");
}

await wd("DELETE", S);

// persist alongside the other evidence when run from the repo
import { writeFileSync } from "node:fs";
try {
  writeFileSync(
    new URL("../evidence/webkit-smoke-output.txt", import.meta.url),
    out.join("\n") + "\n",
  );
} catch { /* running outside the repo: console output is the record */ }
