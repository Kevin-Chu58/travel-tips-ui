import Map from "@components/Map";
import type { NavTab } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import { Box, Fab } from "@mui/material";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteDayForm from "@components/Forms/DeleteDayForm";
import { daysService, type Day } from "@services/days";
import { taosService, type Tao } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import TaoComponent from "./TaoComponent";
import ToolTip from "@components/ToolTip";
import DeleteTaoForm from "@components/Forms/DeleteTaoForm";
import TaoForm from "@components/Forms/TaoForm";
import clsx from "clsx";
import "./index.scss";

type TripProfileProps = {
  uri?: string;
};

const TripProfile = ({ uri = "/" }: TripProfileProps) => {
  // window
  const isMobile = useIsMobile();
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // nav tab
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // trip basic
  const [tripBasic, setTripBasic] = useState<Trip | undefined>();
  const [isTripBasicUpdated, setIsTripBasicUpdated] = useState<boolean>(false);
  // trip images
  const [images, setImages] = useState<Image[]>([]);
  // days
  const [days, setDays] = useState<Day[]>([]);
  const [areDaysAsync, setAreDaysAsync] = useState<boolean>(false);
  // day
  const [day, setDay] = useState<Day | undefined>();
  // taos
  const [taos, setTaos] = useState<Tao[] | undefined>();
  const [areTaosAsync, setAreTaosAsync] = useState<boolean>(false);
  // tao
  const [tao, setTao] = useState<Tao | undefined>();
  // form open status
  const [openDayForm, setOpenDayForm] = useState<boolean>(false);
  const [openDeleteDayForm, setOpenDeleteDayForm] = useState<boolean>(false);
  const [openEditTaoForm, setOpenEditTaoForm] = useState<boolean>(false);
  const [openDeleteTaoForm, setOpenDeleteTaoForm] = useState<boolean>(false);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { tripId, dayId } = useParams(); // dayId - day index in days, not day.id
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

  // render trip on initiation
  useEffect(() => {
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

    initTrip();
  }, [tripId, token, isTripBasicUpdated, areDaysAsync]);

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
  }, [navTabValue, days]);

  // rerender taos on day update
  useEffect(() => {
    const initTaos = async () => {
      if (day?.id) {
        let taos = await taosService.getTaosByDayId(day.id, token ?? undefined);
        setTaos(taos);

        if (tao) {
          let _tao = taos.find(t => t.id === tao.id);
          setTao(_tao);
        }
      }
    };
    initTaos();
  }, [day?.id, areTaosAsync]);

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

        enqueueSnackbar("Successfully detached image", {
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
      {/* map */}
      <Box className="trip-profile-map-box">
        <Map
          markers={markers}
          focusId={String(tao?.id)}
          updateOnMarkerFocus
          correctionBias={6}
          correctionDirection="W"
          correctionZoom={0}
        />

        {/* content */}
        <Box className={clsx("trip-profile-content-box", isMobile && "mobile")}>
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
                  bgcolor="primary.main"
                  display="flex"
                  justifyContent="center"
                >
                  {/* image when no images available */}
                  <img src={TLogo} height={isMobile ? 180 : 200} />
                </Box>
              )}

              {/* image selector */}
              <Box position="absolute" right={10} bottom={10}>
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
                setTao={setTao}
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
              tao={tao}
              onClose={() => setTao(undefined)}
              setIsParentUpdated={() => setAreTaosAsync((prev) => !prev)}
            />
          </Box>
        </Box>

        {/* tool fab group */}
        <Box
          className={clsx("trip-profile-tool-fab-group", isMobile && "mobile")}
        >
          {/* edit action - tao */}
          <ToolTip title="Edit event" placement="right">
            <Fab
              color="info"
              className={clsx(
                "trip-profile-tool-fab",
                Boolean(tao) && "visible"
              )}
              onClick={() => setOpenEditTaoForm(true)}
              size="medium"
            >
              <EditIcon />
            </Fab>
          </ToolTip>

          {/* delete action - day, tao */}
          <ToolTip
            title={Boolean(tao) ? "Delete event" : "Delete day"}
            placement="right"
          >
            <Fab
              className={clsx(
                "trip-profile-tool-fab",
                "delete",
                !isOverview && "visible"
              )}
              onClick={
                Boolean(tao)
                  ? () => setOpenDeleteTaoForm(true)
                  : () => setOpenDeleteDayForm(true)
              }
              size="medium"
            >
              <DeleteForeverIcon />
            </Fab>
          </ToolTip>
        </Box>
      </Box>

      <AddDayForm
        tripId={Number(tripId)}
        open={openDayForm}
        onClose={() => setOpenDayForm(false)}
        setIsParentUpdated={() => setIsTripBasicUpdated((prev) => !prev)}
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
