import { describe, expect, it } from "vitest";

import { resolveRelativeMarkdownLink } from "@/lib/markdown/resolve-relative-link";

describe("resolveRelativeMarkdownLink", () => {
  it("resolve um link para um arquivo na mesma pasta", () => {
    expect(
      resolveRelativeMarkdownLink("configuracao.md", "guias/instalacao.md"),
    ).toBe("/docs/guias/configuracao");
  });

  it("resolve um link para uma pasta acima", () => {
    expect(
      resolveRelativeMarkdownLink(
        "../referencia/api.md",
        "guias/instalacao.md",
      ),
    ).toBe("/docs/referencia/api");
  });

  it("preserva o fragmento da âncora", () => {
    expect(
      resolveRelativeMarkdownLink(
        "instalacao.md#requisitos",
        "guias/configuracao.md",
      ),
    ).toBe("/docs/guias/instalacao#requisitos");
  });

  it("converte o arquivo index.md para /docs", () => {
    expect(
      resolveRelativeMarkdownLink("../index.md", "guias/instalacao.md"),
    ).toBe("/docs");
  });

  it("não altera links externos nem âncoras isoladas", () => {
    expect(
      resolveRelativeMarkdownLink("https://example.com", "guias/instalacao.md"),
    ).toBeUndefined();

    expect(
      resolveRelativeMarkdownLink("#requisitos", "guias/instalacao.md"),
    ).toBeUndefined();
  });

  it("recusa caminhos que tentam sair da raiz", () => {
    expect(
      resolveRelativeMarkdownLink("../../../segredo.md", "guias/instalacao.md"),
    ).toBeUndefined();
  });

  it("não converte links para arquivos que não sejam Markdown", () => {
    expect(
      resolveRelativeMarkdownLink(
        "../assets/arquitetura.png",
        "guias/instalacao.md",
      ),
    ).toBeUndefined();
  });
});
