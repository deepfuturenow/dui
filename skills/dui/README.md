# DUI Skill

An [Agent Skill](https://code.claude.com/docs/en/skills) that gives AI coding assistants deep knowledge of DUI's component library, theming system, and inspector API. When installed, the agent knows how to find, compose, style, and debug DUI components using correct patterns.

## What it does

- **Component selection** — knows all 43 DUI component families and when to use each one
- **Styling guidance** — enforces CSS custom properties and `::part(root)` over shadow DOM hacks
- **Theming** — understands the `applyTheme()` composition model, semantic tokens, and dark mode
- **Inspector workflow** — when `@dui/inspector` is available, uses the runtime API to discover components, prototype changes, and export structured source diffs
- **Project detection** — auto-detects DUI in the project and handles setup if missing

## Install

The skill lives in the DUI monorepo at `skills/dui/`. All major agent tools use the same `SKILL.md` format — you just copy or symlink the skill into the agent's discovery directory.

### Quick reference

| Agent | Project-scoped | Global (all projects) |
| --- | --- | --- |
| **Claude Code** | `.claude/skills/dui/` | `~/.claude/skills/dui/` |
| **Codex CLI** | `.agents/skills/dui/` | `~/.codex/skills/dui/` |
| **Gemini CLI** | `.gemini/skills/dui/` or `.agents/skills/dui/` | `~/.gemini/skills/dui/` |
| **Pi** | `.agents/skills/dui/` | `~/.pi/agent/skills/dui/` |

### Copy (simplest)

Copy the skill directory into your agent's discovery path:

```bash
# Claude Code — project-scoped
mkdir -p .claude/skills && cp -r /path/to/dui/skills/dui .claude/skills/dui

# Codex CLI — project-scoped
mkdir -p .agents/skills && cp -r /path/to/dui/skills/dui .agents/skills/dui

# Gemini CLI — project-scoped
mkdir -p .gemini/skills && cp -r /path/to/dui/skills/dui .gemini/skills/dui

# Pi — project-scoped
mkdir -p .agents/skills && cp -r /path/to/dui/skills/dui .agents/skills/dui
```

This is a snapshot — re-copy when you update DUI.

### Symlink (stays in sync)

Symlink so it always reflects the current DUI source:

```bash
# Example for Claude Code — substitute the path for your agent
mkdir -p .claude/skills
ln -s /path/to/dui/skills/dui .claude/skills/dui
```

Don't commit symlinks that use absolute paths specific to your machine.

### Global install (all projects)

If you work with DUI across many projects:

```bash
# Claude Code
cp -r /path/to/dui/skills/dui ~/.claude/skills/dui

# Codex CLI
cp -r /path/to/dui/skills/dui ~/.codex/skills/dui

# Gemini CLI
cp -r /path/to/dui/skills/dui ~/.gemini/skills/dui

# Pi
cp -r /path/to/dui/skills/dui ~/.pi/agent/skills/dui
```

### Shared directory (multi-agent)

If you use multiple agents, you can keep one copy and symlink from each agent's directory:

```bash
# Keep the canonical copy somewhere central
cp -r /path/to/dui/skills/dui ~/skills/dui

# Symlink from each agent
ln -s ~/skills/dui ~/.claude/skills/dui
ln -s ~/skills/dui ~/.codex/skills/dui
ln -s ~/skills/dui ~/.gemini/skills/dui
ln -s ~/skills/dui ~/.pi/agent/skills/dui
```

### Claude Code --add-dir

Claude Code's `--add-dir` flag picks up `.claude/skills/` from added directories:

```bash
claude --add-dir /path/to/dui
```

For this to work, the DUI repo would need a `.claude/skills/dui` symlink pointing to `../../skills/dui`. (We may add this in the future.)

### Gemini CLI link command

Gemini CLI has a built-in `link` command for adding skill directories:

```bash
gemini skills link /path/to/dui/skills/dui
# Or scope to the current workspace only
gemini skills link /path/to/dui/skills/dui --scope workspace
```

### Pi packages

Pi supports installing skills as packages from git:

```bash
pi install git:github.com/deepfuturenow/dui --path skills/dui
```

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
