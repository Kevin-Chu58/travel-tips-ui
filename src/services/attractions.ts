import http from "./http";

// v2

type AttractionV2Basic = {
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

export type AttractionV2 = AttractionV2Basic & {
  id: number;
};

const getAttractionById = async (id: number): Promise<AttractionV2> => {
  return await http.get(http.apiBaseURLs.api, `attractions/${id}`, undefined);
};

const getMyAttractionsByName = async (
  name?: string
): Promise<AttractionV2[]> => {
  const params = new URLSearchParams();

  if (name) params.set("name", name);

  return await http.get(
    http.apiBaseURLs.api,
    `attractions/my?${params.toString()}`,
    undefined
  );
};

const postNewAttraction = async (hereId: string): Promise<AttractionV2> => {
  return await http.post(
    http.apiBaseURLs.api,
    `attractions/${hereId}`,
    undefined,
    undefined
  );
};

export const attractionsService = {
  getAttractionById,
  getMyAttractionsByName,
  postNewAttraction,
};
