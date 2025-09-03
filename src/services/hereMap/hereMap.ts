import type { AttractionV2 } from "@services/attractions";
import http from "@services/http";

export type HereRoutingResponse = {
  notices?: Notice[];
  routes?: Route[];
};

export type Notice = {
  title?: string;
  code?: string;
  severity?: string;
};

export type Route = {
  id?: string;
  notices?: Notice[];
  sections?: Section[];
};

export type Section = {
  id?: string;
  type?: string;
  preActions?: RouteAction[];
  postActions?: RouteAction[];
  actions?: RouteAction[];
  departure?: RouteEvent;
  arrival?: RouteEvent;
  summary?: RouteSummary;
  travelSummary?: RouteSummary;
  polyline?: string;
  notices?: Notice[];
  transport?: RouteTransport;
  intermediateStops?: RouteIntermediateStop[];
  agency?: RouteAgency;
  routeAttributions?: RouteAttribution[];
  routeIncidents?: RouteIncident[];
};

export type RouteAction = {
  action?: string;
  duration: number;
  instruction?: string;
  offset: number;
  direction?: string;
};

export type RouteEvent = {
  time?: string;
  place?: RoutePlace;
};

export type RoutePlace = {
  type?: string;
  location?: RouteLocation;
  delay?: number;
  status?: string;
};

export type RouteLocation = {
  lat: number;
  lng: number;
};

export type RouteSummary = {
  duration: number;
  length: number;
};

export type RouteTransport = {
  mode?: string;
  name?: string;
  headsign?: string;
  category?: string;
  color?: string;
  textColor?: string;
  wheelchairAccessible?: string;
};

export type RouteIntermediateStop = {
  departure?: RouteEvent;
};

export type RouteAgency = {
  id?: string;
  name?: string;
  website?: string;
};

export type RouteAttribution = {
  id?: string;
  text?: string;
};

export type RouteIncident = {
  summary?: string;
  description?: string;
  type?: string;
};

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

const getRoutingByTaoId = async (
  taoId: number,
): Promise<HereRoutingResponse | null> => {
  return await http.get(
    http.apiBaseURLs.api,
    `hereMap/routing/${taoId}`,
    undefined,
    undefined,
  );
};

const getRoutingsOnDay = async (
  dayId: number
): Promise<HereRoutingResponse[]> => {

  return await http.get(
    http.apiBaseURLs.api,
    `hereMap/routing/day/${dayId}`,
    undefined,
    undefined
  );
};

export const hereMapService = {
  searchPlaceByName,
  getRoutingByTaoId,
  getRoutingsOnDay,
};
