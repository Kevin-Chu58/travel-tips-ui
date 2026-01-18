import http, { type SearchResult } from "@services/http";
import type { UserBasic, UserSimple } from "./users";
import type { Image, ImageRelation } from "./images";
import type { TaoGeo } from "./taos";
import type { RegionComplete } from "./search/regions";

export type TripPost = {
  title: string;
};

export type TripPatch = {
  title?: string;
  description?: string;
};

export type Trip = TripPost & {
  id: number;
  description?: string;
  createdBy: UserBasic;
  createdAt: Date;
  numDays?: number;
  isPublic: boolean;
  isHidden: boolean;
  region?: RegionComplete;
  budget?: number;
  images?: Image[];
  sharedUsers: UserSimple[];
};

export type tripSearchParams = {
  title?: string;
  createdBy?: number;
  countrySlug?: string;
  stateSlug?: string;
  budget?: number;
  cursor?: string;
  isDesc?: boolean;
};

const getTripsByParams = async (
  tripSearchParams: tripSearchParams
): Promise<SearchResult<Trip>> => {
  const params = new URLSearchParams();
  
  if (tripSearchParams.title) params.append("title", tripSearchParams.title);
  if (tripSearchParams.createdBy)
    params.append("createdBy", tripSearchParams.createdBy.toString());
  if (tripSearchParams.countrySlug)
    params.append("countrySlug", tripSearchParams.countrySlug);
  if (tripSearchParams.stateSlug)
    params.append("stateSlug", tripSearchParams.stateSlug);
  if (tripSearchParams.budget)
    params.append("budget", tripSearchParams.budget.toString());
  if (tripSearchParams.cursor) params.append("cursor", tripSearchParams.cursor);
  if (tripSearchParams.isDesc)
    params.append("isDesc", tripSearchParams.isDesc.toString());

  return await http.get(http.apiBaseURLs.api, `trips?${params.toString()}`);
};

const getMyTrips = async (): Promise<Trip[]> => {
  return await http.get(http.apiBaseURLs.api, "trips/my", undefined);
};

const getMyHiddenTrips = async (): Promise<Trip[]> => {
  return await http.get(http.apiBaseURLs.api, "trips/my/hidden", undefined);
};

const getSharedTrips = async (): Promise<Trip[]> => {
  return await http.get(http.apiBaseURLs.api, "trips/my/shared", undefined);
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

const postNewTrip = async (title: string): Promise<Trip> => {
  const tripPost = {
    title: title,
  } as TripPost;

  const body = JSON.stringify(tripPost);

  return await http.post(http.apiBaseURLs.api, "trips", body, undefined);
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

// trip shares

const getSharedUsersByTripId = async (id: number): Promise<UserSimple[]> => {
  return await http.get(http.apiBaseURLs.api, `trips/${id}/share`, undefined);
};

const shareTripWithUser = async (
  id: number,
  userId: string
): Promise<UserSimple> => {
  return await http.post(
    http.apiBaseURLs.api,
    `trips/${id}/share/${userId}`,
    undefined,
    undefined
  );
};

const unshareTripWithUser = async (
  id: number,
  userId: string
): Promise<UserSimple> => {
  return await http.del(
    http.apiBaseURLs.api,
    `trips/${id}/unshare/${userId}`,
    undefined,
    undefined
  );
};

const unshareTripWithAll = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `trips/${id}/unshare`,
    undefined,
    undefined
  );
};

// tags

const patchTripRegionTag = async (
  id: number,
  regionId?: number
): Promise<RegionComplete> => {
  const body = JSON.stringify(regionId);

  return await http.patch(
    http.apiBaseURLs.api,
    `trips/${id}/region`,
    body,
    undefined
  );
};

const patchTripBudgetTag = async (
  id: number,
  budget?: number
): Promise<number> => {
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
  getTripsByParams,
  getMyTrips,
  getMyHiddenTrips,
  getSharedTrips, // get trips shared with me
  getTripById,
  getTripTaoGeosById,
  getImagesByTripId,
  postNewTrip,
  patchTrip,
  patchTripIsPublic,
  patchTripIsHidden,
  // trip shares
  getSharedUsersByTripId,
  shareTripWithUser,
  unshareTripWithUser,
  unshareTripWithAll,
  //tags
  patchTripRegionTag,
  patchTripBudgetTag,
  // image
  postTripImage,
  deleteTripImage,
};
