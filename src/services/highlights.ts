import http from "./http";

export type Highlight = {
  id: number;
  attractionId: number;
  isDeprecated: boolean;
  description?: string;
  createdBy?: number;
  linkId?: number;
};

const getHighlightsByAttractionId = async (id: number, userId?: number): Promise<Highlight[]> => {
  const params = new URLSearchParams();

  if (userId) params.set("userId", userId.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `highlights/${id}?${params.toString()}`,
    undefined,
    undefined
  );
};

export const highlightsService = {
  getHighlightsByAttractionId,
};
