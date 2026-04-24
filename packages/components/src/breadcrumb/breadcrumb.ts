import { css } from "lit";
import { DuiBreadcrumbPrimitive } from "@dui/primitives/breadcrumb";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-2);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    font-family: var(--font-sans);
    color: var(--text-2);
  }
`;

export class DuiBreadcrumb extends DuiBreadcrumbPrimitive {
  static override styles = [...DuiBreadcrumbPrimitive.styles, styles];
}

customElements.define(DuiBreadcrumb.tagName, DuiBreadcrumb);
