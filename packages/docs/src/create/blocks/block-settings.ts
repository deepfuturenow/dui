import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-settings")
export class BlockSettings extends LitElement {
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

    .setting {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-4, 1rem);
      padding: var(--space-3, 0.75rem) 0;
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
    }

    .setting:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .setting-text {
      flex: 1;
      min-width: 0;
    }

    .setting-label {
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      margin: 0 0 var(--space-1, 0.25rem);
    }

    .setting-desc {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
      margin: 0;
      line-height: 1.4;
    }

    .setting-control {
      flex-shrink: 0;
      padding-top: var(--space-1, 0.25rem);
    }

    /* ── Radio group ── */

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2, 0.5rem);
      padding: var(--space-3, 0.75rem) 0;
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
    }

    .radio-group-label {
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      margin: 0 0 var(--space-1, 0.25rem);
    }

    .radio-group-desc {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
      margin: 0 0 var(--space-2, 0.5rem);
    }

    /* ── Slider row ── */

    .slider-row {
      padding: var(--space-3, 0.75rem) 0;
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2, 0.5rem);
    }

    .slider-value {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
      font-family: var(--font-mono, monospace);
    }

    /* ── Progress ── */

    .progress-row {
      padding: var(--space-3, 0.75rem) 0;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2, 0.5rem);
    }
  `;

  override render() {
    return html`
      <p class="title">Flight Settings</p>
      <p class="subtitle">Configure drone behavior and safety</p>

      <div class="setting">
        <div class="setting-text">
          <p class="setting-label">Obstacle Avoidance</p>
          <p class="setting-desc">Use sensors to detect and avoid collisions</p>
        </div>
        <div class="setting-control">
          <dui-switch checked></dui-switch>
        </div>
      </div>

      <div class="setting">
        <div class="setting-text">
          <p class="setting-label">GPS Logging</p>
          <p class="setting-desc">Record flight path coordinates for review</p>
        </div>
        <div class="setting-control">
          <dui-checkbox checked></dui-checkbox>
        </div>
      </div>

      <div class="radio-group">
        <p class="radio-group-label">Flight Mode</p>
        <p class="radio-group-desc">Select the piloting mode for this session</p>
        <dui-radio-group value="standard">
          <dui-radio value="beginner">Beginner — limited speed and altitude</dui-radio>
          <dui-radio value="standard">Standard — balanced controls</dui-radio>
          <dui-radio value="sport">Sport — maximum responsiveness</dui-radio>
        </dui-radio-group>
      </div>

      <div class="slider-row">
        <div class="slider-header">
          <p class="setting-label" style="margin: 0">Max Altitude</p>
          <span class="slider-value">120 m</span>
        </div>
        <dui-slider value="120" min="30" max="400"></dui-slider>
      </div>
    `;
  }
}
