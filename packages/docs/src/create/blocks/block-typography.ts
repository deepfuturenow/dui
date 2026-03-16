import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

const COLORS = [
  { token: "primary", label: "Primary" },
  { token: "secondary", label: "Secondary" },
  { token: "accent", label: "Accent" },
  { token: "muted", label: "Muted" },
  { token: "destructive", label: "Destructive" },
  { token: "background", label: "Background" },
  { token: "foreground", label: "Foreground" },
  { token: "card", label: "Card" },
  { token: "popover", label: "Popover" },
  { token: "border", label: "Border" },
];

@customElement("block-typography")
export class BlockTypography extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--card);
      color: var(--card-foreground);
    }

    .font-name {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 700;
      margin: 0 0 var(--space-1);
      font-family: var(--font-sans);
    }

    .pangram {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-4);
      font-family: var(--font-sans);
      line-height: 1.5;
    }

    .swatch-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--space-2);
    }

    .swatch-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .swatch {
      width: 100%;
      aspect-ratio: 2 / 1;
      border-radius: var(--radius-md, 0.5rem);
      border: var(--border-width-thin, 1px) solid var(--border);
    }

    .swatch-label {
      font-size: 10px;
      color: var(--muted-foreground);
      text-align: center;
      text-transform: capitalize;
    }
  `;

  override render() {
    return html`
      <div class="font-name">Font Family</div>
      <p class="pangram">
        The quick brown fox jumps over the lazy dog. Pack my box with five dozen
        liquor jugs.
      </p>
      <div class="swatch-grid">
        ${COLORS.map(
          (c) => html`
            <div class="swatch-item">
              <div
                class="swatch"
                style="background: var(--${c.token})"
              ></div>
              <span class="swatch-label">${c.label}</span>
            </div>
          `,
        )}
      </div>
    `;
  }
}
