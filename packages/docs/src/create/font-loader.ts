const loadedFamilies = new Set<string>();

export async function loadGoogleFont(
  family: string,
  weights = "400;500;600;700",
): Promise<void> {
  if (loadedFamilies.has(family)) return;
  loadedFamilies.add(family);

  const params = new URLSearchParams({
    family: `${family}:wght@${weights}`,
    display: "swap",
  });

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${params.toString()}`;
  document.head.appendChild(link);

  await document.fonts.ready;
}
