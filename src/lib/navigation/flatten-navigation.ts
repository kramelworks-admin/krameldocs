import "server-only";

import type {
  ResolvedNavigationItem,
  ResolvedNavigationPage,
} from "@/types/navigation";

export function flattenNavigation(
  items: ResolvedNavigationItem[],
): ResolvedNavigationPage[] {
  const pages: ResolvedNavigationPage[] = [];

  for (const item of items) {
    if ("items" in item) {
      pages.push(...flattenNavigation(item.items));
    } else {
      pages.push(item);
    }
  }

  return pages;
}
