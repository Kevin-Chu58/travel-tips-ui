import type { Attraction } from "./attractions";
import type { Highlight } from "./highlights";
import http from "./http";

export const TransportModes = ["car", "truck", "pedestrian", "public transit"];

type TaoBasic = {
  dayId: number;
  start: string;
  end: string;
};

export type TaoPost = TaoBasic & {
  attractionId: number;
  highlightId?: number;
};

export type Tao = TaoBasic & {
  id: number;
  attraction: Attraction;
  highlight?: Highlight;
  createdBy: number;
  transportMode?: string;
};

export type TaoPatch = {
  dayId?: number;
  attractionId?: number;
  highlightId?: number;
  start?: string;
  end?: string;
  transportMode?: string;
};

export type TaoGeo = {
  id: number;
  dayId: number;
  title: string;
  lat: number;
  lng: number;
}

const getTaoById = async (id: number, dayId: number): Promise<Tao> => {
  return await http.get(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${id}/day/${dayId}`,
    undefined
  );
};

const getTaosByDayId = async (dayId: number): Promise<Tao[]> => {
  return await http.get(
    http.apiBaseURLs.api,
    `tripAttractionOrders/day/${dayId}`,
    undefined
  );
};

const postTao = async (dayId: number, newTao: TaoPost): Promise<Tao> => {
  const body = JSON.stringify(newTao);
  return await http.post(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${dayId}`,
    body,
    undefined
  );
};

const patchTao = async (taoId: number, taoPatch: TaoPatch): Promise<Tao> => {
  const body = JSON.stringify(taoPatch);
  return await http.patch(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${taoId}`,
    body,
    undefined
  );
};

const patchTaoDetachHighlight = async (taoId: number): Promise<Tao> => {
  return await http.patch(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${taoId}/detach-highlight`,
    undefined,
    undefined
  );
};

const deleteTao = async (taoId: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${taoId}`,
    undefined,
    undefined
  );
};

export const taosService = {
  getTaoById,
  getTaosByDayId,
  postTao,
  patchTao,
  patchTaoDetachHighlight,
  deleteTao,
};
