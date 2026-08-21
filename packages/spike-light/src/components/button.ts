/**
 * `bui-button` — minimal port for Phase 0 (full port is Phase 2 #3).
 *
 * PROBE FINDING FED BACK INTO D4: the spec says bui-button "renders an inner
 * native <button>", but in light DOM without slots there is no way to get the
 * consumer's label INTO an element the part renders — lit-html manages its own
 * region and pre-existing children stay outside it, and moving nodes is
 * forbidden (Appendix B table). So Phase 0 uses the enhancer shape:
 *
 *   <bui-button><button>Save</button></bui-button>
 *
 * The consumer authors the real <button> (native submit/disabled/focus all
 * intact — D4's actual goals); the part styles and marks it. The D4 wording
 * needs revision either to this shape or to a label-from-attribute shape.
 * Recorded in FINDINGS.
 */
import { css, ReactiveElement } from "@lit/reactive-element";
import { lightDom } from "../core/light-dom.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";

const styles = css`
  @layer bui.components {
    bui-button {
      display: inline-flex;
    }

    /* Ported from @dui/components/button: default intent, filled appearance,
    * md size. Variants are Phase 2. */
    bui-button > button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1_5);
      height: var(--component-height-md);
      padding: 0 var(--space-2_5);
      border-radius: var(--radius-md);
      background: var(--foreground);
      color: var(--background);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      font-weight: var(--font-weight-medium);
      white-space: nowrap;
      user-select: none;
      cursor: pointer;
      transition-property: filter, background, color;
      transition-duration: var(--duration-fast);
    }

    bui-button > button:hover:not(:disabled) {
      filter: brightness(1.15);
    }

    bui-button > button:active:not(:disabled) {
      filter: brightness(1.3);
    }

    bui-button > button:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 var(--focus-ring-offset) var(--background),
        0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
        var(--focus-ring-color);
    }

    bui-button > button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    bui-button[variant="outline"] > button {
      background: transparent;
      color: var(--text-1);
      box-shadow: inset 0 0 0 var(--border-width-thin) var(--border);
    }

    bui-button[variant="outline"] > button:hover:not(:disabled) {
      filter: none;
      background: oklch(from var(--foreground) l c h / 0.05);
    }
  }
`;

export class BuiButton extends ReactiveElement {
  static tagName = "bui-button" as const;
  static override styles = styles;

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Enhance the consumer's button: default type, so a stray dialog form
    // does not submit on click. The consumer's own type attribute wins.
    const button = this.querySelector("button");
    if (button && !button.hasAttribute("type")) button.type = "button";
  }
}

export const buttonFamily = [BuiButton] as const;
defineFamily(buttonFamily);
