import type { AttractionV2 } from "./attractions";
import type { Highlight } from "./highlights";
import http from "./http";

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

export const taosService = {
  getTaosByDayId,
  postTao,
};
