import { LitElement, html, css } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
];

@customElement("block-calendar")
export class BlockCalendar extends LitElement {
  static override styles = [blockBase, css`
    :host {
      padding: var(--space-6);
      container-type: inline-size;
    }

    .title {
      font-size: var(--font-size-base);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
    }

    /* Stacked layout (default / narrow) */
    .layout {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    dui-calendar {
      width: 100%;
    }

    .slots {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .slots-header {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-2);
      text-align: center;
      margin: 0 0 var(--space-1);
      display: none;
    }

    .slots dui-button {
      display: block;
      --button-width: 100%;
    }

    /* Side-by-side layout when container is wide enough */
    @container (min-width: 420px) {
      .layout {
        flex-direction: row;
        gap: var(--space-6);
      }

      dui-calendar {
        flex: 1;
        width: auto;
      }

      .slots {
        justify-content: center;
        flex: 0 0 auto;
        min-width: 100px;
      }

      .slots-header {
        display: block;
      }
    }
  `];

  override render() {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return html`
      <p class="title">Schedule</p>
      <p class="subtitle">Pick a date and time for your meeting</p>
      <div class="layout">
        <dui-calendar default-value="${iso}"></dui-calendar>
        <div class="slots">
          <p class="slots-header">Time</p>
          ${TIME_SLOTS.map(
            (t) => html`
              <dui-button appearance="outline" size="sm">${t}</dui-button>
            `,
          )}
        </div>
      </div>
    `;
  }
}
