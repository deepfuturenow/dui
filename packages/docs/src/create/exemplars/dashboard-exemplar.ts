import { LitElement, html, css, svg } from "lit";
import { customElement } from "lit/decorators.js";
import "@dui/components/sidebar";
import "@dui/components/icon";

/* ── Lucide-style icon paths ── */

const scenariosIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>`;

const defensiveGapsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`;

const indicatorsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 18H3"/><path d="m15 18 2 2 4-4"/><path d="M16 12H3"/><path d="M16 6H3"/></svg>`;

const openQuestionsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`;

const appendixIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;

@customElement("dashboard-exemplar-app")
export class DashboardExemplarApp extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100vh;
    }

    dui-sidebar-provider {
      height: 100%;
    }

    dui-sidebar-header {
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .header-content {
      padding: var(--space-2) var(--space-3);
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .app-name {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-1);
    }

    .inset-content {
      padding: var(--space-6);
    }

    .inset-placeholder {
      font-size: var(--text-sm);
      color: var(--text-3);
    }
  `;

  override render() {
    return html`
      <dui-sidebar-provider collapsible="none">
        <dui-sidebar>
          <dui-sidebar-header>
            <div class="header-content">
              <span class="app-name">Threat Assessment</span>
            </div>
          </dui-sidebar-header>
          <dui-sidebar-content>
            <dui-sidebar-group>
              <dui-sidebar-menu>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button active>
                    <dui-icon slot="icon">${scenariosIcon}</dui-icon>
                    Scenarios
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${defensiveGapsIcon}</dui-icon>
                    Defensive Gaps
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${indicatorsIcon}</dui-icon>
                    Indicators Watchlist
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${openQuestionsIcon}</dui-icon>
                    Open Questions
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${appendixIcon}</dui-icon>
                    Appendix &amp; Methods
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
              </dui-sidebar-menu>
            </dui-sidebar-group>
          </dui-sidebar-content>
        </dui-sidebar>
        <dui-sidebar-inset>
          <div class="inset-content">
            <p class="inset-placeholder">Select a section from the sidebar.</p>
          </div>
        </dui-sidebar-inset>
      </dui-sidebar-provider>
    `;
  }
}
