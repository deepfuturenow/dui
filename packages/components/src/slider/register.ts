import { DuiSlider } from "./slider.ts";

if (!customElements.get(DuiSlider.tagName)) {
  customElements.define(DuiSlider.tagName, DuiSlider);
}
