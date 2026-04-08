import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-form-controls")
export class BlockFormControls extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--card);
      color: var(--card-foreground);
    }

    .stack {
      display: flex;
      flex-direction: column;
      gap: var(--space-4, 1rem);
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2, 0.5rem);
    }

    .tfa-card {
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      padding: var(--space-4, 1rem);
    }

    .tfa-title {
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .tfa-desc {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
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
