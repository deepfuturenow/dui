import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

const COLOR_TOKENS = [
  "background", "foreground",
  "card", "card-foreground",
  "popover", "popover-foreground",
  "primary", "primary-foreground",
  "secondary", "secondary-foreground",
  "muted", "muted-foreground",
  "accent", "accent-foreground",
  "destructive", "destructive-foreground",
  "success", "success-foreground",
  "warning", "warning-foreground",
  "info", "info-foreground",
  "border", "input", "ring",
];

@customElement("docs-page-colors")
export class DocsPageColors extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    h1 {
      font-size: var(--font-size-fluid-3xl, 2.5rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter, -0.03em);
      margin: 0 0 var(--space-2);
    }

    .subtitle {
      font-family: var(--font-mono);
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
      margin: 0 0 var(--space-8, 2rem);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-3);
    }

    .swatch {
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      overflow: hidden;
    }

    .swatch-color {
      height: 64px;
    }

    .swatch-info {
      padding: var(--space-2) var(--space-3);
    }

    .swatch-name {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 600;
    }

    .swatch-value {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
      margin-top: var(--space-0_5, 0.125rem);
    }
  `;

  @state()
  accessor #values: Map<string, string> = new Map();

  override connectedCallback(): void {
    super.connectedCallback();
    this.#readValues();
  }

  #readValues(): void {
    const style = getComputedStyle(document.documentElement);
    const map = new Map<string, string>();
    for (const token of COLOR_TOKENS) {
      map.set(token, style.getPropertyValue(`--${token}`).trim());
    }
    this.#values = map;
  }

  override render() {
    return html`
      <h1>Colors</h1>
      <p class="subtitle">Design tokens — semantic color palette from the active theme</p>

      <div class="grid">
        ${COLOR_TOKENS.map((token) => {
          const value = this.#values.get(token) || "";
          return html`
            <div class="swatch">
              <div class="swatch-color" style="background: var(--${token})"></div>
              <div class="swatch-info">
                <div class="swatch-name">--${token}</div>
                <div class="swatch-value">${value}</div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}
