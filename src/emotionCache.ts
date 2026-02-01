// src/emotionCache.ts
import createCache from "@emotion/cache";

export function createEmotionCache() {
  const insertionPoint =
    typeof document !== "undefined"
      ? document.querySelector<HTMLMetaElement>(
          'meta[name="emotion-insertion-point"]'
        ) ?? undefined
      : undefined;

  return createCache({
    key: "css",
    insertionPoint,
    prepend: true,
  });
}
