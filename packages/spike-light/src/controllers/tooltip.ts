/**
 * `TooltipController` (probe P4) — hover/focus intent with open and close
 * delays, popover="manual" for the top layer (a tooltip must not close other
 * auto popovers or light-dismiss), aria-describedby linking trigger to
 * content across the family. Positioning via the P6-fixed floating core.
 */
import { type Bag, markBag } from "../core/bags.ts";
import { Controller } from "../core/controller-host.ts";
import { FloatingTopLayerController } from "../vendor-core/floating-top-layer-controller.ts";

export type TooltipTriggerBag = Bag<"tooltip:trigger">;
export type TooltipContentBag = Bag<"tooltip:content">;

export type TooltipControllerOptions = {
  getOpen: () => boolean | undefined;
  getDelay: () => number;
  getCloseDelay: () => number;
  getSideOffset: () => number;
  getDisabled: () => boolean;
  onOpenChange: (open: boolean) => void;
};

let nextId = 1;

export class TooltipController extends Controller {
  #opts: TooltipControllerOptions;
  #contentId = `bui-tooltip-${nextId++}`;
  #internalOpen = false;
  #openTimer: number | undefined;
  #closeTimer: number | undefined;
  #triggerEl: HTMLElement | null = null;
  #contentEl: HTMLElement | null = null;
  #popup: FloatingTopLayerController | null = null;

  constructor(options: TooltipControllerOptions) {
    super();
    this.#opts = options;
  }

  protected override onAttach(): void {
    this.#popup = new FloatingTopLayerController(this.host, {
      getAnchor: () => this.#triggerEl,
      getPopover: () => this.#contentEl,
      placement: "top",
      // No eager offset here: at attach time the host's field initializers
      // have run but its constructor body has NOT — getSideOffset() would
      // read undefined and Floating UI would fall back to 4px. The same
      // eager-capture hazard the spec records for refs applies to option
      // getters. Set lazily in #sync instead.
    });
    this.host.addLifecycle({
      updated: () => this.#sync(),
      disconnected: () => {
        clearTimeout(this.#openTimer);
        clearTimeout(this.#closeTimer);
        this.#popup?.dispose();
      },
    });
  }

  get isOpen(): boolean {
    return this.#opts.getOpen() ?? this.#internalOpen;
  }

  #setOpen(open: boolean): void {
    if (this.#opts.getOpen() === undefined) this.#internalOpen = open;
    this.#opts.onOpenChange(open);
    this.host.requestUpdate();
  }

  #sync(): void {
    if (!this.#popup || !this.#contentEl?.isConnected) return;
    this.#popup.offset = this.#opts.getSideOffset();
    const showing = this.#contentEl.matches(":popover-open");
    if (this.isOpen && !showing) this.#popup.open();
    else if (!this.isOpen && showing) this.#popup.close();
    // Plain Controller has no part fan-out (that is CompoundController's job),
    // so state that lives on the parts is pushed onto the held refs here.
    if (this.#triggerEl) {
      if (this.isOpen) {
        this.#triggerEl.setAttribute("aria-describedby", this.#contentId);
        this.#triggerEl.setAttribute("data-open", "");
      } else {
        this.#triggerEl.removeAttribute("aria-describedby");
        this.#triggerEl.removeAttribute("data-open");
      }
    }
  }

  #scheduleOpen = (): void => {
    if (this.#opts.getDisabled()) return;
    clearTimeout(this.#closeTimer);
    this.#openTimer = setTimeout(
      () => this.#setOpen(true),
      this.#opts.getDelay(),
    ) as unknown as number;
  };

  #scheduleClose = (): void => {
    clearTimeout(this.#openTimer);
    this.#closeTimer = setTimeout(
      () => this.#setOpen(false),
      this.#opts.getCloseDelay(),
    ) as unknown as number;
  };

  get triggerProps(): TooltipTriggerBag {
    return markBag("tooltip:trigger", {
      ref: (el: Element | null) => {
        this.#triggerEl = el as HTMLElement | null;
      },
      "aria-describedby": this.isOpen ? this.#contentId : undefined,
      "?data-open": this.isOpen,
      "@pointerenter": this.#scheduleOpen,
      "@pointerleave": this.#scheduleClose,
      "@focusin": () => {
        if (!this.#opts.getDisabled()) this.#setOpen(true);
      },
      "@focusout": () => this.#setOpen(false),
    }, () => {});
  }

  get contentProps(): TooltipContentBag {
    return markBag("tooltip:content", {
      ref: (el: Element | null) => {
        this.#contentEl = el as HTMLElement | null;
      },
      id: this.#contentId,
      role: "tooltip",
      popover: "manual",
      "?data-open": this.isOpen,
    }, () => {});
  }
}
