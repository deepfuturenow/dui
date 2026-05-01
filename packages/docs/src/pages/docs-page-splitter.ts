import { html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import type { DuiSplitter } from "@dui/components/splitter";

@customElement("docs-page-splitter")
export class DocsPageSplitter extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  @query("#collapse-demo-splitter")
  accessor #collapseDemoSplitter!: DuiSplitter;

  #expandSidebar = () => {
    this.#collapseDemoSplitter?.expandPanel("sidebar");
  };

  override render() {
    return html`
      <style>
      /* Demo frame: gives every splitter an explicit width AND height. */
      .splitter-frame {
        width: 100%;
        height: 240px;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--surface-1);
      }

      /* Panel content surface. The host owns flex-basis; paint here. */
      .splitter-frame dui-splitter-panel::part(root) {
        padding: var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--muted-foreground);
        background: var(--surface-1);
        height: 100%;
        overflow: auto;
      }

      .splitter-frame dui-splitter-panel:nth-of-type(even)::part(root) {
        background: var(--surface-2);
      }

      /* Nested-splitter host: drop padding so the inner splitter fills flush. */
      .splitter-frame dui-splitter-panel.nested::part(root) {
        padding: 0;
        background: transparent;
        overflow: hidden;
      }

      /* Demo-local handle override examples */
      .fat-handles {
        --splitter-handle-size: var(--space-4);
        --splitter-handle-visible-size: 3px;
      }
      .invisible-handles {
        --splitter-handle-size: var(--space-4);
        --splitter-handle-visible-size: 0;
      }
      .accent-handles {
        --splitter-handle-color: var(--accent);
        --splitter-handle-hover-color: var(--accent);
        --splitter-handle-visible-size: 2px;
      }
      </style>

      <docs-page-layout
        tag="dui-splitter"
        .additionalTags="${["dui-splitter-panel", "dui-splitter-handle"]}"
      >
        <dui-docs-demo label="Horizontal (default)" demo-width="100%">
          <div class="splitter-frame">
            <dui-splitter>
              <dui-splitter-panel panel-id="a">Panel A</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="b">Panel B</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="c">Panel C</dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Vertical with default sizes" demo-width="100%">
          <div class="splitter-frame">
            <dui-splitter orientation="vertical">
              <dui-splitter-panel panel-id="top" default-size="30">
                Top (30%)
              </dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="bottom" default-size="70">
                Bottom (70%)
              </dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Min/max constraints" demo-width="100%">
          <div class="splitter-frame">
            <dui-splitter>
              <dui-splitter-panel
                panel-id="sidebar"
                default-size="25"
                min-size="15"
                max-size="40"
              >
                Sidebar (15–40%)
              </dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="main">Main</dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo
          label="Fat handles (--splitter-handle-size, --splitter-handle-visible-size)"
          demo-width="100%"
        >
          <div class="splitter-frame fat-handles">
            <dui-splitter>
              <dui-splitter-panel panel-id="a">Panel A</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="b">Panel B</dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo
          label="Invisible line, fat hit area"
          description="Set --splitter-handle-visible-size: 0 to hide the line while keeping a generous hover/drag target. Useful when adjacent panels already have visual borders."
          demo-width="100%"
        >
          <div class="splitter-frame invisible-handles">
            <dui-splitter>
              <dui-splitter-panel panel-id="a">Hover the seam</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="b">Hover the seam</dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Accent-colored handles" demo-width="100%">
          <div class="splitter-frame accent-handles">
            <dui-splitter>
              <dui-splitter-panel panel-id="a">Panel A</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="b">Panel B</dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo
          label="Nested splitters"
          description="Drop a splitter inside a panel — each splitter creates its own context."
          demo-width="100%"
        >
          <div class="splitter-frame">
            <dui-splitter>
              <dui-splitter-panel panel-id="left">Left</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="right" class="nested">
                <dui-splitter orientation="vertical">
                  <dui-splitter-panel panel-id="right-top">
                    Right top
                  </dui-splitter-panel>
                  <dui-splitter-handle></dui-splitter-handle>
                  <dui-splitter-panel panel-id="right-bottom">
                    Right bottom
                  </dui-splitter-panel>
                </dui-splitter>
              </dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo
          label="Drag to collapse"
          description="Set the collapsible attribute on a panel (with min-size=0) to let users drag it shut. The panel auto-flips to data-collapsed, the splitter dispatches a collapse-change event, and expandPanel(id) restores the previous size."
          demo-width="100%"
        >
          <div class="splitter-frame">
            <dui-splitter id="collapse-demo-splitter">
              <dui-splitter-panel
                panel-id="sidebar"
                default-size="25"
                min-size="0"
                collapsible
              >
                Sidebar — drag the handle all the way left to collapse.
              </dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="main">
                <div
                  style="display:flex;flex-direction:column;gap:var(--space-2);align-items:flex-start;"
                >
                  <span>Main</span>
                  <button
                    type="button"
                    @click=${this.#expandSidebar}
                    style="font: inherit; padding: var(--space-1) var(--space-2); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-sm); background: var(--surface-1); cursor: pointer;"
                  >
                    Expand sidebar
                  </button>
                </div>
              </dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo
          label="Disabled (group-level)"
          description="Set disabled on the splitter to lock all handles."
          demo-width="100%"
        >
          <div class="splitter-frame">
            <dui-splitter disabled>
              <dui-splitter-panel panel-id="a">Panel A</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="b">Panel B</dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>

        <dui-docs-demo
          label="Auto-save (reload to verify)"
          description="Sizes persist to localStorage under the auto-save-id key. Drag the handle, refresh, and the layout returns."
          demo-width="100%"
        >
          <div class="splitter-frame">
            <dui-splitter auto-save-id="docs-splitter-demo">
              <dui-splitter-panel panel-id="a">Panel A</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="b">Panel B</dui-splitter-panel>
              <dui-splitter-handle></dui-splitter-handle>
              <dui-splitter-panel panel-id="c">Panel C</dui-splitter-panel>
            </dui-splitter>
          </div>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
