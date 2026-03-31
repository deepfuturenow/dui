import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

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
    const meta = componentRegistry.find((c) => c.tagName === "dui-command")!;
    const inputMeta = componentRegistry.find((c) => c.tagName === "dui-command-input")!;
    const listMeta = componentRegistry.find((c) => c.tagName === "dui-command-list")!;
    const groupMeta = componentRegistry.find((c) => c.tagName === "dui-command-group")!;
    const itemMeta = componentRegistry.find((c) => c.tagName === "dui-command-item")!;
    const emptyMeta = componentRegistry.find((c) => c.tagName === "dui-command-empty")!;
    const separatorMeta = componentRegistry.find((c) => c.tagName === "dui-command-separator")!;
    const shortcutMeta = componentRegistry.find((c) => c.tagName === "dui-command-shortcut")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

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

      <h2>API Reference — Command</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Input</h2>
      ${renderApiTable(inputMeta)}

      <h2>API Reference — List</h2>
      ${renderApiTable(listMeta)}

      <h2>API Reference — Group</h2>
      ${renderApiTable(groupMeta)}

      <h2>API Reference — Item</h2>
      ${renderApiTable(itemMeta)}

      <h2>API Reference — Empty</h2>
      ${renderApiTable(emptyMeta)}

      <h2>API Reference — Separator</h2>
      ${renderApiTable(separatorMeta)}

      <h2>API Reference — Shortcut</h2>
      ${renderApiTable(shortcutMeta)}
    `;
  }
}
