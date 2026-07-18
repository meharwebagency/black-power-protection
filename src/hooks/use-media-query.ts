"use client";

import { useState, useEffect, useCallback } from "react";

interface UseMediaQueryOptions {
  defaultMatches?: boolean;
}

export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
): boolean {
  const { defaultMatches = false } = options;
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)", { defaultMatches: false });
}

export function useIsTablet() {
  return useMediaQuery("(max-width: 1024px)", { defaultMatches: false });
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)", { defaultMatches: true });
}
