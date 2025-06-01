import { Timeline } from "@mui/lab";
import type { Day } from "@services/days";
import DayTimelineItem from "./DayTimelineItem";
import { useState } from "react";
import type { MapRouteType } from "@constants/Maps";
import type { OsmFocusState, Route } from "@constants/Types";
import AddTaoButton from "../AddTaoButton";

type DayTimelineProps = {
  day: Day;
  dayRoutes: Route[];
  mapRouteTypes: string[];
  mapFocusState?: OsmFocusState;
  setMapFocusState?: (state: OsmFocusState) => void;
  updateRoutes?: (
    dayId: number,
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => void;
  setEditTao: (state: number) => void;
};

const DayTimeline = ({
  day,
  dayRoutes,
  mapRouteTypes,
  mapFocusState,
  setMapFocusState = () => {},
  updateRoutes,
  setEditTao,
}: DayTimelineProps) => {
  const [acummulatedTimes, setAcummulatedTimes] = useState<string[]>([day.start]);

  const updateTaoRoutes = (
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => {
    if (updateRoutes)
      updateRoutes(day.id, taoId, type, coords);
  };

  // return false if Taos is undefined or empty, true otherwise
  const isTaosValid = () => {
    return day.tripAttractionOrders && day.tripAttractionOrders?.length > 0;
  }

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
      {!isTaosValid() ? (
        <AddTaoButton onClick={() => {}}/>
      ) : day.tripAttractionOrders?.map((tao, i) => (
        <DayTimelineItem
          key={tao.id}
          day={day}
          tao={tao}
          route={dayRoutes.at(i)}
          i={i}
          acummulatedTimes={acummulatedTimes}
          mapRouteType={mapRouteTypes[i] ?? ""}
          setAcummulatedTimes={setAcummulatedTimes}
          mapFocusState={mapFocusState}
          setMapFocusState={setMapFocusState}
          updateRoutes={updateTaoRoutes}
          setEditTao={setEditTao}
        />
      ))}
    </Timeline>
  );
};

export default DayTimeline;
