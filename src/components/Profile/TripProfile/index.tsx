import Mapper from "@components/Map";
import type { Route, NavTab, GeoCoordinate } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import { Box } from "@mui/material";
import { type Trip, tripsService } from "@services/trips";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";
import ImageSelector from "@components/ImageSelector";
import TLogo from "@assets/T.svg";
import AddIcon from "@mui/icons-material/Add";
import TTChipButton from "@components/TTChipButton";
import { type Image } from "@services/images";
import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import NameComponent from "./NameComponent";
import DescriptionComponent from "./DescriptionComponent";
import DayComponent from "./DayComponent";
import SectionComponent from "./SectionComponent";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import DeleteDayForm from "@components/Forms/DeleteDayForm";
import { daysService, type Day } from "@services/days";
import { taosService, type Tao, type TaoGeo } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import TaoComponent from "./TaoComponent";
import DeleteTaoForm from "@components/Forms/DeleteTaoForm";
import DayOverviewComponent from "./DayOverviewComponent";
import TaoForm from "@components/Forms/TaoForm";
import {
  hereMapService,
  type HereRoutingResponse,
} from "@services/hereMap/hereMap";
import UIShowButton from "@components/Button/UIShowButton";
import FabComponent from "./FabComponent";
import TimeUtils from "@utils/TimeUtils";
import { max_day_per_trip } from "@constants/Restrictions";
import {
  wikiCommonsService,
  type WikiImage,
} from "@services/wikiCommons/wikiCommons";
import ImageForm from "@components/Forms/ImageForm";
import { isEqual } from "lodash";
import ToolTip from "@components/ToolTip";
import clsx from "clsx";
import "./index.scss";
import TripShareForm from "@components/Forms/TripShareForm";

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
  const [taos, setTaos] = useState<Tao[] | undefined>();
  // tao
  const [tao, setTao] = useState<Tao | undefined>();
  // attraction wiki images
  const wikiImagesRef = useRef(new Map<number, WikiImage[]>()); // attraction.id => wikiImage[]
  const [wikiImages, setWikiImages] = useState<WikiImage[]>([]);
  // map
  const routeResponsesMapRef = useRef(new Map<number, HereRoutingResponse[]>()); // day.id => routing response[]
  const [routeResponses, setRouteResponses] = useState<
    HereRoutingResponse[] | undefined
  >();
  const [routes, setRoutes] = useState<Route[]>();
  // last geo coordinate
  const [lastGeoCoordinate, setLastGeoCoordinate] = useState<
    GeoCoordinate | undefined
  >();
  // form open status
  const [openDeleteDayForm, setOpenDeleteDayForm] = useState<boolean>(false);
  const [openEditTaoForm, setOpenEditTaoForm] = useState<boolean>(false);
  const [openDeleteTaoForm, setOpenDeleteTaoForm] = useState<boolean>(false);
  const [openImageForm, setOpenImageForm] = useState<number | undefined>();
  const [openTripShareForm, setOpenTripShareForm] = useState<boolean>(false);
  const [openUI, setOpenUI] = useState<boolean>(true);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDefaultDirectingRef = useRef<boolean>(true);
  // others
  const { tripId, dayId } = useParams(); // dayId - day index in days, not day.id
  const prevDayId = useRef<number | undefined>(undefined);
  const image = openImageForm !== undefined ? images[openImageForm] : undefined; // current image in images
  const inputRef = useRef<HTMLInputElement>(null);
  const correctUri = uri.length > 1 ? uri : "";
  const navigate = useNavigate();

  const markers =
    taos?.map((tao) => {
      // markers - taos of a particular day
      return {
        id: String(tao.id),
        label: tao.attraction.title,
        lat: tao.attraction.lat,
        lng: tao.attraction.lng,
        zoom: MapUtils.resultTypeToZoom(tao.attraction.resultType),
      };
    }) ??
    taoGeos?.map((taoGeo) => {
      // markers - all taos
      return {
        id: String(taoGeo.id),
        groupId: taoGeo.dayId,
        label: taoGeo.title,
        lat: taoGeo.lat,
        lng: taoGeo.lng,
        zoom: 0,
      };
    }) ??
    [];

  const maxImageCount = 4;
  const isMaxImageCountReached = images.length === maxImageCount;

  const isOverview = !Boolean(dayId);

  const initTrip = async () => {
    try {
      if (tripId) {
        setIsLoading(true);

        // get trip basic
        let tripBasic = await tripsService.getTripById(Number(tripId));
        tripBasicRef.current = tripBasic;
        asyncTrip();

        imagesRef.current = tripBasic.images ?? [];
        asyncImages();

        BehaviorUtils.sleep();
        setIsLoading(false);
      }
    } catch (e) {
      if (e instanceof Error) {
        navigate("/");
      }
    }
  };

  const deleteTripImage = async (index: number) => {
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
  };

  const initTaoGeos = async () => {
    if (tripBasic?.id) {
      let taoGeos = await tripsService.getTripTaoGeosById(tripBasic.id);
      taoGeosRef.current = taoGeos;
      setTaoGeos(taoGeos);
    }
  };

  const initDays = async () => {
    if (tripId) {
      // get days with trip id
      let days = await daysService.getDaysByTripId(Number(tripId));
      setDays(days);
    }
  };

  const initTao = (tao: Tao | undefined) => {
    if (!tao) {
      setTao(undefined);
    } else if (taos) {
      let _tao = taos.find((t) => t.id === tao.id);
      setTao(_tao);
    }
  };

  const initTaos = async () => {
    if (day?.id) {
      // set taos & tao
      let taos: Tao[] | undefined;
      let isSameDay = prevDayId.current === day.id;
      // try to get taos of a day from cache if day is switched
      if (!isSameDay) taos = taosMapRef.current.get(day.id);
      // if taos does not exist in taosMapRef, request it from API
      if (isSameDay || !taos) {
        taos = await taosService.getTaosByDayId(day.id);
        taosMapRef.current.set(day.id, taos);
      }
      setTaos(taos);

      // optional - also updates tao component if it is opened
      if (tao) {
        initTao(tao);
      }
    } else {
      setTaos(undefined);
      prevDayId.current = undefined;
    }
  };

  const initWikiImages = async () => {
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
  };

  const initRouteResponses = async (refresh: boolean = false) => {
    if (day) {
      // check routeResponsesMapRef first when switches from day to day
      let routeResponses: HereRoutingResponse[] | undefined;
      if (!refresh) routeResponses = routeResponsesMapRef.current.get(day.id);

      // if routeResponsesMapRef has no routing info for that day, get it from API
      if (!routeResponses) {
        routeResponses = await hereMapService.getRoutingsOnDay(day.id);
        routeResponsesMapRef.current.set(day.id, routeResponses);
      }

      prevDayId.current = day.id;

      await initRoutes(routeResponses);
    } else {
      setRoutes(undefined);
    }
  };

  const initRoutes = async (routeResponses: HereRoutingResponse[]) => {
    let routes = routeResponses
      .map((res, i) =>
        res.routes?.map((r) =>
          r
            ? r.sections?.map((s) => ({
                polyline: s.polyline,
                groupId: i,
                color: s.transport?.color,
              }))
            : undefined
        )
      )
      .flat(2) as Route[];

    setRoutes(routes);
    setRouteResponses(routeResponses);
  };

  // ref async functions

  const asyncTrip = () => {
    if (!tripBasicRef.current) return;
    setTripBasic({ ...tripBasicRef.current });
  };

  const asyncImages = () => {
    setImages([...imagesRef.current]); // ensure new reference
  };

  const asyncAddImage = (image: Image) => {
    imagesRef.current.push(image);
    asyncImages();
  };

  const asyncDetachImage = (imageId: number) => {
    imagesRef.current = imagesRef.current.filter((i) => i.id !== imageId);
    asyncImages();
  };

  const asyncUpdateImage = (image: Image) => {
    let images = imagesRef.current;
    let imageIndex = images.findIndex((img) => img.id === image.id);
    images[imageIndex] = image;

    imagesRef.current = images;
    asyncImages();
  };

  // add day and delete day auto-reflects on days by useEffect triggered on tripBasic.numDays

  const asyncAddDayTaos = (tao: Tao) => {
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
  };

  const asyncEditDayTaos = async (tao: Tao) => {
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
  };

  const asyncDeleteDayTaos = (tao: Tao | undefined) => {
    if (day && tao) {
      let dayTaos = taosMapRef.current.get(day.id);

      if (dayTaos) {
        dayTaos = dayTaos.filter((t) => t.id !== tao.id);
        taosMapRef.current.set(day.id, dayTaos);
        setTaos(dayTaos);
        setTao(undefined);

        initRouteResponses(true);

        // also delete from taoGeos
        taoGeosRef.current = taoGeosRef.current?.filter((t) => t.id !== tao.id);
        setTaoGeos(taoGeosRef.current);
      }
    }
  };

  // render trip on initiation
  useEffect(() => {
    initTrip();
  }, [tripId]);

  // rerender taoGeos on trip basic id
  useEffect(() => {
    initTaoGeos();
  }, [tripBasic?.numDays]);

  // rerender days on numDays
  useEffect(() => {
    initDays();
  }, [tripBasic?.numDays]);

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
    if (tao) initWikiImages();
    else setWikiImages([]);
  }, [tao]);

  // rerender taos on day update
  useEffect(() => {
    initTaos();
    initRouteResponses();
  }, [day?.id]);

  const overViewNavTab = {
    name: "Overview",
    label: "Overview",
    to: `${correctUri}/trip/${tripId}`,
  };

  const getNavTabs = () => {
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
  };

  const handlePostDay = async () => {
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
  };

  return (
    <Box className="trip-profile-box">
      <Box className="trip-profile-ui-box">
        {/* content */}
        <Box
          className={clsx(
            "trip-profile-content-box",
            isMobile && "mobile",
            !openUI && "hidden"
          )}
        >
          {/* header */}
          <Box className="trip-profile-header-box">
            {/* profile images  */}
            <Box
              className={clsx(
                "trip-profile-image-box",
                !Boolean(dayId) && "visible"
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
                  onClick={() => setOpenImageForm(imageIndex)}
                  innerButtons
                />
              ) : (
                <Box className="trip-profile-default-image-box">
                  {/* image when no images available */}
                  <img src={TLogo} height={isMobile ? 180 : 200} />
                </Box>
              )}

              {/* image selector */}
              <Box className="trip-profile-image-selector-box">
                {!readonly ? (
                  <ImageSelector
                    tripId={tripBasic?.id}
                    imageIds={images.map((image) => image.id)}
                    disabled={isMaxImageCountReached}
                    asyncAddImage={asyncAddImage}
                    readonly={readonly}
                  >
                    <ToolTip title="Add Images" offsetY={-8}>
                      <TTChipButton
                        label={`${images.length}/${maxImageCount}`}
                        color="utility"
                        size="small"
                        icon={
                          isMaxImageCountReached || readonly ? undefined : (
                            <AddIcon />
                          )
                        }
                      />
                    </ToolTip>
                  </ImageSelector>
                ) : images.length > 0 ? (
                  <TTChipButton
                    label={`${imageIndex + 1}/${images.length}`}
                    color="utility"
                    size="small"
                    icon={
                      isMaxImageCountReached || readonly ? undefined : (
                        <AddIcon />
                      )
                    }
                  />
                ) : undefined}
              </Box>
            </Box>

            {/* name */}
            <Box className="trip-profile-title-box">
              <NameComponent
                tripBasicRef={tripBasicRef}
                tripBasic={tripBasic}
                asyncTrip={asyncTrip}
                isLoading={isLoading}
                inputRef={inputRef}
                readonly={readonly}
              />
            </Box>

            {/* section - nav bar (nav tabs + add day icon button) */}
            <Box className="trip-profile-section-box">
              <SectionComponent
                navTabs={getNavTabs()}
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
            <Box className="trip-profile-day-box">
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
            <Box className="trip-profile-description-box">
              <DescriptionComponent
                tripBasicRef={tripBasicRef}
                asyncTrip={asyncTrip}
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
          <Box
            className={clsx("trip-profile-tao-box", Boolean(tao) && "display")}
          >
            <TaoComponent
              taos={taos}
              tao={tao}
              wikiImages={wikiImages}
              routeResponsesMapRef={routeResponsesMapRef}
              routeResponses={routeResponses}
              setRouteResponses={initRoutes}
              onClose={() => initTao(undefined)}
              asyncEditDayTaos={asyncEditDayTaos}
              readonly={readonly}
            />
          </Box>
        </Box>

        {/* open button */}
        <Box className={"trip-profile-open-button-box"}>
          <UIShowButton
            isOpen={openUI}
            onClick={() => setOpenUI((prev) => !prev)}
          />
        </Box>

        {/* tool fab group */}
        <Box
          className={clsx(
            "trip-profile-tool-fab-group",
            isMobile && "mobile",
            !openUI && "hidden"
          )}
        >
          <FabComponent
            tripBasicRef={tripBasicRef}
            tripBasic={tripBasic}
            tao={tao}
            isOverview={isOverview}
            setOpenTripShareForm={setOpenTripShareForm}
            setOpenDeleteDayForm={setOpenDeleteDayForm}
            setOpenEditTaoForm={setOpenEditTaoForm}
            setOpenDeleteTaoForm={setOpenDeleteTaoForm}
            readonly={readonly}
          />
        </Box>
      </Box>

      {/* map */}
      <Box className="trip-profile-map-box">
        <Mapper
          markers={markers}
          mapRoutes={routes}
          focusId={taos ? String(tao?.id) : String(dayOverviewFocus)}
          openUI={openUI}
          focusRoute
          focusOnGroup={Boolean(!taos)}
          openPopUp
        />
      </Box>

      <TripShareForm
        open={openTripShareForm}
        onClose={() => setOpenTripShareForm(false)}
        tripBasicRef={tripBasicRef}
        sharedUsers={tripBasic?.sharedUsers ?? []}
        asyncTrip={asyncTrip}
      />

      <DeleteDayForm
        open={openDeleteDayForm}
        onClose={() => setOpenDeleteDayForm(false)}
        day={days[Number(dayId ?? 0) - 1]}
        dayId={Number(dayId)}
        tripBasicRef={tripBasicRef}
        asyncDeleteDay={() => {
          let newDayId = Number(dayId) - 1;
          isDefaultDirectingRef.current = false;

          setNavTabValue(newDayId);

          if (newDayId === 0)
            navigate(`${overViewNavTab.to}`, { replace: true });
          else
            navigate(`${overViewNavTab.to}/day/${newDayId}`, { replace: true });
        }}
      />

      <DeleteTaoForm
        open={openDeleteTaoForm}
        onClose={() => setOpenDeleteTaoForm(false)}
        tao={tao}
        setIsParentUpdated={() => {
          setTao(undefined);
          asyncDeleteDayTaos(tao);
        }}
      />

      <TaoForm
        open={openEditTaoForm}
        onClose={() => setOpenEditTaoForm(false)}
        dayIndex={Number(dayId)}
        dayId={day?.id}
        tao={tao}
        lastGeoCoordinate={lastGeoCoordinate}
        setLastGeoCoordinate={setLastGeoCoordinate}
        asyncAddDayTaos={asyncAddDayTaos}
        asyncEditDayTaos={asyncEditDayTaos}
      />

      <ImageForm
        image={image}
        onClose={() => setOpenImageForm(undefined)}
        asyncUpdateImage={asyncUpdateImage}
        asyncDeleteImage={asyncDetachImage}
        readonly={readonly}
      />
    </Box>
  );
};

export default TripProfile;
