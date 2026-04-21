import { LitElement, html, css, svg } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

/* ── Lucide-style icon paths ── */

const dashboardIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`;

const transactionsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>`;

const investmentsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`;

const goalsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;

const budgetIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>`;

const reportsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`;

const documentsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;

const profileIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

const billingIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`;

const notificationsIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;

const securityIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;

const helpIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`;

const contactIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;

const statusIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`;

@customElement("block-sidebar")
export class BlockSidebar extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      /* Strip the default block card appearance */
      background: none;
      border: none;
      border-radius: 0;
    }

    .pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    /* Each mini-sidebar gets the card treatment */
    .mini-sidebar {
      display: flex;
      flex-direction: column;
      padding: var(--space-2) 0;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface-1);
    }

    dui-sidebar-provider {
      display: contents;
    }
  `];

  override render() {
    return html`
      <div class="pair">
        <!-- Left mini-sidebar: Finance -->
        <dui-sidebar-provider collapsible="none">
          <div class="mini-sidebar">
            <dui-sidebar-group>
              <dui-sidebar-group-label slot="label">Overview</dui-sidebar-group-label>
              <dui-sidebar-menu>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button active>
                    <dui-icon slot="icon">${dashboardIcon}</dui-icon>
                    Dashboard
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${transactionsIcon}</dui-icon>
                    Transactions
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${investmentsIcon}</dui-icon>
                    Investments
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
              </dui-sidebar-menu>
            </dui-sidebar-group>

            <dui-sidebar-separator></dui-sidebar-separator>

            <dui-sidebar-group>
              <dui-sidebar-group-label slot="label">Planning</dui-sidebar-group-label>
              <dui-sidebar-menu>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${goalsIcon}</dui-icon>
                    Goals
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${budgetIcon}</dui-icon>
                    Budget
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${reportsIcon}</dui-icon>
                    Reports
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${documentsIcon}</dui-icon>
                    Documents
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
              </dui-sidebar-menu>
            </dui-sidebar-group>
          </div>
        </dui-sidebar-provider>

        <!-- Right mini-sidebar: Account / Support -->
        <dui-sidebar-provider collapsible="none">
          <div class="mini-sidebar">
            <dui-sidebar-group>
              <dui-sidebar-group-label slot="label">Account</dui-sidebar-group-label>
              <dui-sidebar-menu>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${profileIcon}</dui-icon>
                    Profile
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button active>
                    <dui-icon slot="icon">${billingIcon}</dui-icon>
                    Billing
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${notificationsIcon}</dui-icon>
                    Notifications
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${securityIcon}</dui-icon>
                    Security
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
              </dui-sidebar-menu>
            </dui-sidebar-group>

            <dui-sidebar-separator></dui-sidebar-separator>

            <dui-sidebar-group>
              <dui-sidebar-group-label slot="label">Support</dui-sidebar-group-label>
              <dui-sidebar-menu>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${helpIcon}</dui-icon>
                    Help Center
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${contactIcon}</dui-icon>
                    Contact Us
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
                <dui-sidebar-menu-item>
                  <dui-sidebar-menu-button>
                    <dui-icon slot="icon">${statusIcon}</dui-icon>
                    Status
                  </dui-sidebar-menu-button>
                </dui-sidebar-menu-item>
              </dui-sidebar-menu>
            </dui-sidebar-group>
          </div>
        </dui-sidebar-provider>
      </div>
    `;
  }
}
