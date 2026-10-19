import { describe, expect, it } from "vitest";

import { flattenNavigation } from "./flatten-navigation";
import type { ResolvedNavigationItem } from "@/types/navigation";

describe("flattenNavigation", () => {
  it("preserva a ordem das páginas", () => {
    const items: ResolvedNavigationItem[] = [
      { title: "Início", file: "index.md", url: "/docs" },
      {
        title: "Guias",
        items: [
          {
            title: "Instalação",
            file: "guias/instalacao.md",
            url: "/docs/guias/instalacao",
          },
          {
            title: "Referência",
            items: [
              {
                title: "API",
                file: "referencia/api.md",
                url: "/docs/referencia/api",
              },
            ],
          },
        ],
      },
    ];

    expect(flattenNavigation(items).map((page) => page.url)).toEqual([
      "/docs",
      "/docs/guias/instalacao",
      "/docs/referencia/api",
    ]);
  });

  it("retorna uma lista vazia quando não há páginas", () => {
    expect(flattenNavigation([])).toEqual([]);
  });
});
