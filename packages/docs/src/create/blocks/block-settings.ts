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

    .subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
    }

    .setting {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      padding: var(--space-3) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .setting:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .setting dui-switch,
    .setting dui-checkbox {
      flex-direction: row-reverse;
      justify-content: space-between;
    }

    .setting-label {
      font-weight: 500;
    }

    .setting-desc {
      font-size: var(--font-size-xs);
      color: var(--text-2);
      margin: 0;
      line-height: 1.4;
    }

    /* ── Radio group ── */

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      padding: var(--space-3) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .radio-group-label {
      font-size: var(--font-size-sm);
      font-weight: 500;
      margin: 0 0 var(--space-1);
    }

    /* ── Slider row ── */

    .slider-row {
      padding: var(--space-3) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .slider-label {
      font-size: var(--font-size-sm);
      font-weight: 500;
      margin: 0;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .slider-value {
      font-size: var(--font-size-xs);
      color: var(--text-2);
      font-family: var(--font-mono);
    }

    /* ── Progress ── */

    .progress-row {
      padding: var(--space-3) 0;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }
  `];

  override render() {
    return html`
      <p class="title">Flight Settings</p>

      <div class="setting">
        <dui-switch default-checked><span class="setting-label">Obstacle Avoidance</span></dui-switch>
        <p class="setting-desc">Use sensors to detect and avoid collisions</p>
      </div>

      <div class="setting">
        <dui-checkbox default-checked><span class="setting-label">GPS Logging</span></dui-checkbox>
        <p class="setting-desc checkbox-desc">Record flight path coordinates for review</p>
      </div>

      <div class="radio-group">
        <p class="radio-group-label">Flight Mode</p>
        <dui-radio-group default-value="standard">
          <dui-radio value="beginner">Beginner — limited speed and altitude</dui-radio>
          <dui-radio value="standard">Standard — balanced controls</dui-radio>
          <dui-radio value="sport">Sport — maximum responsiveness</dui-radio>
        </dui-radio-group>
      </div>

      <div class="slider-row">
        <div class="slider-header">
          <p class="slider-label">Max Altitude</p>
          <span class="slider-value">120 m</span>
        </div>
        <dui-slider value="260" min="30" max="400"></dui-slider>
      </div>
    `;
  }
}
