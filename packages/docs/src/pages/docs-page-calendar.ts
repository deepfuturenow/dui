import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("docs-page-calendar")
export class DocsPageCalendar extends LitElement {
  protected override createRenderRoot() { return this; }

  @state()
  accessor #selectedDate = "";

  #onValueChange = (e: CustomEvent<{ value: string }>) => {
    this.#selectedDate = e.detail.value;
  };

  override render() {

    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Min/max for bounded demo: this month only
    const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

    return html`
      <docs-page-layout tag="dui-calendar">
        <dui-docs-demo label="Default">
        <dui-calendar @value-change="${this.#onValueChange}"></dui-calendar>
        ${this.#selectedDate
          ? html`<p style="margin-top: var(--space-2); font-size: var(--font-size-sm); color: var(--text-2);">
              Selected: ${this.#selectedDate}
            </p>`
          : ""}
      </dui-docs-demo>

      <dui-docs-demo label="Pre-selected Date">
        <dui-calendar default-value="${todayIso}"></dui-calendar>
      </dui-docs-demo>

      <dui-docs-demo label="With Min/Max (This Month Only)">
        <dui-calendar min="${minDate}" max="${maxDate}"></dui-calendar>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-calendar disabled default-value="${todayIso}"></dui-calendar>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
