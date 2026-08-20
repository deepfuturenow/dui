import { css } from "lit";
import { DuiBreadcrumbSeparatorPrimitive } from "@dui/primitives/breadcrumb";
import "../_install.ts";

const styles = css`
  :host {
    --breadcrumb-separator-icon-size: var(--space-3_5);
  }

  [part="root"] {
    --icon-size: var(--breadcrumb-separator-icon-size);
    color: color-mix(in oklch, var(--text-2) 50%, transparent);
  }
`;

export class DuiBreadcrumbSeparator extends DuiBreadcrumbSeparatorPrimitive {
  static override styles = [...DuiBreadcrumbSeparatorPrimitive.styles, styles];
}

customElements.define(DuiBreadcrumbSeparator.tagName, DuiBreadcrumbSeparator);
