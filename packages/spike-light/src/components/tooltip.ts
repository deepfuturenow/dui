/**
 * `bui-tooltip` family (probe P4) — the simplest floating component.
 *
 *   <bui-tooltip>
 *     <bui-tooltip-trigger><button>?</button></bui-tooltip-trigger>
 *     <bui-tooltip-content>Explains the thing.</bui-tooltip-content>
 *   </bui-tooltip>
 *
 * The trigger enhances its consumer-authored child (same shape as
 * bui-button); the content element is the popover surface itself.
 */
import { css, ReactiveElement } from "@lit/reactive-element";
import {
  type TooltipContentBag,
  TooltipController,
  type TooltipTriggerBag,
} from "../controllers/tooltip.ts";
import { applyProps } from "../core/spread.ts";
import { lightDom } from "../core/light-dom.ts";
import { attach } from "../core/lit.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";

const styles = css`
  @layer bui.components {
    bui-tooltip {
      display: contents;
    }

    bui-tooltip-trigger {
      display: inline-flex;
    }

    bui-tooltip-content {
      position: fixed;
      inset: auto;
      margin: 0;
      border: 0;
      padding: var(--space-1_5) var(--space-2_5);
      border-radius: var(--radius-md);
      background: var(--foreground);
      color: var(--background);
      font-family: var(--font-sans);
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
      box-shadow: var(--shadow-md);
      max-width: 18rem;
      width: max-content;
      opacity: 0;
      transition-property: opacity, overlay, display;
      transition-behavior: allow-discrete;
      transition-duration: var(--duration-fast);
    }

    bui-tooltip-content:popover-open {
      opacity: 1;
    }

    @starting-style {
      bui-tooltip-content:popover-open {
        opacity: 0;
      }
    }
  }
`;

export class BuiTooltip extends ReactiveElement {
  static tagName = "bui-tooltip" as const;
  static override styles = styles;

  static override properties = {
    open: { type: Boolean },
    delay: { type: Number },
    closeDelay: { type: Number, attribute: "close-delay" },
    sideOffset: { type: Number, attribute: "side-offset" },
    disabled: { type: Boolean },
  };

  declare open: boolean | undefined;
  declare delay: number;
  declare closeDelay: number;
  declare sideOffset: number;
  declare disabled: boolean;

  readonly tooltip = attach(
    this,
    new TooltipController({
      getOpen: () => this.open,
      getDelay: () => this.delay,
      getCloseDelay: () => this.closeDelay,
      getSideOffset: () => this.sideOffset,
      getDisabled: () => this.disabled,
      onOpenChange: (open) => {
        this.dispatchEvent(
          new CustomEvent("open-change", {
            detail: { open },
            bubbles: true,
            composed: true,
          }),
        );
      },
    }),
  );

  constructor() {
    super();
    this.open = undefined;
    this.delay = 500;
    this.closeDelay = 0;
    this.sideOffset = 6;
    this.disabled = false;
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }
}

abstract class TooltipPart extends ReactiveElement {
  protected root: BuiTooltip | null = null;

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root = this.closest<BuiTooltip>("bui-tooltip");
    if (!this.root) {
      console.warn(
        `[bui] <${this.tagName.toLowerCase()}> outside <bui-tooltip>`,
      );
    }
  }
}

export class BuiTooltipTrigger extends TooltipPart {
  static tagName = "bui-tooltip-trigger" as const;
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (!this.root) return;
    applyProps(
      this,
      this.root.tooltip.triggerProps satisfies TooltipTriggerBag,
    );
  }
}

export class BuiTooltipContent extends TooltipPart {
  static tagName = "bui-tooltip-content" as const;
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (!this.root) return;
    applyProps(
      this,
      this.root.tooltip.contentProps satisfies TooltipContentBag,
    );
  }
}

export const tooltipFamily = [
  BuiTooltip,
  BuiTooltipTrigger,
  BuiTooltipContent,
] as const;

defineFamily(tooltipFamily);
