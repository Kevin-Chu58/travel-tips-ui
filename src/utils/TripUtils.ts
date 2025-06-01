import type { TripDetail } from "@services/trips";

const getDay = (trip: TripDetail | undefined, id: number | undefined) => {
  return trip?.days?.find((day) => day.id === id);
};

const getDayIndex = (trip: TripDetail | undefined, id: number | undefined) => {
  return trip?.days?.findIndex((day) => day.id === id);
};

const TripUtils = {
  getDay,
  getDayIndex,
};

export default TripUtils;
