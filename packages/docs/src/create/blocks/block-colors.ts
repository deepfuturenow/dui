import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { sectionStyles } from "../../pages/docs-section-styles.ts";

/* ────────────────────────────────────────────
 *  Data model
 * ──────────────────────────────────────────── */

interface TokenNode {
  id: string;
  name: string;
  token: string;
  /** CSS value for the swatch. Omit for alias-only (semantic) nodes */
  color?: string;
  /** Short derivation formula shown below the name */
  formula?: string;
}

interface TokenGroup {
  label: string;
  nodes: TokenNode[];
}

interface TokenColumn {
  tier: string;
  tierLabel: string;
  tierColor: "prim" | "derived";
  groups: TokenGroup[];
}

/** An edge from source node id → target node id */
interface Edge {
  from: string;
  to: string;
  /** Which primitive this edge traces back to — drives color */
  family: "background" | "foreground" | "accent" | "destructive";
}

/* ── Columns ── */

const COL_PRIMITIVES: TokenColumn = {
  tier: "1",
  tierLabel: "Primitives",
  tierColor: "prim",
  groups: [
    {
      label: "Theme author sets 4 values",
      nodes: [
        {
          id: "background",
          name: "Background",
          token: "--background",
          color: "var(--background)",
          formula: "oklch(0.97 0 0)",
        },
        {
          id: "foreground",
          name: "Foreground",
          token: "--foreground",
          color: "var(--foreground)",
          formula: "oklch(0.15 0 0)",
        },
        {
          id: "accent",
          name: "Accent",
          token: "--accent",
          color: "var(--accent)",
          formula: "oklch(0.55 0.25 260)",
        },
        {
          id: "destructive",
          name: "Destructive",
          token: "--destructive",
          color: "var(--destructive)",
          formula: "oklch(0.55 0.22 25)",
        },
      ],
    },
  ],
};

const COL_DERIVED: TokenColumn = {
  tier: "2",
  tierLabel: "Derived",
  tierColor: "derived",
  groups: [
    {
      label: "Surfaces shift --background lightness",
      nodes: [
        {
          id: "sunken",
          name: "Sunken",
          token: "--sunken",
          color: "var(--sunken)",
          formula: "oklch(from var(--background) calc(l - 0.03) c h)",
        },
        {
          id: "surface-1",
          name: "Surface 1",
          token: "--surface-1",
          color: "var(--surface-1)",
          formula: "oklch(from var(--background) calc(l + 0.02) c h)",
        },
        {
          id: "surface-2",
          name: "Surface 2",
          token: "--surface-2",
          color: "var(--surface-2)",
          formula: "oklch(from var(--background) calc(l + 0.05) c h)",
        },
        {
          id: "surface-3",
          name: "Surface 3",
          token: "--surface-3",
          color: "var(--surface-3)",
          formula: "oklch(from var(--background) calc(l + 0.09) c h)",
        },
      ],
    },
    {
      label: "Text tiers reduce --foreground alpha",
      nodes: [
        {
          id: "text-1",
          name: "Text 1",
          token: "--text-1",
          color: "var(--text-1)",
          formula: "oklch(from var(--foreground) l c h / 0.90)",
        },
        {
          id: "text-2",
          name: "Text 2",
          token: "--text-2",
          color: "var(--text-2)",
          formula: "oklch(from var(--foreground) l c h / 0.63)",
        },
        {
          id: "text-3",
          name: "Text 3",
          token: "--text-3",
          color: "var(--text-3)",
          formula: "oklch(from var(--foreground) l c h / 0.45)",
        },
      ],
    },
    {
      label: "Borders reduce --foreground alpha",
      nodes: [
        {
          id: "border",
          name: "Border",
          token: "--border",
          color: "var(--border)",
          formula: "oklch(from var(--foreground) l c h / 0.15)",
        },
        {
          id: "border-strong",
          name: "Border Strong",
          token: "--border-strong",
          color: "var(--border-strong)",
          formula: "oklch(from var(--foreground) l c h / 0.25)",
        },
      ],
    },
    {
      label: "Scrim reduces --foreground alpha",
      nodes: [
        {
          id: "scrim",
          name: "Scrim",
          token: "--scrim",
          color: "var(--scrim)",
          formula: "oklch(from var(--foreground) l c h / 0.35)",
        },
      ],
    },
    {
      label: "Accent derives from --accent and --foreground",
      nodes: [
        {
          id: "accent-subtle",
          name: "Accent Subtle",
          token: "--accent-subtle",
          color: "var(--accent-subtle)",
          formula: "oklch(from var(--accent) l c h / 0.10)",
        },
        {
          id: "accent-text",
          name: "Accent Text",
          token: "--accent-text",
          color: "var(--accent-text)",
          formula: "color-mix(in oklch, var(--accent) 80%, var(--foreground))",
        },
      ],
    },
    {
      label: "Destructive derives from --destructive and --foreground",
      nodes: [
        {
          id: "destructive-subtle",
          name: "Destructive Subtle",
          token: "--destructive-subtle",
          color: "var(--destructive-subtle)",
          formula: "oklch(from var(--destructive) l c h / 0.10)",
        },
        {
          id: "destructive-text",
          name: "Destructive Text",
          token: "--destructive-text",
          color: "var(--destructive-text)",
          formula: "color-mix(in oklch, var(--destructive) 80%, var(--foreground))",
        },
      ],
    },
  ],
};

/* ── Edges ── */

const EDGES: Edge[] = [
  // background → surfaces
  { from: "background", to: "sunken", family: "background" },
  { from: "background", to: "surface-1", family: "background" },
  { from: "background", to: "surface-2", family: "background" },
  { from: "background", to: "surface-3", family: "background" },
  // foreground → text
  { from: "foreground", to: "text-1", family: "foreground" },
  { from: "foreground", to: "text-2", family: "foreground" },
  { from: "foreground", to: "text-3", family: "foreground" },
  // foreground → border
  { from: "foreground", to: "border", family: "foreground" },
  { from: "foreground", to: "border-strong", family: "foreground" },
  // foreground → scrim
  { from: "foreground", to: "scrim", family: "foreground" },
  // accent → accent derivatives
  { from: "accent", to: "accent-subtle", family: "accent" },
  { from: "accent", to: "accent-text", family: "accent" },
  // destructive → destructive derivatives
  { from: "destructive", to: "destructive-subtle", family: "destructive" },
  { from: "destructive", to: "destructive-text", family: "destructive" },
  // foreground also feeds accent-text and destructive-text (color-mix)
  { from: "foreground", to: "accent-text", family: "foreground" },
  { from: "foreground", to: "destructive-text", family: "foreground" },
];

/* ────────────────────────────────────────────
 *  Component
 * ──────────────────────────────────────────── */

@customElement("block-colors")
export class BlockColors extends LitElement {
  static override styles = [sectionStyles, css`
    :host {
      display: block;
      color: var(--text-1);
    }

    /* ── Flow container ── */

    .flow {
      position: relative;
    }

    .flow-columns {
      display: grid;
      grid-template-columns: minmax(0, 13rem) minmax(0, 1fr);
      gap: var(--space-16);
      position: relative;
      align-items: start;
    }

    .col-primitives {
      align-self: center;
    }

    /* ── SVG edge layer ── */

    .edges {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
    }

    .edges path {
      fill: none;
      stroke-width: 1;
      opacity: 0.45;
    }

    .edges path.family-background {
      stroke: var(--border-strong);
    }
    .edges path.family-foreground {
      stroke: var(--foreground);
    }
    .edges path.family-accent {
      stroke: var(--accent);
    }
    .edges path.family-destructive {
      stroke: var(--destructive);
    }

    .edges circle.family-background {
      fill: var(--border-strong);
    }
    .edges circle.family-foreground {
      fill: var(--foreground);
    }
    .edges circle.family-accent {
      fill: var(--accent);
    }
    .edges circle.family-destructive {
      fill: var(--destructive);
    }

    .edges circle {
      opacity: 0.45;
    }

    /* ── Column ── */

    .column {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    /* ── Tier badge ── */

    .tier {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1_5);
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider);
      padding: var(--space-1) var(--space-2_5);
      border-radius: var(--radius-md);
      width: fit-content;
    }

    .tier-num {
      width: var(--space-4);
      height: var(--space-4);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-2xs);
      font-weight: var(--font-weight-bold);
      color: var(--background);
    }

    .tier--prim {
      color: var(--accent);
      background: var(--accent-subtle);
    }
    .tier--prim .tier-num {
      background: var(--accent);
    }

    .tier--derived {
      color: var(--text-2);
      background: var(--surface-2);
    }
    .tier--derived .tier-num {
      background: var(--text-2);
    }

    /* ── Token group ── */

    .group {
      display: flex;
      flex-direction: column;
      gap: var(--space-1_5);
    }

    .group-label {
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider);
      color: var(--text-3);
      margin: 0;
      padding-left: var(--space-0_5);
    }

    /* ── Token card ── */

    .token {
      display: flex;
      align-items: center;
      gap: var(--space-2_5);
      padding: var(--space-2) var(--space-2_5);
      background: var(--surface-1);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      transition: border-color 0.15s;
    }

    .token:hover {
      border-color: var(--border-strong);
    }

    .swatch {
      width: var(--space-7);
      height: var(--space-7);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
      border: var(--border-width-thin) solid var(--border);
    }

    .col-primitives .swatch {
      width: var(--space-14);
      height: var(--space-14);
    }

    .col-primitives .token + .token {
      margin-top: var(--space-3);
    }

    .token-info {
      flex: 1;
      min-width: 0;
    }

    .token-name {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      margin: 0;
      line-height: 1.3;
    }

    .token-formula {
      font-family: var(--font-mono);
      font-size: var(--font-size-2xs);
      color: var(--text-3);
      margin: 0;
      line-height: 1.4;
    }

    /* ── Derived column: tighter layout ── */

    .col-derived .group {
      gap: var(--space-1);
    }

    .col-derived .group + .group {
      margin-top: var(--space-2);
    }

    .col-derived .token {
      width: var(--space-96);
      padding: var(--space-1_5) var(--space-2);
    }

    .col-derived .swatch {
      width: var(--space-5);
      height: var(--space-5);
    }

    /* ── Responsive ── */

    @container (max-width: 600px) {
      .flow-columns {
        grid-template-columns: 1fr;
        gap: var(--space-8);
      }
    }
  `];

  /** Map of node id → DOMRect, refreshed on layout */
  #nodeRects = new Map<string, DOMRect>();
  #containerRect: DOMRect | null = null;
  #resizeObserver: ResizeObserver | null = null;

  override firstUpdated() {
    // Initial edge draw after layout settles
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.#drawEdges());
    });

    // Re-draw on resize
    this.#resizeObserver = new ResizeObserver(() => this.#drawEdges());
    const flow = this.renderRoot.querySelector(".flow");
    if (flow) this.#resizeObserver.observe(flow);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
  }

  override render() {
    return html`
      <h1 class="title">Color Tokens</h1>
      <p class="subtitle">
        4 primitives define the entire palette. Every other color is derived at
        runtime via <code>oklch(from …)</code> and <code>color-mix()</code> — no
        build step, no manual mapping.
      </p>

      <div class="flow">
        <svg class="edges"></svg>
        <div class="flow-columns">
          ${this.#renderColumn(COL_PRIMITIVES, "col-primitives")}
          ${this.#renderColumn(COL_DERIVED, "col-derived")}
        </div>
      </div>
    `;
  }

  #renderColumn(col: TokenColumn, extraClass: string): TemplateResult {
    return html`
      <div class="column ${extraClass}">
        <span class="tier tier--${col.tierColor}">
          <span class="tier-num">${col.tier}</span>
          ${col.tierLabel}
        </span>
        ${col.groups.map((g) => this.#renderGroup(g))}
      </div>
    `;
  }

  #renderGroup(group: TokenGroup): TemplateResult {
    return html`
      <div class="group">
        <p class="group-label">${group.label}</p>
        ${group.nodes.map((n) => this.#renderNode(n))}
      </div>
    `;
  }

  #renderNode(node: TokenNode): TemplateResult {
    return html`
      <div class="token" data-node="${node.id}">
        ${node.color
          ? html`<div class="swatch" style="background: ${node.color}"></div>`
          : null}
        <div class="token-info">
          <p class="token-name">${node.token}</p>
          ${node.formula
            ? html`<p class="token-formula">${node.formula}</p>`
            : null}
        </div>
      </div>
    `;
  }

  /* ── Edge drawing ── */

  #drawEdges() {
    const svg = this.renderRoot.querySelector<SVGSVGElement>("svg.edges");
    if (!svg) return;

    const flow = this.renderRoot.querySelector(".flow");
    if (!flow) return;

    this.#containerRect = flow.getBoundingClientRect();

    // Measure all nodes
    this.#nodeRects.clear();
    const nodes =
      this.renderRoot.querySelectorAll<HTMLElement>("[data-node]");
    for (const el of nodes) {
      const id = el.dataset.node!;
      this.#nodeRects.set(id, el.getBoundingClientRect());
    }

    // Size SVG to container
    const cr = this.#containerRect;
    svg.setAttribute("width", String(cr.width));
    svg.setAttribute("height", String(cr.height));
    svg.setAttribute("viewBox", `0 0 ${cr.width} ${cr.height}`);

    // Clear existing paths
    svg.innerHTML = "";

    // Draw each edge
    for (const edge of EDGES) {
      const fromRect = this.#nodeRects.get(edge.from);
      const toRect = this.#nodeRects.get(edge.to);
      if (!fromRect || !toRect) continue;

      // Source: right-center of the source node
      const x1 = fromRect.right - cr.left;
      const y1 = fromRect.top + fromRect.height / 2 - cr.top;

      // Target: left-center of the target node
      const x2 = toRect.left - cr.left;
      const y2 = toRect.top + toRect.height / 2 - cr.top;

      // Horizontal distance for control point offset
      const dx = (x2 - x1) * 0.45;

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute(
        "d",
        `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`,
      );
      path.classList.add(`family-${edge.family}`);
      svg.appendChild(path);

      // Small dot at the target end
      const dot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      dot.setAttribute("cx", String(x2));
      dot.setAttribute("cy", String(y2));
      dot.setAttribute("r", "2");
      dot.classList.add(`family-${edge.family}`);
      svg.appendChild(dot);
    }
  }
}
