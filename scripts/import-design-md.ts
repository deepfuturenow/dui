#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Import a DESIGN.md and generate DUI token overrides.
 *
 * Reads a DESIGN.md file (with YAML front matter) and produces a CSS
 * file that overrides DUI's custom properties to match the specified
 * design tokens.
 *
 * Usage:
 *   deno task import-design-md
 *   deno task import-design-md --in ./DESIGN.md --out ./theme-overrides.css
 *
 * Flags:
 *   --in <path>     Input DESIGN.md path (default: ./DESIGN.md)
 *   --out <path>    Output CSS path (default: ./dui-theme-overrides.css)
 *   --oklch         Convert hex colors back to OKLCH (uses OKLCH originals from comments if available)
 */

/* ═══════════════════════════════════════════════════════════════════
 * YAML front matter parser (minimal, no deps)
 * ═══════════════════════════════════════════════════════════════════ */

interface DesignMdTokens {
  colors: Record<string, string>;
  typography: Record<string, Record<string, string>>;
  spacing: Record<string, string>;
  rounded: Record<string, string>;
  components: Record<string, Record<string, string>>;
  oklchOriginals?: Record<string, string>;
}

function extractFrontMatter(content: string): { yaml: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("No YAML front matter found. Expected file to start with ---");
  }
  return { yaml: match[1], body: match[2] };
}

/**
 * Minimal YAML parser for DESIGN.md front matter.
 * Handles the flat/nested structure used by the spec: colors, typography,
 * spacing, rounded, components. Does NOT handle full YAML — just the
 * subset the spec uses.
 */
/** Strip YAML comments while preserving # inside quoted strings. */
function stripYamlComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '#' && !inSingle && !inDouble) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line.trimEnd();
}

function parseSimpleYaml(yaml: string): DesignMdTokens {
  const result: DesignMdTokens = {
    colors: {},
    typography: {},
    spacing: {},
    rounded: {},
    components: {},
  };

  // Extract OKLCH originals from comments
  const oklchLines = yaml.match(/#\s+(background|foreground|accent|destructive):\s+(oklch\([^)]+\))/g);
  if (oklchLines) {
    result.oklchOriginals = {};
    for (const line of oklchLines) {
      const m = line.match(/#\s+(background|foreground|accent|destructive):\s+(oklch\([^)]+\))/);
      if (m) result.oklchOriginals[m[1]] = m[2];
    }
  }

  let currentSection = "";
  let currentSubKey = "";

  for (const rawLine of yaml.split("\n")) {
    // Strip YAML comments: only remove # that's not inside quotes
    const line = stripYamlComment(rawLine);
    if (!line.trim()) continue;

    // Top-level section (no indent)
    const sectionMatch = line.match(/^(\w[\w-]*):\s*$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      currentSubKey = "";
      continue;
    }

    // Sub-key (2-space indent)
    const subKeyMatch = line.match(/^  ([\w][\w-]*):\s*$/);
    if (subKeyMatch && currentSection) {
      currentSubKey = subKeyMatch[1];
      continue;
    }

    // Value at 2-space indent (flat key: value)
    const flatValueMatch = line.match(/^  ([\w][\w-]*):\s*(.+)$/);
    if (flatValueMatch && currentSection && !currentSubKey) {
      const key = flatValueMatch[1];
      const value = flatValueMatch[2].replace(/^["']|["']$/g, "").trim();

      switch (currentSection) {
        case "colors": result.colors[key] = value; break;
        case "spacing": result.spacing[key] = value; break;
        case "rounded": result.rounded[key] = value; break;
      }
      continue;
    }

    // Value at 4-space indent (nested under sub-key)
    const nestedValueMatch = line.match(/^    ([\w][\w-]*):\s*(.+)$/);
    if (nestedValueMatch && currentSection && currentSubKey) {
      const key = nestedValueMatch[1];
      const value = nestedValueMatch[2].replace(/^["']|["']$/g, "").trim();

      if (currentSection === "typography") {
        if (!result.typography[currentSubKey]) result.typography[currentSubKey] = {};
        result.typography[currentSubKey][key] = value;
      } else if (currentSection === "components") {
        if (!result.components[currentSubKey]) result.components[currentSubKey] = {};
        result.components[currentSubKey][key] = value;
      }
      continue;
    }

    // Value at 2-space indent under a section with sub-keys
    if (flatValueMatch && currentSection && currentSubKey) {
      // Reset sub-key — this is a new sub-key
      currentSubKey = flatValueMatch[1];
      const value = flatValueMatch[2].replace(/^["']|["']$/g, "").trim();
      if (value) {
        // It's a flat value, not a sub-key
        currentSubKey = "";
        switch (currentSection) {
          case "colors": result.colors[flatValueMatch[1]] = value; break;
          case "spacing": result.spacing[flatValueMatch[1]] = value; break;
          case "rounded": result.rounded[flatValueMatch[1]] = value; break;
        }
      }
    }
  }

  return result;
}

/* ═══════════════════════════════════════════════════════════════════
 * CSS override generation
 * ═══════════════════════════════════════════════════════════════════ */

/** Map DESIGN.md color names to DUI CSS custom properties */
const COLOR_MAP: Record<string, string> = {
  "background": "--background",
  "foreground": "--foreground",
  "accent": "--accent",
  "destructive": "--destructive",
  "surface-1": "--surface-1",
  "surface-2": "--surface-2",
  "surface-3": "--surface-3",
  "text-1": "--text-1",
  "text-2": "--text-2",
  "text-3": "--text-3",
  "border": "--border",
  "accent-subtle": "--accent-subtle",
  "destructive-subtle": "--destructive-subtle",
};

/** Map DESIGN.md spacing names to DUI spacing tokens */
const SPACING_MAP: Record<string, string> = {
  "xs": "--space-1",
  "sm": "--space-2",
  "md": "--space-4",
  "lg": "--space-6",
  "xl": "--space-8",
  "2xl": "--space-12",
  "3xl": "--space-16",
};

/** Map DESIGN.md rounded names to DUI radius tokens */
const RADIUS_MAP: Record<string, string> = {
  "none": "--radius-none",
  "xs": "--radius-xs",
  "sm": "--radius-sm",
  "md": "--radius-md",
  "lg": "--radius-lg",
  "xl": "--radius-xl",
  "2xl": "--radius-2xl",
  "full": "--radius-full",
};

function generateOverrideCss(tokens: DesignMdTokens, useOklch: boolean): string {
  const lines: string[] = [];
  lines.push("/* ═══════════════════════════════════════════════════════════════");
  lines.push(" * DUI Theme Overrides — Generated from DESIGN.md");
  lines.push(" * ═══════════════════════════════════════════════════════════════ */");
  lines.push("");
  lines.push(":root {");

  // Colors — only override the 4 primitives on :root
  // (derived tokens compute automatically from primitives)
  const primitiveColors = ["background", "foreground", "accent", "destructive"];
  lines.push("  /* Colors (primitives — derived tokens update automatically) */");
  for (const name of primitiveColors) {
    const duiProp = COLOR_MAP[name];
    if (!duiProp) continue;

    if (useOklch && tokens.oklchOriginals?.[name]) {
      lines.push(`  ${duiProp}: ${tokens.oklchOriginals[name]};`);
    } else if (tokens.colors[name]) {
      lines.push(`  ${duiProp}: ${tokens.colors[name]};`);
    }
  }

  // Typography — extract font families
  lines.push("");
  lines.push("  /* Typography */");
  const bodyFont = tokens.typography["body-md"]?.fontFamily
    || tokens.typography["body-lg"]?.fontFamily
    || tokens.typography["body-sm"]?.fontFamily;
  const codeFont = tokens.typography["code"]?.fontFamily;

  if (bodyFont) {
    lines.push(`  --font-sans: '${bodyFont}', system-ui, -apple-system, sans-serif;`);
  }
  if (codeFont) {
    lines.push(`  --font-mono: '${codeFont}', ui-monospace, SFMono-Regular, monospace;`);
  }

  // Radius overrides
  const hasRadiusOverrides = Object.keys(tokens.rounded).length > 0;
  if (hasRadiusOverrides) {
    lines.push("");
    lines.push("  /* Border radius */");
    for (const [name, value] of Object.entries(tokens.rounded)) {
      const duiProp = RADIUS_MAP[name];
      if (duiProp) {
        lines.push(`  ${duiProp}: ${value};`);
      }
    }
  }

  lines.push("}");
  lines.push("");

  // Dark mode overrides (if OKLCH originals hint at a separate dark palette)
  // For now, note that users should create a separate dark override manually
  lines.push("/* Dark mode: override primitives under [data-theme=\"dark\"] */");
  lines.push("/* :root[data-theme=\"dark\"] { */");
  lines.push("/*   --background: oklch(...); */");
  lines.push("/*   --foreground: oklch(...); */");
  lines.push("/*   --accent: oklch(...); */");
  lines.push("/*   --destructive: oklch(...); */");
  lines.push("/* } */");
  lines.push("");

  return lines.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════
 * CLI
 * ═══════════════════════════════════════════════════════════════════ */

function parseArgs(args: string[]) {
  const result = {
    inPath: "./DESIGN.md",
    outPath: "./dui-theme-overrides.css",
    useOklch: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--in": result.inPath = args[++i]; break;
      case "--out": result.outPath = args[++i]; break;
      case "--oklch": result.useOklch = true; break;
      default:
        console.warn(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

async function main() {
  const opts = parseArgs(Deno.args);

  // Read the DESIGN.md
  let content: string;
  try {
    content = await Deno.readTextFile(opts.inPath);
  } catch {
    console.error(`❌ Could not read ${opts.inPath}`);
    Deno.exit(1);
  }

  // Parse
  const { yaml } = extractFrontMatter(content);
  const tokens = parseSimpleYaml(yaml);

  console.log(`📖 Parsed ${opts.inPath}:`);
  console.log(`   Colors: ${Object.keys(tokens.colors).length} tokens`);
  console.log(`   Typography: ${Object.keys(tokens.typography).length} levels`);
  console.log(`   Spacing: ${Object.keys(tokens.spacing).length} values`);
  console.log(`   Rounded: ${Object.keys(tokens.rounded).length} values`);
  console.log(`   Components: ${Object.keys(tokens.components).length} entries`);
  if (tokens.oklchOriginals) {
    console.log(`   OKLCH originals: ${Object.keys(tokens.oklchOriginals).length} found`);
  }

  // Generate CSS
  const css = generateOverrideCss(tokens, opts.useOklch);

  // Write
  await Deno.writeTextFile(opts.outPath, css);
  console.log(`\n✅ Generated ${opts.outPath} (${css.length} bytes)`);
  console.log(`   Import in your app: @import "${opts.outPath}";`);
  console.log(`   Or: <link rel="stylesheet" href="${opts.outPath}">`);

  if (opts.useOklch && tokens.oklchOriginals) {
    console.log(`\n   Using OKLCH values from DESIGN.md comments (recommended for DUI).`);
  } else if (!opts.useOklch && tokens.oklchOriginals) {
    console.log(`\n   💡 Tip: Use --oklch flag to output OKLCH values instead of hex (recommended for DUI).`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  Deno.exit(1);
});
