import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { createHighlighter } from "shiki";
import { getActiveTheme } from "@dui/core/apply-theme";
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
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-4);
      overflow: hidden;
    }

    .label {
      padding: var(--space-2) var(--space-4);
      font-weight: 600;
      font-size: var(--font-size-sm);
      border-bottom: var(--border-width-thin) solid var(--border);
      background: var(--muted);
      color: var(--muted-foreground);
    }

    .demo {
      padding: var(--space-4);
    }

    .tabs {
      display: flex;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-4) 0;
      border-top: var(--border-width-thin) solid var(--border);
      background: var(--muted);
    }

    .tab {
      all: unset;
      cursor: pointer;
      padding: var(--space-1) var(--space-3);
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      color: var(--muted-foreground);
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }

    .tab:hover {
      color: var(--foreground);
    }

    .tab[aria-selected="true"] {
      color: var(--foreground);
      border-bottom-color: var(--foreground);
    }

    .code {
      background: var(--muted);
      padding: var(--space-3) var(--space-4);
      overflow-x: auto;
    }

    .code:not(.has-tabs) {
      border-top: var(--border-width-thin) solid var(--border);
    }

    pre {
      margin: 0;
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      line-height: 1.6;
      white-space: pre;
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

  @state()
  accessor #code = "";

  @state()
  accessor #highlightedHtml = "";

  @state()
  accessor #highlightedStyles = "";

  @state()
  accessor #highlightedSource = "";

  @state()
  accessor #activeTab: "html" | "styles" | "source" = "html";

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

      // Extract theme CSS for detected DUI components
      // Done inside .then() so applyTheme() has already run
      const tags = [
        ...new Set(
          [...this.#code.matchAll(/<(dui-[\w-]+)/g)].map((m) => m[1]!),
        ),
      ];
      const theme = getActiveTheme();
      if (theme) {
        const sections: string[] = [];
        for (const tag of tags) {
          const cssText = theme.styles.get(tag)?.cssText;
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
      ${this.label
        ? html`
          <div class="label">${this.label}</div>
        `
        : ""}
      <div class="demo">
        <slot></slot>
      </div>
      ${hasTabs
        ? html`
          <div class="tabs">
            <button
              class="tab"
              aria-selected=${this.#activeTab === "html"}
              @click=${() => (this.#activeTab = "html")}
            >HTML</button>
            ${hasStyles
              ? html`<button
                  class="tab"
                  aria-selected=${this.#activeTab === "styles"}
                  @click=${() => (this.#activeTab = "styles")}
                >Styles</button>`
              : nothing}
            ${hasSource
              ? html`<button
                  class="tab"
                  aria-selected=${this.#activeTab === "source"}
                  @click=${() => (this.#activeTab = "source")}
                >Source</button>`
              : nothing}
          </div>
        `
        : nothing}
      <div class="code ${hasTabs ? "has-tabs" : ""}">
        ${this.#activeTab === "styles" && hasStyles
          ? unsafeHTML(this.#highlightedStyles)
          : this.#activeTab === "source" && hasSource
            ? unsafeHTML(this.#highlightedSource)
            : this.#highlightedHtml
              ? unsafeHTML(this.#highlightedHtml)
              : html`<pre><code>${this.#code}</code></pre>`}
      </div>
    `;
  }
}
