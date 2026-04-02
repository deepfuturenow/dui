import { css } from "lit";

export const scrollAreaStyles = css`
  .ScrollFade {
    box-shadow: var(--scroll-fade-offset-x, 0) var(--scroll-fade-offset-y, 0)
      var(--scroll-fade-blur-radius, var(--space-3))
      var(--scroll-fade-spread-radius, var(--space-2))
      var(--scroll-fade-color, var(--background));
    opacity: 0;
    transition: opacity 150ms ease;

    &[data-scrolled] {
      opacity: 1;
    }
  }

  .Scrollbar {
    border-radius: var(--radius-sm, 0.375rem);
    transition: opacity 150ms;
  }

  .Scrollbar[data-orientation="vertical"] {
    width: 0.25rem;
    margin: 0.1rem;
  }

  .Scrollbar[data-orientation="horizontal"] {
    height: 0.25rem;
    margin: 0.1rem;
  }

  .Thumb {
    border-radius: inherit;
    background: var(--scroll-area-thumb-color, var(--muted-foreground));
    opacity: 0.5;
    transition: opacity var(--duration-fast);

    &:hover {
      opacity: 0.7;
    }

    &:active {
      opacity: 0.8;
    }
  }
`;
