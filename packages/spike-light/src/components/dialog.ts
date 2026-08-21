/**
 * `bui-dialog` family — the whole dialog in one file: markup conventions,
 * styles, and controller wiring (probe P1; spec "anatomy of a component
 * file").
 *
 * bui:source @dui/components/dialog@2.4.0  bui:hash <recorded at copy>
 *
 * Family:
 *   <bui-dialog>            root; owns DialogController; IS the popover surface
 *   <bui-dialog-header>     labels the dialog (aria-labelledby points here)
 *   <bui-dialog-body>       scrolling content region; @scope-bounded
 *   <bui-dialog-footer>     action row
 *   <bui-dialog-close>      renders a native close <button>
 *
 * The consumer composes these and puts arbitrary content between them. There
 * is no trigger element: opening is `dialogEl.show()` or the `open`
 * attribute. Aesthetic CSS is ported from @dui/components/dialog with
 * `[part=...]` selectors rewritten to tag selectors.
 */
import { css, ReactiveElement } from "@lit/reactive-element";
import { html, render } from "lit-html";
import {
  type DialogCloseBag,
  DialogController,
} from "../controllers/dialog.ts";
import { applyProps, spread } from "../core/spread.ts";
import { lightDom } from "../core/light-dom.ts";
import { attach } from "../core/lit.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";

const styles = css`
  @layer bui.components {
    /* ── Surface (the root element is the popover) ── */

    bui-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      inset-inline-end: auto;
      inset-block-end: auto;
      transform: translate(-50%, -50%) scale(0.9);
      margin: calc(-1 * var(--space-8)) 0 0 0;
      box-sizing: border-box;
      width: var(--popup-width, 24rem);
      max-width: calc(100vw - 3rem);
      height: auto;
      max-height: none;
      padding: var(--space-6) var(--space-5) var(--space-5);
      border: 0;
      border-radius: var(--radius-lg);
      outline: var(--border-width-thin) solid var(--border);
      background: var(--surface-2);
      color: var(--text-1);
      font-family: var(--font-sans);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      opacity: 0;
      transition-property: opacity, transform, overlay, display;
      transition-behavior: allow-discrete;
      transition-duration: var(--duration-fast);
      transition-timing-function: var(--ease-out-3);
    }

    bui-dialog:popover-open {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    @starting-style {
      bui-dialog:popover-open {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }
    }

    /* ── Backdrop ── */

    bui-dialog::backdrop {
      background: var(--scrim);
      opacity: 1;
      transition:
        opacity var(--duration-fast) var(--ease-out-3),
        overlay var(--duration-fast) allow-discrete,
        display var(--duration-fast) allow-discrete;
    }

    @starting-style {
      bui-dialog:popover-open::backdrop {
        opacity: 0;
      }
    }

    /* ── Header: title + description ──
    * Styled through the part's own children, never bare h2/p inside the
    * dialog — the body wraps consumer content that BUI must not reach. */

    bui-dialog-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    bui-dialog-header > h2 {
      margin: 0;
      font-family: var(--font-sans);
      font-size: var(--text-base);
      line-height: var(--text-base--line-height);
      font-weight: var(--font-weight-semibold);
      color: var(--text-1);
      text-box: trim-both cap alphabetic;
      text-wrap: pretty;
    }

    bui-dialog-header > p {
      margin: 0;
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      color: var(--text-2);
      text-box: trim-both cap alphabetic;
    }

    /* ── Body: the @scope boundary (probe P1) ──
    * :scope styles the body's own box; the scoping limit guarantees no rule
    * in this block can reach the consumer content inside it. */

    @scope (bui-dialog-body) to (bui-dialog-body > *) {
      :scope {
        display: block;
        overflow: auto;
        min-height: 0;
      }
    }

    /* ── Footer ── */

    bui-dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }

    /* ── Close ── */

    bui-dialog-close {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      line-height: 0;
    }

    bui-dialog-close > button {
      cursor: pointer;
      color: var(--text-3);
      border-radius: var(--radius-sm);
      padding: var(--space-0_5);
      font-size: var(--text-base);
      line-height: 1;
    }

    bui-dialog-close > button:hover {
      color: var(--text-1);
    }

    bui-dialog-close > button:focus-visible {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: var(--focus-ring-offset);
    }

    @media (prefers-reduced-motion: reduce) {
      bui-dialog,
      bui-dialog::backdrop {
        transition-duration: 0s;
      }
    }
  }
`;

// ---- Root -------------------------------------------------------------------

export class BuiDialog extends ReactiveElement {
  static tagName = "bui-dialog" as const;
  static override styles = styles;

  static override properties = {
    open: { type: Boolean },
    defaultOpen: { type: Boolean, attribute: "default-open" },
  };

  declare open: boolean | undefined;
  declare defaultOpen: boolean;

  readonly dialog = attach(
    this,
    new DialogController({
      getOpen: () => this.open,
      getDefaultOpen: () => this.defaultOpen,
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
    this.defaultOpen = false;
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  show(): void {
    this.dialog.show();
  }

  close(): void {
    this.dialog.close();
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    applyProps(this, this.dialog.rootProps);
  }
}

// ---- Parts ------------------------------------------------------------------

/** Shared shape: find the root with closest(), apply own bag, render nothing. */
abstract class DialogPart extends ReactiveElement {
  protected root: BuiDialog | null = null;

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root = this.closest<BuiDialog>("bui-dialog");
    if (!this.root) {
      console.warn(
        `[bui] <${this.tagName.toLowerCase()}> outside <bui-dialog>`,
      );
    }
  }
}

export class BuiDialogHeader extends DialogPart {
  static tagName = "bui-dialog-header" as const;
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.dialog.headerProps);
  }
}

export class BuiDialogBody extends DialogPart {
  static tagName = "bui-dialog-body" as const;
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.dialog.bodyProps);
  }
}

export class BuiDialogFooter extends DialogPart {
  static tagName = "bui-dialog-footer" as const;
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.dialog.footerProps);
  }
}

/** The one part in this family that renders: a native close button. */
export class BuiDialogClose extends DialogPart {
  static tagName = "bui-dialog-close" as const;
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (!this.root) return;
    render(
      html`<button ${
        spread<DialogCloseBag>(this.root.dialog.closeProps)
      }>×</button>`,
      this,
    );
  }
}

export const dialogFamily = [
  BuiDialog,
  BuiDialogHeader,
  BuiDialogBody,
  BuiDialogFooter,
  BuiDialogClose,
] as const;

defineFamily(dialogFamily);
