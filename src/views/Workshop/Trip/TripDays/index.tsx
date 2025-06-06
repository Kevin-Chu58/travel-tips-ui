import { Grid } from "@mui/material";
import { type TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { type Day, type TripAttractionOrder } from "@services/days";
import PlaceIcon from "@mui/icons-material/Place";
import DirectionsIcon from "@mui/icons-material/Directions";
import { Headers, WorkshopToNavTab } from "@constants/Layouts";
import Map from "@components/Map";
import type { MapRouteType } from "@constants/Maps";
import { osrmService, type OsrmRoute } from "@services/geoMap/osrm";
import polyline from "@mapbox/polyline";
import DayContent from "@components/Content/DayContent";
import type {
  DayMarkers,
  DayRoutes,
  Marker,
  OsmFocusState,
  Route,
  RouteRoutes,
  TaoRoutes,
} from "@constants/Types";
import IdentifierUtils from "@utils/IdentifierUtils";
import MapButtonGroup from "@components/ButtonGroup/MapButtonGroup";

dayjs.extend(customParseFormat);

type TripDaysProps = {
  trip: TripDetail | undefined;
  token: string | null;
  queryKey: (string | undefined)[];
  navTabValue: number;
};

const TripDays = ({ trip, token, queryKey, navTabValue }: TripDaysProps) => {
  // day focus
  const [onDay, setOnDay] = useState<Day | undefined>();
  // map view status
  const [mapView, setMapView] = useState<string>("location");
  // mapping info
  const [markersOnDay, setMarkersOnDay] = useState<Marker[]>([]);
  const [markers, setMarkers] = useState<DayMarkers[]>();
  const [mapFocusState, setMapFocusState] = useState<OsmFocusState>({
    id: undefined,
    type: undefined,
    order: undefined,
  });
  // mapping route
  const [mapRoutes, setMapRoutes] = useState<Route[][] | undefined>();
  const [mapRouteTypes, setMapRouteTypes] = useState<string[][] | undefined>(
    []
  );
  const [routes, setRoutes] = useState<RouteRoutes | undefined>();
  // day content highlight
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  // update when Tao updates
  const [isTaoUpdated, setIsTaoUpdated] = useState<boolean>(false);

  /** useEffect */

  // rerender on trip and nav tab switching to update marker info
  useEffect(() => {
    if (!trip) return;

    let _markers: DayMarkers[] = [];
    trip.days?.forEach((day) => {
      let markers =
        day.tripAttractionOrders?.map((tao) => ({
          lat: tao.attraction!.lat,
          lng: tao.attraction!.lng,
          label: tao.attraction!.name,
          osmId: tao.attraction!.osmId,
          osmType: tao.attraction!.osmType,
          order: tao.order,
        })) ?? [];

      _markers.push({ dayId: day.id, markers: markers });
    });
    setMarkers(_markers);
  }, [trip, navTabValue]);

  // rerender on onDay to update markersOnDay
  useEffect(() => {
    if (markers) {
      if (onDay) {
        let _markersOnDay = markers?.find((m) => m.dayId === onDay?.id);
        if (_markersOnDay) setMarkersOnDay(_markersOnDay.markers);
      } else {
        let allMarkers = markers.map((dayMarker) => dayMarker.markers).flat();
        setMarkersOnDay(allMarkers);
      }
    }
  }, [onDay, markers]);

  // rerender on isUpdated to update day-content scrollbar position
  useEffect(() => {
    if (mapFocusState.id) {
      requestAnimationFrame(() => {
        let container = document.getElementById("day-content");
        let target = document.getElementById(
          IdentifierUtils.getTaoTimelineItemId(
            mapFocusState.id,
            mapFocusState.type
          )
        );

        if (container && target) {
          container.scrollTo({
            top: target.offsetTop - container.offsetTop,
            behavior: "smooth",
          });
        }
      })
    }
  }, [isUpdated]);

  /** routes */

  // rerender on markers to init routes if not already
  useEffect(() => {
    initRoutes();
  }, [markers, isTaoUpdated]);

  // rerender on mapRouteTypes to update the mapRoute coords
  useEffect(() => {
    if (routes && mapRouteTypes) {
      let _mapRoutes: Route[][] = mapRouteTypes.map((dayRouteTypes, i) => {
        let _dayRoutes = dayRouteTypes.map((taoRouteType, j) => {
          let _route = routes[i].taos[j][taoRouteType as MapRouteType];
          return _route!;
        });

        return _dayRoutes;
      });

      setMapRoutes(_mapRoutes);
    }
  }, [mapRouteTypes]);

  const initRoutes = async () => {
    if (markers) {
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

              let taoCoords: TaoRoutes = {
                taoId: tao.id,
              };
              if (i + 1 < day.tripAttractionOrders!.length) {
                const nextTao = day.tripAttractionOrders!.at(i + 1);
                const coords = [
                  [tao.attraction!.lng, tao.attraction!.lat],
                  [nextTao!.attraction!.lng, nextTao!.attraction!.lat],
                ] as [number, number][];

                if (defaultRouteType && defaultRouteType !== "custom") {
                  const route = await osrmService.getOsrmRoute(
                    defaultRouteType,
                    coords
                  );

                  const routeCoords = decodeOsrmRouteCoords(route);

                  taoCoords[defaultRouteType] = {
                    coords: routeCoords,
                    distance: route.routes[0].distance,
                    duration: route.routes[0].duration,
                  };
                }
              }
              return taoCoords;
            }) ?? [];
          mapRouteTypes.push(mapDayRouteTypes);

          const dayCoords: DayRoutes = {
            dayId: day.id,
            taos: await Promise.all(taoRoutes),
          };

          return dayCoords;
        }) ?? [];

      const _routes: RouteRoutes = await Promise.all(dayCoords);
      setRoutes(_routes);

      setMapRouteTypes(mapRouteTypes);
    }
  };

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
          const taoRoutes = await osrmService.getOsrmRoute(type, coords);
          const taoCoords = decodeOsrmRouteCoords(taoRoutes);

          const newRoutes = routes?.map((day) => {
            if (day.dayId !== dayId) return day;

            const updatedTaos = day.taos.map((tao) => {
              if (tao.taoId !== taoId) return tao;

              return {
                ...tao,
                [type]: {
                  coords: taoCoords,
                  distance: taoRoutes.routes[0].distance,
                  duration: taoRoutes.routes[0].duration,
                },
              };
            });

            return {
              ...day,
              taos: updatedTaos,
            };
          });

          setRoutes(newRoutes);
        } else {
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

  const decodeOsrmRouteCoords = (osrmRoute: OsrmRoute) => {
    const routes = polyline.decode(osrmRoute.routes[0].geometry);

    return routes;
  };

  /** day tool bar */

  const mapViews = [
    {
      viewType: "location",
      icon: PlaceIcon,
    },
    {
      viewType: "route",
      icon: DirectionsIcon,
    },
  ];

  return (
    <Grid container size={12} position="relative">
      <Grid
        container
        direction="column"
        position="relative"
        size={7}
        height={`calc(100vh - ${WorkshopToNavTab}px)`}
      >
        {/* day content */}
        <DayContent
          trip={trip}
          token={token}
          queryKey={queryKey}
          onDay={onDay}
          setOnDay={setOnDay}
          mapRoutes={mapRoutes}
          mapRouteTypes={mapRouteTypes}
          mapFocusState={mapFocusState}
          setMapFocusState={setMapFocusState}
          updateRoutes={updateRoutes}
          renderRoutes={() => setIsTaoUpdated((prev) => !prev)}
        />
      </Grid>

      {/* interactive map */}
      <Grid
        size={5}
        borderLeft="1px solid"
        borderColor="divider"
        position="relative"
      >
        <Map
          height="100%"
          markers={markersOnDay}
          mapRoutes={mapRoutes}
          onDay={onDay?.id}
          focusId={mapFocusState.id}
          focusType={mapFocusState.type}
          focusOrder={mapFocusState.order}
          focusRoute={mapView === "route"}
          setFocusState={setMapFocusState}
          setIsParentUpdated={() => setIsUpdated((prev) => !prev)}
          setMapView={setMapView}
          updateOnMarkerFocus={true}
          openPopUp
        />
        <MapButtonGroup
          mapViews={mapViews}
          mapView={mapView}
          setMapView={setMapView}
          top={10}
          right={10}
        />
      </Grid>
    </Grid>
  );
};

export default TripDays;
