import { css } from "lit";
import { DuiBreadcrumbSeparatorPrimitive } from "@dui/primitives/breadcrumb";
import "../_install.ts";

const styles = css`
  [part="root"] {
    --icon-size: var(--space-3_5);
    color: color-mix(in oklch, var(--text-2) 50%, transparent);
  }
`;

export class DuiBreadcrumbSeparator extends DuiBreadcrumbSeparatorPrimitive {
  static override styles = [...DuiBreadcrumbSeparatorPrimitive.styles, styles];
}

customElements.define(DuiBreadcrumbSeparator.tagName, DuiBreadcrumbSeparator);
