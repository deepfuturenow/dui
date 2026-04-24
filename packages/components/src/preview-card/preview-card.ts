import { css } from "lit";
import { DuiPreviewCardPrimitive } from "@dui/primitives/preview-card";
import "../_install.ts";

const styles = css``;

export class DuiPreviewCard extends DuiPreviewCardPrimitive {
  static override styles = [...DuiPreviewCardPrimitive.styles, styles];
}

customElements.define(DuiPreviewCard.tagName, DuiPreviewCard);
