import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

const lucide = (paths: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const icons = {
  clipboard: lucide('<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'),
  eye: lucide('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'),
  trash2: lucide('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>'),
  upload: lucide('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>'),
  ellipsis: lucide('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),
  arrowLeft: lucide('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
  arrowRight: lucide('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  check: lucide('<path d="M20 6 9 17l-5-5"/>'),
  x: lucide('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  search: lucide('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
};

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
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.clipboard}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.eye}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.trash2}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.upload}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.ellipsis}></dui-icon>
          </dui-button>
        </dui-toolbar>

        <dui-toolbar>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.arrowLeft}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.arrowRight}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.check}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.x}></dui-icon>
          </dui-button>
          <dui-button slot="left" appearance="ghost" size="icon-sm">
            <dui-icon .innerHTML=${icons.search}></dui-icon>
          </dui-button>
        </dui-toolbar>
      </div>
    `;
  }
}
