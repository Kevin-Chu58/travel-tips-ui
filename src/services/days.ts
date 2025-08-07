import http from "./http";

type DayPost = {
  title?: string;
  description?: string;
  tripId: number;
};

type DayPatch = {
  title?: string;
  description?: string;
};

export type Day = DayPost & {
  id: number;
  isOverNight: boolean;
};

const getDaysByTripId = async (
  tripId: number,
  token?: string
): Promise<Day[]> => {
  return await http.get(
    http.apiBaseURLs.api,
    `days/${tripId}`,
    undefined,
    token
  );
};

const postNewDay = async (
  token: string,
  tripId: number,
  title?: string
): Promise<Day> => {
  const body = JSON.stringify(title);
  return await http.post(
    http.apiBaseURLs.api,
    `days/${tripId}`,
    body,
    undefined,
    token
  );
};

const patchDay = async (
  id: number,
  day: DayPatch,
  token: string
): Promise<Day> => {
  const body = JSON.stringify(day);
  return await http.patch(
    http.apiBaseURLs.api,
    `days/${id}`,
    body,
    undefined,
    token
  );
};

const deleteDay = async (id: number, token: string): Promise<Day> => {
  return await http.del(
    http.apiBaseURLs.api,
    `days/${id}`,
    undefined,
    undefined,
    token
  );
};

export const daysService = {
  getDaysByTripId,
  postNewDay,
  patchDay,
  deleteDay,
};
