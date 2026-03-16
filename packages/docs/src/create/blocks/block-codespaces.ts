import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-codespaces")
export class BlockCodespaces extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--card);
      color: var(--card-foreground);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-1);
    }

    .header-text h3 {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0;
    }

    .header-text p {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      margin: var(--space-1) 0 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-1);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-8, 2rem) var(--space-4);
      text-align: center;
    }

    .empty-state h4 {
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 600;
      margin: 0;
    }

    .empty-state p {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      margin: 0;
      max-width: 280px;
    }

    .learn-more {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      text-decoration: underline;
      cursor: pointer;
    }

    .footer-note {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      margin-top: var(--space-4);
      text-align: center;
    }
  `;

  override render() {
    return html`
      <dui-tabs value="codespaces">
        <dui-tabs-list>
          <dui-tab value="codespaces">Codespaces</dui-tab>
          <dui-tab value="local">Local</dui-tab>
        </dui-tabs-list>
        <dui-tabs-panel value="codespaces">
          <div class="header">
            <div class="header-text">
              <h3>Codespaces</h3>
              <p>Your workspaces in the cloud</p>
            </div>
            <div class="header-actions">
              <dui-button variant="ghost" size="icon-sm">
                <dui-icon name="plus" size="16"></dui-icon>
              </dui-button>
              <dui-button variant="ghost" size="icon-sm">
                <dui-icon name="ellipsis" size="16"></dui-icon>
              </dui-button>
            </div>
          </div>
          <div class="empty-state">
            <dui-icon name="code" size="32"></dui-icon>
            <h4>No codespaces</h4>
            <p>
              You don't have any codespaces yet. Create one to get started with
              your project.
            </p>
            <dui-button size="sm">Create Codespace</dui-button>
            <span class="learn-more">Learn more</span>
          </div>
          <p class="footer-note">
            Codespace usage for this repository is paid for by shadcn.
          </p>
        </dui-tabs-panel>
        <dui-tabs-panel value="local">
          <div class="empty-state">
            <dui-icon name="terminal" size="32"></dui-icon>
            <h4>Clone locally</h4>
            <p>Clone the repository to get started with local development.</p>
            <dui-button size="sm" variant="outline">Copy command</dui-button>
          </div>
        </dui-tabs-panel>
      </dui-tabs>
    `;
  }
}
