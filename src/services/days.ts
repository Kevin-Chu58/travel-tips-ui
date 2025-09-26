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
};

const getDaysByTripId = async (tripId: number): Promise<Day[]> => {
  return await http.get(http.apiBaseURLs.api, `days/${tripId}`, undefined);
};

const postNewDay = async (tripId: number, title?: string): Promise<void> => {
  const body = JSON.stringify(title);
  return await http.post(
    http.apiBaseURLs.api,
    `days/${tripId}`,
    body,
    undefined
  );
};

const patchDay = async (id: number, day: DayPatch): Promise<Day> => {
  const body = JSON.stringify(day);
  return await http.patch(http.apiBaseURLs.api, `days/${id}`, body, undefined);
};

const deleteDay = async (id: number): Promise<void> => {
  return await http.del(
    http.apiBaseURLs.api,
    `days/${id}`,
    undefined,
    undefined
  );
};

export const daysService = {
  getDaysByTripId,
  postNewDay,
  patchDay,
  deleteDay,
};
