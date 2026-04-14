import { LitElement, html, css } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

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
  static override styles = [blockBase, css`
    :host {
      padding: var(--space-6);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-1);
    }

    .title {
      font-size: var(--font-size-base);
      font-weight: 600;
      margin: 0;
    }

    .subtitle {
      font-size: var(--font-size-xs);
      color: var(--text-2);
      margin: 0 0 var(--space-5);
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
      font-size: var(--font-size-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-2);
      margin: 0 0 var(--space-1);
    }

    .token-count {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      margin: 0 0 var(--space-3);
      line-height: 1.1;
    }

    .progress-track {
      width: 100%;
      height: 6px;
      background: var(--surface-3);
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
      font-size: var(--font-size-xs);
      color: var(--text-3);
    }

    .cost {
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    .add-budget {
      margin-top: var(--space-5);
      --button-width: 100%;
    }
  `];

  override render() {
    return html`
      <div class="header">
        <p class="title">Token Usage</p>
      </div>
      <p class="subtitle">Active budgets for April 2026</p>

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

      <dui-button variant="primary" class="add-budget">Add Budget</dui-button>
    `;
  }
}
