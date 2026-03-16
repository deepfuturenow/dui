import { DuiSpinner } from "./spinner.ts";

if (!customElements.get(DuiSpinner.tagName)) {
  customElements.define(DuiSpinner.tagName, DuiSpinner);
}
