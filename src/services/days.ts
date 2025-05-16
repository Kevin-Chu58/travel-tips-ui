import http from "./http";

type DayPost = {
  name?: string;
  description?: string;
  start: string;
  end: string;
  tripId: number;
}

type DayPatch = {
  name?: string;
  description?: string;
  start?: string;
  end?: string;
}

export type Day = DayPost & {
    id: number;
    isOverNight: boolean;
    tripAttractionOrderCount?: number;
    tripAttractionOrder?: TripAttractionOrder[];
};

type TripAttractionOrderPost = {
    dayId: number;
    order: number;
    attractionId: number;
    estimateTime: number;
    isDrivePreferred: boolean;
    isBikePreferred: boolean;
    isOnFootPreferred: boolean;
}

type TripAttractionOrderPatch = {
    dayId?: number;
    attractionId?: number;
    estimateTime?: number;
    isDrivePreferred?: boolean;
    isBikePreferred?: boolean;
    isOnFootPreferred?: boolean;
}

export type TripAttractionOrder = TripAttractionOrderPost & {
    id: number;
    createdBy: number;
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

const postNewDay = async (newDay: DayPost, token: string): Promise<Day> => {
  const body = JSON.stringify(newDay);
  return await http.post(http.apiBaseURLs.api, "days", body, undefined, token);
}

const patchDay = async (id: number, day: DayPatch, token: string): Promise<Day> => {
  const body = JSON.stringify(day);
  return await http.patch(http.apiBaseURLs.api, `days/${id}`, body, undefined, token);
}

const deleteDay = async (id: number, token: string): Promise<Day> => {
  return await http.del(http.apiBaseURLs.api, `days/${id}`, undefined, undefined, token);
}

// taos

const postNewTao = async (newTao: TripAttractionOrderPost, token: string): Promise<TripAttractionOrder> => {
  const body = JSON.stringify(newTao);
  return await http.post(http.apiBaseURLs.api, "tripAttractionOrders", body, undefined, token);
}

const patchTao = async (id: number, tao: TripAttractionOrderPatch, token: string): Promise<TripAttractionOrder> => {
  const body = JSON.stringify(tao);
  return await http.patch(http.apiBaseURLs.api, `tripAttractionOrders/${id}`, body, undefined, token);
}

const patchTaoOrder = async (id: number, order: number, token: string): Promise<TripAttractionOrder> => {
  const body = JSON.stringify(order);
  return await http.patch(http.apiBaseURLs.api, `tripAttractionOrders/${id}/order`, body, undefined, token);
}

export const daysService = {
    postNewDay,
    patchDay,
    deleteDay,
    postNewTao,
    patchTao,
    patchTaoOrder,
};