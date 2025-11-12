import http from "@services/http";

export type WikiImage = {
  title: string;
  url: string;
  author: string;
  license: string;
};

const getWikiImagesByAttractionId = async (
  attractionId: number
): Promise<WikiImage[]> => {
  return await http.get(
    http.apiBaseURLs.api,
    `wikiCommons/${attractionId}`,
    undefined
  );
};

export const wikiCommonsService = {
  getWikiImagesByAttractionId,
};
