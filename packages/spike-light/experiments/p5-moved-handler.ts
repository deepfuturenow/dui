/**
 * P5 step 4 — EXPECTED TO COMPILE CLEANLY, documenting the residual risk:
 * the brand types a bag's NAME, not its CONTENTS. A library refactor that
 * moves @keydown from the trigger bag to the popup bag produces two bags
 * whose types are unchanged, so every consumer file still type-checks while
 * the keyboard is dead. Only library-side behavior tests catch this class.
 */
import { markBag } from "../src/core/bags.ts";
import type { SelectPopupBag, SelectTriggerBag } from "../src/controllers/select.ts";

const onKeyDown = (_e: KeyboardEvent) => {};

// Before the "refactor": keydown on the trigger.
export const before: { trigger: SelectTriggerBag; popup: SelectPopupBag } = {
  trigger: markBag("select:trigger", { "@keydown": onKeyDown }, () => {}),
  popup: markBag("select:popup", {}, () => {}),
};

// After: keydown moved to the popup. Identical types. Compiles. Silent.
export const after: { trigger: SelectTriggerBag; popup: SelectPopupBag } = {
  trigger: markBag("select:trigger", {}, () => {}),
  popup: markBag("select:popup", { "@keydown": onKeyDown }, () => {}),
};
