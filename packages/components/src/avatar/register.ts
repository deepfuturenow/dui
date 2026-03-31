import { DuiAvatar } from "./index.ts";

if (!customElements.get(DuiAvatar.tagName)) {
  customElements.define(DuiAvatar.tagName, DuiAvatar);
}
