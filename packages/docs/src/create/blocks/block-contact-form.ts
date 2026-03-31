import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-contact-form")
export class BlockContactForm extends LitElement {
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
      gap: var(--space-3, 0.75rem);
    }

    .controls-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-2, 0.5rem);
    }
  `;

  override render() {
    return html`
      <div class="stack">
        <dui-input placeholder="Name"></dui-input>
        <dui-textarea placeholder="Message" rows="3"></dui-textarea>
        <div class="controls-row">
          <dui-badge>Default</dui-badge>
          <dui-badge variant="secondary">Secondary</dui-badge>
          <dui-badge variant="outline">Outline</dui-badge>
          <dui-badge variant="destructive">Destructive</dui-badge>
          <dui-checkbox checked>Checked</dui-checkbox>
          <dui-checkbox>Unchecked</dui-checkbox>
          <dui-checkbox indeterminate>Mixed</dui-checkbox>
          <dui-switch></dui-switch>
        </div>
      </div>
    `;
  }
}
