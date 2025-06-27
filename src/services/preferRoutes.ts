import type { Attraction } from "./attractions";

type PreferRoutePost = {
  type: RouteType;
  departAttraction: Attraction;
  arrivalAttraction: Attraction;
  estimatedTime: number;
  linkId?: number;
};

// type PreferRoutePatch = {
//   type?: RouteType;
//   departAttraction?: Attraction;
//   arrivalAttraction?: Attraction;
//   estimatedTime?: number;
//   linkId?: number;
// };

export type PreferRoute = PreferRoutePost & {
    id: number;
    createdBy: number;
};

export type RouteType = {
    id: number;
    name: string;
};

export const preferRoutesService = {

};