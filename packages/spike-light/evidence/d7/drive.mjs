// Drives tsserver (typescript 5.9 + ts-lit-plugin) over stdio and asks for
// completions inside the css`` block: after "var(--sp" and inside empty "var()".
import { spawn } from "node:child_process";
import fs from "node:fs";

const file = "/tmp/litcheck/proj/component.ts";
const content = fs.readFileSync(file, "utf8");
const lines = content.split("\n");
const find = (needle) => {
  for (let i = 0; i < lines.length; i++) {
    const c = lines[i].indexOf(needle);
    if (c >= 0) return { line: i + 1, offset: c + needle.length + 1 };
  }
  throw new Error("needle not found: " + needle);
};

const srv = spawn("node", [
  "/tmp/litcheck/node_modules/typescript/lib/tsserver.js",
  "--pluginProbeLocations", "/tmp/litcheck",
  "--allowLocalPluginLoads",
  "--logVerbosity", "verbose", "--logFile", "/tmp/litcheck/tsserver.log",
], { stdio: ["pipe", "pipe", "inherit"] });

let seq = 0;
const pending = new Map();
const send = (command, args) => new Promise((res) => {
  const s = ++seq;
  pending.set(s, res);
  srv.stdin.write(JSON.stringify({ seq: s, type: "request", command, arguments: args }) + "\n");
  // events don't resolve; timeout safety
  setTimeout(() => { if (pending.has(s)) { pending.delete(s); res(null); } }, 15000);
});

let buf = "";
srv.stdout.on("data", (d) => {
  buf += d.toString();
  let idx;
  while ((idx = buf.indexOf("\r\n\r\n")) >= 0) {
    const rest = buf.slice(idx + 4);
    const nl = rest.indexOf("\n");
    const bodyLine = nl >= 0 ? rest.slice(0, nl + 1) : rest;
    let msg = null;
    try { msg = JSON.parse(bodyLine); } catch { break; }
    buf = rest.slice(bodyLine.length);
    if (msg.type === "response" && pending.has(msg.request_seq)) {
      pending.get(msg.request_seq)(msg);
      pending.delete(msg.request_seq);
    }
  }
});

await send("open", { file });
await new Promise((r) => setTimeout(r, 4000)); // let the plugin initialize

// position 1: right after "var(--sp" — insert the prefix first via reload trick:
// easier: ask at "var(--space-1" minus... instead use the empty var() position.
const p1 = find("padding: var(--sp"); // completion mid-identifier
const p2 = find("font-size: var(");   // completion in empty var()
const p3 = find("    pad");           // CSS property-name completion (plugin liveness)

for (const [label, pos] of [["after var(--sp", p1], ["inside empty var(", p2], ["property name after pad", p3]]) {
  const r = await send("completionInfo", { file, line: pos.line, offset: pos.offset });
  const entries = r?.body?.entries ?? [];
  const custom = entries.filter((e) => e.name.startsWith("--"));
  console.log(`\n[${label}] total entries: ${entries.length}, custom-property entries: ${custom.length}`);
  console.log("first 15:", entries.slice(0, 15).map((e) => e.name).join(", ") || "(none)");
  if (custom.length) console.log("custom props:", custom.map((e) => e.name).join(", "));
}

// sanity: is the plugin alive at all? ask for completions on a lit-html tag/attr case
const diag = await send("semanticDiagnosticsSync", { file });
console.log("\nsemantic diagnostics:", JSON.stringify((diag?.body ?? []).map((d) => d.text).slice(0, 5)));

srv.kill();
