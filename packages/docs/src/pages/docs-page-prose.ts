import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { proseSheet } from "@dui/theme-default/prose";

@customElement("docs-page-prose")
export class DocsPageProse extends LitElement {
  static override styles = [proseSheet, css`
    :host {
      display: block;
    }

    .title {
      font-size: var(--font-size-2xl, 1.5rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter, -0.02em);
      line-height: var(--line-height-tight, 1.25);
      margin: 0 0 var(--space-2);
    }

    .description {
      font-size: var(--font-size-base, 0.9375rem);
      color: var(--text-2);
      margin: 0 0 var(--space-8, 2rem);
      max-width: 40rem;
      line-height: var(--line-height-relaxed, 1.625);
    }

    .description code {
      font-family: var(--font-mono);
      font-size: 0.875em;
      background: var(--surface-1);
      padding: 0.15em 0.35em;
      border-radius: var(--radius-sm);
    }

    .section-heading {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 600;
      letter-spacing: var(--letter-spacing-tight, -0.01em);
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
      line-height: var(--line-height-relaxed, 1.625);
    }

    /* ── Demo card ── */
    .demo-card {
      background: var(--surface-2);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
      margin-bottom: var(--space-6);
    }

    .demo-area {
      padding: var(--space-8) var(--space-6);
    }

    .demo-code {
      padding: var(--space-3) var(--space-4);
      border-top: var(--border-width-thin) solid var(--border);
      background: var(--surface-1);
      overflow-x: auto;
    }

    .demo-code pre {
      margin: 0;
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      line-height: 1.7;
      color: var(--foreground);
      white-space: pre;
    }

    /* ── Token table ── */
    .token-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-6);
    }

    .token-table th {
      text-align: start;
      font-weight: 600;
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width-medium) solid var(--border-strong);
    }

    .token-table td {
      padding: var(--space-2) var(--space-3);
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .token-table code {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      background: var(--surface-1);
      padding: 0.1em 0.35em;
      border-radius: var(--radius-sm);
    }

    .swatch {
      display: inline-block;
      width: var(--space-4);
      height: var(--space-4);
      border-radius: var(--radius-sm);
      border: var(--border-width-thin) solid var(--border);
      vertical-align: middle;
      margin-right: var(--space-1_5);
    }
  `];

  override render() {
    return html`
      <h1 class="title">Prose</h1>
      <p class="description">
        The <code>.dui-prose</code> class styles arbitrary HTML content — rendered markdown,
        CMS output, help text, or any block of rich text. It uses DUI design tokens so it
        adapts to light and dark themes automatically.
      </p>

      <!-- ── Usage ── -->
      <h2 class="section-heading">Usage</h2>
      <p class="section-description">
        Wrap any block of HTML content with a <code>class="dui-prose"</code> element.
        No imports needed beyond the existing <code>applyTheme()</code> call.
      </p>
      <div class="demo-card">
        <div class="demo-code">
          <pre>&lt;div class="dui-prose"&gt;
  &lt;h1&gt;Welcome&lt;/h1&gt;
  &lt;p&gt;This is &lt;strong&gt;styled&lt;/strong&gt; automatically.&lt;/p&gt;
  &lt;pre&gt;&lt;code&gt;const x = 42;&lt;/code&gt;&lt;/pre&gt;
&lt;/div&gt;</pre>
        </div>
      </div>

      <!-- ── Kitchen Sink ── -->
      <h2 class="section-heading">Kitchen Sink</h2>
      <p class="section-description">
        Every element that <code>.dui-prose</code> styles, in one demo.
      </p>
      <div class="demo-card">
        <div class="demo-area">
          <div class="dui-prose">
            <h1>The Joke Tax Chronicles</h1>
            <p>
              Once upon a time, in a far-off land, there was a very lazy king who spent all
              day lounging on his throne. One day, his advisors came to him with a
              <strong>bold proposal</strong>: a tax on <em>every joke</em> told in the kingdom.
            </p>

            <h2>The King's Plan</h2>
            <p>
              The king thought long and hard — well, as hard as someone who naps for
              <a href="#">sixteen hours a day</a> can think — and decreed the following:
            </p>

            <blockquote>
              "Any person caught telling a joke shall be required to pay a fine of
              one gold coin per punchline."
            </blockquote>

            <h3>The People's Response</h3>
            <p>
              The people of the kingdom, known for their wit, found creative ways around the
              tax. Here were the most popular methods:
            </p>

            <ul>
              <li>The <strong>Pun Loophole</strong> — puns were classified as wordplay, not jokes</li>
              <li>The <strong>Knock-Knock Exception</strong> — technically a dialogue, not a monologue
                <ul>
                  <li>Sub-clause A: only if both parties participate</li>
                  <li>Sub-clause B: rhetorical knock-knocks still count</li>
                </ul>
              </li>
              <li>The <strong>Sarcasm Defense</strong> — "I wasn't joking, I was being serious"</li>
            </ul>

            <h4>Revenue by Category</h4>
            <p>
              The royal accountants tracked joke tax revenue across categories:
            </p>

            <table>
              <caption>Annual joke tax revenue (in gold coins)</caption>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Year 1</th>
                  <th>Year 2</th>
                  <th>Year 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Puns</td>
                  <td>412</td>
                  <td>38</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>One-liners</td>
                  <td>725</td>
                  <td>610</td>
                  <td>553</td>
                </tr>
                <tr>
                  <td>Knock-knocks</td>
                  <td>89</td>
                  <td>142</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Dad jokes</td>
                  <td>1,204</td>
                  <td>1,876</td>
                  <td>2,340</td>
                </tr>
              </tbody>
            </table>

            <h5>Implementation Details</h5>
            <p>
              The tax collector's handbook specified the use of <code>collectJokeTax()</code>
              for processing:
            </p>

            <pre><code>function collectJokeTax(joke: string): number {
  const punchlines = joke.split(/\n/).filter(isPunchline);
  return punchlines.length * GOLD_COIN_RATE;
}

// Example usage
const tax = collectJokeTax("Why did the chicken cross the road?\nTo get to the other side!");
console.log(tax); // 1</code></pre>

            <h6>Keyboard Shortcuts</h6>
            <p>
              The royal clerks used these shortcuts in the Joke Registry System:
              press <kbd>Ctrl</kbd> + <kbd>J</kbd> to log a joke, or
              <kbd>Ctrl</kbd> + <kbd>T</kbd> to calculate the tax.
            </p>

            <hr />

            <p>
              In the end, the joke tax was repealed after the kingdom realized that
              <small>(as noted in the royal archives)</small> laughter was worth more
              than gold. The king went back to his naps, and everyone lived
              humorously ever after.
            </p>

            <ol>
              <li>The tax was announced on a Monday</li>
              <li>It was repealed the following Friday</li>
              <li>Total revenue collected: 6,994 gold coins</li>
            </ol>

            <details>
              <summary>Footnotes from the Royal Historian</summary>
              <p>
                The actual number of jokes told during the tax period is estimated to be
                ten times higher than reported. Most citizens simply stopped telling jokes
                in public and moved their comedy underground.
              </p>
            </details>

            <figure>
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop&q=80" alt="A medieval castle" />
              <figcaption>The king's castle, where the joke tax was conceived.</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <!-- ── Headings ── -->
      <h2 class="section-heading">Headings</h2>
      <p class="section-description">
        Headings h1–h6 scale down from <code>--font-size-4xl</code> to
        <code>--font-size-lg</code>, with tighter letter-spacing on larger sizes.
      </p>
      <div class="demo-card">
        <div class="demo-area">
          <div class="dui-prose">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
          </div>
        </div>
      </div>

      <!-- ── Inline elements ── -->
      <h2 class="section-heading">Inline Elements</h2>
      <p class="section-description">
        Bold, italic, links, inline code, and keyboard input.
      </p>
      <div class="demo-card">
        <div class="demo-area">
          <div class="dui-prose">
            <p>
              This is <strong>bold text</strong> and this is <em>italic text</em>.
              Visit the <a href="#">documentation</a> for more details.
              Use <code>console.log()</code> for debugging.
              Press <kbd>⌘</kbd> + <kbd>S</kbd> to save.
              <small>Fine print goes here.</small>
            </p>
          </div>
        </div>
      </div>

      <!-- ── Blockquote ── -->
      <h2 class="section-heading">Blockquote</h2>
      <div class="demo-card">
        <div class="demo-area">
          <div class="dui-prose">
            <blockquote>
              The best way to predict the future is to invent it.
            </blockquote>
          </div>
        </div>
      </div>

      <!-- ── Code block ── -->
      <h2 class="section-heading">Code Block</h2>
      <div class="demo-card">
        <div class="demo-area">
          <div class="dui-prose">
            <pre><code>import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";

applyTheme({
  theme: defaultTheme,
  components: [/* ... */],
});</code></pre>
          </div>
        </div>
      </div>

      <!-- ── Lists ── -->
      <h2 class="section-heading">Lists</h2>
      <div class="demo-card">
        <div class="demo-area">
          <div class="dui-prose">
            <ul>
              <li>Unordered item one</li>
              <li>Unordered item two
                <ul>
                  <li>Nested item</li>
                  <li>Another nested item</li>
                </ul>
              </li>
              <li>Unordered item three</li>
            </ul>

            <ol>
              <li>First ordered item</li>
              <li>Second ordered item</li>
              <li>Third ordered item</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- ── Table ── -->
      <h2 class="section-heading">Table</h2>
      <div class="demo-card">
        <div class="demo-area">
          <div class="dui-prose">
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>--prose-body</code></td>
                  <td><code>var(--text-1)</code></td>
                  <td>Body text color</td>
                </tr>
                <tr>
                  <td><code>--prose-headings</code></td>
                  <td><code>var(--foreground)</code></td>
                  <td>Heading color</td>
                </tr>
                <tr>
                  <td><code>--prose-links</code></td>
                  <td><code>var(--accent)</code></td>
                  <td>Link color</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── Tokens reference ── -->
      <h2 class="section-heading">Prose Tokens</h2>
      <p class="section-description">
        Override these CSS custom properties to customize prose appearance without touching the stylesheet.
      </p>
      <table class="token-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>--prose-body</code></td>
            <td><code>var(--text-1)</code></td>
          </tr>
          <tr>
            <td><code>--prose-headings</code></td>
            <td><code>var(--foreground)</code></td>
          </tr>
          <tr>
            <td><code>--prose-lead</code></td>
            <td><code>var(--text-2)</code></td>
          </tr>
          <tr>
            <td><code>--prose-links</code></td>
            <td><code>var(--accent)</code></td>
          </tr>
          <tr>
            <td><code>--prose-links-hover</code></td>
            <td><code>var(--accent-text)</code></td>
          </tr>
          <tr>
            <td><code>--prose-bold</code></td>
            <td><code>var(--foreground)</code></td>
          </tr>
          <tr>
            <td><code>--prose-code</code></td>
            <td><code>var(--foreground)</code></td>
          </tr>
          <tr>
            <td><code>--prose-code-bg</code></td>
            <td><code>var(--surface-1)</code></td>
          </tr>
          <tr>
            <td><code>--prose-pre-bg</code></td>
            <td><code>var(--surface-1)</code></td>
          </tr>
          <tr>
            <td><code>--prose-pre-border</code></td>
            <td><code>var(--border)</code></td>
          </tr>
          <tr>
            <td><code>--prose-blockquote-border</code></td>
            <td><code>var(--accent)</code></td>
          </tr>
          <tr>
            <td><code>--prose-blockquote-text</code></td>
            <td><code>var(--text-2)</code></td>
          </tr>
          <tr>
            <td><code>--prose-hr</code></td>
            <td><code>var(--border)</code></td>
          </tr>
          <tr>
            <td><code>--prose-th-border</code></td>
            <td><code>var(--border-strong)</code></td>
          </tr>
          <tr>
            <td><code>--prose-td-border</code></td>
            <td><code>var(--border)</code></td>
          </tr>
          <tr>
            <td><code>--prose-caption</code></td>
            <td><code>var(--text-3)</code></td>
          </tr>
          <tr>
            <td><code>--prose-kbd-bg</code></td>
            <td><code>var(--surface-2)</code></td>
          </tr>
          <tr>
            <td><code>--prose-kbd-border</code></td>
            <td><code>var(--border-strong)</code></td>
          </tr>
        </tbody>
      </table>
    `;
  }
}
