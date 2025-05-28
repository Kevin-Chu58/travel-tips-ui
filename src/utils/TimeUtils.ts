import { HM, HMA, HMS } from "@constants/times";
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
  formatMinutes,
  // dayjs
  dayjsToString,
  stringToDayjs,
  formatTime,
};

export default TimeUtils;
