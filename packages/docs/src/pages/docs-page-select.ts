import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-select")
export class DocsPageSelect extends LitElement {
  protected override createRenderRoot() { return this; }

  #el?: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    requestAnimationFrame(() => {
      const selects = this.querySelectorAll("dui-select");
      const fruitOptions = [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry" },
        { label: "Dragonfruit", value: "dragonfruit" },
        { label: "Elderberry", value: "elderberry" },
      ];
      const disabledOptions = [
        { label: "Option A", value: "a" },
        { label: "Option B (disabled)", value: "b", disabled: true },
        { label: "Option C", value: "c" },
      ];
      selects.forEach((el: any) => {
        if (el.id === "select-disabled-opts") {
          el.options = disabledOptions;
        } else {
          el.options = fruitOptions;
        }
      });
    });
  }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-select")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default">
        <dui-select placeholder="Pick a fruit..."></dui-select>
      </dui-docs-demo>

      <dui-docs-demo label="With pre-selected value">
        <dui-select value="cherry" placeholder="Pick a fruit..."></dui-select>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-select disabled placeholder="Pick a fruit..."></dui-select>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled options">
        <dui-select id="select-disabled-opts" placeholder="Choose..."></dui-select>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
