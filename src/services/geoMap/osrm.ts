import type { LRSide, OsrmCode, OsrmRouteType } from "@constants/Maps"
import http from "@services/http";

export type osrmRoute = {
  code: OsrmCode;
  routes: {
    legs: {
      steps: {
        intersactions: {
          in?: number;
          out?: number;
          entry: boolean[];
          bearings: number[];
          location: number[];
        }[],
        driving_side?: LRSide;
        geometry: string;
        maneuver: {
          bearing_after: number;
          bearing_before: number;
          location: number[];
          modifier: string;
          type: string;
        },
        name: string;
        mode: string;
        weight: number;
        duration: number;
        distance: number;
      }[],
      summary: string;
      weight: number;
      duration: number;
      distance: number;
    }[],
  }[],
  waypoints: {
    hint: string;
    location: number[];
    name: string;
    distance: number;
  }[],
};

const getOsrmRoute = async (type: OsrmRouteType, lngLats: number[][], steps: boolean = true): Promise<osrmRoute> => {
  const lngLatString = lngLats.map((lngLat) => [lngLat.join(",")]).join(";");
  return await http.get(http.apiBaseURLs.osrm, `${type}/${lngLatString}?steps=${steps}`);
};

export const osrmService = {
  getOsrmRoute,
};