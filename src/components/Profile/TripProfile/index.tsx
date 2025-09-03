import Mapper from "@components/Map";
import { type Route, type NavTab } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import { Box } from "@mui/material";
import type { RootState } from "@redux/store";
import { type Trip, tripsService } from "@services/trips";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [tripBasic, setTripBasic] = useState<Trip | undefined>();
  const [isTripBasicAsync, setIsTripBasicAsync] = useState<boolean>(false);
  // trip images
  const [images, setImages] = useState<Image[]>([]);
  // days
  const [days, setDays] = useState<Day[]>([]);
  const [areDaysAsync, setAreDaysAsync] = useState<boolean>(false);
  // day
  const [day, setDay] = useState<Day | undefined>();
  // taos
  const taoMap = useRef(new Map<number, Tao[]>()); // day.id => tao[]
  const [taos, setTaos] = useState<Tao[] | undefined>();
  const [areTaosAsync, setAreTaosAsync] = useState<boolean>(false);
  // tao
  const [tao, setTao] = useState<Tao | undefined>();
  // map
  const routeResponsesMap = useRef(new Map<number, HereRoutingResponse[]>()); // day.id => routing response[]
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

  const markers = useMemo(() => {
    return (
      taos?.map((tao) => {
        return {
          id: String(tao.id),
          label: tao.attraction.title,
          lat: tao.attraction.lat,
          lng: tao.attraction.lng,
          zoom: MapUtils.resultTypeToZoom(tao.attraction.resultType),
        };
      }) ?? []
    );
  }, [taos]);

  const maxImageCount = 4;
  const isMaxImageCountReached = images.length === maxImageCount;

  const isOverview = !Boolean(dayId);

  const initTrip = async () => {
    if (tripId && token) {
      setIsLoading(true);
      getTripImages();

      // get trip basic
      let tripBasic = await tripsService.getMyTripById(Number(tripId), token);
      setTripBasic(tripBasic);

      BehaviorUtils.sleep();
      setIsLoading(false);
    }
  };

  const initTaos = async () => {
    if (day?.id) {
      // set taos & tao
      let taos: Tao[] | undefined;
      let isSameDay = prevDayId.current === day.id;
      // try to get taos of a day from cache if day is switched
      if (!isSameDay) taos = taoMap.current.get(day.id);
      // if taos does not exist in taoMap, request it from API
      if (isSameDay || !taos) {
        taos = await taosService.getTaosByDayId(day.id, token ?? undefined);
        taoMap.current.set(day.id, taos);
      }
      setTaos(taos);

      // optional - also updates tao component if it is open
      if (tao) {
        updateTao(tao);
      }

      // set routes
      // check routeResponsesMap first when switches from day to day
      let routeResponses: HereRoutingResponse[] | undefined;
      if (prevDayId.current !== day.id) {
        routeResponses = routeResponsesMap.current.get(day.id);
        setRouteResponses(routeResponses);
      }

      // if routeResponsesMap has no routing info for that day, get it from API
      if (!routeResponses) {
        routeResponses = await hereMapService.getRoutingsOnDay(day.id);
        setRouteResponses(routeResponses);
        routeResponsesMap.current.set(day.id, routeResponses);
      }

      prevDayId.current = day.id;

      initRoutes(routeResponses);
    } else {
      setTaos(undefined);
      setRoutes(undefined);
      prevDayId.current = undefined;
    }
  };

  const initRoutes = (routeResponses: HereRoutingResponse[]) => {
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

  // render trip on initiation
  useEffect(() => {
    initTrip();
  }, [tripId, token, isTripBasicAsync, areDaysAsync]);

  // rerender days on numDays
  useEffect(() => {
    const initDays = async () => {
      if (tripId && token) {
        // get days with trip id
        let days = await daysService.getDaysByTripId(Number(tripId), token);
        setDays(days);
      }
    };
    initDays();
  }, [tripBasic?.numDays, areDaysAsync]);

  // rerender navTabValue on dayId
  useEffect(() => {
    setNavTabValue(Number(dayId ?? 0));
  }, [dayId]);

  // rerender day on days update and navTabValue
  useEffect(() => {
    setDay(Boolean(navTabValue) ? days[navTabValue - 1] : undefined);
    updateTao(undefined);
  }, [navTabValue, days]);

  // rerender taos on day update
  useEffect(() => {
    initTaos();
  }, [day?.id, areTaosAsync]);

  const updateTao = (tao: Tao | undefined) => {
    if (!tao) {
      setTao(undefined);
    } else if (taos) {
      let _tao = taos.find((t) => t.id === tao.id);
      setTao(_tao);
    }
  };

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

  // images

  const getTripImages = async () => {
    if (token) {
      // get trip image
      let tripImages = await tripsService.getImagesByTripId(
        Number(tripId),
        token
      );
      setImages(tripImages);
    }
  };

  const deleteTripImage = async (index: number) => {
    if (tripBasic && token) {
      try {
        let imageId = images[index].id;
        await tripsService.deleteTripImage(tripBasic.id, imageId, token);

        let updatedImages = images.filter((i) => i.id !== imageId);
        setImages(updatedImages);

        enqueueSnackbar("Successfully detached image.", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
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
                  height={isMobile ? 180 : 200}
                  onDelete={deleteTripImage}
                />
              ) : (
                <Box
                // TODO - change to className
                  bgcolor="primary.main"
                  display="flex"
                  justifyContent="center"
                >
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
                  setIsParentUpdated={getTripImages}
                >
                  <TTChipButton
                    className="trip-profile-image-chip-button"
                    label={`${images.length}/${maxImageCount}`}
                    size="small"
                    icon={isMaxImageCountReached ? undefined : <AddIcon />}
                  />
                </ImageSelector>
              </Box>
            </Box>

            {/* name */}
            <Box className="trip-profile-title-box">
              <NameComponent
                tripBasic={tripBasic}
                setTripBasic={setTripBasic}
                isLoading={isLoading}
                inputRef={inputRef}
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
                setTao={updateTao}
                inputRef={inputRef}
                setIsParentUpdated={() => setAreDaysAsync((prev) => !prev)}
                setAreTaosUpdated={() => setAreTaosAsync((prev) => !prev)}
              />
            </Box>
          ) : (
            <Box className="trip-profile-description-box">
              <DescriptionComponent
                tripBasic={tripBasic}
                setTripBasic={setTripBasic}
                isLoading={isLoading}
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
              routeResponsesMapRef={routeResponsesMap}
              routeResponses={routeResponses}
              setRouteResponses={initRoutes}
              onClose={() => updateTao(undefined)}
              setIsParentUpdated={() => setAreTaosAsync((prev) => !prev)}
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
            tripBasic={tripBasic}
            setTripBasic={setTripBasic}
            tao={tao}
            isOverview={isOverview}
            setOpenDeleteDayForm={setOpenDeleteDayForm}
            setOpenEditTaoForm={setOpenEditTaoForm}
            setOpenDeleteTaoForm={setOpenDeleteTaoForm}
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
        tripId={Number(tripId)}
        open={openDayForm}
        onClose={() => setOpenDayForm(false)}
        setIsParentUpdated={() => setIsTripBasicAsync((prev) => !prev)}
      />

      <DeleteDayForm
        open={openDeleteDayForm}
        onClose={() => setOpenDeleteDayForm(false)}
        day={days[Number(dayId ?? 0) - 1]}
        dayId={Number(dayId)}
        setIsParentUpdated={() => {
          setAreDaysAsync((prev) => !prev);
          navigate(overViewNavTab.to);
        }}
      />

      <DeleteTaoForm
        open={openDeleteTaoForm}
        onClose={() => setOpenDeleteTaoForm(false)}
        tao={tao}
        setIsParentUpdated={() => {
          setTao(undefined);
          setAreTaosAsync((prev) => !prev);
        }}
      />

      <TaoForm
        open={openEditTaoForm}
        onClose={() => setOpenEditTaoForm(false)}
        dayIndex={Number(dayId)}
        tao={tao}
        setIsParentUpdated={() => {
          setAreTaosAsync((prev) => !prev);
        }}
      />
    </Box>
  );
};

export default TripProfile;
