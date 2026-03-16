import { DuiLink } from "./index.ts";

if (!customElements.get(DuiLink.tagName)) {
  customElements.define(DuiLink.tagName, DuiLink);
}
