import { notFound } from "next/navigation";
import { connection } from "next/server";

import { flattenNavigation } from "@/lib/navigation/flatten-navigation";

import { PageNavigation } from "@/components/navigation/page-navigation";
import { loadDocumentationPage } from "@/lib/markdown/load-page";
import { renderMarkdown } from "@/lib/markdown/render-markdown";
import { loadResolvedNavigation } from "@/lib/navigation/load-resolved-navigation";

import { DocsLayout } from "@/components/docs/docs-layout";

export const instant = false;

export default async function DocsPage() {
  await connection();

  let page;
  let navigation;

  try {
    [page, navigation] = await Promise.all([
      loadDocumentationPage("index.md"),
      loadResolvedNavigation(),
    ]);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Repositório ou arquivo não encontrado")
    ) {
      notFound();
    }

    throw error;
  }

  const html = await renderMarkdown(page.content);

  const pages = flattenNavigation(navigation);
  const currentIndex = pages.findIndex((item) => item.url === "/docs");

  const previous = currentIndex > 0 ? pages[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? pages[currentIndex + 1] : undefined;

  return (
    <DocsLayout navigation={navigation}>
      <article
        className="markdown-content max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <PageNavigation previous={previous} next={next} />
    </DocsLayout>
  );
}
