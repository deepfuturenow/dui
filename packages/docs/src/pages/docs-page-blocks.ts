import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-blocks")
export class DocsPageBlocks extends LitElement {
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

    .placeholder {
      font-family: var(--font-mono);
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
      margin-top: var(--space-8, 2rem);
      padding: var(--space-8, 2rem);
      border: var(--border-width-thin, 1px) dashed var(--border);
      border-radius: var(--radius-md, 0.5rem);
      text-align: center;
    }
  `;

  override render() {
    return html`
      <h1>Blocks</h1>
      <div class="placeholder">
        Composable block patterns coming soon.
      </div>
    `;
  }
}
