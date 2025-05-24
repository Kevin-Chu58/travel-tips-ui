import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { type TripDetail } from "@services/trips";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { daysService, type Day } from "@services/days";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import RouteEditor from "@components/RouteEditor";
import ConditionalIconGroup from "@components/ConditionalIconGroup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DayForm from "@components/Forms/DayForm";
import { WorkshopToNavTab } from "@constants/Layouts";
import TimeUtils from "@utils/TimeUtils";
import Map, { type Marker } from "@components/Map";
import MapIcon from "@mui/icons-material/Map";
import { HM, HMA, HMS } from "@constants/times";
import type { OsrmRouteType } from "@constants/Maps";
import { osrmService } from "@services/geoMap/osrm";
import TTIconButton from "@components/TTIconButton";
import StyleUtils from "@utils/StyleUtils";
import { getHex } from "@constants/Colors";

dayjs.extend(customParseFormat);

type TripDaysProps = {
  trip: TripDetail | undefined;
  token: string | null;
  queryKey: (string | undefined)[];
  navTabValue: number;
};

const TripDays = ({ trip, token, queryKey, navTabValue }: TripDaysProps) => {
  // constants
  const startDefault = dayjs().hour(8).minute(0).second(0);
  const endDefault = dayjs().hour(20).minute(0).second(0);
  // day form attributes
  const [name, setName] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [start, setStart] = useState<Dayjs | null>(startDefault);
  const [end, setEnd] = useState<Dayjs | null>(endDefault);
  const [errorParams, setErrorParams] = useState<string[]>([]);
  // open form status
  const [openMap, setOpenMap] = useState<boolean>(true);
  const [addDay, setAddDay] = useState<boolean>(false);
  const [editDay, setEditDay] = useState<number | undefined>();
  // mapping info
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isMapUpdated, setIsMapUpdated] = useState<boolean>(false);
  // others
  const queryClient = useQueryClient();

  /** query functions - osrm routes */

  type OsrmRouteParams = {
    type: OsrmRouteType;
    lnglats: number[][];
    steps?: boolean;
  };

  const getOsrmRoute = async ({
    type,
    lnglats,
    steps = true,
  }: OsrmRouteParams) => {
    return await osrmService.getOsrmRoute(type, lnglats, steps);
  };

  // const { data: route } = useQuery({
  //   queryKey: ["route", {type: "driving", lnglats: trip?.days[0].tripAttractionOrders?.map(tao => tao.attraction.)}],
  //   queryFn: ({queryKey}) => {
  //   const [, params] = queryKey as [string, OsrmRouteParams];
  //   return getOsrmRoute(params);
  // },
  //   enabled: !!trip,
  // });

  /** query functions - trip.day */

  type DayId = {
    id?: number;
  };

  type DayParams = DayId & {
    name: string | undefined;
    description: string | undefined;
    start: Dayjs | null;
    end: Dayjs | null;
  };

  const getDayForm = ({ name, description, start, end }: DayParams) => {
    return {
      tripId: trip!.id,
      name: name,
      description: description,
      start: dayjsToString(start),
      end: dayjsToString(end),
    };
  };

  const postNewDay = async ({ name, description, start, end }: DayParams) => {
    return await daysService.postNewDay(
      getDayForm({ name, description, start, end }),
      token!
    );
  };

  const updateDay = async ({
    id,
    name,
    description,
    start,
    end,
  }: DayParams) => {
    return await daysService.patchDay(
      id!,
      getDayForm({ name, description, start, end }),
      token!
    );
  };

  const deleteDay = async ({ id }: DayId) => {
    return await daysService.deleteDay(id!, token!);
  };

  const mutationAddDay = useMutation({
    mutationFn: ({ name, description, start, end }: DayParams) =>
      postNewDay({ name, description, start, end }),
    onSuccess: (day) => {
      let newDays = [...trip!.days!, day];
      queryClient.setQueryData(queryKey, (oldData: TripDetail) => ({
        ...oldData,
        days: newDays,
      }));
    },
  });

  const mutationDay = useMutation({
    mutationFn: ({ id, name, description, start, end }: DayParams) =>
      updateDay({ id, name, description, start, end }),
    onMutate: () => {
      const previousTrip = queryClient.getQueryData(queryKey);

      let updatedDay = trip!.days!.find((day) => day.id === editDay);
      updatedDay!.name = name;
      updatedDay!.description = description;
      updatedDay!.start = dayjsToString(start) ?? updatedDay!.start;
      updatedDay!.end = dayjsToString(end) ?? updatedDay!.end;

      let updatedDayIndex = trip!.days!.findIndex((day) => day.id === editDay);
      let updatedDays = trip!.days!;
      updatedDays[updatedDayIndex] = updatedDay!;

      queryClient.setQueryData(queryKey, (oldData: TripDetail) => ({
        ...oldData,
        days: updatedDays,
      }));

      return { previousTrip };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(queryKey, context.previousTrip);
      }
    },

    onSuccess: (updatedDay) => {
      let updatedDayIndex = trip!.days!.findIndex((day) => day.id === editDay);
      let updatedDays = trip!.days!;

      updatedDay.tripAttractionOrders =
        updatedDays[updatedDayIndex].tripAttractionOrders;
      updatedDays[updatedDayIndex] = updatedDay;

      queryClient.setQueryData(queryKey, (oldData: TripDetail) => ({
        ...oldData,
        days: updatedDays,
      }));
    },
  });

  const mutationRemoveDay = useMutation({
    mutationFn: ({ id }: DayId) => deleteDay({ id }),
    onMutate: () => {
      const previousTrip = queryClient.getQueryData(queryKey);

      let updatedDayIndex = trip!.days!.findIndex((day) => day.id === editDay);
      let updatedDays = trip!.days;
      updatedDays!.splice(updatedDayIndex, 1);

      queryClient.setQueryData(queryKey, (oldData: TripDetail) => ({
        ...oldData,
        days: updatedDays,
      }));

      return { previousTrip };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(queryKey, context.previousTrip);
      }
    },
  });

  /** useEffect */

  // rerender on addDay to update day form attributes
  useEffect(() => {
    if (addDay) initAddDayForm();
    else clearDayForm();
  }, [addDay]);

  // rerender on editDay to update day form attributes
  useEffect(() => {
    if (editDay) initEditDayForm(getDay(editDay));
    else clearDayForm();
  }, [editDay]);

  // rerender on trip and nav tab switching to update marker info
  useEffect(() => {
    if (!trip) return;

    const markers =
      trip.days?.flatMap(
        (day) =>
          day.tripAttractionOrders?.map((tao) => ({
            lat: tao.attraction!.lat,
            lng: tao.attraction!.lng,
            label: tao.attraction!.name,
            osmId: tao.attraction!.osmId,
            osmType: tao.attraction!.osmType,
          })) ?? []
      ) ?? [];

    setMarkers(markers);
  }, [trip, navTabValue]);

  // renreder on marker info to update map markers
  useEffect(() => {
    setIsMapUpdated((prev) => !prev);
  }, [markers]);

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
      setStart(stringToDayjs(day.start));
      setEnd(stringToDayjs(day.end));
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

  const handleDeleteDay = async (id: number) => {
    mutationRemoveDay.mutate({ id });
  };

  const getDay = (id: number) => {
    return trip?.days?.find((day) => day.id === id);
  };

  const handleAddDay = async () => {
    let invalidParams = isDayValid();
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      mutationAddDay.mutate({ name, description, start, end });
      clearDayForm();
    }
  };

  const handleUpdateDay = async () => {
    let invalidParams = isDayValid();
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      if (!isDayUnchanged())
        mutationDay.mutate({ id: editDay, name, description, start, end });
      setEditDay(undefined);
    }
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
    const day = getDay(editDay!);
    return (
      day?.name === name?.trim() &&
      day?.description === description?.trim() &&
      day?.start === dayjsToString(start) &&
      day?.end === dayjsToString(end)
    );
  };

  const dayjsToString = (time: Dayjs | null) => {
    // time might be undefined, which is caused by accessing start and end states
    // before initEditDayForm() setups everything
    return time?.format(HMS) ?? "";
  };

  const stringToDayjs = (time: string) => {
    return dayjs(time, HMS);
  };

  const formatTime = (time: string, ampm: boolean = true) => {
    return dayjs(time, HM).format(ampm ? HMA : HM);
  };

  /** sub components */

  const DayTimeline = ({ day }: { day: Day }) => {
    let cummulatedTimes: string[] = [];
    return (
      <Timeline
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
        {day.tripAttractionOrders?.map((tao, i) => {
          let previousTao = day.tripAttractionOrders?.[i - 1];
          let cummulatedTime =
            i === 0
              ? day.start
              : TimeUtils.addMinutesToTime(
                  cummulatedTimes.at(-1)!,
                  previousTao!.estimateTime + previousTao!.estimateTravelTime
                );
          cummulatedTimes.push(cummulatedTime);
          return (
            <TimelineItem
              key={tao.id}
              sx={{
                py: 1,
                ":hover": {
                  borderRadius: 5,
                  bgcolor: "secondary.100",
                  ".MuiTimelineDot-filled, .MuiTimelineConnector-root": {
                    bgcolor: "primary.main",
                  },
                },
              }}
            >
              <TimelineOppositeContent>
                {formatTime(cummulatedTime)}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                {i < day.tripAttractionOrders!.length - 1 && (
                  <TimelineConnector />
                )}
              </TimelineSeparator>
              <TimelineContent flexGrow={1} mb={2} sx={{ minWidth: "95%" }}>
                <Grid size={12} spacing={1}>
                  {/* name */}
                  <Typography fontWeight="bold">
                    {tao.attraction?.name}
                  </Typography>

                  {/* tags */}
                  <Grid container size={12} py={0.5}>
                    <Grid>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight="bold"
                      >
                        Duration
                      </Typography>
                    </Grid>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ mx: 1, my: 0.4, width: 2, bgcolor: "primary.main" }}
                    />
                    <Grid>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight="bold"
                      >
                        {TimeUtils.formatMinutes(tao.estimateTime)}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* address */}
                  <Typography variant="body2">
                    {tao.attraction?.address}
                  </Typography>

                  {/* highlight */}
                  {tao.attraction?.description && (
                    <Grid
                      size={12}
                      borderRadius={2}
                      my={1}
                      p={1}
                      sx={{
                        background: StyleUtils.generateLinearGradientDarker(
                          getHex("salmon")!
                        ),
                      }}
                    >
                      <Grid
                        container
                        size={12}
                        width="100%"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography
                          color="white"
                          variant="body1"
                          fontWeight="bold"
                        >
                          Highlight
                        </Typography>
                        <Avatar sx={{ width: 24, height: 24, ml: "auto" }} />
                      </Grid>
                      <Typography color="white" variant="body2">
                        {tao.attraction?.description}
                      </Typography>
                    </Grid>
                  )}

                  {/* routes */}
                  {i < day.tripAttractionOrders!.length - 1 && (
                    <Grid container size={12} mt={2}>
                      <Grid>
                        <DirectionsWalkIcon
                          color="info"
                          sx={{ width: 20, height: 20 }}
                        />
                      </Grid>
                      <Grid>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="info"
                        >
                          To Next Attraction
                        </Typography>
                      </Grid>

                      <Grid container size={12} ml={2}>
                        <Grid size={6}>
                          <Typography variant="body2">
                            Estimated Travel Time:
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2">
                            {TimeUtils.formatMinutes(tao.estimateTravelTime)}
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2">
                            Ways of Travel:
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2">
                            TODO..................................
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    );
  };

  return (
    <Grid container size={12} columns={14}>
      {/* day nav tab */}
      <Grid
        container
        direction="column"
        size={2}
        pt={2}
        flexGrow={1}
        flexWrap="nowrap"
        sx={{
          borderRight: "1px solid",
          borderColor: "divider",
          maxHeight: `calc(100vh - ${WorkshopToNavTab}px)`,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <List sx={{ p: 0, pb: 2 }}>
          {trip?.days?.map((day, i) => (
            <ListItem key={`trip-day-${i}-nav`} disablePadding>
              <ListItemButton disableRipple>
                <ListItemText primary={`Day ${i + 1}`} />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteDay(day.id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key={`trip-day-add`} disablePadding>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setAddDay(true)}
              sx={{ mx: "auto" }}
            >
              new day
            </Button>
          </ListItem>
        </List>
      </Grid>

      {/* day content */}
      <Grid
        container
        direction="column"
        size={openMap ? 6 : 12}
        pb={4}
        flexWrap="nowrap"
        maxHeight={`calc(100vh - ${WorkshopToNavTab}px)`}
        sx={{ overflowX: "hidden", overflowY: "auto", position: "relative" }}
      >
        {trip?.days?.map((day, i) => (
          <Grid key={`trip-day-${i}`} size={12} width="100%">
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
                  </Grid>
                  <Typography>
                    {formatTime(day.start)} - {formatTime(day.end)}{" "}
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
                    <ConditionalIconGroup
                      onClose={() => setEditDay(undefined)}
                      onConfirm={() => handleUpdateDay()}
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
                      id="day--description"
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
            <DayTimeline day={day} />
          </Grid>
        ))}
      </Grid>

      {/* interactive map */}
      {openMap && (
        <Grid size={6} borderLeft="1px solid" borderColor="divider">
          <Map height="100%" markers={markers} isUpdated={isMapUpdated} />
        </Grid>
      )}

      <Box position="absolute" bottom={20} right={20} zIndex={1000}>
        {openMap ? (
          <Fab
            color="primary"
            aria-label="map"
            disableRipple
            onClick={() => setOpenMap(false)}
          >
            <CloseIcon />
          </Fab>
        ) : (
          <Fab
            color="primary"
            aria-label="map"
            disableRipple
            onClick={() => setOpenMap(true)}
          >
            <MapIcon />
          </Fab>
        )}
      </Box>

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

      {/* route editor */}
      {/* <RouteEditor
        tripDetail={trip}
        open={Boolean(editTao)}
        setOpen={setEditTao}
        token={token}
        render={() => {}}
      /> */}
    </Grid>
  );
};

export default TripDays;
