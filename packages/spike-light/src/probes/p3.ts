/**
 * P3 — form participation and field. Two identical forms: DUI controls in
 * dui-fields, BUI controls in bui-fields. The runner submits both and
 * compares FormData byte for byte, asserts :invalid/:user-invalid, label
 * activation, and accessible names via CDP.
 */
import "../components/field.ts";
import "../components/checkbox.ts";
import "../components/switch.ts";
import "../components/input.ts";
import "@dui/components/field";
import "@dui/components/checkbox";
import "@dui/components/switch";
import "@dui/components/input";

declare global {
  // deno-lint-ignore no-explicit-any
  interface Window { __p3: any }
}

const results: Record<string, unknown> = {};
for (const id of ["dui-form", "bui-form"]) {
  const form = document.getElementById(id) as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    results[id] = [...new FormData(form).entries()];
  });
}
window.__p3 = { results };
