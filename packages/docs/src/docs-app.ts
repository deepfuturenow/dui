import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { componentRegistry } from "./component-registry.ts";
import { currentRoute, onRouteChange, navigate, setSidebarParam, type Route } from "./docs-router.ts";
import { FONT_OPTIONS } from "./create/create-config.ts";
import { loadGoogleFont } from "./create/font-loader.ts";
import "./create/create-controls.ts";

/** Sidebar navigation groups for the Components section. */
const NAV_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "General",
    slugs: [
      "button", "badge", "icon", "link", "separator", "spinner",
      "progress", "toggle", "avatar",
    ],
  },
  {
    label: "Forms",
    slugs: [
      "input", "textarea", "checkbox", "radio-group", "select",
      "combobox", "switch", "slider", "number-field", "dropzone",
      "calendar",
    ],
  },
  {
    label: "Layout",
    slugs: [
      "accordion", "collapsible", "tabs", "scroll-area", "toolbar",
      "sidebar-provider", "hstack", "vstack", "center", "page-inset",
    ],
  },
  {
    label: "Overlays",
    slugs: [
      "dialog", "alert-dialog", "popover", "tooltip", "menu",
      "menubar", "command", "preview-card",
    ],
  },
  {
    label: "Navigation",
    slugs: ["breadcrumb"],
  },
  {
    label: "Data",
    slugs: ["data-table"],
  },
  {
    label: "Utility",
    slugs: ["portal", "trunc"],
  },
];

@customElement("docs-app")
export class DocsApp extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--background);
    }

    /* ── Top bar ── */
    .top-bar {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky, 40);
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-5);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
      background: var(--background);
      backdrop-filter: blur(12px) saturate(1.5);
      -webkit-backdrop-filter: blur(12px) saturate(1.5);
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

    .top-bar-logo span {
      color: var(--muted-foreground);
      font-weight: 400;
      margin-left: var(--space-1);
      font-size: var(--font-size-xs, 0.75rem);
    }

    .top-bar-nav {
      display: flex;
      align-items: center;
      gap: var(--space-0_5);
    }

    .top-bar-link {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      text-decoration: none;
      padding: var(--space-1_5, 0.375rem) var(--space-2_5, 0.625rem);
      border-radius: var(--radius-md, 0.5rem);
      cursor: pointer;
      transition: color var(--duration-fast) ease, background var(--duration-fast) ease;
    }

    .top-bar-link:hover {
      color: var(--foreground);
      background: var(--secondary, oklch(0.5 0 0 / 0.05));
    }

    .top-bar-link[aria-current="page"] {
      color: var(--foreground);
      font-weight: 600;
      background: var(--secondary, oklch(0.5 0 0 / 0.06));
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
      font-family: inherit;
      cursor: pointer;
      min-width: 200px;
      transition: border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
    }

    .search-trigger:hover {
      border-color: var(--muted-foreground);
      box-shadow: var(--shadow-xs);
    }

    .search-trigger kbd {
      margin-left: auto;
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      background: var(--background);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-sm, 0.25rem);
      padding: 1px var(--space-1);
      line-height: 1;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      background: transparent;
      color: var(--muted-foreground);
      cursor: pointer;
      transition: color var(--duration-fast) ease, background var(--duration-fast) ease, border-color var(--duration-fast) ease;
    }

    .icon-btn:hover {
      color: var(--foreground);
      background: var(--secondary, oklch(0.5 0 0 / 0.05));
      border-color: var(--muted-foreground);
    }

    /* ── Body ── */
    .body {
      display: grid;
      grid-template-columns: 260px 1fr 260px;
      flex: 1;
      transition: grid-template-columns 0.25s var(--ease-out-3);
    }

    :host([sidebar-closed]) .body {
      grid-template-columns: 0px 1fr 0px;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 260px;
      min-width: 0;
      border-right: var(--border-width-thin, 1px) solid var(--border);
      background: var(--background);
      padding: var(--space-4) 0;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 52px);
      position: sticky;
      top: 52px;
      overflow-y: auto;
      overflow-x: hidden;
      transition: width 0.25s var(--ease-out-3), opacity 0.2s ease, padding 0.25s var(--ease-out-3);
    }

    /* Custom scrollbar for sidebar */
    .sidebar::-webkit-scrollbar {
      width: 4px;
    }
    .sidebar::-webkit-scrollbar-track {
      background: transparent;
    }
    .sidebar::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: var(--radius-full);
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
        grid-template-columns: 260px 1fr;
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
      .icon-btn.sidebar-toggle {
        display: none;
      }
      .search-trigger {
        min-width: 0;
      }
      .search-trigger .search-text {
        display: none;
      }
      .top-bar-nav {
        gap: 0;
      }
      .top-bar-link {
        font-size: var(--font-size-xs, 0.75rem);
        padding: var(--space-1) var(--space-1_5);
      }
    }

    .section-label {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted-foreground);
      padding: var(--space-3) var(--space-5) var(--space-1_5);
      margin-top: var(--space-2);
      user-select: none;
    }

    .section-label:first-child {
      margin-top: 0;
    }

    .nav-link {
      display: block;
      padding: var(--space-1, 0.25rem) var(--space-5);
      font-size: var(--font-size-sm, 0.875rem);
      line-height: var(--line-height-relaxed, 1.625);
      color: var(--muted-foreground);
      text-decoration: none;
      cursor: pointer;
      transition: color var(--duration-fast) ease, background var(--duration-fast) ease;
      border-left: 2px solid transparent;
    }

    .nav-link:hover {
      color: var(--foreground);
    }

    .nav-link[aria-current="page"] {
      color: var(--foreground);
      font-weight: 600;
      border-left-color: var(--foreground);
    }

    .sidebar-footer {
      margin-top: auto;
      padding: var(--space-3) var(--space-5);
      border-top: var(--border-width-thin, 1px) solid var(--border);
    }

    .sidebar-footer .nav-link {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      padding: var(--space-1) 0;
      border-left: none;
    }

    /* ── Farside (right spacer column) ── */
    .farside {
      /* Empty balancing column — same width as sidebar */
    }

    /* ── Content ── */
    .content {
      min-width: 0;
      padding: var(--space-10, 2.5rem) var(--space-8, 2rem) var(--space-16, 4rem);
      max-width: 48rem;
      width: 100%;
      box-sizing: border-box;
      justify-self: center;
      animation: content-fade-in 0.2s ease;
    }

    @keyframes content-fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
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
      background: var(--scrim, oklch(0 0 0 / 0.5));
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 15vh;
      animation: overlay-fade-in 0.15s ease;
    }

    @keyframes overlay-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .search-panel {
      width: 540px;
      max-width: calc(100vw - var(--space-8));
      max-height: 420px;
      background: var(--background);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      box-shadow: var(--shadow-xl, 0 20px 40px oklch(0 0 0 / 0.15));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: panel-slide-in 0.2s var(--ease-out-3);
    }

    @keyframes panel-slide-in {
      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3, 0.75rem) var(--space-4);
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
    }

    .search-input-wrapper svg {
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
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted-foreground);
      padding: var(--space-2) var(--space-2) var(--space-1);
    }

    .search-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3, 0.75rem);
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--foreground);
      text-decoration: none;
      border-radius: var(--radius-md, 0.5rem);
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .search-item:hover,
    .search-item[data-active] {
      background: var(--secondary, oklch(0.5 0 0 / 0.08));
    }

    .search-item-tag {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--muted-foreground);
      margin-left: auto;
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

  /** Build grouped sidebar entries from NAV_GROUPS. */
  get #groupedNav() {
    const bySlug = new Map(
      this.#navComponents.map((c) => [c.tagName.replace("dui-", ""), c]),
    );
    return NAV_GROUPS.map((g) => ({
      label: g.label,
      items: g.slugs
        .map((slug) => {
          const meta = bySlug.get(slug);
          return meta ? { slug, name: meta.name } : null;
        })
        .filter((x): x is { slug: string; name: string } => x !== null),
    })).filter((g) => g.items.length > 0);
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
          <a class="top-bar-logo" href="#/components">DUI<span>v0.1</span></a>
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
            <span class="search-text">Search components…</span>
            <kbd>${navigator.platform.includes("Mac") ? "\u2318" : "Ctrl"}K</kbd>
          </button>
          <button class="icon-btn sidebar-toggle" @click=${this.#toggleSidebar} title="Toggle sidebar">
            ${this.#sidebarClosed
              ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>`
              : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>`
            }
          </button>
          <button class="icon-btn" @click=${this.#toggleTheme} title="Toggle theme">
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
        ${this.#groupedNav.map((group) => html`
          <div class="section-label">${group.label}</div>
          ${group.items.map((item) => html`
            <a class="nav-link"
              href="#/components/${item.slug}"
              aria-current=${this.#isActive("components", item.slug) ? "page" : "false"}>
              ${item.name}
            </a>
          `)}
        `)}

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
                      <span class="search-item-tag">&lt;${c.tagName}&gt;</span>
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
