import type { RegionComplete } from "@services/search/regions";

const getRegionAddress = (completeRegion?: RegionComplete) => {
  if (!completeRegion) return "None";

  let address: string[] = [];

  if (completeRegion.area) {
    address.push(completeRegion.area.name);
  }

  if (completeRegion.state) {
    address.push(completeRegion.state.name);
  }

  if (completeRegion.country) {
    address.push(completeRegion.country.name);
  }

  return address.join(", ");
};

const getRegionAddressBySlugs = (country?: string, state?: string) => {
  if (!country) return "None";

  let address = [country];

  if (state) {
    address.push(state);
  }

  return address.join(", ");
};

export const RegionUtils = {
  getRegionAddress,
  getRegionAddressBySlugs,
};
