import type { OsmFocusState } from "@constants/Types";
import type { Day, TripAttractionOrder } from "@services/days";
import type { TripDetail } from "@services/trips";

/// this file consists of helper functions that simplifies logic in
/// operations related to Trips

// TODO - update getDay -> getDayFromTrip

const getDay = (days: Day[] | undefined, id: number | undefined) => {
  return days?.find((day) => day.id === id);
};

const getDayIndex = (days: Day[] | undefined, id: number | undefined) => {
  return days?.findIndex((day) => day.id === id);
};

const getDayFromTrip = (trip: TripDetail | undefined, id: number | undefined) => {
  return trip?.days?.find((day) => day.id === id);
};

const getDayIndexFromTrip = (trip: TripDetail | undefined, id: number | undefined) => {
  return trip?.days?.findIndex((day) => day.id === id);
};

const getTao = (taos: TripAttractionOrder[] | undefined, id: number | undefined) => {
  return taos?.find((tao) => tao.id === id);
};
const getTaoIndex = (taos: TripAttractionOrder[] | undefined, id: number | undefined) => {
  return taos?.findIndex((tao) => tao.id === id);
};

const getTaoFromDay = (day: Day | undefined, id: number | undefined) => {
  return day?.tripAttractionOrders?.find((tao) => tao.id === id);
};

const getTaoIndexFromDay = (day: Day | undefined, id: number | undefined) => {
  return day?.tripAttractionOrders?.findIndex((tao) => tao.id === id);
}

const isTaoFocused = (
  tao: TripAttractionOrder,
  focusedTao: OsmFocusState | undefined
) => {
  return (
    tao.attraction?.osmId === focusedTao?.id &&
    tao.attraction?.osmType === focusedTao?.type &&
    tao.order === focusedTao?.order
  );
};

const TripUtils = {
  getDay,
  getDayIndex,
  getDayFromTrip,
  getDayIndexFromTrip,
  getTao,
  getTaoIndex,
  getTaoFromDay,
  getTaoIndexFromDay,
  isTaoFocused,
};

export default TripUtils;
