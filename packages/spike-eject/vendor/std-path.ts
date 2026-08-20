/**
 * ENVIRONMENT WORKAROUND — not part of the spike.
 *
 * This sandbox's egress policy blocks `jsr.io` (and `npm.jsr.io`), so
 * `jsr:@std/path` cannot be fetched. `packages/docs/serve.ts` and the
 * `scripts/*` build tools import it, which stops `deno check` and the dev
 * server from running at all.
 *
 * `@std/path`'s `resolve`/`join`/`relative`/`dirname` are the same functions
 * `node:path` exposes, and `node:path` is built into Deno with no network
 * fetch. Re-export them under the `jsr:@std/path@^1` specifier via the root
 * import map. Delete this file (and the two import-map entries) on any machine
 * that can reach jsr.io.
 */
export { dirname, join, relative, resolve } from "node:path";
