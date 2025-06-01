// This file includes all types that are UI-related which are not directly related with API requests

import type { JSX } from "react";
import type { MapRouteType, OsmType } from "./Maps";
import type { Dayjs } from "dayjs";

// UI
export type NavTab = {
  name: string;
  label: string;
  to?: string;
  condition?: (args: any[]) => boolean;
};

// trip

// day
export type DayId = { id?: number };

export type DayParams = DayId & {
  name: string | undefined;
  description: string | undefined;
  start: Dayjs | null;
  end: Dayjs | null;
};

export type DayMarkers = {
  dayId: number;
  markers: Marker[];
};

// route
export type RouteOptionParams = {
  name: string;
  element: JSX.Element;
  routeType: MapRouteType;
};

export type Route = {
  coords?: [number, number][];
  distance?: number;
  duration?: number;
};

export type TaoRoutes = {
  taoId: number;
  driving?: Route;
  cycling?: Route;
  walking?: Route;
  custom?: Route;
};

export type DayRoutes = {
  dayId: number;
  taos: TaoRoutes[];
};

export type RouteRoutes = DayRoutes[];

// map
export type Marker = {
  lat: number;
  lng: number;
  label?: string;
  osmId: number;
  osmType: OsmType;
  zoom?: number;
};

export type OsmFocusState = {
  id: number | undefined;
  type: OsmType | undefined;
};

export type MapView = {
  viewType: string;
  icon: any;
};
