import { dayjsFormat, ha, HHmm, HHmmss, hmma } from "@constants/Times";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { Tao } from "@services/taos";

dayjs.extend(customParseFormat);

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

const secondToMinuteStr = (seconds: number) => {
  const minutes = Math.round(seconds / 60);

  if (seconds > 0 && minutes === 0) return `${seconds} secs`;

  return `${minutes} min${minutes === 1 ? "" : "s"}`;
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
  setTime: (state: number) => void
) => {
  let minutes = time % 60;
  setTime(hours * 60 + minutes);
};

const updateTimeByMinute = (
  minute: number,
  time: number,
  setTime: (state: number) => void
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

  taos.sort((a, b) => a.start.localeCompare(b.start));
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

const TimeUtils = {
  addMinutesToTime,
  formatDays,
  formatMinutes,
  secondToMinute,
  secondToMinuteStr,
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
};

export default TimeUtils;
