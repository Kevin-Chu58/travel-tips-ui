// This file includes all types that are UI-related which are not directly related with API requests

import type { JSX } from "react";
import type { MapRouteType } from "./Maps";
import type { Dayjs } from "dayjs";
import type { SxProps } from "@mui/material";

// UI
export type NavTab = {
  name: string;
  label: string;
  to?: string;
  condition?: (args: any[]) => boolean;
};

export type StringArrUpdate = {
  stringArr: string[];
  update: React.Dispatch<React.SetStateAction<string[]>>;
}; // used in map coords update, i think

export type IndicatorItem = {
  label: string;
  isIcon?: boolean;
  sx: SxProps;
};

// form

export type DayFormParams = {
  name: string | undefined;
  description: string | undefined;
  start: Dayjs | null;
  end: Dayjs | null;
};

// sorting
export type SortType = {
  label: string;
  function: (list: any[]) => any[];
};

// selecting
export type SelectType = {
  item: any;
  label: string;
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

// tao
export type TaoId = { id?: number };

export type TaoParams = TaoId & {
  order: number;
  highlightId: number;
  estimateTime: number;
  estimateTravelTime: number;
  isDrivePreferred: boolean;
  isBikePreferred: boolean;
  isOnFootPreferred: boolean;
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
  id?: string;
  label?: string;
  lat: number;
  lng: number;
  zoom: number;
};

export type MapView = {
  viewType: string;
  icon: any;
};

export type GeoCoordinate = {
  lat: number;
  lng: number;
};
