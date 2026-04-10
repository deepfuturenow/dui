import { css } from "lit";

export const scrollAreaStyles = css`
  .ScrollFade {
    box-shadow: var(--scroll-fade-offset-x, 0) var(--scroll-fade-offset-y, 0)
      var(--scroll-fade-blur-radius, var(--space-3))
      var(--scroll-fade-spread-radius, var(--space-2))
      var(--scroll-fade-color, var(--background));
    opacity: 0;
    transition: opacity var(--duration-fast) ease;

    &[data-scrolled] {
      opacity: 1;
    }
  }

  .Scrollbar {
    border-radius: var(--radius-sm);
    transition: opacity var(--duration-fast);
  }

  .Scrollbar[data-orientation="vertical"] {
    width: var(--space-1);
    margin: var(--space-px);
  }

  .Scrollbar[data-orientation="horizontal"] {
    height: var(--space-1);
    margin: var(--space-px);
  }

  .Thumb {
    border-radius: inherit;
    background: var(--scroll-area-thumb-color, var(--text-2));
    opacity: 0.4;
    transition: opacity var(--duration-fast);

    &:hover {
      opacity: 0.7;
    }

    &:active {
      opacity: 0.8;
    }
  }
`;
