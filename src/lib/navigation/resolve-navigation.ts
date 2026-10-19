import "server-only";

import { markdownPathToUrl } from "@/lib/navigation/paths";
import type {
  NavigationItem,
  ResolvedNavigationItem,
  ResolvedNavigationPage,
  ResolvedNavigationGroup,
} from "@/types/navigation";

export function resolveNavigation(
  items: NavigationItem[],
): ResolvedNavigationItem[] {
  return items.map((item): ResolvedNavigationItem => {
    if ("items" in item) {
      const group: ResolvedNavigationGroup = {
        title: item.title,
        ...(item.icon !== undefined ? { icon: item.icon } : {}),
        items: resolveNavigation(item.items),
      };

      return group;
    }

    const page: ResolvedNavigationPage = {
      ...item,
      url: markdownPathToUrl(item.file),
    };

    return page;
  });
}
