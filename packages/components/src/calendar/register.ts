import { DuiCalendar } from "./index.ts";

if (!customElements.get(DuiCalendar.tagName)) {
  customElements.define(DuiCalendar.tagName, DuiCalendar);
}
