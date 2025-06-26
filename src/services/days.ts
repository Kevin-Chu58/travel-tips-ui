import type { Attraction } from "./attractions";
import http from "./http";
import type { PreferRoute } from "./preferRoutes";

type DayPost = {
  name?: string;
  description?: string;
  start: string;
  end: string;
  tripId: number;
};

type DayPatch = {
  name?: string;
  description?: string;
  start?: string;
  end?: string;
};

export type Day = DayPost & {
    id: number;
    isOverNight: boolean;
    tripAttractionOrders?: TripAttractionOrder[];
};

type TripAttractionOrderBasic = {
    dayId: number;
    order: number;
    estimateTime: number;
    estimateTravelTime: number;
    isDrivePreferred: boolean;
    isBikePreferred: boolean;
    isOnFootPreferred: boolean;
};

type TripAttractionOrderPost = TripAttractionOrderBasic & {
    highlightId: number;
};

type TripAttractionOrderPatch = {
    dayId?: number;
    order?: number;
    highlightId?: number;
    estimateTime?: number;
    estimateTravelTime?: number;
    isDrivePreferred?: boolean;
    isBikePreferred?: boolean;
    isOnFootPreferred?: boolean;
};

export type TripAttractionOrder = TripAttractionOrderBasic & {
    id: number;
    attraction?: Attraction;  // might be undefined so when create new Tao attraction may leaves as empty
    createdBy: number;
    preferRoutes: PreferRoute[];
};

const postNewDay = async (newDay: DayPost, token: string): Promise<Day> => {
  const body = JSON.stringify(newDay);
  return await http.post(http.apiBaseURLs.api, "days", body, undefined, token);
};

const patchDay = async (id: number, day: DayPatch, token: string): Promise<Day> => {
  const body = JSON.stringify(day);
  return await http.patch(http.apiBaseURLs.api, `days/${id}`, body, undefined, token);
};

const deleteDay = async (id: number, token: string): Promise<Day> => {
  return await http.del(http.apiBaseURLs.api, `days/${id}`, undefined, undefined, token);
};

// taos

const getTaosByDayId = async (dayId: number, token: string): Promise<TripAttractionOrder[]> => {
  return await http.get(http.apiBaseURLs.api, `tripAttractionOrders/${dayId}`, undefined, token);
};

const postNewTao = async (newTao: TripAttractionOrderPost, token: string): Promise<TripAttractionOrder[]> => {
  const body = JSON.stringify(newTao);
  return await http.post(http.apiBaseURLs.api, "tripAttractionOrders", body, undefined, token);
};

const patchTao = async (id: number, tao: TripAttractionOrderPatch, token: string): Promise<TripAttractionOrder[]> => {
  const body = JSON.stringify(tao);
  return await http.patch(http.apiBaseURLs.api, `tripAttractionOrders/${id}`, body, undefined, token);
};

// const patchTaoOrder = async (id: number, order: number, token: string): Promise<TripAttractionOrder> => {
//   const body = JSON.stringify(order);
//   return await http.patch(http.apiBaseURLs.api, `tripAttractionOrders/${id}/order`, body, undefined, token);
// };

const deleteTao = async (id: number, token: string): Promise<TripAttractionOrder> => {
  return await http.del(http.apiBaseURLs.api, `tripAttractionOrders/${id}`, undefined, undefined, token);
}

export const daysService = {
    postNewDay,
    patchDay,
    deleteDay,
    getTaosByDayId,
    postNewTao,
    patchTao,
    // patchTaoOrder,
    deleteTao,
};