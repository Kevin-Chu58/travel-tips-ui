import type { HerePlace } from "./hereMap/hereMap";
import http, { type SearchResults } from "./http";

export interface GetAttractionsParams {
  title?: string;
  category?: string;
  resultType?: string;
  hereId?: string;
  city?: string;
  state?: string;
  country?: string;
  ownerId?: number;
  limit?: number;
  cursor?: string;
}

type AttractionBasic = {
  hereId: string;
  title: string;
  resultType: string;
  category?: string;
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  numHighlights?: number;
};

export type Attraction = AttractionBasic & {
  id: number;
};

const getAttractionById = async (id: number): Promise<Attraction> => {
  return await http.get(http.apiBaseURLs.api, `attractions/${id}`, undefined);
};

const getHerePlaceByAttractionId = async (id: number): Promise<HerePlace> => {
  return await http.get(http.apiBaseURLs.api, `attractions/${id}/here-map`);
};

const getAttractionsByParam = async (
  params: GetAttractionsParams,
): Promise<SearchResults<Attraction>> => {
  const searchParams = new URLSearchParams();

  if (params.title) searchParams.set("title", params.title);
  if (params.category) searchParams.set("category", params.category);
  if (params.resultType) searchParams.set("resultType", params.resultType);
  if (params.hereId) searchParams.set("hereId", params.hereId);
  if (params.city) searchParams.set("city", params.city);
  if (params.state) searchParams.set("state", params.state);
  if (params.country) searchParams.set("country", params.country);
  if (params.ownerId) searchParams.set("ownerId", params.ownerId.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.cursor) searchParams.set("cursor", params.cursor);

  return await http.get(
    http.apiBaseURLs.api,
    `attractions?${searchParams.toString()}`,
    undefined,
  );
};

const postNewAttraction = async (hereId: string): Promise<HerePlace> => {
  return await http.post(
    http.apiBaseURLs.api,
    `attractions/${hereId}`,
    undefined,
    undefined,
  );
};

export const attractionsService = {
  getAttractionById,
  getHerePlaceByAttractionId,
  getAttractionsByParam,
  postNewAttraction,
};
