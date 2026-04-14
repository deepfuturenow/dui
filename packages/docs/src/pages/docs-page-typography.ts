import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Data from typography.ts typeScale — each step bundles font-size,
 * letter-spacing, and line-height so they are always set together.
 */
const TYPE_SCALE = [
  { name: "2xs",  fontSize: "var(--font-size-2xs)",  letterSpacing: "var(--letter-spacing-wider)",   lineHeight: "var(--line-height-normal)", rawSize: "0.65rem" },
  { name: "xs",   fontSize: "var(--font-size-xs)",   letterSpacing: "var(--letter-spacing-wide)",    lineHeight: "var(--line-height-normal)", rawSize: "0.75rem" },
  { name: "sm",   fontSize: "var(--font-size-sm)",   letterSpacing: "var(--letter-spacing-wide)",    lineHeight: "var(--line-height-normal)", rawSize: "0.875rem" },
  { name: "base", fontSize: "var(--font-size-base)", letterSpacing: "var(--letter-spacing-normal)",  lineHeight: "var(--line-height-normal)", rawSize: "0.9375rem" },
  { name: "md",   fontSize: "var(--font-size-md)",   letterSpacing: "var(--letter-spacing-normal)",  lineHeight: "var(--line-height-normal)", rawSize: "1rem" },
  { name: "lg",   fontSize: "var(--font-size-lg)",   letterSpacing: "var(--letter-spacing-tight)",   lineHeight: "var(--line-height-snug)",   rawSize: "1.125rem" },
  { name: "xl",   fontSize: "var(--font-size-xl)",   letterSpacing: "var(--letter-spacing-tight)",   lineHeight: "var(--line-height-snug)",   rawSize: "1.25rem" },
  { name: "2xl",  fontSize: "var(--font-size-2xl)",  letterSpacing: "var(--letter-spacing-tighter)", lineHeight: "var(--line-height-tight)",  rawSize: "1.5rem" },
  { name: "3xl",  fontSize: "var(--font-size-3xl)",  letterSpacing: "var(--letter-spacing-tighter)", lineHeight: "var(--line-height-tight)",  rawSize: "1.875rem" },
  { name: "4xl",  fontSize: "var(--font-size-4xl)",  letterSpacing: "var(--letter-spacing-tightest)", lineHeight: "var(--line-height-tight)", rawSize: "2.25rem" },
  { name: "5xl",  fontSize: "var(--font-size-5xl)",  letterSpacing: "var(--letter-spacing-tightest)", lineHeight: "var(--line-height-none)",  rawSize: "3rem" },
  { name: "6xl",  fontSize: "var(--font-size-6xl)",  letterSpacing: "var(--letter-spacing-tightest)", lineHeight: "var(--line-height-none)",  rawSize: "3.75rem" },
  { name: "7xl",  fontSize: "var(--font-size-7xl)",  letterSpacing: "var(--letter-spacing-tightest)", lineHeight: "var(--line-height-none)",  rawSize: "4.5rem" },
] as const;

/** Extract just the token name, e.g. "var(--letter-spacing-wide)" → "wide" */
function tokenLabel(varRef: string): string {
  const m = varRef.match(/var\(--[\w-]+-(.+?)\)/);
  return m ? m[1] : varRef;
}

@customElement("docs-page-typography")
export class DocsPageTypography extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    h1 {
      font-size: var(--font-size-2xl);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter);
      line-height: var(--line-height-tight);
      margin: 0 0 var(--space-2);
    }

    .subtitle {
      font-size: var(--font-size-base);
      color: var(--text-2);
      margin: 0 0 var(--space-10);
      max-width: 40rem;
      line-height: var(--line-height-relaxed);
    }

    .subtitle code {
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      background: var(--surface-2);
      padding: var(--space-0_5) var(--space-1);
      border-radius: var(--radius-sm);
    }

    /* ── Section headings ── */

    .section-heading {
      font-size: var(--font-size-lg);
      font-weight: 600;
      letter-spacing: var(--letter-spacing-tight);
      color: var(--foreground);
      margin: var(--space-12) 0 var(--space-2);
    }

    .section-heading:first-of-type {
      margin-top: 0;
    }

    .section-description {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-5);
      max-width: 40rem;
      line-height: var(--line-height-relaxed);
    }

    .section-description code {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
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
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--foreground);
    }

    .scale-size {
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      color: var(--text-3);
    }

    .scale-sample {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--foreground);
    }

    /* ── Bundled config table ── */

    .config-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
    }

    .config-table th {
      text-align: left;
      font-weight: 600;
      font-size: var(--font-size-xs);
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
      font-size: var(--font-size-xs);
      color: var(--text-2);
      white-space: nowrap;
    }

    .config-table .cell-value {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
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
      font-size: var(--font-size-xs);
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
        The type scale bundles <code>font-size</code>,
        <code>letter-spacing</code>, and <code>line-height</code> into
        coordinated steps. Smaller text gets wider tracking for legibility;
        larger text gets tighter tracking for visual density.
      </p>

      <!-- Type scale visual samples -->
      <h2 class="section-heading">Type Scale</h2>
      <p class="section-description">
        Each step applies all three properties together via the
        <code>type()</code> helper, ensuring consistent typographic rhythm
        across components.
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
                font-size: ${t.fontSize};
                letter-spacing: ${t.letterSpacing};
                line-height: ${t.lineHeight};
              "
            >The quick brown fox jumps over the lazy dog</span>
          </div>
        `)}
      </div>

      <!-- Bundled configurations table -->
      <h2 class="section-heading">Bundled Configurations</h2>
      <p class="section-description">
        Each type step pairs a size with a specific tracking and leading value.
        These are the exact combinations applied by <code>type("sm")</code>,
        <code>type("2xl")</code>, etc.
      </p>
      <div class="code-block" style="margin-bottom: var(--space-6);">
        <table class="config-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Font Size</th>
              <th>Letter Spacing</th>
              <th>Line Height</th>
            </tr>
          </thead>
          <tbody>
            ${TYPE_SCALE.map((t) => html`
              <tr>
                <td class="cell-name">${t.name}</td>
                <td class="cell-token">${t.rawSize}</td>
                <td class="cell-token">${tokenLabel(t.letterSpacing)}</td>
                <td class="cell-token">${tokenLabel(t.lineHeight)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <!-- Usage -->
      <h2 class="section-heading">Usage</h2>
      <p class="section-description">
        Import the <code>type()</code> helper from
        <code>@dui/theme-default/typography</code> and use it inside Lit
        <code>css</code> tagged templates. It returns bundled CSS declarations.
      </p>
      <div class="code-block">
        <pre><span class="comment">// Import the helper</span>
import { type } from "@dui/theme-default/typography";

<span class="comment">// Use inside a Lit css template</span>
static styles = css\`
  :host {
    \${type("sm")}
  }
\`;

<span class="comment">// Expands to:</span>
<span class="comment">//   font-size: var(--font-size-sm);</span>
<span class="comment">//   letter-spacing: var(--letter-spacing-wide);</span>
<span class="comment">//   line-height: var(--line-height-normal);</span>

<span class="comment">// Override a single property</span>
static styles = css\`
  :host {
    \${type("sm", { lineHeight: "var(--line-height-snug)" })}
  }
\`;</pre>
      </div>
    `;
  }
}
