---
name: translate-design-md
description: Translate an external DESIGN.md (any format) into a DUI-centric DESIGN.md. Handles both spec-compliant files (YAML front matter) deterministically and non-compliant files (prose-only, custom token names) via LLM interpretation. Use when the user says "translate design.md", "convert design.md to DUI", "import this design system", or provides a DESIGN.md and wants DUI tokens.
---

# Translate DESIGN.md → DUI

Convert any DESIGN.md file into a DUI-centric DESIGN.md that works with `import-design-md.ts` and matches the format `generate-design-md.ts` produces.

## Overview

This skill handles two tracks:

- **Track A (deterministic):** Spec-compliant DESIGN.md files with YAML front matter — the script handles everything automatically.
- **Track B (LLM-interpreted):** Non-compliant files (prose-only, custom token naming) — you interpret the source and extract the values.

Both tracks produce the same output: a DUI DESIGN.md with 4 OKLCH primitives, derived tokens, and prose sections.

## Step 1: Get the source file

Ask the user for the input DESIGN.md. It can be:
- A local file path
- A URL (GitHub raw URL, etc.)
- Pasted content

If pasted, save it to a temp file first:
```bash
# Save pasted content to a temp file
write /tmp/source-DESIGN.md <pasted content>
```

## Step 2: Detect spec compliance

Run the script with `--in` to let it detect the format:

```bash
deno task translate-design-md --in <path-or-url> --out <output-path> --no-lint
```

**If the script succeeds (Track A):** It handled everything. Skip to Step 5.

**If the script exits with a non-compliant message (Track B):** Continue to Step 3.

## Step 3: Interpret the source (Track B only)

Read the full source DESIGN.md. You need to extract exactly 4 things:

### 3a. The 4 DUI color primitives

Find the best hex color for each:

| DUI primitive | What to look for |
|---|---|
| `--background` | Page canvas, base surface, primary background. Look for: white (#fff), near-white, or dark backgrounds (#000, deep blues/grays). |
| `--foreground` | Primary text / ink color. Look for: "ink", "text", "body", "on-surface", "on-background". Usually near-black on light themes, near-white on dark themes. |
| `--accent` | **The single brand/interactive color.** This is the color used for primary CTAs, links, brand moments. Look for: "primary", "accent", "brand", the color described as carrying CTAs or interactive elements. Must have meaningful chroma — skip achromatic, near-white, or near-black values. |
| `--destructive` | Error / danger color. Look for: "error", "danger", "destructive", "warning red". If not found, omit (DUI default will be used). |

**Key judgment call — accent selection:**
The accent is the hardest to identify in prose-only files. Look for:
- The color described as "brand color" or "accent"
- The color used for primary CTA buttons
- The color the source describes using scarcely/intentionally (e.g., Airbnb's Rausch, Ferrari's Rosso Corsa)
- If multiple candidates exist, prefer the one with the most chroma (saturation) and the most prominent interactive role

### 3b. Font families

- **Sans:** The primary UI font. Most common font in the source.
- **Mono:** Any monospace font mentioned. Default: "Geist Mono".
- **Serif:** Any serif font mentioned. Default: "Lora".

If the source uses a proprietary font (e.g., "Airbnb Cereal VF", "FerrariSans"), use it as-is. Add a note about the closest open-source substitute.

### 3c. Radius

Find the base/default border-radius. Look for:
- Explicit "md" or "default" radius value
- The most common radius on buttons and cards
- Convert px to rem (÷16) if needed

### 3d. Design name

Extract or infer a short name for the design system.

## Step 4: Run the script with manual values (Track B only)

```bash
deno task translate-design-md \
  --background "<hex>" \
  --foreground "<hex>" \
  --accent "<hex>" \
  --destructive "<hex>" \
  --font-sans "<family>" \
  --radius "<rem>" \
  --name "<name>" \
  --out <output-path> \
  --no-lint
```

## Step 5: Prose merging (optional, both tracks)

After the script generates the DUI DESIGN.md with template prose, offer to merge the source's design personality into the prose sections.

If the user wants prose merging:

1. Read the generated DUI DESIGN.md
2. Read the source DESIGN.md's prose sections
3. For each of the 8 visual sections (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts):
   - **Keep** all DUI technical content (token names, `::part()` API, `text-box: trim-both` explanation, derived token formulas, component import syntax, etc.)
   - **Add** the source's design personality, rationale, and specific visual guidance
   - **Adapt** the Overview to describe the translated design's aesthetic character
   - **Preserve** DUI's table structures and token references
4. The 14 interaction grammar sections (Page Archetypes through Iconography) stay as DUI defaults — do not modify these.
5. Write the merged content back to the output file.

### Prose merging guidelines

**Overview section:** Start with DUI's "This design system is built on DUI..." paragraph, then add a paragraph describing the source's aesthetic personality. Example for atmospheric-glass:

> This design system is built on DUI, a Lit-based web component library...
>
> The visual identity draws from an atmospheric glass aesthetic — frosted crystalline surfaces over vibrant gradients, where depth comes from backdrop blur and transparency rather than traditional shadows...

**Colors section:** Keep the OKLCH primitives table and derived token explanation. Add a paragraph about the source's color philosophy. Example:

> The color strategy prioritizes luminosity and contrast. Component backgrounds use varying alpha channels rather than solid fills...

**Do's and Don'ts:** Keep DUI's standard list. Append source-specific guidance that doesn't contradict DUI conventions.

## Step 6: Generate applyTheme() snippet

After the DUI DESIGN.md is generated, produce a ready-to-use `applyTheme()` call that the consumer can paste into their bootstrap file:

1. Read the 4 OKLCH primitives from the generated DESIGN.md's YAML front matter
2. Build the snippet:

```typescript
import { applyTheme } from "@deepfuture/dui-components/theme";

applyTheme({
  light: {
    background:  "<bg oklch>",
    foreground:  "<fg oklch>",
    accent:      "<accent oklch>",
    destructive: "<destructive oklch>",
  },
});
```

3. Print the snippet and explain: _"Add this to your app's bootstrap file (e.g. `main.ts` or `bootstrap.ts`) after importing DUI components. Dark mode will be auto-derived from the light values. If you need explicit dark mode control, add a `dark: { ... }` block."_

The snippet uses the npm package path (`@deepfuture/dui-components/theme`). For Deno projects using import maps, use `@dui/components/theme` instead.

## Step 7: Print summary

After completion, the script already prints a formatted summary. Add a brief note about what was done:

For Track A:
```
✅ Translated "<name>" → DUI DESIGN.md (Track A, deterministic)
   Output: <path>
```

For Track B:
```
✅ Translated "<name>" → DUI DESIGN.md (Track B, LLM-interpreted)
   Output: <path>
   Accent chosen: <color-name> (<hex>) — <reason>
```

## Examples

### Spec-compliant (Track A — fully automatic)
```
User: Translate this design.md to DUI:
      https://raw.githubusercontent.com/google-labs-code/design.md/main/examples/atmospheric-glass/DESIGN.md

→ deno task translate-design-md --in <url> --out ./DESIGN.md --no-lint
→ Script handles everything
→ Offer prose merge
```

### Non-compliant (Track B — LLM interprets)
```
User: Translate this Airbnb DESIGN.md to DUI
      <pasted content>

→ Save to /tmp/source-DESIGN.md
→ deno task translate-design-md --in /tmp/source-DESIGN.md  (fails: non-compliant)
→ Read the source, extract:
    background: #ffffff (canvas)
    foreground: #222222 (ink)
    accent: #ff385c (Rausch — "The single brand color. Used for primary CTA backgrounds")
    destructive: #c13515 (error text color)
    font-sans: "Airbnb Cereal VF"
    radius: 0.5rem (8px on buttons)
→ deno task translate-design-md --background "#ffffff" ... --out ./DESIGN.md --no-lint
→ Offer prose merge
```

## File locations

- Script: `scripts/translate-design-md.ts`
- Mapping library: `scripts/lib/stitch-to-dui.ts`
- Color utilities: `scripts/lib/oklch-to-hex.ts`
- DUI template: `scripts/lib/design-md-template.ts`
- Deno task: `deno task translate-design-md`
