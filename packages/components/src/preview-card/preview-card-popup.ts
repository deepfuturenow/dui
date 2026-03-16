/** Ported from original DUI: deep-future-app/app/client/components/dui/preview-card */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { base } from "@dui/core/base";
import { previewCardContext } from "./preview-card-context.ts";
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
import {
  type FloatingPopupSide,
  renderArrow,
} from "@dui/core/floating-popup-utils";

const hostStyles = css`
  :host {
    display: none;
  }
`;

/** Styles injected into the portal positioner. */
const portalPopupStyles = [
  css`
    .Popup {
      box-sizing: border-box;
      padding: var(--space-4);
      border-radius: var(--radius-md);
      background-color: var(--popover);
      color: var(--popover-foreground);
      font-family: var(--font-sans);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      box-shadow: var(--shadow-lg);
      border: var(--border-width-thin) solid var(--border);
      max-width: var(--max-width, var(--space-80));
      pointer-events: auto;
      transform-origin: var(--transform-origin, center);
      opacity: 1;
      transform: scale(1);
      transition-property: opacity, transform;
      transition-duration: var(--duration-fast);
      transition-timing-function: var(--ease-out-3);
    }

    .Popup[data-starting-style],
    .Popup[data-ending-style] {
      opacity: 0;
      transform: scale(0.96);
    }

    .Popup[data-side="top"] {
      --transform-origin: bottom center;
    }

    .Popup[data-side="bottom"] {
      --transform-origin: top center;
    }

    .Arrow {
      position: absolute;
      width: 10px;
      height: 6px;
    }

    .Arrow[data-side="top"] {
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
    }

    .Arrow[data-side="bottom"] {
      top: -5px;
      left: 50%;
      transform: translateX(-50%) rotate(180deg);
    }

    .Arrow .arrow-fill {
      fill: var(--popover);
    }

    .Arrow .arrow-stroke {
      fill: none;
      stroke: var(--border);
      stroke-width: 1px;
    }
  `,
];

/**
 * `<dui-preview-card-popup>` — The preview card popup content container.
 *
 * @slot - Preview card content.
 */
export class DuiPreviewCardPopup extends LitElement {
  static tagName = "dui-preview-card-popup" as const;
  static override styles = [base, hostStyles];

  /** Whether to show an arrow pointing to the trigger. */
  @property({ type: Boolean, attribute: "show-arrow" })
  accessor showArrow = true;

  @state()
  accessor #side: FloatingPopupSide = "top";

  #ctx = new ContextConsumer(this, {
    context: previewCardContext,
    subscribe: true,
  });

  #wasOpen = false;

  #portal = new FloatingPortalController(this, {
    getAnchor: () => this.#ctx.value?.triggerEl,
    matchWidth: false,
    placement: "top",
    offset: 8,
    styles: portalPopupStyles,
    contentContainer: ".PreviewCardContent",
    onPosition: ({ placement }) => {
      const actualSide = placement.split("-")[0] as FloatingPopupSide;
      if (actualSide !== this.#side) {
        this.#side = actualSide;
      }
    },
    renderPopup: (portal) => {
      const popupId = this.#ctx.value?.popupId ?? "";
      return html`
        <div
          class="Popup"
          id="${popupId}"
          role="tooltip"
          ?data-starting-style="${portal.isStarting}"
          ?data-ending-style="${portal.isEnding}"
          data-side="${this.#side}"
          @mouseenter="${this.#handleMouseEnter}"
          @mouseleave="${this.#handleMouseLeave}"
        >
          <div class="PreviewCardContent"></div>
          ${this.showArrow ? renderArrow(this.#side) : ""}
        </div>
      `;
    },
  });

  #handleMouseEnter = (): void => {
    this.#ctx.value?.openPreviewCard();
  };

  #handleMouseLeave = (): void => {
    this.#ctx.value?.closePreviewCard();
  };

  override updated(): void {
    const isOpen = this.#ctx.value?.open ?? false;

    if (isOpen && !this.#wasOpen) {
      this.#updatePlacement();
      this.#portal.open();
    } else if (!isOpen && this.#wasOpen) {
      this.#portal.close();
    }

    this.#wasOpen = isOpen;
  }

  #updatePlacement(): void {
    const side = this.#ctx.value?.side ?? "top";
    this.#portal.placement = side;
    this.#portal.offset = this.#ctx.value?.sideOffset ?? 8;
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
