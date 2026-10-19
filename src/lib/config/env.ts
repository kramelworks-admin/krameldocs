function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`A variável de ambiente ${name} não foi definida.`);
  }

  return value;
}

function readPositiveInteger(name: string, fallback: number): number {
  const rawValue = process.env[name];

  if (!rawValue?.trim()) {
    return fallback;
  }

  const value = Number(rawValue);

  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(
      `A variável ${name} deve ser um número inteiro positivo.`,
    );
  }

  return value;
}

export const env = {
  get docsRepository() {
    return readRequiredEnv("DOCS_GIT_REPOSITORY");
  },

  get docsBranch() {
    return process.env.DOCS_GIT_BRANCH?.trim() || "main";
  },

  get docsPath() {
    return process.env.DOCS_GIT_PATH?.trim().replace(/^\/+|\/+$/g, "") ?? "";
  },

  get docsCacheTtl() {
    return readPositiveInteger("DOCS_CACHE_TTL", 60);
  },

  get githubToken() {
    return process.env.GITHUB_TOKEN?.trim() || undefined;
  },
};
