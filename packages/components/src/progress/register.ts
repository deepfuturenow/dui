import { DuiProgress } from "./index.ts";

if (!customElements.get(DuiProgress.tagName)) {
  customElements.define(DuiProgress.tagName, DuiProgress);
}
