import { html, LitElement, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { toast, type ToastType } from "@dui/components/toast";

let nextId = 1;

type StackedItem = {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
};

type SectionItem = {
  id: number;
  title: string;
  description?: string;
};

@customElement("docs-page-toast")
export class DocsPageToast extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  // ---- Rich-colors demo ----
  @state()
  accessor #appearance: "default" | "rich" = "default";

  // ---- Position demo ----
  @state()
  accessor #position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right" = "bottom-right";

  // ---- Theme override demo ----
  @state()
  accessor #regionTheme: "light" | "dark" | "inverted" | "" = "";
  @state()
  accessor #themedItems: StackedItem[] = [];

  // ---- Sectional inline region ----
  @state()
  accessor #sectionItems: SectionItem[] = [];
  @state()
  accessor #profileName = "Alex Carter";
  @state()
  accessor #profileEmail = "alex@example.com";

  // ---- Promise/loading recipe ----
  @state()
  accessor #profileSaving = false;
  @state()
  accessor #profileDraft = "Alex Carter";

  // ---- Form-validation recipe ----
  @state()
  accessor #formName = "";
  @state()
  accessor #formEmail = "";

  #spawn(type: ToastType, title: string, description: string): void {
    const opts = {
      description,
      // Apply rich appearance via the toast element's attribute. The
      // imperative facade doesn't carry an `appearance` option, so we
      // read it back off the auto-region's last child after creation.
    };
    if (type === "default") {
      toast(title, opts);
    } else if (type === "loading") {
      toast.loading(title, opts);
    } else {
      toast[type](title, opts);
    }
    if (this.#appearance === "rich") {
      const region = toast.getAutoRegion();
      const last = region?.lastElementChild as HTMLElement | null;
      last?.setAttribute("appearance", "rich");
    }
  }

  #spawnPositioned(type: ToastType, title: string, description: string): void {
    toast.configure({ position: this.#position });
    this.#spawn(type, title, description);
  }

  #spawnThemed(item: Omit<StackedItem, "id">): void {
    this.#themedItems = [...this.#themedItems, { id: nextId++, ...item }];
  }

  #removeThemed(id: number): void {
    this.#themedItems = this.#themedItems.filter((i) => i.id !== id);
  }

  #spawnSection(item: Omit<SectionItem, "id">): void {
    this.#sectionItems = [...this.#sectionItems, { id: nextId++, ...item }];
  }

  #removeSection(id: number): void {
    this.#sectionItems = this.#sectionItems.filter((i) => i.id !== id);
  }

  // ---- Promise / loading recipe ----

  #saveProfile(): void {
    if (this.#profileSaving) return;
    this.#profileSaving = true;
    const id = "save-profile";
    const value = this.#profileDraft;

    toast.loading("Saving profile…", {
      id,
      description: "Persisting changes to the server.",
    });

    new Promise<string>((resolve, reject) => {
      setTimeout(
        () =>
          Math.random() > 0.4
            ? resolve(value)
            : reject(new Error("Network timeout")),
        1400,
      );
    }).then(
      (saved) => {
        toast.success("Profile saved", {
          id,
          description: `Display name set to “${saved}”.`,
        });
        this.#profileSaving = false;
      },
      (err: Error) => {
        toast.error("Failed to save", {
          id,
          description: err.message,
          duration: 0,
          priority: "assertive",
          action: {
            label: "Retry",
            onClick: () => {
              this.#profileSaving = false;
              this.#saveProfile();
            },
          },
          closeButton: true,
        });
        this.#profileSaving = false;
      },
    );
  }

  // ---- Form validation ----

  #validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  #submitValidationForm(e: Event): void {
    e.preventDefault();
    const errors: { id: string; field: string; message: string }[] = [];
    if (!this.#formName.trim()) {
      errors.push({
        id: "err-name",
        field: "form-name",
        message: "Name is required",
      });
    } else {
      toast.dismiss("err-name");
    }
    if (!this.#formEmail.trim()) {
      errors.push({
        id: "err-email",
        field: "form-email",
        message: "Email is required",
      });
    } else if (!this.#validateEmail(this.#formEmail)) {
      errors.push({
        id: "err-email",
        field: "form-email",
        message: "Email format looks invalid",
      });
    } else {
      toast.dismiss("err-email");
    }

    if (errors.length === 0) {
      toast.success("Form submitted", {
        description: `Welcome, ${this.#formName}!`,
      });
      this.#formName = "";
      this.#formEmail = "";
      return;
    }

    for (const err of errors) {
      toast.error(err.message, {
        id: err.id,
        priority: "assertive",
        duration: 0,
        action: {
          label: "Fix",
          onClick: () => {
            const input = document.getElementById(err.field) as
              | HTMLInputElement
              | null;
            input?.focus();
          },
        },
      });
    }
  }

  #onFormFieldInput(field: "name" | "email", value: string): void {
    if (field === "name") {
      this.#formName = value;
      if (value.trim()) toast.dismiss("err-name");
    } else {
      this.#formEmail = value;
      if (value.trim() && this.#validateEmail(value)) {
        toast.dismiss("err-email");
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <style>
      /* Demo-local styles. */
      .row {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
        align-items: center;
      }

      .position-grid {
        display: grid;
        grid-template-columns: repeat(3, max-content);
        gap: var(--space-2);
      }

      /* Sectional region demo: scope a region inside a panel. */
      .section-panel {
        position: relative;
        border: var(--border-width-thin) solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-5) var(--space-5) var(--space-16);
        background: var(--surface-1);
        max-width: 32rem;
        overflow: hidden;
      }
      .section-panel h3 {
        margin: 0 0 var(--space-4);
        font-size: var(--text-sm);
        font-weight: var(--font-weight-semibold);
      }
      .section-panel .field {
        display: grid;
        grid-template-columns: 7rem 1fr auto;
        gap: var(--space-2);
        align-items: center;
        margin-bottom: var(--space-3);
      }
      .section-panel label {
        font-size: var(--text-sm);
        color: var(--text-2);
      }
      .section-panel input {
        padding: var(--space-1_5) var(--space-2_5);
        border: var(--border-width-thin) solid var(--border);
        border-radius: var(--radius-sm);
        font: inherit;
        font-size: var(--text-sm);
        background: var(--background);
        color: var(--text-1);
      }
      .section-panel dui-toast-region {
        position: absolute !important;
        inset: auto var(--space-3) var(--space-3) auto;
        --toast-region-width: 18rem;
        width: 18rem;
        z-index: 10;
      }

      .form-panel {
        border: var(--border-width-thin) solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-5);
        background: var(--surface-1);
        max-width: 28rem;
      }
      .form-panel .field {
        display: grid;
        grid-template-columns: 5rem 1fr;
        gap: var(--space-2);
        align-items: center;
        margin-bottom: var(--space-3);
      }
      .form-panel label { font-size: var(--text-sm); color: var(--text-2); }
      .form-panel input {
        padding: var(--space-1_5) var(--space-2_5);
        border: var(--border-width-thin) solid var(--border);
        border-radius: var(--radius-sm);
        font: inherit;
        font-size: var(--text-sm);
        background: var(--background);
        color: var(--text-1);
      }

      pre.code {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        background: var(--surface-2);
        color: var(--text-1);
        border: var(--border-width-thin) solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-3);
        overflow: auto;
        margin: 0 0 var(--space-3);
      }

      .note {
        font-size: var(--text-sm);
        color: var(--text-2);
        margin: 0 0 var(--space-3);
      }
      </style>

      <docs-page-layout
        tag="dui-toast"
        .additionalTags="${[
          "dui-toast-region",
          "dui-toast-action",
          "dui-toast-close",
        ]}"
      >
        <dui-docs-demo label="Types — success, info, warning, error, loading">
          <p class="note">
            Each type ships a built-in icon. Loading toasts don't auto-dismiss until
            updated to a different type (or explicitly dismissed).
          </p>
          <div class="row">
            <dui-button @click="${() =>
              this.#spawn(
                "success",
                "Profile updated",
                "Display name set to Alex Carter.",
              )}">
              .success()
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn(
                "info",
                "New release available",
                "v2.4.0 is ready to install.",
              )}">
              .info()
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn(
                "warning",
                "Heads up",
                "This action is irreversible.",
              )}">
              .warning()
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn(
                "error",
                "Connection failed",
                "Check your network and try again.",
              )}">
              .error()
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn("loading", "Uploading…", "Please wait.")}">
              .loading()
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn("default", "Quick note", "No type, no icon.")}">
              toast()
            </dui-button>
            <dui-button appearance="outline" @click="${() => toast.dismiss()}">
              Dismiss all
            </dui-button>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Position">
          <p class="note">
            Active position: <code>${this
              .#position}</code>. The imperative facade reuses
            the same auto-region when the position changes.
          </p>
          <div class="position-grid">
            ${([
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ] as const).map((p) =>
              html`
                <dui-button
                  appearance="${this.#position === p ? "filled" : "outline"}"
                  @click="${() => {
                    this.#position = p;
                    toast.configure({ position: p });
                  }}"
                >${p}</dui-button>
              `
            )}
          </div>
          <div class="row" style="margin-top: var(--space-3);">
            <dui-button @click="${() =>
              this.#spawnPositioned(
                "success",
                "Saved",
                "Toast spawned at " + this.#position,
              )}">
              Spawn at active position
            </dui-button>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label='Rich colors — appearance="rich"'>
          <p class="note">
            Toggle <code>appearance="rich"</code> to tint the surface and border by
            type color. Default appearance keeps the surface neutral and lets the icon
            do the semantic work.
          </p>
          <div class="row" style="margin-bottom: var(--space-3);">
            <dui-button
              appearance="${this.#appearance === "default"
                ? "filled"
                : "outline"}"
              @click="${() => {
                this.#appearance = "default";
              }}"
            >default</dui-button>
            <dui-button
              appearance="${this.#appearance === "rich" ? "filled" : "outline"}"
              @click="${() => {
                this.#appearance = "rich";
              }}"
            >rich</dui-button>
          </div>
          <div class="row">
            <dui-button @click="${() =>
              this.#spawn(
                "success",
                "Profile updated",
                "Display name saved.",
              )}">
              Success
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn("warning", "Heads up", "This is irreversible.")}">
              Warning
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn("error", "Failed", "Network timeout.")}">
              Error
            </dui-button>
            <dui-button @click="${() =>
              this.#spawn("info", "New release", "v2.4.0 ready.")}">
              Info
            </dui-button>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Stacked + expand on hover">
          <p class="note">
            Cascade stacking is on by default. Hover the stack to expand — older
            toasts beyond <code>max-visible</code> fade in. Spawn a few and try it.
          </p>
          <div class="row">
            <dui-button @click="${() => {
              for (let i = 0; i < 5; i++) {
                setTimeout(() =>
                  this.#spawn(
                    [
                      "success",
                      "info",
                      "warning",
                      "success",
                      "info",
                    ][i] as ToastType,
                    [
                      "Saved",
                      "Synced",
                      "Heads up",
                      "Backed up",
                      "New release",
                    ][i],
                    `Step ${i + 1} of 5 completed.`,
                  ), i * 80);
              }
            }}">
              Spawn 5 (hover the stack)
            </dui-button>
            <dui-button appearance="outline" @click="${() => toast.dismiss()}"
            >Dismiss all</dui-button>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With action button — Undo">
          <p class="note">
            Action button click runs the handler and dismisses the toast with reason
            <code>"action"</code>.
          </p>
          <div class="row">
            <dui-button @click="${() => {
              toast("Email archived", {
                description: "Removed from your inbox.",
                duration: 8000,
                action: {
                  label: "Undo",
                  onClick: () => toast.success("Restored"),
                },
              });
            }}">
              Spawn with Undo
            </dui-button>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With close button">
          <p class="note">
            On devices with a hover state, the close button is hidden until you hover
            (or focus into) the toast. On touch devices it stays visible (no hover,
            swipe-to-dismiss is the alternative).
          </p>
          <div class="row">
            <dui-button @click="${() => {
              toast("Long-running operation", {
                description: "Hover the toast to reveal the close button.",
                duration: 0,
                closeButton: true,
              });
            }}">
              Spawn with close button
            </dui-button>
            <dui-button appearance="outline" @click="${() =>
              toast.configure({ closeButton: true })}">
              Enable globally
            </dui-button>
            <dui-button appearance="outline" @click="${() =>
              toast.configure({ closeButton: false })}">
              Disable globally
            </dui-button>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label='Theme override — region with theme="..."'>
          <div
            style="width: 100%; display: flex; flex-direction: column; gap: var(--space-3);"
          >
            <p class="note" style="margin: 0;">
              Each region can force a palette via <code
              >theme="light|dark|inverted"</code>.
              <code>inverted</code> watches the page's <code>&lt;html
                data-theme&gt;</code>
              and flips when it changes.
            </p>
            <div class="row" style="margin-bottom: var(--space-3);">
              <dui-button
                appearance="${this.#regionTheme === "" ? "filled" : "outline"}"
                @click="${() => {
                  this.#regionTheme = "";
                }}"
              >inherit</dui-button>
              <dui-button
                appearance="${this.#regionTheme === "light"
                  ? "filled"
                  : "outline"}"
                @click="${() => {
                  this.#regionTheme = "light";
                }}"
              >light</dui-button>
              <dui-button
                appearance="${this.#regionTheme === "dark"
                  ? "filled"
                  : "outline"}"
                @click="${() => {
                  this.#regionTheme = "dark";
                }}"
              >dark</dui-button>
              <dui-button
                appearance="${this.#regionTheme === "inverted"
                  ? "filled"
                  : "outline"}"
                @click="${() => {
                  this.#regionTheme = "inverted";
                }}"
              >inverted</dui-button>
            </div>
            <div class="row" style="margin-bottom: var(--space-3);">
              <dui-button @click="${() =>
                this.#spawnThemed({
                  title: "Themed toast",
                  description: "Region forces this palette.",
                  type: "success",
                })}">Spawn</dui-button>
              <dui-button appearance="outline" @click="${() => {
                this.#themedItems = [];
              }}">Clear</dui-button>
            </div>
            <dui-toast-region
              position="bottom-right"
              label="Theme demo notifications"
              hotkey="none"
              theme="${this.#regionTheme || ""}"
              style="--demo-width: 100%; position: relative; width: 100%; max-width: 100%; height: 240px; border: var(--border-width-thin) dashed var(--border); border-radius: var(--radius-sm);"
              @toast-dismiss="${(e: CustomEvent<{ id: string }>) => {
                const num = Number(e.detail.id.replace(/\D/g, ""));
                this.#removeThemed(num);
              }}"
            >
              ${this.#themedItems.map((item) =>
                html`
                  <dui-toast
                    toast-id="theme-${item.id}"
                    type="${item.type}"
                    duration="0"
                  >
                    <span slot="title">${item.title}</span>
                    <span slot="description">${item.description}</span>
                  </dui-toast>
                `
              )}
            </dui-toast-region>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Recipe — promise / loading flow with retry">
          <p class="note">
            Reusing the same <code>id</code> transitions a loading toast in place:
            success → quick auto-dismiss, error → sticky with Retry. ~60% chance of
            success.
          </p>
          <pre
            class="code"
          >
            const id = "save-profile";
            toast.loading("Saving profile…", { id });

            saveAsync(name).then(
              (saved) =&gt; toast.success("Profile saved", { id, description: saved }),
              (err)   =&gt; toast.error("Failed to save", {
                id, duration: 0, priority: "assertive",
                description: err.message,
                action: { label: "Retry", onClick: retry },
                closeButton: true,
              }),
            );</pre>
          <div class="form-panel">
            <div class="field">
              <label for="promise-name">Name</label>
              <input
                id="promise-name"
                type="text"
                .value="${this.#profileDraft}"
                @input="${(e: Event) => {
                  this.#profileDraft = (e.target as HTMLInputElement).value;
                }}"
              />
            </div>
            <dui-button
              variant="primary"
              ?disabled="${this.#profileSaving}"
              @click="${() => this.#saveProfile()}"
            >
              ${this.#profileSaving ? "Saving…" : "Save profile"}
            </dui-button>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Recipe — form validation with id-keyed dedup">
          <p class="note">
            Each error gets a stable <code>id</code> tied to its field. The Fix action
            focuses the field; editing the field auto-dismisses its toast. Errors use
            <code>priority="assertive"</code> so screen readers interrupt.
          </p>
          <pre
            class="code"
          >
            toast.error("Email format looks invalid", {
              id: "err-email",
              priority: "assertive",
              duration: 0,
              action: {
                label: "Fix",
                onClick: () =&gt; document.getElementById("form-email")?.focus(),
              },
            });</pre>
          <form class="form-panel" @submit="${(e: Event) =>
            this.#submitValidationForm(e)}" novalidate>
            <div class="field">
              <label for="form-name">Name</label>
              <input
                id="form-name"
                type="text"
                .value="${this.#formName}"
                @input="${(e: Event) =>
                  this.#onFormFieldInput(
                    "name",
                    (e.target as HTMLInputElement).value,
                  )}"
              />
            </div>
            <div class="field">
              <label for="form-email">Email</label>
              <input
                id="form-email"
                type="email"
                .value="${this.#formEmail}"
                @input="${(e: Event) =>
                  this.#onFormFieldInput(
                    "email",
                    (e.target as HTMLInputElement).value,
                  )}"
              />
            </div>
            <dui-button variant="primary" type="submit">Submit</dui-button>
          </form>
        </dui-docs-demo>

        <dui-docs-demo label="Recipe — inline sectional region (declarative)">
          <p class="note">
            A region scoped <em>inside</em> a panel — useful when a notification
            should be tied to a section rather than the global viewport. Override the
            primitive's <code>position: fixed</code> with
            <code>position: absolute !important</code> and disable the global hotkey
            on sectional regions.
          </p>
          <pre
            class="code"
          >
            .section-panel dui-toast-region {
              position: absolute !important;
              inset: auto var(--space-3) var(--space-3) auto;
              --toast-region-width: 18rem;
            }

            &lt;dui-toast-region position="bottom-right" hotkey="none" label="Settings"&gt;
              &lt;dui-toast type="success" duration="3000"&gt;
                &lt;span slot="title"&gt;Saved&lt;/span&gt;
              &lt;/dui-toast&gt;
            &lt;/dui-toast-region&gt;</pre>
          <div class="section-panel">
            <h3>Account settings</h3>
            <div class="field">
              <label for="sec-name">Display name</label>
              <input
                id="sec-name"
                type="text"
                .value="${this.#profileName}"
                @input="${(e: Event) => {
                  this.#profileName = (e.target as HTMLInputElement).value;
                }}"
              />
              <dui-button size="sm" appearance="outline" @click="${() =>
                this.#spawnSection({
                  title: "Display name updated",
                  description: this.#profileName,
                })}">
                Save
              </dui-button>
            </div>
            <div class="field">
              <label for="sec-email">Email</label>
              <input
                id="sec-email"
                type="email"
                .value="${this.#profileEmail}"
                @input="${(e: Event) => {
                  this.#profileEmail = (e.target as HTMLInputElement).value;
                }}"
              />
              <dui-button size="sm" appearance="outline" @click="${() =>
                this.#spawnSection({
                  title: "Email updated",
                  description: this.#profileEmail,
                })}">
                Save
              </dui-button>
            </div>
            <dui-toast-region
              position="bottom-right"
              label="Settings notifications"
              max-visible="2"
              hotkey="none"
              @toast-dismiss="${(e: CustomEvent<{ id: string }>) => {
                const num = Number(e.detail.id.replace(/\D/g, ""));
                this.#removeSection(num);
              }}"
            >
              ${this.#sectionItems.map((item) =>
                html`
                  <dui-toast
                    toast-id="sec-${item.id}"
                    type="success"
                    duration="3000"
                  >
                    <span slot="title">${item.title}</span>
                    ${item.description
                      ? html`
                        <span slot="description">${item.description}</span>
                      `
                      : null}
                  </dui-toast>
                `
              )}
            </dui-toast-region>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Keyboard & a11y">
          <p class="note">
            Accessibility behavior the primitive provides — recapped here so it's
            discoverable from the styled docs.
          </p>
          <ul
            style="font-size: var(--text-sm); color: var(--text-2); margin: 0; padding-left: var(--space-5);"
          >
            <li>
              Each toast renders <code>role="status"</code> (or <code>"alert"</code>
              for <code>priority="assertive"</code>) with matching <code
              >aria-live</code>.
            </li>
            <li>
              Region renders <code>role="region"</code> with an <code
              >aria-label</code> (default "Notifications").
            </li>
            <li>
              Auto-dismiss timer pauses on pointer-inside, focus-inside, and document
              hidden.
            </li>
            <li>
              Region hotkey (default <code>Alt+T</code>) jumps focus to the front
              toast; <code>Esc</code> restores prior focus.
            </li>
            <li>
              Arrow keys navigate the stack visually; direction inverts for
              top-anchored regions.
            </li>
            <li>
              <code>Delete</code> / <code>Backspace</code> dismisses the focused
              toast.
            </li>
            <li>
              Swipe outward (mouse, touch, pen) dismisses; click suppression prevents
              accidental action triggers.
            </li>
          </ul>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
