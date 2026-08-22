// Drives css-variables-language-server (the LSP behind the "CSS Var Complete"
// VS Code extension) over stdio: initialize against a workspace containing
// tokens.css, open a .ts file with a css`` template, request completions
// inside var( — the exact ask D7's lit-plugin check failed.
import { spawn } from "node:child_process";
import fs from "node:fs";

const ROOT = "/tmp/cssvarcheck/proj";
const FILE = `${ROOT}/component.ts`;
const text = fs.readFileSync(FILE, "utf8");

const srv = spawn("node", ["/tmp/cssvarcheck/node_modules/css-variables-language-server/bin/index.js", "--stdio"], { stdio: ["pipe", "pipe", "inherit"] });

let seq = 0;
const pending = new Map();
function send(method, params, isNotification = false) {
  const msg = { jsonrpc: "2.0", method, params };
  if (!isNotification) msg.id = ++seq;
  const body = JSON.stringify(msg);
  srv.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
  if (isNotification) return Promise.resolve(null);
  return new Promise((res) => {
    pending.set(msg.id, res);
    setTimeout(() => { if (pending.has(msg.id)) { pending.delete(msg.id); res({ timeout: true }); } }, 10000);
  });
}

let buf = Buffer.alloc(0);
srv.stdout.on("data", (d) => {
  buf = Buffer.concat([buf, d]);
  for (;;) {
    const headerEnd = buf.indexOf("\r\n\r\n");
    if (headerEnd < 0) return;
    const header = buf.slice(0, headerEnd).toString();
    const len = Number(/Content-Length: (\d+)/.exec(header)?.[1]);
    if (buf.length < headerEnd + 4 + len) return;
    const body = JSON.parse(buf.slice(headerEnd + 4, headerEnd + 4 + len).toString());
    buf = buf.slice(headerEnd + 4 + len);
    if (body.method === undefined && body.id !== undefined && pending.has(body.id)) {
      pending.get(body.id)(body);
      pending.delete(body.id);
    } else if (body.method !== undefined && body.id !== undefined) {
      // server -> client request: answer it or indexing never starts
      let result = null;
      if (body.method === "workspace/configuration") {
        result = body.params.items.map(() => ({
          lookupFiles: ["**/*.css"],
          blacklistFolders: [],
        }));
      } else if (body.method === "workspace/workspaceFolders") {
        result = [{ uri: `file://${ROOT}`, name: "proj" }];
      }
      const resp = JSON.stringify({ jsonrpc: "2.0", id: body.id, result });
      srv.stdin.write(`Content-Length: ${Buffer.byteLength(resp)}\r\n\r\n${resp}`);
    }
  }
});

const init = await send("initialize", {
  processId: process.pid,
  rootUri: `file://${ROOT}`,
  workspaceFolders: [{ uri: `file://${ROOT}`, name: "proj" }],
  capabilities: { workspace: { configuration: true, workspaceFolders: true } },
  initializationOptions: {},
});
console.log("server capabilities:", JSON.stringify(init.result?.capabilities?.completionProvider ?? init));
await send("initialized", {}, true);
await send("workspace/didChangeConfiguration", {
  settings: { cssVariables: { lookupFiles: ["**/*.css"], blacklistFolders: [] } },
}, true);
await new Promise((r) => setTimeout(r, 2500)); // let it index tokens.css

await send("textDocument/didOpen", {
  textDocument: { uri: `file://${FILE}`, languageId: "typescript", version: 1, text },
}, true);

// positions: inside empty var() on the font-size line, and after var(-- prefix
const lines = text.split("\n");
const findPos = (needle, extra = 0) => {
  for (let i = 0; i < lines.length; i++) {
    const c = lines[i].indexOf(needle);
    if (c >= 0) return { line: i, character: c + needle.length + extra };
  }
  throw new Error("not found: " + needle);
};

for (const [label, pos] of [
  ["inside empty var(", findPos("font-size: var(")],
  ["mid-identifier var(--sp", findPos("padding: var(--sp")],
]) {
  const r = await send("textDocument/completion", {
    textDocument: { uri: `file://${FILE}` },
    position: pos,
  });
  const items = r.result?.items ?? r.result ?? [];
  const names = items.map((i) => i.label).filter((l) => String(l).startsWith("--"));
  console.log(`[${label}] items: ${items.length}, custom-property labels: ${names.join(", ") || "(none)"}`);
}
srv.kill();
