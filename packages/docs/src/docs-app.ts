import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { componentRegistry } from "./component-registry.ts";
import { currentRoute, onRouteChange, navigate, setSidebarParam, type Route } from "./docs-router.ts";
import { FONT_OPTIONS } from "./create/create-config.ts";
import { loadGoogleFont } from "./create/font-loader.ts";
import "./create/create-controls.ts";

@customElement("docs-app")
export class DocsApp extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--muted);
    }

    /* ── Top bar ── */
    .top-bar {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky, 40);
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-4);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
      background: var(--background);
    }

    .top-bar-left {
      display: flex;
      align-items: center;
      gap: var(--space-6, 1.5rem);
    }

    .top-bar-logo {
      font-size: var(--font-size-base, 1rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tight, -0.01em);
      color: var(--foreground);
      text-decoration: none;
    }

    .top-bar-nav {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .top-bar-link {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      text-decoration: none;
      padding: var(--space-1_5, 0.375rem) var(--space-2_5, 0.625rem);
      border-radius: var(--radius-sm, 0.25rem);
      cursor: pointer;
      transition: color 0.15s, background-color 0.15s;
    }

    .top-bar-link:hover {
      color: var(--foreground);
      background: var(--secondary, oklch(0.5 0 0 / 0.05));
    }

    .top-bar-link[aria-current="page"] {
      color: var(--foreground);
      font-weight: 600;
    }

    .top-bar-right {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .search-trigger {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1_5, 0.375rem) var(--space-3, 0.75rem);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      background: var(--muted);
      color: var(--muted-foreground);
      font-size: var(--font-size-sm, 0.875rem);
      cursor: pointer;
      min-width: 200px;
      transition: border-color 0.15s;
    }

    .search-trigger:hover {
      border-color: var(--foreground);
    }

    .search-trigger kbd {
      margin-left: auto;
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      background: var(--background);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-sm, 0.25rem);
      padding: 1px var(--space-1);
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-sm, 0.25rem);
      background: transparent;
      color: var(--foreground);
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .theme-toggle:hover {
      background: var(--secondary, oklch(0.5 0 0 / 0.05));
    }

    /* ── Sidebar toggle ── */
    .sidebar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-sm, 0.25rem);
      background: transparent;
      color: var(--foreground);
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .sidebar-toggle:hover {
      background: var(--secondary, oklch(0.5 0 0 / 0.05));
    }

    /* ── Body ── */
    .body {
      display: grid;
      grid-template-columns: 240px 1fr 240px;
      flex: 1;
      transition: grid-template-columns 0.2s ease;
    }

    :host([sidebar-closed]) .body {
      grid-template-columns: 0px 1fr 0px;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 240px;
      min-width: 0;
      border-right: var(--border-width-thin, 1px) solid var(--border);
      background: var(--muted);
      padding: var(--space-4) 0;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 48px);
      position: sticky;
      top: 48px;
      overflow-y: auto;
      overflow-x: hidden;
      transition: width 0.2s ease, opacity 0.2s ease, padding 0.2s ease;
    }

    :host([sidebar-closed]) .sidebar {
      width: 0;
      padding: 0;
      opacity: 0;
      border-right: none;
      pointer-events: none;
    }

    /* 2-column: drop farside when viewport can't fit all three */
    @media (max-width: 1279px) {
      .body {
        grid-template-columns: 240px 1fr;
      }
      :host([sidebar-closed]) .body {
        grid-template-columns: 0px 1fr;
      }
      .farside {
        display: none;
      }
    }

    /* Mobile: hide sidebar, show only content */
    @media (max-width: 767px) {
      .body {
        grid-template-columns: 1fr;
      }
      .sidebar {
        display: none;
      }
      .sidebar-toggle {
        display: none;
      }
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

    .section-label:first-child {
      margin-top: 0;
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
      background: var(--secondary, oklch(0.5 0 0 / 0.05));
    }

    .nav-link[aria-current="page"] {
      color: var(--foreground);
      font-weight: 600;
      background: var(--secondary, oklch(0.5 0 0 / 0.08));
    }

    .sidebar-footer {
      margin-top: auto;
      padding: var(--space-4);
      border-top: var(--border-width-thin, 1px) solid var(--border);
    }

    /* ── Farside (right spacer column) ── */
    .farside {
      /* Empty balancing column — same width as sidebar */
    }

    /* ── Content ── */
    .content {
      min-width: 0;
      padding: var(--space-8, 2rem) var(--space-8, 2rem) var(--space-12, 3rem);
      max-width: 44rem;
      width: 100%;
      box-sizing: border-box;
      justify-self: center;
    }

    /* Create page: full width */
    .content--create {
      max-width: none;
    }

    /* ── Search dialog ── */
    .search-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--z-modal, 50);
      background: oklch(0 0 0 / 0.5);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 20vh;
    }

    .search-panel {
      width: 500px;
      max-height: 400px;
      background: var(--background);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      box-shadow: var(--shadow-lg, 0 10px 30px oklch(0 0 0 / 0.2));
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3, 0.75rem) var(--space-4);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
    }

    .search-input-wrapper dui-icon {
      color: var(--muted-foreground);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--foreground);
      font-family: inherit;
    }

    .search-input::placeholder {
      color: var(--muted-foreground);
    }

    .search-results {
      overflow-y: auto;
      padding: var(--space-2);
    }

    .search-group-label {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 600;
      color: var(--muted-foreground);
      padding: var(--space-2) var(--space-2) var(--space-1);
    }

    .search-item {
      display: block;
      padding: var(--space-2) var(--space-3, 0.75rem);
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--foreground);
      text-decoration: none;
      border-radius: var(--radius-sm, 0.25rem);
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .search-item:hover,
    .search-item[data-active] {
      background: var(--secondary, oklch(0.5 0 0 / 0.08));
    }

    .search-empty {
      padding: var(--space-6) var(--space-4);
      text-align: center;
      color: var(--muted-foreground);
      font-size: var(--font-size-sm, 0.875rem);
    }
  `;

  @state()
  accessor #route: Route = currentRoute();

  @state()
  accessor #sidebarClosed = currentRoute().sidebarClosed ?? false;

  @state()
  accessor #searchOpen = false;

  @state()
  accessor #searchQuery = "";

  @state()
  accessor #activeIndex = 0;

  /* ── Create page state ── */
  @state()
  accessor #selectedFont = "Geist";

  @state()
  accessor #selectedRadius = "0.5rem";

  @state()
  accessor #selectedIconLib = "Lucide";

  #cleanup?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!location.hash) location.hash = "#/components";
    this.#route = currentRoute();
    this.#sidebarClosed = this.#route.sidebarClosed ?? false;
    this.#syncSidebarAttr();
    this.#cleanup = onRouteChange((route) => {
      this.#route = route;
      this.#sidebarClosed = route.sidebarClosed ?? false;
      this.#syncSidebarAttr();
    });
    document.addEventListener("keydown", this.#handleGlobalKeydown);
    // Preload the default font for the Create page
    const opt = FONT_OPTIONS.find((f) => f.family === this.#selectedFont);
    if (opt) loadGoogleFont(opt.family, opt.weights);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#cleanup?.();
    document.removeEventListener("keydown", this.#handleGlobalKeydown);
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (this.#searchOpen) {
      const input = this.shadowRoot?.querySelector<HTMLInputElement>(".search-input");
      if (input && document.activeElement !== input) {
        requestAnimationFrame(() => input.focus());
      }
    }
  }

  #handleGlobalKeydown = (e: KeyboardEvent): void => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      this.#searchOpen = !this.#searchOpen;
      this.#searchQuery = "";
      this.#activeIndex = 0;
    }
    if (e.key === "Escape" && this.#searchOpen) {
      this.#searchOpen = false;
    }
  };

  #syncSidebarAttr(): void {
    this.toggleAttribute("sidebar-closed", this.#sidebarClosed);
  }

  #toggleSidebar(): void {
    this.#sidebarClosed = !this.#sidebarClosed;
    this.#syncSidebarAttr();
    setSidebarParam(this.#sidebarClosed);
  }

  #toggleTheme(): void {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    this.requestUpdate();
  }

  #onControlChange(e: CustomEvent<{ prop: string; value: string }>): void {
    const { prop, value } = e.detail;
    switch (prop) {
      case "font": {
        this.#selectedFont = value;
        const opt = FONT_OPTIONS.find((f) => f.family === value);
        if (opt) loadGoogleFont(opt.family, opt.weights);
        break;
      }
      case "radius":
        this.#selectedRadius = value;
        break;
      case "iconLib":
        this.#selectedIconLib = value;
        break;
    }
  }

  #computeRadiusScale(base: string): Record<string, string> {
    const val = parseFloat(base);
    return {
      "--radius-sm": `${Math.max(val - 0.25, 0)}rem`,
      "--radius-md": base === "0" ? "0" : base,
      "--radius-lg": `${val + 0.25}rem`,
    };
  }

  #isTopNavActive(section: string): boolean {
    return this.#route.section === section;
  }

  #isActive(section: string, component?: string): boolean {
    return this.#route.section === section && this.#route.component === component;
  }

  get #navComponents() {
    return componentRegistry
      .filter((c) => !c.parent)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get #searchResults() {
    const q = this.#searchQuery.toLowerCase().trim();
    if (!q) return this.#navComponents;
    return this.#navComponents.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }

  #onSearchInput(e: Event): void {
    this.#searchQuery = (e.target as HTMLInputElement).value;
    this.#activeIndex = 0;
  }

  #onSearchKeydown(e: KeyboardEvent): void {
    const results = this.#searchResults;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.#activeIndex = Math.min(this.#activeIndex + 1, results.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.#activeIndex = Math.max(this.#activeIndex - 1, 0);
    } else if (e.key === "Enter" && results[this.#activeIndex]) {
      e.preventDefault();
      const c = results[this.#activeIndex];
      const slug = c.tagName.replace("dui-", "");
      navigate(`#/components/${slug}`);
      this.#searchOpen = false;
    }
  }

  #selectSearchResult(tagName: string): void {
    const slug = tagName.replace("dui-", "");
    navigate(`#/components/${slug}`);
    this.#searchOpen = false;
  }

  override render() {
    const isCreate = this.#route.section === "create";

    // When on create page, apply font/radius overrides to the content area
    let contentStyle = "";
    if (isCreate) {
      const radii = this.#computeRadiusScale(this.#selectedRadius);
      contentStyle = [
        `--font-sans: '${this.#selectedFont}', system-ui, sans-serif`,
        ...Object.entries(radii).map(([k, v]) => `${k}: ${v}`),
      ].join("; ");
    }

    return html`
      <header class="top-bar">
        <div class="top-bar-left">
          <a class="top-bar-logo" href="#/components">DUI</a>
          <nav class="top-bar-nav">
            <a class="top-bar-link"
              href="#/components"
              aria-current=${this.#isTopNavActive("components") ? "page" : "false"}>
              Components
            </a>
            <a class="top-bar-link"
              href="#/styling"
              aria-current=${this.#isTopNavActive("styling") ? "page" : "false"}>
              Styling
            </a>
            <a class="top-bar-link"
              href="#/colors"
              aria-current=${this.#isTopNavActive("colors") ? "page" : "false"}>
              Colors
            </a>
            <a class="top-bar-link"
              href="#/blocks"
              aria-current=${this.#isTopNavActive("blocks") ? "page" : "false"}>
              Blocks
            </a>
            <a class="top-bar-link"
              href="#/create"
              aria-current=${this.#isTopNavActive("create") ? "page" : "false"}>
              Create
            </a>
          </nav>
        </div>
        <div class="top-bar-right">
          <button class="search-trigger" @click=${() => { this.#searchOpen = true; this.#searchQuery = ""; this.#activeIndex = 0; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Search...
            <kbd>${navigator.platform.includes("Mac") ? "\u2318" : "Ctrl"}K</kbd>
          </button>
          <button class="sidebar-toggle" @click=${this.#toggleSidebar} title="Toggle sidebar">
            ${this.#sidebarClosed
              ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>`
              : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>`
            }
          </button>
          <button class="theme-toggle" @click=${this.#toggleTheme} title="Toggle theme">
            ${document.documentElement.getAttribute("data-theme") === "dark"
              ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
              : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
            }
          </button>
        </div>
      </header>

      <div class="body">
        ${this.#renderSidebar()}
        <main class="content ${isCreate ? "content--create" : ""}" style=${contentStyle}>
          ${this.#renderPage()}
        </main>
        <div class="farside"></div>
      </div>

      ${this.#searchOpen ? this.#renderSearch() : nothing}
    `;
  }

  #renderSidebar() {
    if (this.#route.section === "create") {
      return html`
        <nav class="sidebar" @control-change=${this.#onControlChange}>
          <create-controls
            selectedFont=${this.#selectedFont}
            selectedRadius=${this.#selectedRadius}
            selectedIconLib=${this.#selectedIconLib}
          ></create-controls>
        </nav>
      `;
    }

    return html`
      <nav class="sidebar">
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

        <div class="sidebar-footer">
          <a class="nav-link" href="/llms.txt" target="_blank">llms.txt</a>
        </div>
      </nav>
    `;
  }

  #renderSearch() {
    const results = this.#searchResults;
    return html`
      <div class="search-overlay" @click=${(e: Event) => {
        if (e.target === e.currentTarget) this.#searchOpen = false;
      }}>
        <div class="search-panel">
          <div class="search-input-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              class="search-input"
              type="text"
              placeholder="Search components..."
              .value=${this.#searchQuery}
              @input=${this.#onSearchInput}
              @keydown=${this.#onSearchKeydown}
              autofocus
            />
          </div>
          <div class="search-results">
            <div class="search-group-label">Components</div>
            ${results.length === 0
              ? html`<div class="search-empty">No results found.</div>`
              : results.map(
                  (c, i) => html`
                    <div
                      class="search-item"
                      ?data-active=${i === this.#activeIndex}
                      @click=${() => this.#selectSearchResult(c.tagName)}>
                      ${c.name}
                    </div>
                  `,
                )}
          </div>
        </div>
      </div>
    `;
  }

  #renderPage() {
    const { section, component } = this.#route;

    if (section === "styling") return html`<docs-page-styling></docs-page-styling>`;
    if (section === "colors") return html`<docs-page-colors></docs-page-colors>`;
    if (section === "blocks") return html`<docs-page-blocks></docs-page-blocks>`;
    if (section === "create") return html`<docs-page-create></docs-page-create>`;

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
        case "separator": return html`<docs-page-separator></docs-page-separator>`;
        case "progress": return html`<docs-page-progress></docs-page-progress>`;
        case "toggle": return html`<docs-page-toggle></docs-page-toggle>`;
        case "number-field": return html`<docs-page-number-field></docs-page-number-field>`;
        case "menubar": return html`<docs-page-menubar></docs-page-menubar>`;
        case "calendar": return html`<docs-page-calendar></docs-page-calendar>`;
      }
    }

    return html`<docs-page-components-index></docs-page-components-index>`;
  }
}
