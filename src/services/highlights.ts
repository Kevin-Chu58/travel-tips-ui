import type { HighlightOrderByEnum } from "@constants/Types";
import http, { type SearchResults } from "./http";
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
  description: string;
};

export type HighlightPatch = {
  description: string;
};

export type Highlight = HighlightPost & {
  id: number;
  isDeprecated: boolean;
  createdBy?: UserBasic;
  usageCount: number;
};

export type HighlightSearchParams = {
  attractionId?: number;
  createdByAuthId?: string;
  cursor?: string;
  highlightOrderByEnum?: HighlightOrderByEnum;
};

const getHighlightsByParams = async (
  params: HighlightSearchParams
): Promise<SearchResults<Highlight>> => {
  const _params = new URLSearchParams();

  if (params.attractionId)
    _params.set("attractionId", params.attractionId.toString());
  if (params.createdByAuthId)
    _params.set("createdByAuthId", params.createdByAuthId);
  if (params.cursor) _params.set("cursor", params.cursor);
  if (params.highlightOrderByEnum)
    _params.set("highlightOrderByEnum", params.highlightOrderByEnum);

  return await http.get(
    http.apiBaseURLs.api,
    `highlights?${_params.toString()}`,
    undefined
  );
};

const postHighlight = async (
  newHighlight: HighlightPost
): Promise<Highlight> => {
  const body = JSON.stringify(newHighlight);

  return await http.post(http.apiBaseURLs.api, "highlights", body, undefined);
};

const patchHighlight = async (
  id: number,
  description: string
): Promise<Highlight> => {
  const highlightPatch = {
    description: description,
  } as HighlightPatch;

  const body = JSON.stringify(highlightPatch);

  return await http.patch(
    http.apiBaseURLs.api,
    `highlights/${id}`,
    body,
    undefined
  );
};

const deleteHighlight = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `highlights/${id}`,
    undefined,
    undefined
  );
};

export const highlightsService = {
  getHighlightsByParams,
  postHighlight,
  patchHighlight,
  deleteHighlight,
};
