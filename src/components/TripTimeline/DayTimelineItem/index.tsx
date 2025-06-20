import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  type SxProps,
} from "@mui/material";
import type { Day, TripAttractionOrder } from "@services/days";
import { useEffect, useState } from "react";
import type { MapRouteType } from "@constants/Maps";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsIcon from "@mui/icons-material/Directions";
import BuildIcon from "@mui/icons-material/Build";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TimeUtils from "@utils/TimeUtils";
import { getHex } from "@constants/Colors";
import DistanceUtils from "@utils/DistanceUtils";
import TTButtonGroup from "@components/TTButtonGroup";
import type { Route, TaoId } from "@constants/Types";
import TTCard from "@components/TTCard";
import type { RouteOptionParams } from "@constants/Types";
import IdentifierUtils from "@utils/IdentifierUtils";
import NonBlockingPopover from "@components/Popover/NonBlockingPopover";
import TripUtils from "@utils/TripUtils";
import AddTaoButton from "../AddTaoButton";
import { useTaoMutations } from "@react-queries/useTaoQueriers";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import type { TripDetail } from "@services/trips";

const routeOptions: RouteOptionParams[] = [
  {
    name: "car",
    element: <DirectionsCarIcon />,
    routeType: "driving",
  },
  {
    name: "bike",
    element: <DirectionsBikeIcon />,
    routeType: "cycling",
  },
  {
    name: "on foot",
    element: <DirectionsWalkIcon />,
    routeType: "walking",
  },
  {
    name: "custom",
    element: <BuildIcon fontSize="small" />,
    routeType: "custom",
  },
];

type DayTimelineItemProps = {
  trip?: TripDetail;
  queryKey: (string | undefined)[];
  day: Day;
  tao: TripAttractionOrder;
  route?: Route;
  i: number;
  mapRouteType: string;
  cummulatedTimes?: string[];
  mapFocusId?: string;
  setMapFocusId?: (state: string | undefined) => void;
  updateRoutes?: (
    dayId: number,
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => void;
  setEditTao: (state: number | undefined, order?: number) => void;
  readonly?: boolean;
  sx?: SxProps;
};

const DayTimelineItem = ({
  trip,
  day,
  tao,
  route,
  i,
  queryKey,
  cummulatedTimes,
  mapRouteType,
  mapFocusId,
  setMapFocusId = () => {},
  updateRoutes,
  setEditTao,
  readonly = false,
  sx,
}: DayTimelineItemProps) => {
  const [routeType, setRouteType] = useState<MapRouteType | undefined>();
  const [cummulatedTime, setCummulatedTime] = useState<string>();
  const [minDiff, setMinDiff] = useState<number | undefined>();
  const [nextTao, setNextTao] = useState<TripAttractionOrder | undefined>();
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const { mutationRemoveTao } = useTaoMutations({
      trip,
      token,
      editDay: day?.id,
      queryKey,
    });

  const updateTaoRoutes = (type: MapRouteType) => {
    if (nextTao && updateRoutes) {
      const coords = [
        [tao.attraction!.lng, tao.attraction!.lat],
        [nextTao!.attraction!.lng, nextTao!.attraction!.lat],
      ] as [number, number][];
      updateRoutes(day.id, tao.id, type, coords);
    }
  };

  // rerender on certain add or edit updates to the trip
  useEffect(() => {
    setIsUpdated(prev => !prev);
  }, [day.start, day.end, tao.estimateTime, tao.estimateTravelTime]);

  // rerender on day to setup the next tao;
  useEffect(() => {
    if (i + 1 < (day.tripAttractionOrders?.length ?? 0)) {
      const nextTao = day.tripAttractionOrders!.at(i + 1);
      setNextTao(nextTao);
    }
  }, [day]);

  // rerender on mapRouteType to update the route type focused on route button group
  useEffect(() => {
    setRouteType(mapRouteType as MapRouteType);
  }, [mapRouteType]);

  // calculate the cummulatedTime of the day on acummulatedTimes
  useEffect(() => {
    if (cummulatedTimes) {
      setCummulatedTime(cummulatedTimes[i]);
    }
  }, [cummulatedTimes]);

  // rerender on route duration to update minute difference between expected and estimated travel time
  useEffect(() => {
    if (route) {
      setMinDiff(
        TimeUtils.secondToMinute(route.duration!) - tao.estimateTravelTime
      );
    }
  }, [route, isUpdated]);

  const handleDeleteRoute = async () => {
    mutationRemoveTao.mutate({id: tao.id} as TaoId);
  }

  /** route buttons */
  const [routeButtons, setRouteButtons] = useState<RouteOptionParams[]>([]);

  useEffect(() => {
    if (tao) initRoutes();
  }, [tao]);

  const initRoutes = () => {
    let _routeButtons = [];
    if (tao.isDrivePreferred) _routeButtons.push(routeOptions[0]);
    if (tao.isBikePreferred) _routeButtons.push(routeOptions[1]);
    if (tao.isOnFootPreferred) _routeButtons.push(routeOptions[2]);
    if (tao.preferRoutes?.length > 0) _routeButtons.push(routeOptions[3]);

    setRouteButtons(_routeButtons);
  };

  const TimelineItemBase = () => {
    return (
      <TimelineItem
        key={tao.id}
        sx={{
          mr: "auto",
          py: 2,
          width: "100%",
          position: "relative",
          borderRadius: 5,
          ...(TripUtils.isTaoFocused(tao, mapFocusId)
            ? {
                bgcolor: "secondary.100",
                ".MuiTimelineDot-filled, .MuiTimelineConnector-root": {
                  bgcolor: "primary.main",
                },
              }
            : {}),
          ...sx,
        }}
      >
        <TimelineOppositeContent>
          {cummulatedTime && TimeUtils.formatTime(cummulatedTime)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          {i < day.tripAttractionOrders!.length - 1 && <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent flexGrow={1} mb={2} sx={{ minWidth: "75%" }}>
          <Grid size={12} spacing={1}>
            {/* name */}
            <Typography fontWeight="bold">{tao.attraction?.name}</Typography>
            {!readonly && TripUtils.isTaoFocused(tao, mapFocusId) && (
              <Box sx={{ position: "absolute", top: 2, right: 2 }}>
                <NonBlockingPopover>
                  <List disablePadding>
                    <ListItemButton
                      disableRipple
                      onClick={() => setEditTao(tao.id)}
                    >
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body1">Edit</Typography>}
                      />
                    </ListItemButton>
                    <ListItemButton 
                      disableRipple
                      onClick={handleDeleteRoute}
                    >
                      <ListItemIcon>
                        <DeleteIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1">Delete</Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </NonBlockingPopover>
              </Box>
            )}

            {/* tags */}
            <Grid container size={12} py={0.5}>
              <Grid>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  Duration
                </Typography>
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, my: 0.4, width: 2, bgcolor: "primary.main" }}
              />
              <Grid>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {TimeUtils.formatMinutes(tao.estimateTime)}
                </Typography>
              </Grid>
            </Grid>

            {/* address */}
            <Typography variant="body2">{tao.attraction?.address}</Typography>

            {/* highlight */}
            {tao.attraction?.description && (
              <TTCard bgcolor="lightsalmon" title="Highlight">
                <Typography color="white" variant="body2" whiteSpace="pre-wrap">
                  {tao.attraction?.description}
                </Typography>
              </TTCard>
            )}

            {/* routes */}
            {i < day.tripAttractionOrders!.length - 1 && (
              <TTCard
                bgcolor="steelblue"
                darkBg={true}
                icon={
                  <DirectionsIcon
                    sx={{ width: 20, height: 20, color: "white" }}
                  />
                }
                title="To Next Attraction"
              >
                <Grid size={12} mt={1}>
                  <TTButtonGroup
                    items={routeButtons}
                    focus={routeType}
                    focusParam="routeType"
                    onClick={updateTaoRoutes}
                  />
                </Grid>

                <Grid container size={12}>
                  {route && minDiff && (
                    <>
                      <Grid size={6}>
                        <Typography variant="body2" color="white">
                          Distance:
                        </Typography>
                      </Grid>
                      <Grid container size={6} spacing={1}>
                        <Box>
                          <Typography variant="body2" color="white">
                            {DistanceUtils.meterToKm(route.distance!)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            color="white"
                            px={1}
                            borderRadius={20}
                            fontWeight="bold"
                            bgcolor={getHex("dimgray")}
                          >
                            {routeType ?? "- - - - - -"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="white">
                          Expected Time:
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="white">
                          {TimeUtils.formatMinutes(tao.estimateTravelTime)}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="white">
                          Estimated Time:
                        </Typography>
                      </Grid>
                      <Grid container size={6} spacing={1}>
                        <Box>
                          <Typography variant="body2" color="white">
                            {TimeUtils.secondToMinuteStr(route.duration!)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="white"
                            px={1}
                            borderRadius={20}
                            bgcolor={
                              minDiff > 0
                                ? getHex("darkred")
                                : getHex("darkgreen")
                            }
                          >
                            {TimeUtils.formatTimeDiff(minDiff)}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </TTCard>
            )}
          </Grid>
        </TimelineContent>
      </TimelineItem>
    );
  };

  return (
    <Box
      id={IdentifierUtils.getTaoTimelineItemId(tao)}
      m={0}
      p={0}
      sx={{
        position: "relative",
        height: "100%",
      }}
      onMouseEnter={() => {
        setMapFocusId(IdentifierUtils.getTaoTimelineItemId(tao));
      }}
      onMouseLeave={() => {
        setMapFocusId(undefined);
      }}
    >
      {!readonly && TripUtils.isTaoFocused(tao, mapFocusId) ? (
        <Box sx={{position: "relative"}} m={0} p={0} display="flex" justifyContent="center">
          <AddTaoButton
            onClick={() => setEditTao(undefined, i)}
            sx={{ position: "absolute", top: -16, ml: "auto", zIndex: 5 }}
          />
          <TimelineItemBase/>
          <AddTaoButton
            onClick={() => setEditTao(undefined, i+1)}
            sx={{ position: "absolute", bottom: -16, zIndex: 5 }}
          />
        </Box>
      ) : (
        <TimelineItemBase/>
      )}
    </Box>
  );
};

export default DayTimelineItem;
