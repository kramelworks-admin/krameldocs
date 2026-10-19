import { describe, expect, it } from "vitest";
import { markdownPathToUrl } from "./paths";

describe("markdownPathToUrl", () => {
  it("converte index.md para a página inicial da documentação", () => {
    expect(markdownPathToUrl("index.md")).toBe("/docs");
  });

  it("converte caminhos aninhados", () => {
    expect(markdownPathToUrl("guias/instalacao.md")).toBe(
      "/docs/guias/instalacao",
    );
    expect(markdownPathToUrl("referencia/api.md")).toBe(
      "/docs/referencia/api",
    );
  });

  it("codifica caracteres especiais nos segmentos", () => {
    expect(markdownPathToUrl("guias/primeiros passos.md")).toBe(
      "/docs/guias/primeiros%20passos",
    );
  });

  it("rejeita caminhos que tentam sair da documentação", () => {
    expect(() => markdownPathToUrl("../secreto.md")).toThrow();
    expect(() => markdownPathToUrl("/absoluto.md")).toThrow();
    expect(() => markdownPathToUrl("arquivo.txt")).toThrow();
  });
});
