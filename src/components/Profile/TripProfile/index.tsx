import type { GeoCoordinate } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import { Box } from "@mui/material";
import { type Trip, tripsService } from "@services/trips";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router";
import { daysService, type Day } from "@services/days";
import { taosService, type Tao, type TaoGeo } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import {
  hereMapService,
  type HereRoutingResponse,
} from "@services/hereMap/hereMap";
import UIShowButton from "@components/Button/UIShowButton";
import TimeUtils from "@utils/TimeUtils";
import {
  wikiCommonsService,
  type WikiImage,
} from "@services/wikiCommons/wikiCommons";
import { isEqual } from "lodash-es";
import TripShareForm from "@components/Forms/TripShareForm";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import TripHeader from "./TripHeader";
import NameComponent from "./NameComponent";
import DayOverviewComponent from "./DayOverviewComponent";
import TaoComponent from "./TaoComponent";
import FabComponent from "./FabComponent";
import DescriptionComponent from "./DescriptionComponent";
import DayComponent from "./DayComponent";
import Mapper from "@components/Map";
import TripPdfForm from "@components/Forms/TripPdfForm";
import clsx from "clsx";
import "./index.scss";

type TripProfileProps = {
  readonly?: boolean;
};

const TripProfile = ({ readonly = false }: TripProfileProps) => {
  // window
  const isMobile = useIsMobile();
  // trip basic
  const [tripBasic, setTripBasic] = useState<Trip | undefined>();
  // days
  const [days, setDays] = useState<Day[]>([]);
  // day
  const [day, setDay] = useState<Day | undefined>();
  // taoGeos
  const [taoGeos, setTaoGeos] = useState<TaoGeo[]>([]);
  const [dayOverviewFocus, setDayOverviewFocus] = useState<number>(0);
  // taos
  const taosMapRef = useRef(new Map<number, Tao[]>()); // day.id => tao[]
  const [taos, setTaos] = useState<Tao[] | undefined>();
  // tao
  const [tao, setTao] = useState<Tao | undefined>();
  // attraction wiki images
  const wikiImagesMapRef = useRef(new Map<number, WikiImage[]>()); // attraction.id => wikiImage[]
  const [wikiImages, setWikiImages] = useState<WikiImage[]>([]);
  // map
  const routeResponsesMapRef = useRef(new Map<number, HereRoutingResponse[]>()); // day.id => routing response[]
  const [routeResponses, setRouteResponses] = useState<
    HereRoutingResponse[] | undefined
  >();
  const routes = useMemo(() => {
    if (!routeResponses) return undefined;
    return MapUtils.routingResponses2Routes(routeResponses);
  }, [routeResponses]);
  // last geo coordinate
  const [lastGeoCoordinate, setLastGeoCoordinate] = useState<
    GeoCoordinate | undefined
  >();
  // form open status
  const [openForm, setOpenForm] = useState<"share" | "pdf" | null>(null);
  const [openUI, setOpenUI] = useState<boolean>(true);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // user
  const user = useSelector((state: RootState) => state.user);
  const isSharedUser =
    (tripBasic?.sharedUsers.findIndex(
      (sharedUser) => sharedUser.userId === user.userId,
    ) ?? -1) > -1;
  const isRestricted = tripBasic?.createdBy.id === user.id || isSharedUser;
  // others
  const { tripId, dayId } = useParams(); // dayId - day index in days, not day.id
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionScrollRef = useRef<HTMLDivElement>(null);

  const taoMarkers = useMemo(
    () =>
      taos?.map((tao) => {
        // markers - taos of a particular day
        return {
          id: String(tao.id),
          label: tao.attraction.title,
          lat: tao.attraction.lat,
          lng: tao.attraction.lng,
          zoom: MapUtils.resultTypeToZoom(tao.attraction.resultType),
        };
      }),
    [taos],
  );

  const dayIds = useMemo(() => days.map((d) => d.id), [days]);

  const geoMarkers = useMemo(
    () =>
      taoGeos
        ?.filter((taoGeo) => dayIds.includes(taoGeo.dayId))
        .map((taoGeo) => {
          // markers - all taos
          return {
            id: String(taoGeo.id),
            groupId: taoGeo.dayId,
            label: taoGeo.title,
            lat: taoGeo.lat,
            lng: taoGeo.lng,
            zoom: 12,
          };
        }),
    [taoGeos, dayIds],
  );

  const isOverview = !Boolean(dayId);

  const markers = useMemo(
    () => (isOverview ? geoMarkers : taoMarkers),
    [isOverview, geoMarkers, taoMarkers],
  );

  // async functions

  // add day and delete day auto-reflects on days by useEffect triggered on tripBasic.numDays

  const asyncAddDayTaos = useCallback(
    (tao: Tao) => {
      if (day) {
        let dayTaos = taosMapRef.current.get(day.id);

        if (dayTaos) {
          dayTaos.push(tao);
          dayTaos = TimeUtils.orderTaos(dayTaos);

          taosMapRef.current.set(day.id, dayTaos);
          setTaos(dayTaos);

          initRouteResponses(true);

          // also add to taoGeos
          let newTaoGeo = {
            id: tao.id,
            dayId: tao.dayId,
            title: tao.attraction.title,
            lat: tao.attraction.lat,
            lng: tao.attraction.lng,
          };
          setTaoGeos((prev) => [...prev, newTaoGeo]);
        }
      }
    },
    [day],
  );

  const asyncEditDayTaos = useCallback(
    async (tao: Tao) => {
      if (day) {
        let dayTaos = taosMapRef.current.get(day.id);

        if (dayTaos) {
          let index = dayTaos.findIndex((_tao) => _tao.id === tao.id);
          // check whether attraction is the same
          let isAttractionSame =
            dayTaos[index].attraction.id === tao.attraction.id;
          dayTaos[index] = tao;

          let prevTaoOrder = dayTaos.map((tao) => tao.id);
          let newTaos = TimeUtils.orderTaos(dayTaos);
          let currTaoOrder = newTaos.map((tao) => tao.id);

          taosMapRef.current.set(day.id, newTaos);
          setTaos(newTaos);
          setTao(tao); // TODO - optimize?

          setTaoGeos((prev) =>
            prev.map((geo) =>
              geo.id === tao.id
                ? {
                    id: tao.id,
                    dayId: tao.dayId,
                    title: tao.attraction.title,
                    lat: tao.attraction.lat,
                    lng: tao.attraction.lng,
                  }
                : geo,
            ),
          );

          let orderChanged = !isEqual(prevTaoOrder, currTaoOrder);

          if (!isAttractionSame || orderChanged) {
            initRouteResponses(true);
          }
        }
      }
    },
    [day],
  );

  const asyncDeleteDayTaos = useCallback(
    (tao: Tao | undefined) => {
      if (day && tao) {
        let dayTaos = taosMapRef.current.get(day.id);

        if (dayTaos) {
          dayTaos = dayTaos.filter((t) => t.id !== tao.id);
          taosMapRef.current.set(day.id, dayTaos);
          setTaos(dayTaos);
          setTao(undefined);

          initRouteResponses(true);

          // also delete from taoGeos
          setTaoGeos((prev) => prev.filter((t) => t.id !== tao.id));
        }
      }
    },
    [day],
  );
  // use effects

  // render all on tripid
  useEffect(() => {
    initAll();
  }, [tripId]);

  // // rerender taos on day update
  useEffect(() => {
    initTaos();

    // clear immediately when switching day
    setRouteResponses(undefined);

    if (day?.id) {
      initRouteResponses(false, day.id);
    }
  }, [day?.id]);

  // rerender day on days update and navTabValue
  useEffect(() => {
    setDay(Number(dayId) ? days[Number(dayId) - 1] : undefined);
    setDayOverviewFocus(0);
    initTao(undefined);
  }, [dayId, days]);

  useEffect(() => {
    if (Boolean(tao)) initWikiImages();
    else setWikiImages([]);
  }, [tao]);

  const fetchAllDays = useCallback(async () => {
    // 1. Create an array of promises
    const promises = days.map((day) =>
      Promise.all([
        initTaos(day.id, true),
        initRouteResponses(false, day.id, true),
      ]),
    );

    // 2. Wait for all of them to resolve
    await Promise.all(promises);
  }, [days]);

  // handle functions

  const handleOpenUI = useCallback(
    () => setOpenUI((prev) => !prev),
    [setOpenUI],
  );

  const handleCloseForm = useCallback(() => setOpenForm(null), [setOpenForm]);

  const handleSetDayOverviewFocus = useCallback((id: number) => {
    const scrollTop = descriptionScrollRef.current?.scrollTop ?? 0;
    setDayOverviewFocus(id);

    // use multiple rAF frames to ensure iOS has finished any layout/scroll side effects
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (descriptionScrollRef.current) {
          descriptionScrollRef.current?.scrollTo({
            top: scrollTop,
            behavior: "instant",
          });
        }
      });
    });
  }, []);

  // init functions

  const initAll = useCallback(async () => {
    if (!tripId) return;

    setIsLoading(true);

    const trip = await tripsService.getTripById(Number(tripId));
    setTripBasic(trip);

    const [daysData, taoGeosData] = await Promise.all([
      daysService.getDaysByTripId(trip.id),
      tripsService.getTripTaoGeosById(trip.id),
    ]);

    setDays(daysData);
    setTaoGeos(taoGeosData);

    setIsLoading(false);
  }, [tripId]);

  const initTao = useCallback(
    (tao: Tao | undefined) => {
      if (!tao) {
        setTao(undefined);
      } else if (taos) {
        let _tao = taos.find((t) => t.id === tao.id);
        setTao(_tao);
      }
    },
    [taos, setTao],
  );

  const initTaos = useCallback(
    async (dayId?: number, silentUpdate: boolean = false) => {
      const _dayId = dayId ?? day?.id; // Prioritize the passed ID
      if (!_dayId) return;

      // Check if we already have it in the Ref Map
      let taos = taosMapRef.current.get(_dayId);

      // If we don't have it (or it's a forced refresh), fetch it
      if (!taos) {
        taos = await taosService.getTaosByDayId(_dayId);
        taosMapRef.current.set(_dayId, taos);
      }

      // Only update global "active day" state if NOT silent
      if (!silentUpdate) {
        setTaos(taos);
      }
    },
    [day, setTaos],
  );

  const initWikiImages = useCallback(async () => {
    if (tao) {
      let id = tao.attraction.id;
      let images = wikiImagesMapRef.current.get(id);

      if (images) {
        setWikiImages(images);
      } else {
        try {
          images = await wikiCommonsService.getWikiImagesByAttractionId(id);
          wikiImagesMapRef.current.set(id, images);
          setWikiImages(images);
        } catch (_) {
          wikiImagesMapRef.current.set(id, []);
          setWikiImages([]);
        }
      }
    }
  }, [tao, setWikiImages]);

  const initRoutes = useCallback(
    (routeResponses: HereRoutingResponse[], silentUpdate: boolean = false) => {
      if (!silentUpdate) {
        setRouteResponses(routeResponses);
      }
    },
    [setRouteResponses],
  );

  const initRouteResponses = useCallback(
    async (
      refresh: boolean = false,
      dayId?: number,
      silentUpdate: boolean = false,
    ) => {
      const _dayId = dayId ?? day?.id;
      if (_dayId) {
        // check routeResponsesMapRef first when switches from day to day
        let routeResponses: HereRoutingResponse[] | undefined;
        if (!refresh) routeResponses = routeResponsesMapRef.current.get(_dayId);

        // if routeResponsesMapRef has no routing info for that day, get it from API
        if (!routeResponses) {
          routeResponses = await hereMapService.getRoutingsOnDay(_dayId);
          routeResponsesMapRef.current.set(_dayId, routeResponses);
        }

        initRoutes(routeResponses, silentUpdate);
      } else {
        // setRoutes(undefined);
      }
    },
    [
      day,
      initRoutes,
      // setRoutes
    ],
  );

  // other handle funcitons
  const handleCloseTao = useCallback(() => initTao(undefined), [initTao]);

  return (
    <Box className="trip-profile-box">
      <Box className="ui-box">
        {/* content */}
        <Box
          className={clsx(
            "content-box",
            isMobile && "mobile",
            !openUI && "hidden",
          )}
        >
          {/* header */}
          <Box className="header-box">
            {/* profile images  */}
            {isOverview && (
              <TripHeader
                trip={tripBasic}
                setTrip={setTripBasic}
                readonly={readonly}
              />
            )}

            {/* name */}
            <Box className="title-box">
              <NameComponent
                trip={tripBasic}
                isLoading={isLoading}
                inputRef={inputRef}
                isSharedUser={isSharedUser}
                readonly={readonly}
              />
            </Box>
          </Box>

          {/* content - description / day content */}
          {!isOverview ? (
            <Box className="day-box">
              <DayComponent
                day={day}
                taos={taos}
                setTao={initTao}
                asyncAddDayTaos={asyncAddDayTaos}
                asyncEditDayTaos={asyncEditDayTaos}
                asyncDeleteDayTaos={asyncDeleteDayTaos}
                lastGeoCoordinate={lastGeoCoordinate}
                setLastGeoCoordinate={setLastGeoCoordinate}
                readonly={readonly}
              />
            </Box>
          ) : (
            <Box ref={descriptionScrollRef} className="description-box">
              <DescriptionComponent
                trip={tripBasic}
                setTrip={setTripBasic}
                isLoading={isLoading}
                readonly={readonly}
              />
              <DayOverviewComponent
                trip={tripBasic}
                days={days}
                setDays={setDays}
                focusId={dayOverviewFocus}
                setFocusId={handleSetDayOverviewFocus}
                readonly={readonly}
              />
            </Box>
          )}

          {/* tao content */}
          <Box className={clsx("tao-box", Boolean(tao) && "display")}>
            <TaoComponent
              taos={taos}
              tao={tao}
              wikiImages={wikiImages}
              routeResponsesMapRef={routeResponsesMapRef}
              routeResponses={routeResponses}
              setRouteResponses={initRoutes}
              onClose={handleCloseTao}
              asyncEditDayTaos={asyncEditDayTaos}
              readonly={readonly}
            />
          </Box>
        </Box>

        {/* open button */}
        <Box className={"open-button-box"}>
          <UIShowButton isOpen={openUI} onClick={handleOpenUI} />
        </Box>

        {/* tool fab group */}
        <Box
          className={clsx(
            "tool-fab-group",
            isMobile && "mobile",
            !openUI && "hidden",
          )}
        >
          <FabComponent
            trip={tripBasic}
            tao={tao}
            isOverview={isOverview}
            setOpenForm={setOpenForm}
            isRestricted={isRestricted}
            readonly={readonly}
          />
        </Box>
      </Box>

      {/* map */}
      <Box className="map-box">
        <Suspense fallback={<div />}>
          <Mapper
            markers={markers}
            mapRoutes={routes}
            focusId={isOverview ? String(dayOverviewFocus) : String(tao?.id)}
            openUI={openUI}
            focusRoute
            focusOnGroup={Boolean(isOverview)}
            openPopUp
          />
        </Suspense>
      </Box>

      {/* forms */}

      <TripShareForm
        open={openForm === "share"}
        onClose={handleCloseForm}
        trip={tripBasic}
        readonly={readonly}
      />

      <TripPdfForm
        open={openForm === "pdf"}
        onClose={handleCloseForm}
        trip={tripBasic}
        days={days}
        taosMapRef={taosMapRef}
        routeResponsesMapRef={routeResponsesMapRef}
        geoMarkers={geoMarkers}
        fetchAllDays={fetchAllDays}
      />
    </Box>
  );
};

export default TripProfile;
