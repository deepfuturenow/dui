import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";

@customElement("block-create-project")
export class BlockCreateProject extends LitElement {
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .label {
      display: block;
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--space-3);
      color: var(--text-1);
      text-box: trim-both cap alphabetic;
    }
  `];

  override render() {
    return html`
      <dui-card>
        <span slot="title">Create a new project</span>
        <dui-button slot="action" appearance="ghost" size="icon-sm">
          <dui-icon
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg></dui-icon
          >
        </dui-button>

        <div class="content">
          <div class="field">
            <label class="label">What are you exploring?</label>
            <dui-input placeholder="Name your project"></dui-input>
          </div>
  
          <div class="field">
            <label class="label">What are some key project details?</label>
            <dui-textarea
              placeholder="Describe the topic, scope, and goals of this project"
              rows="3"
            ></dui-textarea>
          </div>
        </div>

        <dui-button slot="footer" appearance="ghost">Cancel</dui-button>
        <dui-button slot="footer">Create</dui-button>
      </dui-card>
    `;
  }
}
