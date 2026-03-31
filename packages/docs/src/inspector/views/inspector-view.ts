/**
 * Inspector View — root orchestrator.
 *
 * Toggle: Cmd+Shift+I (Mac) / Ctrl+Shift+I
 * Active mode: hover highlights DUI components, click inspects them.
 * Esc: close panel first, then deactivate.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { inspectElement } from "../lib/introspect.ts";
import type { ComponentInspection } from "../lib/types.ts";
import "../components/inspector-overlay.ts";
import "../components/inspector-panel.ts";
import type { InspectorOverlayElement } from "../components/inspector-overlay.ts";

/** Walk up the DOM tree to find the nearest dui-* ancestor (or self). */
function findDuiAncestor(el: Element | null): HTMLElement | null {
  while (el) {
    if (
      el instanceof HTMLElement &&
      el.tagName.toLowerCase().startsWith("dui-") &&
      el.shadowRoot
    ) {
      return el;
    }
    // Walk through shadow DOM boundaries
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

@customElement("inspector-view")
export class InspectorViewElement extends LitElement {
  static override styles = css`
    :host {
      display: contents;
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
  `;

  @state() accessor #active = false;
  @state() accessor #selectedElement: HTMLElement | null = null;
  @state() accessor #inspectionData: ComponentInspection | null = null;

  #overlay: InspectorOverlayElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this.#onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.#onKeyDown);
    this.#deactivate();
  }

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

    // Esc
    if (e.key === "Escape" && this.#active) {
      e.preventDefault();
      if (this.#inspectionData) {
        // Close panel first
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

  override firstUpdated(): void {
    this.#overlay = this.renderRoot.querySelector("inspector-overlay");
  }

  override render(): TemplateResult {
    return html`
      <inspector-overlay></inspector-overlay>

      ${this.#inspectionData
        ? html`<inspector-panel
            .data=${this.#inspectionData}
            @close-panel=${this.#onClosePanel}
          ></inspector-panel>`
        : nothing}

      ${this.#active && !this.#inspectionData
        ? html`<div class="activation-badge">Inspector Active — click a DUI component</div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "inspector-view": InspectorViewElement;
  }
}
