import Mapper from "@components/Map";
import { type Route, type NavTab } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import { Box } from "@mui/material";
import type { RootState } from "@redux/store";
import { type Trip, tripsService } from "@services/trips";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";
import ImageSelector from "@components/ImageSelector";
import TLogo from "@assets/T.svg";
import AddIcon from "@mui/icons-material/Add";
import TTChipButton from "@components/TTChipButton";
import { type Image } from "@services/images";
import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import AddDayForm from "@components/Forms/AddDayForm";
import NameComponent from "./NameComponent";
import DescriptionComponent from "./DescriptionComponent";
import DayComponent from "./DayComponent";
import SectionComponent from "./SectionComponent";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import DeleteDayForm from "@components/Forms/DeleteDayForm";
import { daysService, type Day } from "@services/days";
import { taosService, type Tao } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import TaoComponent from "./TaoComponent";
import DeleteTaoForm from "@components/Forms/DeleteTaoForm";
import TaoForm from "@components/Forms/TaoForm";
import {
  hereMapService,
  type HereRoutingResponse,
} from "@services/hereMap/hereMap";
import UIShowButton from "@components/Button/UIShowButton";
import FabComponent from "./FabComponent";
import TimeUtils from "@utils/TimeUtils";
import { isEqual } from "lodash";
import clsx from "clsx";
import "./index.scss";

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
  // taos
  const taosMapRef = useRef(new Map<number, Tao[]>()); // day.id => tao[]
  const [taos, setTaos] = useState<Tao[] | undefined>();
  // tao
  const [tao, setTao] = useState<Tao | undefined>();
  // map
  const routeResponsesMapRef = useRef(new Map<number, HereRoutingResponse[]>()); // day.id => routing response[]
  const [routeResponses, setRouteResponses] = useState<
    HereRoutingResponse[] | undefined
  >();
  const [routes, setRoutes] = useState<Route[]>();
  // form open status
  const [openDayForm, setOpenDayForm] = useState<boolean>(false);
  const [openDeleteDayForm, setOpenDeleteDayForm] = useState<boolean>(false);
  const [openEditTaoForm, setOpenEditTaoForm] = useState<boolean>(false);
  const [openDeleteTaoForm, setOpenDeleteTaoForm] = useState<boolean>(false);
  const [openUI, setOpenUI] = useState<boolean>(true);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { tripId, dayId } = useParams(); // dayId - day index in days, not day.id
  const prevDayId = useRef<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const correctUri = uri.length > 1 ? uri : "";
  const navigate = useNavigate();

  const markers =
    taos?.map((tao) => {
      return {
        id: String(tao.id),
        label: tao.attraction.title,
        lat: tao.attraction.lat,
        lng: tao.attraction.lng,
        zoom: MapUtils.resultTypeToZoom(tao.attraction.resultType),
      };
    }) ?? [];

  const maxImageCount = 4;
  const isMaxImageCountReached = images.length === maxImageCount;

  const isOverview = !Boolean(dayId);

  const initTrip = async () => {
    if (tripId && token) {
      setIsLoading(true);
      getTripImages();

      // get trip basic
      let tripBasic = await tripsService.getMyTripById(Number(tripId), token);
      tripBasicRef.current = tripBasic;
      syncTrip();

      BehaviorUtils.sleep();
      setIsLoading(false);
    }
  };

  const getTripImages = async () => {
    if (token) {
      // get trip image
      let tripImages = await tripsService.getImagesByTripId(
        Number(tripId),
        token
      );
      imagesRef.current = tripImages;
      syncImages();
    }
  };

  const deleteTripImage = async (index: number) => {
    if (tripBasic && token) {
      try {
        let imageId = images[index].id;
        await tripsService.deleteTripImage(tripBasic.id, imageId, token);

        syncDetachImage(imageId);

        enqueueSnackbar("Successfully detached image.", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const initDays = async () => {
    if (tripId && token) {
      // get days with trip id
      let days = await daysService.getDaysByTripId(Number(tripId), token);
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
        taos = await taosService.getTaosByDayId(day.id, token ?? undefined);
        taosMapRef.current.set(day.id, taos);
      }
      setTaos(taos);

      // optional - also updates tao component if it is open
      if (tao) {
        initTao(tao);
      }
    } else {
      setTaos(undefined);
      prevDayId.current = undefined;
    }
  };

  const initRouteResponses = async (refresh: boolean = false) => {
    if (day) {
      // check routeResponsesMapRef first when switches from day to day
      let routeResponses: HereRoutingResponse[] | undefined;
      if (!refresh)
        routeResponses = routeResponsesMapRef.current.get(day.id);

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
          r.sections?.map((s) => ({
            polyline: s.polyline,
            groupId: i,
            color: s.transport?.color,
          }))
        )
      )
      .flat(2) as Route[];

    setRoutes(routes);
    setRouteResponses(routeResponses);
  };

  // ref sync functions

  const syncTrip = () => {
    setTripBasic(tripBasicRef.current);
  };

  const syncImages = () => {
    setImages([...imagesRef.current]); // ensure new reference
  };

  const syncAddImage = (image: Image) => {
    imagesRef.current.push(image);
    syncImages();
  };

  const syncDetachImage = (imageId: number) => {
    imagesRef.current = imagesRef.current.filter((i) => i.id !== imageId);
    syncImages();
  };

  // add day and delete day auto-reflects on daysRef by useEffect triggered on tripBasic.numDays

  const syncEditDay = (day: Day) => {
    let _days = [...days];
    _days[navTabValue - 1] = day;
    setDays(_days);
  };

  const syncAddDayTaos = (tao: Tao) => {
    if (day) {
      let dayTaos = taosMapRef.current.get(day.id);

      if (dayTaos) {
        dayTaos.push(tao);
        TimeUtils.orderTaos(dayTaos);

        taosMapRef.current.set(day.id, dayTaos);
        setTaos(dayTaos);

        initRouteResponses(true);
      }
    }
  };

  const syncEditDayTaos = async (tao: Tao) => {
    if (day) {
      let dayTaos = taosMapRef.current.get(day.id);

      if (dayTaos) {
        let index = dayTaos.findIndex((_tao) => _tao.id === tao.id);
        let isAttractionSame =
          dayTaos[index].attraction.id === tao.attraction.id;
        dayTaos[index] = tao;

        taosMapRef.current.set(day.id, dayTaos);
        setTaos(dayTaos);
        setTao(tao);

        if (!isAttractionSame) {
          initRouteResponses();
          return;
        }

        let prevTaoOrder = dayTaos.map((tao) => tao.id);
        TimeUtils.orderTaos(dayTaos);
        let currTaoOrder = dayTaos.map((tao) => tao.id);

        let orderChanged = isEqual(prevTaoOrder, currTaoOrder);

        if (orderChanged) {
          initRouteResponses();
        }
      }
    }
  };

  const syncDeleteDayTaos = (tao: Tao | undefined) => {
    if (day && tao) {
      let dayTaos = taosMapRef.current.get(day.id);

      if (dayTaos) {
        dayTaos = dayTaos.filter((t) => t.id !== tao.id);
        taosMapRef.current.set(day.id, dayTaos);
        setTaos(dayTaos);
        setTao(undefined);

        initRouteResponses(true);
      }
    }
  };

  // render trip on initiation
  useEffect(() => {
    initTrip();
  }, [tripId, token]);

  // rerender days on numDays
  useEffect(() => {
    initDays();
  }, [tripBasic?.numDays]);

  // rerender navTabValue on dayId
  useEffect(() => {
    setNavTabValue(Number(dayId ?? 0));
  }, [dayId]);

  // rerender day on days update and navTabValue
  useEffect(() => {
    setDay(Boolean(navTabValue) ? days[navTabValue - 1] : undefined);
    initTao(undefined);
  }, [navTabValue, days]);

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
                  height={isMobile ? 180 : 200}
                  onDelete={deleteTripImage}
                  readonly={readonly}
                />
              ) : (
                <Box className="trip-profile-default-image-box">
                  {/* image when no images available */}
                  <img src={TLogo} height={isMobile ? 180 : 200} />
                </Box>
              )}

              {/* image selector */}
              <Box className="trip-profile-image-selector-box">
                <ImageSelector
                  tripId={tripBasic?.id}
                  imageIds={images.map((image) => image.id)}
                  disabled={isMaxImageCountReached}
                  syncAddImage={syncAddImage}
                  readonly={readonly}
                >
                  <TTChipButton
                    className="trip-profile-image-chip-button"
                    label={`${readonly ? imageIndex + 1 : images.length}/${
                      readonly ? images.length : maxImageCount
                    }`}
                    size="small"
                    icon={
                      isMaxImageCountReached || readonly ? undefined : (
                        <AddIcon />
                      )
                    }
                  />
                </ImageSelector>
              </Box>
            </Box>

            {/* name */}
            <Box className="trip-profile-title-box">
              <NameComponent
                tripBasicRef={tripBasicRef}
                syncTrip={syncTrip}
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
                handleOpenDayForm={() => setOpenDayForm(true)}
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
                inputRef={inputRef}
                syncEditDay={syncEditDay}
                syncAddDayTaos={syncAddDayTaos}
                syncEditDayTaos={syncEditDayTaos}
                readonly={readonly}
              />
            </Box>
          ) : (
            <Box className="trip-profile-description-box">
              <DescriptionComponent
                tripBasicRef={tripBasicRef}
                syncTrip={syncTrip}
                isLoading={isLoading}
                readonly={readonly}
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
              routeResponsesMapRef={routeResponsesMapRef}
              routeResponses={routeResponses}
              setRouteResponses={initRoutes}
              onClose={() => initTao(undefined)}
              syncEditDayTaos={syncEditDayTaos}
              readonly={readonly}
            />
          </Box>
        </Box>

        {/* open button */}
        <Box
          className={clsx("trip-profile-open-button-box", !openUI && "hidden")}
        >
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
          focusId={String(tao?.id)}
          openUI={openUI}
          focusRoute
          openPopUp
        />
      </Box>

      <AddDayForm
        tripId={tripBasic?.id}
        tripBasicRef={tripBasicRef}
        syncTrip={syncTrip}
        open={openDayForm}
        onClose={() => setOpenDayForm(false)}
      />

      <DeleteDayForm
        open={openDeleteDayForm}
        onClose={() => setOpenDeleteDayForm(false)}
        day={days[Number(dayId ?? 0) - 1]}
        dayId={Number(dayId)}
        tripBasicRef={tripBasicRef}
        syncDeleteDay={() => {
          navigate(overViewNavTab.to);
        }}
      />

      <DeleteTaoForm
        open={openDeleteTaoForm}
        onClose={() => setOpenDeleteTaoForm(false)}
        tao={tao}
        setIsParentUpdated={() => {
          setTao(undefined);
          syncDeleteDayTaos(tao);
        }}
      />

      <TaoForm
        open={openEditTaoForm}
        onClose={() => setOpenEditTaoForm(false)}
        dayIndex={Number(dayId)}
        tao={tao}
        syncAddDayTaos={syncAddDayTaos}
        syncEditDayTaos={syncEditDayTaos}
      />
    </Box>
  );
};

export default TripProfile;
