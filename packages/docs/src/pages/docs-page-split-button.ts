import { LitElement, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Save, Upload } from "lucide-static";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-split-button")
export class DocsPageSplitButton extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-split-button">
        <dui-docs-demo label="Basic">
        <dui-split-button
          variant="primary"
          @dui-action=${() => console.log("Save clicked")}
        >
          Save
          <dui-menu-item slot="menu" @click=${() => console.log("Save As")}>Save As…</dui-menu-item>
          <dui-menu-item slot="menu" @click=${() => console.log("Save Draft")}>Save Draft</dui-menu-item>
          <dui-menu-item slot="menu" @click=${() => console.log("Save Template")}>Save as Template</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>

      <dui-docs-demo label="Variant × Appearance">
        <table style="border-collapse: collapse; font-family: var(--font-sans); font-size: var(--text-sm);">
          <thead>
            <tr>
              <th style="padding: var(--space-2) var(--space-4); text-align: left; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;"></th>
              <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;">Neutral</th>
              <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;">Primary</th>
              <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;">Danger</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Filled</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button>Neutral<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="primary">Primary<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="danger">Danger<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Soft</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button appearance="soft">Neutral<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="primary" appearance="soft">Primary<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="danger" appearance="soft">Danger<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Outline</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button appearance="outline">Neutral<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="primary" appearance="outline">Primary<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="danger" appearance="outline">Danger<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Ghost</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button appearance="ghost">Neutral<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="primary" appearance="ghost">Primary<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-split-button variant="danger" appearance="ghost">Danger<dui-menu-item slot="menu">Option A</dui-menu-item><dui-menu-item slot="menu">Option B</dui-menu-item></dui-split-button></td>
            </tr>
          </tbody>
        </table>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <docs-row>
          <dui-split-button variant="primary" size="xs">
            X-Small
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary" size="sm">
            Small
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary">
            Medium
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary" size="lg">
            Large
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="With icon">
        <dui-split-button variant="primary">
          <dui-icon>${unsafeHTML(Save)}</dui-icon>
          Save
          <dui-menu-item slot="menu">Save As…</dui-menu-item>
          <dui-menu-item slot="menu">Save Draft</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>

      <dui-docs-demo label="Icon Only">
        <docs-row>
          <dui-split-button variant="primary" style="--sb-action-padding-x: var(--sb-trigger-padding-x); --sb-action-padding-y: 0;">
            <dui-icon>${unsafeHTML(Save)}</dui-icon>
            <dui-menu-item slot="menu">Save As…</dui-menu-item>
            <dui-menu-item slot="menu">Save Draft</dui-menu-item>
          </dui-split-button>

          <dui-split-button appearance="outline" style="--sb-action-padding-x: var(--sb-trigger-padding-x); --sb-action-padding-y: 0;">
            <dui-icon>${unsafeHTML(Upload)}</dui-icon>
            <dui-menu-item slot="menu">Upload File</dui-menu-item>
            <dui-menu-item slot="menu">Upload Folder</dui-menu-item>
          </dui-split-button>

        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Custom styling">
        <dui-split-button style="--sb-height: var(--component-height-xl); --sb-radius: var(--radius-sm); --sb-bg: oklch(0.35 0.2 300); --sb-trigger-bg: oklch(0.26 0.2 300); --sb-fg: oklch(0.98 0.02 300); --sb-border: oklch(0 0 0 / 1); --sb-divider: oklch(0 0 0 / 0.3); --sb-trigger-icon-size: var(--space-2_5); --sb-action-padding-x: var(--space-3); --sb-action-padding-y: 0;">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cube-spark"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v-4.01a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.02 2.02 0 0 0 -2 0l-7 4.008c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7 4.008c.62 .354 1.38 .354 2 0" /><path d="M12 22v-10" /><path d="M12 12l8.73 -5.04" /><path d="M3.27 6.96l8.73 5.04" /><path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" /></svg></dui-icon>
            <dui-icon slot="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" /></svg></dui-icon>
            <dui-menu-item slot="menu">Upload File</dui-menu-item>
            <dui-menu-item slot="menu">Upload Folder</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-split-button variant="primary" disabled>
          Save
          <dui-menu-item slot="menu">Save As…</dui-menu-item>
          <dui-menu-item slot="menu">Save Draft</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>

      <dui-docs-demo label="With disabled menu items">
        <dui-split-button variant="primary">
          Publish
          <dui-menu-item slot="menu">Publish Now</dui-menu-item>
          <dui-menu-item slot="menu" disabled>Schedule (unavailable)</dui-menu-item>
          <dui-menu-item slot="menu" variant="danger">Unpublish</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
