import { Timeline } from "@mui/lab";
import type { Day } from "@services/days";
import DayTimelineItem from "./DayTimelineItem";
import { useEffect, useState } from "react";
import type { MapRouteType } from "@constants/Maps";
import type { OsmFocusState, Route } from "@constants/Types";
import AddTaoButton from "../AddTaoButton";
import type { TripDetail } from "@services/trips";

type DayTimelineProps = {
  trip?: TripDetail;
  queryKey: (string | undefined)[];
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
  setEditTao: (state: number | undefined, order?: number) => void;
};

const DayTimeline = ({
  trip,
  queryKey,
  day,
  dayRoutes,
  mapRouteTypes,
  mapFocusState,
  setMapFocusState = () => {},
  updateRoutes,
  setEditTao,
}: DayTimelineProps) => {
  const [acummulatedTimes, setAcummulatedTimes] = useState<string[]>([
    day.start,
  ]);

  // rerender on day to reset the acummulatedTimes in case the day.start is changed
  useEffect(() => {
    setAcummulatedTimes([day.start]);
  }, [day]);

  const updateTaoRoutes = (
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => {
    if (updateRoutes) updateRoutes(day.id, taoId, type, coords);
  };

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
      }}
    >
      {!isTaosValid() ? (
        <AddTaoButton onClick={() => {}} />
      ) : (
        day.tripAttractionOrders?.map((tao, i) => (
          <DayTimelineItem
            trip={trip}
            queryKey={queryKey}
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
        ))
      )}
    </Timeline>
  );
};

export default DayTimeline;
