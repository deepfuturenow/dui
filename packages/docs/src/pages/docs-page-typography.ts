import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * New type scale — each size is paired with a line-height variable.
 * Line-heights land on a 4px grid for body sizes, collapse to 1 for display.
 */
const TYPE_SCALE = [
  { name: "2xs",  token: "--text-2xs",  rawSize: "0.625rem",  lineHeight: "calc(0.75 / 0.625)",  leading: "12px" },
  { name: "xs",   token: "--text-xs",   rawSize: "0.75rem",   lineHeight: "calc(1 / 0.75)",      leading: "16px" },
  { name: "sm",   token: "--text-sm",   rawSize: "0.875rem",  lineHeight: "calc(1.25 / 0.875)",  leading: "20px" },
  { name: "base", token: "--text-base", rawSize: "1rem",      lineHeight: "calc(1.5 / 1)",       leading: "24px" },
  { name: "lg",   token: "--text-lg",   rawSize: "1.125rem",  lineHeight: "calc(1.75 / 1.125)",  leading: "28px" },
  { name: "xl",   token: "--text-xl",   rawSize: "1.25rem",   lineHeight: "calc(1.75 / 1.25)",   leading: "28px" },
  { name: "2xl",  token: "--text-2xl",  rawSize: "1.5rem",    lineHeight: "calc(2 / 1.5)",       leading: "32px" },
  { name: "3xl",  token: "--text-3xl",  rawSize: "1.875rem",  lineHeight: "calc(2.25 / 1.875)",  leading: "36px" },
  { name: "4xl",  token: "--text-4xl",  rawSize: "2.25rem",   lineHeight: "calc(2.5 / 2.25)",    leading: "40px" },
  { name: "5xl",  token: "--text-5xl",  rawSize: "3rem",      lineHeight: "1",                   leading: "48px" },
  { name: "6xl",  token: "--text-6xl",  rawSize: "3.75rem",   lineHeight: "1",                   leading: "60px" },
  { name: "7xl",  token: "--text-7xl",  rawSize: "4.5rem",    lineHeight: "1",                   leading: "72px" },
  { name: "8xl",  token: "--text-8xl",  rawSize: "6rem",      lineHeight: "1",                   leading: "96px" },
  { name: "9xl",  token: "--text-9xl",  rawSize: "8rem",      lineHeight: "1",                   leading: "128px" },
] as const;

@customElement("docs-page-typography")
export class DocsPageTypography extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    h1 {
      font-size: var(--text-2xl);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter);
      line-height: var(--text-2xl--line-height);
      margin: 0 0 var(--space-2);
    }

    .subtitle {
      font-size: var(--text-base);
      color: var(--text-2);
      margin: 0 0 var(--space-10);
      max-width: 40rem;
      line-height: var(--line-height-relaxed);
    }

    .subtitle code {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      background: var(--surface-2);
      padding: var(--space-0_5) var(--space-1);
      border-radius: var(--radius-sm);
    }

    /* ── Section headings ── */

    .section-heading {
      font-size: var(--text-lg);
      font-weight: 600;
      letter-spacing: var(--letter-spacing-tight);
      color: var(--foreground);
      margin: var(--space-12) 0 var(--space-2);
    }

    .section-heading:first-of-type {
      margin-top: 0;
    }

    .section-description {
      font-size: var(--text-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-5);
      max-width: 40rem;
      line-height: var(--line-height-relaxed);
    }

    .section-description code {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      background: var(--surface-2);
      padding: var(--space-0_5) var(--space-1);
      border-radius: var(--radius-sm);
    }

    /* ── Type scale cards ── */

    .scale-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .scale-card {
      display: grid;
      grid-template-columns: 5rem 1fr;
      gap: var(--space-4);
      align-items: baseline;
      padding: var(--space-3) var(--space-4);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface-2);
    }

    .scale-meta {
      display: flex;
      flex-direction: column;
      gap: var(--space-0_5);
      flex-shrink: 0;
    }

    .scale-name {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--foreground);
    }

    .scale-size {
      font-family: var(--font-mono);
      font-size: var(--text-2xs);
      color: var(--text-3);
    }

    .scale-sample {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--foreground);
    }

    /* ── Config table ── */

    .config-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--text-sm);
    }

    .config-table th {
      text-align: left;
      font-weight: 600;
      font-size: var(--text-xs);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider);
      color: var(--text-2);
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .config-table td {
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width-thin) solid var(--border);
      vertical-align: baseline;
    }

    .config-table tr:last-child td {
      border-bottom: none;
    }

    .config-table .cell-name {
      font-weight: 600;
      color: var(--foreground);
      white-space: nowrap;
    }

    .config-table .cell-token {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--text-2);
      white-space: nowrap;
    }

    .config-table .cell-value {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--text-3);
      white-space: nowrap;
    }

    /* ── Usage code block ── */

    .code-block {
      background: var(--surface-1);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-4) var(--space-5);
      overflow-x: auto;
      margin-bottom: var(--space-6);
    }

    .code-block pre {
      margin: 0;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      line-height: 1.7;
      color: var(--foreground);
      white-space: pre;
    }

    .code-block .comment {
      color: var(--text-3);
    }
  `;

  override render() {
    return html`
      <h1>Typography</h1>
      <p class="subtitle">
        The type scale pairs each <code>--text-*</code> size with a
        <code>--text-*--line-height</code> variable. Body sizes land on a 4px
        line-height grid; display sizes collapse to <code>line-height: 1</code>.
        Prose elements use <code>text-box: trim-both cap alphabetic</code> for
        baseline grid alignment.
      </p>

      <!-- Type scale visual samples -->
      <h2 class="section-heading">Type Scale</h2>
      <p class="section-description">
        Each step pairs a font size with a computed line-height that lands on
        the 4px spacing grid. Use the paired variables together for consistent
        typographic rhythm.
      </p>
      <div class="scale-list">
        ${TYPE_SCALE.map((t) => html`
          <div class="scale-card">
            <div class="scale-meta">
              <span class="scale-name">${t.name}</span>
              <span class="scale-size">${t.rawSize}</span>
            </div>
            <span
              class="scale-sample"
              style="
                font-size: var(${t.token});
                line-height: var(${t.token}--line-height);
              "
            >The quick brown fox jumps over the lazy dog</span>
          </div>
        `)}
      </div>

      <!-- Size + line-height table -->
      <h2 class="section-heading">Scale Reference</h2>
      <p class="section-description">
        Each size token and its paired line-height. The leading column shows the
        computed line-height in pixels at the default root font size.
      </p>
      <div class="code-block" style="margin-bottom: var(--space-6);">
        <table class="config-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Size Token</th>
              <th>Value</th>
              <th>Leading</th>
            </tr>
          </thead>
          <tbody>
            ${TYPE_SCALE.map((t) => html`
              <tr>
                <td class="cell-name">${t.name}</td>
                <td class="cell-token">${t.token}</td>
                <td class="cell-value">${t.rawSize}</td>
                <td class="cell-value">${t.leading}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <!-- Usage -->
      <h2 class="section-heading">Usage</h2>
      <p class="section-description">
        Reference the <code>--text-*</code> and <code>--text-*--line-height</code>
        tokens directly in CSS. Letter-spacing is applied separately at the
        heading or component level — it is not bundled into the size tokens.
      </p>
      <div class="code-block">
        <pre><span class="comment">/* Use the paired tokens directly */</span>
.my-element {
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

<span class="comment">/* Heading example with letter-spacing */</span>
.title {
  font-size: var(--text-3xl);
  line-height: var(--text-3xl--line-height);
  letter-spacing: var(--letter-spacing-tighter);
}

<span class="comment">/* Inside a Lit css template */</span>
static styles = css\`
  :host {
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
  }
\`;</pre>
      </div>
    `;
  }
}
