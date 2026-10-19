import "server-only";

import { readRepositoryFile } from "@/lib/github/repository";
import { validateMarkdownPath } from "@/lib/navigation/validate-path";

export interface DocumentationPage {
  path: string;
  content: string;
}

export async function loadDocumentationPage(
  filePath: string,
): Promise<DocumentationPage> {
  const path = validateMarkdownPath(filePath);
  const content = await readRepositoryFile(path);

  return {
    path,
    content,
  };
}
