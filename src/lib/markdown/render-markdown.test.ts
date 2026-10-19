import { renderMarkdown } from "@/lib/markdown/render-markdown";
import { describe, expect, it } from "vitest";

describe("renderMarkdown", () => {
  it("converte tabelas e listas", async () => {
    const html = await renderMarkdown(
      "| Nome | Valor |\n| --- | --- |\n| Exemplo | 42 |\n\n- Item A\n- Item B",
    );

    expect(html).toContain("<table>");
    expect(html).toContain("<li>");
    expect(html).toContain("Exemplo");
  });

  it("não permite HTML perigoso embutido no Markdown", async () => {
    const html = await renderMarkdown(
      '<script>alert("xss")</script>\n\nTexto seguro',
    );

    expect(html).not.toContain("<script>");
    expect(html).toContain("Texto seguro");
  });

  it("remove atributos de eventos e URLs JavaScript", async () => {
    const html = await renderMarkdown(
      '<a href="javascript:alert(1)" onclick="alert(2)">Link</a>',
    );

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("onclick");
    expect(html).toContain("Link");
  });

  it("processa blocos de código e preserva o realce de sintaxe", async () => {
    const html = await renderMarkdown("```ts\nconst answer: number = 42;\n```");

    expect(html).toContain("answer");
    expect(html).toContain("42");
    expect(html).toContain("--shiki-light:");
    expect(html).toContain("--shiki-dark:");
    expect(html).toContain("<span");
  });
});

it("gera IDs para títulos usados como âncoras", async () => {
  const html = await renderMarkdown("# Guia de Instalação");

  expect(html).toContain('id="user-content-guia-de-instalação"');
});

it("preserva links externos HTTPS", async () => {
  const html = await renderMarkdown("[Site oficial](https://example.com)");

  expect(html).toContain('href="https://example.com"');
});

it("preserva fragmentos de âncora em links", async () => {
  const html = await renderMarkdown("[Ir para instalação](#instalacao)");

  expect(html).toContain('href="#instalacao"');
});


  it("converte links relativos em rotas internas", async () => {
    const html = await renderMarkdown(
      [
        "[Configuração](configuracao.md)",
        "",
        "[API](../referencia/api.md)",
        "",
        "[Requisitos](instalacao.md#requisitos)",
      ].join("\n"),
      "guias/instalacao.md",
    );

    expect(html).toContain('href="/docs/guias/configuracao"');
    expect(html).toContain('href="/docs/referencia/api"');
    expect(html).toContain('href="/docs/guias/instalacao#requisitos"');
  });

  it("preserva links externos ao resolver links relativos", async () => {
    const html = await renderMarkdown(
      "[Site](https://example.com)\n\n[Outra página](outra.md)",
      "guias/instalacao.md",
    );

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('href="/docs/guias/outra"');
  });
