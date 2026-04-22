import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-preview-card")
export class DocsPagePreviewCard extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const linkStyle = "color: var(--text-1); text-decoration: underline; text-underline-offset: 1px;";
    const popupHeading = "display: block; font-size: var(--text-xs); font-weight: var(--font-weight-semibold); text-box: trim-both cap alphabetic;";
    const popupBody = "display: block; color: var(--text-2); font-size: var(--text-xs); line-height: var(--text-xs--line-height); text-box: trim-both cap alphabetic";
    const popupWrap = "display: flex; flex-direction: column; gap: var(--space-4); max-width: var(--space-72);";

    return html`
      <docs-page-layout tag="dui-preview-card" .additionalTags=${["dui-preview-card-trigger", "dui-preview-card-popup"]}>

        <dui-docs-demo label="Inline links" demo-width="var(--space-96)">
          <div style="color: var(--text-2); font-size: var(--text-sm); line-height: var(--text-sm--line-height);">Howe Sound's mouth at the
            <dui-preview-card>
              <dui-preview-card-trigger>
                <a href="https://en.wikipedia.org/wiki/Strait_of_Georgia" style="${linkStyle}">Strait of Georgia</a>
              </dui-preview-card-trigger>
              <dui-preview-card-popup>
                <span style="${popupWrap}">
                  <strong style="${popupHeading}">Strait of Georgia</strong>
                  <span style="${popupBody}">The Strait of Georgia is an arm of the Salish Sea between Vancouver Island and the southwestern mainland coast of British Columbia, Canada. It is approximately 240 km (150 mi) long and varies in width from 20 to 58 km.</span>
                </span>
              </dui-preview-card-popup>
            </dui-preview-card>
            is situated between
            <dui-preview-card>
              <dui-preview-card-trigger>
                <a href="https://en.wikipedia.org/wiki/West_Vancouver" style="${linkStyle}">West Vancouver</a>
              </dui-preview-card-trigger>
              <dui-preview-card-popup>
                <span style="${popupWrap}">
                  <strong style="${popupHeading}">West Vancouver</strong>
                  <span style="${popupBody}">West Vancouver is a district municipality in British Columbia, Canada. Situated on the north shore of Burrard Inlet, it is among the wealthiest municipalities in Canada and is home to the Horseshoe Bay ferry terminal.</span>
                </span>
              </dui-preview-card-popup>
            </dui-preview-card>
            and the
            <dui-preview-card>
              <dui-preview-card-trigger>
                <a href="https://en.wikipedia.org/wiki/Sunshine_Coast_(British_Columbia)" style="${linkStyle}">Sunshine Coast</a>
              </dui-preview-card-trigger>
              <dui-preview-card-popup>
                <span style="${popupWrap}">
                  <strong style="${popupHeading}">Sunshine Coast</strong>
                  <span style="${popupBody}">The Sunshine Coast is a geographic subregion of the British Columbia Coast. It can be reached only by ferry or floatplane, as no access roads have been built around the fjords separating it from the rest of the province.</span>
                </span>
              </dui-preview-card-popup>
            </dui-preview-card>.
            The sound is triangular, opening to the southwest into the Strait of Georgia, and extends 42 km (26 mi) northeast to its head at
            <dui-preview-card>
              <dui-preview-card-trigger>
                <a href="https://en.wikipedia.org/wiki/Squamish,_British_Columbia" style="${linkStyle}">Squamish</a>
              </dui-preview-card-trigger>
              <dui-preview-card-popup>
                <span style="${popupWrap}">
                  <strong style="${popupHeading}">Squamish, British Columbia</strong>
                  <span style="${popupBody}">Squamish is a district municipality in British Columbia, located at the north end of Howe Sound on the Sea-to-Sky Highway. Known for rock climbing, mountain biking, and kiteboarding, it has become a popular outdoor recreation destination.</span>
                </span>
              </dui-preview-card-popup>
            </dui-preview-card>.
            There are several islands in the sound, three of which are large and mountainous in their own right.</div>
        </dui-docs-demo>

        <dui-docs-demo label="Bottom placement">
          <dui-preview-card side="bottom">
            <dui-preview-card-trigger>
              <a href="#" style="${linkStyle}">Preview below</a>
            </dui-preview-card-trigger>
            <dui-preview-card-popup>
              <span style="${popupWrap}">
                <strong style="${popupHeading}">Bottom Preview</strong>
                <span style="${popupBody}">This preview card appears below the trigger instead of above it.</span>
              </span>
            </dui-preview-card-popup>
          </dui-preview-card>
        </dui-docs-demo>

        <dui-docs-demo label="No arrow">
          <dui-preview-card>
            <dui-preview-card-trigger>
              <a href="#" style="${linkStyle}">No arrow</a>
            </dui-preview-card-trigger>
            <dui-preview-card-popup .showArrow=${false}>
              <span style="${popupBody}">Preview without an arrow indicator.</span>
            </dui-preview-card-popup>
          </dui-preview-card>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
