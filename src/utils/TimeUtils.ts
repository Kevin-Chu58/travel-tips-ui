import { HM, HMA, HMS } from "@constants/Times";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

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

const dayjsToString = (time: Dayjs | null) => {
  // time might be undefined, which is caused by accessing start and end states
  // before initEditDayForm() setups everything
  return time?.format(HMS) ?? "";
};

const stringToDayjs = (time: string) => {
  return dayjs(time, HMS);
};

const formatTime = (time: string, ampm: boolean = true) => {
  return dayjs(time, HM).format(ampm ? HMA : HM);
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
  dayjsToString,
  stringToDayjs,
  formatTime,
};

export default TimeUtils;
