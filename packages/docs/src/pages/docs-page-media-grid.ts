import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import type { MediaItem } from "@dui/templates/media";
import "./docs-template-layout.ts";

const cameraFeeds: MediaItem[] = [
  { src: "https://picsum.photos/seed/cam1/400/250", label: "Terminal A — Gate 12", timestamp: "2 min ago" },
  { src: "https://picsum.photos/seed/cam2/400/250", label: "Parking Lot B", timestamp: "5 min ago" },
  { src: "https://picsum.photos/seed/cam3/400/250", label: "Main Entrance", timestamp: "1 min ago" },
  { src: "https://picsum.photos/seed/cam4/400/250", label: "Server Room C-4", timestamp: "8 min ago" },
  { src: "https://picsum.photos/seed/cam5/400/250", label: "Loading Dock 3", timestamp: "12 min ago" },
  { src: "https://picsum.photos/seed/cam6/400/250", label: "East Perimeter", timestamp: "3 min ago" },
];

const locationThumbs: MediaItem[] = [
  { src: "https://picsum.photos/seed/loc1/400/250", label: "New York" },
  { src: "https://picsum.photos/seed/loc2/400/250", label: "London" },
  { src: "https://picsum.photos/seed/loc3/400/250", label: "Tokyo" },
  { src: "https://picsum.photos/seed/loc4/400/250", label: "Sydney" },
];

const twoItems: MediaItem[] = [
  { src: "https://picsum.photos/seed/two1/400/250", label: "Lobby Camera", timestamp: "Just now" },
  { src: "https://picsum.photos/seed/two2/400/250", label: "Rooftop", timestamp: "4 min ago" },
];

@customElement("docs-page-media-grid")
export class DocsPageMediaGrid extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-media-grid">

        <dui-docs-demo label="Camera Feeds (6 items)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 720px;">
            <dui-media-grid .data=${cameraFeeds}></dui-media-grid>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Location Thumbnails (labels only)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 720px;">
            <dui-media-grid .data=${locationThumbs}></dui-media-grid>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Two Items">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 720px;">
            <dui-media-grid .data=${twoItems}></dui-media-grid>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Custom Min Width (--media-grid-min-width: 14rem)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 720px;">
            <dui-media-grid .data=${cameraFeeds} style="--media-grid-min-width: 14rem;"></dui-media-grid>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Empty State">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 720px;">
            <dui-media-grid .data=${[]} empty-text="No camera feeds available"></dui-media-grid>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
