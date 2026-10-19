import "server-only";

export function resolveRelativeAsset(src: string): string | undefined {
  const value = src.trim();

  // Preserva URLs externas, data URLs, caminhos absolutos e fragmentos.
  if (
    !value ||
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(value)
  ) {
    return undefined;
  }

  const queryIndex = value.indexOf("?");
  const hashIndex = value.indexOf("#");
  const suffixIndex = [queryIndex, hashIndex]
    .filter((index) => index >= 0)
    .reduce((min, index) => Math.min(min, index), value.length);

  const pathname = value.slice(0, suffixIndex);
  const suffix = value.slice(suffixIndex);

  const segments = pathname.replace(/\\/g, "/").split("/");

  if (
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes(":") ||
        segment.includes("\0"),
    )
  ) {
    return undefined;
  }

  const encodedPath = segments.map(encodeURIComponent).join("/");

  return `/api/docs-assets/${encodedPath}${suffix}`;
}
