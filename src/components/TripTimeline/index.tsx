import { Fab, Grid, Typography } from "@mui/material";
import type { TripDetail } from "@services/trips";
import AddIcon from "@mui/icons-material/Add";
import DeleteConfirmForm from "@components/Forms/DleteConfirmForm";
import type { Day } from "@services/days";
import type { MapRouteType } from "@constants/Maps";
import { type Route } from "@constants/Types";
import TripUtils from "@utils/TripUtils";
import TaoEditor from "@components/TaoEditor";
import DayTimelineItem from "./DayTimelineItem";
import DayForm from "@components/Forms/DayForm";
import DayTimeline from "./DayTimeline";
import useTripTimelineLogic from "./useTripTimelineLogic";

type TripTimelineProps = {
  trip?: TripDetail;
  token: string | null;
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

const TripTimeline = ({
  trip,
  token,
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
  const {
    // day
    addDay,
    setAddDay,
    editDay,
    setEditDay,
    deleteDay,
    setDeleteDay,
    dayFormData,
    handleDayFormChange,
    errorParams,
    handleAddDay,
    handleUpdateDay,
    handleDeleteDay,
    // tao
    editTao,
    editTaoOrder,
    openEditTao,
    setOpenEditTao,
    updateOpenEditTao,
    // utils
    clearDayForm,
    dayAcummulatedTimes,
  } = useTripTimelineLogic({ trip, token, queryKey });

  return (
    <>
      <Grid size={12} sx={{ position: "relative" }}>
        {trip?.days?.map((day, i) => (
          <DayTimeline
            key={day.id}
            i={i}
            day={day}
            onDay={onDay}
            setOnDay={setOnDay}
            editDay={editDay}
            setEditDay={setEditDay}
            setDeleteDay={() =>
              setDeleteDay(TripUtils.getDayFromTrip(trip, day.id))
            }
            dayFormData={dayFormData}
            handleDayFormChange={handleDayFormChange}
            handleUpdateDay={handleUpdateDay}
            setEditTao={updateOpenEditTao}
            readonly={readonly}
            sx={{ position: "relative", top: "none", zIndex: 0 }}
          >
            {/* trip attraction orders */}
            {day.tripAttractionOrders?.map((tao, j) => (
              <DayTimelineItem
                trip={trip}
                queryKey={queryKey}
                key={tao.id}
                day={day}
                tao={tao}
                route={mapRoutes?.at(i)?.at(j)}
                i={j}
                cummulatedTimes={dayAcummulatedTimes.at(i) ?? []}
                mapRouteType={mapRouteTypes?.at(i)?.at(j) ?? ""}
                mapFocusId={mapFocusId}
                setMapFocusId={setMapFocusId}
                updateRoutes={updateRoutes}
                setEditTao={updateOpenEditTao}
                readonly={readonly}
              />
            ))}
          </DayTimeline>
        ))}

        {/* delete form */}
        <DeleteConfirmForm
          open={deleteDay}
          title="Delete Day"
          onClose={() => setDeleteDay(undefined)}
          onDelete={() => handleDeleteDay(deleteDay!.id)}
        >
          <Typography variant="h6" color="error">
            Are you sure you want to delete{" "}
            <strong>
              Day{" "}
              {(TripUtils.getDayIndexFromTrip(trip, deleteDay?.id ?? 0) ?? 0) +
                1}{" "}
              {deleteDay?.name && `- ${deleteDay?.name}`}
            </strong>
            ?
          </Typography>
        </DeleteConfirmForm>
      </Grid>

      {/* add icon */}
      {!readonly && (
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
      )}

      {/* new Day */}
      <DayForm
        dayFormData={dayFormData}
        handleDayFormChange={handleDayFormChange}
        open={addDay}
        errorParams={errorParams}
        onClose={clearDayForm}
        onConfirm={handleAddDay}
      />

      {/* tao editor */}
      <TaoEditor
        trip={trip}
        day={onDay}
        taoId={editTao}
        taoOrder={editTaoOrder}
        queryKey={queryKey}
        title={`Day ${
          (TripUtils.getDayIndexFromTrip(trip, onDay?.id) ?? 0) + 1
        } ${onDay?.name ? ` - ${onDay.name}` : ""}`}
        open={openEditTao}
        handleClose={() => setOpenEditTao(false)}
        render={renderRoutes}
      />
    </>
  );
};

export default TripTimeline;
