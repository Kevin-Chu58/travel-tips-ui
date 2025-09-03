import type { AttractionV2 } from "./attractions";
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
  attraction: AttractionV2;
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

const getTaosByDayId = async (
  dayId: number,
  token?: string
): Promise<Tao[]> => {
  return await http.get(
    http.apiBaseURLs.api,
    `tripAttractionOrders/day/${dayId}`,
    undefined,
    token
  );
};

const postTao = async (
  dayId: number,
  newTao: TaoPost,
  token: string
): Promise<number> => {
  const body = JSON.stringify(newTao);
  return await http.post(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${dayId}`,
    body,
    undefined,
    token
  );
};

const patchTao = async (
  taoId: number,
  taoPatch: TaoPatch,
  token: string
): Promise<number> => {
  const body = JSON.stringify(taoPatch);
  return await http.patch(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${taoId}`,
    body,
    undefined,
    token
  );
};

const deleteTao = async (taoId: number, token: string): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `tripAttractionOrders/${taoId}`,
    undefined,
    undefined,
    token
  );
};

export const taosService = {
  getTaosByDayId,
  postTao,
  patchTao,
  deleteTao,
};
