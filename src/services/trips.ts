import http from "@services/http";
import type { UserBasic } from "./users";
import type { Image, ImageRelation } from "./images";

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
};

const getTripsByTitle = async (title: string): Promise<Trip[]> => {
  const params = new URLSearchParams({ title: title });
  return await http.get(http.apiBaseURLs.api, `trips?${params.toString()}`);
};

const getMyTrips = async (token: string): Promise<Trip[]> => {
  return await http.get(http.apiBaseURLs.api, "trips/my", undefined, token);
};

const getMyTripById = async (id: number, token: string): Promise<Trip> => {
  return await http.get(
    http.apiBaseURLs.api,
    `trips/my/${id}`,
    undefined,
    token
  );
};

const getImagesByTripId = (id: number, token?: string): Promise<Image[]> => {
  return http.get(http.apiBaseURLs.api, `trips/${id}/images`, undefined, token);
};

const postNewTrip = async (name: string, token: string): Promise<Trip> => {
  return await http.post(
    http.apiBaseURLs.api,
    `trips/${name}`,
    undefined,
    undefined,
    token
  );
};

const patchTrip = async (
  id: number,
  trip: TripPatch,
  token: string
): Promise<TripPatch> => {
  const body = JSON.stringify(trip);
  return await http.patch(
    http.apiBaseURLs.api,
    `trips/${id}`,
    body,
    undefined,
    token
  );
};

const patchTripIsPublic = async (
  ids: number[],
  isPublic: boolean,
  token: string
): Promise<number[]> => {
  const body = JSON.stringify(ids);
  return await http.patch(
    http.apiBaseURLs.api,
    `trips/isPublic/${isPublic}`,
    body,
    undefined,
    token
  );
};

const patchTripIsHidden = async (
  ids: number[],
  isHidden: boolean,
  token: string
): Promise<number[]> => {
  const body = JSON.stringify(ids);
  return await http.patch(
    http.apiBaseURLs.api,
    `trips/isHidden/${isHidden}`,
    body,
    undefined,
    token
  );
};

// image

const postTripImage = async (
  tripId: number,
  imageId: number,
  token: string
): Promise<ImageRelation> => {
  return await http.post(
    http.apiBaseURLs.api,
    `trips/${tripId}/image/${imageId}`,
    undefined,
    undefined,
    token
  );
};

const deleteTripImage = async (
  tripId: number,
  imageId: number,
  token: string
): Promise<ImageRelation> => {
  return await http.del(
    http.apiBaseURLs.api,
    `trips/${tripId}/image/${imageId}`,
    undefined,
    undefined,
    token
  );
};

export const tripsService = {
  getTripsByTitle,
  getMyTrips,
  getMyTripById,
  getImagesByTripId,
  postNewTrip,
  patchTrip,
  patchTripIsPublic,
  patchTripIsHidden,
  // image
  postTripImage,
  deleteTripImage,
};
