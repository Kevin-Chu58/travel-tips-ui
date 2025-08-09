import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

export const HHmm = "HH:mm";
export const HHmmss = "HH:mm:ss";
export const HHmma = "HH:mm A";
export const hhmm = "hh:mm";
export const hhmmss = "hh:mm:ss";
export const hhmma = "hh:mm A";
export const hmma = "h:mm A";
export const ha = "h A";

// time options for autocomplete and etc.
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

export type TimeEntry = {
  time: string; // "HH:mm"
  dayOffset: number; // 0 = today, 1 = next day
  isHourly: boolean; // is time a complete hour
};

export const dayjsFormat = (
  time: string,
  oldFormat: string,
  newFormat: string
) => {
  return dayjs(time, oldFormat).format(newFormat);
};

// Generates once at module load
// 00:00 to 06:00 next day with 15 minutes interval and an offset indicates which date it is
// generate time to 00:15 of the next day, with an extra hidden slot, the selection to the end of the first day will show 12:00
export const TIMES_WITH_OFFSET = (() => {
  const result = [];
  let hours = 0,
    minutes = 0,
    offset = 0;

  while (!(offset === 1 && hours === 0 && minutes === 15)) {
    result.push({
      time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`,
      dayOffset: offset,
      isHourly: minutes === 0,
    } as TimeEntry);
    minutes += 15;
    if (minutes === 60) {
      minutes = 0;
      hours++;
      if (hours === 24) {
        hours = 0;
        offset = 1;
      }
    }
  }
  return result;
})();
