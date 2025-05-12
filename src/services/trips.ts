import http from "@services/http";

export type Trip = {
    id: number;
    name: string;
    description?: string;
    createdBy: number;
    createdAt: Date;
    lastUpdatedAt: Date;
    numDays?: number;
};

export type TripDetail = {
    id: number;
    name: string;
    description?: string;
    createdBy: number;
    createdAt: Date;
    lastUpdatedAt: Date;
    days?: Day[];
};

type Day = {
    id: number;
    name?: string;
    description?: string;
    start: string;
    end: string;
    isOverNight: boolean;
    tripId: number;
    tripAttractionOrderCount?: number;
    tripAttractionOrder?: TripAttractionOrder[];
};

type TripAttractionOrder = {
    id: number;
    dayId: number;
    order: number;
    attractionId: number;
    estimateTime: number;
    createdBy: number;
    isDrivePreferred: boolean;
    isBikePreferred: boolean;
    isOnFootPreferred: boolean;
    preferRoutes: PreferRoute[];
};

type PreferRoute = {
    id: number;
    type: RouteType;
    departOsmId: number;
    arrivalOsmId: number;
    estimateTime: number;
    linkId?: number;
    createdBy: number;
};

type RouteType = {
    id: number;
    name: string;
};

const getTripsByName = async (name: string): Promise<Trip[]> => {
    const params = new URLSearchParams({name: name})
    return await http.get(http.apiBaseURLs.api, `trips?${params.toString()}`);
}

const getTripDetailById = async (id: number): Promise<TripDetail> => {
    return await http.get(http.apiBaseURLs.api, `trips/${id}`);
}

export const tripsService = {
    getTripsByName,
    getTripDetailById,
};