import { Box, Typography } from "@mui/material";
import TimeUtils, { type DateInfo, type DayHours } from "@utils/TimeUtils";
import clsx from "clsx";
import "./index.scss";

type OpeningHoursProps = {
  surroundingDates: DateInfo[];
  openingHours: (DayHours | null)[];
};

const OpeningHours = ({
  surroundingDates,
  openingHours,
}: OpeningHoursProps) => {
  const todayIndex = Math.ceil(surroundingDates.length / 2) - 1;

  return (
    <Box className="opening-hours-container">
      {surroundingDates.map((date, i) => {
        const openingHour = openingHours[TimeUtils.getDayIndex(date.day)];

        const statusNum = i - todayIndex;
        const statusStr =
          statusNum < 0 ? "past" : statusNum === 0 ? "today" : "future";

        const is24Hrs =
          openingHour?.start === "00:00" && openingHour?.end === "24:00";
        return (
          <Box
            key={date.dayOfMonth}
            className={clsx("opening-hours-box", statusStr)}
          >
            <Box className="opening-hours-date">
              <Typography>{date.day}</Typography>
              <Typography variant="h6">{date.month}</Typography>
              <Typography variant="h6">{date.dayOfMonth}</Typography>
            </Box>
            {is24Hrs ? (
              <Typography>24 hours</Typography>
            ) : !openingHour ? (
              <Typography>Closed</Typography>
            ) : (
              <Typography>
                {openingHour?.start} -<b /> {openingHour?.end}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default OpeningHours;
