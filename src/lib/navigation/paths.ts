import "server-only";

import { validateMarkdownPath } from "@/lib/navigation/validate-path";

export function markdownPathToUrl(filePath: string): string {
  const validatedPath = validateMarkdownPath(filePath);

  const segments = validatedPath
    .replace(/\.md$/i, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment));

  if (segments.length === 1 && segments[0] === "index") {
    return "/docs";
  }

  return `/docs/${segments.join("/")}`;
}
