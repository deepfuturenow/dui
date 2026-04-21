import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";

@customElement("block-settings")
export class BlockSettings extends LitElement {
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    /* Card */
    dui-card::part(root) {
      padding-bottom: var(--space-6);
    }

    /* ── Content sections use gap via flex column ── */

    .settings {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .settings > :not(:last-child) {
      padding-bottom: var(--space-5);
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    /* ── Toggle / checkbox rows ── */

    .setting {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .setting dui-switch,
    .setting dui-checkbox {
      flex-direction: row-reverse;
      justify-content: space-between;
    }

    .setting-label {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      text-box: trim-both cap alphabetic;
    }

    .setting-desc {
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
      color: var(--text-2);
      margin: 0;
      text-box: trim-both cap alphabetic;
    }

    /* ── Radio group ── */

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .radio-group-label {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      margin: 0;
      text-box: trim-both cap alphabetic;
    }

    /* ── Slider row ── */

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }

    .slider-label {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      margin: 0;
      text-box: trim-both cap alphabetic;
    }

    .slider-value {
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
      color: var(--text-2);
      font-family: var(--font-mono);
      text-box: trim-both cap alphabetic;
    }
  `];

  override render() {
    return html`
      <dui-card>
        <span slot="title">Flight Settings</span>

        <div class="settings">
          <div class="setting">
            <dui-switch default-checked><span class="setting-label">Obstacle Avoidance</span></dui-switch>
            <p class="setting-desc">Use sensors to detect and avoid collisions</p>
          </div>

          <div class="setting">
            <dui-checkbox default-checked><span class="setting-label">GPS Logging</span></dui-checkbox>
            <p class="setting-desc">Record flight path coordinates for review</p>
          </div>

          <div class="radio-group">
            <p class="radio-group-label">Flight Mode</p>
            <dui-radio-group default-value="standard">
              <dui-radio value="beginner">Beginner — limited speed and altitude</dui-radio>
              <dui-radio value="standard">Standard — balanced controls</dui-radio>
              <dui-radio value="sport">Sport — maximum responsiveness</dui-radio>
            </dui-radio-group>
          </div>

          <div>
            <div class="slider-header">
              <p class="slider-label">Max Altitude</p>
              <span class="slider-value">120 m</span>
            </div>
            <dui-slider value="260" min="30" max="400"></dui-slider>
          </div>
        </div>
      </dui-card>
    `;
  }
}
