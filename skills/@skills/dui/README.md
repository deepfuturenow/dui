# DUI Skill

An [Agent Skill](https://code.claude.com/docs/en/skills) that gives AI coding assistants deep knowledge of DUI's component library, design token system, and inspector API. When installed, the agent knows how to find, compose, style, and debug DUI components using correct patterns.

## What it does

- **Component selection** — knows all 57 DUI component families and when to use each one
- **Styling guidance** — enforces CSS custom properties and `::part(root)` over shadow DOM hacks
- **Theming** — understands the 4-primitive OKLCH color system, design tokens, and dark mode via `data-theme`
- **Inspector workflow** — when `@dui/inspector` is available, uses the runtime API to discover components, prototype changes, and export structured source diffs
- **Project detection** — auto-detects DUI in the project and handles setup if missing

## Install

### From GitHub (recommended)

The `npx skills add` CLI installs skills directly from GitHub into the right directory for your agent. No need to clone the DUI repo:

```bash
# Auto-detects your installed agents and prompts you
npx skills add deepfuturenow/dui --skill dui --path @skills

# Target a specific agent
npx skills add deepfuturenow/dui --skill dui --path @skills -a claude-code
npx skills add deepfuturenow/dui --skill dui --path @skills -a codex
npx skills add deepfuturenow/dui --skill dui --path @skills -a gemini-cli

# Install globally (all projects)
npx skills add deepfuturenow/dui --skill dui --path @skills -g

# Install to all agents, no prompts
npx skills add deepfuturenow/dui --skill dui --path @skills --all -y
```

This is the best approach for projects that consume DUI via npm packages (e.g. `@deepfuture/dui-components`). You get the skill without needing the full DUI source tree.

To update later: `npx skills update`

### From source (DUI repo cloned locally)

If you're working in or alongside the DUI monorepo, symlink or copy the skill directory into your agent's discovery path:

```bash
# Symlink (stays in sync with DUI source)
mkdir -p .claude/skills && ln -s /path/to/dui/@skills/dui .claude/skills/dui

# Copy (snapshot)
mkdir -p .claude/skills && cp -r /path/to/dui/@skills/dui .claude/skills/dui
```

Substitute `.claude/skills` with your agent's directory (see reference table below). For global install, use `~/.claude/skills/dui` etc.

### Skill directory reference

| Agent | Project-scoped | Global |
| --- | --- | --- |
| **Claude Code** | `.claude/skills/dui/` | `~/.claude/skills/dui/` |
| **Codex CLI** | `.agents/skills/dui/` | `~/.codex/skills/dui/` |
| **Gemini CLI** | `.gemini/skills/dui/` or `.agents/skills/dui/` | `~/.gemini/skills/dui/` |
| **Pi** | `.agents/skills/dui/` | `~/.pi/agent/skills/dui/` |

### Verify

After installing, start a session and ask:

```
What DUI components are available for building a form?
```

If the skill is loaded, the agent will reference specific DUI components (`dui-input`, `dui-select`, `dui-switch`, `dui-field`, etc.) with correct property names and styling patterns. Without the skill, it'll likely suggest generic HTML or a different library.

## Structure

```
@skills/dui/
├── SKILL.md                    # Main skill — principles, rules, patterns
├── README.md                   # This file
├── evals/
│   └── evals.json              # Test prompts + expectations for skill evaluation
└── references/
    ├── components.md           # Full catalog: 57 families, properties, theme attributes, slots, parts, tokens
    ├── rules.md                # Incorrect/correct code pairs for every critical rule
    └── inspector.md            # Complete inspector API reference
```

`SKILL.md` is always loaded when the skill triggers. The reference files are loaded on demand — the agent reads `components.md` when it needs to look up a component, and `inspector.md` when working with the inspector API.

## Key differences from previous versions

If you're familiar with an older version of this skill, note these architectural changes:

- **No `applyTheme()`** — components self-register on import. No setup function needed.
- **Styled, not unstyled** — components ship with aesthetic CSS. Two-layer inheritance: primitives (behavior) → components (styled).
- **Dark mode** — `data-theme="dark"` on `<html>`, not `class="dark"` on `<body>`.
- **Color tokens** — 4 OKLCH primitives (`--background`, `--foreground`, `--accent`, `--destructive`) with derived tokens. Not `--color-primary`, `--color-bg`, etc.
- **Theme attributes** — `variant`, `appearance`, `size` are HTML attributes selected by CSS (`:host([variant="primary"])`), not always Lit properties.
- **New components** — `dui-card`, `dui-card-grid`, `dui-field`, `dui-fieldset`, `dui-split-button`, `dui-stepper`, `dui-map-*`, `dui-chart`.
- **Templates** — `@dui/templates` provides pre-composed UI patterns.
- **npm package** — single `@deepfuture/dui-components` package with subpath exports, not per-component packages.

## Evals

The `evals/` directory contains test prompts for verifying the skill works correctly. Each eval is a realistic user request with specific expectations about what the agent's output should include.

### What the evals test

| Eval | Tests |
| --- | --- |
| **Settings form** | Component selection (dui-input, dui-toggle-group, dui-button, dui-field), CSS flexbox/grid layout, self-registration imports |
| **Delete confirmation dialog** | Compound component hierarchy (dui-alert-dialog family), icon usage, danger styling via tokens, `::part()` usage |
| **Dashboard layout** | Sidebar composition, breadcrumbs, data table, badge, dark mode pattern |
| **Inspector workflow** | `__dui_inspect()` discovery, `__dui_mutate.*` mutations, post-mutation verification, `__dui_export()` |
| **Notifications panel** | Overlay selection (popover vs dialog), "use component not custom markup" (badge, spinner, separator) |
| **Metric cards** | Card and card-grid components, slot-based composition, design tokens |

### Running evals manually

1. Install the DUI skill into a test project (see Install above)
2. Start a coding agent session in that project
3. Paste each eval's `prompt` as a message
4. Check the output against the `expectations` list

The expectations are natural-language assertions, not regex patterns. You're checking whether the agent made the right architectural choices.

## Keeping the skill in sync with DUI

The skill lives in the DUI monorepo so it can evolve alongside the components:

- **Component catalog**: `references/components.md` is generated from `packages/docs/src/component-registry.ts`. When component APIs change, regenerate it.
- **Rules**: `references/rules.md` should reflect current token names and patterns.
- **Inspector reference**: `references/inspector.md` mirrors the inspector docs. Update when the inspector API changes.
- **Evals**: When adding new critical rules or components, add an eval that exercises them.

PRs that change component APIs or styling patterns should include skill updates in the same commit.
