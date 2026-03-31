import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

/** Fired when a button with `href` is clicked via normal (non-modifier) click. */
export const navigateEvent = customEvent<{ href: string }>(
  "dui-navigate",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout and behavioral CSS. */
const styles = css`
  :host {
    display: inline-block;
  }

  button, a {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    text-decoration: none;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition-property: background-color, box-shadow;
  }
`;

/**
 * `<dui-button>` — A button component with variants, sizes, and theme-aware hover.
 *
 * Renders as a native `<button>` by default. When `href` is set, renders as a
 * native `<a>` tag instead. Normal clicks fire a `dui-navigate` event that
 * consumers handle for SPA routing.
 *
 * @slot - Button label / content.
 * @csspart root - The button or anchor element.
 * @fires dui-navigate - Fired on normal link clicks. Detail: { href: string }
 */
export class DuiButton extends LitElement {
  static tagName = "dui-button" as const;

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [base, styles];

  @property({ reflect: true })
  accessor variant: ButtonVariant = "default";

  @property({ reflect: true })
  accessor size: ButtonSize = "md";

  @property({ type: Boolean, reflect: true })
  accessor rounded = false;

  @property({ type: Boolean, reflect: true })
  accessor square = false;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, attribute: "focusable-when-disabled" })
  accessor focusableWhenDisabled = false;

  @property()
  accessor type: "button" | "submit" | "reset" = "button";

  @property()
  accessor href: string | undefined = undefined;

  #handleClick = (e: MouseEvent): void => {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  #onLinkClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (this.href) {
      event.preventDefault();
      this.dispatchEvent(navigateEvent({ href: this.href }));
    }
  };

  #renderButton(): TemplateResult {
    const ariaDisabled = this.disabled && this.focusableWhenDisabled;

    return html`
      <button
        part="root"
        type="${this.type}"
        ?disabled="${this.disabled && !this.focusableWhenDisabled}"
        aria-disabled="${ariaDisabled || nothing}"
        @click="${this.#handleClick}"
      >
        <slot></slot>
      </button>
    `;
  }

  #renderLink(): TemplateResult {
    return html`
      <a
        part="root"
        href="${this.href ?? nothing}"
        aria-disabled="${this.disabled || nothing}"
        @click="${this.#onLinkClick}"
      >
        <slot></slot>
      </a>
    `;
  }

  override render(): TemplateResult {
    return this.href !== undefined ? this.#renderLink() : this.#renderButton();
  }
}
