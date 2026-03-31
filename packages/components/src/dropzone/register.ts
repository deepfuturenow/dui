import { DuiDropzone } from "./index.ts";

if (!customElements.get(DuiDropzone.tagName)) {
  customElements.define(DuiDropzone.tagName, DuiDropzone);
}
