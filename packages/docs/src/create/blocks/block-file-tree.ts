import { css, html, LitElement, svg } from "lit";
import { customElement } from "lit/decorators.js";
import { blockBase, gridOverlay } from "./block-base.ts";
import "@dui/components/tree";

/* ── Lucide icons (rendered as inline SVG inside the label slot) ──────────── */

const folderIcon = svg`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    />
  </svg>
`;

const fileImageIcon = svg`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <circle cx="10" cy="13" r="2" />
    <path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" />
  </svg>
`;

const fileVideoIcon = svg`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m10 11 5 3-5 3v-6Z" />
  </svg>
`;

const fileTextIcon = svg`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
`;

const fileCodeIcon = svg`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M10 12.5 8 15l2 2.5" />
    <path d="m14 12.5 2 2.5-2 2.5" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
  </svg>
`;

const fileMusicIcon = svg`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M21 6V3a1 1 0 0 0-1.27-.96l-6 1.71A1 1 0 0 0 13 4.71V16.5" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M2 16h6" />
    <path d="M2 12h8" />
    <path d="M2 20h8" />
    <circle cx="11" cy="18.5" r="2.5" />
  </svg>
`;

const fileArchiveIcon = svg`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <circle cx="10" cy="20" r="2" />
    <path d="M10 7V6" />
    <path d="M10 12v-1" />
    <path d="M10 18v-2" />
  </svg>
`;

/* ── Block ───────────────────────────────────────────────────────────────── */

type IconKind =
  | "folder"
  | "image"
  | "video"
  | "text"
  | "code"
  | "music"
  | "archive";

interface FileNode {
  value: string;
  label: string;
  icon: IconKind;
  end?: string;
  children?: FileNode[];
}

const FILE_TREE: FileNode[] = [
  {
    value: "documents",
    label: "Documents",
    icon: "folder",
    end: "5 items",
    children: [
      {
        value: "projects",
        label: "Projects",
        icon: "folder",
        end: "2 items",
        children: [
          {
            value: "website",
            label: "Website",
            icon: "folder",
            children: [
              {
                value: "index.html",
                label: "index.html",
                icon: "code",
                end: "8 KB",
              },
              {
                value: "styles.css",
                label: "styles.css",
                icon: "code",
                end: "12 KB",
              },
              { value: "app.ts", label: "app.ts", icon: "code", end: "24 KB" },
            ],
          },
          {
            value: "mobile",
            label: "Mobile App",
            icon: "folder",
            children: [
              {
                value: "readme.md",
                label: "README.md",
                icon: "text",
                end: "2 KB",
              },
            ],
          },
        ],
      },
      { value: "resume", label: "Resume.pdf", icon: "text", end: "184 KB" },
      { value: "notes", label: "Meeting Notes.txt", icon: "text", end: "6 KB" },
      {
        value: "budget",
        label: "Budget 2025.xlsx",
        icon: "text",
        end: "42 KB",
      },
    ],
  },
  {
    value: "pictures",
    label: "Pictures",
    icon: "folder",
    end: "3 items",
    children: [
      {
        value: "vacation",
        label: "Vacation 2024",
        icon: "folder",
        end: "4 photos",
        children: [
          {
            value: "beach",
            label: "beach-sunrise.jpg",
            icon: "image",
            end: "3.2 MB",
          },
          {
            value: "sunset",
            label: "golden-hour.png",
            icon: "image",
            end: "5.7 MB",
          },
          {
            value: "group",
            label: "group-photo.jpg",
            icon: "image",
            end: "4.1 MB",
          },
          {
            value: "landscape",
            label: "mountain-view.heic",
            icon: "image",
            end: "8.3 MB",
          },
        ],
      },
      {
        value: "screenshots",
        label: "Screenshots",
        icon: "folder",
        children: [
          {
            value: "screen1",
            label: "Screen Shot 2025-04-12.png",
            icon: "image",
            end: "428 KB",
          },
        ],
      },
      { value: "avatar", label: "avatar.png", icon: "image", end: "96 KB" },
    ],
  },
  {
    value: "movies",
    label: "Movies",
    icon: "folder",
    end: "2 items",
    children: [
      {
        value: "travel",
        label: "Travel Diary.mp4",
        icon: "video",
        end: "1.2 GB",
      },
      {
        value: "birthday",
        label: "Birthday Party.mov",
        icon: "video",
        end: "846 MB",
      },
    ],
  },
  {
    value: "music",
    label: "Music",
    icon: "folder",
    children: [
      {
        value: "playlist",
        label: "Summer Playlist.mp3",
        icon: "music",
        end: "8.4 MB",
      },
      {
        value: "podcast",
        label: "Podcast Ep. 42.m4a",
        icon: "music",
        end: "62 MB",
      },
    ],
  },
  {
    value: "downloads",
    label: "Downloads",
    icon: "folder",
    end: "3 items",
    children: [
      {
        value: "installer",
        label: "installer.dmg",
        icon: "archive",
        end: "412 MB",
      },
      {
        value: "archive",
        label: "project-backup.zip",
        icon: "archive",
        end: "184 MB",
      },
      {
        value: "presentation",
        label: "Q4 Review.pdf",
        icon: "text",
        end: "2.1 MB",
      },
    ],
  },
];

function iconFor(kind: IconKind) {
  switch (kind) {
    case "folder":
      return folderIcon;
    case "image":
      return fileImageIcon;
    case "video":
      return fileVideoIcon;
    case "text":
      return fileTextIcon;
    case "code":
      return fileCodeIcon;
    case "music":
      return fileMusicIcon;
    case "archive":
      return fileArchiveIcon;
  }
}

function renderNode(node: FileNode): unknown {
  return html`
    <dui-tree-item value="${node.value}">
      <span class="row" slot="label">
        <span class="icon icon-${node.icon}">${iconFor(node.icon)}</span>
        <span class="label-text">${node.label}</span>
      </span>
      ${node.end
        ? html`
          <span slot="end">${node.end}</span>
        `
        : null} ${node.children?.map(renderNode)}
    </dui-tree-item>
  `;
}

@customElement("block-file-tree")
export class BlockFileTree extends LitElement {
  static override styles = [
    gridOverlay,
    blockBase,
    css`
      :host {
        /* Strip the default block card chrome — the inner window provides it. */
        background: none;
        border: none;
        border-radius: 0;
      }

      /* ── Window chrome ───────────────────────────────────────────────── */

      .window {
        display: flex;
        flex-direction: column;
        aspect-ratio: 2 / 3;
        border: var(--border-width-thin) solid var(--border);
        border-radius: var(--radius-lg);
        background: var(--surface-1);
        overflow: hidden;
        box-shadow:
          0 1px 2px oklch(from var(--foreground) l c h / 0.04),
          0 8px 24px oklch(from var(--foreground) l c h / 0.06);
      }

      .titlebar {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-2_5) var(--space-3);
        background: var(--surface-2);
        border-bottom: var(--border-width-thin) solid var(--border);
      }

      .traffic-lights {
        display: flex;
        gap: var(--space-1_5);
      }

      .traffic-lights .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: inset 0 0 0 1px oklch(from var(--foreground) l c h / 0.08);
      }

      .traffic-lights .dot.red    { background: oklch(0.70 0.18 25); }
      .traffic-lights .dot.yellow { background: oklch(0.82 0.16 90); }
      .traffic-lights .dot.green  { background: oklch(0.74 0.18 145); }

      .title {
        flex: 1;
        text-align: center;
        font-size: var(--text-xs);
        font-weight: var(--font-weight-medium);
        color: var(--text-2);
        text-box: trim-both cap alphabetic;
        /* Visual centering offset for the traffic-light cluster on the left */
        margin-inline-end: calc(3 * 12px + 2 * var(--space-1_5));
      }

      /* ── Tree body ───────────────────────────────────────────────────── */

      /* Fill the remaining window height; the scroll-area handles overflow. */
      .body {
        flex: 1;
        min-height: 0;
      }

      /* Padding lives on the scroll-area's viewport so the scrollbar can
         sit flush against the window edge. */
      .body::part(viewport) {
        padding: var(--space-2);
      }

      /* ── Label row ───────────────────────────────────────────────────── */

      .row {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        min-width: 0;
      }

      .icon {
        display: inline-flex;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
      }

      .icon svg {
        width: 100%;
        height: 100%;
      }

      .label-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Type-specific icon colors */
      .icon-folder  { color: var(--accent);   }
      .icon-image   { color: var(--chart-5);  }
      .icon-video   { color: var(--chart-1);  }
      .icon-music   { color: var(--chart-2);  }
      .icon-code    { color: var(--chart-4);  }
      .icon-archive { color: var(--chart-1);  }
      .icon-text    { color: var(--text-2);   }
    `,
    ];

    override render() {
      return html`
        <div class="window">
          <div class="titlebar">
            <div class="traffic-lights" aria-hidden="true">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="title">Finder — Home</div>
          </div>

          <dui-scroll-area class="body">
            <dui-tree
              aria-label="File system"
              selection-mode="single"
              default-expanded-values='["documents","pictures","vacation","movies"]'
              default-selected-values='["sunset"]'
            >
              ${FILE_TREE.map(renderNode)}
            </dui-tree>
          </dui-scroll-area>
        </div>
      `;
    }
  }
