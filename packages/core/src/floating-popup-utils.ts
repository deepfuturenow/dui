/**
 * Shared utilities for floating popup components (popover, tooltip).
 * Provides animation lifecycle helpers, arrow rendering, and a centralized
 * Floating UI positioning wrapper.
 */

import { html, type TemplateResult } from "lit";
import {
  autoUpdate,
  computePosition,
  flip,
  type Middleware,
  offset,
  type Placement,
  platform,
  shift,
  size,
} from "@floating-ui/dom";

export type FloatingPopupSide = "top" | "bottom";

/** Double-rAF to ensure CSS starting-style is applied then removed. */
export const waitForAnimationFrame = (): Promise<void> =>
  new Promise<void>((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );

/** Listen for transitionend with a fallback timeout. Guards against double-fire. */
export const onTransitionEnd = (
  el: Element,
  callback: () => void,
  fallbackMs = 200,
): void => {
  let called = false;
  const done = (): void => {
    if (called) return;
    called = true;
    el.removeEventListener("transitionend", onEnd);
    clearTimeout(timer);
    callback();
  };
  const onEnd = (): void => done();
  el.addEventListener("transitionend", onEnd);
  const timer = setTimeout(done, fallbackMs);
};

/** Render an arrow SVG pointing at the trigger. */
export const renderArrow = (side: FloatingPopupSide): TemplateResult => html`
  <svg class="Arrow" part="arrow" viewBox="0 0 10 6" data-side="${side}">
    <polygon class="arrow-fill" points="0,0 5,6 10,0" />
    <path class="arrow-stroke" d="M 0,0 L 5,6 L 10,0" />
  </svg>
`;

// ---------------------------------------------------------------------------
// Centralized Floating UI positioning
// ---------------------------------------------------------------------------

/**
 * Shared platform override that forces Floating UI to resolve offsets relative
 * to the viewport. Without this, popups inside `container-type: size` ancestors
 * compute incorrect positions because the container becomes the offset parent.
 */
const fixedPlatform = {
  ...platform,
  getOffsetParent: (): typeof window => window,
};

export type ComputeFixedPositionOptions = {
  placement?: Placement;
  offsetPx?: number;
  matchWidth?: boolean;
  padding?: number;
};

/**
 * Compute a fixed-strategy position using Floating UI with the viewport
 * override baked in.
 */
export const computeFixedPosition = (
  anchor: HTMLElement,
  floating: HTMLElement,
  options: ComputeFixedPositionOptions = {},
): Promise<{ x: number; y: number; placement: Placement }> => {
  const {
    placement = "bottom-start",
    offsetPx = 4,
    matchWidth = false,
    padding = 8,
  } = options;

  const middleware: Middleware[] = [
    offset(offsetPx),
    flip(),
    shift({ padding }),
  ];

  if (matchWidth) {
    middleware.push(
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    );
  }

  return computePosition(anchor, floating, {
    placement,
    strategy: "fixed",
    middleware,
    platform: fixedPlatform,
  });
};

/**
 * Start Floating UI `autoUpdate` + `computeFixedPosition` in one call.
 * Returns a cleanup function to stop tracking.
 */
export const startFixedAutoUpdate = (
  anchor: HTMLElement,
  floating: HTMLElement,
  options: ComputeFixedPositionOptions & {
    onPosition?: (result: {
      x: number;
      y: number;
      placement: Placement;
    }) => void;
  } = {},
): (() => void) => {
  const { onPosition, ...positionOptions } = options;

  return autoUpdate(anchor, floating, () => {
    computeFixedPosition(anchor, floating, positionOptions).then((result) => {
      Object.assign(floating.style, {
        left: `${result.x}px`,
        top: `${result.y}px`,
      });
      onPosition?.(result);
    });
  });
};
