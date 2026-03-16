import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-toolbar")
export class BlockToolbar extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--card);
      color: var(--card-foreground);
    }

    .toolbars {
      display: flex;
      flex-direction: column;
      gap: var(--space-3, 0.75rem);
    }
  `;

  override render() {
    return html`
      <div class="toolbars">
        <dui-toolbar>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="clipboard" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="eye" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="trash-2" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="upload" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="square-check" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="ellipsis" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="refresh-cw" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="plus" size="16"></dui-icon>
          </dui-button>
        </dui-toolbar>

        <dui-toolbar>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="minus" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="arrow-left" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="arrow-right" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="check" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="x" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="ellipsis-vertical" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="chevron-right" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="search" size="16"></dui-icon>
          </dui-button>
          <dui-button slot="left" variant="ghost" size="icon-sm">
            <dui-icon name="settings" size="16"></dui-icon>
          </dui-button>
        </dui-toolbar>
      </div>
    `;
  }
}
