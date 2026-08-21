#!/usr/bin/env bash
# Bootstrap for Claude Code web sessions. Restores what container restarts
# wipe: the deno binary (not preinstalled; jsr.io and deno.land are blocked by
# egress policy, so it comes from npm) and the dui-primitives sibling clone the
# root import map expects at ../dui-primitives.
set -u
if ! command -v deno >/dev/null 2>&1 && [ ! -x "$HOME/bin/deno" ]; then
  npm install deno@latest --no-save --prefix /tmp/denoinstall >/dev/null 2>&1
  mkdir -p "$HOME/bin" && ln -sf /tmp/denoinstall/node_modules/.bin/deno "$HOME/bin/deno"
fi
if [ ! -d /home/user/dui-primitives/packages/primitives/src ]; then
  GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 \
    https://github.com/deepfuturenow/dui-primitives /home/user/dui-primitives >/dev/null 2>&1
fi
echo "bootstrap: deno=$("$HOME/bin/deno" --version 2>/dev/null | head -1 | cut -d' ' -f2), primitives=$([ -d /home/user/dui-primitives/packages/primitives/src ] && echo ok || echo MISSING)"
