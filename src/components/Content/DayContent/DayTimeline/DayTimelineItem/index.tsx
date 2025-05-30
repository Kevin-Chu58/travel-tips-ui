import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Box, Divider, Grid, Typography } from "@mui/material";
import type { Day, TripAttractionOrder } from "@services/days";
import { useEffect, useState, type JSX } from "react";
import type { MapRouteType, OsmType } from "@constants/Maps";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsIcon from "@mui/icons-material/Directions";
import BuildIcon from "@mui/icons-material/Build";
import TimeUtils from "@utils/TimeUtils";
import { getHex } from "@constants/Colors";
import DistanceUtils from "@utils/DistanceUtils";
import TTButtonGroup from "@components/TTButtonGroup";
import type { OsmFocusState, Route } from "@views/Workshop/Trip/TripDays";
import TTCard from "@components/TTCard";
import type { RouteOptionParams } from "@constants/Types";

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
  day: Day;
  tao: TripAttractionOrder;
  route?: Route;
  i: number;
  acummulatedTimes: string[];
  mapRouteType: string;
  setAcummulatedTimes: (state: string[]) => void;
  mapFocusState?: OsmFocusState;
  setMapFocusState?: (state: OsmFocusState) => void;
  updateRoutes: (
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => void;
};

const DayTimelineItem = ({
  day,
  tao,
  route,
  i,
  acummulatedTimes,
  mapRouteType,
  setAcummulatedTimes,
  mapFocusState,
  setMapFocusState = () => {},
  updateRoutes,
}: DayTimelineItemProps) => {
  const [routeType, setRouteType] = useState<MapRouteType | undefined>();
  const [cummulatedTime, setCummulatedTime] = useState<string>();
  const [minDiff, setMinDiff] = useState<number | undefined>();
  const [nextTao, setNextTao] = useState<TripAttractionOrder | undefined>();

  const updateTaoRoutes = (type: MapRouteType) => {
    if (nextTao) {
      const coords = [
        [tao.attraction!.lng, tao.attraction!.lat],
        [nextTao!.attraction!.lng, nextTao!.attraction!.lat],
      ] as [number, number][];
      updateRoutes(tao.id, type, coords);
    }
  };

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
    let cummulatedTime = acummulatedTimes.at(i)!;
    setCummulatedTime(cummulatedTime);

    if (acummulatedTimes.length === i + 1) {
      let cummulatedTimeNext = TimeUtils.addMinutesToTime(
        cummulatedTime,
        tao.estimateTime + tao.estimateTravelTime
      );
      setAcummulatedTimes([...acummulatedTimes, cummulatedTimeNext]);
    }
  }, [acummulatedTimes]);

  // rerender on route to update minute difference between expected and estimated travel time
  useEffect(() => {
    if (route) {
      setMinDiff(
        TimeUtils.secondToMinute(route.duration!) - tao.estimateTravelTime
      );
    }
  }, [route]);

  const getTaoTimelineItemId = (
    osmId: number | undefined,
    osmType: OsmType | undefined
  ) => {
    return `${osmId}/${osmType}`;
  };

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

  return (
    <TimelineItem
      key={tao.id}
      id={getTaoTimelineItemId(tao.attraction?.osmId, tao.attraction?.osmType)}
      onMouseEnter={() => {
        setMapFocusState({
          id: tao.attraction?.osmId,
          type: tao.attraction?.osmType,
        });
      }}
      onMouseLeave={() => {
        setMapFocusState({
          id: undefined,
          type: undefined,
        });
      }}
      sx={{
        py: 1,
        borderRadius: 5,
        ...(tao.attraction?.osmId === mapFocusState?.id &&
        tao.attraction?.osmType === mapFocusState?.type
          ? {
              bgcolor: "secondary.100",
              ".MuiTimelineDot-filled, .MuiTimelineConnector-root": {
                bgcolor: "primary.main",
              },
            }
          : {}),
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
            <TTCard
              bgcolor="lightsalmon"
              title="Highlight"
            >
              <Typography color="white" variant="body2">
                {tao.attraction?.description}
              </Typography>
            </TTCard>
          )}

          {/* routes */}
          {i < day.tripAttractionOrders!.length - 1 && (
            <TTCard
              bgcolor="steelblue"
              darkBg={true}
              icon={<DirectionsIcon
                  sx={{ width: 20, height: 20, color: "white" }}
                />}
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
                        <Typography variant="body2" color="white" >
                        {DistanceUtils.meterToKm(route.distance!)}
                      </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="white" px={1}
                          borderRadius={20}
                          fontWeight="bold"
                          bgcolor={getHex("dimgray")}>
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

export default DayTimelineItem;
