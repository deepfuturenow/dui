import { css } from "lit";
import { DuiBreadcrumbItemPrimitive } from "@dui/primitives/breadcrumb";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-1_5);
  }
`;

export class DuiBreadcrumbItem extends DuiBreadcrumbItemPrimitive {
  static override styles = [...DuiBreadcrumbItemPrimitive.styles, styles];
}

customElements.define(DuiBreadcrumbItem.tagName, DuiBreadcrumbItem);
