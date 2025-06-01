import ConditionalSuccessIconGroup from "@components/ButtonGroup/ConditionalSuccessButtonGroup";
import TTIconButton from "@components/TTIconButton";
import { Box, Divider, Fab, Grid, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import type { TripDetail } from "@services/trips";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import DeleteConfirmForm from "@components/Forms/DleteConfirmForm";
import type { Day } from "@services/days";
import TimeUtils from "@utils/TimeUtils";
import DayForm from "@components/Forms/DayForm";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useDayMutations } from "@react-queries/useDayQueries";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { MapRouteType } from "@constants/Maps";
import DayTimeline from "./DayTimeline";
import type { OsmFocusState, Route } from "@constants/Types";
import TripUtils from "@utils/TripUtils";

type DayContentProps = {
  trip?: TripDetail;
  token: string | null;
  queryKey: (string | undefined)[];
  onDay: Day | undefined;
  setOnDay: (state: Day | undefined) => void;
  mapRoutes?: Route[][];
  mapRouteTypes?: string[][];
  mapFocusState?: OsmFocusState;
  setMapFocusState?: (state: OsmFocusState) => void;
  updateRoutes?:(
      dayId: number,
      taoId: number,
      type: MapRouteType,
      coords: [number, number][]
    ) => void;
  setEditTao: (state: number) => void;
};

const DayContent = ({ 
  trip, 
  token,
  queryKey, 
  onDay, 
  setOnDay, 
  mapRoutes,
  mapRouteTypes,
  mapFocusState,
  setMapFocusState,
  updateRoutes,
  setEditTao,
}: DayContentProps) => {
  // constants
  const startDefault = dayjs().hour(8).minute(0).second(0);
  const endDefault = dayjs().hour(20).minute(0).second(0);
  // open form status
  const [addDay, setAddDay] = useState<boolean>(false);
  const [editDay, setEditDay] = useState<number | undefined>();
  const [deleteDay, setDeleteDay] = useState<Day | undefined>();
  // day form attributes
  const [name, setName] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [start, setStart] = useState<Dayjs | null>(startDefault);
  const [end, setEnd] = useState<Dayjs | null>(endDefault);
  const [errorParams, setErrorParams] = useState<string[]>([]);

  const { mutationAddDay, mutationUpdateDay, mutationRemoveDay } =
      useDayMutations({
        trip,
        token,
        editDay,
        queryKey,
      });

  /** useEffect */
  
    // rerender on addDay to update day form attributes
    useEffect(() => {
      if (addDay) initAddDayForm();
      else clearDayForm();
    }, [addDay]);
  
    // rerender on editDay to update day form attributes
    useEffect(() => {
      if (editDay) initEditDayForm(TripUtils.getDay(trip, editDay));
      else clearDayForm();
    }, [editDay]);



  const handleUpdateDay = async () => {
    let invalidParams = isDayValid();
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      if (!isDayUnchanged())
        mutationUpdateDay.mutate({
          id: editDay,
          name,
          description,
          start,
          end,
        });
      setEditDay(undefined);
    }
  };

  const handleDeleteDay = async (id: number) => {
    mutationRemoveDay.mutate({ id });
    setDeleteDay(undefined);
  };

  const isDayValid = () => {
    let invalidParams = [];
    if (name && name.length > 50) invalidParams.push("name");
    if (description && description.length > 1000)
      invalidParams.push("description");
    if (!start || !end || start?.isSame(end)) invalidParams.push("times");

    return invalidParams;
  };

  const isDayUnchanged = () => {
    const day = TripUtils.getDay(trip, editDay!);
    return (
      day?.name === name?.trim() &&
      day?.description === description?.trim() &&
      day?.start === TimeUtils.dayjsToString(start) &&
      day?.end === TimeUtils.dayjsToString(end)
    );
  };

    /** edit day */
  
    const initAddDayForm = () => {
      setStart(startDefault);
      setEnd(endDefault);
    };
  
    const initEditDayForm = (day: Day | undefined) => {
      if (day) {
        setEditDay(day.id);
        setName(day.name);
        setDescription(day.description);
        setStart(TimeUtils.stringToDayjs(day.start));
        setEnd(TimeUtils.stringToDayjs(day.end));
      }
    };
  
    const clearDayForm = () => {
      // close all day forms
      setAddDay(false);
      setEditDay(undefined);
  
      setName("");
      setDescription("");
      setStart(null);
      setEnd(null);
    };

    const handleAddDay = async () => {
    let invalidParams = isDayValid();
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      mutationAddDay.mutate({ name, description, start, end });
      clearDayForm();
    }
  };

  return (
    <>
      <Grid
        id="day-content"
        size={12}
        // position="sticky"
        sx={{ overflowX: "hidden", overflowY: "auto" }}
      >
        {trip?.days?.map((day, i) => (
          <Grid
            key={`trip-day-${day.id}`}
            onMouseEnter={() => setOnDay(day)}
            onMouseLeave={() => setOnDay(undefined)}
            size={12}
            width="100%"
          >
            <Box
              position="sticky"
              pt={2}
              pl={2}
              top={0}
              sx={{ zIndex: 100, bgcolor: "secondary.main" }}
            >
              {editDay !== day.id ? (
                <>
                  <Grid container size={12} direction="row" alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      Day {i + 1}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" ml={1}>
                      {day.name}
                    </Typography>
                    {day.id === onDay?.id && (
                      <Box position="absolute" right={10}>
                        <TTIconButton
                          size="small"
                          sx={{
                            color: "secondary.main",
                            bgcolor: "secondary.900",
                            ":hover": {
                              bgcolor: "secondary.dark",
                            },
                          }}
                          onClick={() => setEditDay(day.id)}
                        >
                          <EditIcon />
                        </TTIconButton>
                        <TTIconButton
                          size="small"
                          sx={{
                            color: "secondary.main",
                            bgcolor: "error.main",
                            ":hover": {
                              bgcolor: "error.dark",
                            },
                          }}
                          onClick={() => setDeleteDay(TripUtils.getDay(trip, day.id))}
                        >
                          <DeleteIcon />
                        </TTIconButton>
                      </Box>
                    )}
                  </Grid>
                  <Typography>
                    {TimeUtils.formatTime(day.start)} -{" "}
                    {TimeUtils.formatTime(day.end)}{" "}
                    {day.isOverNight ? "overnight" : ""}
                  </Typography>
                  <Typography whiteSpace="pre-line">
                    {day.description}
                  </Typography>
                </>
              ) : (
                <>
                  <Grid container alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      Day {i + 1}
                    </Typography>
                    <ConditionalSuccessIconGroup
                      onClose={() => setEditDay(undefined)}
                      onConfirm={() => handleUpdateDay()}
                      sx={{ ml: "auto", mr: 2 }}
                    />
                  </Grid>
                  <Grid p={2}>
                    <TextField
                      label="Name"
                      value={name}
                      sx={{ ".MuiInputBase-input": { fontWeight: "bold" } }}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container spacing={1} alignItems="center" my={1}>
                        <Grid>
                          <TimePicker
                            label=""
                            value={start}
                            onChange={(value) => setStart(value)}
                          />
                        </Grid>
                        <Grid>to</Grid>
                        <Grid>
                          <TimePicker
                            label=""
                            value={end}
                            onChange={(value) => setEnd(value)}
                          />
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                    <TextField
                      id="day-description"
                      value={description}
                      label="Description"
                      placeholder="description"
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      fullWidth
                      sx={{ width: "50%" }}
                    />
                  </Grid>
                </>
              )}
              <Divider />
            </Box>

            {/* trip attraction orders */}
            <DayTimeline
              day={day}
              dayRoutes={mapRoutes?.at(i) ?? []}
              mapRouteTypes={mapRouteTypes?.at(i) ?? []}
              mapFocusState={mapFocusState}
              setMapFocusState={setMapFocusState}
              updateRoutes={updateRoutes}
              setEditTao={setEditTao}
            />
          </Grid>
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
              Day {(TripUtils.getDayIndex(trip, deleteDay?.id ?? 0) ?? 0) + 1}{" "}
              {deleteDay?.name && `- ${deleteDay?.name}`}
            </strong>
            ?
          </Typography>
        </DeleteConfirmForm>
      </Grid>

      {/* add icon */}
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

      {/* new Day */}
      <DayForm
        name={name}
        description={description}
        start={start}
        end={end}
        setName={setName}
        setDescription={setDescription}
        setStart={setStart}
        setEnd={setEnd}
        open={addDay}
        errorParams={errorParams}
        onClose={clearDayForm}
        onConfirm={handleAddDay}
      />
    </>
  );
};

export default DayContent;
