import "server-only";

import { getOrSetCache } from "@/lib/cache/memory-cache";
import { env } from "@/lib/config/env";
import { githubFetch } from "@/lib/github/client";

interface GitHubBinaryContentResponse {
  type: string;
  encoding?: string;
  content?: string;
  path: string;
  size: number;
}

interface GitHubContentResponse {
  type: string;
  encoding?: string;
  content?: string;
  path: string;
  size: number;
}

interface RepositoryConfig {
  owner: string;
  repository: string;
}

function getRepositoryConfig(): RepositoryConfig {
  const value = env.docsRepository.trim();
  const match = value.match(
    /^(?:https:\/\/github\.com\/)?([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/,
  );

  if (!match) {
    throw new Error(
      "DOCS_GIT_REPOSITORY deve conter owner/repo ou uma URL do GitHub.",
    );
  }

  return {
    owner: match[1],
    repository: match[2],
  };
}

function normalizeRepositoryPath(path: string): string {
  if (path.includes("\0")) {
    throw new Error("Caminho de arquivo inválido.");
  }

  const normalized = path.replace(/\\/g, "/");

  if (normalized.startsWith("/")) {
    throw new Error("O caminho deve ser relativo ao repositório.");
  }

  if (normalized === "") {
    return "";
  }

  const segments = normalized.split("/");

  if (
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes(":"),
    )
  ) {
    throw new Error("Caminho de arquivo inválido.");
  }

  return segments.join("/");
}

export async function readRepositoryFile(filePath: string): Promise<string> {
  const { owner, repository } = getRepositoryConfig();
  const relativePath = normalizeRepositoryPath(filePath);
  const configuredRoot = normalizeRepositoryPath(env.docsPath);

  const fullPath = [configuredRoot, relativePath].filter(Boolean).join("/");

  if (!fullPath) {
    throw new Error("O caminho do arquivo não pode estar vazio.");
  }

  const apiPath = [
    "repos",
    encodeURIComponent(owner),
    encodeURIComponent(repository),
    "contents",
    fullPath.split("/").map(encodeURIComponent).join("/"),
  ].join("/");

  const query = new URLSearchParams({
    ref: env.docsBranch,
  });

  const cacheKey = [owner, repository, env.docsBranch, fullPath].join(":");

  return getOrSetCache(cacheKey, env.docsCacheTtl, async () => {
    const file = await githubFetch<GitHubContentResponse>(
      `/${apiPath}?${query.toString()}`,
    );

    if (file.type !== "file") {
      throw new Error("O caminho informado não corresponde a um arquivo.");
    }

    if (file.size > 2_000_000) {
      throw new Error("O arquivo excede o limite de 2 MB.");
    }

    if (file.encoding !== "base64" || !file.content) {
      throw new Error("O GitHub retornou um formato de arquivo não suportado.");
    }

    return Buffer.from(file.content, "base64").toString("utf8");
  });
}


export async function readRepositoryBinaryFile(
  filePath: string,
): Promise<{ content: Buffer; path: string; size: number }> {
  const { owner, repository } = getRepositoryConfig();
  const relativePath = normalizeRepositoryPath(filePath);
  const configuredRoot = normalizeRepositoryPath(env.docsPath);

  const fullPath = [configuredRoot, relativePath].filter(Boolean).join("/");

  if (!fullPath) {
    throw new Error("O caminho do arquivo não pode estar vazio.");
  }

  const apiPath = [
    "repos",
    encodeURIComponent(owner),
    encodeURIComponent(repository),
    "contents",
    fullPath.split("/").map(encodeURIComponent).join("/"),
  ].join("/");

  const query = new URLSearchParams({
    ref: env.docsBranch,
  });

  const cacheKey = [owner, repository, env.docsBranch, fullPath, "binary"].join(
    ":",
  );

  return getOrSetCache(cacheKey, env.docsCacheTtl, async () => {
    const file = await githubFetch<GitHubBinaryContentResponse>(
      `/${apiPath}?${query.toString()}`,
    );

    if (file.type !== "file") {
      throw new Error("O caminho informado não corresponde a um arquivo.");
    }

    if (file.size > 2_000_000) {
      throw new Error("O arquivo excede o limite de 2 MB.");
    }

    if (file.encoding !== "base64" || typeof file.content !== "string") {
      throw new Error("O GitHub não retornou o arquivo em Base64.");
    }

    const content = Buffer.from(file.content.replace(/\s/g, ""), "base64");

    return {
      content,
      path: file.path,
      size: file.size,
    };
  });
}

