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
  name?: string;
  display_name: string;
  extratags?: {};
  boundingBox: string[];
};

const getOsmEntitiesByName = async (
  search: string,
  token: string
): Promise<OsmEntity[]> => {
  return await http.get(
    http.apiBaseURLs.api,
    `nominatim/${search}`,
    undefined,
    token
  );
};

export const nominatimService = {
  getOsmEntitiesByName,
};
