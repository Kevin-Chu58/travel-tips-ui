export type Direction = "N" | "E" | "S" | "W";

export type OsmType = "node" | "way" | "relation";

export const OsmTypes: Record<OsmType, string> = {
  "node": "location",
  "way": "area",
  "relation": "complex",
};