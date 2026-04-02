import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-command")
export class DocsPageCommand extends LitElement {
  protected override createRenderRoot() { return this; }

  override connectedCallback(): void {
    super.connectedCallback();
    requestAnimationFrame(() => {
      // Focus input in each command demo
      const commands = this.querySelectorAll("dui-command");
      commands.forEach((cmd: any) => {
        const input = cmd.querySelector("dui-command-input");
        if (input) {
          // Let command items register before any interaction
        }
      });
    });
  }

  override render() {

    return html`
      <docs-page-layout tag="dui-command" .additionalTags=${["dui-command-input","dui-command-list","dui-command-group","dui-command-item","dui-command-empty","dui-command-separator","dui-command-shortcut"]}>
        <dui-docs-demo label="Default">
        <dui-command style="border: 1px solid var(--border); border-radius: var(--radius-lg); max-width: 450px;">
          <dui-command-input placeholder="Type a command or search..."></dui-command-input>
          <dui-command-list>
            <dui-command-empty>No results found.</dui-command-empty>
            <dui-command-group heading="Suggestions">
              <dui-command-item value="calendar">
                Calendar
              </dui-command-item>
              <dui-command-item value="search">
                Search Emoji
              </dui-command-item>
              <dui-command-item value="calculator">
                Calculator
              </dui-command-item>
            </dui-command-group>
            <dui-command-separator></dui-command-separator>
            <dui-command-group heading="Settings">
              <dui-command-item value="profile">
                Profile
                <dui-command-shortcut>⌘P</dui-command-shortcut>
              </dui-command-item>
              <dui-command-item value="billing">
                Billing
                <dui-command-shortcut>⌘B</dui-command-shortcut>
              </dui-command-item>
              <dui-command-item value="settings">
                Settings
                <dui-command-shortcut>⌘,</dui-command-shortcut>
              </dui-command-item>
            </dui-command-group>
          </dui-command-list>
        </dui-command>
      </dui-docs-demo>

      <dui-docs-demo label="With disabled items">
        <dui-command style="border: 1px solid var(--border); border-radius: var(--radius-lg); max-width: 450px;">
          <dui-command-input placeholder="Search actions..."></dui-command-input>
          <dui-command-list>
            <dui-command-empty>No results found.</dui-command-empty>
            <dui-command-group heading="Actions">
              <dui-command-item value="copy">Copy</dui-command-item>
              <dui-command-item value="paste">Paste</dui-command-item>
              <dui-command-item value="cut" disabled>Cut (disabled)</dui-command-item>
              <dui-command-item value="delete">Delete</dui-command-item>
            </dui-command-group>
          </dui-command-list>
        </dui-command>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
