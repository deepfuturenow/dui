/**
 * P5 step 2 — EXPECTED TO FAIL deno check. Kept outside the workspace check
 * (experiments/ is excluded) and checked explicitly by the probe runner.
 *
 * The reference-file convention annotates each spread site with the bag it
 * expects. This file spreads the LISTBOX/popup bag on the trigger position.
 */
import { html } from "lit-html";
import { spread } from "../src/core/spread.ts";
import type { SelectController, SelectTriggerBag } from "../src/controllers/select.ts";

export function renderTrigger(c: SelectController) {
  return html`<button ${spread<SelectTriggerBag>(c.popupProps)}>…</button>`;
}
