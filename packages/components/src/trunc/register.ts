import { DuiTrunc } from "./trunc.ts";

if (!customElements.get(DuiTrunc.tagName)) {
  customElements.define(DuiTrunc.tagName, DuiTrunc);
}
