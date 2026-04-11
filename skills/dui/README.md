# DUI Skill

An [Agent Skill](https://code.claude.com/docs/en/skills) that gives AI coding assistants deep knowledge of DUI's component library, theming system, and inspector API. When installed, the agent knows how to find, compose, style, and debug DUI components using correct patterns.

## What it does

- **Component selection** — knows all 43 DUI component families and when to use each one
- **Styling guidance** — enforces CSS custom properties and `::part(root)` over shadow DOM hacks
- **Theming** — understands the `applyTheme()` composition model, semantic tokens, and dark mode
- **Inspector workflow** — when `@dui/inspector` is available, uses the runtime API to discover components, prototype changes, and export structured source diffs
- **Project detection** — auto-detects DUI in the project and handles setup if missing

## Install

### From GitHub (recommended)

The `npx skills add` CLI installs skills directly from GitHub into the right directory for your agent. No need to clone the DUI repo:

```bash
# Auto-detects your installed agents and prompts you
npx skills add deepfuturenow/dui --skill dui

# Target a specific agent
npx skills add deepfuturenow/dui --skill dui -a claude-code
npx skills add deepfuturenow/dui --skill dui -a codex
npx skills add deepfuturenow/dui --skill dui -a gemini-cli

# Install globally (all projects)
npx skills add deepfuturenow/dui --skill dui -g

# Install to all agents, no prompts
npx skills add deepfuturenow/dui --skill dui --all -y
```

This is the best approach for projects that consume DUI via npm packages (e.g. `@deepfuture/dui-core`). You get the skill without needing the full DUI source tree.

To update later: `npx skills update`

### From source (DUI repo cloned locally)

If you're working in or alongside the DUI monorepo, symlink or copy the skill directory into your agent's discovery path:

```bash
# Symlink (stays in sync with DUI source)
mkdir -p .claude/skills && ln -s /path/to/dui/skills/dui .claude/skills/dui

# Copy (snapshot)
mkdir -p .claude/skills && cp -r /path/to/dui/skills/dui .claude/skills/dui
```

Substitute `.claude/skills` with your agent's directory (see reference table below). For global install, use `~/.claude/skills/dui` etc.

### Agent-specific methods

**Claude Code --add-dir:**

```bash
claude --add-dir /path/to/dui
```

For this to work, the DUI repo would need a `.claude/skills/dui` symlink pointing to `../../skills/dui`. (We may add this in the future.)

**Gemini CLI link:**

```bash
gemini skills link /path/to/dui/skills/dui
gemini skills link /path/to/dui/skills/dui --scope workspace  # project only
```

**Pi packages:**

```bash
pi install git:github.com/deepfuturenow/dui --path skills/dui
```

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

If the skill is loaded, the agent will reference specific DUI components (`dui-input`, `dui-select`, `dui-switch`, etc.) with correct property names and styling patterns. Without the skill, it'll likely suggest generic HTML or a different library.

## Structure

```
skills/dui/
├── SKILL.md                    # Main skill — principles, rules, patterns (~170 lines)
├── README.md                   # This file
├── evals/
│   └── evals.json              # Test prompts + expectations for skill evaluation
└── references/
    ├── components.md           # Full catalog: 43 families, properties, slots, parts, tokens
    └── inspector.md            # Complete inspector API reference
```

`SKILL.md` is always loaded when the skill triggers. The reference files are loaded on demand — Claude reads `components.md` when it needs to look up a component, and `inspector.md` when working with the inspector API.

## Evals

The `evals/` directory contains test prompts for verifying the skill works correctly. Each eval is a realistic user request with specific expectations about what the agent's output should include.

### What the evals test

| Eval | Tests |
| --- | --- |
| **Settings form** | Component selection (dui-input, dui-toggle-group, dui-button), layout primitives (dui-vstack), CSS custom property styling, semantic tokens |
| **Delete confirmation dialog** | Compound component hierarchy (dui-alert-dialog family), icon usage (dui-icon with slots), danger styling via tokens, `::part(root)` usage |
| **Dashboard layout** | Sidebar composition, breadcrumbs, data table, badge, layout primitives, dark mode pattern |
| **Inspector workflow** | `__dui_inspect()` discovery, `__dui_mutate.*` mutations, post-mutation verification, `__dui_export()` for source changes |

### Running evals with the skill-creator

If you have the [skill-creator](https://github.com/anthropics/skills) skill installed in Claude Code, you can run evals directly:

```
# In Claude Code, from the DUI repo root
Run the evals for the DUI skill at skills/dui/
```

The skill-creator will:
1. Run each eval prompt through Claude with the DUI skill loaded
2. Grade the output against the expectations
3. Present results for your review

### Running evals manually

Without the skill-creator, you can test manually:

1. Install the DUI skill into a test project (see Install above)
2. Start a Claude Code session in that project
3. Paste each eval's `prompt` as a message
4. Check the output against the `expectations` list

The expectations are natural-language assertions, not regex patterns. You're checking whether the agent made the right architectural choices — used the right components, styled via the right mechanisms, maintained compound component hierarchies, etc.

### Adding evals

When you add new components, rules, or patterns to DUI, add a corresponding eval:

```json
{
  "id": 5,
  "prompt": "Your realistic user request here",
  "expected_output": "Brief description of what good output looks like",
  "files": [],
  "expectations": [
    "Specific checkable assertion about the output",
    "Another assertion",
    "..."
  ]
}
```

Good evals exercise multiple rules simultaneously (the way real requests do) rather than testing one rule in isolation.

## Keeping the skill in sync with DUI

The skill lives in the DUI monorepo so it can evolve alongside the components. Some guidelines:

- **Component catalog**: `references/components.md` is a static snapshot. When you add, remove, or change a component's API, update this file. (A future build script could generate it from source.)
- **SKILL.md setup instructions**: These point to the DUI README rather than duplicating install steps. If the install flow changes, only the README needs updating.
- **Inspector reference**: `references/inspector.md` mirrors the inspector docs. When the inspector API changes, update both.
- **Evals**: When adding a new critical rule or pattern, add an eval that exercises it. If an eval starts failing after a DUI change, that's a signal to update the skill.

PRs that change component APIs or styling patterns should include skill updates in the same commit.
