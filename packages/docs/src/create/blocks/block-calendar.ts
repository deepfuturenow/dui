import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
];

@customElement("block-calendar")
export class BlockCalendar extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .title {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .subtitle {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
    }

    .layout {
      display: flex;
      gap: var(--space-4, 1rem);
    }

    dui-calendar {
      flex: 1;
      min-width: 0;
    }

    .slots {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--space-2, 0.5rem);
      min-width: 100px;
    }

    .slots dui-button {
      width: 100%;
    }
  `;

  override render() {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return html`
      <p class="title">Schedule</p>
      <p class="subtitle">Pick a date and time for your meeting</p>
      <div class="layout">
        <dui-calendar default-value="${iso}"></dui-calendar>
        <div class="slots">
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
