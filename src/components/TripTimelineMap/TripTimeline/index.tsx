import { Fab, Grid } from "@mui/material";
import type { TripDetail } from "@services/trips";
import AddIcon from "@mui/icons-material/Add";
import type { Day } from "@services/days";
import type { MapRouteType } from "@constants/Maps";
import { type Route } from "@constants/Types";
import TripUtils from "@utils/TripUtils";
import TaoEditor from "@components/TaoEditor";
import DayForm from "@components/Forms/DayForm";
import DayTimeline from "./DayTimeline";
import { TripTimelineProvider, useTripTimeline } from "./TripTimelineProvider";
import DeleteDayForm from "@components/Forms/DeleteDayForm";
import React from "react";
import { WorkshopToNavTab } from "@constants/Layouts";

type TripTimelineProps = {
  trip?: TripDetail;
  queryKey: (string | undefined)[];
  onDay: Day | undefined;
  setOnDay: (state: Day | undefined) => void;
  mapRoutes?: Route[][];
  mapRouteTypes?: string[][];
  mapFocusId?: string;
  setMapFocusId?: (state: string | undefined) => void;
  updateRoutes?: (
    dayId: number,
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => void;
  renderRoutes: () => void;
  readonly?: boolean;
};

const TripTimeline = React.memo(
  ({
    trip,
    queryKey,
    onDay,
    setOnDay,
    mapRoutes,
    mapRouteTypes,
    mapFocusId,
    setMapFocusId,
    updateRoutes,
    renderRoutes,
    readonly = false,
  }: TripTimelineProps) => {
    return (
      <TripTimelineProvider trip={trip} queryKey={queryKey}>
        <Grid
          id="trip-timeline-container"
          className="styled-scrollbar"
          size={12}
          sx={{
            position: "initial",
            height: `calc(100vh - ${WorkshopToNavTab}px)`,
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {trip?.days?.map((day, i) => (
            <DayTimeline
              key={day.id}
              i={i}
              day={day}
              onDayId={onDay?.id}
              setOnDay={setOnDay}
              setMapFocusId={setMapFocusId}
              readonly={readonly}
              sx={{ position: "relative", top: "none", zIndex: 0 }}
              mapRoutes={mapRoutes?.at(i)}
              mapRouteTypes={mapRouteTypes?.at(i) ?? []}
              mapFocusId={mapFocusId}
              updateRoutes={updateRoutes}
            />
          ))}

          {/* add icon */}
          {!readonly && <TripTimelineFab />}
        </Grid>

        {/* new Day */}
        <DayForm />
        
        {/* delete form */}
        <DeleteDayForm />

        {/* tao editor */}
        <TaoEditor
          day={onDay}
          title={`Day ${
            (TripUtils.getDayIndexFromTrip(trip, onDay?.id) ?? 0) + 1
          } ${onDay?.name ? ` - ${onDay.name}` : ""}`}
          render={renderRoutes}
        />
      </TripTimelineProvider>
    );
  }
);

const TripTimelineFab = () => {
  const { setAddDay } = useTripTimeline();

  return (
    <Fab
      variant="extended"
      aria-label="add"
      onClick={() => setAddDay(true)}
      disableRipple
      sx={{
        position: "absolute",
        bottom: 10,
        right: 10,
        bgcolor: "primary.main",
        color: "white",
        ":hover": {
          bgcolor: "primary.main",
          filter: "brightness(.9)",
        },
      }}
    >
      <AddIcon sx={{ mr: 1 }} />
      New Day
    </Fab>
  );
};

export default TripTimeline;
