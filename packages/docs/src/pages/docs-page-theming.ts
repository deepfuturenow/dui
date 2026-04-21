import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { sectionStyles } from "./docs-section-styles.ts";

/**
 * Visual test page for the DUI theming system.
 * Renders all derived tokens across all surface levels in light & dark.
 */
@customElement("docs-page-theming")
export class DocsPageTheming extends LitElement {
  static override styles = [sectionStyles, css`
    :host {
      display: block;
    }

    /* ── Surface strips ── */
    .surfaces {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-6);
      flex-wrap: wrap;
    }

    .surface-card {
      flex: 1;
      min-width: 160px;
      padding: var(--space-4);
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid var(--border);
    }

    .surface-card.sunken    { background: var(--sunken); }
    .surface-card.bg        { background: var(--background); }
    .surface-card.surface-1 { background: var(--surface-1); }
    .surface-card.surface-2 { background: var(--surface-2); }
    .surface-card.surface-3 { background: var(--surface-3); }

    .surface-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-3);
      margin-bottom: var(--space-3);
      font-family: var(--font-mono);
    }

    /* ── Text tiers ── */
    .text-sample {
      margin-bottom: var(--space-1);
      font-size: var(--font-size-sm);
    }

    .text-sample.t1 { color: var(--text-1); }
    .text-sample.t2 { color: var(--text-2); }
    .text-sample.t3 { color: var(--text-3); }

    /* ── Border samples ── */
    .border-samples {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-3);
    }

    .border-box {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
    }

    .border-box.normal { border: var(--border-width-thin) solid var(--border); }
    .border-box.strong { border: var(--border-width-thin) solid var(--border-strong); }

    /* ── Token grid ── */
    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }

    .token-swatch {
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid var(--border);
      overflow: hidden;
    }

    .swatch-color {
      height: 48px;
    }

    .swatch-label {
      padding: var(--space-2);
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-2);
      background: var(--surface-1);
    }

    /* ── Interaction states demo ── */
    .interaction-grid {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      margin-bottom: var(--space-6);
    }

    .interact-box {
      --_select: 0;
      --_interact: 0;
      width: 120px;
      height: 48px;
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-1);
      cursor: pointer;
      transition: background var(--duration-fast);
      background: oklch(from var(--foreground) l c h / calc(var(--_select) + var(--_interact)));
    }

    .interact-box:hover { --_interact: 0.05; }
    .interact-box:active { --_interact: 0.10; }
    .interact-box.selected { --_select: 0.10; }

    /* ── Component demos on surfaces ── */
    .component-row {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      flex-wrap: wrap;
      margin-top: var(--space-3);
    }

    /* ── Accent / destructive samples ── */
    .chromatic-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }

    .chromatic-card {
      padding: var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
    }

    .chromatic-card.accent-subtle {
      background: var(--accent-subtle);
      color: var(--accent-text);
    }

    .chromatic-card.accent-filled {
      background: var(--accent);
      color: oklch(from var(--accent) 0.98 0.01 h);
    }

    .chromatic-card.destructive-subtle {
      background: var(--destructive-subtle);
      color: var(--destructive-text);
    }

    .chromatic-card.destructive-filled {
      background: var(--destructive);
      color: oklch(from var(--destructive) 0.98 0.01 h);
    }

    /* ── Theme Playground ── */
    .playground {
      background: var(--surface-1);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-5);
      margin-bottom: var(--space-6);
    }

    .presets {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }

    .preset-btn {
      padding: var(--space-1_5) var(--space-3);
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid var(--border);
      background: var(--background);
      color: var(--text-1);
      font-size: var(--font-size-xs);
      font-family: var(--font-sans);
      cursor: pointer;
      transition: background var(--duration-fast);
    }

    .preset-btn:hover {
      background: oklch(from var(--foreground) l c h / 0.05);
    }

    .preset-btn[data-active] {
      background: var(--accent);
      color: oklch(from var(--accent) 0.98 0.01 h);
      border-color: var(--accent);
    }

    .sliders {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-4);
    }

    .slider-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .slider-group label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-2);
      font-family: var(--font-mono);
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .slider-row input[type="range"] {
      flex: 1;
      accent-color: var(--accent);
    }

    .slider-row .value {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
      color: var(--text-3);
      min-width: 3rem;
      text-align: right;
    }

    .color-preview {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      border: var(--border-width-thin) solid var(--border);
    }
  `];

  // Presets: [name, bg, fg, accent, destructive]
  static #presets: [string, string, string, string, string][] = [
    ["Default",     "oklch(0.97 0 0)",      "oklch(0.15 0 0)",      "oklch(0.55 0.25 260)", "oklch(0.55 0.22 25)"],
    ["Dark",        "oklch(0.15 0.015 260)","oklch(0.93 0 0)",      "oklch(0.75 0.18 260)", "oklch(0.70 0.18 25)"],
    ["Warm",        "oklch(0.96 0.01 80)",  "oklch(0.20 0.02 60)",  "oklch(0.58 0.16 55)",  "oklch(0.55 0.20 25)"],
    ["Ocean",       "oklch(0.97 0.01 230)", "oklch(0.18 0.02 240)", "oklch(0.55 0.20 230)", "oklch(0.58 0.20 25)"],
    ["Forest",      "oklch(0.96 0.01 145)", "oklch(0.18 0.02 145)", "oklch(0.55 0.18 145)", "oklch(0.55 0.20 25)"],
    ["Purple",      "oklch(0.97 0.01 300)", "oklch(0.18 0.02 300)", "oklch(0.55 0.20 300)", "oklch(0.55 0.20 25)"],
  ];

  @state() accessor #activePreset = "Default";

  #applyPreset(name: string, bg: string, fg: string, accent: string, destructive: string) {
    this.#activePreset = name;
    const root = document.documentElement;
    root.style.setProperty("--background", bg);
    root.style.setProperty("--foreground", fg);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--destructive", destructive);
  }

  #resetTheme() {
    const root = document.documentElement;
    root.style.removeProperty("--background");
    root.style.removeProperty("--foreground");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--destructive");
    this.#activePreset = document.documentElement.dataset.theme === "dark" ? "Dark" : "Default";
  }

  #updatePrimitive(name: string, l: number, c: number, h: number) {
    document.documentElement.style.setProperty(`--${name}`, `oklch(${l} ${c} ${h})`);
    this.#activePreset = "";
    this.requestUpdate();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#resetTheme();
  }

  override render() {
    return html`
      <h1 class="title">Theming System</h1>
      <p class="subtitle">
        4 primitives, 13 derived tokens. All surfaces, borders, text tiers,
        and semantic colors are derived at runtime via relative color syntax.
      </p>

      <!-- ═══════════════════════════════════════════════
           Theme Playground
           ═══════════════════════════════════════════════ -->
      <h2 class="section-heading">Theme Playground</h2>
      <p class="section-description">
        Pick a preset or adjust the 4 primitives. All derived tokens update
        instantly — surfaces, borders, text tiers, and component colors.
      </p>
      <div class="playground">
        <div class="presets">
          ${DocsPageTheming.#presets.map(([name, bg, fg, accent, destr]) => html`
            <button
              class="preset-btn"
              ?data-active=${this.#activePreset === name}
              @click=${() => this.#applyPreset(name, bg, fg, accent, destr)}
            >${name}</button>
          `)}
          <button class="preset-btn" @click=${() => this.#resetTheme()}>Reset</button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           Surface Depth Model
           ═══════════════════════════════════════════════ -->
      <h2 class="section-heading">Surface Depth</h2>
      <p class="section-description">
        Surfaces are lightness offsets from --background. Each card below
        shows text tiers and borders compositing against that surface.
      </p>
      <div class="surfaces">
        ${["sunken", "bg", "surface-1", "surface-2", "surface-3"].map(
          (name) => html`
            <div class="surface-card ${name}">
              <div class="surface-label">--${name === "bg" ? "background" : name}</div>
              <div class="text-sample t1">--text-1 (90%)</div>
              <div class="text-sample t2">--text-2 (63%)</div>
              <div class="text-sample t3">--text-3 (45%)</div>
              <div class="border-samples">
                <div class="border-box normal" title="--border"></div>
                <div class="border-box strong" title="--border-strong"></div>
              </div>
            </div>
          `
        )}
      </div>

      <!-- ═══════════════════════════════════════════════
           Color Tokens
           ═══════════════════════════════════════════════ -->
      <h2 class="section-heading">Primitives</h2>
      <div class="token-grid">
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--background)"></div>
          <div class="swatch-label">--background</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--foreground)"></div>
          <div class="swatch-label">--foreground</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--accent)"></div>
          <div class="swatch-label">--accent</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--destructive)"></div>
          <div class="swatch-label">--destructive</div>
        </div>
      </div>

      <h2 class="section-heading">Derived Surfaces</h2>
      <div class="token-grid">
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--sunken)"></div>
          <div class="swatch-label">--sunken</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--surface-1)"></div>
          <div class="swatch-label">--surface-1</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--surface-2)"></div>
          <div class="swatch-label">--surface-2</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--surface-3)"></div>
          <div class="swatch-label">--surface-3</div>
        </div>
      </div>

      <h2 class="section-heading">Derived Borders &amp; Text</h2>
      <div class="token-grid">
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--border)"></div>
          <div class="swatch-label">--border (15%)</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--border-strong)"></div>
          <div class="swatch-label">--border-strong (25%)</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--text-1)"></div>
          <div class="swatch-label">--text-1 (90%)</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--text-2)"></div>
          <div class="swatch-label">--text-2 (63%)</div>
        </div>
        <div class="token-swatch">
          <div class="swatch-color" style="background: var(--text-3)"></div>
          <div class="swatch-label">--text-3 (45%)</div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           Accent & Destructive
           ═══════════════════════════════════════════════ -->
      <h2 class="section-heading">Accent &amp; Destructive</h2>
      <div class="chromatic-grid">
        <div class="chromatic-card accent-subtle">
          <strong>accent-subtle</strong><br>
          Badge, pill, tinted card
        </div>
        <div class="chromatic-card accent-filled">
          <strong>accent (filled)</strong><br>
          Button, checkbox, radio
        </div>
        <div class="chromatic-card destructive-subtle">
          <strong>destructive-subtle</strong><br>
          Error card, alert badge
        </div>
        <div class="chromatic-card destructive-filled">
          <strong>destructive (filled)</strong><br>
          Danger button, delete
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════
           Interaction States
           ═══════════════════════════════════════════════ -->
      <h2 class="section-heading">Interaction States</h2>
      <p class="section-description">
        Uses the --_select / --_interact alpha overlay pattern. Hover over
        the boxes below. "Selected" boxes have --_select: 0.10.
      </p>

      ${["sunken", "bg", "surface-1", "surface-2", "surface-3"].map(
        (name) => html`
          <p class="section-description" style="margin-top: var(--space-3); margin-bottom: var(--space-1);">
            On --${name === "bg" ? "background" : name}:
          </p>
          <div class="interaction-grid">
            <div
              class="interact-box"
              style="background-color: var(--${name === "bg" ? "background" : name})"
            >
              <div class="interact-box" style="width: 100%; height: 100%; border: none;">
                default
              </div>
            </div>
            <div
              class="interact-box selected"
              style="background-color: var(--${name === "bg" ? "background" : name})"
            >
              <div class="interact-box selected" style="width: 100%; height: 100%; border: none;">
                selected
              </div>
            </div>
          </div>
        `
      )}

      <!-- ═══════════════════════════════════════════════
           Component Showcase
           ═══════════════════════════════════════════════ -->
      <h2 class="section-heading">Components on Surfaces</h2>
      <p class="section-description">
        Buttons, toggles, inputs, and badges rendered on each surface level
        to verify alpha compositing.
      </p>

      ${["sunken", "bg", "surface-1", "surface-2", "surface-3"].map(
        (name) => html`
          <div class="surface-card ${name}" style="margin-bottom: var(--space-3);">
            <div class="surface-label">--${name === "bg" ? "background" : name}</div>
            <div class="component-row">
              <dui-button>Neutral</dui-button>
              <dui-button variant="primary">Primary</dui-button>
              <dui-button variant="danger">Danger</dui-button>
              <dui-button appearance="ghost">Ghost</dui-button>
              <dui-button appearance="outline">Outline</dui-button>
            </div>
            <div class="component-row">
              <dui-toggle>Toggle</dui-toggle>
              <dui-badge>Neutral</dui-badge>
              <dui-badge variant="primary" appearance="ghost">Accent</dui-badge>
              <dui-badge variant="danger" appearance="ghost">Danger</dui-badge>
            </div>
            <div class="component-row">
              <dui-input placeholder="Input field" style="width: 200px;"></dui-input>
            </div>
          </div>
        `
      )}
    `;
  }
}
