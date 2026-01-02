import type { HerePlace } from "./hereMap/hereMap";
import http from "./http";

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

const getMyAttractionsByName = async (
  name?: string
): Promise<Attraction[]> => {
  const params = new URLSearchParams();

  if (name) params.set("name", name);

  return await http.get(
    http.apiBaseURLs.api,
    `attractions/my?${params.toString()}`,
    undefined
  );
};

const postNewAttraction = async (hereId: string): Promise<Attraction> => {
  return await http.post(
    http.apiBaseURLs.api,
    `attractions/${hereId}`,
    undefined,
    undefined
  );
};

export const attractionsService = {
  getAttractionById,
  getHerePlaceByAttractionId,
  getMyAttractionsByName,
  postNewAttraction,
};
