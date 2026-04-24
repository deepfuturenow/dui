import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import type { AvatarItem } from "@dui/templates/media";
import "./docs-template-layout.ts";

const teamMembers: AvatarItem[] = [
  { name: "Alice Chen", src: "https://i.pravatar.cc/96?img=1" },
  { name: "Bob Martinez", src: "https://i.pravatar.cc/96?img=3" },
  { name: "Clara Johansson", src: "https://i.pravatar.cc/96?img=5" },
  { name: "David Kim", src: "https://i.pravatar.cc/96?img=8" },
  { name: "Evelyn Brooks", src: "https://i.pravatar.cc/96?img=9" },
  { name: "Fatima Al-Rashid", src: "https://i.pravatar.cc/96?img=10" },
  { name: "George Tanaka", src: "https://i.pravatar.cc/96?img=11" },
  { name: "Hannah Williams", src: "https://i.pravatar.cc/96?img=12" },
  { name: "Ivan Petrov", src: "https://i.pravatar.cc/96?img=14" },
  { name: "Julia Santos", src: "https://i.pravatar.cc/96?img=16" },
  { name: "Kai Andersen", src: "https://i.pravatar.cc/96?img=18" },
  { name: "Liam O'Brien", src: "https://i.pravatar.cc/96?img=20" },
];

const fieldAgents: AvatarItem[] = [
  { name: "Agent Alpha", label: "Alpha" },
  { name: "Agent Bravo", label: "Bravo" },
  { name: "Agent Charlie", label: "Charlie" },
  { name: "Agent Delta", label: "Delta" },
  { name: "Agent Echo", label: "Echo" },
];

const smallTeam: AvatarItem[] = [
  { name: "Sarah Lin", src: "https://i.pravatar.cc/96?img=25" },
  { name: "Marcus Cole", src: "https://i.pravatar.cc/96?img=33" },
  { name: "Yuki Tanaka", src: "https://i.pravatar.cc/96?img=32" },
];

@customElement("docs-page-avatar-row")
export class DocsPageAvatarRow extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-avatar-row">

        <dui-docs-demo label="Team Members">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-avatar-row .data=${teamMembers}></dui-avatar-row>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Initials Fallback (no images)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-avatar-row .data=${fieldAgents}></dui-avatar-row>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Small Team">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-avatar-row .data=${smallTeam}></dui-avatar-row>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Custom Size (--avatar-row-size: 4rem)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-avatar-row .data=${smallTeam} style="--avatar-row-size: 4rem;"></dui-avatar-row>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Empty State">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-avatar-row .data=${[]} empty-text="No team members assigned"></dui-avatar-row>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
