// src/emotionCache.ts
import createCache from "@emotion/cache";

const insertionPoint = document.querySelector<HTMLMetaElement>(
  'meta[name="emotion-insertion-point"]'
);

const emotionCache = createCache({
  key: "css",
  insertionPoint: insertionPoint ?? undefined, // safe fallback
  prepend: true,
});

export default emotionCache;
