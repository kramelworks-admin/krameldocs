import { notFound } from "next/navigation";

import { PageNavigation } from "@/components/navigation/page-navigation";
import { loadDocumentationPage } from "@/lib/markdown/load-page";
import { renderMarkdown } from "@/lib/markdown/render-markdown";
import { flattenNavigation } from "@/lib/navigation/flatten-navigation";
import { loadResolvedNavigation } from "@/lib/navigation/load-resolved-navigation";
import type { ResolvedNavigationItem } from "@/types/navigation";
import { DocsLayout } from "@/components/docs/docs-layout";

export const instant = false;

interface DocsSlugPageProps {
  params: Promise<{ slug: string[] }>;
}

function findPageFile(
  items: ResolvedNavigationItem[],
  targetUrl: string,
): string | undefined {
  for (const item of items) {
    if ("items" in item) {
      const result = findPageFile(item.items, targetUrl);

      if (result) {
        return result;
      }
    } else if (item.url === targetUrl) {
      return item.file;
    }
  }

  return undefined;
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug } = await params;
  const targetUrl = `/docs/${slug
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;

  let navigation;
  let filePath: string | undefined;

  try {
    navigation = await loadResolvedNavigation();
    filePath = findPageFile(navigation, targetUrl);

    if (!filePath) {
      notFound();
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Repositório ou arquivo não encontrado")
    ) {
      notFound();
    }

    throw error;
  }

  let page;

  try {
    page = await loadDocumentationPage(filePath);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Repositório ou arquivo não encontrado")
    ) {
      notFound();
    }

    throw error;
  }

  const html = await renderMarkdown(page.content, filePath);

  const pages = flattenNavigation(navigation);
  const currentIndex = pages.findIndex((item) => item.url === targetUrl);

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
