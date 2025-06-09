import http from "@services/http";
import type { Day } from "./days";

export type TripPost = {
    name: string;
    description?: string;
}

export type TripPatch = {
    name?: string;
    description?: string;
}

export type Trip = TripPost & {
    id: number;
    createdBy: number;
    createdAt: Date;
    lastUpdatedAt: Date;
    numDays?: number;
    isPublic: boolean;
};

export type TripDetail = TripPost &  {
    id: number;
    createdBy: number;
    createdAt: Date;
    lastUpdatedAt: Date;
    days?: Day[];
};

const getTripsByName = async (name: string): Promise<Trip[]> => {
    const params = new URLSearchParams({name: name})
    return await http.get(http.apiBaseURLs.api, `trips?${params.toString()}`);
}

const getTripDetailById = async (id: number): Promise<TripDetail> => {
    return await http.get(http.apiBaseURLs.api, `trips/${id}`);
}

const getMyTrips = async (token: string): Promise<Trip[]> => {
    return await http.get(http.apiBaseURLs.api, 'trips/my', undefined, token);
}

const getMyTripById = async (id: number, token: string): Promise<TripDetail> => {
    return await http.get(http.apiBaseURLs.api, `trips/my/${id}`, undefined, token);
}

const postNewTrip = async (newTrip: TripPost, token: string): Promise<Trip> => {
    const body = JSON.stringify(newTrip);
    return await http.post(http.apiBaseURLs.api, "trips", body, undefined, token);
}

const patchTrip = async (id: number, trip: TripPatch, token: string): Promise<Trip> => {
    const body = JSON.stringify(trip);
    return await http.patch(http.apiBaseURLs.api, `trips/${id}`, body, undefined, token);
}

const patchTripIsPublic = async (ids: number[], isPublic: boolean, token: string): Promise<number[]> => {
    const body = JSON.stringify(ids);
    return await http.patch(http.apiBaseURLs.api, `trips/isPublic/${isPublic}`, body, undefined, token);
}

const hideTrip = async (id: number, token: string): Promise<Trip> => {
    const body = JSON.stringify(true);
    return await http.patch(http.apiBaseURLs.api, `trips/${id}/isHidden`, body, undefined, token);
}

export const tripsService = {
    getTripsByName,
    getTripDetailById,
    getMyTrips,
    getMyTripById,
    postNewTrip,
    patchTrip,
    patchTripIsPublic,
    hideTrip,
};