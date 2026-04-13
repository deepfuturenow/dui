import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-chat")
export class BlockChat extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-5, 1.25rem);
      background: var(--surface-2);
      color: var(--text-1);
    }

    /* ── Top bar: dropdowns ── */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3, 0.75rem);
    }

    /* ── Input card ── */
    .input-card {
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      background: var(--surface-1);
      padding: var(--space-4, 1rem);
      margin-bottom: var(--space-4, 1rem);
    }

    .input-card dui-textarea {
      width: 100%;
      --textarea-min-height: 64px;
    }

    .input-card dui-textarea::part(textarea) {
      border: none;
      background: transparent;
      padding: 0;
      resize: none;
    }

    /* Hide the textarea border */
    .input-card dui-textarea {
      --border-color: transparent;
      --ring-color: transparent;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: var(--space-3, 0.75rem);
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: var(--space-1, 0.25rem);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-1, 0.25rem);
    }

    .toolbar-sep {
      width: 1px;
      height: 16px;
      background: var(--border);
      margin: 0 var(--space-1, 0.25rem);
    }

    /* ── Source chips row ── */
    .sources {
      display: flex;
      gap: var(--space-2, 0.5rem);
      flex-wrap: wrap;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full, 9999px);
      flex-shrink: 0;
    }

    .plus {
      font-size: var(--font-size-lg, 1.125rem);
      color: var(--text-3);
      line-height: 1;
    }
  `;

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
          placeholder="Ask anything. Type @ to mention sources."
          rows="3"
        ></dui-textarea>

        <div class="toolbar">
          <div class="toolbar-left">
            <dui-button appearance="ghost" size="sm">
              <dui-icon style="margin-right: var(--space-1)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></dui-icon>
              Files
            </dui-button>
            <dui-button appearance="ghost" size="sm">
              <dui-icon style="margin-right: var(--space-1)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7v7a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V7"/><path d="M2 7h20"/><path d="M6 3h4l2 4"/><path d="M18 3h-4l-2 4"/></svg></dui-icon>
              Sources
            </dui-button>
          </div>
          <div class="toolbar-right">
            <dui-tooltip side="bottom">
              <dui-tooltip-trigger>
                <dui-button appearance="ghost" size="icon-sm">
                  <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></dui-icon>
                </dui-button>
              </dui-tooltip-trigger>
              <dui-tooltip-popup>Search</dui-tooltip-popup>
            </dui-tooltip>
            <dui-tooltip side="bottom">
              <dui-tooltip-trigger>
                <dui-button appearance="ghost" size="icon-sm">
                  <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg></dui-icon>
                </dui-button>
              </dui-tooltip-trigger>
              <dui-tooltip-popup>Settings</dui-tooltip-popup>
            </dui-tooltip>
            <div class="toolbar-sep"></div>
            <dui-tooltip side="bottom">
              <dui-tooltip-trigger>
                <dui-button appearance="ghost" size="icon-sm">
                  <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg></dui-icon>
                </dui-button>
              </dui-tooltip-trigger>
              <dui-tooltip-popup>Voice input</dui-tooltip-popup>
            </dui-tooltip>
          </div>
        </div>
      </div>

      <div class="sources">
        <dui-button appearance="outline" size="sm">
          <span class="dot" style="background: var(--color-blue-500, #3b82f6)"></span>
          Web search
          <span class="plus">+</span>
        </dui-button>
        <dui-button appearance="outline" size="sm">
          <span class="dot" style="background: var(--color-purple-500, #a855f7)"></span>
          Knowledge base
          <span class="plus">+</span>
        </dui-button>
        <dui-button appearance="outline" size="sm">
          <span class="dot" style="background: var(--color-orange-500, #f97316)"></span>
          Documents
          <span class="plus">+</span>
        </dui-button>
      </div>
    `;
  }
}
