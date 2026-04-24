import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { chartThemeStyles } from "../theme/chart-theme.ts";
import * as Plot from "@observablehq/plot";
import type { PlotOptions } from "@observablehq/plot";

/** Fired after Plot renders. Detail contains the rendered element. */
export const chartRenderEvent = customEvent<{
  element: SVGElement | HTMLElement;
}>(
  "dui-chart-render",
  { bubbles: true, composed: true },
);

/** Fired when the pointer-selected datum changes (via Plot's pointer transform). */
export const chartInputEvent = customEvent<{ value: unknown }>(
  "dui-chart-input",
  { bubbles: true, composed: true },
);

const styles = css`
  :host {
    display: block;
    position: relative;
  }

  [part="root"] {
    position: relative;
    overflow: hidden;
  }

  /* Plot generates a <figure> or <svg>. Fill container width. */
  [part="root"] > figure,
  [part="root"] > svg {
    display: block;
    width: 100%;
    height: auto;
  }

  [part="tooltip"] {
    position: absolute;
    pointer-events: none;
    z-index: 1;
    top: 0;
    left: 0;
    opacity: 0;
    white-space: nowrap;
  }
`;

/**
 * `<dui-chart>` — Chart component wrapping Observable Plot.
 *
 * Pass an Observable Plot spec via the `spec` property. The component
 * renders Plot's SVG output inside its shadow DOM and re-renders
 * responsively on container resize.
 *
 * @csspart root - The chart container div.
 * @fires dui-chart-render - Fired after Plot renders. Detail: { element }
 */
export class DuiChart extends LitElement {
  static tagName = "dui-chart" as const;
  static override styles = [base, styles, chartThemeStyles];

  /** Observable Plot options object. */
  @property({ type: Object })
  accessor spec: PlotOptions | undefined = undefined;

  /** Theme variant (e.g. `"sparkline"`). */
  @property({ reflect: true })
  accessor variant: string = "";

  /** Whether to render an HTML tooltip overlay instead of Plot's SVG tips. */
  @property({ type: Boolean })
  accessor tooltip = true;

  /** Auto re-render on resize. */
  @property({ type: Boolean, reflect: true })
  accessor responsive = true;

  #resizeObserver: ResizeObserver | undefined;
  #inputListener: ((e: Event) => void) | undefined;
  #lastWidth = 0;

  // Tooltip state
  #tipObserver: MutationObserver | undefined;
  #tooltipVisible = false;

  protected override firstUpdated(): void {
    const container = this.#getContainer();
    if (this.responsive && container) {
      this.#resizeObserver = new ResizeObserver(this.#handleResize);
      this.#resizeObserver.observe(container);
    }
    this.#renderPlot();
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has("spec") && this.hasUpdated) {
      this.#renderPlot();
    }
    if (changed.has("responsive")) {
      this.#resizeObserver?.disconnect();
      const container = this.#getContainer();
      if (this.responsive && container) {
        this.#resizeObserver = new ResizeObserver(this.#handleResize);
        this.#resizeObserver.observe(container);
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
    this.#tipObserver?.disconnect();
    this.#tipObserver = undefined;
  }

  /**
   * Observe the SVG for tip mark replacements and drive the HTML tooltip.
   * Plot re-creates the tip `<g>` on each pointer move via
   * `replaceWith()`, so we intercept after render to update the overlay.
   */
  #setupTipObserver(container: HTMLDivElement): void {
    this.#tipObserver?.disconnect();
    this.#tooltipVisible = false;

    this.#tipObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (
            node instanceof SVGGElement &&
            node.getAttribute("aria-label") === "tip"
          ) {
            // Keep SVG tip invisible — Plot needs it for pointer tracking
            (node as SVGElement).style.visibility = "hidden";
            this.#updateTooltip(container);
            return;
          }
        }
      }
    });

    // Observe the entire container subtree so we catch tip
    // replacements regardless of SVG nesting (figure-wrapped or not).
    this.#tipObserver.observe(container, { childList: true, subtree: true });
  }

  /** Read the SVG tip position & content, mirror into the HTML tooltip overlay. */
  #updateTooltip(container: HTMLDivElement): void {
    const tooltipEl = this.renderRoot.querySelector<HTMLDivElement>(
      '[part="tooltip"]',
    );
    if (!tooltipEl) return;

    const tipGroup = container.querySelector<SVGGElement>(
      '[aria-label="tip"]',
    );
    if (!tipGroup) return;

    // The inner <g> carries the translate(x,y) positioning
    const innerG = tipGroup.querySelector<SVGGElement>(
      ":scope > g[transform]",
    );
    if (!innerG) {
      // Tip is empty (pointer left the chart) — hide tooltip
      if (this.#tooltipVisible) {
        tooltipEl.style.opacity = "0";
        this.#tooltipVisible = false;
      }
      return;
    }

    const attr = innerG.getAttribute("transform");
    const match = attr?.match(
      /translate\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/,
    );
    if (!match) return;

    const tipX = parseFloat(match[1]);
    const tipY = parseFloat(match[2]);

    // Compute offset from SVG to host element so tooltip
    // lines up even when a <figure> wrapper adds margins/padding.
    const svg = container.querySelector("svg");
    let offsetX = 0;
    let offsetY = 0;
    if (svg) {
      const hostRect = this.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      offsetX = svgRect.left - hostRect.left;
      offsetY = svgRect.top - hostRect.top;
    }

    // Extract content from SVG <text> tspans
    const content = this.#extractTipContent(innerG);
    tooltipEl.innerHTML = content;

    // Position: set transform, show it
    if (!this.#tooltipVisible) {
      // First appearance — position without transition, then fade in
      tooltipEl.style.transition = "none";
      tooltipEl.style.transform = `translate(${offsetX + tipX}px, ${offsetY + tipY}px)`;
      // Force recalc
      getComputedStyle(tooltipEl).transform;
      tooltipEl.style.transition =
        "transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease-out";
      tooltipEl.style.opacity = "1";
      this.#tooltipVisible = true;
    } else {
      tooltipEl.style.transform = `translate(${offsetX + tipX}px, ${offsetY + tipY}px)`;
      tooltipEl.style.opacity = "1";
    }
  }

  /**
   * Walk SVG tip content and build HTML.
   *
   * Plot renders tooltip text as a single <text> element with
   * line-level <tspan x="0" dy="1em"> children. Each line-level
   * tspan may contain nested <tspan font-weight="bold"> for labels
   * and optionally a <tspan fill="color">■</tspan> for swatches.
   */
  #extractTipContent(innerG: SVGGElement): string {
    const textEl = innerG.querySelector("text");
    if (!textEl) return "";

    // Line-level tspans: direct children of <text> with dy attribute
    const lineTspans = textEl.querySelectorAll<SVGTSpanElement>(
      ":scope > tspan[dy]",
    );

    // Fallback: if no dy tspans, treat the entire text content as one line
    if (lineTspans.length === 0) {
      const t = textEl.textContent?.trim();
      return t
        ? `<div class="tooltip-row">${this.#escapeHtml(t)}</div>`
        : "";
    }

    const lines: string[] = [];
    for (const lineTspan of lineTspans) {
      let row = '<div class="tooltip-row">';

      // Walk child nodes (text nodes + nested tspans)
      for (const child of lineTspan.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          // Plain text (the value portion after a bold label tspan)
          const text = child.textContent ?? "";
          // Skip zero-width spaces Plot uses as line separators
          if (text.trim() && text !== "\u200B") {
            row += `<span class="tooltip-value">${this.#escapeHtml(text)}</span>`;
          }
        } else if (child instanceof SVGTSpanElement) {
          const text = child.textContent ?? "";
          const fill = child.getAttribute("fill");
          const fontWeight = child.getAttribute("font-weight");

          if (text.trim() === "\u25A0") {
            // Color swatch
            row += `<span class="tooltip-swatch" style="color: ${fill || "currentColor"}">${text}</span>`;
          } else if (fontWeight === "bold") {
            row += `<span class="tooltip-label">${this.#titleCase(text)}</span>`;
          } else {
            row += `<span class="tooltip-value">${this.#escapeHtml(text)}</span>`;
          }
        }
      }

      row += "</div>";
      lines.push(row);
    }

    return lines.join("");
  }

  /** Title-case a label: "device" → "Device", "y-axis" → "Y-Axis". Already-capitalized labels pass through unchanged. */
  #titleCase(text: string): string {
    const escaped = this.#escapeHtml(text.trim());
    return escaped.replace(
      /\b[a-z]/g,
      (ch) => ch.toUpperCase(),
    );
  }

  #escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  #getContainer(): HTMLDivElement | null {
    return this.renderRoot.querySelector<HTMLDivElement>('[part="root"]');
  }

  #handleResize = (entries: ResizeObserverEntry[]): void => {
    const width = entries[0]?.contentRect.width ?? 0;
    if (Math.abs(width - this.#lastWidth) > 1) {
      this.#lastWidth = width;
      this.#renderPlot();
    }
  };

  #renderPlot(): void {
    const container = this.#getContainer();
    if (!container) return;

    if (!this.spec) {
      container.replaceChildren();
      return;
    }

    const width = container.clientWidth || undefined;

    const element = Plot.plot({
      ...this.spec,
      width,
    });

    // Clean up previous input listener
    this.#inputListener = undefined;

    // Add CSS classes to Plot's SVG elements for easier styling
    element.querySelectorAll<SVGElement>("[aria-label]").forEach((el) => {
      const label = el.getAttribute("aria-label")!;
      el.classList.add(`chart-${label.replace(/\s+/g, "-")}`);
    });

    container.replaceChildren(element);

    // Set up HTML tooltip overlay driven by the MutationObserver
    if (this.tooltip) {
      // Hide existing SVG tips — Plot needs them for pointer tracking
      // but we render our own HTML tooltip instead.
      container.querySelectorAll('[aria-label="tip"]').forEach((tip) => {
        (tip as SVGElement).style.visibility = "hidden";
      });
      this.#setupTipObserver(container);
    }

    // Forward Plot's pointer-driven input events
    this.#inputListener = () => {
      // deno-lint-ignore no-explicit-any
      this.dispatchEvent(chartInputEvent({ value: (element as any).value }));
    };
    element.addEventListener("input", this.#inputListener);

    this.dispatchEvent(chartRenderEvent({ element }));
  }

  override render(): TemplateResult {
    return html`<div part="root"></div><div part="tooltip"></div>`;
  }
}

customElements.define(DuiChart.tagName, DuiChart);
