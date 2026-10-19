import "server-only";

import rehypePrettyCode from "rehype-pretty-code";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { resolveRelativeMarkdownLink } from "@/lib/markdown/resolve-relative-link";
import { resolveRelativeAsset } from "@/lib/markdown/resolve-relative-asset";

const markdownSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      "className",
      "dataLanguage",
      "dataTheme",
    ],
    pre: [
      ...(defaultSchema.attributes?.pre ?? []),
      "className",
      "dataLanguage",
      "dataTheme",
    ],
    span: [
      ...(defaultSchema.attributes?.span ?? []),
      "className",
      "dataLine",
      "style",
    ],
    figure: [
      ...(defaultSchema.attributes?.figure ?? []),
      "className",
      "dataRehypePrettyCodeFigure",
    ],
  },
};

function rehypeResolveRelativeLinks(currentFilePath?: string) {
  return (tree: {
    type: string;
    children?: Array<{
      type: string;
      tagName?: string;
      properties?: Record<string, unknown>;
      children?: unknown[];
    }>;
  }) => {
    if (!currentFilePath) {
      return;
    }

    const sourcePath = currentFilePath;

    function visit(node: {
      type: string;
      tagName?: string;
      properties?: Record<string, unknown>;
      children?: unknown[];
    }) {
      if (node.type === "element" && node.tagName === "a") {
        const href = node.properties?.href;

        if (typeof href === "string") {
          const resolved = resolveRelativeMarkdownLink(href, sourcePath);

          if (resolved) {
            node.properties = {
              ...node.properties,
              href: resolved,
            };
          }
        }
      }

      for (const child of node.children ?? []) {
        if (typeof child === "object" && child !== null && "type" in child) {
          visit(child as Parameters<typeof visit>[0]);
        }
      }
    }

    visit(tree);
  };
}


function rehypeResolveRelativeAssets() {
  return (tree: {
    type: string;
    children?: Array<{
      type: string;
      tagName?: string;
      properties?: Record<string, unknown>;
      children?: unknown[];
    }>;
  }) => {
    function visit(node: {
      type: string;
      tagName?: string;
      properties?: Record<string, unknown>;
      children?: unknown[];
    }) {
      if (node.type === "element" && node.properties) {
        if (node.tagName === "img") {
          const src = node.properties.src;

          if (typeof src === "string") {
            const resolved = resolveRelativeAsset(src);

            if (resolved) {
              node.properties.src = resolved;
            }
          }
        }

        if (node.tagName === "a") {
          const href = node.properties.href;

          if (
            typeof href === "string" &&
            !href.toLowerCase().endsWith(".md") &&
            !href.startsWith("#")
          ) {
            const resolved = resolveRelativeAsset(href);

            if (resolved) {
              node.properties.href = resolved;
            }
          }
        }
      }

      for (const child of node.children ?? []) {
        if (typeof child === "object" && child !== null && "type" in child) {
          visit(child as Parameters<typeof visit>[0]);
        }
      }
    }

    visit(tree);
  };
}

export async function renderMarkdown(
  markdown: string,
  filePath?: string,
): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
      keepBackground: false,
    })
    .use(rehypeResolveRelativeLinks, filePath)
    .use(rehypeResolveRelativeAssets)
    .use(rehypeSanitize, markdownSchema)
    .use(rehypeStringify);

  const result = await processor.process(markdown);

  return String(result);
}
