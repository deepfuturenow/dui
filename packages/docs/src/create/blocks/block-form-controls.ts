import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-form-controls")
export class BlockFormControls extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .stack {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .tfa-card {
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-4);
    }

    .tfa-title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .tfa-desc {
      font-size: var(--font-size-xs);
      color: var(--text-2);
      margin: 0 0 var(--space-3);
    }
  `;

  override render() {
    return html`
      <div class="stack">
        <div class="button-row">
          <dui-button>Button</dui-button>
          <dui-button appearance="outline">Outline</dui-button>
          <dui-button appearance="outline">Outline</dui-button>
          <dui-button variant="danger">Delete</dui-button>
        </div>

        <div class="tfa-card">
          <p class="tfa-title">Two-factor authentication</p>
          <p class="tfa-desc">
            Add an extra layer of security to your account.
          </p>
          <dui-button size="sm">Enable</dui-button>
        </div>

        <dui-slider value="50" min="0" max="100"></dui-slider>
      </div>
    `;
  }
}
