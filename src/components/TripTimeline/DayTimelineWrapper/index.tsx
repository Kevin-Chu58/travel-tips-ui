import { Timeline } from "@mui/lab";
import type { Day } from "@services/days";
import { useEffect, useState, type ReactNode } from "react";
import AddTaoButton from "../AddTaoButton";
import type { StringArrUpdate } from "@constants/Types";
import type { SxProps } from "@mui/material";

type DayTimelineWrapperProps = {
  day: Day;
  dayTimeUpdate?: StringArrUpdate[];
  setDayTimeUpdate?: (state: StringArrUpdate[]) => void;
  setEditTao: (state: number | undefined, order?: number) => void;
  readonly?: boolean;
  children: ReactNode;
  sx?: SxProps;
};

const DayTimelineWrapper = ({
  day,
  dayTimeUpdate,
  setDayTimeUpdate,
  setEditTao,
  readonly = false,
  children,
  sx,
}: DayTimelineWrapperProps) => {
  const [acummulatedTimes, setAcummulatedTimes] = useState<string[]>([
    day.start,
  ]);

  useEffect(() => {
    if (dayTimeUpdate && setDayTimeUpdate && dayTimeUpdate.length < (day.tripAttractionOrders?.length ?? 0))
      setDayTimeUpdate([
        ...dayTimeUpdate,
        { stringArr: acummulatedTimes, update: setAcummulatedTimes },
      ]);
  }, [dayTimeUpdate]);

  // rerender on day to reset the acummulatedTimes in case the day.start is changed
  useEffect(() => {
    setAcummulatedTimes([day.start]);
  }, [day]);

  // return false if Taos is undefined or empty, true otherwise
  const isTaosValid = () => {
    return day.tripAttractionOrders && day.tripAttractionOrders?.length > 0;
  };

  return (
    <Timeline
      key={day.id}
      sx={{
        ".MuiTypography-root": {
          mr: 0,
          flex: 0,
          WebkitFlex: 0,
        },
        maxWidth: "100%",
        position: "relative",
        ...sx,
      }}
    >
      {!readonly && !isTaosValid() ? (
        <AddTaoButton onClick={() => setEditTao(undefined, 0)} />
      ) : (
        <>{children}</>
      )}
    </Timeline>
  );
};

export default DayTimelineWrapper;
