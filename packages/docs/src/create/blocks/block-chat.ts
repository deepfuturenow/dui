import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Paperclip, SlidersHorizontal, ArrowRight } from "lucide-static";
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
              <dui-icon style="margin-right: var(--space-1)">${unsafeHTML(Paperclip)}</dui-icon>
              Files
            </dui-button>

          </div>
          <div class="toolbar-right">
            <dui-tooltip side="bottom">
              <dui-tooltip-trigger>
                <dui-button appearance="ghost" size="icon-sm">
                  <dui-icon>${unsafeHTML(SlidersHorizontal)}</dui-icon>
                </dui-button>
              </dui-tooltip-trigger>
              <dui-tooltip-popup>Settings</dui-tooltip-popup>
            </dui-tooltip>
            <dui-separator orientation="vertical" style="height: var(--space-4); align-self: center; padding-right: var(--space-3)"></dui-separator>
            <dui-button size="sm" style="--button-padding-x: var(--space-4)">
              <dui-icon>${unsafeHTML(ArrowRight)}</dui-icon>
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
