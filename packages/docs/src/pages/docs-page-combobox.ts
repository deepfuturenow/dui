import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

const frameworkOptions = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Lit", value: "lit" },
  { label: "Solid", value: "solid" },
  { label: "Preact", value: "preact" },
  { label: "Ember", value: "ember" },
];

const languageOptions = [
  { label: "TypeScript", value: "ts" },
  { label: "JavaScript", value: "js" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rs" },
  { label: "Go", value: "go" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
  { label: "Ruby", value: "ruby" },
];

@customElement("docs-page-combobox")
export class DocsPageCombobox extends LitElement {
  protected override createRenderRoot() { return this; }

  override connectedCallback(): void {
    super.connectedCallback();
    // Set options after render so elements exist in the DOM
    requestAnimationFrame(() => this.#setOptions());
  }

  #setOptions(): void {
    const single = this.querySelector<HTMLElement & { options: unknown }>("#combo-single");
    const multi = this.querySelector<HTMLElement & { options: unknown }>("#combo-multi");
    const disabled = this.querySelector<HTMLElement & { options: unknown }>("#combo-disabled");
    if (single) single.options = frameworkOptions;
    if (multi) multi.options = languageOptions;
    if (disabled) disabled.options = frameworkOptions;
  }

  override render() {

    return html`
      <docs-page-layout tag="dui-combobox">
        <dui-docs-demo label="Single select">
        <dui-combobox id="combo-single" placeholder="Select a framework..."></dui-combobox>
      </dui-docs-demo>

      <dui-docs-demo label="Multi select">
        <dui-combobox id="combo-multi" multiple placeholder="Select languages..."></dui-combobox>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-combobox id="combo-disabled" disabled placeholder="Disabled..."></dui-combobox>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
