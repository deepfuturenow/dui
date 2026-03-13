export interface Route {
  section: string;
  component?: string;
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, "");
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return { section: "components" };

  const section = parts[0]!;
  const component = parts[1];

  return { section, component };
}

export function currentRoute(): Route {
  return parseHash(location.hash);
}

export function navigate(path: string): void {
  location.hash = path;
}

export function onRouteChange(callback: (route: Route) => void): () => void {
  const handler = () => callback(currentRoute());
  globalThis.addEventListener("hashchange", handler);
  return () => globalThis.removeEventListener("hashchange", handler);
}
