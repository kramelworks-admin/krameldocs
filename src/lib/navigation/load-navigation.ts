import "server-only";

import { readRepositoryFile } from "@/lib/github/repository";
import { validateMarkdownPath } from "@/lib/navigation/validate-path";
import type {
  NavigationGroup,
  NavigationItem,
  NavigationPage,
} from "@/types/navigation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateItems(value: unknown, location = "navigation"): NavigationItem[] {
  if (!Array.isArray(value)) {
    throw new Error(`A propriedade items em ${location} deve ser uma lista.`);
  }

  return value.map((entry, index) => {
    const currentLocation = `${location}[${index}]`;

    if (!isRecord(entry) || typeof entry.title !== "string" || !entry.title.trim()) {
      throw new Error(`Título inválido em ${currentLocation}.`);
    }

    if (entry.icon !== undefined && typeof entry.icon !== "string") {
      throw new Error(`Ícone inválido em ${currentLocation}.`);
    }

    if ("items" in entry) {
      const group: NavigationGroup = {
        title: entry.title.trim(),
        ...(typeof entry.icon === "string" ? { icon: entry.icon } : {}),
        items: validateItems(entry.items, currentLocation),
      };

      return group;
    }

    if (typeof entry.file !== "string" || !entry.file.trim()) {
      throw new Error(
        `A página em ${currentLocation} precisa de uma propriedade file.`,
      );
    }

    const page: NavigationPage = {
      title: entry.title.trim(),
      file: validateMarkdownPath(entry.file),
      ...(typeof entry.icon === "string" ? { icon: entry.icon } : {}),
    };

    return page;
  });
}

export async function loadNavigation(): Promise<NavigationItem[]> {
  const contents = await readRepositoryFile("navigation.json");

  let parsed: unknown;

  try {
    parsed = JSON.parse(contents);
  } catch {
    throw new Error("O arquivo navigation.json contém JSON inválido.");
  }

  const items = isRecord(parsed) ? parsed.items : parsed;

  return validateItems(items);
}
