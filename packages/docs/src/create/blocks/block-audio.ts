import { LitElement, html, css } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

const BAR_HEIGHTS = [
  35, 55, 80, 45, 90, 60, 40, 75, 95, 50, 70, 85, 30, 65, 45, 80, 55, 90, 40,
  60, 75, 50, 85, 35, 70, 95, 45, 60, 80, 55, 40, 70,
];

@customElement("block-audio")
export class BlockAudio extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      padding: var(--space-6);
    }

    h3 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--space-1);
    }

    .subtitle {
      font-size: var(--text-xs);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
    }

    .visualizer {
      display: flex;
      align-items: flex-end;
      gap: var(--space-0_5);
      height: var(--space-20);
      margin-bottom: var(--space-4);
    }

    .freq-bar {
      flex: 1;
      background: var(--accent);
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
      opacity: 0.8;
      min-width: 0;
    }

    .badges {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
  `];

  override render() {
    return html`
      <h3>Audio Frequency Visualizer</h3>
      <p class="subtitle">Real-time frequency analysis</p>
      <div class="visualizer">
        ${BAR_HEIGHTS.map(
          (h) => html` <div class="freq-bar" style="height: ${h}%"></div> `,
        )}
      </div>
      <div class="badges">
        <dui-badge appearance="outline">Connecting</dui-badge>
        <dui-badge appearance="outline">Listening</dui-badge>
        <dui-badge variant="success">Speaking</dui-badge>
      </div>
    `;
  }
}
