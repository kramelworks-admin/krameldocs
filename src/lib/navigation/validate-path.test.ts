import { describe, expect, it } from "vitest";

import { validateMarkdownPath } from "@/lib/navigation/validate-path";

describe("validateMarkdownPath", () => {
  it("aceita caminhos Markdown válidos", () => {
    expect(validateMarkdownPath("index.md")).toBe("index.md");
    expect(validateMarkdownPath("guias/instalacao.md")).toBe(
      "guias/instalacao.md",
    );
    expect(validateMarkdownPath("GUIAS/INSTALACAO.MD")).toBe(
      "GUIAS/INSTALACAO.MD",
    );
  });

  it("normaliza barras invertidas", () => {
    expect(validateMarkdownPath("guias\\instalacao.md")).toBe(
      "guias/instalacao.md",
    );
  });

  it.each([
    "",
    "   ",
    "/etc/passwd.md",
    "../secret.md",
    "guias/../secret.md",
    "./index.md",
    "guias//instalacao.md",
    "C:/secret.md",
    "guias/C:secret.md",
    "index.md\u0000",
    "README.txt",
    "index.mdx",
  ])("rejeita caminho inválido: %j", (path) => {
    expect(() => validateMarkdownPath(path)).toThrow();
  });
});
