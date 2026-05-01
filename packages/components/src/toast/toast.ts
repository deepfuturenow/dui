/**
 * `<dui-toast>` — Styled toast item.
 *
 * NOTE: This is the only DUI component that overrides `render()`. The styled
 * layer's contract is normally "extend with CSS only" — toasts are an
 * exception because we ship built-in default icons keyed off `data-type`,
 * which require a new shadow-DOM slot (`icon`) the primitive doesn't have.
 * The override carefully preserves the primitive's full markup (root, title,
 * description, default slot, action slot, close slot, ARIA wiring,
 * `data-*` state attributes) so consumer-facing parts/slots stay stable.
 */

import { css, html, type TemplateResult } from "lit";
import { DuiToastPrimitive } from "@dui/primitives/toast";
import "../_install.ts";
import "../spinner/index.ts";
import { defaultIconFor } from "./default-icons.ts";

const styles = css`
  /* ── Per-type color hook ──
  *
  * One CSS custom property the consumer can read/override; resolves per
  * data-type. Default = neutral text-2 (used by default + loading types).
  */
  :host {
    --toast-type-color: var(--text-2);
  }
  :host([type="success"]) {
    --toast-type-color: var(--success);
  }
  :host([type="warning"]) {
    --toast-type-color: var(--warning);
  }
  :host([type="info"]) {
    --toast-type-color: var(--info);
  }
  :host([type="error"]) {
    --toast-type-color: var(--destructive);
  }
  :host([type="loading"]) {
    --toast-type-color: var(--text-2);
  }

  /* ── Default appearance: neutral surface, colored icon ──
  *
  * Sonner-default look. Surface stays --surface-2; only the icon (and the
  * loading spinner) picks up the type color.
  */
  :host {
    --toast-bg: var(--surface-2);
    --toast-fg: var(--text-1);
    --toast-border-color: var(--border);
    --toast-border-width: var(--border-width-thin);
    --toast-radius: var(--radius-md);
    --toast-shadow: var(--shadow-lg);

    --toast-padding-block: var(--space-3);
    --toast-padding-inline: var(--space-3_5);
    --toast-gap: var(--space-2_5);
    --toast-text-gap: var(--space-1);
    --toast-action-gap: var(--space-2);

    --toast-title-size: var(--text-sm);
    --toast-title-weight: var(--font-weight-semibold);
    --toast-description-size: var(--text-xs);
    --toast-description-color: var(--text-2);

    --toast-icon-size: var(--space-4);
    --toast-icon-color: var(--toast-type-color);

    --toast-enter-duration: var(--duration-normal);
    --toast-exit-duration: var(--duration-fast);
    --toast-stack-transition: var(--ease-out-3);
  }

  /* ── Rich appearance: tinted surface + colored border ── */
  :host([appearance="rich"][type="success"]) {
    --toast-bg: var(--success-subtle);
    --toast-border-color: var(--success);
    --toast-fg: var(--success-text);
  }
  :host([appearance="rich"][type="warning"]) {
    --toast-bg: var(--warning-subtle);
    --toast-border-color: var(--warning);
    --toast-fg: var(--warning-text);
  }
  :host([appearance="rich"][type="info"]) {
    --toast-bg: var(--info-subtle);
    --toast-border-color: var(--info);
    --toast-fg: var(--info-text);
  }
  :host([appearance="rich"][type="error"]) {
    --toast-bg: var(--destructive-subtle);
    --toast-border-color: var(--destructive);
    --toast-fg: var(--destructive-text);
  }

  /* ── Root: CSS Grid layout ──
  *
  *   "icon  title "     <- close is position: absolute, not in the grid
  *   "icon  desc  "
  *   "icon  action"
  *
  * Two columns: icon (auto-sized; collapses to 0 when no icon) + content
  * (1fr). The icon column width is driven by the private --_icon-col
  * variable so we can zero it AND zero the column-gap when the icon is
  * absent (default type, no slotted icon).
  */
  [part="root"] {
    position: relative;
    display: grid;
    grid-template-columns: var(--_icon-col, var(--toast-icon-size)) 1fr;
    column-gap: var(--_icon-gap, var(--toast-gap));
    row-gap: var(--toast-text-gap);
    align-items: start;

    background: var(--toast-bg);
    color: var(--toast-fg);
    border: var(--toast-border-width) solid var(--toast-border-color);
    border-radius: var(--toast-radius);
    box-shadow: var(--toast-shadow);
    padding: var(--toast-padding-block) var(--toast-padding-inline);
    font-family: var(--font-sans);

    /* Open/close opacity transition (the primitive owns the swipe transform). */
    transition:
      opacity var(--toast-enter-duration) var(--ease-out-3),
      transform var(--toast-enter-duration) var(--ease-out-3);
    }

    /* ── Icon ── */
    [part="icon"] {
      grid-column: 1;
      grid-row: 1 / 3;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--toast-icon-size);
      height: var(--toast-icon-size);
      color: var(--toast-icon-color);
      /* Optical alignment to title baseline (title is text-sm semibold). */
      margin-top: var(--space-px);
      flex-shrink: 0;
    }

    [part="icon"] dui-spinner {
      --spinner-size: var(--toast-icon-size);
      --spinner-color: var(--toast-icon-color);
    }

    /* When no icon (default type, no slotted icon), collapse the icon
      column to zero AND remove the column gap so the text column starts
      flush against the left padding. */
    :host(:not([type])) [part="root"],
    :host([type="default"]) [part="root"],
    :host([type=""]) [part="root"] {
      --_icon-col: 0px;
      --_icon-gap: 0;
    }
    :host(:not([type])) [part="icon"],
    :host([type="default"]) [part="icon"],
    :host([type=""]) [part="icon"] {
      display: none;
    }

    /* ── Title ── */
    [part="title"] {
      grid-column: 2;
      grid-row: 1;
      font-size: var(--toast-title-size);
      font-weight: var(--toast-title-weight);
      line-height: var(--text-sm--line-height);
      color: var(--toast-fg);
      margin: 0;
      text-wrap: pretty;
      /* Reserve room for the absolute close button so long titles don't
        flow underneath it. */
      padding-inline-end: var(--_close-pad, 0);
    }

    /* ── Description ── */
    [part="description"] {
      grid-column: 2;
      grid-row: 2;
      font-size: var(--toast-description-size);
      line-height: var(--text-xs--line-height);
      color: var(--toast-description-color);
      margin: 0;
      text-wrap: pretty;
      padding-inline-end: var(--_close-pad, 0);
    }

    /* ── Default slot (Tier-2 content) ──
    *
    * Default-slotted content sits where the description would and spans
    * the text column. Title/description take precedence visually but both
    * can coexist (rare).
    */
    [part="default-content"] {
      grid-column: 2;
      grid-row: 2;
    }
    [part="default-content"][data-empty] {
      display: none;
    }

    /* ── Action slot ── */
    [part="action-wrapper"] {
      grid-column: 2;
      grid-row: 3;
      margin-top: var(--toast-action-gap);
    }
    [part="action-wrapper"][data-empty] {
      display: none;
    }

    /* Style consumer-slotted bare <button>s in the action wrapper. */
    ::slotted(dui-toast-action) {
      /* dui-toast-action is display:contents; per-button styling is on its
        part. Nothing to do here. */
      }

      /* ── Close slot ──
      *
      * Absolute-positioned in the top-right (top-left for left-anchored
      * regions). Hidden until hover on devices that have hover, always
      * visible on touch.
      */
      [part="close-wrapper"] {
        position: absolute;
        top: var(--space-2);
        inset-inline-end: var(--space-2);
        z-index: 1;
      }
      [part="close-wrapper"][data-empty] {
        display: none;
      }

      /* When the close button is present, reserve title/description padding
        so long content doesn't flow underneath the absolute close. */
      [part="root"]:has([part="close-wrapper"]:not([data-empty])) {
        --_close-pad: var(--space-6);
      }

      @media (hover: hover) {
        [part="close-wrapper"] {
          opacity: 0;
          transition: opacity var(--duration-fast) var(--ease-out-3);
        }
        :host(:hover) [part="close-wrapper"],
        :host(:focus-within) [part="close-wrapper"],
        [part="root"]:hover [part="close-wrapper"],
        [part="root"]:focus-within [part="close-wrapper"] {
          opacity: 1;
        }
      }

      /* ── Open / close animations ──
      *
      * Enter: slide in from the anchored edge. Direction is read from
      * data-position (mirrored from region onto each toast by primitive).
      * Exit: opacity to 0 + scale(0.96).
      */
      :host([data-position^="bottom-"]) [part="root"][data-starting-style] {
        opacity: 0;
        transform: translateY(100%);
      }
      :host([data-position^="top-"]) [part="root"][data-starting-style] {
        opacity: 0;
        transform: translateY(-100%);
      }
      :host([data-position$="-right"]) [part="root"][data-starting-style] {
        /* Right-anchored regions slide in from the right edge for the very
          first toast — but with cascade stacking, vertical slide reads better
          once a stack is established. Keep vertical. */
        }

        [part="root"][data-ending-style] {
          opacity: 0;
          transform: scale(0.96);
          transition:
            opacity var(--toast-exit-duration) var(--ease-out-3),
            transform var(--toast-exit-duration) var(--ease-out-3);
          }

          /* Fade during swipe-end throw (primitive translates 3× via swipe vars). */
          :host([data-swipe="end"]) [part="root"] {
            opacity: 0;
          }

          /* ── Reduced motion: opacity-only ── */
          @media (prefers-reduced-motion: reduce) {
            [part="root"][data-starting-style],
            [part="root"][data-ending-style] {
              transform: none;
            }
          }
        `;

        /**
         * `<dui-toast>` — Styled toast item.
         *
         * Extends the primitive with:
         * - Sonner-default look (neutral surface, colored icon, title + description)
         * - Built-in default icons per `type` (success/info/warning/error/loading);
         *   slot `icon` to override
         * - `appearance="rich"` for tinted-surface mode
         * - CSS Grid layout with full slot/part preservation
         * - Hover-visible close button (always visible on touch)
         *
         * @slot title - Title text (auto-wires aria-labelledby).
         * @slot description - Description text (auto-wires aria-describedby).
         * @slot - Default custom content (Tier-2 escape hatch).
         * @slot icon - Custom icon to replace the type-default. Empty = built-in.
         * @slot action - Action button(s); typically a `<dui-toast-action>` wrapper.
         * @slot close - Close affordance; typically a `<dui-toast-close>` wrapper.
         *
         * @csspart root - The toast container.
         * @csspart icon - The icon container.
         * @csspart title - The title wrapper.
         * @csspart description - The description wrapper.
         * @csspart action-wrapper - The action slot's grid cell.
         * @csspart close-wrapper - The close slot's absolute-positioned container.
         *
         * @attr appearance - `"default" | "rich"`. Rich tints surface + border
         *   by type color. Default keeps the surface neutral.
         */
        export class DuiToast extends DuiToastPrimitive {
          static override styles = [...DuiToastPrimitive.styles, styles];

          /**
           * Override the primitive's render to inject an `icon` slot with built-in
           * defaults. Preserves all other parts/slots/ARIA wiring exactly.
           */
          override render(): TemplateResult {
            const role = this.priority === "assertive" ? "alert" : "status";
            const ariaLive = this.priority;

            // The primitive does ARIA wiring (aria-labelledby/aria-describedby)
            // based on title/description slot assignment, but those flags live
            // in the primitive's private state. We track our own copies via
            // slotchange handlers below and use them here — same shape, just
            // re-implemented in our subclass.

            // Headless mode: same as primitive — only default slot.
            if (this.headless) {
              return html`
                <div
                  part="root"
                  role="${role}"
                  aria-live="${ariaLive}"
                  aria-atomic="true"
                  data-type="${this.type}"
                >
                  <slot></slot>
                </div>
              `;
            }

            const titleId = `dui-toast-title-${this.#instanceId}`;
            const descId = `dui-toast-desc-${this.#instanceId}`;

            return html`
              <div
                part="root"
                role="${role}"
                aria-live="${ariaLive}"
                aria-atomic="true"
                aria-labelledby="${this.#hasTitle ? titleId : ""}"
                aria-describedby="${this.#hasDescription ? descId : ""}"
                data-type="${this.type}"
              >
                <span part="icon">
                  <slot name="icon">${defaultIconFor(this.type)}</slot>
                </span>
                <div part="title" id="${titleId}">
                  <slot
                    name="title"
                    @slotchange="${this.#onTitleSlotChange}"
                  ></slot>
                </div>
                <div part="description" id="${descId}">
                  <slot
                    name="description"
                    @slotchange="${this.#onDescriptionSlotChange}"
                  ></slot>
                </div>
                <div part="default-content" ?data-empty="${!this.#hasDefault}">
                  <slot @slotchange="${this.#onDefaultSlotChange}"></slot>
                </div>
                <div part="action-wrapper" ?data-empty="${!this.#hasAction}">
                  <slot name="action" @slotchange="${this
                    .#onActionSlotChange}"></slot>
                </div>
                <div part="close-wrapper" ?data-empty="${!this.#hasClose}">
                  <slot name="close" @slotchange="${this
                    .#onCloseSlotChange}"></slot>
                </div>
              </div>
            `;
          }

          // ---- Slot-assignment tracking ----
          //
          // ARIA wiring (title, description) plus visibility tracking for
          // default / action / close wrappers. CSS can't gate visibility on
          // "slot has assigned content" — `slot:empty` is always true for
          // slots without fallback children regardless of whether anything
          // is actually slotted.

          #instanceId = crypto.randomUUID().slice(0, 8);
          #hasTitle = false;
          #hasDescription = false;
          #hasDefault = false;
          #hasAction = false;
          #hasClose = false;

          #slotHasContent(slot: HTMLSlotElement): boolean {
            return slot.assignedNodes({ flatten: true }).some((n) =>
              n.nodeType === Node.ELEMENT_NODE ||
              (n.nodeType === Node.TEXT_NODE &&
                (n.textContent?.trim().length ?? 0) > 0)
            );
          }

          #onTitleSlotChange = (e: Event): void => {
            const next = this.#slotHasContent(e.target as HTMLSlotElement);
            if (next !== this.#hasTitle) {
              this.#hasTitle = next;
              this.requestUpdate();
            }
          };
          #onDescriptionSlotChange = (e: Event): void => {
            const next = this.#slotHasContent(e.target as HTMLSlotElement);
            if (next !== this.#hasDescription) {
              this.#hasDescription = next;
              this.requestUpdate();
            }
          };
          #onDefaultSlotChange = (e: Event): void => {
            const next = this.#slotHasContent(e.target as HTMLSlotElement);
            if (next !== this.#hasDefault) {
              this.#hasDefault = next;
              this.requestUpdate();
            }
          };
          #onActionSlotChange = (e: Event): void => {
            const next = this.#slotHasContent(e.target as HTMLSlotElement);
            if (next !== this.#hasAction) {
              this.#hasAction = next;
              this.requestUpdate();
            }
          };
          #onCloseSlotChange = (e: Event): void => {
            const next = this.#slotHasContent(e.target as HTMLSlotElement);
            if (next !== this.#hasClose) {
              this.#hasClose = next;
              this.requestUpdate();
            }
          };
        }

        customElements.define(DuiToast.tagName, DuiToast);
