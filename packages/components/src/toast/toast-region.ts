import { css, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { DuiToastRegionPrimitive } from "@dui/primitives/toast";
import "../_install.ts";

/**
 * Theme override values for `<dui-toast-region theme="...">`.
 *
 * - `light` / `dark` — force a fixed palette regardless of page theme.
 * - `inverted` — resolve at runtime to the opposite of the page theme.
 */
type RegionTheme = "light" | "dark" | "inverted" | undefined;

const styles = css`
  /* ── Region-scoped tokens ──
  *
  * Bump the default region width (primitive ships 22rem; 24rem reads
  * better with action + close affordances).
  *
  * Stack-visual knobs (peek, scale falloff, expanded gap) are exposed for
  * consumer tuning without rewriting the cascade transforms.
  */
  :host {
    --toast-region-width: 24rem;
    --toast-stack-peek: var(--space-3_5);
    --toast-stack-scale-step: 0.05;
    --toast-expanded-gap: var(--space-2);
  }

  /* ── theme="light|dark" overrides ──
  *
  * Re-declare the four Layer-1 primitives AND every Layer-2 derivation on
  * the host. Custom-property var() references resolve at the *declaring*
  * element's scope, so the recipes in tokens.css (declared on :root) bake
  * in :root's --background/--foreground at definition time. Descendants
  * inherit the already-resolved values, not the recipes themselves. To
  * make scoped theme overrides actually work we re-declare the recipes
  * here so they resolve against the host's overridden Layer-1 values.
  *
  * If other components want scoped theme overrides later, we promote this
  * to tokens.css (selectors that match :root[data-theme] AND nested
  * [data-theme]).
  */
  :host([data-theme="light"]) {
    --background: oklch(0.97 0 0);
    --foreground: oklch(0.15 0 0);
    --accent: oklch(0.55 0.25 260);
    --destructive: oklch(0.55 0.22 25);
    --success: oklch(0.55 0.18 145);
    --warning: oklch(0.65 0.18 70);
    --info: oklch(0.55 0.18 230);
  }

  :host([data-theme="dark"]) {
    --background: oklch(0.15 0.015 260);
    --foreground: oklch(0.93 0 0);
    --accent: oklch(0.75 0.18 260);
    --destructive: oklch(0.70 0.18 25);
    --success: oklch(0.72 0.16 145);
    --warning: oklch(0.78 0.15 70);
    --info: oklch(0.72 0.15 230);
  }

  /* Layer-2 derivations re-declared at the host so they pick up the
    overridden Layer-1 values above. */
  :host([data-theme="light"]),
  :host([data-theme="dark"]) {
    --sunken-2: oklch(from var(--background) calc(l - 0.03) c h);
    --sunken-1: oklch(from var(--background) calc(l - 0.01) c h);
    --surface-1: oklch(from var(--background) calc(l + 0.02) c h);
    --surface-2: oklch(from var(--background) calc(l + 0.05) c h);
    --surface-3: oklch(from var(--background) calc(l + 0.09) c h);

    --border: oklch(from var(--foreground) l c h / 0.15);
    --border-strong: oklch(from var(--foreground) l c h / 0.25);

    --text-1: oklch(from var(--foreground) l c h / 0.90);
    --text-2: oklch(from var(--foreground) l c h / 0.63);
    --text-3: oklch(from var(--foreground) l c h / 0.45);

    --accent-subtle: oklch(from var(--accent) l c h / 0.10);
    --accent-text: oklch(from var(--accent) calc(l * 1.1) calc(c * 0.8) h);

    --destructive-subtle: oklch(from var(--destructive) l c h / 0.10);
    --destructive-text: var(--destructive);

    --success-subtle: oklch(from var(--success) l c h / 0.10);
    --success-text: oklch(from var(--success) calc(l * 1.05) calc(c * 0.9) h);

    --warning-subtle: oklch(from var(--warning) l c h / 0.10);
    --warning-text: oklch(from var(--warning) calc(l * 1.05) calc(c * 0.9) h);

    --info-subtle: oklch(from var(--info) l c h / 0.10);
    --info-text: oklch(from var(--info) calc(l * 1.05) calc(c * 0.9) h);

    --scrim: oklch(from var(--foreground) l c h / 0.35);
  }

  /* ── List layout (cascade stacking on by default) ──
  *
  * Toasts overlap via position: absolute and use the HOST as their
  * containing block, so they pin to the region's anchored edge regardless
  * of stack size. The list itself stays in normal flow with a min-height
  * so the region is a viable hover target when collapsed.
  *
  * IMPORTANT: do NOT make the list position: relative. Doing so would make
  * IT the containing block; since the absolute toasts don't contribute to
  * its height, the list collapses to min-height (60px) and toasts pin to
  * a 60px box instead of the (potentially taller) region. The host's
  * position: fixed (auto-region) or position: relative (declarative,
  * scoped use) is the right containing block.
  */
  [part="list"] {
    min-height: 60px;
    /* Override primitive's default flex gap — we position absolutely. */
    gap: 0;
  }

  /* ── Toast stacking transforms (collapsed) ──
  *
  * Bottom-anchored: each older toast lifts up + scales down a step.
  * Top-anchored: mirror image — older toasts drop down + scale down.
  */
  ::slotted(dui-toast) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    transform-origin: bottom center;
    transform: translateY(
      calc(var(--toast-index, 0) * -1 * var(--toast-stack-peek))
    ) scale(calc(1 - var(--toast-index, 0) * var(--toast-stack-scale-step)));
    transition:
      transform var(--duration-normal) var(--ease-out-3),
      opacity var(--duration-normal) var(--ease-out-3);
    }

    :host([data-position^="top-"]) ::slotted(dui-toast) {
      top: 0;
      bottom: auto;
      transform-origin: top center;
      transform: translateY(calc(var(--toast-index, 0) * var(--toast-stack-peek)))
        scale(calc(1 - var(--toast-index, 0) * var(--toast-stack-scale-step)));
      }

      /* Front toast and any toast inside an expanded region are interactive. */
      ::slotted(dui-toast[data-front]),
      ::slotted(dui-toast[data-region-expanded]) {
        pointer-events: auto;
      }

      /* ── Expanded layout: real cumulative-height layout ── */
      ::slotted(dui-toast[data-region-expanded]) {
        transform: translateY(
          calc(
            -1 * var(--toasts-before-height, 0px) -
              var(--toast-index, 0) * var(--toast-expanded-gap)
            )
          );
        }

        :host([data-position^="top-"]) ::slotted(dui-toast[data-region-expanded]) {
          transform: translateY(
            calc(
              var(--toasts-before-height, 0px) +
                var(--toast-index, 0) * var(--toast-expanded-gap)
              )
            );
          }

          /* ── Overflow: hide toasts past max-visible when collapsed ── */
          ::slotted(dui-toast[data-overflow]) {
            opacity: 0;
            pointer-events: none;
          }

          ::slotted(dui-toast[data-overflow][data-region-expanded]) {
            opacity: 1;
            pointer-events: auto;
          }

          /* ── Reduced motion ── */
          @media (prefers-reduced-motion: reduce) {
            ::slotted(dui-toast) {
              transition-duration: 0s;
            }
          }
        `;

        /**
         * `<dui-toast-region>` — Styled toast viewport.
         *
         * Extends the primitive with:
         * - Sonner-style cascade-and-expand stacking (default-on)
         * - Wider 24rem default width
         * - Consumer-tunable stack visuals (`--toast-stack-peek`,
         *   `--toast-stack-scale-step`, `--toast-expanded-gap`)
         * - Optional `theme="light|dark|inverted"` palette override
         *
         * Default position is the primitive's `bottom-right`; flip via the inherited
         * `position` attribute. Imperative `toast()` calls land here automatically.
         *
         * @attr theme - `"light" | "dark" | "inverted"`. Unset = inherit page theme.
         *   `inverted` resolves at runtime to the opposite of the document's
         *   `<html data-theme>` attribute.
         */
        export class DuiToastRegion extends DuiToastRegionPrimitive {
          static override styles = [...DuiToastRegionPrimitive.styles, styles];

          /**
           * Optional palette override. Unset = inherit page theme. `inverted`
           * resolves at runtime to the opposite of `<html>`'s `data-theme`.
           */
          @property({ type: String, reflect: true })
          accessor theme: RegionTheme = undefined;

          /** Watcher for the document-level theme so `inverted` stays correct. */
          #docThemeObserver: MutationObserver | undefined;

          override connectedCallback(): void {
            super.connectedCallback();
            this.#applyTheme();
            if (this.theme === "inverted") this.#observeDocTheme();
          }

          override disconnectedCallback(): void {
            super.disconnectedCallback();
            this.#stopObservingDocTheme();
          }

          override willUpdate(changed: PropertyValues): void {
            super.willUpdate(changed);
            if (changed.has("theme")) {
              this.#applyTheme();
              if (this.theme === "inverted") this.#observeDocTheme();
              else this.#stopObservingDocTheme();
            }
          }

          /**
           * Resolve the `theme` property into a `data-theme` attribute on the host.
           * For `inverted`, read `<html>`'s `data-theme` and flip.
           */
          #applyTheme(): void {
            if (!this.theme) {
              this.removeAttribute("data-theme");
              return;
            }
            if (this.theme === "inverted") {
              const docTheme = document.documentElement.getAttribute(
                "data-theme",
              );
              const inverted = docTheme === "dark" ? "light" : "dark";
              this.setAttribute("data-theme", inverted);
              return;
            }
            this.setAttribute("data-theme", this.theme);
          }

          #observeDocTheme(): void {
            if (this.#docThemeObserver) return;
            this.#docThemeObserver = new MutationObserver(() =>
              this.#applyTheme()
            );
            this.#docThemeObserver.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ["data-theme"],
            });
          }

          #stopObservingDocTheme(): void {
            this.#docThemeObserver?.disconnect();
            this.#docThemeObserver = undefined;
          }
        }

        customElements.define(DuiToastRegion.tagName, DuiToastRegion);
