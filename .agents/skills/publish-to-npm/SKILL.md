---
name: publish-to-npm
description: Publish a new DUI release to npm AND GitHub. Bumps version across all packages, builds, verifies, publishes to the @deepfuture npm org, pushes commits/tags, and creates a GitHub Release. Use when the user says "push a new release", "publish a new release", "publish to npm", "release a new version", "bump and publish", or "npm publish".
---

# Publish DUI (npm + GitHub)

Lockstep publish of all DUI packages to npm **and** update GitHub (push commits,
push tags, create a GitHub Release). This is meant to run start-to-finish without
manual intervention — the user makes a code change, invokes this skill, and both
npm and GitHub end up updated.

Packages (all share the same version number, published in dependency order):

- `@deepfuture/dui-components`
- `@deepfuture/dui-templates`
- `@deepfuture/dui-chart`
- `@deepfuture/dui-map`
- `@deepfuture/dui-cdn`

The source of truth for the current version is `packages/components/deno.json`.

## Prerequisites

### npm auth (must be non-interactive)

Publishing must work **without an OTP prompt**, because this skill runs npm in a
subprocess with no interactive terminal — and it publishes 5 packages in a row, so
any per-package prompt would stall the whole run. That requires a valid npm
**granular/automation access token** (this token type bypasses 2FA) stored in
`~/.npmrc`:

```
//registry.npmjs.org/:_authToken=npm_xxxxxxxx
@deepfuture:registry=https://registry.npmjs.org/
```

**Verify auth before doing anything else:**

```bash
npm whoami
```

- If it prints a username → auth is good, proceed.
- If it returns `401 Unauthorized` → the token is dead/expired. **Stop** and tell the
  user to mint a new **Granular Access Token** at npmjs.com → Avatar → Access Tokens →
  Generate New Token → Granular Access Token, with **Bypass two-factor authentication
  (2FA)** checked and **Packages and scopes: Read and write** scoped to `@deepfuture`.
  Once they paste it, replace the `_authToken=` line in `~/.npmrc`
  (`npm config set //registry.npmjs.org/:_authToken=npm_xxxx`). Do **not** fall back to
  interactive `npm login` / OTP — it will hang in this environment. (A single
  `@deepfuture`-scoped token authorizes all five packages.)

`scripts/publish.ts` also honors an `NPM_TOKEN` env var (it writes a temporary `.npmrc`
per package), but a valid `~/.npmrc` token is the standard, preferred setup.

### GitHub auth

```bash
gh auth status
```

Must show a logged-in account. Used for `gh release create` in the final step.

### Working tree

- All product changes committed (the version-bump commit is created by this skill at the end).

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
- All packages show the correct new version
- No errors (ignore the `repository.url` normalization warning)

### 6. Publish for real

```bash
deno task publish:live
```

This runs `npm publish --access public` for each package in dependency order, using the
`~/.npmrc` token (no OTP prompt):

1. `dui-components` (depends on core + primitives from npm)
2. `dui-templates` (depends on core + components)
3. `dui-chart` (depends on core + Observable Plot)
4. `dui-map` (depends on core + MapLibre GL)
5. `dui-cdn` (bundles everything)

If it fails with a `401`/`E401`/OTP error, the token is invalid — go back to the
**npm auth** prerequisite. Do not retry interactively. If it fails partway through the
5 packages, note which ones already published (npm won't republish an existing version)
and re-run after fixing auth; already-published versions will error as duplicates and
can be skipped.

### 7. Commit and tag

```bash
git add -A
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
```

Replace `X.Y.Z` with the actual version number.

### 8. Push to GitHub

Push the release commit and the tag to the remote:

```bash
git push && git push --tags
```

### 9. Create the GitHub Release

Create a Release for the new tag with auto-generated notes:

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
```

`--generate-notes` builds the changelog from merged PRs / commits since the previous tag.
Confirm the command prints the release URL. If `gh` reports the release already exists,
skip (do not fail the whole flow).

### 10. Summary

Tell the user:
- The version that was published, and all five package names with the new version
- The npm org: `https://www.npmjs.com/org/deepfuture`
- The GitHub Release URL (from step 9)
