import type { AttractionV2 } from "@services/attractions";
import http from "@services/http";

const searchPlaceByName = async (
  query: string,
  lat: number,
  lng: number,
  limit?: number
): Promise<AttractionV2[]> => {
  const params = new URLSearchParams();

  params.set("query", query.toString());
  params.set("lat", lat.toString());
  params.set("lng", lng.toString());
  if (limit) params.set("limit", limit.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `hereMap/discover?${params.toString()}`,
    undefined,
    undefined
  );
};

export const hereMapDiscoverService = {
  searchPlaceByName,
};
