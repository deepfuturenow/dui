import {
  DuiBreadcrumb,
  DuiBreadcrumbItem,
  DuiBreadcrumbLink,
  DuiBreadcrumbPage,
  DuiBreadcrumbSeparator,
  DuiBreadcrumbEllipsis,
} from "./index.ts";

const components = [
  DuiBreadcrumb,
  DuiBreadcrumbItem,
  DuiBreadcrumbLink,
  DuiBreadcrumbPage,
  DuiBreadcrumbSeparator,
  DuiBreadcrumbEllipsis,
];

for (const comp of components) {
  if (!customElements.get(comp.tagName)) {
    customElements.define(comp.tagName, comp);
  }
}
