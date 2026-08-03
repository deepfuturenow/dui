#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write
/**
 * Refresh the committed DUI brand webfonts (woff2) from Google Fonts into this
 * skill's fonts/ dir + a self-contained fonts.css with local URLs. The fonts are
 * committed to the repo so a sync is reproducible offline; run this only to
 * refresh them. gen.ts copies fonts/ → ds-bundle/fonts/ and @imports it from
 * styles.css. Requires network.
 *
 * Only JetBrains Mono (--font-mono) ships — the one brand font the token closure
 * references (--font-sans is system-ui; --font-serif is a system serif with no
 * webface). See FAMILIES below.
 */
import { join, resolve } from "jsr:@std/path@^1";

const OUT = resolve(import.meta.dirname!, "fonts");
// A modern-browser UA so the CSS2 API serves woff2 (not legacy ttf).
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Only families that the DUI token closure actually references get a webface.
// tokens.css: --font-sans = system-ui (NO Inter), --font-mono = 'JetBrains Mono',
// --font-serif = system serif (Cambria — no free webfont). So JetBrains Mono is
// the only shippable brand font. (Material Symbols powers <dui-icon> but isn't in
// the token closure and is ~3.9 MB — wire it separately if/when icons are needed.)
const FAMILIES = [
  { slug: "jetbrains-mono", url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" },
];

async function get(url: string): Promise<Response> {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
}

await Deno.mkdir(OUT, { recursive: true });
let combined = "/* DUI brand webfonts — vendored by fetch-fonts.ts. Do not edit by hand. */\n";
for (const fam of FAMILIES) {
  const css = await (await get(fam.url)).text();
  let out = css;
  const uniq = [...new Set([...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1]))];
  let i = 0, bytes = 0;
  for (const u of uniq) {
    const file = `${fam.slug}-${i++}.woff2`;
    const buf = new Uint8Array(await (await get(u)).arrayBuffer());
    await Deno.writeFile(join(OUT, file), buf);
    out = out.replaceAll(u, `./${file}`);
    bytes += buf.length;
  }
  combined += `\n/* ${fam.slug} — ${uniq.length} file(s), ${(bytes / 1024).toFixed(0)} KB */\n${out}\n`;
  console.log(`  ${fam.slug}: ${uniq.length} woff2, ${(bytes / 1024).toFixed(0)} KB`);
}
await Deno.writeTextFile(join(OUT, "fonts.css"), combined);
console.log(`✅ fonts → ${OUT}`);
