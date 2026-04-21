import { LitElement, html, css } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

@customElement("block-chat")
export class BlockChat extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      padding: var(--space-5);
    }

    /* ── Top bar: dropdowns ── */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }

    /* ── Input card ── */
    .input-card {
      transition-property: border-color, box-shadow;
      transition-duration: var(--duration-fast);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface-1);
      padding: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .input-card dui-textarea {
      width: 100%;
      --textarea-min-height: var(--space-16);
    }

    .input-card dui-textarea::part(textarea) {
      resize: none;
    }

    /* Draw focus ring on the card instead of the textarea */
    .input-card:focus-within {
      box-shadow:
        0 0 0 var(--focus-ring-offset) var(--background),
        0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: var(--space-3);
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }


    /* ── Source chips row ── */
    .sources {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .dot {
      width: var(--space-2);
      height: var(--space-2);
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    .plus {
      font-size: var(--text-lg);
      color: var(--text-3);
      line-height: var(--line-height-none);
    }
  `];

  override render() {
    return html`
      <div class="top-bar">
        <div></div>
        <dui-select
          placeholder="Model"
          size="sm"
          .options=${[
            { label: "Llama 4 Maverick", value: "llama-4-maverick" },
            { label: "Mistral Large", value: "mistral-large" },
            { label: "Gemma 3 27B", value: "gemma-3-27b" },
            { label: "Qwen 2.5 72B", value: "qwen-2.5-72b" },
            { label: "DeepSeek V3", value: "deepseek-v3" },
          ]}
          value="llama-4-maverick"
        ></dui-select>
      </div>

      <div class="input-card">
        <dui-textarea
          variant="ghost"
          placeholder="Ask anything. Type @ to mention sources."
          rows="3"
        ></dui-textarea>

        <div class="toolbar">
          <div class="toolbar-left">
            <dui-button appearance="ghost" size="sm">
              <dui-icon style="margin-right: var(--space-1)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></dui-icon>
              Files
            </dui-button>

          </div>
          <div class="toolbar-right">
            <dui-tooltip side="bottom">
              <dui-tooltip-trigger>
                <dui-button appearance="ghost" size="icon-sm">
                  <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg></dui-icon>
                </dui-button>
              </dui-tooltip-trigger>
              <dui-tooltip-popup>Settings</dui-tooltip-popup>
            </dui-tooltip>
            <dui-separator orientation="vertical" style="height: var(--space-4); align-self: center; padding-right: var(--space-3)"></dui-separator>
            <dui-button size="sm" style="--button-padding-x: var(--space-4)">
              <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></dui-icon>
            </dui-button>
          </div>
        </div>
      </div>

      <div class="sources">
        <dui-button appearance="outline" size="sm">
          <span class="dot" style="background: #3b82f6"></span>
          Web
          <span class="plus">+</span>
        </dui-button>
        <dui-button appearance="outline" size="sm">
          <span class="dot" style="background: #a855f7"></span>
          Knowledge base
          <span class="plus">+</span>
        </dui-button>
        <dui-button appearance="outline" size="sm">
          <span class="dot" style="background: #f97316"></span>
          Documents
          <span class="plus">+</span>
        </dui-button>
      </div>
    `;
  }
}
