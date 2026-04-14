import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Color token visualization for the Create page.
 * Shows Layer 1 primitives and their Layer 2 derived tokens.
 */
@customElement("block-colors")
export class BlockColors extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--text-1);
    }

    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-1);
      letter-spacing: var(--letter-spacing-tight);
    }

    .section-desc {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-6);
      max-width: 48ch;
      line-height: var(--line-height-relaxed);
    }

    /* ── Primitives row ── */

    .primitives {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-3);
      margin-bottom: var(--space-8);
    }

    .primitive {
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: var(--border-width-thin) solid var(--border);
    }

    .primitive-swatch {
      height: var(--space-24);
    }

    .primitive-info {
      padding: var(--space-3);
      background: var(--surface-2);
    }

    .primitive-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--space-0_5);
    }

    .primitive-token {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-2);
      margin: 0;
    }

    /* ── Derived groups ── */

    .derived-section {
      margin-bottom: var(--space-6);
    }

    .derived-section:last-child {
      margin-bottom: 0;
    }

    .derived-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-3);
    }

    .derived-source-dot {
      width: var(--space-3);
      height: var(--space-3);
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    .derived-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider);
      color: var(--text-2);
      margin: 0;
    }

    .derived-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
      gap: var(--space-2);
    }

    .derived-token {
      display: flex;
      align-items: center;
      gap: var(--space-2_5);
    }

    .derived-swatch {
      width: var(--space-16);
      height: var(--space-16);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
      border: var(--border-width-thin) solid var(--border);
    }

    .derived-meta {
      min-width: 0;
    }

    .derived-name {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    .derived-token-name {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-2);
      margin: 0;
    }

    /* ── Responsive ── */

    @container (max-width: 600px) {
      .primitives {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  override render() {
    return html`
      <p class="section-title">Color Tokens</p>
      <p class="section-desc">
        4 primitives define the entire palette. Every other color is derived at
        runtime via relative color syntax — no build step, no manual mapping.
      </p>

      <!-- Layer 1: Primitives -->
      <div class="primitives">
        <div class="primitive">
          <div class="primitive-swatch" style="background: var(--background)"></div>
          <div class="primitive-info">
            <p class="primitive-name">Background</p>
            <p class="primitive-token">--background</p>
          </div>
        </div>
        <div class="primitive">
          <div class="primitive-swatch" style="background: var(--foreground)"></div>
          <div class="primitive-info">
            <p class="primitive-name">Foreground</p>
            <p class="primitive-token">--foreground</p>
          </div>
        </div>
        <div class="primitive">
          <div class="primitive-swatch" style="background: var(--accent)"></div>
          <div class="primitive-info">
            <p class="primitive-name">Accent</p>
            <p class="primitive-token">--accent</p>
          </div>
        </div>
        <div class="primitive">
          <div class="primitive-swatch" style="background: var(--destructive)"></div>
          <div class="primitive-info">
            <p class="primitive-name">Destructive</p>
            <p class="primitive-token">--destructive</p>
          </div>
        </div>
      </div>

      <!-- Layer 2: Derived from --background -->
      <div class="derived-section">
        <div class="derived-header">
          <span class="derived-source-dot" style="background: var(--background); border: var(--border-width-thin) solid var(--border)"></span>
          <p class="derived-label">Derived from Background</p>
        </div>
        <div class="derived-grid">
          ${this.#derivedToken("Sunken", "--sunken", "var(--sunken)")}
          ${this.#derivedToken("Surface 1", "--surface-1", "var(--surface-1)")}
          ${this.#derivedToken("Surface 2", "--surface-2", "var(--surface-2)")}
          ${this.#derivedToken("Surface 3", "--surface-3", "var(--surface-3)")}
        </div>
      </div>

      <!-- Layer 2: Derived from --foreground -->
      <div class="derived-section">
        <div class="derived-header">
          <span class="derived-source-dot" style="background: var(--foreground)"></span>
          <p class="derived-label">Derived from Foreground</p>
        </div>
        <div class="derived-grid">
          ${this.#derivedToken("Text 1", "--text-1", "var(--text-1)")}
          ${this.#derivedToken("Text 2", "--text-2", "var(--text-2)")}
          ${this.#derivedToken("Text 3", "--text-3", "var(--text-3)")}
          ${this.#derivedToken("Border", "--border", "var(--border)")}
          ${this.#derivedToken("Border Strong", "--border-strong", "var(--border-strong)")}
          ${this.#derivedToken("Scrim", "--scrim", "var(--scrim)")}
        </div>
      </div>

      <!-- Layer 2: Derived from --accent -->
      <div class="derived-section">
        <div class="derived-header">
          <span class="derived-source-dot" style="background: var(--accent)"></span>
          <p class="derived-label">Derived from Accent</p>
        </div>
        <div class="derived-grid">
          ${this.#derivedToken("Accent Subtle", "--accent-subtle", "var(--accent-subtle)")}
          ${this.#derivedToken("Accent Text", "--accent-text", "var(--accent-text)")}
        </div>
      </div>

      <!-- Layer 2: Derived from --destructive -->
      <div class="derived-section">
        <div class="derived-header">
          <span class="derived-source-dot" style="background: var(--destructive)"></span>
          <p class="derived-label">Derived from Destructive</p>
        </div>
        <div class="derived-grid">
          ${this.#derivedToken("Destructive Subtle", "--destructive-subtle", "var(--destructive-subtle)")}
          ${this.#derivedToken("Destructive Text", "--destructive-text", "var(--destructive-text)")}
        </div>
      </div>
    `;
  }

  #derivedToken(name: string, token: string, color: string) {
    return html`
      <div class="derived-token">
        <div class="derived-swatch" style="background: ${color}"></div>
        <div class="derived-meta">
          <p class="derived-name">${name}</p>
          <p class="derived-token-name">${token}</p>
        </div>
      </div>
    `;
  }
}
