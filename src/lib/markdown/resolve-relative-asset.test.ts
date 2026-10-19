import { describe, expect, it } from "vitest";

import { resolveRelativeAsset } from "@/lib/markdown/resolve-relative-asset";

describe("resolveRelativeAsset", () => {
  it("converte um caminho de imagem para a rota de assets", () => {
    expect(resolveRelativeAsset("assets/arquitetura.png")).toBe(
      "/api/docs-assets/assets/arquitetura.png",
    );
  });

  it("codifica segmentos com espaços e caracteres especiais", () => {
    expect(resolveRelativeAsset("assets/visão geral.png")).toBe(
      "/api/docs-assets/assets/vis%C3%A3o%20geral.png",
    );
  });

  it("preserva query strings e fragmentos", () => {
    expect(resolveRelativeAsset("assets/manual.pdf?download=1#pagina-2")).toBe(
      "/api/docs-assets/assets/manual.pdf?download=1#pagina-2",
    );
  });

  it("não altera URLs externas, data URLs ou caminhos absolutos", () => {
    expect(
      resolveRelativeAsset("https://example.com/image.png"),
    ).toBeUndefined();
    expect(resolveRelativeAsset("data:image/png;base64,AAAA")).toBeUndefined();
    expect(resolveRelativeAsset("/images/logo.png")).toBeUndefined();
    expect(resolveRelativeAsset("//cdn.example.com/image.png")).toBeUndefined();
  });

  it("recusa caminhos vazios e segmentos inválidos", () => {
    expect(resolveRelativeAsset("")).toBeUndefined();
    expect(resolveRelativeAsset("../secreto.png")).toBeUndefined();
    expect(resolveRelativeAsset("assets/../secreto.png")).toBeUndefined();
    expect(resolveRelativeAsset("assets//imagem.png")).toBeUndefined();
  });
});
