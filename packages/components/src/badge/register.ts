import { DuiBadge } from "./index.ts";

if (!customElements.get(DuiBadge.tagName)) {
  customElements.define(DuiBadge.tagName, DuiBadge);
}
