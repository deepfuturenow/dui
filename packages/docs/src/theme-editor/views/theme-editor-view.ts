/**
 * Theme Editor View — Root component (sidebar + iframe layout)
 *
 * Sidebar with token editors on the left, iframe showing the dui docs
 * on the right. Tokens cascade from :root so the sidebar is theme-aware.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import {
  buildTokenRegistry,
  overrideKey,
  parseOverrideKey,
  type TokenDef,
  type TokenRegistry,
} from "../lib/token-parser.ts";
import {
  applyOverrides,
  connectIframe,
  clearOverrides as clearEngineOverrides,
  type TokenOverride,
} from "../lib/override-engine.ts";
import * as Persistence from "../lib/persistence.ts";
import { generateTokensCSS } from "../lib/file-generator.ts";
import "../components/token-editor.ts";

type IframeTarget = {
  label: string;
  url: string;
};

const IFRAME_TARGETS: IframeTarget[] = [
  { label: "DUI Docs", url: "./index.html" },
];

// Semantic sub-groups for color tokens within a theme
const COLOR_GROUPS: { label: string; tokens: string[] }[] = [
  { label: "Base", tokens: ["--background", "--foreground"] },
  {
    label: "Surfaces",
    tokens: [
      "--card", "--card-foreground",
      "--popover", "--popover-foreground",
      "--muted", "--muted-foreground",
    ],
  },
  {
    label: "Actions",
    tokens: [
      "--primary", "--primary-foreground",
      "--secondary", "--secondary-foreground",
      "--accent", "--accent-foreground",
      "--destructive", "--destructive-foreground",
    ],
  },
  {
    label: "Status",
    tokens: [
      "--success", "--success-foreground",
      "--warning", "--warning-foreground",
      "--info", "--info-foreground",
    ],
  },
  {
    label: "Forms",
    tokens: [
      "--input", "--input-bg",
      "--border", "--ring",
      "--meter-track", "--meter-fill",
    ],
  },
  { label: "Misc", tokens: ["--scrim"] },
  {
    label: "Charts",
    tokens: [
      "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5",
    ],
  },
];

type ColorGroup = { label: string; tokens: TokenDef[] };

/** Group themed color tokens by semantic sub-group, with an "Other" catch-all. */
const groupColorTokens = (themeTokens: TokenDef[]): ColorGroup[] => {
  const assigned = new Set<string>();
  const groups: ColorGroup[] = [];

  for (const group of COLOR_GROUPS) {
    const matched = themeTokens.filter((t) => group.tokens.includes(t.name));
    if (matched.length > 0) {
      groups.push({ label: group.label, tokens: matched });
      for (const t of matched) assigned.add(t.name);
    }
  }

  const remaining = themeTokens.filter((t) => !assigned.has(t.name));
  if (remaining.length > 0) {
    groups.push({ label: "Other", tokens: remaining });
  }

  return groups;
};

/** Category display order */
const CATEGORY_ORDER = [
  "colors", "spacing", "typography", "borders", "elevation", "motion", "sizing", "focus",
];

@customElement("theme-editor-view")
export class ThemeEditorViewElement extends LitElement {
  static override styles = [
    base,
    css`
      :host {
        display: flex;
        height: 100dvh;
        font-family: var(--font-sans);
        color: var(--foreground);
      }

      /* ---- Sidebar ---- */
      .sidebar {
        width: 360px;
        min-width: 280px;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        background: var(--surface-2);
        border-right: 1px solid var(--border);
        overflow: hidden;
      }

      .sidebar-header {
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        flex-shrink: 0;
      }

      .sidebar-title {
        font-size: var(--text-base);
        font-weight: var(--font-weight-bold);
        margin: 0;
      }

      dui-select {
        font-size: var(--text-xs);
      }

      .sidebar-scroll {
        flex: 1;
        min-height: 0;
      }

      .sidebar-scroll {
        --scroll-area-thumb-color: oklch(from var(--foreground) l c h / 0.5);
      }

      .sidebar-scroll::part(scrollbar-vertical) {
        opacity: 1;
        pointer-events: auto;
        width: 6px;
      }

      .sidebar-scroll::part(thumb-vertical) {
        opacity: 1;
      }

      .sidebar-scroll-inner {
        padding: 0 var(--space-6) var(--space-4) var(--space-4);
      }

      .sidebar-footer {
        padding: var(--space-2) var(--space-4);
        border-top: 1px solid var(--border);
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-1_5);
        flex-shrink: 0;
      }

      .sidebar-footer dui-button {
        --button-height: auto;
        --button-padding-y: var(--space-1);
        --button-padding-x: var(--space-2_5);
        --button-font-size: var(--text-xs);
      }

      /* ---- Collapsible category sections ---- */
      dui-collapsible {
        border: none;
      }

      /* ---- Sub-group label ---- */
      .color-subgroup-label {
        font-size: var(--text-xs);
        font-weight: var(--font-weight-semibold);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-2);
        padding: var(--space-2_5) 0 var(--space-1);
      }

      .color-subgroup-label:first-child {
        padding-top: 0;
      }

      /* ---- Resize handle ---- */
      .resize-handle {
        width: 4px;
        cursor: col-resize;
        background: transparent;
        flex-shrink: 0;
      }

      .resize-handle:hover,
      .resize-handle.active {
        background: var(--ring);
      }

      /* ---- iframe ---- */
      .preview {
        flex: 1;
        min-width: 0;
        display: flex;
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      /* ---- Toast ---- */
      .toast {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--foreground);
        color: var(--background);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 9999;
      }

      .toast.show {
        opacity: 1;
      }
    `,
  ];

  @state() accessor registry: TokenRegistry = new Map();
  @state() accessor overrides: Record<string, string> = {};
  @state() accessor targetUrl = IFRAME_TARGETS[0].url;
  @state() accessor toastMessage = "";
  @state() accessor toastVisible = false;
  @state() accessor resizing = false;

  @query("iframe") accessor iframeEl!: HTMLIFrameElement;
  @query(".sidebar") accessor sidebarEl!: HTMLElement;

  #disconnectIframe: (() => void) | undefined;
  #toastTimer: ReturnType<typeof setTimeout> | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this.registry = buildTokenRegistry();
    this.overrides = Persistence.loadOverrides();
    this.#pushOverridesToEngine();
  }

  override firstUpdated(): void {
    this.#disconnectIframe = connectIframe(this.iframeEl);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#disconnectIframe?.();
    if (this.#toastTimer) clearTimeout(this.#toastTimer);
  }

  /** Convert all overrides into TokenOverride[] and push to engine. */
  #pushOverridesToEngine = (): void => {
    const allOverrides: TokenOverride[] = [];

    for (const [compositeKey, value] of Object.entries(this.overrides)) {
      const { name, theme } = parseOverrideKey(compositeKey);
      allOverrides.push({ name, value, theme });
    }

    applyOverrides(allOverrides);
  };

  #onTokenChange = (e: CustomEvent<{ name: string; value: string; theme?: string }>): void => {
    e.stopPropagation();
    const { name, value, theme } = e.detail;
    const key = overrideKey(name, theme as "light" | "dark" | undefined);

    this.overrides = { ...this.overrides, [key]: value };
    Persistence.saveOverrides(this.overrides);
    this.#pushOverridesToEngine();
  };

  #onTargetChange = (e: CustomEvent<{ value: string }>): void => {
    this.targetUrl = e.detail.value;
    this.#disconnectIframe?.();
    this.updateComplete.then(() => {
      this.#disconnectIframe = connectIframe(this.iframeEl);
    });
  };

  #copyTokensCSS = async (): Promise<void> => {
    if (Object.keys(this.overrides).length === 0) {
      this.#showToast("No overrides to copy");
      return;
    }
    const content = generateTokensCSS(this.registry, this.overrides);
    await navigator.clipboard.writeText(content);
    this.#showToast("Copied tokens.css");
  };

  #resetAll = (): void => {
    Persistence.clearOverrides();
    this.overrides = {};
    clearEngineOverrides();
    this.#showToast("All overrides reset");
  };

  #showToast = (message: string): void => {
    if (this.#toastTimer) clearTimeout(this.#toastTimer);
    this.toastMessage = message;
    this.toastVisible = true;
    this.#toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 2000);
  };

  /* ---- Resize ---- */

  #onResizeStart = (e: PointerEvent): void => {
    e.preventDefault();
    this.resizing = true;
    const handle = e.target as HTMLElement;
    handle.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent): void => {
      const newWidth = Math.max(280, Math.min(600, ev.clientX));
      this.sidebarEl.style.width = `${newWidth}px`;
    };

    const onUp = (): void => {
      this.resizing = false;
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  };

  #hasOverrides = (): boolean => Object.keys(this.overrides).length > 0;

  #getDisplayValue = (token: TokenDef): string =>
    this.overrides[overrideKey(token.name, token.theme)] ?? token.value;

  #isModified = (token: TokenDef): boolean =>
    overrideKey(token.name, token.theme) in this.overrides;

  #formatLabel = (category: string): string =>
    category.charAt(0).toUpperCase() + category.slice(1);

  #renderTokenEditor = (token: TokenDef): TemplateResult => html`
    <token-editor
      token-name="${token.name}"
      .value="${this.#getDisplayValue(token)}"
      .theme="${token.theme}"
      .modified="${this.#isModified(token)}"
    ></token-editor>
  `;

  #renderColorSubGroups = (themeTokens: TokenDef[]): TemplateResult => {
    const groups = groupColorTokens(themeTokens);
    return html`
      ${groups.map(
        (group) => html`
          <div class="color-subgroup-label">${group.label}</div>
          ${group.tokens.map((t) => this.#renderTokenEditor(t))}
        `,
      )}
    `;
  };

  #renderColorsSection = (allTokens: TokenDef[]): TemplateResult => {
    const brandTokens = allTokens.filter((t) => t.theme === undefined);
    const lightTokens = allTokens.filter((t) => t.theme === "light");
    const darkTokens = allTokens.filter((t) => t.theme === "dark");

    return html`
      ${brandTokens.length > 0
        ? html`
            <div class="color-subgroup-label">Brand</div>
            ${brandTokens.map((t) => this.#renderTokenEditor(t))}
          `
        : nothing}

      ${lightTokens.length > 0
        ? html`
            <dui-collapsible default-open>
              <span slot="trigger">Light theme</span>
              ${this.#renderColorSubGroups(lightTokens)}
            </dui-collapsible>
          `
        : nothing}

      ${darkTokens.length > 0
        ? html`
            <dui-collapsible>
              <span slot="trigger">Dark theme</span>
              ${this.#renderColorSubGroups(darkTokens)}
            </dui-collapsible>
          `
        : nothing}
    `;
  };

  override render(): TemplateResult {
    // Sort categories by predefined order
    const sortedEntries = [...this.registry.entries()].sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a[0]);
      const bi = CATEGORY_ORDER.indexOf(b[0]);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    return html`
      <div class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Theme Editor</h1>
          ${IFRAME_TARGETS.length > 1
            ? html`
                <dui-select
                  .options=${IFRAME_TARGETS.map((t) => ({ label: t.label, value: t.url }))}
                  .value=${this.targetUrl}
                  @value-change=${this.#onTargetChange}
                ></dui-select>
              `
            : nothing}
        </div>

        <dui-scroll-area class="sidebar-scroll" @token-change="${this.#onTokenChange}">
          <div class="sidebar-scroll-inner">
            ${sortedEntries.map(([category, categoryTokens]) => html`
              <dui-collapsible ?default-open=${category === "colors"}>
                <span slot="trigger">${this.#formatLabel(category)}</span>
                ${category === "colors"
                  ? this.#renderColorsSection(categoryTokens)
                  : categoryTokens.map((t) => this.#renderTokenEditor(t))}
              </dui-collapsible>
            `)}
          </div>
        </dui-scroll-area>

        <div class="sidebar-footer">
          ${this.#hasOverrides()
            ? html`<dui-button variant="primary" appearance="filled" size="sm" @click="${this.#copyTokensCSS}">Copy tokens.css</dui-button>`
            : nothing}
          <dui-button variant="danger" appearance="outline" size="sm" @click="${this.#resetAll}">Reset</dui-button>
        </div>
      </div>

      <div
        class="resize-handle ${this.resizing ? "active" : ""}"
        @pointerdown="${this.#onResizeStart}"
      ></div>

      <div class="preview">
        <iframe src="${this.targetUrl}"></iframe>
      </div>

      <div class="toast ${this.toastVisible ? "show" : ""}">${this.toastMessage}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "theme-editor-view": ThemeEditorViewElement;
  }
}
