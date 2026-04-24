import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { createHighlighter } from "shiki";
import type { CSSResult } from "lit";
import { componentSources } from "./component-sources.ts";

const highlighterPromise = createHighlighter({
  themes: ["github-light", "dracula"],
  langs: ["html", "css", "typescript"],
});

// Shared theme observer — one MutationObserver for all instances
const themeListeners = new Set<() => void>();
const themeObserver = new MutationObserver(() => {
  for (const fn of themeListeners) fn();
});
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

@customElement("dui-docs-demo")
export class DuiDocsDemo extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--space-8);
      overflow: hidden;
      --demo-width: fit-content;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
    }

    .demo {
      padding: var(--space-3);
      background: var(--surface-2);
      border-bottom: none;
    }

    .demo-label {
      font-weight: 600;
      font-size: var(--text-sm);
      border: none;
      color: var(--foreground);
    }

    .demo-holder {
      padding: var(--space-3);
      display: flex;
      justify-content: center;
    }

    .demo-holder > ::slotted(*) {
      width: 100%;
      max-width: var(--demo-width);
    }

    /* Tabs overrides for code section */
    dui-tabs {
      background: var(--surface-1);
    }

    dui-tab::part(tab) {
      font-size: var(--text-xs);
      height: 2rem;
    }

    dui-tabs-list {
      padding: var(--space-0_5) var(--space-1_5);
      border-top: var(--border-width-thin) solid var(--border);
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    dui-tabs-panel {
      --tabs-panel-border-width: 0;
      --tabs-panel-padding: 0 0 0 var(--space-3);
    }

    .code {
      max-height: calc(var(--text-2xs) * 1.7 * 10 + var(--space-3) * 2);
      overflow-y: auto;
      font-size: var(--text-xs);
    }

    .code-only {
      padding: var(--space-3) var(--space-4);
      max-height: calc(var(--text-2xs) * 1.7 * 10 + var(--space-3) * 2);
      overflow-y: auto;
      background: var(--surface-1);
    }

    pre {
      margin: var(--space-3) 0;
      font-family: var(--font-mono);
      font-size: var(--text-2xs);
      line-height: 1.7;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Shiki dual-theme support */
    .shiki,
    .shiki span {
      color: var(--shiki-light);
      background-color: transparent;
    }

    :host([dark]) .shiki,
    :host([dark]) .shiki span {
      color: var(--shiki-dark) !important;
    }

    .shiki {
      background-color: transparent !important;
    }
  `;

  @property()
  accessor label = "";

  /** When set, constrains demo content to this max-width and centers it. */
  @property({ attribute: "demo-width" })
  accessor demoWidth = "";

  @state()
  accessor #code = "";

  @state()
  accessor #highlightedHtml = "";

  @state()
  accessor #highlightedStyles = "";

  @state()
  accessor #highlightedSource = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.#code = this.#dedent(this.innerHTML);

    this.#syncDark();
    themeListeners.add(this.#syncDark);

    highlighterPromise.then((highlighter) => {
      this.#highlightedHtml = highlighter.codeToHtml(this.#code, {
        lang: "html",
        themes: { light: "github-light", dark: "dracula" },
      });

      // Extract component CSS for detected DUI components
      const tags = [
        ...new Set(
          [...this.#code.matchAll(/<(dui-[\w-]+)/g)].map((m) => m[1]!),
        ),
      ];
      {
        const sections: string[] = [];
        for (const tag of tags) {
          const el = customElements.get(tag) as (typeof LitElement & { styles?: CSSResult | CSSResult[] }) | undefined;
          if (!el?.styles) continue;
          const styles = Array.isArray(el.styles) ? el.styles : [el.styles];
          // Get the last style (the aesthetic one), skip base reset
          const last = styles[styles.length - 1];
          const cssText = (last as CSSResult)?.cssText;
          if (cssText) {
            sections.push(`/* ${tag} */\n${cssText.trim()}`);
          }
        }
        const themeCss = sections.join("\n\n");
        if (themeCss) {
          this.#highlightedStyles = highlighter.codeToHtml(themeCss, {
            lang: "css",
            themes: { light: "github-light", dark: "dracula" },
          });
        }
      }

      // Build source tab from component source registry
      const sourceSections: string[] = [];
      for (const tag of tags) {
        const src = componentSources.get(tag);
        if (src) {
          sourceSections.push(`/* ${tag} */\n${src.trim()}`);
        }
      }
      const sourceText = sourceSections.join("\n\n");
      if (sourceText) {
        this.#highlightedSource = highlighter.codeToHtml(sourceText, {
          lang: "typescript",
          themes: { light: "github-light", dark: "dracula" },
        });
      }
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    themeListeners.delete(this.#syncDark);
  }

  #syncDark = (): void => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    this.toggleAttribute("dark", isDark);
  };

  #dedent(text: string): string {
    const lines = text.split("\n");

    // Trim leading/trailing empty lines
    while (lines.length && lines[0]!.trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1]!.trim() === "") lines.pop();

    // Find minimum indentation
    const indents = lines
      .filter((l) => l.trim().length > 0)
      .map((l) => l.match(/^(\s*)/)![1]!.length);
    const min = indents.length ? Math.min(...indents) : 0;

    return lines.map((l) => l.slice(min)).join("\n");
  }

  override render() {
    const hasStyles = this.#highlightedStyles !== "";
    const hasSource = this.#highlightedSource !== "";
    const hasTabs = hasStyles || hasSource;

    return html`
      <div
        class="demo"
        style="${this.demoWidth ? `--demo-width: ${this.demoWidth}` : ""}"
      >
        ${this.label ? html`<div class="demo-label">${this.label}</div>` : ""}
        <div class="demo-holder" part="demo-holder">
          <slot></slot>
        </div>
      </div>
      ${hasTabs
        ? html` <dui-tabs default-value="html">
            <dui-tabs-list>
              <dui-tab value="html">HTML</dui-tab>
              ${hasStyles
                ? html`<dui-tab value="styles">Styled Component</dui-tab>`
                : nothing}
              ${hasSource
                ? html`<dui-tab value="source">Primitive</dui-tab>`
                : nothing}
              <dui-tabs-indicator></dui-tabs-indicator>
            </dui-tabs-list>
            <dui-tabs-panel value="html">
              <div class="code">
                ${this.#highlightedHtml
                  ? unsafeHTML(this.#highlightedHtml)
                  : html`<pre><code>${this.#code}</code></pre>`}
              </div>
            </dui-tabs-panel>
            ${hasStyles
              ? html` <dui-tabs-panel value="styles">
                  <div class="code">${unsafeHTML(this.#highlightedStyles)}</div>
                </dui-tabs-panel>`
              : nothing}
            ${hasSource
              ? html` <dui-tabs-panel value="source">
                  <div class="code">${unsafeHTML(this.#highlightedSource)}</div>
                </dui-tabs-panel>`
              : nothing}
          </dui-tabs>`
        : html` <div class="code-only">
            ${this.#highlightedHtml
              ? unsafeHTML(this.#highlightedHtml)
              : html`<pre><code>${this.#code}</code></pre>`}
          </div>`}
    `;
  }
}
