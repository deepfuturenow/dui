import { css } from "lit";
import { DuiBreadcrumbEllipsisPrimitive } from "@dui/primitives/breadcrumb";
import "../_install.ts";

const styles = css`
  [part="root"] {
    color: var(--text-2);
    width: var(--space-4);
  }
`;

export class DuiBreadcrumbEllipsis extends DuiBreadcrumbEllipsisPrimitive {
  static override styles = [...DuiBreadcrumbEllipsisPrimitive.styles, styles];
}

customElements.define(DuiBreadcrumbEllipsis.tagName, DuiBreadcrumbEllipsis);
