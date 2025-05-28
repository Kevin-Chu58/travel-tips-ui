import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import type { OsmFocusState } from "../..";
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
import StyleUtils from "@utils/StyleUtils";

type RouteOptionParams = {
  name: string;
  element: JSX.Element;
  routeType: MapRouteType;
};

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

type RoutesButtonGroupProps = {
  tao: TripAttractionOrder;
  routeType?: MapRouteType;
  updateRoutes: (type: MapRouteType) => void;
};

const RoutesButtonGroup = ({
  tao,
  routeType,
  updateRoutes,
}: RoutesButtonGroupProps) => {
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
    <ButtonGroup>
      {routeButtons.map((r) => (
        <Button
          key={r.name}
          size="small"
          color="secondary"
          variant={routeType === r.routeType ? "contained" : "outlined"}
          onClick={() => updateRoutes(r.routeType)}
          disableRipple
        >
          {r.element}
        </Button>
      ))}
    </ButtonGroup>
  );
};

type DayTimelineItemProps = {
  day: Day;
  tao: TripAttractionOrder;
  i: number;
  cummulatedTimes: string[];
  mapRouteType: string;
  setCummulatedTimes: (state: string[]) => void;
  mapFocusState: OsmFocusState;
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
  i,
  cummulatedTimes,
  mapRouteType,
  setCummulatedTimes,
  mapFocusState,
  setMapFocusState = () => {},
  updateRoutes,
}: DayTimelineItemProps) => {
  const [routeType, setRouteType] = useState<MapRouteType | undefined>();
  const [cummulatedTime, setCummulatedTime] = useState<string>();

  const updateTaoRoutes = (type: MapRouteType) => {
    if (i + 1 < day.tripAttractionOrders!.length) {
      const nextTao = day.tripAttractionOrders!.at(i + 1);
      const coords = [
        [tao.attraction!.lng, tao.attraction!.lat],
        [nextTao!.attraction!.lng, nextTao!.attraction!.lat],
      ] as [number, number][];
      updateRoutes(tao.id, type, coords);
    }
  };

  // rerender on mapRouteType to update the route type focused on route button group
  useEffect(() => {
    setRouteType(mapRouteType as MapRouteType);
  }, [mapRouteType]);

  // calculate the cummulatedTime of the day on cummulatedTimes
  useEffect(() => {
    let cummulatedTime = cummulatedTimes.at(i)!;
    setCummulatedTime(cummulatedTime);

    if (cummulatedTimes.length === i + 1) {
      let cummulatedTimeNext = TimeUtils.addMinutesToTime(
        cummulatedTime,
        tao.estimateTime + tao.estimateTravelTime
      );
      setCummulatedTimes([...cummulatedTimes, cummulatedTimeNext]);
    }
  }, [cummulatedTimes]);

  const getTaoTimelineItemId = (
    osmId: number | undefined,
    osmType: OsmType | undefined
  ) => {
    return `${osmId}/${osmType}`;
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
        ...(tao.attraction?.osmId === mapFocusState.id &&
        tao.attraction?.osmType === mapFocusState.type
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
            <Grid
              size={12}
              borderRadius={2}
              my={1}
              p={1}
              // width="80%"
              sx={{
                background: StyleUtils.generateLinearGradientDarker(
                  getHex("lightsalmon")!
                ),
              }}
            >
              <Grid container size={12} width="100%" alignItems="center" mb={1}>
                <Typography color="white" variant="body1" fontWeight="bold">
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
            <Grid
              container
              size={12}
              mt={2}
              p={1}
              borderRadius={2}
              sx={{
                background: StyleUtils.generateLinearGradientLighter(
                  getHex("steelblue")!
                ),
              }}
            >
              <Grid container size={12} direction="row" alignItems="center">
                <DirectionsIcon
                  sx={{ width: 20, height: 20, color: "white" }}
                />
                <Grid>
                  <Typography variant="body1" fontWeight="bold" color="white">
                    To Next Attraction
                  </Typography>
                </Grid>
              </Grid>

              <Grid container size={12}>
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
                    Ways of Travel:
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2" color="white">
                    {routeType ?? "- - - - - -"}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2" color="white">
                    Estimated Time:
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2" color="white">
                    time
                  </Typography>
                </Grid>
                <Grid size={12} mt={1}>
                  <RoutesButtonGroup
                    key={tao.id}
                    tao={tao}
                    routeType={routeType}
                    updateRoutes={updateTaoRoutes}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </TimelineContent>
    </TimelineItem>
  );
};

export default DayTimelineItem;
