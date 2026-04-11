/**
 * Style Editor Panel — edit the theme-component CSS layer for the inspected component.
 *
 * Shows all style layers with theme-component and user overrides editable.
 * CSS is rendered with syntax highlighting and proper indentation.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ComponentInspection } from "../lib/types.ts";
import { changelog } from "../lib/changelog.ts";

/** Format raw CSS rules with proper indentation. */
function formatCSS(cssText: string): string {
  // Split into individual rules and re-indent
  const lines: string[] = [];
  // Parse each rule
  const ruleTexts = cssText.split(/(?<=\})\s*/);
  for (const rule of ruleTexts) {
    const trimmed = rule.trim();
    if (!trimmed) continue;

    // Match selector { ... }
    const match = trimmed.match(/^([^{]+)\{([^}]*)\}$/s);
    if (match) {
      const selector = match[1].trim();
      const body = match[2].trim();
      lines.push(`${selector} {`);
      // Split properties
      const props = body.split(";").filter((p) => p.trim());
      for (const prop of props) {
        lines.push(`  ${prop.trim()};`);
      }
      lines.push("}");
      lines.push("");
    } else {
      lines.push(trimmed);
    }
  }
  return lines.join("\n").trim();
}

/**
 * Syntax-highlight CSS text into HTML spans.
 * Returns an array of TemplateResults for Lit rendering.
 */
function highlightCSS(cssText: string): TemplateResult[] {
  const formatted = formatCSS(cssText);
  const lines = formatted.split("\n");
  const results: TemplateResult[] = [];

  for (const line of lines) {
    results.push(html`<div class="code-line">${highlightLine(line)}</div>`);
  }
  return results;
}

/** Highlight a single line of CSS. */
function highlightLine(line: string): TemplateResult {
  const trimmed = line.trim();

  // Empty line
  if (!trimmed) return html`<br>`;

  // Closing brace
  if (trimmed === "}") {
    return html`<span class="hl-brace">${line}</span>`;
  }

  // Selector line (ends with {)
  if (trimmed.endsWith("{")) {
    const indent = line.match(/^\s*/)?.[0] ?? "";
    const selector = trimmed.slice(0, -1).trim();
    return html`${indent}<span class="hl-selector">${selector}</span> <span class="hl-brace">{</span>`;
  }

  // Property: value; line
  const propMatch = trimmed.match(/^([\w-]+)\s*:\s*(.+)$/);
  if (propMatch) {
    const indent = line.match(/^\s*/)?.[0] ?? "";
    const prop = propMatch[1];
    let value = propMatch[2];

    // Separate trailing semicolon
    const hasSemicolon = value.endsWith(";");
    if (hasSemicolon) value = value.slice(0, -1);

    // Check for CSS custom property name
    const isCustomProp = prop.startsWith("--");

    // Highlight var() references in value
    const valueParts = highlightValue(value);

    return html`${indent}<span class="${isCustomProp ? "hl-custom-prop" : "hl-property"}">${prop}</span><span class="hl-punctuation">: </span>${valueParts}${hasSemicolon ? html`<span class="hl-punctuation">;</span>` : nothing}`;
  }

  // Fallback
  return html`${line}`;
}

/** Highlight CSS values, including var() references and color values. */
function highlightValue(value: string): TemplateResult {
  // Split on var() calls
  const parts: TemplateResult[] = [];
  let remaining = value;

  while (remaining) {
    const varIdx = remaining.indexOf("var(");
    if (varIdx === -1) {
      parts.push(html`<span class="hl-value">${remaining}</span>`);
      break;
    }

    // Text before var()
    if (varIdx > 0) {
      parts.push(html`<span class="hl-value">${remaining.slice(0, varIdx)}</span>`);
    }

    // Find matching closing paren
    let depth = 0;
    let end = varIdx + 4;
    for (; end < remaining.length; end++) {
      if (remaining[end] === "(") depth++;
      if (remaining[end] === ")") {
        if (depth === 0) { end++; break; }
        depth--;
      }
    }

    const varCall = remaining.slice(varIdx, end);
    parts.push(html`<span class="hl-var">${varCall}</span>`);
    remaining = remaining.slice(end);
  }

  return html`${parts}`;
}

@customElement("dui-inspector-style-editor")
export class StyleEditorPanelElement extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    /* Collapsible layer sections */
    details.layer {
      border-bottom: 1px solid #313244;
    }

    details.layer > summary {
      display: flex;
      align-items: center;
      padding: 8px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #a6adc8;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      list-style: none;
    }

    details.layer > summary::-webkit-details-marker {
      display: none;
    }

    details.layer > summary::before {
      content: "▸";
      font-size: 10px;
      margin-right: 4px;
      transition: transform 0.15s ease;
      flex-shrink: 0;
    }

    details.layer[open] > summary::before {
      transform: rotate(90deg);
    }

    details.layer > summary .editable-badge {
      font-size: 9px;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: #a6e3a1;
      background: oklch(0.4 0.1 140 / 0.2);
      padding: 1px 5px;
      border-radius: 3px;
    }

    details.layer > summary .readonly-badge {
      font-size: 9px;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: #585b70;
      padding: 1px 5px;
    }

    /* Syntax-highlighted code block */
    .code-block {
      background: #11111b;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
      font-size: 11px;
      line-height: 1.6;
      padding: 8px 14px;
      border-top: 1px solid #313244;
      overflow-x: auto;
      max-height: 200px;
      overflow-y: auto;
    }

    .code-block.resizable {
      resize: vertical;
      max-height: none;
      height: 600px;
    }

    .code-line {
      white-space: pre;
    }

    /* Syntax highlighting colors (Catppuccin Mocha) */
    .hl-selector {
      color: #89b4fa; /* blue */
    }

    .hl-property {
      color: #89dceb; /* sky */
    }

    .hl-custom-prop {
      color: #cba6f7; /* mauve */
    }

    .hl-value {
      color: #a6e3a1; /* green */
    }

    .hl-var {
      color: #f9e2af; /* yellow */
    }

    .hl-punctuation {
      color: #6c7086; /* overlay0 */
    }

    .hl-brace {
      color: #6c7086; /* overlay0 */
    }

    .code-empty {
      color: #585b70;
      font-style: italic;
    }

    .editable-code {
      position: relative;
      cursor: text;
    }

    .editable-code:hover {
      background: #181825;
    }

    .edit-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background: #313244;
      border: none;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 3px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.1s ease;
    }

    .editable-code:hover .edit-btn {
      opacity: 1;
    }

    .edit-btn:hover {
      background: oklch(0.65 0.2 250);
      color: white;
    }

    /* Editable textarea */
    .css-editor {
      background: #11111b;
      color: #cdd6f4;
      font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
      font-size: 11px;
      line-height: 1.6;
      padding: 8px 14px;
      border: none;
      border-top: 1px solid #313244;
      width: 100%;
      min-height: 100px;
      resize: vertical;
      box-sizing: border-box;
      tab-size: 2;
    }

    .css-editor:focus {
      outline: none;
      background: #181825;
    }

    .empty {
      color: #585b70;
      font-style: italic;
      padding: 12px 14px;
    }

    .add-override-btn {
      display: block;
      margin: 8px 14px;
      background: none;
      border: 1px dashed #45475a;
      color: #a6adc8;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      width: calc(100% - 28px);
      text-align: center;
    }

    .add-override-btn:hover {
      border-color: oklch(0.65 0.2 250);
      color: oklch(0.65 0.2 250);
    }

    .error-msg {
      color: #f38ba8;
      font-size: 10px;
      padding: 4px 14px;
    }
  `;

  @property({ attribute: false })
  accessor data: ComponentInspection | null = null;

  /** The target element being inspected. */
  @property({ attribute: false })
  accessor targetElement: HTMLElement | null = null;

  @state() accessor _userOverrideCSS = "";
  @state() accessor _hasUserOverride = false;
  @state() accessor _errorMessage = "";
  /** Which layer index (or "user") is currently in edit mode. */
  @state() accessor _editingLayer: number | "user" | null = null;

  override render(): TemplateResult {
    if (!this.data || !this.targetElement) {
      return html`<div class="empty">Select a component</div>`;
    }

    const layers = this.data.styleLayers;

    return html`
      <div class="body">
        ${layers.map((layer, i) => {
          const isEditable = layer.layer === "theme-component";
          const defaultOpen = isEditable;
          const cssText = this.#getLayerCSS(i);
          return html`
            <details class="layer" ?open=${defaultOpen}>
              <summary>
                ${layer.layer}
                ${isEditable
                  ? html`<span class="editable-badge">editable</span>`
                  : html`<span class="readonly-badge">read-only</span>`}
              </summary>
              ${this._editingLayer === i
                ? html`<textarea
                    class="css-editor"
                    .value=${formatCSS(cssText)}
                    @change=${(e: Event) => this.#onEditThemeLayer(i, (e.target as HTMLTextAreaElement).value)}
                    @blur=${() => { this._editingLayer = null; }}
                    @keydown=${this.#onEditorKeyDown}
                    spellcheck="false"
                  ></textarea>`
                : cssText
                  ? html`<div
                      class="code-block ${isEditable ? "editable-code resizable" : ""}"
                      @dblclick=${isEditable ? () => { this._editingLayer = i; } : nothing}
                    >${highlightCSS(cssText)}${isEditable ? html`<button class="edit-btn" @click=${() => { this._editingLayer = i; }}>Edit</button>` : nothing}</div>`
                  : isEditable
                    ? html`<div class="code-block editable-code resizable" @dblclick=${() => { this._editingLayer = i; }}><span class="code-empty">(empty)</span><button class="edit-btn" @click=${() => { this._editingLayer = i; }}>Edit</button></div>`
                    : html`<div class="code-block"><span class="code-empty">(empty)</span></div>`}
            </details>
          `;
        })}

        <!-- User overrides layer -->
        <details class="layer" open>
          <summary>
            user overrides
            <span class="editable-badge">editable</span>
          </summary>
          ${this._hasUserOverride && this._editingLayer === "user"
            ? html`<textarea
                class="css-editor"
                .value=${this._userOverrideCSS}
                @change=${(e: Event) => this.#onEditUserOverride((e.target as HTMLTextAreaElement).value)}
                @blur=${() => { this._editingLayer = null; }}
                @keydown=${this.#onEditorKeyDown}
                spellcheck="false"
              ></textarea>`
            : this._hasUserOverride
            ? html`<div class="code-block editable-code" @dblclick=${() => { this._editingLayer = "user"; }}>
                ${this._userOverrideCSS.trim() ? highlightCSS(this._userOverrideCSS) : html`<span class="code-empty">(empty)</span>`}
                <button class="edit-btn" @click=${() => { this._editingLayer = "user"; }}>Edit</button>
              </div>`
            : html`<button class="add-override-btn" @click=${this.#addUserOverride}>
                + Add custom CSS override
              </button>`}
        </details>

        ${this._errorMessage
          ? html`<div class="error-msg">${this._errorMessage}</div>`
          : nothing}
      </div>
    `;
  }

  /** Handle Tab key in textarea to insert spaces instead of changing focus. */
  #onEditorKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value =
        textarea.value.substring(0, start) + "  " + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }
  };

  /** Extract CSS text from a specific adopted stylesheet index. */
  #getLayerCSS(index: number): string {
    const root = this.targetElement?.shadowRoot;
    if (!root) return "";

    const sheet = root.adoptedStyleSheets[index];
    if (!sheet) return "";

    try {
      return Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join("\n");
    } catch {
      return "(cross-origin — cannot read)";
    }
  }

  /** Edit the theme-component layer by replacing its stylesheet. */
  #onEditThemeLayer(index: number, newCSS: string): void {
    const root = this.targetElement?.shadowRoot;
    if (!root) return;

    const oldSheet = root.adoptedStyleSheets[index];
    const oldCSS = this.#getLayerCSS(index);

    try {
      const newSheet = new CSSStyleSheet();
      newSheet.replaceSync(newCSS);

      const sheets = [...root.adoptedStyleSheets];
      sheets[index] = newSheet;
      root.adoptedStyleSheets = sheets;

      this._errorMessage = "";

      changelog.add(
        "editThemeCSS",
        this.data?.selector ?? "",
        { layerIndex: index, oldCSS, newCSS },
        () => {
          const sheets = [...root.adoptedStyleSheets];
          sheets[index] = oldSheet;
          root.adoptedStyleSheets = sheets;
        },
      );

      this.dispatchEvent(
        new CustomEvent("style-changed", { bubbles: true, composed: true }),
      );
    } catch (e) {
      this._errorMessage = `CSS parse error: ${(e as Error).message}`;
    }
  }

  /** Add a user override stylesheet layer. */
  #addUserOverride(): void {
    this._hasUserOverride = true;
    this._userOverrideCSS = ":host {\n  \n}";
  }

  /** Edit the user override layer. */
  #onEditUserOverride(newCSS: string): void {
    const root = this.targetElement?.shadowRoot;
    if (!root) return;

    this._userOverrideCSS = newCSS;

    try {
      const newSheet = new CSSStyleSheet();
      newSheet.replaceSync(newCSS);

      // Check if we already have a user override sheet (last one beyond standard layers)
      const standardCount = this.data?.styleLayers.length ?? 0;
      const sheets = [...root.adoptedStyleSheets];

      if (sheets.length > standardCount) {
        sheets[sheets.length - 1] = newSheet;
      } else {
        sheets.push(newSheet);
      }
      root.adoptedStyleSheets = sheets;

      this._errorMessage = "";

      changelog.add(
        "editUserOverride",
        this.data?.selector ?? "",
        { css: newCSS },
      );

      this.dispatchEvent(
        new CustomEvent("style-changed", { bubbles: true, composed: true }),
      );
    } catch (e) {
      this._errorMessage = `CSS parse error: ${(e as Error).message}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dui-inspector-style-editor": StyleEditorPanelElement;
  }
}
