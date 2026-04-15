import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-slider")
export class DocsPageSlider extends LitElement {
  protected override createRenderRoot() { return this; }

  #onHueChange = (e: Event): void => {
    const value = (e as CustomEvent).detail.value;
    (e.target as HTMLElement).style.setProperty(
      "--thumb-color",
      `oklch(0.7 0.2 ${value})`,
    );
  };

  override render() {
    return html`
      <style>
        .oklch-hue {
          --slider-thumb-size: var(--space-4);
        }
        .oklch-hue::part(thumb) {
          background: var(--thumb-color);
          border-color: white;
          border-radius: 3px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
          transform: translateX(-50%) rotate(45deg);
        }
      </style>

      <docs-page-layout tag="dui-slider">
        <dui-docs-demo label="Default (0–100)" demo-width="16rem">
          <dui-slider value="50"></dui-slider>
        </dui-docs-demo>

        <dui-docs-demo label="Custom range (0–10, step 1)" demo-width="16rem">
          <dui-slider value="3" min="0" max="10" step="1"></dui-slider>
        </dui-docs-demo>

        <dui-docs-demo label="Fine step (0–1, step 0.01)" demo-width="16rem">
          <dui-slider value="0.5" min="0" max="1" step="0.01"></dui-slider>
        </dui-docs-demo>

        <dui-docs-demo label="Disabled" demo-width="16rem">
          <dui-slider value="70" disabled></dui-slider>
        </dui-docs-demo>

        <!-- Field variant demos -->

        <dui-docs-demo label="Field variant — distance (0–1, step 0.01)" demo-width="16rem">
          <dui-slider variant="field" value="0.12" min="0" max="1" step="0.01"></dui-slider>
        </dui-docs-demo>

        <dui-docs-demo label="Field variant — subdivisions (0–12, step 1)" demo-width="16rem">
          <dui-slider variant="field" value="3" min="0" max="12" step="1" label="Subdivisions"></dui-slider>
        </dui-docs-demo>

        <dui-docs-demo label="Field variant — percentage (0–100)" demo-width="16rem">
          <dui-slider variant="field" value="100" min="0" max="100"></dui-slider>
        </dui-docs-demo>

        <dui-docs-demo label="Field variant — labeled" demo-width="16rem">
          <dui-slider variant="field" label="Lightness" value="52" min="0" max="100"></dui-slider>
        </dui-docs-demo>

        <dui-docs-demo label="Field variant — disabled" demo-width="16rem">
          <dui-slider variant="field" value="42" min="0" max="100" label="Opacity" disabled></dui-slider>
        </dui-docs-demo>

        <!-- Gradient track with diamond thumb -->

        <dui-docs-demo label="Gradient track — OKLCH hue" demo-width="16rem">
          <dui-slider
            class="oklch-hue"
            variant="field"
            value="300"
            min="0"
            max="360"
            step="1"
            style="--slider-track-bg: linear-gradient(90deg,
              oklch(0.7 0.2 0), oklch(0.7 0.2 60), oklch(0.7 0.2 120),
              oklch(0.7 0.2 180), oklch(0.7 0.2 240), oklch(0.7 0.2 300),
              oklch(0.7 0.2 360));
              --slider-indicator-opacity: 0;
              --thumb-color: oklch(0.7 0.2 300);
              --slider-thumb-size: var(--space-6);"
            @value-change=${this.#onHueChange}
          ></dui-slider>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
