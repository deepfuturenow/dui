import { LitElement, html, css } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

@customElement("block-codespaces")
export class BlockCodespaces extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      padding: var(--space-6);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-1);
    }

    .header-text h3 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .header-text p {
      font-size: var(--text-xs);
      color: var(--text-2);
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
      padding: var(--space-8) var(--space-4);
      text-align: center;
    }

    .empty-state h4 {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .empty-state p {
      font-size: var(--text-xs);
      color: var(--text-2);
      margin: 0;
      max-width: var(--space-72);
    }

    .learn-more {
      font-size: var(--text-xs);
      color: var(--text-2);
      text-decoration: underline;
      cursor: pointer;
    }

    .footer-note {
      font-size: var(--text-xs);
      color: var(--text-2);
      margin-top: var(--space-4);
      text-align: center;
    }
  `];

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
              <dui-button appearance="ghost" size="icon-sm">
                <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></dui-icon>
              </dui-button>
              <dui-button appearance="ghost" size="icon-sm">
                <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></dui-icon>
              </dui-button>
            </div>
          </div>
          <div class="empty-state">
            <dui-icon style="--icon-size: 32px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></dui-icon>
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
            <dui-icon style="--icon-size: 32px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg></dui-icon>
            <h4>Clone locally</h4>
            <p>Clone the repository to get started with local development.</p>
            <dui-button size="sm" appearance="outline">Copy command</dui-button>
          </div>
        </dui-tabs-panel>
      </dui-tabs>
    `;
  }
}
