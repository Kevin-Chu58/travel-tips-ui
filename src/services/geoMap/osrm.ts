import type { LRSide, OsrmCode, OsrmRouteType } from "@constants/Maps"
import http from "@services/http";

export type OsrmRoute = {
  code: OsrmCode;
  routes: {
    distance: number;
    duration: number;
    geometry: string;
    // legs: {
    //   steps: {
    //     intersactions: {
    //       in?: number;
    //       out?: number;
    //       entry: boolean[];
    //       bearings: number[];
    //       location: number[];
    //     }[],
    //     driving_side?: LRSide;
    //     geometry: string;
    //     maneuver: {
    //       bearing_after: number;
    //       bearing_before: number;
    //       location: number[];
    //       modifier: string;
    //       type: string;
    //     },
    //     name: string;
    //     mode: string;
    //     weight: number;
    //     duration: number;
    //     distance: number;
    //   }[],
    //   summary: string;
    //   weight: number;
    //   duration: number;
    //   distance: number;
    // }[],
  }[],
  waypoints: {
    hint: string;
    location: number[];
    name: string;
    distance: number;
  }[],
};

const getOsrmRoute = async (type: OsrmRouteType, lngLats: number[][], steps: boolean = true): Promise<OsrmRoute> => {
  const lngLatString = lngLats.map((lngLat) => [lngLat.join(",")]).join(";");
  // mapbox routing
  // return await http.get(http.apiBaseURLs.mapbox, `${type}/${lngLatString}?access_token=${http.apiTokens.mapbox}`);
  // osrm routing - don't use, public server only has driving profile, no cycling and walking, have to setup server myself
  return await http.get(http.apiBaseURLs.osrm, `${type}/${lngLatString}?steps=${steps}&overview=full`);
};

export const osrmService = {
  getOsrmRoute,
};