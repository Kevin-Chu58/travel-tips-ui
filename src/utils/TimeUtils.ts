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

const TimeUtils = {
  addMinutesToTime,
  formatMinutes,
};

export default TimeUtils;