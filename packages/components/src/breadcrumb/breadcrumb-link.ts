import { css } from "lit";
import { DuiBreadcrumbLinkPrimitive } from "@dui/primitives/breadcrumb";
import "../_install.ts";

const styles = css`
  [part="root"] {
    color: var(--text-2);
  }

  [part="root"] ::slotted(a) {
    color: inherit;
    text-decoration: none;
    transition: color var(--duration-fast);
  }

  [part="root"] ::slotted(a:hover) {
    color: var(--text-1);
  }
`;

export class DuiBreadcrumbLink extends DuiBreadcrumbLinkPrimitive {
  static override styles = [...DuiBreadcrumbLinkPrimitive.styles, styles];
}

customElements.define(DuiBreadcrumbLink.tagName, DuiBreadcrumbLink);
