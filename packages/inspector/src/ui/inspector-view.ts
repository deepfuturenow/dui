/**
 * Inspector View — root orchestrator for the DUI inspector.
 *
 * Toggle: Ctrl+Shift+I
 * Active mode: hover highlights DUI components, click inspects them.
 * Esc: close panel first, then deactivate.
 *
 * Tabs: Inspect | Tokens | Styles
 * Toolbar: Copy changes, Undo, change count
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { inspectElement } from "../lib/introspect.ts";
import { exportChangeset } from "../lib/source-map.ts";
import { changelog } from "../lib/changelog.ts";
import type { ComponentInspection } from "../lib/types.ts";
import "./inspector-overlay.ts";
import "./inspector-panel.ts";
import "./token-editor-panel.ts";
import "./style-editor-panel.ts";
import type { InspectorOverlayElement } from "./inspector-overlay.ts";

type Tab = "inspect" | "tokens" | "styles";

/** Walk up the DOM tree to find the nearest dui-* ancestor (or self). */
function findDuiAncestor(el: Element | null): HTMLElement | null {
  while (el) {
    if (
      el instanceof HTMLElement &&
      el.tagName.toLowerCase().startsWith("dui-") &&
      !el.tagName.toLowerCase().startsWith("dui-inspector") &&
      el.shadowRoot
    ) {
      return el;
    }
    if (el.parentElement) {
      el = el.parentElement;
    } else if ((el.getRootNode() as ShadowRoot).host) {
      el = (el.getRootNode() as ShadowRoot).host;
    } else {
      break;
    }
  }
  return null;
}

@customElement("dui-inspector")
export class InspectorViewElement extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    .panel-shell {
      position: fixed;
      top: 0;
      right: 0;
      width: 360px;
      height: 100dvh;
      background: #1e1e2e;
      color: #cdd6f4;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .tag-name {
      font-size: 14px;
      font-weight: 700;
      color: #89b4fa;
    }

    .class-name {
      font-size: 11px;
      color: #6c7086;
    }

    .close-btn {
      background: none;
      border: none;
      color: #6c7086;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      line-height: 1;
    }

    .close-btn:hover {
      color: #cdd6f4;
    }

    /* Tabs */
    .tab-bar {
      display: flex;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }

    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #6c7086;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 8px 12px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .tab-btn:hover {
      color: #a6adc8;
    }

    .tab-btn[data-active] {
      color: #89b4fa;
      border-bottom-color: #89b4fa;
    }

    /* Tab content */
    .tab-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #181825;
      border-top: 1px solid #313244;
      flex-shrink: 0;
    }

    .toolbar-btn {
      background: none;
      border: 1px solid #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    .toolbar-btn:hover {
      border-color: oklch(0.65 0.2 250);
      color: oklch(0.65 0.2 250);
    }

    .toolbar-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .change-count {
      margin-left: auto;
      font-size: 10px;
      color: #585b70;
    }

    .change-count[data-has-changes] {
      color: #f9e2af;
    }

    .activation-badge {
      position: fixed;
      bottom: 12px;
      left: 12px;
      background: oklch(0.65 0.2 250);
      color: white;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      z-index: 99997;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .copied-toast {
      position: fixed;
      bottom: 12px;
      right: 380px;
      background: #a6e3a1;
      color: #1e1e2e;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      z-index: 99997;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  @state() accessor #active = false;
  @state() accessor #selectedElement: HTMLElement | null = null;
  @state() accessor #inspectionData: ComponentInspection | null = null;
  @state() accessor #activeTab: Tab = "inspect";
  @state() accessor #changeCount = 0;
  @state() accessor #showCopiedToast = false;

  #overlay: InspectorOverlayElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this.#onKeyDown);
    // Track changelog changes
    changelog.subscribe(this.#onChangelogUpdate);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.#onKeyDown);
    changelog.unsubscribe(this.#onChangelogUpdate);
    this.#deactivate();
  }

  #onChangelogUpdate = (): void => {
    this.#changeCount = changelog.count;
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    // Ctrl+Shift+I
    if (e.shiftKey && e.ctrlKey && !e.metaKey && e.key === "I") {
      e.preventDefault();
      if (this.#active) {
        this.#deactivate();
      } else {
        this.#activate();
      }
      return;
    }

    if (e.key === "Escape" && this.#active) {
      e.preventDefault();
      if (this.#inspectionData) {
        this.#inspectionData = null;
        this.#selectedElement = null;
      } else {
        this.#deactivate();
      }
    }
  };

  #activate(): void {
    this.#active = true;
    document.addEventListener("mousemove", this.#onMouseMove, true);
    document.addEventListener("pointerdown", this.#onPointerDown, true);
    document.addEventListener("focusin", this.#onFocusIn, true);
  }

  #deactivate(): void {
    this.#active = false;
    this.#inspectionData = null;
    this.#selectedElement = null;
    this.#overlay?.hide();
    document.removeEventListener("mousemove", this.#onMouseMove, true);
    document.removeEventListener("pointerdown", this.#onPointerDown, true);
    document.removeEventListener("focusin", this.#onFocusIn, true);
  }

  #onMouseMove = (e: MouseEvent): void => {
    const deepest = e.composedPath()[0] as Element;
    const target = findDuiAncestor(deepest);
    if (target && target !== this.#selectedElement) {
      this.#overlay?.highlight(target);
    } else if (!target) {
      this.#overlay?.hide();
    }
  };

  #onPointerDown = (e: PointerEvent): void => {
    const deepest = e.composedPath()[0] as Element;
    const target = findDuiAncestor(deepest);
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    this.#selectedElement = target;
    this.#inspectionData = inspectElement(target);
    this.#overlay?.highlight(target);
  };

  #onFocusIn = (e: FocusEvent): void => {
    const deepest = e.composedPath()[0] as Element;
    const target = findDuiAncestor(deepest);
    if (target) {
      this.#selectedElement = target;
      this.#inspectionData = inspectElement(target);
      this.#overlay?.highlight(target);
    }
  };

  #onClosePanel = (): void => {
    this.#inspectionData = null;
    this.#selectedElement = null;
  };

  #setTab(tab: Tab): void {
    this.#activeTab = tab;
  }

  #reinspect = (): void => {
    if (this.#selectedElement) {
      this.#inspectionData = inspectElement(this.#selectedElement);
    }
  };

  #onUndo = (): void => {
    changelog.undo();
    this.#changeCount = changelog.count;
    this.#reinspect();
  };

  #onCopyChanges = async (): Promise<void> => {
    const changeset = exportChangeset();
    const json = JSON.stringify(changeset, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      this.#showCopiedToast = true;
      setTimeout(() => {
        this.#showCopiedToast = false;
      }, 2000);
    } catch (e) {
      console.error("Failed to copy to clipboard:", e);
    }
  };

  override firstUpdated(): void {
    this.#overlay = this.renderRoot.querySelector("dui-inspector-overlay");
  }

  override render(): TemplateResult {
    return html`
      <dui-inspector-overlay></dui-inspector-overlay>

      ${this.#inspectionData ? this.#renderPanel() : nothing}

      ${this.#active && !this.#inspectionData
        ? html`<div class="activation-badge">Inspector Active — click a DUI component</div>`
        : nothing}

      ${this.#showCopiedToast
        ? html`<div class="copied-toast">Changeset copied ✓</div>`
        : nothing}
    `;
  }

  #renderPanel(): TemplateResult {
    const d = this.#inspectionData!;

    return html`
      <div class="panel-shell">
        <!-- Header -->
        <div class="header">
          <div class="header-info">
            <span class="tag-name">&lt;${d.tagName}&gt;</span>
            <span class="class-name">${d.className}</span>
          </div>
          <button class="close-btn" @click=${this.#onClosePanel}>&times;</button>
        </div>

        <!-- Tab bar -->
        <div class="tab-bar">
          <button
            class="tab-btn"
            ?data-active=${this.#activeTab === "inspect"}
            @click=${() => this.#setTab("inspect")}
          >Inspect</button>
          <button
            class="tab-btn"
            ?data-active=${this.#activeTab === "tokens"}
            @click=${() => this.#setTab("tokens")}
          >Tokens</button>
          <button
            class="tab-btn"
            ?data-active=${this.#activeTab === "styles"}
            @click=${() => this.#setTab("styles")}
          >Styles</button>
        </div>

        <!-- Tab content -->
        <div class="tab-content">
          ${this.#activeTab === "inspect"
            ? html`<dui-inspector-panel .data=${d}></dui-inspector-panel>`
            : nothing}
          ${this.#activeTab === "tokens"
            ? html`<dui-inspector-token-editor
                .data=${d}
                .selector=${d.selector}
                @token-changed=${this.#reinspect}
              ></dui-inspector-token-editor>`
            : nothing}
          ${this.#activeTab === "styles"
            ? html`<dui-inspector-style-editor
                .data=${d}
                .targetElement=${this.#selectedElement}
                @style-changed=${this.#reinspect}
              ></dui-inspector-style-editor>`
            : nothing}
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
          <button
            class="toolbar-btn"
            @click=${this.#onCopyChanges}
            ?disabled=${this.#changeCount === 0}
          >Copy changes</button>
          <button
            class="toolbar-btn"
            @click=${this.#onUndo}
            ?disabled=${this.#changeCount === 0}
          >Undo</button>
          <span
            class="change-count"
            ?data-has-changes=${this.#changeCount > 0}
          >${this.#changeCount} change${this.#changeCount !== 1 ? "s" : ""}</span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dui-inspector": InspectorViewElement;
  }
}
