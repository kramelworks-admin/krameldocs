import "server-only";

import { env } from "@/lib/config/env";

const GITHUB_API_URL = "https://api.github.com";

export async function githubFetch<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = env.githubToken;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API_URL}${path}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Repositório ou arquivo não encontrado. Verifique a configuração e as permissões.",
      );
    }

    if (response.status === 403) {
      const remaining = response.headers.get("x-ratelimit-remaining");
      const reset = response.headers.get("x-ratelimit-reset");

      if (remaining === "0" && reset) {
        const resetDate = new Date(Number(reset) * 1000);

        throw new Error(
          `O limite de requisições do GitHub foi esgotado. Tente novamente após ${resetDate.toLocaleString("pt-BR")}.`,
        );
      }

      throw new Error(
        "O GitHub negou o acesso. Verifique as permissões e, se necessário, o token.",
      );
    }

    if (response.status === 401) {
      throw new Error(
        "O GitHub não aceitou o token informado. Verifique se ele é válido.",
      );
    }

    throw new Error(`Falha ao consultar o GitHub (HTTP ${response.status}).`);
  }

  return (await response.json()) as T;
}
