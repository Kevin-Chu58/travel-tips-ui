import type { Attraction } from "@services/attractions";
import http from "@services/http";

export interface HerePlace {
  title: string;
  id: string;
  resultType: string;
  address: HereAddress;
  position: HerePosition;
  access?: HerePosition[];
  distance?: number;
  categories?: HereCategory[];
  references?: HereReference[];
  contacts?: HereContact[];
  openingHours?: HereOpeningHours[];
  foodTypes?: HereFoodTypes[];
}

export interface HereAddress {
  label: string;
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  state?: string;
  county?: string;
  city?: string;
  district?: string;
  street?: string;
  postalCode?: string;
  houseNumber?: string;
}

export interface HerePosition {
  lat: number;
  lng: number;
}

export interface HereCategory {
  id: string;
  name: string;
  primary?: boolean;
}

export interface HereReference {
  supplier?: HereSupplier;
  id: string;
}

export interface HereSupplier {
  id: string;  // "core", "tripadvisor", "yelp", etc.
}

export interface HereContact {
  phone?: HereValue[];
  www?: HereValue[];
}

export interface HereOpeningHours {
  text?: string[];
}

export interface HereFoodTypes {
  id: string;
  name: string;
  primary?: boolean;
}

export interface HereValue {
  value: string;
}

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

const getSuggestionByName = async (input: string): Promise<string[]> => {
  const params = new URLSearchParams();
  params.set("input", input.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `hereMap/suggestion?${params.toString()}`
  );
};

const searchPlaceByName = async (
  query: string,
  lat: number,
  lng: number,
  limit?: number
): Promise<Attraction[]> => {
  const params = new URLSearchParams();

  params.set("query", query.toString());
  params.set("lat", lat.toString());
  params.set("lng", lng.toString());
  if (limit) params.set("limit", limit.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `hereMap/discover?${params.toString()}`,
    undefined
  );
};

const getRoutingByTaoId = async (
  taoId: number
): Promise<HereRoutingResponse | null> => {
  return await http.get(
    http.apiBaseURLs.api,
    `hereMap/routing/${taoId}`,
    undefined
  );
};

const getRoutingsOnDay = async (
  dayId: number
): Promise<HereRoutingResponse[]> => {
  return await http.get(
    http.apiBaseURLs.api,
    `hereMap/routing/day/${dayId}`,
    undefined
  );
};

export const hereMapService = {
  getSuggestionByName,
  searchPlaceByName,
  getRoutingByTaoId,
  getRoutingsOnDay,
};
