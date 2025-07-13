import http from "./http";
import type { UserBasic } from "./users";

export const getDefaultHighlight = (attractionId: number) => {
  return {
    id: 0,
    attractionId: attractionId,
    description: "",
  } as Highlight;
};

export type HighlightPost = {
  attractionId: number;
  description?: string;
  linkId?: number;
};

export type Highlight = HighlightPost & {
  id: number;
  isDeprecated: boolean;
  createdBy?: UserBasic;
}

const getHighlightsByAttractionId = async (
  id: number,
  userId?: number
): Promise<Highlight[]> => {
  const params = new URLSearchParams();

  if (userId) params.set("userId", userId.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `highlights/${id}?${params.toString()}`,
    undefined,
    undefined
  );
};

const postHighlight = async (
  newHighlight: HighlightPost,
  token: string,
): Promise<Highlight> => {
  const body = JSON.stringify(newHighlight);

  return await http.post(
    http.apiBaseURLs.api,
    "highlights",
    body,
    undefined,
    token,
  )
};

const patchHighlight = async (
  id: number,
  description: string,
  token: string
): Promise<Highlight> => {
  const body = JSON.stringify(description);

  return await http.patch(
    http.apiBaseURLs.api,
    `highlights/${id}`,
    body,
    undefined,
    token
  );
};

const deleteHighlight = async (
  id: number,
  token: string,
): Promise<Highlight> => {
  return await http.del(
    http.apiBaseURLs.api,
    `highlights/${id}`,
    undefined,
    undefined,
    token,
  );
};

export const highlightsService = {
  getHighlightsByAttractionId,
  postHighlight,
  patchHighlight,
  deleteHighlight,
};
