import { LitElement, html, css } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

@customElement("block-create-project")
export class BlockCreateProject extends LitElement {
  static override styles = [blockBase, css`
    :host {
      padding: var(--space-6);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-5);
    }

    .header h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin: 0;
      letter-spacing: var(--letter-spacing-tighter);
    }

    .field {
      margin-bottom: var(--space-4);
    }

    .field:last-of-type {
      margin-bottom: var(--space-6);
    }

    .label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: 500;
      margin-bottom: var(--space-2);
      color: var(--text-1);
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }
  `];

  override render() {
    return html`
      <div class="header">
        <h3>Create a new project</h3>
        <dui-button appearance="ghost" size="icon-sm">
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
      </div>

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

      <div class="footer">
        <dui-button appearance="ghost">Cancel</dui-button>
        <dui-button>Create</dui-button>
      </div>
    `;
  }
}
