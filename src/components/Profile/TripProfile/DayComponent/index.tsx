import { Box, Divider } from "@mui/material";
import { type Day } from "@services/days";
import type { GeoCoordinate, NavTab } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import DaySchedule from "@components/Schedule/DaySchedule";
import DayEvent from "@components/Schedule/DayEvent";
import type { Tao } from "@services/taos";
import TTTabs from "@components/TTTabs";
import React, { useState } from "react";
import clsx from "clsx";
import "./index.scss";

type DayComponentProps = {
  day: Day | undefined;
  taos: Tao[] | undefined;
  navTabValue: number;
  setTao: (state: Tao) => void;
  asyncAddDayTaos: (state: Tao) => void;
  asyncEditDayTaos: (state: Tao) => void;
  lastGeoCoordinate?: GeoCoordinate | undefined;
  setLastGeoCoordinate?: (state: GeoCoordinate) => void;
  readonly?: boolean;
};

const DayComponent = ({
  day,
  taos,
  navTabValue,
  setTao,
  asyncAddDayTaos,
  asyncEditDayTaos,
  lastGeoCoordinate,
  setLastGeoCoordinate,
  readonly = false,
}: DayComponentProps) => {
  const viewNavTabs = [
    {
      name: "event",
      label: "Event",
    },
    {
      name: "calendar",
      label: "Calendar",
    },
  ] as NavTab[];

  // window
  const isMobile = useIsMobile();
  // view - nav tabs
  const [viewNavTabValue, setViewNavTabValue] = useState<number>(0);

  return (
    <React.Fragment>
      <Divider flexItem />

      <Box className="trip-profile-day-comp-content-box">
        {/* view nav tabs - switch variant */}
        <Box className="trip-profile-day-comp-view-tab-box">
          <TTTabs
            navTabs={viewNavTabs}
            navTabValue={viewNavTabValue}
            setNavTabValue={setViewNavTabValue}
            variant="switch"
          />
        </Box>
        {/* views */}
        <Box
          className={clsx(
            "trip-profile-day-comp-schedule-box",
            viewNavTabValue === 1 && "day-schedule",
            isMobile && "mobile"
          )}
        >
          {viewNavTabValue === 0 ? (
            <DayEvent taos={taos} setTao={setTao} />
          ) : viewNavTabValue === 1 ? (
            <DaySchedule
              dayIndex={navTabValue}
              dayId={day?.id}
              taos={taos}
              setTao={setTao}
              asyncAddDayTaos={asyncAddDayTaos}
              asyncEditDayTaos={asyncEditDayTaos}
              lastGeoCoordinate={lastGeoCoordinate}
              setLastGeoCoordinate={setLastGeoCoordinate}
              readonly={readonly}
            />
          ) : undefined}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default DayComponent;
