#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run
/**
 * Generate a DESIGN.md from DUI's token configuration.
 *
 * Usage:
 *   deno task design-md
 *   deno task design-md --accent "oklch(0.6 0.2 280)" --font-sans "Inter"
 *   deno task design-md --visual-only --out ./DESIGN.md
 *   deno task design-md --grammar ./my-grammar.md
 *   deno task design-md --no-lint
 *
 * Flags:
 *   --accent <oklch>       Override accent color
 *   --background <oklch>   Override background color
 *   --foreground <oklch>   Override foreground color
 *   --destructive <oklch>  Override destructive color
 *   --font-sans <name>     Override sans-serif font
 *   --font-serif <name>    Override serif font
 *   --font-mono <name>     Override mono font
 *   --radius <rem>         Override base radius (e.g. "0.75rem")
 *   --grammar <path>       Merge custom grammar sections from markdown file
 *   --visual-only          Skip interaction grammar sections
 *   --out <path>           Output path (default: ./DESIGN.md)
 *   --no-lint              Skip lint validation
 */

import {
  parseOklch,
  formatOklch,
  oklchToHex,
  computeDerivedHex,
  type Oklch,
} from "./lib/oklch-to-hex.ts";

import {
  generateDesignMd,
  type DesignMdConfig,
} from "./lib/design-md-template.ts";

/* ═══════════════════════════════════════════════════════════════════
 * Default DUI primitives (light theme)
 * ═══════════════════════════════════════════════════════════════════ */

const DEFAULTS = {
  background:  "oklch(0.97 0 0)",
  foreground:  "oklch(0.15 0 0)",
  accent:      "oklch(0.55 0.25 260)",
  destructive: "oklch(0.55 0.22 25)",
  fontSans:  "Geist",
  fontSerif: "Lora",
  fontMono:  "Geist Mono",
  radius:    "0.5rem",
};

/* ═══════════════════════════════════════════════════════════════════
 * CLI argument parsing
 * ═══════════════════════════════════════════════════════════════════ */

function parseArgs(args: string[]) {
  const result = {
    background:  DEFAULTS.background,
    foreground:  DEFAULTS.foreground,
    accent:      DEFAULTS.accent,
    destructive: DEFAULTS.destructive,
    fontSans:    DEFAULTS.fontSans,
    fontSerif:   DEFAULTS.fontSerif,
    fontMono:    DEFAULTS.fontMono,
    radius:      DEFAULTS.radius,
    grammarPath: null as string | null,
    visualOnly:  false,
    outPath:     "./DESIGN.md",
    noLint:      false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = () => {
      if (i + 1 >= args.length) throw new Error(`Missing value for ${arg}`);
      return args[++i];
    };
    switch (arg) {
      case "--accent":      result.accent = next(); break;
      case "--background":  result.background = next(); break;
      case "--foreground":  result.foreground = next(); break;
      case "--destructive": result.destructive = next(); break;
      case "--font-sans":   result.fontSans = next(); break;
      case "--font-serif":  result.fontSerif = next(); break;
      case "--font-mono":   result.fontMono = next(); break;
      case "--radius":      result.radius = next(); break;
      case "--grammar":     result.grammarPath = next(); break;
      case "--visual-only": result.visualOnly = true; break;
      case "--out":         result.outPath = next(); break;
      case "--no-lint":     result.noLint = true; break;
      default:
        console.warn(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════════════
 * Derived color computation
 * ═══════════════════════════════════════════════════════════════════ */

function computeAllColors(bg: Oklch, fg: Oklch, accent: Oklch, destructive: Oklch) {
  return {
    background:        oklchToHex(bg),
    foreground:        oklchToHex(fg),
    accent:            oklchToHex(accent),
    destructive:       oklchToHex(destructive),
    "surface-1":       computeDerivedHex(bg, { lightnessOffset: +0.02 }),
    "surface-2":       computeDerivedHex(bg, { lightnessOffset: +0.05 }),
    "surface-3":       computeDerivedHex(bg, { lightnessOffset: +0.09 }),
    "text-1":          computeDerivedHex(fg, { alpha: 0.90 }, bg),
    "text-2":          computeDerivedHex(fg, { alpha: 0.63 }, bg),
    "text-3":          computeDerivedHex(fg, { alpha: 0.45 }, bg),
    "border":          computeDerivedHex(fg, { alpha: 0.15 }, bg),
    "accent-subtle":   computeDerivedHex(accent, { alpha: 0.10 }, bg),
    "destructive-subtle": computeDerivedHex(destructive, { alpha: 0.10 }, bg),
  };
}

/* ═══════════════════════════════════════════════════════════════════
 * Grammar file parsing
 * ═══════════════════════════════════════════════════════════════════ */

async function parseGrammarFile(path: string): Promise<Record<string, string>> {
  const text = await Deno.readTextFile(path);
  const sections: Record<string, string> = {};
  let currentHeading = "";
  let currentBody: string[] = [];

  for (const line of text.split("\n")) {
    const headingMatch = line.match(/^#\s+(.+)$/);
    if (headingMatch) {
      if (currentHeading) {
        sections[currentHeading] = currentBody.join("\n").trim();
      }
      currentHeading = headingMatch[1].trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  if (currentHeading) {
    sections[currentHeading] = currentBody.join("\n").trim();
  }

  return sections;
}

/* ═══════════════════════════════════════════════════════════════════
 * Lint integration
 * ═══════════════════════════════════════════════════════════════════ */

async function runLint(_filePath: string): Promise<boolean> {
  // Lint integration removed — @nicholasgasior/design-md package does not exist.
  // Pass --no-lint or omit; this is now a no-op.
  return true;
}

/* ═══════════════════════════════════════════════════════════════════
 * Main
 * ═══════════════════════════════════════════════════════════════════ */

async function main() {
  const opts = parseArgs(Deno.args);

  // Parse color primitives
  const bg          = parseOklch(opts.background);
  const fg          = parseOklch(opts.foreground);
  const accent      = parseOklch(opts.accent);
  const destructive = parseOklch(opts.destructive);

  // Compute all hex colors
  const colors = computeAllColors(bg, fg, accent, destructive);

  // Parse grammar overrides if provided
  let grammarOverrides: Record<string, string> | undefined;
  if (opts.grammarPath) {
    grammarOverrides = await parseGrammarFile(opts.grammarPath);
    console.log(`📖 Loaded ${Object.keys(grammarOverrides).length} grammar sections from ${opts.grammarPath}`);
  }

  // Build config
  const config: DesignMdConfig = {
    colors,
    oklchOriginals: {
      background:  formatOklch(bg),
      foreground:  formatOklch(fg),
      accent:      formatOklch(accent),
      destructive: formatOklch(destructive),
    },
    fonts: {
      sans: opts.fontSans,
      serif: opts.fontSerif,
      mono: opts.fontMono,
    },
    radiusBase: opts.radius,
    includeGrammar: !opts.visualOnly,
    grammarOverrides,
  };

  // Generate
  const output = generateDesignMd(config);

  // Write
  await Deno.writeTextFile(opts.outPath, output);
  console.log(`✅ Generated ${opts.outPath} (${output.length} bytes)`);
  console.log(`   Colors: ${formatOklch(bg)} / ${formatOklch(fg)} / ${formatOklch(accent)} / ${formatOklch(destructive)}`);
  console.log(`   Fonts:  ${opts.fontSans} / ${opts.fontMono}`);
  console.log(`   Radius: ${opts.radius}`);
  console.log(`   Sections: ${opts.visualOnly ? "visual only (8)" : "visual + grammar (22)"}`);

  // Lint
  if (!opts.noLint) {
    await runLint(opts.outPath);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  Deno.exit(1);
});
