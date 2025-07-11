export type Direction = "N" | "E" | "S" | "W";

export type LRSide = "left" | "right";

export type OsmType = "node" | "way" | "relation";

export type OsrmRouteType = "driving" | "walking" | "cycling";

export type MapRouteType = OsrmRouteType | "custom";

export const OsmTypes: Record<OsmType, string> = {
  node: "location",
  way: "area",
  relation: "complex",
};

export const OsmTypePrefixes: Record<OsmType, string> = {
  node: "N",
  way: "W",
  relation: "R",
};

export type OsrmCode =
  | "Ok"
  | "Bad Request"
  | "Not Found"
  | "Too Many Requests"
  | "Internal Server Error"
  | "Not Implemented";

export const GoogleMapLink = "https://www.google.com/maps/search/?api=1&query=";