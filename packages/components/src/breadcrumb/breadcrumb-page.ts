import { css } from "lit";
import { DuiBreadcrumbPagePrimitive } from "@dui/primitives/breadcrumb";
import "../_install.ts";

const styles = css`
  [part="root"] {
    color: var(--text-1);
    font-weight: var(--font-weight-regular);
  }
`;

export class DuiBreadcrumbPage extends DuiBreadcrumbPagePrimitive {
  static override styles = [...DuiBreadcrumbPagePrimitive.styles, styles];
}

customElements.define(DuiBreadcrumbPage.tagName, DuiBreadcrumbPage);
