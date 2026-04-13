import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-user-account")
export class BlockUserAccount extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      background: var(--surface-2);
      color: var(--text-1);
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
    }

    .name {
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin: var(--space-4) 0 var(--space-1);
    }

    .bio {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
      line-height: 1.5;
    }


  `;

  override render() {
    return html`
      <div class="more-btn">
        <dui-button appearance="ghost" size="icon-sm">
          <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></dui-icon>
        </dui-button>
      </div>

      <div class="profile">
        <dui-avatar
          src="https://i.pravatar.cc/128?u=daniel-olmstead"
          alt="Billie Williams"
          size="var(--space-20)"
        >DO</dui-avatar>

        <p class="name">Billie Williams</p>
        <p class="bio">Eiusmod enim consequat aliqua nulla<br />eiusmod sint velit sunt laborum.</p>
        <dui-button appearance="link">View network</dui-button>
      </div>
    `;
  }
}
