import { describe, expect, it } from "vitest";
import { resolveNavigation } from "./resolve-navigation";
import type { NavigationItem } from "@/types/navigation";

describe("resolveNavigation", () => {
  it("adiciona URLs às páginas", () => {
    const items: NavigationItem[] = [
      { title: "Início", file: "index.md" },
      { title: "Instalação", file: "guias/instalacao.md" },
    ];

    expect(resolveNavigation(items)).toEqual([
      { title: "Início", file: "index.md", url: "/docs" },
      {
        title: "Instalação",
        file: "guias/instalacao.md",
        url: "/docs/guias/instalacao",
      },
    ]);
  });

  it("preserva grupos aninhados, títulos e ícones", () => {
    const items: NavigationItem[] = [
      {
        title: "Guias",
        icon: "book",
        items: [
          {
            title: "Configuração",
            icon: "settings",
            items: [
              {
                title: "Instalação",
                file: "guias/instalacao.md",
                icon: "terminal",
              },
            ],
          },
        ],
      },
    ];

    expect(resolveNavigation(items)).toEqual([
      {
        title: "Guias",
        icon: "book",
        items: [
          {
            title: "Configuração",
            icon: "settings",
            items: [
              {
                title: "Instalação",
                file: "guias/instalacao.md",
                icon: "terminal",
                url: "/docs/guias/instalacao",
              },
            ],
          },
        ],
      },
    ]);
  });

  it("rejeita caminhos de página inválidos", () => {
    const items: NavigationItem[] = [
      { title: "Inválida", file: "../segredo.md" },
    ];

    expect(() => resolveNavigation(items)).toThrow();
  });
});
