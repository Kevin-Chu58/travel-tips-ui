import { Grid, type SxProps } from "@mui/material";
import { type TripDetail } from "@services/trips";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Headers, WorkshopToNavTab } from "@constants/Layouts";
import Map from "@components/Map";
import TripTimeLine from "@components/TripTimelineMap/TripTimeline";
import MapButtonGroup from "@components/ButtonGroup/MapButtonGroup";
import { mild_box_shadow_lg } from "@constants/Shadows";
import useTripTimelineMapLogic from "./useTripTimelineMapLogic";
import React from "react";
import MapDaySelectOptions from "@components/SelectOptions/MapDaySelectOptions";

dayjs.extend(customParseFormat);

type TripTimelineMapProps = {
  trip: TripDetail | undefined;
  queryKey: (string | undefined)[];
  navTabValue?: number;
  readonly?: boolean;
  sx?: SxProps;
};

const TripTimelineMapEdit = React.memo(({
  trip,
  queryKey,
  navTabValue,
  readonly = false,
  sx,
}: TripTimelineMapProps) => {
  const {
    // Day selection
    _onDay,
    _mapOnDay,
    setMapOnDay,
    setOnDayWithLock,
    // View mode: "location" or "route"
    mapView,
    setMapView,
    mapViews,
    // Map lock
    isLocked,
    setIsLocked,
    // Markers
    _markersOnDay,
    // Routes
    mapRoutes,
    mapRouteTypes,
    _routesOnDay,
    updateRoutes,
    // Focus and highlight
    mapFocusId,
    setMapFocusId,
    setIsUpdated,
    // TAO update tracking
    setIsTaoUpdated,
  } = useTripTimelineMapLogic({ trip, navTabValue });

  return (
    <Grid container size={12} position="relative">
      <Grid
        container
        position="relative"
        size={7}
        sx={{ ...sx }}
      >
        {/* day content */}
        <TripTimeLine
          trip={trip}
          queryKey={queryKey}
          onDay={_onDay}
          setOnDay={setOnDayWithLock}
          mapRoutes={mapRoutes}
          mapRouteTypes={mapRouteTypes}
          mapFocusId={mapFocusId}
          setMapFocusId={setMapFocusId}
          updateRoutes={updateRoutes}
          renderRoutes={() => setIsTaoUpdated((prev) => !prev)}
          readonly={readonly}
        />
      </Grid>

      {/* interactive map */}
      <Grid
        size={5}
        position="relative"
        sx={{
          position: "sticky",
          top: WorkshopToNavTab - Headers,
          height: `calc(100vh - ${WorkshopToNavTab}px)`,
        }}
      >
        <Map
          height="95%"
          markers={_markersOnDay}
          mapRoutes={_routesOnDay}
          focusId={mapFocusId}
          focusRoute={mapView === "route"}
          setFocusId={setMapFocusId}
          setIsParentUpdated={() => setIsUpdated((prev) => !prev)}
          setMapView={setMapView}
          updateOnMarkerFocus
          openPopUp
          sx={{
            mx: 1,
            my: 1.5,
            width: "98%",
            borderRadius: 4,
            boxShadow: mild_box_shadow_lg,
          }}
        />
        <MapDaySelectOptions
          days={trip?.days ?? []}
          onDay={_mapOnDay}
          setOnDay={setMapOnDay}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          sx={{
            bottom: 30,
            left: 20,
            zIndex: 1200,
          }}
        />
        <MapButtonGroup
          mapViews={mapViews}
          mapView={mapView}
          setMapView={setMapView}
          sx={{
            top: 15,
            right: 10,
          }}
        />
      </Grid>
    </Grid>
  );
});

export default TripTimelineMapEdit;
