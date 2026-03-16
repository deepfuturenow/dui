import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./blocks/block-typography.ts";
import "./blocks/block-toolbar.ts";
import "./blocks/block-env-vars.ts";
import "./blocks/block-form-controls.ts";
import "./blocks/block-contact-form.ts";
import "./blocks/block-codespaces.ts";
import "./blocks/block-blog-card.ts";
import "./blocks/block-traffic.ts";
import "./blocks/block-invite-team.ts";
import "./blocks/block-audio.ts";

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
        <block-typography></block-typography>
        <block-toolbar></block-toolbar>
        <block-env-vars></block-env-vars>
        <block-codespaces></block-codespaces>
        <block-form-controls></block-form-controls>
        <block-traffic></block-traffic>
        <block-audio></block-audio>
        <block-blog-card></block-blog-card>
        <block-contact-form></block-contact-form>
        <block-invite-team></block-invite-team>
      </div>
    `;
  }
}
