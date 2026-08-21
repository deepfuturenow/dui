/**
 * Scratch app (exit checklist): consume the P1 dialog and the P4 select the
 * way a real application would — own markup, own styles, own wiring. The
 * point is to feel the call-site ergonomics and record what to change.
 * Friction found here is recorded in FINDINGS.md, not fixed here.
 */
import "../src/components/dialog.ts";
import "../src/components/select.ts";
import "../src/components/button.ts";

// FRICTION(types): nothing augments HTMLElementTagNameMap, so every lookup
// needs a structural cast to reach show()/close()/value.
const dialog = document.getElementById("confirm-dialog") as HTMLElement & {
  show(): void;
  close(): void;
};
const envSelect = document.getElementById("env") as HTMLElement & {
  value: string;
};
const status = document.getElementById("status")!;

// FRICTION(trigger): opening is imperative — find the button, find the
// dialog, addEventListener. There is no declarative trigger association.
document.getElementById("delete-btn")!.addEventListener(
  "click",
  () => dialog.show(),
);
document.getElementById("cancel-btn")!.addEventListener(
  "click",
  () => dialog.close(),
);
document.getElementById("confirm-btn")!.addEventListener("click", () => {
  dialog.close();
  status.textContent = `Deleted from ${envSelect.value}.`;
});

// FRICTION(events): value-change is an untyped CustomEvent — the consumer
// casts and dereferences .detail.value by convention.
envSelect.addEventListener("value-change", (e) => {
  const { value } = (e as CustomEvent<{ value: string }>).detail;
  status.textContent = `Environment: ${value}`;
});
