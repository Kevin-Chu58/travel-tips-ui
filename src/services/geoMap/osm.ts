import type { OsmType } from "@constants/Maps";
import http from "@services/http";

export type OsmEntity = {
  place_id: number;
  license: string;
  osm_type: OsmType;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank?: number;
  importance?: number;
  addresstype: string;
  name: string;
  display_name: string;
  extratags?: {};
  boundingBox: string[];
};

const getOsmEntitiesByName = async (search: string): Promise<OsmEntity[]> =>  {
  const encoded = encodeURIComponent(search);
  const headers = new Headers();
  headers.append("User-Agent", "TravelTips/0.1");
  return await http.get(http.apiBaseURLs.osm, `search?q=${encoded}&format=json&extratags=1`, headers);
};

export const osmService = {
  getOsmEntitiesByName,
};