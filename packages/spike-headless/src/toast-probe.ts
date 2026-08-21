/** Step 4: does the headless toast actually work? */
import "./components/dui/toast.ts";
import { toast, toastStore } from "./toast-store.ts";

const $ = (id: string) => document.getElementById(id)!;

$("plain").addEventListener("click", () => toast("File saved"));
$("desc").addEventListener(
  "click",
  () => toast("Deploy finished", { description: "3 services updated in 42s." }),
);
$("success").addEventListener("click", () => toast.success("Payment received"));
$("error").addEventListener(
  "click",
  () =>
    toast.error("Upload failed", {
      description: "Connection reset.",
      closeButton: true,
    }),
);
$("action").addEventListener("click", () =>
  toast("Message archived", {
    action: { label: "Undo", onClick: () => toast.success("Restored") },
  }));
$("sticky").addEventListener(
  "click",
  () => toast.info("This one stays", { duration: 0, closeButton: true }),
);
$("burst").addEventListener("click", () => {
  for (let i = 1; i <= 5; i++) toast(`Notification ${i}`, { duration: 8000 });
});
$("clear").addEventListener("click", () => toast.clear());

// Live count, so auto-dismiss is observable without watching pixels.
const count = $("count");
toastStore.subscribe(() => {
  count.textContent = `${toastStore.records.length} in queue`;
});
