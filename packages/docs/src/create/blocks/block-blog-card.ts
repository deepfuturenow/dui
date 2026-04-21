import { LitElement, html, css } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

@customElement("block-blog-card")
export class BlockBlogCard extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      overflow: hidden;
    }

    .image-placeholder {
      width: 100%;
      height: 160px;
      background: linear-gradient(135deg, var(--surface-1) 0%, var(--accent) 100%);
    }

    .content {
      padding: var(--space-6);
    }

    .content h3 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--space-2);
      line-height: var(--text-xl--line-height);
    }

    .content p {
      font-size: var(--text-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
      line-height: var(--line-height-normal);
    }

    .footer {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
  `];

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
