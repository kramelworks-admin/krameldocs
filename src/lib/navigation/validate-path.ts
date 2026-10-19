import "server-only";

export function validateMarkdownPath(filePath: string): string {
  const path = filePath.trim().replace(/\\/g, "/");

  if (!path || path.startsWith("/") || path.includes("\0")) {
    throw new Error("Caminho de documentação inválido.");
  }

  const segments = path.split("/");

  if (
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes(":"),
    )
  ) {
    throw new Error("O caminho contém segmentos inválidos.");
  }

  if (!path.toLowerCase().endsWith(".md")) {
    throw new Error("As páginas de documentação devem usar arquivos .md.");
  }

  return path;
}
