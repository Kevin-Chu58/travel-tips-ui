import type { OsmType } from "@constants/Maps";
import http from "./http";

// v2

type AttractionV2Basic = {
  osmId: number;
  osmType: OsmType;
  lng: number;
  lat: number;
  name: string;
  address: string;
};

export type AttractionV2 = AttractionV2Basic & {
  id: number;
};

// v1

type AttractionBasic = {
  // attractions
  osmId: number;
  osmType: OsmType;
  lng: number;
  lat: number;
  name: string;
  address: string;
};

type AttractionPost = AttractionBasic & {
  // highlights
  description?: string;
  linkId?: number;
};

export type AttractionPatch = AttractionBasic & {
  // highlights
  description?: string;
  linkId?: string;
};

export type Attraction = AttractionPost & {
  // might be attraction id or highlight id, depends on the routes
  id: number;
  // highlights
  createdBy?: number;
  isDeprecated?: boolean;
};

export type AttractionSearch = {
  timestamp: number;
  attractions: Attraction[];
};

export type Highlight = {
  id: number;
  attractionId: number;
  isDeprecated: boolean;
  description?: string;
  createdBy?: number;
  linkId?: number;
};

export type AttractionHighlights = AttractionBasic & {
  id: number;
  highlights: Highlight[];
};

const getAttractionById = async (id: number): Promise<AttractionV2> => {
  return await http.get(http.apiBaseURLs.api, `attractions/v2/${id}`, undefined, undefined);
};

const getHighlightsByParams = async (name?: string, osmId?: number): Promise<AttractionSearch> => {
  const params = new URLSearchParams();

  if (name) params.set("name", name);
  if (osmId) params.set("osmId", osmId.toString());
  params.set("timestamp", Date.now().toString());

  return await http.get(http.apiBaseURLs.api, `attractions?${params.toString()}`, undefined, undefined);
};

const getAttractionHighlightsByUserId = async (userId: number): Promise<AttractionHighlights[]> => {
  return await http.get(http.apiBaseURLs.api, `attractions/${userId}`, undefined, undefined);
};

const postNewHighlight = async (newAttraction: AttractionPost, token: string): Promise<Attraction> => {
  const body = JSON.stringify(newAttraction);
  return await http.post(http.apiBaseURLs.api, "attractions", body, undefined, token);
};

const patchHighlight = async (id: number, attraction: AttractionPatch, token: string) : Promise<Attraction> => {
  const body = JSON.stringify(attraction);
  return await http.patch(http.apiBaseURLs.api, `attractions/${id}`, body, undefined, token);
};

const deleteHighlights = async (ids: number[], token: string): Promise<number[]> => {
  const body = JSON.stringify(ids);
  return await http.del(http.apiBaseURLs.api, "attractions", body, undefined, token);
};

export const attractionsService = {
  getAttractionById,
  getHighlightsByParams,
  getAttractionHighlightsByUserId,
  postNewHighlight,
  patchHighlight,
  deleteHighlights,
};