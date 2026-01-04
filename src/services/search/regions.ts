import http from "@services/http";

type RegionType = "Continent" | "Country" | "State" | "Area";

export type Region = {
  id: number;
  name: string;
  slug: string;
  parentRegionId: number;
  type: RegionType;
};

export type RegionComplete = {
  continent?: Region;
  country?: Region;
  state?: Region;
  area?: Region;
};

interface RegionSearchParams {
  type: RegionType;
  name?: string;
  parentRegionId?: number;
}

const browse = async (params: RegionSearchParams) => {
  const searchParams = new URLSearchParams();

  if (params.type) searchParams.set("type", params.type);
  if (params.name) searchParams.set("name", params.name);
  if (params.parentRegionId)
    searchParams.set("parentRegionId", params.parentRegionId.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `regions/browse?${searchParams.toString()}`,
    undefined
  );
};

export const regionsService = {
  browse,
};
