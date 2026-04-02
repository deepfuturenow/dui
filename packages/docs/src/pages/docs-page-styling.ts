import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-styling")
export class DocsPageStyling extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tighter, -0.03em);
      margin: 0 0 var(--space-2);
    }

    .description {
      font-size: var(--font-size-sm);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-8, 2rem);
      max-width: 36rem;
      line-height: var(--line-height-relaxed, 1.65);
    }

    .section-heading {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 600;
      letter-spacing: var(--letter-spacing-tight, -0.01em);
      color: var(--foreground);
      margin: var(--space-10) 0 var(--space-2);
    }

    .section-description {
      font-size: var(--font-size-sm);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-5);
      max-width: 36rem;
      line-height: var(--line-height-relaxed, 1.65);
    }

    /* ── Demo card ── */
    .demo-card {
      background: var(--card);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
      margin-bottom: var(--space-6);
    }

    .demo-area {
      padding: var(--space-8) var(--space-6);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-3);
      flex-wrap: wrap;
      min-height: 80px;
    }

    .demo-code {
      padding: var(--space-3) var(--space-4);
      border-top: var(--border-width-thin) solid var(--border);
      background: var(--muted);
      overflow-x: auto;
    }

    .demo-code pre {
      margin: 0;
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      line-height: 1.6;
      color: var(--foreground);
      white-space: pre;
    }

    .demo-label {
      font-weight: 600;
      font-size: var(--font-size-sm);
      color: var(--secondary-foreground);
      margin-bottom: var(--space-3);
    }

    /* ── Two-layer diagram ── */
    .layers {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    @media (max-width: 600px) {
      .layers {
        grid-template-columns: 1fr;
      }
    }

    .layer-card {
      padding: var(--space-4);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      background: var(--card);
    }

    .layer-card h3 {
      font-size: var(--font-size-sm);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .layer-card p {
      font-size: var(--font-size-xs);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-3);
      line-height: var(--line-height-relaxed, 1.65);
    }

    .layer-card code {
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      display: block;
      white-space: pre;
      color: var(--foreground);
      background: var(--muted);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
    }

    /* ── Gradient button demo ── */
    .gradient-btn {
      --button-bg: linear-gradient(
        135deg,
        oklch(0.7 0.15 330),
        oklch(0.55 0.25 280)
      );
      --button-fg: white;
      --button-border: transparent;
      --button-hover-bg: linear-gradient(
        135deg,
        oklch(0.65 0.18 330),
        oklch(0.5 0.28 280)
      );
      --button-active-bg: linear-gradient(
        135deg,
        oklch(0.6 0.2 330),
        oklch(0.45 0.3 280)
      );
    }

    /* ── Frosted glass demo ── */
    .glass-area {
      position: relative;
      background: url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80")
        center / cover no-repeat;
      border-radius: var(--radius-md);
      padding: var(--space-12) var(--space-6);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-3);
    }

    .glass-btn {
      --button-bg: oklch(1 0 0 / 0.15);
      --button-fg: white;
      --button-border: oklch(1 0 0 / 0.25);
      --button-hover-bg: oklch(1 0 0 / 0.25);
      --button-active-bg: oklch(1 0 0 / 0.1);
    }

    .glass-btn::part(root) {
      backdrop-filter: blur(12px) brightness(70%) saturate(1.8);
      box-shadow:
        inset 0 1px hsla(0, 0%, 100%, 0.5),
        inset 0 -1px hsla(0, 0%, 100%, 0.15),
        0 0 2.5rem hsla(0, 0%, 0%, 0.2);
      border: none;
      text-shadow: 0 0.5px 0 hsla(0, 0%, 0%, 0.3);
    }

    /* ── Glow demo ── */
    .glow-btn {
      --button-bg: oklch(0.55 0.25 280);
      --button-fg: white;
      --button-border: transparent;
    }

    .glow-btn::part(root) {
      box-shadow:
        0 0 20px oklch(0.55 0.25 280 / 0.5),
        0 0 60px oklch(0.55 0.25 280 / 0.2);
    }

    .glow-btn::part(root):hover {
      box-shadow:
        0 0 25px oklch(0.55 0.25 280 / 0.6),
        0 0 80px oklch(0.55 0.25 280 / 0.3);
    }

    /* ── Bouncy press demo ── */
    .bouncy-btn::part(root):hover {
      transform: translateY(-2px);
    }

    .bouncy-btn::part(root):active {
      transform: scale(0.95);
    }

    /* ── Clip-path demo ── */
    .octagon-btn {
      --button-padding-x: var(--space-5);
    }

    .octagon-btn::part(root) {
      clip-path: polygon(
        8px 0%,
        calc(100% - 8px) 0%,
        100% 8px,
        100% calc(100% - 8px),
        calc(100% - 8px) 100%,
        8px 100%,
        0% calc(100% - 8px),
        0% 8px
      );
    }

    /* ── Ancestor cascading demo ── */
    .themed-zone {
      --button-bg: var(--destructive);
      --button-fg: var(--destructive-foreground);
      --button-hover-bg: color-mix(
        in oklch,
        var(--destructive) 90%,
        var(--foreground)
      );
      padding: var(--space-4);
      border: 1px dashed var(--destructive);
      border-radius: var(--radius-md);
      display: flex;
      gap: var(--space-3);
      align-items: center;
    }

    .themed-zone-label {
      font-size: var(--font-size-xs);
      color: var(--muted-foreground);
      font-family: var(--font-mono);
    }

    /* ── Combined demo ── */
    .combined-btn {
      --button-bg: linear-gradient(
        135deg,
        oklch(0.65 0.2 200),
        oklch(0.55 0.25 250)
      );
      --button-fg: white;
      --button-border: transparent;
      --button-hover-bg: linear-gradient(
        135deg,
        oklch(0.6 0.22 200),
        oklch(0.5 0.28 250)
      );
      --button-radius: var(--radius-full);
      --button-padding-x: var(--space-6);
    }

    .combined-btn::part(root) {
      box-shadow: 0 4px 15px oklch(0.55 0.25 230 / 0.4);
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .combined-btn::part(root):hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px oklch(0.55 0.25 230 / 0.5);
    }

    .combined-btn::part(root):active {
      transform: scale(0.97);
      box-shadow: 0 2px 10px oklch(0.55 0.25 230 / 0.3);
    }
  `;

  override render() {
    return html`
      <h1 class="title">Styling & Customization</h1>
      <p class="description">
        DUI components are styled through two complementary layers: CSS custom
        properties for the variant system, and <code>::part()</code> for full
        CSS expressiveness. Together they let you apply any visual effect
        without the library needing to anticipate it.
      </p>

      <!-- Two-layer diagram -->
      <div class="layers">
        <div class="layer-card">
          <h3>CSS Variables</h3>
          <p>
            For what variants and sizes control — colors, spacing, dimensions.
            Cascades from ancestors.
          </p>
          <code
            >dui-button { --button-bg: var(--accent); --button-radius:
            var(--radius-full); }</code
          >
        </div>
        <div class="layer-card">
          <h3>::part(root)</h3>
          <p>
            For everything else — filters, transforms, shadows, clip-paths,
            backdrop-filter. Unlimited CSS.
          </p>
          <code
            >dui-button::part(root) { filter: brightness(1.15); box-shadow: 0 0
            16px purple; }</code
          >
        </div>
      </div>

      <!-- Gradient -->
      <h2 class="section-heading">Gradient backgrounds</h2>
      <p class="section-description">
        Variables use the <code>background</code> shorthand (not
        <code>background-color</code>), so gradients and images work out of the
        box.
      </p>
      <div class="demo-card">
        <div class="demo-area">
          <dui-button class="gradient-btn">Gradient</dui-button>
          <dui-button class="gradient-btn" size="lg">Large Gradient</dui-button>
        </div>
        <div class="demo-code">
          <pre>
dui-button {
  --button-bg: linear-gradient(135deg, oklch(0.7 0.15 330), oklch(0.55 0.25 280));
  --button-fg: white;
}</pre
          >
        </div>
      </div>

      <!-- Frosted glass -->
      <h2 class="section-heading">Frosted glass</h2>
      <p class="section-description">
        Use <code>::part(root)</code> for <code>backdrop-filter</code> — no
        variable needed.
      </p>
      <div class="demo-card">
        <div class="demo-area glass-area">
          <dui-button class="glass-btn">Glass</dui-button>
          <dui-button class="glass-btn" variant="outline"
            >Outline Glass</dui-button
          >
        </div>
        <div class="demo-code">
          <pre>
.glass-btn {
  --button-bg: oklch(1 0 0 / 0.15);
  --button-fg: white;
  --button-border: oklch(1 0 0 / 0.25);
}
.glass-btn::part(root) {
  backdrop-filter: blur(12px) brightness(70%) saturate(1.8);
  box-shadow:
    inset 0 1px hsla(0, 0%, 100%, 0.5),
    inset 0 -1px hsla(0, 0%, 100%, 0.15),
    0 0 2.5rem hsla(0, 0%, 0%, 0.2);
  border: none;
  text-shadow: 0 0.5px 0 hsla(0, 0%, 0%, 0.3);
}</pre
          >
        </div>
      </div>

      <!-- Glow -->
      <h2 class="section-heading">Glow shadows</h2>
      <p class="section-description">
        Colored, layered shadows via <code>::part(root)</code>. The transition
        system animates them smoothly.
      </p>
      <div class="demo-card">
        <div class="demo-area" style="padding: var(--space-10) var(--space-6);">
          <dui-button class="glow-btn">Glow</dui-button>
        </div>
        <div class="demo-code">
          <pre>
.glow-btn {
  --button-bg: oklch(0.55 0.25 280);
  --button-fg: white;
}
.glow-btn::part(root) {
  box-shadow: 0 0 20px oklch(0.55 0.25 280 / 0.5),
              0 0 60px oklch(0.55 0.25 280 / 0.2);
}</pre
          >
        </div>
      </div>

      <!-- Bouncy press -->
      <h2 class="section-heading">Bouncy press feedback</h2>
      <p class="section-description">
        Transform on hover and active via <code>::part(root)</code>. The
        component's structural CSS already includes <code>transform</code> in
        its transition list.
      </p>
      <div class="demo-card">
        <div class="demo-area">
          <dui-button class="bouncy-btn">Press me</dui-button>
          <dui-button class="bouncy-btn" variant="secondary"
            >Secondary</dui-button
          >
          <dui-button class="bouncy-btn" variant="outline">Outline</dui-button>
        </div>
        <div class="demo-code">
          <pre>
dui-button::part(root):hover {
  transform: translateY(-2px);
}
dui-button::part(root):active {
  transform: scale(0.95);
}</pre
          >
        </div>
      </div>

      <!-- Clip-path -->
      <h2 class="section-heading">Custom clip-path</h2>
      <p class="section-description">
        Octagons, bevels, or organic shapes — impossible with border-radius
        alone.
      </p>
      <div class="demo-card">
        <div class="demo-area">
          <dui-button class="octagon-btn">Octagon</dui-button>
          <dui-button class="octagon-btn" variant="secondary"
            >Secondary</dui-button
          >
          <dui-button class="octagon-btn" variant="destructive"
            >Destructive</dui-button
          >
        </div>
        <div class="demo-code">
          <pre>
dui-button::part(root) {
  clip-path: polygon(
    12px 0%, calc(100% - 12px) 0%,
    100% 12px, 100% calc(100% - 12px),
    calc(100% - 12px) 100%, 12px 100%,
    0% calc(100% - 12px), 0% 12px
  );
}</pre
          >
        </div>
      </div>

      <!-- Ancestor cascading -->
      <h2 class="section-heading">Ancestor cascading</h2>
      <p class="section-description">
        Variables cascade from parents. Set <code>--button-bg</code> on a
        container and all descendant buttons inherit it.
        <code>::part()</code> can't do this — it must target the element
        directly.
      </p>
      <div class="demo-card">
        <div class="demo-area">
          <div class="themed-zone">
            <span class="themed-zone-label">.danger-zone</span>
            <dui-button>Delete</dui-button>
            <dui-button variant="outline">Cancel</dui-button>
          </div>
        </div>
        <div class="demo-code">
          <pre>
.danger-zone {
  --button-bg: var(--destructive);
  --button-fg: var(--destructive-foreground);
}</pre
          >
        </div>
      </div>

      <!-- Combined -->
      <h2 class="section-heading">Combining both layers</h2>
      <p class="section-description">
        Variables for color and dimensions, <code>::part(root)</code> for
        shadows, transforms, and typography effects.
      </p>
      <div class="demo-card">
        <div class="demo-area" style="padding: var(--space-10) var(--space-6);">
          <dui-button class="combined-btn">Launch</dui-button>
          <dui-button class="combined-btn" size="lg">Launch Large</dui-button>
        </div>
        <div class="demo-code">
          <pre>
.btn {
  --button-bg: linear-gradient(135deg, oklch(0.65 0.2 200), oklch(0.55 0.25 250));
  --button-fg: white;
  --button-radius: var(--radius-full);
  --button-padding-x: var(--space-6);
}
.btn::part(root) {
  box-shadow: 0 4px 15px oklch(0.55 0.25 230 / 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.btn::part(root):hover {
  transform: translateY(-2px);
}
.btn::part(root):active {
  transform: scale(0.97);
}</pre
          >
        </div>
      </div>
    `;
  }
}
