import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-popover")
export class DocsPagePopover extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    const popupHeading = "display: block; font-size: var(--text-xs); font-weight: var(--font-weight-semibold); text-box: trim-both cap alphabetic;";
    const popupBody = "display: block; color: var(--text-2); font-size: var(--text-xs); line-height: var(--text-xs--line-height); text-box: trim-both cap alphabetic";
    const popupWrap = "display: flex; flex-direction: column; gap: var(--space-4); max-width: var(--space-72);";

    return html`
      <docs-page-layout tag="dui-popover" .additionalTags=${["dui-popover-popup"]}>
        <dui-docs-demo label="Basic popover">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button appearance="outline">Open Popover</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <span style="${popupWrap}">
              <strong style="${popupHeading}">Popover Title</strong>
              <span style="${popupBody}">
                This is some popover content. Click outside to close. Veniam cupidatat sit incididunt consequat incididunt qui fugiat. Laboris id duis do velit ad aute sunt in sint ea. Dolor dolor anim laboris consequat do id veniam mollit Lorem elit duis elit. Anim id officia culpa fugiat laboris.
              </span>
            </span>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>

      <dui-docs-demo label="With close button">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button appearance="outline">With Close</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <span style="${popupWrap}">
              <span style="${popupBody}">
                Click button to close. Anim id officia culpa fugiat laboris. Laboris id duis do velit ad aute sunt in sint ea. Dolor dolor anim laboris consequat do id veniam mollit Lorem elit duis elit.
              </span>
              <dui-popover-close>
                <dui-button appearance="soft" size="sm">Close</dui-button>
              </dui-popover-close>
            </span>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>

      <dui-docs-demo label="Top placement">
        <dui-popover side="top">
          <dui-popover-trigger>
            <dui-button appearance="outline">Top Popover</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <span style="${popupWrap}">
              <span style="${popupBody}">
                Appears above the trigger
              </span>
            </span>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
