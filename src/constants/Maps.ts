import markerIconGrey from "@assets/map/marker-icon-grey.png";
import markerIconBlue from "@assets/map/marker-icon-blue.png";
import markerIconGreen from "@assets/map/marker-icon-green.png";
import markerIconGold from "@assets/map/marker-icon-gold.png";
import markerIconOrange from "@assets/map/marker-icon-orange.png";
import markerShadow from "@assets/map/marker-shadow.png";
import L from "leaflet";

export type Direction = "N" | "E" | "S" | "W";

export type LRSide = "left" | "right";

export type OsmType = "node" | "way" | "relation";

export type OsrmRouteType = "driving" | "walking" | "cycling";

export type MapRouteType = OsrmRouteType | "custom";

export const OsmTypes: Record<OsmType, string> = {
  node: "location",
  way: "area",
  relation: "region",
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

// different color markers
// ref: https://github.com/pointhi/leaflet-color-markers

export const GreyIcon = new L.Icon({
  iconUrl: markerIconGrey,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const BlueIcon = new L.Icon({
  iconUrl: markerIconBlue,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const GreenIcon = new L.Icon({
  iconUrl: markerIconGreen,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const GoldIcon = new L.Icon({
  iconUrl: markerIconGold,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const OrangeIcon = new L.Icon({
  iconUrl: markerIconOrange,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
