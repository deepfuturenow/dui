import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";

@customElement("block-dashboard")
export class BlockDashboard extends LitElement {
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    .label {
      font-size: var(--text-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-3);
    }

    .frame-container {
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--surface-1);
    }

    iframe {
      display: block;
      width: 100%;
      height: 500px;
      border: none;
    }
  `];

  /** Sync parent theme to iframe on load and on attribute changes. */
  #syncTheme = () => {
    const iframe = this.shadowRoot?.querySelector("iframe");
    if (!iframe?.contentDocument) return;
    const parentTheme = document.documentElement.getAttribute("data-theme");
    if (parentTheme) {
      iframe.contentDocument.documentElement.setAttribute("data-theme", parentTheme);
    } else {
      iframe.contentDocument.documentElement.removeAttribute("data-theme");
    }
  };

  #observer: MutationObserver | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.#observer = new MutationObserver(this.#syncTheme);
    this.#observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    this.#observer = null;
  }

  override render() {
    return html`
      <div class="label">Dashboard Exemplar</div>
      <div class="frame-container">
        <iframe
          src="/dashboard-exemplar.html"
          loading="lazy"
          @load=${this.#syncTheme}
        ></iframe>
      </div>
    `;
  }
}
