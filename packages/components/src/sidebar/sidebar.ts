import { css } from "lit";
import { DuiSidebarPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css`
  /* ── Desktop Outer ── */

  .DesktopOuter {
    width: var(--sidebar-width);
    transition: width var(--duration-normal) var(--ease-out-3);
  }

  :host([data-state="collapsed"][data-collapsible="offcanvas"]) .DesktopOuter {
    width: 0;
  }

  :host([data-state="collapsed"][data-collapsible="icon"]) .DesktopOuter {
    width: var(--sidebar-width-icon);
  }

  :host([data-variant="floating"]) .DesktopOuter {
    width: calc(var(--sidebar-width) + var(--space-4));
  }

  :host([data-variant="floating"][data-state="collapsed"][data-collapsible="icon"])
    .DesktopOuter {
    width: calc(var(--sidebar-width-icon) + var(--space-4));
  }

  :host([data-variant="inset"]) .DesktopOuter {
    width: calc(var(--sidebar-width) + var(--space-4));
  }

  :host([data-variant="inset"][data-state="collapsed"][data-collapsible="icon"])
    .DesktopOuter {
    width: calc(var(--sidebar-width-icon) + var(--space-4));
  }

  /* ── Desktop Inner ── */

  .DesktopInner {
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    color: var(--sidebar-fg);
    transition-duration: var(--duration-normal);
    transition-timing-function: var(--ease-out-3);
  }

  :host([data-side="left"][data-variant="sidebar"]) .DesktopInner {
    border-right: var(--border-width-thin) solid var(--sidebar-border);
  }

  :host([data-side="right"][data-variant="sidebar"]) .DesktopInner {
    border-left: var(--border-width-thin) solid var(--sidebar-border);
  }

  :host([data-variant="floating"]) .DesktopInner {
    margin: var(--space-2);
    border-radius: var(--radius-lg);
    border: var(--border-width-thin) solid var(--sidebar-border);
    box-shadow: var(--shadow-md);
  }

  :host([data-variant="inset"]) .DesktopInner {
    margin: var(--space-2);
  }

  :host([data-state="collapsed"][data-collapsible="icon"]) .DesktopInner {
    width: var(--sidebar-width-icon);
  }

  /* ── Backdrop ── */

  .Backdrop {
    background: black;
    opacity: 0.4;
  }

  .Backdrop[data-starting-style],
  .Backdrop[data-ending-style] {
    opacity: 0;
  }

  /* ── Mobile Panel ── */

  .MobilePanel {
    width: var(--sidebar-width-mobile);
    background: var(--sidebar-bg);
    color: var(--sidebar-fg);
    box-shadow: var(--shadow-lg);
    transition: transform var(--duration-normal) var(--ease-out-3);
  }
`;

export class DuiSidebar extends DuiSidebarPrimitive {
  static override styles = [...DuiSidebarPrimitive.styles, styles];
}

customElements.define(DuiSidebar.tagName, DuiSidebar);
