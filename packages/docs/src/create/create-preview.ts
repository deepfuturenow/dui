import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./blocks/block-create-project.ts";
import "./blocks/block-calendar.ts";
import "./blocks/block-members.ts";
import "./blocks/block-traffic.ts";
import "./blocks/block-invite-team.ts";
import "./blocks/block-watchlist.ts";
import "./blocks/block-payment.ts";
import "./blocks/block-events.ts";
import "./blocks/block-faq.ts";
import "./blocks/block-settings.ts";
import "./blocks/block-chat.ts";
import "./blocks/block-user-account.ts";
import "./blocks/block-colors.ts";
import "./blocks/block-typography.ts";
import "./blocks/block-3d-scene.ts";
import "./blocks/block-token-usage.ts";
import "./blocks/block-sidebar.ts";
import "./blocks/block-map.ts";
import "./blocks/block-file-tree.ts";
import "./blocks/block-dashboard.ts";
// import "./blocks/block-analytics.ts";

@customElement("create-preview")
export class CreatePreview extends LitElement {
  #gridVisible = false;

  #onKeydown = (e: KeyboardEvent) => {
    // Ignore when typing in inputs / textareas / contenteditable
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
    if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      this.#gridVisible = !this.#gridVisible;
      this.style.setProperty(
        "--block-grid-opacity",
        this.#gridVisible ? "0.08" : "0",
      );
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.#onKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.#onKeydown);
  }

  static override styles = css`
    :host {
      display: block;
      container-type: inline-size;
    }

    .columns {
      column-count: 4;
      column-gap: var(--space-8);
    }

    .columns > * {
      break-inside: avoid;
      margin-bottom: var(--space-8);
    }

    @container (max-width: 1400px) {
      .columns { column-count: 3; }
    }

    @container (max-width: 1100px) {
      .columns { column-count: 2; }
    }

    @container (max-width: 800px) {
      .columns { column-count: 2; }
    }

    @container (max-width: 500px) {
      .columns { column-count: 1; }
    }

    .divider {
      border: none;
      border-top: var(--border-width-thin) solid var(--border);
      margin: var(--space-10) 0;
    }
  `;

  override render() {
    return html`
      <div class="columns">
        <block-create-project></block-create-project>
        <block-traffic></block-traffic>
        <block-chat></block-chat>
        <block-calendar></block-calendar>
        <block-sidebar></block-sidebar>
        <block-file-tree></block-file-tree>
        <block-invite-team></block-invite-team>
        <block-3d-scene></block-3d-scene>
        <block-faq></block-faq>
        <block-watchlist></block-watchlist>
        <block-map></block-map>
        <!-- <block-analytics></block-analytics> -->
        <block-settings></block-settings>
        <block-token-usage></block-token-usage>
        <block-payment></block-payment>
        <block-user-account></block-user-account>
        <block-members></block-members>
        <block-events></block-events>
      </div>

      <hr class="divider">
      <block-dashboard></block-dashboard>

      <hr class="divider">
      <block-colors></block-colors>

      <hr class="divider">
      <block-typography></block-typography>
    `;
  }
}
