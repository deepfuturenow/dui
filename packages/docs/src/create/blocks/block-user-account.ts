import { LitElement, html, css } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

@customElement("block-user-account")
export class BlockUserAccount extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      padding: var(--space-6) var(--space-5) var(--space-5);
    }

    .more-btn {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
    }

    .profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding-top: var(--space-1);
    }

    .name {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-semibold);
      line-height: var(--text-lg--line-height);
      margin: var(--space-6) 0 0;
      text-box: trim-both cap alphabetic;
    }

    .bio {
      font-size: var(--text-sm);
      line-height: var(--line-height-tight);
      color: var(--text-2);
      margin: var(--space-3) 0 0;
      text-box: trim-both cap alphabetic;
    }

    .view-link {
      margin-top: var(--space-3);
    }
  `];

  override render() {
    return html`
      <div class="more-btn">
        <dui-menu>
          <dui-button slot="trigger" appearance="ghost" size="icon-sm">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></dui-icon>
          </dui-button>
          <dui-menu-item>Edit profile</dui-menu-item>
          <dui-menu-item>Change avatar</dui-menu-item>
          <dui-menu-item>Account settings</dui-menu-item>
          <dui-menu-item>Privacy</dui-menu-item>
          <dui-menu-item variant="danger">Delete account</dui-menu-item>
        </dui-menu>
      </div>

      <div class="profile">
        <dui-avatar
          src="https://i.pravatar.cc/128?u=daniel-olmstead"
          alt="Billie Williams"
          size="var(--space-20)"
        >DO</dui-avatar>

        <p class="name">Billie Williams</p>
        <p class="bio">Eiusmod enim consequat aliqua nulla<br />eiusmod sint velit sunt laborum.</p>
        <dui-button class="view-link" appearance="link">View network</dui-button>
      </div>
    `;
  }
}
