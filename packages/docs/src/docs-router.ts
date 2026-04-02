export interface Route {
  section: string;
  component?: string;
  sidebarClosed?: boolean;
}

export function parseHash(hash: string): Route {
  const [pathPart, queryPart] = hash.replace(/^#\/?/, "").split("?");
  const parts = (pathPart ?? "").split("/").filter(Boolean);
  const params = new URLSearchParams(queryPart ?? "");

  if (parts.length === 0) return { section: "components", sidebarClosed: params.get("sidebar") === "closed" };

  const section = parts[0]!;
  const component = parts[1];

  return { section, component, sidebarClosed: params.get("sidebar") === "closed" };
}

export function currentRoute(): Route {
  return parseHash(location.hash);
}

export function navigate(path: string): void {
  location.hash = path;
}

/** Update just the sidebar param without changing the route path. */
export function setSidebarParam(closed: boolean): void {
  const hash = location.hash.replace(/^#\/?/, "");
  const [pathPart] = hash.split("?");
  if (closed) {
    location.hash = `#/${pathPart}?sidebar=closed`;
  } else {
    location.hash = `#/${pathPart}`;
  }
}

export function onRouteChange(callback: (route: Route) => void): () => void {
  const handler = () => callback(currentRoute());
  globalThis.addEventListener("hashchange", handler);
  return () => globalThis.removeEventListener("hashchange", handler);
}
