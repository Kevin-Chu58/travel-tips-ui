import type { NavTab, GeoCoordinate } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import { Box, Chip, Typography } from "@mui/material";
import { type Trip, tripsService } from "@services/trips";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";
import TLogo from "@assets/T.svg";
import AddIcon from "@mui/icons-material/Add";
import TTChipButton from "@components/TTChipButton";
import { type Image } from "@services/images";
import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import DeleteDayForm from "@components/Forms/DeleteDayForm";
import { daysService, type Day } from "@services/days";
import { taosService, type Tao, type TaoGeo } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import DeleteTaoForm from "@components/Forms/DeleteTaoForm";
import {
  hereMapService,
  type HereRoutingResponse,
} from "@services/hereMap/hereMap";
import UIShowButton from "@components/Button/UIShowButton";
import TimeUtils from "@utils/TimeUtils";
import { max_day_per_trip } from "@constants/Restrictions";
import {
  wikiCommonsService,
  type WikiImage,
} from "@services/wikiCommons/wikiCommons";
import ImageForm from "@components/Forms/ImageForm";
import { isEqual } from "lodash-es";
import ToolTip from "@components/ToolTip";
import TripShareForm from "@components/Forms/TripShareForm";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import UserAvatar from "@components/UserAvatar";
import { useNavToProfile } from "@hooks/useNavToProfile";
import React from "react";
import clsx from "clsx";
import "./index.scss";

// lazy load
const DayComponent = React.lazy(() => import("./DayComponent"));
const NameComponent = React.lazy(() => import("./NameComponent"));
const DayOverviewComponent = React.lazy(() => import("./DayOverviewComponent"));
const DescriptionComponent = React.lazy(() => import("./DescriptionComponent"));
const SectionComponent = React.lazy(() => import("./SectionComponent"));
const TaoComponent = React.lazy(() => import("./TaoComponent"));
const FabComponent = React.lazy(() => import("./FabComponent"));
const TripPdfForm = React.lazy(() => import("@components/Forms/TripPdfForm"));
const TaoForm = React.lazy(() => import("@components/Forms/TaoForm"));
const ImageSelector = React.lazy(() => import("@components/ImageSelector"));
const Mapper = React.lazy(() => import("@components/Map"));

type TripProfileProps = {
  uri?: string;
  readonly?: boolean;
};

const TripProfile = ({ uri = "/", readonly = false }: TripProfileProps) => {
  // window
  const isMobile = useIsMobile();
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // nav tab
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // trip basic
  const tripBasicRef = useRef<Trip | undefined>(undefined);
  const [tripBasic, setTripBasic] = useState<Trip | undefined>();
  // trip images
  const imagesRef = useRef<Image[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  // image carousel
  const [imageIndex, setImageIndex] = useState<number>(0);
  // days
  const [days, setDays] = useState<Day[]>([]);
  // day
  const [day, setDay] = useState<Day | undefined>();
  // taoGeos
  const taoGeosRef = useRef<TaoGeo[] | undefined>(undefined);
  const [taoGeos, setTaoGeos] = useState<TaoGeo[] | undefined>();
  const [dayOverviewFocus, setDayOverviewFocus] = useState<number>(0);
  // taos
  const taosMapRef = useRef(new Map<number, Tao[]>()); // day.id => tao[]
  const [taosMap, setTaosMap] = useState<Map<number, Tao[]>>();
  const [taos, setTaos] = useState<Tao[] | undefined>();
  // tao
  const [tao, setTao] = useState<Tao | undefined>();
  // attraction wiki images
  const wikiImagesRef = useRef(new Map<number, WikiImage[]>()); // attraction.id => wikiImage[]
  const [wikiImages, setWikiImages] = useState<WikiImage[]>([]);
  // map
  const routeResponsesMapRef = useRef(new Map<number, HereRoutingResponse[]>()); // day.id => routing response[]
  const [routeResponsesMap, setRouteResponsesMap] =
    useState<Map<number, HereRoutingResponse[]>>();
  const [routeResponses, setRouteResponses] = useState<
    HereRoutingResponse[] | undefined
  >();
  const routes = useMemo(() => {
    if (!routeResponses) return undefined;
    return MapUtils.routingResponses2Routes(routeResponses);
  }, [routeResponses]);
  // const [routes, setRoutes] = useState<Route[]>();
  // last geo coordinate
  const [lastGeoCoordinate, setLastGeoCoordinate] = useState<
    GeoCoordinate | undefined
  >();
  // form open status
  const [openForm, setOpenForm] = useState<
    "deleteDay" | "editTao" | "deleteTao" | "share" | "pdf" | null
  >(null);
  const [openImageForm, setOpenImageForm] = useState<number | undefined>();
  const [openUI, setOpenUI] = useState<boolean>(true);
  const [hideImages, setHideImages] = useState<boolean>(false);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDefaultDirectingRef = useRef<boolean>(true);
  // nav to profile
  const navToProfile = useNavToProfile(tripBasic?.createdBy);

  // user
  const user = useSelector((state: RootState) => state.user);
  const isSharedUser =
    (tripBasic?.sharedUsers.findIndex(
      (sharedUser) => sharedUser.userId === user.userId,
    ) ?? -1) > -1;
  const isRestricted = tripBasic?.createdBy.id === user.id || isSharedUser;
  // others
  const { tripId, dayId } = useParams(); // dayId - day index in days, not day.id
  const prevDayId = useRef<number | undefined>(undefined);
  const image = openImageForm !== undefined ? images[openImageForm] : undefined; // current image in images
  const inputRef = useRef<HTMLInputElement>(null);
  const correctUri = uri.length > 1 ? uri : "";
  const navigate = useNavigate();

  const overViewNavTab = useMemo(
    () => ({
      name: "Overview",
      label: "Overview",
      to: `${correctUri}/trip/${tripId}`,
    }),
    [correctUri, tripId],
  );

  const navTabs = useMemo(() => {
    let navTabs = [{ ...overViewNavTab }] as NavTab[];

    if (tripBasic?.numDays) {
      for (let i = 0; i < tripBasic.numDays; i++) {
        let dayIndex = i + 1;
        let navTab = {
          name: `Day ${dayIndex}`,
          label: `Day ${dayIndex}`,
          to: `${correctUri}/trip/${tripId}/day/${dayIndex}`,
          deletable: Number(dayId) === dayIndex,
        };

        navTabs.push(navTab);
      }
    }

    return navTabs;
  }, [tripBasic?.numDays, dayId, tripId, correctUri]);

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

  const geoMarkers = useMemo(
    () =>
      taoGeos?.map((taoGeo) => {
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
    [taoGeos],
  );

  const isOverview = !Boolean(dayId);

  const markers = useMemo(
    () => (isOverview ? geoMarkers : taoMarkers),
    [isOverview, geoMarkers, taoMarkers],
  );

  const maxImageCount = 4;
  const isMaxImageCountReached = images.length === maxImageCount;

  const imageIds = useMemo(() => images.map((image) => image.id), [images]);

  const addIcon = useMemo(
    () => (isMaxImageCountReached || readonly ? undefined : <AddIcon />),
    [isMaxImageCountReached, readonly],
  );

  const sharedUsers = useMemo(() => tripBasic?.sharedUsers ?? [], [tripBasic]);

  const dayFocus = useMemo(() => days[Number(dayId ?? 0) - 1], [days]);

  // async functions

  const asyncTrip = useCallback(() => {
    if (!tripBasicRef.current) return;
    setTripBasic({ ...tripBasicRef.current });
  }, []);

  const asyncImages = useCallback(() => {
    setImages([...imagesRef.current]); // ensure new reference
  }, []);

  const asyncAddImage = useCallback(
    async (imageId: number) => {
      if (tripId) {
        const image = await tripsService.postTripImage(Number(tripId), imageId);

        imagesRef.current.push(image);
        asyncImages();
      }
    },
    [tripId],
  );

  const asyncDetachImage = useCallback((imageId: number) => {
    imagesRef.current = imagesRef.current.filter((i) => i.id !== imageId);
    asyncImages();
  }, []);

  const asyncUpdateImage = useCallback((image: Image) => {
    let images = imagesRef.current;
    let imageIndex = images.findIndex((img) => img.id === image.id);
    images[imageIndex] = image;

    imagesRef.current = images;
    asyncImages();
  }, []);

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
          taoGeosRef.current?.push({
            id: tao.id,
            dayId: tao.dayId,
            title: tao.attraction.title,
            lat: tao.attraction.lat,
            lng: tao.attraction.lng,
          });

          setTaoGeos(taoGeosRef.current);
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
          setTao(tao);

          let orderChanged = !isEqual(prevTaoOrder, currTaoOrder);

          if (!isAttractionSame || orderChanged) {
            initRouteResponses(true);
          }
        }
      }
    },
    [day],
  );

  const asyncDeleteDay = useCallback(() => {
    let newDayId = Number(dayId) - 1;
    isDefaultDirectingRef.current = false;

    setNavTabValue(newDayId);

    if (newDayId === 0) navigate(`${overViewNavTab.to}`, { replace: true });
    else navigate(`${overViewNavTab.to}/day/${newDayId}`, { replace: true });

    asyncTrip();
  }, [dayId, overViewNavTab]);

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
          taoGeosRef.current = taoGeosRef.current?.filter(
            (t) => t.id !== tao.id,
          );
          setTaoGeos(taoGeosRef.current);
        }
      }
    },
    [day, tao],
  );

  // render all on tripid
  useEffect(() => {
    initAll();
  }, [tripId]);

  // // rerender taoGeos and days on numDays
  // useEffect(() => {
  //   if (tripBasic?.numDays !== undefined) {
  //     initTaoGeos();
  //     initDays();
  //   }
  // }, [tripBasic?.numDays]);

  // // rerender taos on day update
  useEffect(() => {
    initTaos();
    initRouteResponses();
  }, [day?.id]);

  // rerender navTabValue on dayId
  useEffect(() => {
    if (isDefaultDirectingRef.current) {
      if (
        dayId &&
        tripBasic?.numDays &&
        (Number(dayId) > tripBasic.numDays || Number(dayId) < 1)
      )
        navigate(overViewNavTab.to);
      else setNavTabValue(Number(dayId ?? 0));
    } else isDefaultDirectingRef.current = true;
  }, [dayId, tripBasic?.numDays]);

  // rerender day on days update and navTabValue
  useEffect(() => {
    setDay(Boolean(navTabValue) ? days[navTabValue - 1] : undefined);
    setDayOverviewFocus(0);
    initTao(undefined);
  }, [navTabValue, days]);

  useEffect(() => {
    if (Boolean(tao)) initWikiImages();
    else setWikiImages([]);
  }, [tao]);

  const fetchAllDays = useCallback(async () => {
    // 1. Create an array of promises
    const promises = days.map(async (day) => {
      await initTaos(day.id, true);
      await initRouteResponses(false, day.id, true);
    });

    // 2. Wait for all of them to resolve
    await Promise.all(promises);

    // 3. Update state once everything is done
    setTaosMap(new Map(taosMapRef.current));
    setRouteResponsesMap(new Map(routeResponsesMapRef.current));
  }, [days]);

  // handle functions

  const handlePostDay = useCallback(async () => {
    // check if max taos per day is reached
    if (taos && taos.length >= max_day_per_trip) {
      enqueueSnackbar("Max number of events reached per day.", {
        variant: "error",
      });
      return;
    }

    if (tripBasic?.id) {
      try {
        await daysService.postNewDay(tripBasic.id);

        tripBasicRef.current!.numDays! += 1;
        asyncTrip();
        navigate(`${overViewNavTab.to}/day/${tripBasicRef.current?.numDays}`);

        enqueueSnackbar("Successfully create a day.", { variant: "success" });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  }, [
    tao,
    taos,
    tripBasic,
    overViewNavTab,
    enqueueSnackbar,
    asyncTrip,
    navigate,
  ]);

  const handleUsernameClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      navToProfile();
    },
    [navToProfile],
  );

  const handleOpenImageForm = useCallback(
    () => setOpenImageForm(imageIndex),
    [imageIndex, setOpenImageForm],
  );

  const handleOpenUI = useCallback(
    () => setOpenUI((prev) => !prev),
    [setOpenUI],
  );

  const handleCloseForm = useCallback(() => setOpenForm(null), [setOpenForm]);

  const handleUpdateDeleteTao = useCallback(() => {
    setTao(undefined);
    asyncDeleteDayTaos(tao);
  }, [tao, setTao, asyncDeleteDayTaos]);

  const handleCloseImageForm = useCallback(
    () => setOpenImageForm(undefined),
    [setOpenImageForm],
  );

  // init functions

  const initAll = async () => {
    if (!tripId) return;

    setIsLoading(true);

    const trip = await tripsService.getTripById(Number(tripId));
    tripBasicRef.current = trip;
    asyncTrip();

    imagesRef.current = trip.images ?? [];
    asyncImages();

    setIsLoading(false);

    const [daysData, taoGeosData] = await Promise.all([
      daysService.getDaysByTripId(trip.id),
      tripsService.getTripTaoGeosById(trip.id),
    ]);

    setDays(daysData);
    setTaoGeos(taoGeosData);

    setIsLoading(false);
  };

  // const initTrip = useCallback(async () => {
  //   try {
  //     if (tripId) {
  //       setIsLoading(true);

  //       // get trip basic
  //       let tripBasic = await tripsService.getTripById(Number(tripId));
  //       tripBasicRef.current = tripBasic;
  //       asyncTrip();

  //       imagesRef.current = tripBasic.images ?? [];
  //       asyncImages();

  //       BehaviorUtils.sleep();
  //       setIsLoading(false);
  //     }
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       navigate("/");
  //     }
  //   }
  // }, [tripId, setIsLoading, asyncTrip, asyncImages]);

  const deleteTripImage = useCallback(
    async (index: number) => {
      if (tripBasic) {
        try {
          let imageId = images[index].id;
          await tripsService.deleteTripImage(tripBasic.id, imageId);

          asyncDetachImage(imageId);

          enqueueSnackbar("Successfully detached image.", {
            variant: "success",
          });
        } catch (e) {
          if (e instanceof Error)
            enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    },
    [tripBasic, images, asyncDetachImage, enqueueSnackbar],
  );

  // const initTaoGeos = useCallback(async () => {
  //   if (tripBasic?.id) {
  //     let taoGeos = await tripsService.getTripTaoGeosById(tripBasic.id);
  //     taoGeosRef.current = taoGeos;
  //     setTaoGeos(taoGeos);
  //   }
  // }, [tripBasic, setTaoGeos]);

  // const initDays = useCallback(async () => {
  //   if (tripId) {
  //     // get days with trip id
  //     let days = await daysService.getDaysByTripId(Number(tripId));
  //     setDays(days);
  //   }
  // }, [tripId, setDays]);

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
        prevDayId.current = _dayId; // Only update the "current day" pointer here
      }
    },
    [day, prevDayId, setTaos],
  );

  const initWikiImages = useCallback(async () => {
    if (tao) {
      let id = tao.attraction.id;
      let images = wikiImagesRef.current.get(id);

      if (images) {
        setWikiImages(images);
      } else {
        try {
          images = await wikiCommonsService.getWikiImagesByAttractionId(id);
          wikiImagesRef.current.set(id, images);
          setWikiImages(images);
        } catch (_) {
          wikiImagesRef.current.set(id, []);
          setWikiImages([]);
        }
      }
    }
  }, [tao, setWikiImages]);

  const initRoutes = useCallback(
    async (
      routeResponses: HereRoutingResponse[],
      silentUpdate: boolean = false,
    ) => {
      // let routes = MapUtils.routingResponses2Routes(routeResponses) as Route[];

      if (!silentUpdate) {
        // setRoutes(routes);
        setRouteResponses(routeResponses);
      }
    },
    [
      // setRoutes,
      setRouteResponses,
    ],
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

        prevDayId.current = _dayId;

        await initRoutes(routeResponses, silentUpdate);
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
            <Box
              className={clsx(
                "image-box",
                !Boolean(dayId) && !hideImages && "visible",
              )}
            >
              {images.length > 0 ? (
                <PreloadCarousel
                  images={images}
                  index={imageIndex}
                  setIndex={setImageIndex}
                  height={isMobile ? 200 : 240}
                  onDelete={deleteTripImage}
                  readonly={readonly}
                  onClick={handleOpenImageForm}
                  innerButtons
                  aspectRatioType="trip-profile"
                />
              ) : (
                <Box className="default-image-box">
                  {/* image when no images available */}
                  <img src={TLogo} height={isMobile ? 180 : 200} />
                </Box>
              )}

              {/* creator avatar and username */}
              {tripBasicRef.current ? (
                <Box className="row createdBy-box">
                  <UserAvatar user={tripBasicRef.current.createdBy} />
                  <Chip
                    label={
                      <Typography
                        className="username"
                        onClick={handleUsernameClick}
                      >
                        {tripBasicRef.current?.createdBy.username}
                      </Typography>
                    }
                    size="small"
                    className="username-chip"
                  />
                </Box>
              ) : undefined}

              {/* image selector */}
              <Box className="image-selector-box">
                {!readonly ? (
                  <ImageSelector
                    imageIds={imageIds}
                    disabled={isMaxImageCountReached}
                    asyncAddImage={asyncAddImage}
                    readonly={readonly}
                  >
                    <ToolTip title="Add Images" offsetY={-8}>
                      <TTChipButton
                        label={`${images.length}/${maxImageCount}`}
                        color="utility"
                        size="small"
                        icon={addIcon}
                      />
                    </ToolTip>
                  </ImageSelector>
                ) : images.length > 0 ? (
                  <TTChipButton
                    label={`${imageIndex + 1}/${images.length}`}
                    color="utility"
                    size="small"
                    icon={addIcon}
                  />
                ) : undefined}
              </Box>
            </Box>

            {/* name */}
            <Box className="title-box">
              <NameComponent
                tripBasicRef={tripBasicRef}
                tripBasic={tripBasic}
                asyncTrip={asyncTrip}
                isLoading={isLoading}
                inputRef={inputRef}
                isSharedUser={isSharedUser}
                readonly={readonly}
              />
            </Box>

            {/* section - nav bar (nav tabs + add day icon button) */}
            <Box className="section-box">
              <SectionComponent
                navTabs={navTabs}
                navTabValue={navTabValue}
                setNavTabValue={setNavTabValue}
                handlePostDay={handlePostDay}
                isLoading={isLoading}
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
                navTabValue={navTabValue}
                setTao={initTao}
                asyncAddDayTaos={asyncAddDayTaos}
                asyncEditDayTaos={asyncEditDayTaos}
                lastGeoCoordinate={lastGeoCoordinate}
                setLastGeoCoordinate={setLastGeoCoordinate}
                readonly={readonly}
              />
            </Box>
          ) : (
            <Box className="description-box">
              <DescriptionComponent
                tripBasicRef={tripBasicRef}
                asyncTrip={asyncTrip}
                hideImages={hideImages}
                setHideImages={setHideImages}
                isLoading={isLoading}
                readonly={readonly}
              />
              <DayOverviewComponent
                days={days}
                focusId={dayOverviewFocus}
                setFocusId={setDayOverviewFocus}
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
            tripBasicRef={tripBasicRef}
            tripBasic={tripBasic}
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
          {openUI && (
            <Mapper
              markers={markers}
              mapRoutes={routes}
              focusId={isOverview ? String(dayOverviewFocus) : String(tao?.id)}
              openUI={openUI}
              focusRoute
              focusOnGroup={Boolean(isOverview)}
              openPopUp
            />
          )}
        </Suspense>
      </Box>

      {/* forms */}

      {openForm === "share" && (
        <TripShareForm
          open
          onClose={handleCloseForm}
          tripBasicRef={tripBasicRef}
          sharedUsers={sharedUsers}
          asyncTrip={asyncTrip}
          readonly={readonly}
        />
      )}

      {openForm === "pdf" && (
        <TripPdfForm
          open
          onClose={handleCloseForm}
          tripRef={tripBasicRef}
          days={days}
          taosMap={taosMap}
          routeResponsesMap={routeResponsesMap}
          geoMarkers={geoMarkers}
          fetchAllDays={fetchAllDays}
        />
      )}

      {openForm === "deleteDay" && (
        <DeleteDayForm
          open
          onClose={handleCloseForm}
          day={dayFocus}
          dayId={Number(dayId)}
          tripBasicRef={tripBasicRef}
          asyncDeleteDay={asyncDeleteDay}
        />
      )}

      {openForm === "deleteTao" && (
        <DeleteTaoForm
          open
          onClose={handleCloseForm}
          tao={tao}
          setIsParentUpdated={handleUpdateDeleteTao}
        />
      )}

      {openForm === "editTao" && (
        <TaoForm
          open
          onClose={handleCloseForm}
          dayIndex={Number(dayId)}
          dayId={day?.id}
          tao={tao}
          lastGeoCoordinate={lastGeoCoordinate}
          setLastGeoCoordinate={setLastGeoCoordinate}
          asyncAddDayTaos={asyncAddDayTaos}
          asyncEditDayTaos={asyncEditDayTaos}
        />
      )}

      <ImageForm
        image={image}
        onClose={handleCloseImageForm}
        asyncUpdateImage={asyncUpdateImage}
        asyncDeleteImage={asyncDetachImage}
        readonly={readonly}
      />
    </Box>
  );
};

export default TripProfile;
