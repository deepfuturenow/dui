import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-invite-team")
export class BlockInviteTeam extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--card);
      color: var(--card-foreground);
    }

    .title {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .subtitle {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-4);
    }

    .invite-row {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }

    .invite-row dui-input {
      flex: 1;
    }

    .invite-row dui-select {
      width: 120px;
    }

    .add-btn {
      margin-bottom: var(--space-4);
    }

    .share-label {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--muted-foreground);
      margin: 0 0 var(--space-2);
    }

    .link-row {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }

    .link-row dui-input {
      flex: 1;
    }
  `;

  override render() {
    return html`
      <p class="title">Invite Team</p>
      <p class="subtitle">Add members to your workspace</p>

      <div class="invite-row">
        <dui-input placeholder="name@example.com"></dui-input>
        <dui-select
          placeholder="Role"
          .options=${[
            { label: "Editor", value: "editor" },
            { label: "Viewer", value: "viewer" },
          ]}
          value="editor"
        ></dui-select>
      </div>

      <div class="invite-row">
        <dui-input placeholder="name@example.com"></dui-input>
        <dui-select
          placeholder="Role"
          .options=${[
            { label: "Editor", value: "editor" },
            { label: "Viewer", value: "viewer" },
          ]}
          value="viewer"
        ></dui-select>
      </div>

      <div class="add-btn">
        <dui-button appearance="ghost" size="sm">+ Add another</dui-button>
      </div>

      <dui-separator></dui-separator>

      <p class="share-label" style="margin-top: var(--space-4)">
        Or share invite link
      </p>
      <div class="link-row">
        <dui-input
          value="https://app.example.com/invite/a1b2c3"
          readonly
        ></dui-input>
        <dui-button appearance="outline" size="icon">
          <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></dui-icon>
        </dui-button>
      </div>

      <dui-button style="width: 100%">Send Invites</dui-button>
    `;
  }
}
