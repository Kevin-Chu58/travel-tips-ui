// This file includes all types that are UI-related which are not directly related with API requests

import type { JSX } from "react";
import type { Dayjs } from "dayjs";
import type { SvgIconProps, SxProps } from "@mui/material";

// UI
export type WorkshopRoute = {
  name: string;
  path: string;
  index?: boolean;
  element: JSX.Element;
  tool: JSX.Element;
  addForm?: JSX.Element;
};

export type SubNavTab = {
  name: string;
  label: string;
  icon?: JSX.Element;
  note?: string;
  to?: string;
};

export type NavTab = {
  name: string;
  label: string;
  to?: string;
  subs?: SubNavTab[];
  condition?: (args: any[]) => boolean;
  deletable?: boolean;
};

export type UtilityItem = {
  content: any;
  condition?: boolean; // don't show content when condition is false
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

export type ListToolButton = {
  label: string;
  icon: React.ComponentType<SvgIconProps>;
  input?: JSX.Element;
  onClick: () => void;
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

// route
export type RouteOptionParams = {
  name: string;
  element: JSX.Element;
  routeType: string;
};

export type Route = {
  polyline?: string;
  groupId?: number;
  color?: string;
};

// map
export type Marker = {
  id?: string;
  groupId?: number;
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

// labels

export const BudgetLabels: { [index: number]: string } = {
  0: "No Budget Set",
  1: "Less than $100",
  2: "Between $100 and $500",
  3: "Between $500 and $1k",
  4: "Between $1k and $2k",
  5: "More than $2k",
};
