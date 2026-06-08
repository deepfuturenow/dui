---
name: publish-to-npm
description: Publish a new DUI release to npm. Bumps version across all packages, builds, verifies, and publishes to the @deepfuture npm org. Use when the user says "push a new release to npm", "publish a new release", "publish to npm", "release a new version", "bump and publish", or "npm publish".
---

# Publish DUI to npm

Lockstep publish of all DUI packages to npm:

- `@deepfuture/dui-components`
- `@deepfuture/dui-templates`
- `@deepfuture/dui-chart`
- `@deepfuture/dui-map`
- `@deepfuture/dui-cdn`

All packages share the same version number. The source of truth for the current version is `packages/components/deno.json`.

## Prerequisites

- **npm authentication** (see "Authentication" below)
- All changes committed (the version bump itself will be committed at the end)

## Authentication

npm requires authentication to publish to the `@deepfuture` org. The publish script (`scripts/publish.ts`) supports three methods:

### Option 1: Granular access token (recommended)

npm's web-based OTP flow breaks when `npm publish` runs as a subprocess — npm masks the auth callback URLs with `***`, making them unclickable. A **granular access token** bypasses OTP entirely and is the most reliable method.

**One-time setup:**
1. Go to [npmjs.com](https://www.npmjs.com) → Avatar → Access Tokens → Generate New Token → **Granular Access Token**
2. Set permissions to **Read and write**
3. Scope to packages under `@deepfuture`
4. Copy the token (starts with `npm_`)

**Usage:**
```bash
NPM_TOKEN=npm_xxxx deno task publish:live
```

Or add to your shell profile for convenience:
```bash
export NPM_TOKEN=npm_xxxx
```

### Option 2: OTP from authenticator app

If you have a TOTP authenticator app configured for your npm account, pass the code directly:

```bash
deno task publish:live --otp 123456
```

The code must remain valid for ~10 seconds while all 5 packages publish.

### Option 3: Interactive login (fragile)

Run `npm whoami` to verify you're logged in. This relies on npm's interactive web auth flow, which **does not work reliably** when npm is spawned as a subprocess (the auth URLs get masked with `***`). Use Option 1 or 2 instead.

### Why not just `npm login`?

npm's 2FA enforcement sends you to a browser URL to authenticate. When the publish script spawns `npm publish` as a child process of Deno, npm detects a non-interactive context and masks the auth callback URL (e.g. `https://www.npmjs.com/auth/cli/***`), making the flow impossible to complete. This is a known npm CLI behavior, not a DUI bug. The `NPM_TOKEN` approach sidesteps the issue entirely.

## Steps

All commands run from the **repo root** (not a package subdirectory).

### 1. Check for uncommitted changes

```bash
git status --short
```

If there are uncommitted changes, stop and ask the user whether to commit or stash them first. A release should always start from a clean working tree.

### 2. Read the current version

```bash
grep '"version"' packages/components/deno.json
```

Tell the user the current version and ask what the new version should be. Offer three options:

- **patch** (e.g. 0.0.21 → 0.0.22) — bug fixes, safe changes
- **minor** (e.g. 0.0.21 → 0.1.0) — new features, non-breaking
- **major** (e.g. 0.0.21 → 1.0.0) — breaking changes

Wait for the user to confirm before proceeding.

### 3. Bump version

```bash
deno task version <patch|minor|major|X.Y.Z>
```

This updates `version` in `packages/components/deno.json`, `packages/templates/deno.json`, and `packages/docs/deno.json`.

### 4. Build

```bash
deno task build
```

Verify the output shows `dist/dui-components/`, `dist/dui-templates/`, `dist/dui-chart/`, and `dist/dui-map/`.

If the build fails, stop and fix the issue before continuing.

### 5. Dry-run publish

```bash
deno task publish
```

Without `--publish`, this does a dry run. It builds, creates the CDN bundle, verifies all package.json files, and runs `npm publish --dry-run` for each package.

Check that:
- All three packages show the correct new version
- No errors (ignore the `repository.url` normalization warning)

### 6. Publish for real

Using a granular access token (recommended):
```bash
NPM_TOKEN=npm_xxxx deno task publish:live
```

Or with OTP:
```bash
deno task publish:live --otp 123456
```

This runs `npm publish --access public` for each package in dependency order:
1. `dui-components` (depends on core + primitives from npm)
2. `dui-templates` (depends on core + components)
3. `dui-chart` (depends on core + Observable Plot)
4. `dui-map` (depends on core + MapLibre GL)
5. `dui-cdn` (bundles everything)

If publish fails with an OTP/auth error, see the **Authentication** section above.

### 7. Commit and tag

```bash
git add -A
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
```

Replace `X.Y.Z` with the actual version number.

### 8. Summary

Tell the user:
- The version that was published
- All three package names with the new version
- Remind them to `git push && git push --tags` if they want to push to the remote
