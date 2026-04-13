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

@customElement("create-preview")
export class CreatePreview extends LitElement {
  static override styles = css`
    :host {
      display: block;
      container-type: inline-size;
    }

    .columns {
      column-count: 4;
      column-gap: var(--space-4, 1rem);
    }

    .columns > * {
      break-inside: avoid;
      margin-bottom: var(--space-4, 1rem);
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
  `;

  override render() {
    return html`
      <div class="columns">
        <block-create-project></block-create-project>
        <block-traffic></block-traffic>
        <block-watchlist></block-watchlist>
        <block-calendar></block-calendar>
        <block-payment></block-payment>
        <block-invite-team></block-invite-team>
        <block-events></block-events>
        <block-faq></block-faq>
        <block-settings></block-settings>
        <block-chat></block-chat>
        <block-user-account></block-user-account>
        <block-members></block-members>
      </div>
    `;
  }
}
