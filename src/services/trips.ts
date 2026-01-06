import http from "@services/http";
import type { UserBasic } from "./users";
import type { Image, ImageRelation } from "./images";
import type { TaoGeo } from "./taos";
import type { RegionComplete } from "./search/regions";

export type TripPost = {
  title: string;
  description?: string;
};

export type TripPatch = {
  title?: string;
  description?: string;
};

export type Trip = TripPost & {
  id: number;
  createdBy: UserBasic;
  createdAt: Date;
  numDays?: number;
  isPublic: boolean;
  region?: RegionComplete;
  budget?: number;
  images?: Image[];
};

const getTripsByTitle = async (title: string): Promise<Trip[]> => {
  const params = new URLSearchParams({ title: title });
  return await http.get(http.apiBaseURLs.api, `trips?${params.toString()}`);
};

const getMyTrips = async (): Promise<Trip[]> => {
  return await http.get(http.apiBaseURLs.api, "trips/my", undefined);
};

const getTripById = async (id: number): Promise<Trip> => {
  return await http.get(http.apiBaseURLs.api, `trips/${id}`, undefined);
};

const getTripTaoGeosById = async (id: number): Promise<TaoGeo[]> => {
  return await http.get(http.apiBaseURLs.api, `trips/${id}/day-overview`);
};

const getImagesByTripId = (id: number): Promise<Image[]> => {
  return http.get(http.apiBaseURLs.api, `trips/${id}/images`, undefined);
};

const postNewTrip = async (name: string): Promise<Trip> => {
  return await http.post(
    http.apiBaseURLs.api,
    `trips/${name}`,
    undefined,
    undefined
  );
};

const patchTrip = async (id: number, trip: TripPatch): Promise<TripPatch> => {
  const body = JSON.stringify(trip);
  return await http.patch(http.apiBaseURLs.api, `trips/${id}`, body, undefined);
};

const patchTripIsPublic = async (
  ids: number[],
  isPublic: boolean
): Promise<number[]> => {
  const body = JSON.stringify(ids);
  return await http.patch(
    http.apiBaseURLs.api,
    `trips/isPublic/${isPublic}`,
    body,
    undefined
  );
};

const patchTripIsHidden = async (
  ids: number[],
  isHidden: boolean
): Promise<number[]> => {
  const body = JSON.stringify(ids);
  return await http.patch(
    http.apiBaseURLs.api,
    `trips/isHidden/${isHidden}`,
    body,
    undefined
  );
};

// tags

const patchTripRegionTag = async (id: number, regionId?: number) => {
  const body = JSON.stringify(regionId);

  return await http.patch(
    http.apiBaseURLs.api,
    `trips/${id}/region`,
    body,
    undefined
  );
};

const patchTripBudgetTag = async (id: number, budget?: number) => {
  const body = JSON.stringify(budget);

  return await http.patch(
    http.apiBaseURLs.api,
    `trips/${id}/budget`,
    body,
    undefined
  );
};

// image

const postTripImage = async (
  tripId: number,
  imageId: number
): Promise<Image> => {
  return await http.post(
    http.apiBaseURLs.api,
    `trips/${tripId}/image/${imageId}`,
    undefined,
    undefined
  );
};

const deleteTripImage = async (
  tripId: number,
  imageId: number
): Promise<ImageRelation> => {
  return await http.del(
    http.apiBaseURLs.api,
    `trips/${tripId}/image/${imageId}`,
    undefined,
    undefined
  );
};

export const tripsService = {
  getTripsByTitle,
  getMyTrips,
  getTripById,
  getTripTaoGeosById,
  getImagesByTripId,
  postNewTrip,
  patchTrip,
  patchTripIsPublic,
  patchTripIsHidden,
  //tags
  patchTripRegionTag,
  patchTripBudgetTag,
  // image
  postTripImage,
  deleteTripImage,
};
