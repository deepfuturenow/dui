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
          <dui-field>
            <span slot="label">What are you exploring?</span>
            <dui-input placeholder="Name your project"></dui-input>
          </dui-field>

          <dui-field>
            <span slot="label">What are some key project details?</span>
            <dui-textarea
              placeholder="Describe the topic, scope, and goals of this project"
              rows="3"
            ></dui-textarea>
          </dui-field>
        </div>

        <dui-button slot="footer" appearance="soft">Cancel</dui-button>
        <dui-button slot="footer" variant="primary">Create</dui-button>
      </dui-card>
    `;
  }
}
