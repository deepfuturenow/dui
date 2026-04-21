import { LitElement, html, css } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

@customElement("block-settings")
export class BlockSettings extends LitElement {
  static override styles = [blockBase, css`
    :host {
      padding: var(--space-6);
    }

    .title {
      font-size: var(--font-size-base);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    /* ── Separator borders between items ── */

    dui-field, dui-fieldset {
      padding: var(--space-3) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    dui-field:last-child, dui-fieldset:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    /* ── Toggle / checkbox: label left, control right ── */

    dui-field dui-switch,
    dui-field dui-checkbox {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      font-weight: var(--font-weight-medium);
    }
  `];

  override render() {
    return html`
      <p class="title">Flight Settings</p>

      <dui-field>
        <dui-switch default-checked>Obstacle Avoidance</dui-switch>
        <span slot="description">Use sensors to detect and avoid collisions</span>
      </dui-field>

      <dui-field>
        <dui-checkbox default-checked>GPS Logging</dui-checkbox>
        <span slot="description">Record flight path coordinates for review</span>
      </dui-field>

      <dui-fieldset>
        <span slot="legend">Flight Mode</span>
        <dui-radio-group default-value="standard">
          <dui-radio value="beginner">Beginner — limited speed and altitude</dui-radio>
          <dui-radio value="standard">Standard — balanced controls</dui-radio>
          <dui-radio value="sport">Sport — maximum responsiveness</dui-radio>
        </dui-radio-group>
      </dui-fieldset>

      <dui-field>
        <span slot="label">Max Altitude</span>
        <dui-slider value="260" min="30" max="400"></dui-slider>
      </dui-field>
    `;
  }
}
