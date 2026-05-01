import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("docs-page-tree")
export class DocsPageTree extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  // ── Controlled mode state ────────────────────────────────────────────────
  @state()
  accessor #ctrlExpanded: string[] = ["src"];
  @state()
  accessor #ctrlSelected: string[] = ["readme"];

  // ── Async loading state ──────────────────────────────────────────────────
  // Track which branches have already been loaded so re-expand doesn't refetch.
  #asyncLoaded = new Set<string>();

  override connectedCallback(): void {
    super.connectedCallback();
    // Wire up the async-loading demo after the tree exists.
    requestAnimationFrame(() => this.#wireAsyncDemo());
  }

  #wireAsyncDemo(): void {
    const tree = this.querySelector<HTMLElement>("#async-tree");
    if (!tree) return;

    tree.addEventListener("dui-load-children", (e: Event) => {
      const ce = e as CustomEvent<{ value: string }>;
      const item = e.target as HTMLElement & { loading: boolean };
      if (!item || this.#asyncLoaded.has(ce.detail.value)) return;
      this.#asyncLoaded.add(ce.detail.value);

      item.loading = true;
      // Simulate a network fetch.
      setTimeout(() => {
        const fakeChildren = [
          {
            value: `${ce.detail.value}-a`,
            label: "Loaded item A",
            branch: true,
          },
          {
            value: `${ce.detail.value}-b`,
            label: "Loaded item B",
            branch: false,
          },
          {
            value: `${ce.detail.value}-c`,
            label: "Loaded item C",
            branch: false,
          },
        ];
        for (const c of fakeChildren) {
          const el = document.createElement("dui-tree-item") as HTMLElement & {
            value: string;
            hasChildren: boolean;
          };
          el.value = c.value;
          if (c.branch) el.hasChildren = true;
          el.innerHTML = `<span slot="label">${c.label}</span>`;
          item.appendChild(el);
        }
        item.loading = false;
      }, 700);
    });
  }

  // ── Controlled-mode handlers ─────────────────────────────────────────────
  #onCtrlExpanded = (e: Event) => {
    const ce = e as CustomEvent<{ values: string[] }>;
    this.#ctrlExpanded = ce.detail.values;
  };

  #onCtrlSelected = (e: Event) => {
    const ce = e as CustomEvent<{ values: string[] }>;
    this.#ctrlSelected = ce.detail.values;
  };

  override render() {
    return html`
      <docs-page-layout
        tag="dui-tree"
        .additionalTags="${["dui-tree-item"]}"
      >
        <dui-docs-demo label="Basic tree" demo-width="20rem">
          <dui-tree
            aria-label="Project files"
            default-expanded-values='["src"]'
          >
            <dui-tree-item value="src">
              <span slot="label">src</span>
              <span slot="end">3</span>
              <dui-tree-item value="index">
                <span slot="label">index.ts</span>
              </dui-tree-item>
              <dui-tree-item value="utils">
                <span slot="label">utils</span>
                <dui-tree-item value="helpers">
                  <span slot="label">helpers.ts</span>
                </dui-tree-item>
                <dui-tree-item value="types">
                  <span slot="label">types.ts</span>
                </dui-tree-item>
              </dui-tree-item>
              <dui-tree-item value="readme">
                <span slot="label">README.md</span>
                <span slot="end">✓</span>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="package">
              <span slot="label">package.json</span>
            </dui-tree-item>
            <dui-tree-item value="license">
              <span slot="label">LICENSE</span>
            </dui-tree-item>
          </dui-tree>
        </dui-docs-demo>

        <dui-docs-demo label="Single selection" demo-width="20rem">
          <dui-tree
            aria-label="Single-select tree"
            selection-mode="single"
            default-expanded-values='["fruits"]'
            default-selected-values='["apple"]'
          >
            <dui-tree-item value="fruits">
              <span slot="label">Fruits</span>
              <dui-tree-item value="apple">
                <span slot="label">Apple</span>
              </dui-tree-item>
              <dui-tree-item value="banana">
                <span slot="label">Banana</span>
              </dui-tree-item>
              <dui-tree-item value="cherry">
                <span slot="label">Cherry</span>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="vegetables">
              <span slot="label">Vegetables</span>
              <dui-tree-item value="carrot">
                <span slot="label">Carrot</span>
              </dui-tree-item>
              <dui-tree-item value="potato">
                <span slot="label">Potato</span>
              </dui-tree-item>
            </dui-tree-item>
          </dui-tree>
        </dui-docs-demo>

        <dui-docs-demo label="Multiple selection" demo-width="20rem">
          <dui-tree
            aria-label="Multi-select tree"
            selection-mode="multiple"
            default-expanded-values='["team"]'
            default-selected-values='["alice", "carol"]'
          >
            <dui-tree-item value="team">
              <span slot="label">Team</span>
              <dui-tree-item value="alice">
                <span slot="label">Alice</span>
                <span slot="end">PM</span>
              </dui-tree-item>
              <dui-tree-item value="bob">
                <span slot="label">Bob</span>
                <span slot="end">Dev</span>
              </dui-tree-item>
              <dui-tree-item value="carol">
                <span slot="label">Carol</span>
                <span slot="end">Design</span>
              </dui-tree-item>
              <dui-tree-item value="dan">
                <span slot="label">Dan</span>
                <span slot="end">Dev</span>
              </dui-tree-item>
            </dui-tree-item>
          </dui-tree>
        </dui-docs-demo>

        <dui-docs-demo label="Disabled subtree" demo-width="20rem">
          <dui-tree
            aria-label="Tree with disabled branch"
            selection-mode="single"
            default-expanded-values='["a","b"]'
          >
            <dui-tree-item value="a">
              <span slot="label">Active branch</span>
              <dui-tree-item value="a-1">
                <span slot="label">Item A.1</span>
              </dui-tree-item>
              <dui-tree-item value="a-2">
                <span slot="label">Item A.2</span>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="b" disabled>
              <span slot="label">Disabled branch (cascades)</span>
              <dui-tree-item value="b-1">
                <span slot="label">Disabled child</span>
              </dui-tree-item>
              <dui-tree-item value="b-2">
                <span slot="label">Disabled grandchild parent</span>
                <dui-tree-item value="b-2-1">
                  <span slot="label">Disabled grandchild</span>
                </dui-tree-item>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="c">
              <span slot="label">Another active item</span>
            </dui-tree-item>
          </dui-tree>
        </dui-docs-demo>

        <dui-docs-demo
          label="Hover does not bleed onto descendants"
          demo-width="20rem"
        >
          <p
            style="margin: 0 0 var(--space-2); font-size: var(--text-xs); color: var(--text-2);"
          >
            Hovering a parent should highlight only the parent row — never its
            children. This is the structural reason styles live on
            <code>::part(content)</code>, not <code>::part(root)</code>.
          </p>
          <dui-tree
            aria-label="Hover-bleed regression"
            default-expanded-values='["root","mid"]'
          >
            <dui-tree-item value="root">
              <span slot="label">Hover me</span>
              <dui-tree-item value="mid">
                <span slot="label">Middle</span>
                <dui-tree-item value="leaf-1">
                  <span slot="label">Leaf 1</span>
                </dui-tree-item>
                <dui-tree-item value="leaf-2">
                  <span slot="label">Leaf 2</span>
                </dui-tree-item>
              </dui-tree-item>
            </dui-tree-item>
          </dui-tree>
        </dui-docs-demo>

        <dui-docs-demo label="Async loading" demo-width="20rem">
          <p
            style="margin: 0 0 var(--space-2); font-size: var(--text-xs); color: var(--text-2);"
          >
            Set <code>has-children</code> on a branch with no slotted children. On
            first expand, the tree fires
            <code>dui-load-children</code>; the consumer fetches data, sets
            <code>loading</code> to show a spinner, and appends children when ready.
          </p>
          <dui-tree id="async-tree" aria-label="Async tree">
            <dui-tree-item value="remote-root" has-children>
              <span slot="label">Remote folder</span>
            </dui-tree-item>
            <dui-tree-item value="other-remote" has-children>
              <span slot="label">Another remote folder</span>
            </dui-tree-item>
            <dui-tree-item value="local">
              <span slot="label">Local item (no fetch)</span>
            </dui-tree-item>
          </dui-tree>
        </dui-docs-demo>

        <dui-docs-demo label="Controlled mode" demo-width="22rem">
          <div
            style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3); flex-wrap: wrap;"
          >
            <dui-button
              size="sm"
              variant="outline"
              @click="${() => this.#ctrlExpanded = ["src", "utils"]}"
            >Expand all</dui-button>
            <dui-button
              size="sm"
              variant="outline"
              @click="${() => this.#ctrlExpanded = []}"
            >Collapse all</dui-button>
            <dui-button
              size="sm"
              variant="outline"
              @click="${() => this.#ctrlSelected = ["helpers"]}"
            >Select helpers</dui-button>
            <dui-button
              size="sm"
              variant="outline"
              @click="${() => this.#ctrlSelected = []}"
            >Clear selection</dui-button>
          </div>
          <dui-tree
            aria-label="Controlled tree"
            selection-mode="single"
            .expandedValues="${this.#ctrlExpanded}"
            .selectedValues="${this.#ctrlSelected}"
            @dui-expanded-change="${this.#onCtrlExpanded}"
            @dui-selection-change="${this.#onCtrlSelected}"
          >
            <dui-tree-item value="src">
              <span slot="label">src</span>
              <dui-tree-item value="index">
                <span slot="label">index.ts</span>
              </dui-tree-item>
              <dui-tree-item value="utils">
                <span slot="label">utils</span>
                <dui-tree-item value="helpers">
                  <span slot="label">helpers.ts</span>
                </dui-tree-item>
                <dui-tree-item value="types">
                  <span slot="label">types.ts</span>
                </dui-tree-item>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="readme">
              <span slot="label">README.md</span>
            </dui-tree-item>
          </dui-tree>
          <pre
            style="margin-top: var(--space-3); font-size: var(--text-xs); color: var(--text-2);"
          >
            expanded: ${JSON.stringify(this.#ctrlExpanded)}
            selected: ${JSON.stringify(this.#ctrlSelected)}</pre>
          </dui-docs-demo>

          <dui-docs-demo label="Sizes" demo-width="auto">
            <div
              style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4);"
            >
              ${(["sm", "md", "lg"] as const).map(
                (size) =>
                  html`
                    <div>
                      <p
                        style="margin: 0 0 var(--space-2); font-size: var(--text-xs); color: var(--text-2);"
                      >
                        <code>size="${size}"</code>
                      </p>
                      <dui-tree
                        size="${size}"
                        aria-label="Size ${size}"
                        selection-mode="single"
                        default-expanded-values='["folder"]'
                        default-selected-values='["b"]'
                      >
                        <dui-tree-item value="folder">
                          <span slot="label">Folder</span>
                          <dui-tree-item value="a">
                            <span slot="label">Item A</span>
                            <span slot="end">12</span>
                          </dui-tree-item>
                          <dui-tree-item value="b">
                            <span slot="label">Item B</span>
                            <span slot="end">3</span>
                          </dui-tree-item>
                          <dui-tree-item value="nested">
                            <span slot="label">Nested</span>
                            <dui-tree-item value="deep">
                              <span slot="label">Deep child</span>
                            </dui-tree-item>
                          </dui-tree-item>
                        </dui-tree-item>
                      </dui-tree>
                    </div>
                  `,
              )}
            </div>
          </dui-docs-demo>

          <dui-docs-demo label="Long-label truncation" demo-width="16rem">
            <p
              style="margin: 0 0 var(--space-2); font-size: var(--text-xs); color: var(--text-2);"
            >
              Labels truncate with ellipsis by default; deeper nesting consumes
              horizontal space, so trailing slots stay visible.
            </p>
            <dui-tree
              aria-label="Truncation demo"
              default-expanded-values='["root"]'
            >
              <dui-tree-item value="root">
                <span slot="label"
                >A reasonably long folder name that exceeds the row width</span>
                <span slot="end">42</span>
                <dui-tree-item value="child">
                  <span slot="label"
                  >An even longer leaf label that should also truncate cleanly</span>
                  <span slot="end">9</span>
                </dui-tree-item>
              </dui-tree-item>
            </dui-tree>
          </dui-docs-demo>

          <dui-docs-demo label="Custom styling via tokens" demo-width="20rem">
            <p
              style="margin: 0 0 var(--space-2); font-size: var(--text-xs); color: var(--text-2);"
            >
              Override <code>--dui-tree-selected-bg</code>,
              <code>--dui-tree-indent</code>, and
              <code>--dui-tree-row-spacing</code> per-tree.
            </p>
            <dui-tree
              aria-label="Custom-themed tree"
              selection-mode="single"
              default-expanded-values='["a"]'
              default-selected-values='["a-2"]'
              style="--dui-tree-selected-bg: oklch(from var(--accent) l c h / 0.18);
                --dui-tree-indent: var(--space-7);
                --dui-tree-row-spacing: var(--space-0_5);
                --dui-tree-row-radius: var(--radius-md);"
              >
                <dui-tree-item value="a">
                  <span slot="label">Custom theme</span>
                  <dui-tree-item value="a-1">
                    <span slot="label">Wider indent</span>
                  </dui-tree-item>
                  <dui-tree-item value="a-2">
                    <span slot="label">Accent selection</span>
                  </dui-tree-item>
                  <dui-tree-item value="a-3">
                    <span slot="label">Vertical row spacing</span>
                  </dui-tree-item>
                </dui-tree-item>
              </dui-tree>
            </dui-docs-demo>

            <dui-docs-demo label="Keyboard reference" demo-width="auto">
              <table
                style="border-collapse: collapse; font-size: var(--text-sm); width: 100%; max-width: 36rem;"
              >
                <thead>
                  <tr style="text-align: left; border-bottom: 1px solid var(--border);">
                    <th style="padding: var(--space-2) var(--space-3);">Key</th>
                    <th style="padding: var(--space-2) var(--space-3);">Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    ["↓", "Move focus to next visible item"],
                    ["↑", "Move focus to previous visible item"],
                    [
                      "→",
                      "Closed branch: expand. Open branch: focus first child. Leaf: nothing.",
                    ],
                    [
                      "←",
                      "Open branch: collapse. Closed branch / leaf: focus parent.",
                    ],
                    [
                      "Enter",
                      "Activate (selects, or fires dui-action on a leaf)",
                    ],
                    ["Space", "Toggle selection (or activate)"],
                    ["Home / End", "First / last visible item"],
                    ["*", "Expand all sibling branches at this level"],
                    [
                      "a-z",
                      "Type-ahead: jump to next item starting with typed chars",
                    ],
                  ].map(
                    ([k, d]) =>
                      html`
                        <tr style="border-bottom: 1px solid var(--border);">
                          <td
                            style="padding: var(--space-2) var(--space-3); font-family: var(--font-mono); white-space: nowrap;"
                          >
                            ${k}
                          </td>
                          <td style="padding: var(--space-2) var(--space-3); color: var(--text-2);">
                            ${d}
                          </td>
                        </tr>
                      `,
                  )}
                </tbody>
              </table>
            </dui-docs-demo>
          </docs-page-layout>
        `;
      }
    }
