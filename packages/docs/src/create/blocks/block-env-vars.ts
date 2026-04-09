import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

const VARS = [
  { key: "DATABASE_URL", value: "postgres://••••••••" },
  { key: "NEXT_PUBLIC_API", value: "https://api.example.com" },
  { key: "STRIPE_SECRET", value: "sk_live_••••••••" },
  { key: "REDIS_URL", value: "redis://••••••••" },
  { key: "JWT_SECRET", value: "••••••••••••••••" },
];

@customElement("block-env-vars")
export class BlockEnvVars extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .title {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .subtitle {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
    }

    .var-list {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--space-4);
    }

    .var-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2) 0;
      border-bottom: var(--border-width-thin, 1px) solid var(--border);
      font-size: var(--font-size-sm, 0.875rem);
    }

    .var-row:last-child {
      border-bottom: none;
    }

    .var-key {
      font-family: var(--font-mono, monospace);
      font-weight: 500;
    }

    .var-value {
      color: var(--text-2);
      font-family: var(--font-mono, monospace);
      font-size: var(--font-size-xs, 0.75rem);
    }

    .footer {
      display: flex;
      gap: var(--space-2);
      justify-content: flex-end;
    }
  `;

  override render() {
    return html`
      <p class="title">Environment Variables</p>
      <p class="subtitle">Production · ${VARS.length} variables</p>
      <div class="var-list">
        ${VARS.map(
          (v) => html`
            <div class="var-row">
              <span class="var-key">${v.key}</span>
              <span class="var-value">${v.value}</span>
            </div>
          `,
        )}
      </div>
      <div class="footer">
        <dui-button appearance="outline" size="sm">Edit</dui-button>
        <dui-button size="sm">Deploy</dui-button>
      </div>
    `;
  }
}
