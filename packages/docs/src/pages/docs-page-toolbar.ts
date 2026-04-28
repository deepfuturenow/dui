import { LitElement, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Monitor, Code, PieChart, File, Settings, Share2, Upload } from "lucide-static";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-toolbar")
export class DocsPageToolbar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <style>
        .toolbar-icon-btn {
          --button-width: var(--button-height);
          --button-padding-x: 0;
          --button-padding-y: 0;
        }
      </style>

      <docs-page-layout tag="dui-toolbar">

        <!-- ── Demo 1: Editor toolbar ── -->
        <dui-docs-demo label="Editor toolbar" demo-width="30rem">
          <dui-toolbar size="lg" inset has-button-left has-button-right>

            <div slot="left" style="display:flex;align-items:center;gap:var(--space-1)">
              <dui-button class="toolbar-icon-btn" appearance="outline" size="sm" aria-label="Preview">
                <dui-icon>${unsafeHTML(Monitor)}</dui-icon>
              </dui-button>
              <dui-button appearance="outline" size="sm">
                <dui-icon>${unsafeHTML(Code)}</dui-icon>
                Code
              </dui-button>
              <dui-button class="toolbar-icon-btn" appearance="outline" size="sm" aria-label="Analytics">
                <dui-icon>${unsafeHTML(PieChart)}</dui-icon>
              </dui-button>
              <dui-button class="toolbar-icon-btn" appearance="outline" size="sm" aria-label="Files">
                <dui-icon>${unsafeHTML(File)}</dui-icon>
              </dui-button>
              <dui-button class="toolbar-icon-btn" appearance="outline" size="sm" aria-label="Settings">
                <dui-icon>${unsafeHTML(Settings)}</dui-icon>
              </dui-button>
            </div>

            <div slot="right" style="display:flex;align-items:center;gap:var(--space-1)">
              <dui-button appearance="outline" size="sm">
                <dui-icon>${unsafeHTML(Share2)}</dui-icon>
                Share
              </dui-button>
              <dui-button variant="primary" size="sm">
                <dui-icon>${unsafeHTML(Upload)}</dui-icon>
                Publish
              </dui-button>
            </div>

          </dui-toolbar>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
