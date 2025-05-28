import { Timeline } from "@mui/lab";
import type { Day } from "@services/days";
import type { OsmFocusState } from "..";
import DayTimelineItem from "./DayTimelineItem";
import { useState } from "react";
import type { MapRouteType } from "@constants/Maps";

type DayTimelineProps = {
  day: Day;
  mapRouteTypes: string[];
  mapFocusState: OsmFocusState;
  setMapFocusState?: (state: OsmFocusState) => void;
  updateRoutes: (
    dayId: number,
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => void;
};

const DayTimeline = ({
  day,
  mapRouteTypes,
  mapFocusState,
  setMapFocusState = () => {},
  updateRoutes,
}: DayTimelineProps) => {
  const [cummulatedTimes, setCummulatedTimes] = useState<string[]>([day.start]);

  const updateTaoRoutes = (
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => {
    updateRoutes(day.id, taoId, type, coords);
  };

  return (
    <Timeline
      key={day.id}
      // onClick={() => setEditTao(day.id)}
      sx={{
        ".MuiTypography-root": {
          mr: 0,
          flex: 0,
          WebkitFlex: 0,
        },
        maxWidth: "100%",
      }}
    >
      {day.tripAttractionOrders?.map((tao, i) => (
        <DayTimelineItem
          key={tao.id}
          day={day}
          tao={tao}
          i={i}
          cummulatedTimes={cummulatedTimes}
          mapRouteType={mapRouteTypes[i] ?? ""}
          setCummulatedTimes={setCummulatedTimes}
          mapFocusState={mapFocusState}
          setMapFocusState={setMapFocusState}
          updateRoutes={updateTaoRoutes}
        />
      ))}
    </Timeline>
  );
};

export default DayTimeline;
