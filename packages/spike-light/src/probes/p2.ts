/**
 * P2 — compound elements under a framework parent.
 *
 * A Lit parent owns the dialog family's children: a 500ms conditional child
 * in the body, a repeat() list that reorders, a focused input, a
 * captureStream-driven autoplay video, and a child inserted between header
 * and body after connect. Also a vanilla innerHTML instance. The runner
 * drives 50 re-renders and asserts focus, playback continuity, ordering,
 * and the focus trap.
 *
 * Structural note this probe answers (spec P2.1): parts that render do so
 * into their OWN element (bui-dialog-close renders its button into itself),
 * so their lit-html markers never sit among the parent's children. Wrapping
 * parts (body) render nothing at all. Two renderers only ever share a
 * container if a part rendered chrome into a consumer-owned region — which
 * the conventions forbid, and nothing here does.
 */
import { css, html, LitElement, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "../components/dialog.ts";
import "../components/button.ts";

class P2App extends LitElement {
  static override properties = {
    tick: { state: true },
    order: { state: true },
    insertMid: { state: true },
  };

  declare tick: number;
  declare order: number[];
  declare insertMid: boolean;

  static override styles = css`:host { display: block; }`;

  constructor() {
    super();
    this.tick = 0;
    this.order = [1, 2, 3, 4, 5];
    this.insertMid = false;
  }

  protected override createRenderRoot(): HTMLElement {
    return this; // light DOM so the probe can reach in easily
  }

  override firstUpdated(): void {
    const video = this.querySelector("video")!;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    let hue = 0;
    setInterval(() => {
      ctx.fillStyle = `hsl(${hue = (hue + 7) % 360} 80% 50%)`;
      ctx.fillRect(0, 0, 32, 32);
    }, 100);
    (video as HTMLVideoElement).srcObject = canvas.captureStream(10);
    setTimeout(() => (this.insertMid = true), 1000);
  }

  shuffle(): void {
    this.order = [...this.order.slice(1), this.order[0]];
  }

  rerender(): void {
    this.tick++;
  }

  override render() {
    return html`
      <bui-dialog id="lit-dialog" data-tick="${this.tick}">
        <bui-dialog-header><h2>Framework parent</h2></bui-dialog-header>
        ${this.insertMid
          ? html`<div id="mid-insert">inserted between header and body</div>`
          : nothing}
        <bui-dialog-body>
          ${this.tick % 2 === 0 ? html`<div id="cond">even</div>` : nothing}
          <ul id="list">
            ${repeat(this.order, (n) => n, (n) => html`<li data-n="${n}"><button id="item-${n}">item ${n}</button></li>`)}
          </ul>
          <input id="keep-focus" value="focus me" />
          <video id="vid" muted autoplay playsinline></video>
        </bui-dialog-body>
        <bui-dialog-footer>
          <bui-button><button id="ok">OK</button></bui-button>
        </bui-dialog-footer>
        <bui-dialog-close></bui-dialog-close>
      </bui-dialog>
    `;
  }
}
customElements.define("p2-app", P2App);

// Vanilla innerHTML instance.
document.getElementById("vanilla")!.innerHTML = `
  <bui-dialog id="vanilla-dialog">
    <bui-dialog-header><h2>Vanilla</h2></bui-dialog-header>
    <bui-dialog-body><p>plain innerHTML</p><button id="v-btn">b</button></bui-dialog-body>
    <bui-dialog-close></bui-dialog-close>
  </bui-dialog>`;

declare global {
  // deno-lint-ignore no-explicit-any
  interface Window { __p2: any }
}
window.__p2 = {
  app: () => document.querySelector("p2-app") as P2App,
};
