import type { DayFormParams } from "@constants/Types";
import type { TripDetail } from "@services/trips";
import TimeUtils from "@utils/TimeUtils";
import TripUtils from "@utils/TripUtils";

export const isDayValid = (dayFormData: DayFormParams) => {
  const rules = [
    {
      key: "name",
      invalid: dayFormData.name && dayFormData.name.length > 50,
    },
    {
      key: "description",
      invalid: dayFormData.description && dayFormData.description.length > 1000,
    },
    {
      key: "times",
      invalid:
        !dayFormData.start ||
        !dayFormData.end ||
        dayFormData.start?.isSame(dayFormData.end),
    },
  ];

  return rules.filter((rule) => rule.invalid).map((rule) => rule.key);
};

export const isDayUnchanged = (
  dayFormData: DayFormParams,
  trip: TripDetail | undefined,
  editDay: number | undefined
) => {
  const day = TripUtils.getDayFromTrip(trip, editDay);
  return (
    day?.name === dayFormData.name?.trim() &&
    day?.description === dayFormData.description?.trim() &&
    day?.start === TimeUtils.dayjsToString(dayFormData.start) &&
    day?.end === TimeUtils.dayjsToString(dayFormData.end)
  );
};

export const getDayCummulatedTimes = (trip: TripDetail | undefined) => {
  if (!trip || !trip.days) return [];

  return trip.days.map((day) => {
    let accTime = day.start;
    const times: string[] = [accTime];

    day.tripAttractionOrders?.forEach((tao) => {
      accTime = TimeUtils.addMinutesToTime(
        accTime,
        tao.estimateTime + tao.estimateTravelTime
      );
      times.push(accTime);
    });

    return times;
  });
};
