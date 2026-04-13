import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-events")
export class BlockEvents extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .section {
      padding: var(--space-4) var(--space-6);
    }

    .section + .section {
      border-top: var(--border-width-thin) solid var(--border);
    }

    /* ── Header ── */

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      font-size: var(--font-size-base);
      font-weight: 600;
      margin: 0;
    }

    /* ── Category dot ── */

    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
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
      top: 8px;
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
      top: 6px;
      width: 7px;
      height: 7px;
      border-radius: var(--radius-full);
      background: var(--accent);
    }

    .event-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-1);
    }

    .event-time {
      font-size: var(--font-size-xs);
      color: var(--text-2);
      margin-left: auto;
    }

    .event-title {
      font-size: var(--font-size-sm);
      font-weight: 500;
      margin: 0 0 var(--space-2);
      line-height: 1.4;
    }

    .event-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
    }
  `;

  override render() {
    return html`
      <div class="section">
        <div class="header">
          <p class="title">Events Timeline</p>
          <dui-button appearance="ghost" size="icon-sm">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></dui-icon>
          </dui-button>
        </div>
      </div>

      <div class="section">
        <dui-toggle-group type="single" .defaultValue=${["today"]}>
          <dui-toggle value="today">Today</dui-toggle>
          <dui-toggle value="1d">1d ago</dui-toggle>
          <dui-toggle value="2d">2d ago</dui-toggle>
          <dui-toggle value="3d">3d ago</dui-toggle>
        </dui-toggle-group>
        <div class="event">
          <div class="event-header">
            <dui-badge variant="info">LAUNCH</dui-badge>
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
            <dui-badge variant="success">FUNDING</dui-badge>
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
      </div>
    `;
  }
}
