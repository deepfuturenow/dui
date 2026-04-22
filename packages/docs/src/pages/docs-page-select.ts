import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-select")
export class DocsPageSelect extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

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
      const longFruitOptions = [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry" },
        { label: "Dragonfruit", value: "dragonfruit" },
        { label: "Elderberry", value: "elderberry" },
        { label: "Fig", value: "fig" },
        { label: "Grape", value: "grape" },
        { label: "Honeydew", value: "honeydew" },
        { label: "Kiwi", value: "kiwi" },
        { label: "Lemon", value: "lemon" },
        { label: "Mango", value: "mango" },
        { label: "Nectarine", value: "nectarine" },
        { label: "Orange", value: "orange" },
        { label: "Papaya", value: "papaya" },
        { label: "Quince", value: "quince" },
      ];
      const modelOptions = [
        { label: "Llama 4 Maverick", value: "llama4" },
        { label: "Mistral Large", value: "mistral" },
        { label: "Gemma 3 27B", value: "gemma" },
        { label: "Qwen 2.5 72B", value: "qwen" },
        { label: "DeepSeek V3", value: "deepseek" },
      ];
      const disabledOptions = [
        { label: "Option A", value: "a" },
        { label: "Option B (disabled)", value: "b", disabled: true },
        { label: "Option C", value: "c" },
      ];
      selects.forEach((el: any) => {
        if (el.id === "select-disabled-opts") {
          el.options = disabledOptions;
        } else if (el.id === "select-long-labels") {
          el.options = modelOptions;
        } else if (
          el.id === "select-align-long" ||
          el.id === "select-align-first" ||
          el.id === "select-align-last"
        ) {
          el.options = longFruitOptions;
        } else if (el.id === "select-no-align") {
          el.options = fruitOptions;
          el.alignItemToTrigger = false;
        } else {
          el.options = fruitOptions;
        }
      });
    });
  }

  override render() {
    return html`
      <docs-page-layout tag="dui-select">
        <dui-docs-demo label="Default" demo-width="var(--space-56)">
          <dui-select placeholder="Pick a fruit..."></dui-select>
        </dui-docs-demo>

        <dui-docs-demo label="With pre-selected value" demo-width="var(--space-56)">
          <dui-select value="cherry" placeholder="Pick a fruit..."></dui-select>
        </dui-docs-demo>

        <dui-docs-demo label="Disabled" demo-width="var(--space-56)">
          <dui-select disabled placeholder="Pick a fruit..."></dui-select>
        </dui-docs-demo>

        <dui-docs-demo label="Disabled options" demo-width="var(--space-56)">
          <dui-select
            id="select-disabled-opts"
            placeholder="Choose..."
          ></dui-select>
        </dui-docs-demo>

        <dui-docs-demo label="Long labels (popup wider than trigger)">
          <dui-select
            id="select-long-labels"
            value="llama4"
            style="width: 120px"
          ></dui-select>
        </dui-docs-demo>

        <dui-docs-demo
          label="Standard dropdown (no alignment)"
          description='Set align-item-to-trigger="false" for traditional dropdown positioning.'
          demo-width="var(--space-64)"
        >
          <dui-select
            id="select-no-align"
            value="cherry"
          ></dui-select>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
