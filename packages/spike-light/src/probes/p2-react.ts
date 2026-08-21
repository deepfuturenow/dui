/**
 * P2, React 18 half: the dialog family rendered and re-rendered by React,
 * with a conditional child and a reordering list inside the body.
 */
// deno-lint-ignore-file no-explicit-any
// @ts-nocheck: react has no types in this workspace; a probe, not shipped code.
import { createElement as h, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../components/dialog.ts";

function App() {
  const [tick, setTick] = useState(0);
  const [order, setOrder] = useState([1, 2, 3, 4, 5]);
  useEffect(() => {
    (window as any).__react = {
      rerender: () => setTick((t) => t + 1),
      shuffle: () => setOrder((o) => [...o.slice(1), o[0]]),
    };
  }, []);
  return h(
    "bui-dialog",
    { id: "react-dialog", "data-tick": tick },
    h("bui-dialog-header", null, h("h2", null, "React parent")),
    h(
      "bui-dialog-body",
      null,
      tick % 2 === 0 ? h("div", { id: "r-cond" }, "even") : null,
      h("ul", { id: "r-list" }, order.map((n) => h("li", { key: n, "data-n": n }, `item ${n}`))),
      h("input", { id: "r-input", defaultValue: "focus" }),
    ),
    h("bui-dialog-close", null),
  );
}

createRoot(document.getElementById("react-mount")!).render(h(App));
