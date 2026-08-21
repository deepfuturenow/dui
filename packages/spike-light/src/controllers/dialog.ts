/**
 * `DialogController` — dialog behavior with no template and no Lit.
 *
 * Top layer: the root element itself is a `popover="auto"` surface. The
 * platform then provides what DUI's primitive hand-rolled: top-layer
 * rendering, Escape dismissal, and outside-click dismissal (with a full
 * scrim, an outside click IS a backdrop click), plus `::backdrop` for the
 * scrim itself. What the platform does not provide for popovers is
 * modality, so the focus trap stays hand-rolled here, ported from
 * DUI's dialog-popup.
 *
 * Focus discovery necessarily queries consumer content for focusable
 * elements. That lives here, in the controllers layer, deliberately: P6
 * bans name lookups from core, and a generic focusable selector over the
 * consumer's own children is behavior, not a coupling to component markup.
 */
import type { Bag } from "../core/bags.ts";
import { markBag } from "../core/bags.ts";
import { Controller } from "../core/controller-host.ts";
import { DevCheck } from "../core/dev-check.ts";

export type DialogRootBag = Bag<"dialog:root">;
export type DialogHeaderBag = Bag<"dialog:header">;
export type DialogBodyBag = Bag<"dialog:body">;
export type DialogFooterBag = Bag<"dialog:footer">;
export type DialogCloseBag = Bag<"dialog:close">;

export type DialogControllerOptions = {
  /** Controlled open state; undefined = uncontrolled. */
  getOpen: () => boolean | undefined;
  getDefaultOpen: () => boolean;
  onOpenChange: (open: boolean) => void;
};

const FOCUSABLE = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

let nextId = 1;

export class DialogController extends Controller {
  #opts: DialogControllerOptions;
  #internalOpen = false;
  #surface: HTMLElement | null = null;
  #previouslyFocused: HTMLElement | null = null;
  #headerId = `bui-dialog-header-${nextId++}`;
  #devCheck: DevCheck | null = null;

  constructor(options: DialogControllerOptions) {
    super();
    this.#opts = options;
  }

  protected override onAttach(): void {
    this.#internalOpen = this.#opts.getDefaultOpen();
    this.#devCheck = new DevCheck(this.host, () => "bui-dialog", [
      { name: "dialog:root", ref: true },
      { name: "dialog:body" },
    ]);
    this.host.addLifecycle({
      updated: () => this.#syncPopover(),
      disconnected: () => {
        this.#surface = null;
      },
    });
  }

  get isOpen(): boolean {
    return this.#opts.getOpen() ?? this.#internalOpen;
  }

  show(): void {
    if (this.isOpen) return;
    if (this.#opts.getOpen() === undefined) this.#internalOpen = true;
    this.#opts.onOpenChange(true);
    this.host.requestUpdate();
  }

  close(): void {
    if (!this.isOpen) return;
    if (this.#opts.getOpen() === undefined) this.#internalOpen = false;
    this.#opts.onOpenChange(false);
    this.host.requestUpdate();
  }

  // ---- Bags ----------------------------------------------------------------

  get rootProps(): DialogRootBag {
    const bag = markBag("dialog:root", {
      ref: (el: Element | null) => {
        this.#surface = el as HTMLElement | null;
      },
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": this.#headerId,
      popover: "auto",
      tabindex: -1,
      "data-state": this.isOpen ? "open" : "closed",
      "@keydown": this.#onKeyDown,
      "@toggle": this.#onToggle,
    }, () => {});
    this.#devCheck?.bagApplied("dialog:root");
    this.#devCheck?.refAttached("dialog:root");
    return bag;
  }

  get headerProps(): DialogHeaderBag {
    return markBag("dialog:header", { id: this.#headerId }, () => {});
  }

  get bodyProps(): DialogBodyBag {
    const bag = markBag("dialog:body", {}, () => {});
    this.#devCheck?.bagApplied("dialog:body");
    return bag;
  }

  get footerProps(): DialogFooterBag {
    return markBag("dialog:footer", {}, () => {});
  }

  get closeProps(): DialogCloseBag {
    return markBag("dialog:close", {
      type: "button",
      "aria-label": "Close",
      "@click": () => this.close(),
    }, () => {});
  }

  // ---- Popover sync --------------------------------------------------------

  #syncPopover(): void {
    const surface = this.#surface;
    if (!surface || !surface.isConnected) return;
    const showing = surface.matches(":popover-open");
    if (this.isOpen && !showing) {
      this.#previouslyFocused = document.activeElement as HTMLElement | null;
      surface.showPopover();
      // Focus after the surface is visible; autofocus wins, else first
      // focusable, else the surface itself.
      requestAnimationFrame(() => this.#focusInitial(surface));
    } else if (!this.isOpen && showing) {
      surface.hidePopover();
      this.#restoreFocus();
    }
  }

  #focusInitial(surface: HTMLElement): void {
    const auto = surface.querySelector<HTMLElement>("[autofocus]");
    if (auto) return auto.focus();
    const focusables = this.#focusables(surface);
    (focusables[0] ?? surface).focus();
  }

  #restoreFocus(): void {
    this.#previouslyFocused?.focus();
    this.#previouslyFocused = null;
  }

  #focusables(surface: HTMLElement): HTMLElement[] {
    return [...surface.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
  }

  #onKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Tab" || !this.#surface) return;
    const focusables = this.#focusables(this.#surface);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === this.#surface)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /** Platform dismissal (Esc / outside click) arrives here. */
  #onToggle = (e: Event): void => {
    const toggle = e as ToggleEvent;
    if (toggle.newState === "closed" && this.isOpen) {
      if (this.#opts.getOpen() === undefined) this.#internalOpen = false;
      this.#opts.onOpenChange(false);
      this.#restoreFocus();
      this.host.requestUpdate();
    }
  };
}
