/**
 * ENVIRONMENT WORKAROUND — not part of the spike. See `./std-path.ts`.
 *
 * The two `@std/fs` helpers the build scripts use, reimplemented on Deno's
 * own filesystem API so nothing has to be fetched from the blocked jsr.io.
 */
export async function exists(path: string | URL): Promise<boolean> {
  try {
    await Deno.lstat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}

export async function ensureDir(dir: string | URL): Promise<void> {
  await Deno.mkdir(dir, { recursive: true });
}
