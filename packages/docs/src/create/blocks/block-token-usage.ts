import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";

interface ModelBudget {
  model: string;
  tokensUsed: number;
  tokenBudget: number;
  costPerMToken: number;
}

const MODELS: ModelBudget[] = [
  {
    model: "Claude Sonnet",
    tokensUsed: 18_400_000,
    tokenBudget: 25_000_000,
    costPerMToken: 3.0,
  },
  {
    model: "GPT-4o",
    tokensUsed: 6_200_000,
    tokenBudget: 20_000_000,
    costPerMToken: 2.5,
  },
];

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function formatCost(n: number): string {
  return `$${n.toFixed(2)}`;
}

@customElement("block-token-usage")
export class BlockTokenUsage extends LitElement {
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    /* Header */
    dui-card::part(header) {
      padding-bottom: 0;
    }

    dui-card::part(footer) {
      border-top: var(--border-width-thin) solid oklch(from var(--foreground) l c h / 0.07);
      background-color: var(--sunken-1);
    }

    .model-card {
      background: var(--surface-1);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-4);
    }

    .model-card + .model-card {
      margin-top: var(--space-3);
    }

    .model-label {
      font-size: var(--text-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-widest);
      color: var(--text-2);
      margin: 0 0 var(--space-3);
      text-box: trim-both cap alphabetic;
    }

    .token-count {
      font-size: var(--text-3xl);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--space-3);
      line-height: var(--line-height-none);
      text-box: trim-both cap alphabetic;
    }

    .progress-track {
      width: 100%;
      height: var(--space-1_5);
      background: oklch(from var(--foreground) l c h / 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--space-2);
    }

    .progress-fill {
      height: 100%;
      border-radius: var(--radius-full);
      background: var(--accent);
      transition: width 0.3s ease;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .pct {
      font-size: var(--text-xs);
      color: var(--text-2);
    }

    .cost {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-semibold);
    }

    .add-budget {
      margin-top: var(--space-5);
      --button-width: 100%;
    }
  `];

  override render() {
    return html`
      <dui-card>
        <span slot="title">Token Usage</span>
        <span slot="description">Active budgets for April 2026</span>

        ${MODELS.map((m) => {
          const pct = Math.round((m.tokensUsed / m.tokenBudget) * 100);
          const cost = (m.tokensUsed / 1_000_000) * m.costPerMToken;

          return html`
            <div class="model-card">
              <p class="model-label">${m.model}</p>
              <p class="token-count">${formatTokens(m.tokensUsed)}</p>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${Math.min(pct, 100)}%"></div>
              </div>
              <div class="meta-row">
                <span class="pct">${pct}% of ${formatTokens(m.tokenBudget)} budget</span>
                <span class="cost">${formatCost(cost)}</span>
              </div>
            </div>
          `;
        })}

        <dui-button slot="footer" variant="primary" class="add-budget">Add Budget</dui-button>
      </dui-card>
    `;
  }
}
