import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Typography token visualization for the Create page.
 * Demonstrates font families, sizes, weights, letter-spacing, and line-height.
 */
@customElement("block-typography")
export class BlockTypography extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--text-1);
    }

    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-1);
      letter-spacing: var(--letter-spacing-tight);
    }

    .section-desc {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-8);
      max-width: 48ch;
      line-height: var(--line-height-relaxed);
    }

    /* ── Subsections ── */

    .subsection {
      margin-bottom: var(--space-10);
    }

    .subsection:last-child {
      margin-bottom: 0;
    }

    .subsection-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
    }

    /* ── Font families ── */

    .family-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }

    .family-card {
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .family-sample {
      padding: var(--space-6) var(--space-5);
      font-size: var(--font-size-3xl);
      letter-spacing: var(--letter-spacing-tight);
      line-height: var(--line-height-none);
    }

    .family-info {
      padding: var(--space-3) var(--space-5);
      background: var(--surface-2);
      border-top: var(--border-width-thin) solid var(--border);
    }

    .family-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--space-0_5);
    }

    .family-token {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-2);
      margin: 0;
    }

    .family-value {
      font-size: var(--font-size-xs);
      color: var(--text-3);
      margin: var(--space-0_5) 0 0;
      line-height: var(--line-height-snug);
    }

    /* ── Scale rows (sizes, weights, spacing, line-height) ── */

    .scale-list {
      display: flex;
      flex-direction: column;
    }

    .scale-row {
      display: flex;
      align-items: baseline;
      gap: var(--space-4);
      padding: var(--space-2) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .scale-row:last-child {
      border-bottom: none;
    }

    .scale-token {
      width: var(--space-32);
      flex-shrink: 0;
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-2);
    }

    .scale-value {
      width: var(--space-16);
      flex-shrink: 0;
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-3);
    }

    .scale-sample {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Weight samples ── */

    .weight-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-4);
    }

    .weight-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .weight-sample {
      font-size: var(--font-size-2xl);
      line-height: var(--line-height-tight);
    }

    .weight-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    .weight-meta {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-2);
      margin: 0;
    }

    /* ── Type scale bundled configs ── */

    .type-scale-display {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
      margin-bottom: var(--space-5);
    }

    .type-scale-body {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-5);
    }

    .type-scale-body > .type-scale-item {
      flex: 1 1 calc(50% - var(--space-3));
      max-width: 32%;
      min-width: 16rem;
    }

    .type-scale-item {
      display: flex;
      flex-direction: column;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .type-scale-sample {
      flex: 1;
      padding: var(--space-5) var(--space-5);
      overflow: hidden;
      max-width: 100ch;
    }

    .type-scale-display .type-scale-sample {
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .type-scale-footer {
      padding: var(--space-2_5) var(--space-5);
      background: var(--sunken);
      /* border-top: var(--border-width-thin) solid var(--border); */
      display: flex;
      gap: var(--space-4);
    }

    .type-scale-desc {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-5);
      max-width: 52ch;
      line-height: var(--line-height-relaxed);
    }

    .type-scale-name {
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .type-scale-detail {
      font-size: var(--font-size-2xs);
      font-family: var(--font-mono);
      color: var(--text-3);
      margin: 0;
    }

    /* ── Tracking / leading compact rows ── */

    .compact-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-6);
    }

    .compact-list {
      display: flex;
      flex-direction: column;
    }

    .compact-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-2) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .compact-row:last-child {
      border-bottom: none;
    }

    .compact-token {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-2);
    }

    .compact-value {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-3);
    }

    /* ── Responsive ── */

    @container (min-width: 1100px) {
      .type-scale-body > .type-scale-item {
        flex: 1 1 calc(33.333% - var(--space-3));
      }
    }

    @container (max-width: 700px) {
      .family-grid {
        grid-template-columns: 1fr;
      }
      .weight-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .type-scale-body > .type-scale-item {
        flex: 1 1 100%;
      }
      .compact-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  override render() {
    return html`
      <p class="section-title">Typography</p>
      <p class="section-desc">
        Three font stacks, a 14-step size scale, four weights,
        and fine-grained tracking and leading controls.
      </p>

      <!-- Font families -->
      <div class="subsection">
        <p class="subsection-label">Font Families</p>
        <div class="family-grid">
          <div class="family-card">
            <div class="family-sample" style="font-family: var(--font-sans)">
              Aa Bb Cc
            </div>
            <div class="family-info">
              <p class="family-name">Sans</p>
              <p class="family-token">--font-sans</p>
              <p class="family-value">Inter, system-ui, sans-serif</p>
            </div>
          </div>
          <div class="family-card">
            <div class="family-sample" style="font-family: var(--font-serif)">
              Aa Bb Cc
            </div>
            <div class="family-info">
              <p class="family-name">Serif</p>
              <p class="family-token">--font-serif</p>
              <p class="family-value">ui-serif, Georgia, Cambria, Times, serif</p>
            </div>
          </div>
          <div class="family-card">
            <div class="family-sample" style="font-family: var(--font-mono)">
              Aa Bb Cc
            </div>
            <div class="family-info">
              <p class="family-name">Mono</p>
              <p class="family-token">--font-mono</p>
              <p class="family-value">JetBrains Mono, ui-monospace, SFMono-Regular, monospace</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Font size scale -->
      <div class="subsection">
        <p class="subsection-label">Size Scale</p>
        <div class="scale-list">
          ${this.#sizeRow("--font-size-7xl", "4.5rem")}
          ${this.#sizeRow("--font-size-6xl", "3.75rem")}
          ${this.#sizeRow("--font-size-5xl", "3rem")}
          ${this.#sizeRow("--font-size-4xl", "2.25rem")}
          ${this.#sizeRow("--font-size-3xl", "1.875rem")}
          ${this.#sizeRow("--font-size-2xl", "1.5rem")}
          ${this.#sizeRow("--font-size-xl", "1.25rem")}
          ${this.#sizeRow("--font-size-lg", "1.125rem")}
          ${this.#sizeRow("--font-size-md", "1rem")}
          ${this.#sizeRow("--font-size-base", "0.9375rem")}
          ${this.#sizeRow("--font-size-sm", "0.875rem")}
          ${this.#sizeRow("--font-size-xs", "0.75rem")}
          ${this.#sizeRow("--font-size-2xs", "0.65rem")}
        </div>
      </div>

      <!-- Font weights -->
      <div class="subsection">
        <p class="subsection-label">Weights</p>
        <div class="weight-grid">
          ${this.#weightItem("Regular", "--font-weight-regular", "400")}
          ${this.#weightItem("Medium", "--font-weight-medium", "500")}
          ${this.#weightItem("Semibold", "--font-weight-semibold", "600")}
          ${this.#weightItem("Bold", "--font-weight-bold", "700")}
        </div>
      </div>

      <!-- Type scale bundled configs -->
      <div class="subsection">
        <p class="subsection-label">Type Scale</p>
        <p class="type-scale-desc">
          Each step bundles font-size, letter-spacing, and line-height so
          they are always set together. Smaller text gets wider tracking for
          legibility; larger text gets tighter tracking for visual density.
        </p>
        <div class="type-scale-display">
          ${this.#typeScaleItem("7xl", "var(--font-size-7xl)", "var(--letter-spacing-tightest)", "var(--line-height-none)", "Montréal")}
          ${this.#typeScaleItem("6xl", "var(--font-size-6xl)", "var(--letter-spacing-tightest)", "var(--line-height-none)", "City of Festivals")}
          ${this.#typeScaleItem("5xl", "var(--font-size-5xl)", "var(--letter-spacing-tightest)", "var(--line-height-none)", "La Métropole")}
          ${this.#typeScaleItem("4xl", "var(--font-size-4xl)", "var(--letter-spacing-tightest)", "var(--line-height-tight)", "The Island of Montreal")}
          ${this.#typeScaleItem("3xl", "var(--font-size-3xl)", "var(--letter-spacing-tighter)", "var(--line-height-tight)", "Founded in 1642 as Ville-Marie")}
        </div>
        <div class="type-scale-body">
          ${this.#typeScaleItem("2xl", "var(--font-size-2xl)", "var(--letter-spacing-tighter)", "var(--line-height-tight)", "The second-largest primarily French-speaking city in the world, after Paris")}
          ${this.#typeScaleItem("xl", "var(--font-size-xl)", "var(--letter-spacing-tight)", "var(--line-height-snug)", "Montreal is the cultural capital of Quebec, recognized as a UNESCO City of Design since 2006.")}
          ${this.#typeScaleItem("lg", "var(--font-size-lg)", "var(--letter-spacing-tight)", "var(--line-height-snug)", "The city is home to the headquarters of the International Civil Aviation Organization, and was named host of the 1967 World Exposition.")}
          ${this.#typeScaleItem("md", "var(--font-size-md)", "var(--letter-spacing-normal)", "var(--line-height-normal)", "Montreal's Old Port area has been transformed into a recreational and historical centre. The cobblestone streets of Old Montreal date back to New France and are home to the Notre-Dame Basilica, built in 1829.")}
          ${this.#typeScaleItem("base", "var(--font-size-base)", "var(--letter-spacing-normal)", "var(--line-height-normal)", "The city's extensive underground network, known as RÉSO, connects over 33 kilometres of tunnels linking shopping centres, hotels, museums, universities, and metro stations. During harsh winters, more than half a million pedestrians use this network daily.")}
          ${this.#typeScaleItem("sm", "var(--font-size-sm)", "var(--letter-spacing-wide)", "var(--line-height-normal)", "Montreal's climate is classified as humid continental with warm summers and cold, snowy winters. The average January temperature is −10.3°C, while July averages 20.9°C. The city receives approximately 2,050 mm of precipitation annually, including an average of 210 cm of snowfall.")}
          ${this.#typeScaleItem("xs", "var(--font-size-xs)", "var(--letter-spacing-wide)", "var(--line-height-normal)", "The Société de transport de Montréal operates the city's public transit network, which includes four metro lines spanning 71 kilometres and 68 stations. The bus network complements the metro with 220 daytime and 23 nighttime routes.")}
          ${this.#typeScaleItem("2xs", "var(--font-size-2xs)", "var(--letter-spacing-wider)", "var(--line-height-normal)", "According to the 2021 census, the population of the Montreal metropolitan area reached 4,291,732 residents. The city proper is home to 1,762,949 people, making it the most populous municipality in Quebec and the second most populous in Canada.")}
        </div>
      </div>

      <!-- Letter spacing & line height -->
      <div class="subsection">
        <div class="compact-grid">
          <div>
            <p class="subsection-label">Letter Spacing</p>
            <div class="compact-list">
              ${this.#compactRow("--letter-spacing-tightest", "-0.02em")}
              ${this.#compactRow("--letter-spacing-tighter", "-0.015em")}
              ${this.#compactRow("--letter-spacing-tight", "-0.01em")}
              ${this.#compactRow("--letter-spacing-normal", "0em")}
              ${this.#compactRow("--letter-spacing-wide", "0.006em")}
              ${this.#compactRow("--letter-spacing-wider", "0.012em")}
            </div>
          </div>
          <div>
            <p class="subsection-label">Line Height</p>
            <div class="compact-list">
              ${this.#compactRow("--line-height-none", "1")}
              ${this.#compactRow("--line-height-tight", "1.25")}
              ${this.#compactRow("--line-height-snug", "1.375")}
              ${this.#compactRow("--line-height-normal", "1.5")}
              ${this.#compactRow("--line-height-relaxed", "1.625")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  #sizeRow(token: string, value: string) {
    return html`
      <div class="scale-row">
        <span class="scale-token">${token}</span>
        <span class="scale-value">${value}</span>
        <span class="scale-sample" style="font-size: var(${token})">
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
    `;
  }

  #weightItem(name: string, token: string, value: string) {
    return html`
      <div class="weight-item">
        <span class="weight-sample" style="font-weight: var(${token})">Ag</span>
        <p class="weight-name" style="font-weight: var(${token})">${name}</p>
        <p class="weight-meta">${token} · ${value}</p>
      </div>
    `;
  }

  #typeScaleItem(
    name: string,
    fontSize: string,
    letterSpacing: string,
    lineHeight: string,
    text: string,
  ) {
    // Strip "var(--" and ")" → e.g. "letter-spacing-tighter"
    const fsToken = fontSize.replace(/var\(--(.+?)\)/, "$1");
    const lsToken = letterSpacing.replace(/var\(--(.+?)\)/, "$1");
    const lhToken = lineHeight.replace(/var\(--(.+?)\)/, "$1");
    return html`
      <div class="type-scale-item">
        <div
          class="type-scale-sample"
          style="
            font-size: ${fontSize};
            letter-spacing: ${letterSpacing};
            line-height: ${lineHeight};
          "
        >${text}</div>
        <div class="type-scale-footer">
          <p class="type-scale-name">${name}</p>
          <p class="type-scale-detail">${fsToken}</p>
          <p class="type-scale-detail">${lsToken}</p>
          <p class="type-scale-detail">${lhToken}</p>
        </div>
      </div>
    `;
  }

  #compactRow(token: string, value: string) {
    return html`
      <div class="compact-row">
        <span class="compact-token">${token}</span>
        <span class="compact-value">${value}</span>
      </div>
    `;
  }
}
