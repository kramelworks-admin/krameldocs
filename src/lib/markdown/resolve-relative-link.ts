import "server-only";

import { markdownPathToUrl } from "@/lib/navigation/paths";
import { validateMarkdownPath } from "@/lib/navigation/validate-path";

export function resolveRelativeMarkdownLink(
  href: string,
  currentFilePath: string,
): string | undefined {
  const value = href.trim();

  // Preserve URLs externas, links de e-mail, âncoras e outros esquemas.
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(value)
  ) {
    return undefined;
  }

  const hashIndex = value.indexOf("#");
  const queryIndex = value.indexOf("?");
  const suffixIndex = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .reduce((min, index) => Math.min(min, index), value.length);

  const pathname = value.slice(0, suffixIndex);
  const suffix = value.slice(suffixIndex);

  // Por enquanto, convertemos apenas links para arquivos Markdown.
  if (!pathname.toLowerCase().endsWith(".md")) {
    return undefined;
  }

  try {
    const currentDirectory = currentFilePath.includes("/")
      ? currentFilePath.slice(0, currentFilePath.lastIndexOf("/"))
      : "";

    const segments = [
      ...currentDirectory.split("/").filter(Boolean),
      ...pathname.replace(/\\/g, "/").split("/"),
    ];

    const resolvedSegments: string[] = [];

    for (const segment of segments) {
      if (!segment || segment === ".") {
        continue;
      }

      if (segment === "..") {
        if (resolvedSegments.length === 0) {
          return undefined;
        }

        resolvedSegments.pop();
        continue;
      }

      if (segment.includes(":") || segment.includes("\0")) {
        return undefined;
      }

      resolvedSegments.push(segment);
    }

    const resolvedPath = validateMarkdownPath(resolvedSegments.join("/"));

    return `${markdownPathToUrl(resolvedPath)}${suffix}`;
  } catch {
    // Um caminho inválido não deve gerar uma rota interna.
    return undefined;
  }
}
