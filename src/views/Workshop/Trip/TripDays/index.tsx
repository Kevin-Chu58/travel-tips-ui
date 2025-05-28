import {
  Box,
  Divider,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
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
import {
  daysService,
  type Day,
  type TripAttractionOrder,
} from "@services/days";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place";
import DirectionsIcon from "@mui/icons-material/Directions";
import RouteEditor from "@components/RouteEditor";
import ConditionalIconGroup from "@components/ConditionalIconGroup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DayForm from "@components/Forms/DayForm";
import Layouts, {
  Headers,
  WorkShopToDayToolBar,
  WorkshopToNavTab,
} from "@constants/Layouts";
import Map, { type Marker } from "@components/Map";
import type { MapRouteType, OsmType, OsrmRouteType } from "@constants/Maps";
import { osrmService } from "@services/geoMap/osrm";
import TTIconButton from "@components/TTIconButton";
import TimeUtils from "@utils/TimeUtils";
import DayTimeline from "./DayTimeline";
import polyline from "@mapbox/polyline";

dayjs.extend(customParseFormat);

export type OsmFocusState = {
  id: number | undefined;
  type: OsmType | undefined;
};

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
  const [addDay, setAddDay] = useState<boolean>(false);
  const [editDay, setEditDay] = useState<number | undefined>();
  // day focus
  const [onDay, setOnDay] = useState<number | undefined>();
  // map view status
  const [mapView, setMapView] = useState<string>("location");
  // mapping info
  const [markersOnDay, setMarkersOnDay] = useState<Marker[]>([]);
  const [markers, setMarkers] = useState<DayMarkers[]>(); // TODO - change this to something easier to use
  const [mapFocusState, setMapFocusState] = useState<OsmFocusState>({
    id: undefined,
    type: undefined,
  });
  // mapping route
  const [mapRoutes, setMapRoutes] = useState<[number, number][][][] | undefined>();
  const [mapRouteTypes, setMapRouteTypes] = useState<string[][] | undefined>(
    []
  );
  const [routes, setRoutes] = useState<RouteCoordinates | undefined>();
  // day content highlight
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  // others
  const queryClient = useQueryClient();

  type DayMarkers = {
    dayId: number;
    markers: Marker[];
  };

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
      start: TimeUtils.dayjsToString(start),
      end: TimeUtils.dayjsToString(end),
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
      updatedDay!.start = TimeUtils.dayjsToString(start) ?? updatedDay!.start;
      updatedDay!.end = TimeUtils.dayjsToString(end) ?? updatedDay!.end;

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

    let _markers: DayMarkers[] = [];
    trip.days?.map((day) => {
      let markers =
        day.tripAttractionOrders?.map((tao) => ({
          lat: tao.attraction!.lat,
          lng: tao.attraction!.lng,
          label: tao.attraction!.name,
          osmId: tao.attraction!.osmId,
          osmType: tao.attraction!.osmType,
        })) ?? [];

      _markers.push({ dayId: day.id, markers: markers });
    });
    setMarkers(_markers);
  }, [trip, navTabValue]);

  // rerender on onDay to update markersOnDay
  useEffect(() => {
    if (markers) {
      if (onDay) {
        let _markersOnDay = markers?.find((m) => m.dayId === onDay);
        setMarkersOnDay(_markersOnDay!.markers);
      } else {
        let allMarkers = markers.map((dayMarker) => dayMarker.markers).flat();
        setMarkersOnDay(allMarkers);
      }
    }
  }, [onDay, markers]);

  // rerender on isUpdated to update day-content scrollbar position
  useEffect(() => {
    if (mapFocusState.id) {
      let container = document.getElementById("day-content");
      let target = document.getElementById(
        getTaoTimelineId(mapFocusState.id, mapFocusState.type)
      );

      if (container && target) {
        container.scrollTo({
          top:
            target.offsetTop -
            container.offsetTop +
            Headers +
            Layouts.workshopDayToolBar,
          behavior: "smooth",
        });
      }
    }
  }, [isUpdated]);

  /** routes */

  type TaoCoordinates = {
    taoId: number;
    driving?: [number, number][];
    cycling?: [number, number][];
    walking?: [number, number][];
    custom?: [number, number][];
  };

  type DayCoordinates = {
    dayId: number;
    taos: TaoCoordinates[];
  };

  type RouteCoordinates = DayCoordinates[];

  // rerender on markers to init routes if not already
  useEffect(() => {
    const initRoutes = async () => {
      if (markers && !routes) {
        // initate the Route coordinates into routes
        // also inite the map route types from the routes
        let mapRouteTypes: string[][] = [];

        const dayCoords =
          trip!.days?.map(async (day) => {
            // get Day route coordinates
            let mapDayRouteTypes: string[] = [];

            let taoRoutes =
              day.tripAttractionOrders?.map(async (tao, i) => {
                // get Tao route coordinates
                const defaultRouteType = getDefaultRouteType(tao);
                mapDayRouteTypes.push(defaultRouteType!);

                let taoCoords: TaoCoordinates = {
                  taoId: tao.id,
                };
                if (i + 1 < day.tripAttractionOrders!.length) {
                  const nextTao = day.tripAttractionOrders!.at(i + 1);
                  const coords = [
                    [tao.attraction!.lng, tao.attraction!.lat],
                    [nextTao!.attraction!.lng, nextTao!.attraction!.lat],
                  ] as [number, number][];

                  if (defaultRouteType && defaultRouteType !== "custom") {
                    taoCoords[defaultRouteType] = await getOsrmRouteCoords(
                      defaultRouteType,
                      coords
                    );
                  }
                }
                return taoCoords;
              }) ?? [];
              mapRouteTypes.push(mapDayRouteTypes);

            const dayCoords: DayCoordinates = {
              dayId: day.id,
              taos: await Promise.all(taoRoutes),
            };

            return dayCoords;
          }) ?? [];

        const _routes: RouteCoordinates = await Promise.all(dayCoords);
        setRoutes(_routes);

        setMapRouteTypes(mapRouteTypes);
      }
    };
    initRoutes();
  }, [markers]);

  // rerender on mapRouteTypes to update the mapRoute coords
  useEffect(() => {
    if (routes && mapRouteTypes) {
      let _mapRoutes: [number, number][][][] = 
        mapRouteTypes.map((dayRouteTypes, i) => {
          let _dayRoutes = dayRouteTypes.map((taoRouteType, j) => {
            let _coords = routes[i].taos[j][taoRouteType as MapRouteType];
            return _coords ?? [];
          }) ?? [];

          return _dayRoutes;
        }) ?? [];

      setMapRoutes(_mapRoutes);
    }
  }, [mapRouteTypes]);

  const updateRoutes = async (
    dayId: number,
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => {
    if (routes) {
      const dayIndex = routes!.findIndex((day) => day.dayId === dayId);
    const day = routes![dayIndex];
    const taoIndex = day!.taos.findIndex((tao) => tao.taoId === taoId);
    const tao = day.taos[taoIndex];

    // if tao has no coords of a type
    if (tao[type] === undefined) {
      if (type !== "custom") {
        const taoCoords = await getOsrmRouteCoords(type, coords);

        const newRoutes = routes?.map((day) => {
          if (day.dayId !== dayId) return day;

          const updatedTaos = day.taos.map((tao) => {
            if (tao.taoId !== taoId) return tao;

            return {
              ...tao,
              [type]: taoCoords,
            };
          });

          return {
            ...day,
            taos: updatedTaos,
          };
        });

        setRoutes(newRoutes);
      }
      else {
        // TODO - when select custom prefer route
      }
    }

    let newMapRouteTypes = [...mapRouteTypes!];
    newMapRouteTypes[dayIndex][taoIndex] = type;
    setMapRouteTypes(newMapRouteTypes);
    }
  };

  const getDefaultRouteType = (
    tao: TripAttractionOrder
  ): MapRouteType | undefined => {
    if (tao.isDrivePreferred) return "driving";
    if (tao.isBikePreferred) return "cycling";
    if (tao.isOnFootPreferred) return "walking";
    if (tao.preferRoutes.length > 0) return "custom";
  };

  const getOsrmRouteCoords = async (
    type: OsrmRouteType,
    coords: [number, number][]
  ) => {
    const _osrmRoute = await osrmService.getOsrmRoute(type, coords);

    // if only two coords, as it is now, the only one leg will appear in the result
    const routes = _osrmRoute.routes[0].legs[0].steps.flatMap((step) =>
      polyline.decode(step.geometry)
    );

    return routes;
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
      day?.start === TimeUtils.dayjsToString(start) &&
      day?.end === TimeUtils.dayjsToString(end)
    );
  };

  const getTaoTimelineId = (
    osmId: number | undefined,
    osmType: OsmType | undefined
  ) => {
    return `${osmId}/${osmType}`;
  };

  /** day tool bar */

  const handleMapView = (
    _: React.MouseEvent<HTMLElement>,
    newMapView: string
  ) => {
    if (newMapView)
      setMapView(newMapView);
  };

  return (
    <Grid container size={12}>
      {/* day nav tab */}
      {/* <Grid
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
            <ListItem key={`trip-day-${day.id}-nav`} disablePadding>
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
      </Grid> */}

      <Grid
        container
        direction="column"
        size={7}
        maxHeight={`calc(100vh - ${WorkshopToNavTab}px)`}
      >
        {/* tool bar */}
        <Grid
          container
          size={12}
          alignItems="center"
          height={Layouts.workshopDayToolBar}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <ToggleButtonGroup
            value={mapView}
            exclusive
            onChange={handleMapView}
            aria-label="map view"
            sx={{
              ml: "auto",
              mr: 1,
              ".MuiToggleButton-root": {
                color: "white",
                bgcolor: "secondary.900",
                ":hover": {
                  bgcolor: "lightgrey",
                },
                "&.Mui-selected": {
                  color: "white",
                  bgcolor: "primary.main",
                  ":hover": {
                    backgroundColor: "lightgrey",
                  }
                },
                ".MuiSvgIcon-root": {
                  width: 20,
                },
              },
            }}
          >
            <Tooltip title="highlight locations on map" arrow>
              <ToggleButton
                value="location"
                aria-label="location view"
                sx={{ width: 28, height: 28 }}
                disableRipple
              >
                <PlaceIcon />
              </ToggleButton>
            </Tooltip>

            <Tooltip title="highlight routes on map" arrow>
              <ToggleButton
                value="route"
                aria-label="route view"
                sx={{ width: 28, height: 28 }}
                disableRipple
              >
                <DirectionsIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid>

        {/* day content */}
        <Grid
          id="day-content"
          size={12}
          position="sticky"
          maxHeight={`calc(100vh - ${WorkShopToDayToolBar}px)`}
          sx={{ overflowX: "hidden", overflowY: "auto" }}
        >
          {trip?.days?.map((day, i) => (
            <Grid
              key={`trip-day-${day.id}`}
              onMouseEnter={() => setOnDay(day.id)}
              // onMouseLeave={() => setOnDay(undefined)}
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
                    <Grid
                      container
                      size={12}
                      direction="row"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
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
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
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
              <DayTimeline
                day={day}
                mapRouteTypes={mapRouteTypes?.at(i) ?? []}
                mapFocusState={mapFocusState}
                setMapFocusState={setMapFocusState}
                updateRoutes={updateRoutes}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* interactive map */}
      <Grid size={5} borderLeft="1px solid" borderColor="divider">
        <Map
          height="100%"
          markers={markersOnDay}
          mapRoutes={mapRoutes}
          onDay={onDay}
          focusId={mapFocusState.id}
          focusType={mapFocusState.type}
          focusRoute={mapView === "route"}
          setFocusState={setMapFocusState}
          setIsParentUpdated={() => setIsUpdated((prev) => !prev)}
          setMapView={setMapView}
          updateOnMarkerFocus={true}
          openPopUp
        />
      </Grid>

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
