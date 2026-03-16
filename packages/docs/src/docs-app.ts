import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { componentRegistry } from "./component-registry.ts";
import { currentRoute, onRouteChange, type Route } from "./docs-router.ts";

@customElement("docs-app")
export class DocsApp extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 240px;
      min-width: 240px;
      border-right: var(--border-width-thin, 1px) solid var(--border);
      background: var(--muted);
      padding: var(--space-4) 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 0 var(--space-4) var(--space-4);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
      margin-bottom: var(--space-4);
    }

    .sidebar-title {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 700;
      margin: 0;
      letter-spacing: var(--letter-spacing-tight, -0.01em);
    }

    .sidebar-subtitle {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      margin: var(--space-1) 0 0;
    }

    .section-label {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider, 0.05em);
      color: var(--muted-foreground);
      padding: var(--space-2) var(--space-4);
      margin-top: var(--space-2);
    }

    .nav-link {
      display: block;
      padding: var(--space-1_5, 0.375rem) var(--space-4);
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      text-decoration: none;
      cursor: pointer;
      transition: color 0.15s, background-color 0.15s;
    }

    .nav-link:hover {
      color: var(--foreground);
      background: var(--accent, oklch(0.5 0 0 / 0.05));
    }

    .nav-link[aria-current="page"] {
      color: var(--foreground);
      font-weight: 600;
      background: var(--accent, oklch(0.5 0 0 / 0.08));
    }

    .sidebar-footer {
      margin-top: auto;
      padding: var(--space-4);
      border-top: var(--border-width-thin, 1px) solid var(--border);
    }

    .content {
      flex: 1;
      min-width: 0;
      padding: var(--space-8, 2rem) var(--space-8, 2rem) var(--space-12, 3rem);
      max-width: 900px;
    }
  `;

  @state()
  accessor #route: Route = currentRoute();

  #cleanup?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!location.hash) location.hash = "#/components";
    this.#route = currentRoute();
    this.#cleanup = onRouteChange((route) => {
      this.#route = route;
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#cleanup?.();
  }

  #toggleTheme(): void {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  }

  #isActive(section: string, component?: string): boolean {
    return this.#route.section === section && this.#route.component === component;
  }

  // Unique component names (skip accordion-item — it's shown on the accordion page)
  get #navComponents() {
    return componentRegistry
      .filter((c) => !c.parent)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  override render() {
    return html`
      <nav class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">DUI</h1>
          <p class="sidebar-subtitle">Component Library</p>
        </div>

        <div class="section-label">Components</div>
        <a class="nav-link"
          href="#/components"
          aria-current=${this.#isActive("components", undefined) ? "page" : "false"}>
          Overview
        </a>
        ${this.#navComponents.map((c) => {
          const slug = c.tagName.replace("dui-", "");
          return html`
            <a class="nav-link"
              href="#/components/${slug}"
              aria-current=${this.#isActive("components", slug) ? "page" : "false"}>
              ${c.name}
            </a>
          `;
        })}

        <div class="section-label">Design</div>
        <a class="nav-link"
          href="#/colors"
          aria-current=${this.#route.section === "colors" ? "page" : "false"}>
          Colors
        </a>

        <div class="section-label">Patterns</div>
        <a class="nav-link"
          href="#/blocks"
          aria-current=${this.#route.section === "blocks" ? "page" : "false"}>
          Blocks
        </a>

        <div class="sidebar-footer">
          <a class="nav-link" href="/llms.txt" target="_blank">llms.txt</a>
          <dui-button variant="outline" size="sm" @click=${this.#toggleTheme}>
            Toggle theme
          </dui-button>
        </div>
      </nav>

      <main class="content">
        ${this.#renderPage()}
      </main>
    `;
  }

  #renderPage() {
    const { section, component } = this.#route;

    if (section === "colors") return html`<docs-page-colors></docs-page-colors>`;
    if (section === "blocks") return html`<docs-page-blocks></docs-page-blocks>`;

    if (section === "components" && component) {
      switch (component) {
        case "accordion": return html`<docs-page-accordion></docs-page-accordion>`;
        case "button": return html`<docs-page-button></docs-page-button>`;
        case "switch": return html`<docs-page-switch></docs-page-switch>`;
        case "badge": return html`<docs-page-badge></docs-page-badge>`;
        case "icon": return html`<docs-page-icon></docs-page-icon>`;
        case "scroll-area": return html`<docs-page-scroll-area></docs-page-scroll-area>`;
        case "combobox": return html`<docs-page-combobox></docs-page-combobox>`;
        case "menu": return html`<docs-page-menu></docs-page-menu>`;
        case "popover": return html`<docs-page-popover></docs-page-popover>`;
        case "tooltip": return html`<docs-page-tooltip></docs-page-tooltip>`;
        case "dialog": return html`<docs-page-dialog></docs-page-dialog>`;
        case "alert-dialog": return html`<docs-page-alert-dialog></docs-page-alert-dialog>`;
        case "breadcrumb": return html`<docs-page-breadcrumb></docs-page-breadcrumb>`;
        case "checkbox": return html`<docs-page-checkbox></docs-page-checkbox>`;
        case "collapsible": return html`<docs-page-collapsible></docs-page-collapsible>`;
        case "toolbar": return html`<docs-page-toolbar></docs-page-toolbar>`;
        case "slider": return html`<docs-page-slider></docs-page-slider>`;
        case "spinner": return html`<docs-page-spinner></docs-page-spinner>`;
        case "tabs": return html`<docs-page-tabs></docs-page-tabs>`;
        case "textarea": return html`<docs-page-textarea></docs-page-textarea>`;
        case "trunc": return html`<docs-page-trunc></docs-page-trunc>`;
        case "center": return html`<docs-page-center></docs-page-center>`;
        case "hstack": return html`<docs-page-hstack></docs-page-hstack>`;
        case "vstack": return html`<docs-page-vstack></docs-page-vstack>`;
        case "page-inset": return html`<docs-page-page-inset></docs-page-page-inset>`;
        case "link": return html`<docs-page-link></docs-page-link>`;
        case "avatar": return html`<docs-page-avatar></docs-page-avatar>`;
        case "portal": return html`<docs-page-portal></docs-page-portal>`;
        case "input": return html`<docs-page-input></docs-page-input>`;
        case "radio-group": return html`<docs-page-radio></docs-page-radio>`;
        case "dropzone": return html`<docs-page-dropzone></docs-page-dropzone>`;
        case "select": return html`<docs-page-select></docs-page-select>`;
        case "preview-card": return html`<docs-page-preview-card></docs-page-preview-card>`;
        case "data-table": return html`<docs-page-data-table></docs-page-data-table>`;
        case "command": return html`<docs-page-command></docs-page-command>`;
        case "sidebar-provider": return html`<docs-page-sidebar></docs-page-sidebar>`;
      }
    }

    return html`<docs-page-components-index></docs-page-components-index>`;
  }
}
