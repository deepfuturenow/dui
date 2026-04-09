import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-blog-card")
export class BlockBlogCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      background: var(--surface-2);
      color: var(--text-1);
      overflow: hidden;
    }

    .image-placeholder {
      width: 100%;
      height: 160px;
      background: linear-gradient(135deg, var(--surface-1) 0%, var(--accent) 100%);
    }

    .content {
      padding: var(--space-6, 1.5rem);
    }

    .content h3 {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0 0 var(--space-2);
      line-height: 1.4;
    }

    .content p {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
      line-height: 1.5;
    }

    .footer {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
  `;

  override render() {
    return html`
      <div class="image-placeholder"></div>
      <div class="content">
        <h3>Building Resilient Data Pipelines with Modern Tools</h3>
        <p>
          Explore techniques for creating fault-tolerant data pipelines that
          scale with your organization's needs.
        </p>
        <div class="footer">
          <dui-button size="sm">Create Query +</dui-button>
          <dui-badge variant="warning">Warning</dui-badge>
        </div>
      </div>
    `;
  }
}
