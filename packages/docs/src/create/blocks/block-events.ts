import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ChevronRight } from "lucide-static";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";

@customElement("block-events")
export class BlockEvents extends LitElement {
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    /* ── Header ── */

    dui-card::part(header) {
      padding-bottom: var(--space-5);
      border-bottom: var(--border-width-thin) solid var(--border);
      background-color: var(--surface-3);
    }

    /* ── Category dot ── */

    .dot {
      display: inline-block;
      width: var(--space-1_5);
      height: var(--space-1_5);
      border-radius: var(--radius-full);
      margin-right: var(--space-1);
      vertical-align: middle;
    }

    .dot-blue { background: #3b82f6; }
    .dot-green { background: #22c55e; }
    .dot-orange { background: #f97316; }
    .dot-red { background: #ef4444; }
    .dot-purple { background: #a855f7; }

    /* ── Timeline ── */

    .event {
      position: relative;
      padding-left: var(--space-5);
      padding-bottom: var(--space-5);
    }

    .event:last-child {
      padding-bottom: 0;
    }

    /* Timeline line */
    .event::before {
      content: "";
      position: absolute;
      left: 3px;
      top: var(--space-2);
      bottom: 0;
      width: 1px;
      background: var(--border);
    }

    .event:last-child::before {
      display: none;
    }

    /* Timeline dot */
    .event::after {
      content: "";
      position: absolute;
      left: 0;
      top: var(--space-1_5);
      width: var(--space-1_5);
      height: var(--space-1_5);
      border-radius: var(--radius-full);
      background: var(--accent);
    }

    .event-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }

    .event-time {
      font-size: var(--text-xs);
      color: var(--text-2);
      margin-left: auto;
    }

    .event-title {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      margin: 0 0 var(--space-2);
      line-height: var(--text-xl--line-height);
      text-box: trim-both cap alphabetic;
    }

    .event-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
    }

    /* ── Footer filters ── */

    dui-card::part(footer) {
      background: var(--sunken-1);
      justify-content: center;
      padding: var(--space-3);
    }

  `];

  override render() {
    return html`
      <dui-card>
        <span slot="title">Events Timeline</span>
        <dui-button slot="action" appearance="ghost" size="icon-sm">
          <dui-icon>${unsafeHTML(ChevronRight)}</dui-icon>
        </dui-button>

        <div class="event">
          <div class="event-header">
            <dui-badge variant="primary">LAUNCH</dui-badge>
            <span class="event-time">2h ago</span>
          </div>
          <p class="event-title">OpenAI releases GPT-5 with real-time multimodal reasoning and 1M token context</p>
          <div class="event-tags">
            <dui-badge appearance="outline">AI</dui-badge>
            <dui-badge appearance="outline">Models</dui-badge>
            <dui-badge appearance="outline">API</dui-badge>
          </div>
        </div>

        <div class="event">
          <div class="event-header">
            <dui-badge variant="neutral">FUNDING</dui-badge>
            <span class="event-time">5h ago</span>
          </div>
          <p class="event-title">Stripe raises $8B Series J at $95B valuation to expand AI-powered fraud detection</p>
          <div class="event-tags">
            <dui-badge appearance="outline">Fintech</dui-badge>
            <dui-badge appearance="outline">Payments</dui-badge>
          </div>
        </div>

        <div class="event">
          <div class="event-header">
            <dui-badge variant="danger">OUTAGE</dui-badge>
            <span class="event-time">8h ago</span>
          </div>
          <p class="event-title">AWS us-east-1 experiences 45-min S3 degradation affecting major SaaS providers</p>
          <div class="event-tags">
            <dui-badge appearance="outline">Cloud</dui-badge>
            <dui-badge appearance="outline">Infrastructure</dui-badge>
            <dui-badge appearance="outline">Incident</dui-badge>
          </div>
        </div>

        <dui-toggle-group slot="footer" type="single" .defaultValue=${["today"]}>
          <dui-toggle size="sm" value="today">Today</dui-toggle>
          <dui-toggle size="sm" value="1d">1d ago</dui-toggle>
          <dui-toggle size="sm" value="2d">2d ago</dui-toggle>
          <dui-toggle size="sm" value="3d">3d ago</dui-toggle>
        </dui-toggle-group>
      </dui-card>
    `;
  }
}
