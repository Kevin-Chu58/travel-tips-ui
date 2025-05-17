import http from "./http";

type AttractionPost = {
  name: string;
  description?: string;
  address: string;
  osmId: number;
  linkId?: number;
};

type AttractionPatch = {
  name?: string;
  description?: string;
  address?: string;
  osmId?: string;
  linkId?: string;
};

export type Attraction = AttractionPost & {
  id: number;
  createdBy?: number;
};

export type AttractionSearch = {
  timestamp: number;
  attractions: Attraction[];
};

const getAttractionsByParams = async (name: string, osmId: number): Promise<AttractionSearch> => {
  const params = new URLSearchParams({
    name: name,
    osmId: osmId.toString(),
    timestamp: Date.now().toString(),
  }).toString();

  return await http.get(http.apiBaseURLs.api, `attractions?${params}`, undefined, undefined);
};

const postNewAttraction = async (newAttraction: AttractionPost, token: string): Promise<Attraction> => {
  const body = JSON.stringify(newAttraction);
  return await http.post(http.apiBaseURLs.api, "attractions", body, undefined, token);
};

const patchAttraction = async (id: number, attraction: AttractionPatch, token: string) : Promise<Attraction> => {
  const body = JSON.stringify(attraction);
  return await http.patch(http.apiBaseURLs.api, `attractions/${id}`, body, undefined, token);
}

export const attractionsService = {
  getAttractionsByParams,
  postNewAttraction,
  patchAttraction,
};