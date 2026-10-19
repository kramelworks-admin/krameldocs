import { beforeEach, describe, expect, it, vi } from "vitest";

const { readRepositoryFile } = vi.hoisted(() => ({
  readRepositoryFile: vi.fn(),
}));

vi.mock("@/lib/github/repository", () => ({
  readRepositoryFile,
}));

import { loadNavigation } from "./load-navigation";

describe("loadNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carrega e valida uma lista de páginas", async () => {
    readRepositoryFile.mockResolvedValue(
      JSON.stringify({
        items: [
          { title: "Início", file: "index.md" },
          { title: "Instalação", file: "guias/instalacao.md" },
        ],
      }),
    );

    await expect(loadNavigation()).resolves.toEqual([
      { title: "Início", file: "index.md" },
      { title: "Instalação", file: "guias/instalacao.md" },
    ]);

    expect(readRepositoryFile).toHaveBeenCalledWith("navigation.json");
  });

  it("aceita grupos aninhados", async () => {
    readRepositoryFile.mockResolvedValue(
      JSON.stringify({
        items: [
          {
            title: "Guias",
            items: [
              {
                title: "Instalação",
                file: "guias/instalacao.md",
              },
            ],
          },
        ],
      }),
    );

    await expect(loadNavigation()).resolves.toEqual([
      {
        title: "Guias",
        items: [
          {
            title: "Instalação",
            file: "guias/instalacao.md",
          },
        ],
      },
    ]);
  });

  it("rejeita JSON inválido", async () => {
    readRepositoryFile.mockResolvedValue("{ JSON inválido");

    await expect(loadNavigation()).rejects.toThrow(
      "O arquivo navigation.json contém JSON inválido.",
    );
  });

  it("rejeita uma estrutura raiz sem items", async () => {
    readRepositoryFile.mockResolvedValue(
      JSON.stringify({ pages: [] }),
    );

    await expect(loadNavigation()).rejects.toThrow(
      "A propriedade items em navigation deve ser uma lista.",
    );
  });

  it("rejeita títulos vazios", async () => {
    readRepositoryFile.mockResolvedValue(
      JSON.stringify({
        items: [{ title: "  ", file: "index.md" }],
      }),
    );

    await expect(loadNavigation()).rejects.toThrow(
      "Título inválido em navigation[0].",
    );
  });

  it("rejeita caminhos de arquivo inválidos", async () => {
    readRepositoryFile.mockResolvedValue(
      JSON.stringify({
        items: [{ title: "Segredo", file: "../segredo.md" }],
      }),
    );

    await expect(loadNavigation()).rejects.toThrow();
  });

  it("rejeita itens que não sejam objetos", async () => {
    readRepositoryFile.mockResolvedValue(
      JSON.stringify({ items: ["página inválida"] }),
    );

    await expect(loadNavigation()).rejects.toThrow(
      "Título inválido em navigation[0].",
    );
  });
});
