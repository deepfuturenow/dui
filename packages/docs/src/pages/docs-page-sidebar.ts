import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-sidebar")
export class DocsPageSidebar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-sidebar-provider")!;
    const sidebarMeta = componentRegistry.find((c) => c.tagName === "dui-sidebar")!;
    const triggerMeta = componentRegistry.find((c) => c.tagName === "dui-sidebar-trigger")!;
    const contentMeta = componentRegistry.find((c) => c.tagName === "dui-sidebar-content")!;
    const menuButtonMeta = componentRegistry.find((c) => c.tagName === "dui-sidebar-menu-button")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default (left sidebar)">
        <div style="height: 400px; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;">
          <dui-sidebar-provider>
            <dui-sidebar>
              <dui-sidebar-header>
                <div style="padding: var(--space-2); font-weight: 600;">My App</div>
              </dui-sidebar-header>
              <dui-sidebar-content>
                <dui-sidebar-group>
                  <dui-sidebar-group-label slot="label">Navigation</dui-sidebar-group-label>
                  <dui-sidebar-menu>
                    <dui-sidebar-menu-item>
                      <dui-sidebar-menu-button active>
                        Dashboard
                      </dui-sidebar-menu-button>
                    </dui-sidebar-menu-item>
                    <dui-sidebar-menu-item>
                      <dui-sidebar-menu-button>
                        Projects
                      </dui-sidebar-menu-button>
                    </dui-sidebar-menu-item>
                    <dui-sidebar-menu-item>
                      <dui-sidebar-menu-button>
                        Settings
                      </dui-sidebar-menu-button>
                    </dui-sidebar-menu-item>
                  </dui-sidebar-menu>
                </dui-sidebar-group>
                <dui-sidebar-separator></dui-sidebar-separator>
                <dui-sidebar-group>
                  <dui-sidebar-group-label slot="label">Resources</dui-sidebar-group-label>
                  <dui-sidebar-menu>
                    <dui-sidebar-menu-item>
                      <dui-sidebar-menu-button>
                        Documentation
                      </dui-sidebar-menu-button>
                    </dui-sidebar-menu-item>
                    <dui-sidebar-menu-item>
                      <dui-sidebar-menu-button disabled>
                        API Keys (disabled)
                      </dui-sidebar-menu-button>
                    </dui-sidebar-menu-item>
                  </dui-sidebar-menu>
                </dui-sidebar-group>
              </dui-sidebar-content>
              <dui-sidebar-footer>
                <div style="padding: var(--space-2); font-size: var(--font-size-xs); color: var(--muted-foreground);">v1.0.0</div>
              </dui-sidebar-footer>
            </dui-sidebar>
            <dui-sidebar-inset>
              <div style="padding: var(--space-4);">
                <dui-sidebar-trigger></dui-sidebar-trigger>
                <p style="margin-top: var(--space-4); color: var(--muted-foreground);">Main content area. Click the trigger to toggle the sidebar.</p>
              </div>
            </dui-sidebar-inset>
          </dui-sidebar-provider>
        </div>
      </dui-docs-demo>

      <h2>API Reference — Sidebar Provider</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Sidebar</h2>
      ${renderApiTable(sidebarMeta)}

      <h2>API Reference — Trigger</h2>
      ${renderApiTable(triggerMeta)}

      <h2>API Reference — Content</h2>
      ${renderApiTable(contentMeta)}

      <h2>API Reference — Menu Button</h2>
      ${renderApiTable(menuButtonMeta)}
    `;
  }
}
