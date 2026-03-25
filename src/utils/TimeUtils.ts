import { dayjsFormat, ha, HHmm, HHmmss, hmma } from "@constants/Times";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { Tao } from "@services/taos";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

// get surrounding dates

export interface DateInfo {
  day: string; // e.g., "Mon"
  month: string; // e.g., "Jan"
  dayOfMonth: number;
  year: number;
}

const getSurroundingDates = (
  center: Date = new Date(),
  range: number = 4,
): DateInfo[] => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const results: DateInfo[] = [];

  for (let offset = -range; offset <= range; offset++) {
    const d = new Date(center);
    d.setDate(center.getDate() + offset);

    results.push({
      day: daysOfWeek[d.getDay()],
      month: months[d.getMonth()],
      dayOfMonth: d.getDate(),
      year: d.getFullYear(),
    });
  }

  return results;
};

// parse opening hours

export interface DayHours {
  start: string; // "09:00"
  end: string; // "17:00"
}

// Map day names to indices
const dayIndex: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

const getDayIndex = (day: string) => {
  return dayIndex[day];
};

/**
 * @author ChatGPT
 * weekHours must be an array of 7 elements (Mon=0 ... Sun=6)
 * Each element is either { start, end } or null (closed)
 */
const isOpenNow = (weekHours: (DayHours | null)[]): boolean => {
  const now = new Date();

  // Convert JS day (Sun=0) → Mon=0...Sun=6
  const dayIndex = (now.getDay() + 6) % 7;

  const hours = weekHours[dayIndex];
  if (!hours) return false; // closed today

  const { start, end } = hours;

  // Convert "HH:mm" -> minutes since midnight
  const toMinutes = (str: string): number => {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  };

  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Case 1: Normal same-day range (e.g. 09:00–17:00)
  if (startMin < endMin) {
    return nowMin >= startMin && nowMin < endMin;
  }

  // Case 2: Overnight (e.g. 22:00–02:00)
  // Meaning: open from start to midnight, and midnight to end
  return nowMin >= startMin || nowMin < endMin;
};

/**
 * @author ChatGPT
 * Parses weekly business hours strings like:
 *   ["Mon-Fri: 09:00 - 17:00", "Sat, Sun: 09:00 - 18:00"]
 * into:
 *   [ {start, end}, ..., null ]
 */
const parseWeeklyHours = (
  hoursInput: string[] | undefined,
): (DayHours | null)[] => {
  const weekHours: (DayHours | null)[] = Array(7).fill(null);

  if (!hoursInput) return weekHours;

  hoursInput.forEach((str) => {
    // Split only at the FIRST colon
    const colonPos = str.indexOf(":");
    if (colonPos === -1) return; // skip invalid string

    const daysPart = str.slice(0, colonPos).trim();
    const hoursPart = str.slice(colonPos + 1).trim();

    const [start, end] = hoursPart.split("-").map((s) => s.trim());

    let days: number[] = [];

    if (daysPart.includes("-")) {
      // Example: Mon-Fri
      const [startDay, endDay] = daysPart.split("-").map((s) => s.trim());
      const startIdx = dayIndex[startDay];
      const endIdx = dayIndex[endDay];
      for (let i = startIdx; i <= endIdx; i++) {
        days.push(i);
      }
    } else if (daysPart.includes(",")) {
      // Example: Sat, Sun
      days = daysPart
        .split(",")
        .map((s) => dayIndex[s.trim()])
        .filter((i) => i !== undefined);
    } else {
      // Single day
      days = [dayIndex[daysPart]];
    }

    // Assign parsed hours to each matched day
    days.forEach((i) => {
      if (i != null) {
        weekHours[i] = { start, end };
      }
    });
  });

  return weekHours;
};

// format time & change time

const addMinutesToTime = (timeStr: string, minutesToAdd: number) => {
  const [hours, minutes] = timeStr.split(":").map(Number);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);

  const newHours = date.getHours().toString().padStart(2, "0");
  const newMinutes = date.getMinutes().toString().padStart(2, "0");

  return `${newHours}:${newMinutes}`;
};

const formatDays = (totalDays: number) => {
  if (totalDays === 0) return "no days available";
  if (totalDays === 1) return "1 day";
  return `${totalDays} days`;
};

const formatMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hToken = "hour";
  const mToken = "min";

  if (hours > 0 && minutes > 0) {
    return `${hours} ${hToken} ${minutes} ${mToken}`;
  } else if (hours > 0) {
    return `${hours} ${hToken}`;
  } else {
    return `${minutes} ${mToken}`;
  }
};

const secondToMinute = (seconds: number) => {
  return Math.round(seconds / 60);
};

const secondToTimeStr = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec${seconds === 1 ? "" : "s"}`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }

  return `${hours} hr${hours === 1 ? "" : "s"} ${remainingMinutes} min${
    remainingMinutes === 1 ? "" : "s"
  }`;
};

const formatTimeDiff = (diff: number) => {
  if (diff === 0) return "exact";

  const abs = Math.abs(diff);
  const unit = abs === 1 ? "min" : "mins";
  const direction = diff < 0 ? "early" : "late";

  return `${abs} ${unit} ${direction}`;
};

/** update useState related to time */

const updateTimeByHour = (
  hours: number,
  time: number,
  setTime: (state: number) => void,
) => {
  let minutes = time % 60;
  setTime(hours * 60 + minutes);
};

const updateTimeByMinute = (
  minute: number,
  time: number,
  setTime: (state: number) => void,
) => {
  let hours = Math.floor(time / 60);
  setTime(hours * 60 + minute);
};

/** dayjs */

const compareTime = (format: string, start?: string, end?: string) => {
  if (!start || !end) return false;

  const startTime = dayjs(start, format);
  const endTime = dayjs(end, format);

  return startTime.isBefore(endTime);
};

const orderTaos = (taos: Tao[]) => {
  if (taos.length === 0) return [];

  return taos.toSorted((a, b) => a.start.localeCompare(b.start));
};

const dayjsToString = (format: string, time: Dayjs | null) => {
  // time might be undefined, which is caused by accessing start and end states
  // before initEditDayForm() setups everything
  return time?.format(format) ?? "";
};

const formatTimeHHmmssTohmmA = (time: string) => {
  return dayjsFormat(time, HHmmss, hmma);
};

const formatTimeHHmmssToHHmm = (time: string) => {
  return dayjsFormat(time, HHmmss, HHmm);
};

const formatTimeHHmmTohmmA = (time: string) => {
  return dayjsFormat(time, HHmm, hmma);
};

const formatTimeHHmmTohA = (time: string) => {
  return dayjsFormat(time, HHmm, ha);
};

const formatTimehmmAToHHmmss = (time: string) => {
  return dayjsFormat(time, hmma, HHmmss);
};

// Date

const toFullDateTimeNumericDisplay = (date: Date) => {
  const fullDisplay = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return fullDisplay;
};

const toFullDateNumericDisplay = (date: Date) => {
  const fullDisplay = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return fullDisplay;
};

const TimeUtils = {
  // get surrounding dates
  getSurroundingDates,
  // parse opening hours
  getDayIndex,
  isOpenNow,
  parseWeeklyHours,
  // format time & change time
  addMinutesToTime,
  formatDays,
  formatMinutes,
  secondToMinute,
  secondToTimeStr,
  formatTimeDiff,
  // update time useState
  updateTimeByHour,
  updateTimeByMinute,
  // dayjs
  compareTime,
  orderTaos,
  dayjsToString,
  formatTimeHHmmssTohmmA,
  formatTimeHHmmssToHHmm,
  formatTimeHHmmTohmmA,
  formatTimeHHmmTohA,
  formatTimehmmAToHHmmss,
  // Date
  toFullDateTimeNumericDisplay,
  toFullDateNumericDisplay,
};

export default TimeUtils;
