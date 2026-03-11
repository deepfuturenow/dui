/**
 * Persistence — localStorage for token overrides
 *
 * Simplified single-key storage. All overrides stored as a flat
 * Record<string, string> (composite key → value).
 */

const STORAGE_KEY = "dui-theme-editor:overrides";

/**
 * Save all overrides to localStorage.
 */
export const saveOverrides = (overrides: Record<string, string>): void => {
  if (Object.keys(overrides).length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }
};

/**
 * Load all overrides from localStorage.
 */
export const loadOverrides = (): Record<string, string> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

/**
 * Clear all overrides from localStorage.
 */
export const clearOverrides = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
