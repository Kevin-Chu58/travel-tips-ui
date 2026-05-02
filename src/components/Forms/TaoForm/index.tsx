import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { useIsMobile } from "@hooks/useIsMobile";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import type { Attraction } from "@services/attractions";
import MapUtils from "@utils/MapUtils";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { enqueueSnackbar } from "notistack";
import { taosService, type Tao } from "@services/taos";
import TimeUtils from "@utils/TimeUtils";
import { hhmm, hhmmss, HHmmss, hmma } from "@constants/Times";
import type { GeoCoordinate } from "@constants/Types";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import clsx from "clsx";
import "./index.scss";

// lazy load/
const Map = React.lazy(() => import("@components/Map"));
const TTTimePicker = React.lazy(() => import("@components/TTTimePicker"));
const AttractionFinder = React.lazy(() => import("@components/AttractionFinder"));

type TaoFormProps = {
  open: boolean;
  onClose: () => void;
  dayIndex?: number;
  dayId?: number;
  tao?: Tao;
  start?: string;
  end?: string;
  lastGeoCoordinate?: GeoCoordinate | undefined;
  setLastGeoCoordinate?: (state: GeoCoordinate) => void;
  asyncAddDayTaos?: (state: Tao) => void;
  asyncEditDayTaos?: (state: Tao) => void;
};

const TaoForm = ({
  open,
  onClose,
  dayIndex,
  dayId,
  tao,
  start,
  end,
  lastGeoCoordinate,
  setLastGeoCoordinate,
  asyncAddDayTaos,
  asyncEditDayTaos,
}: TaoFormProps) => {
  // windows
  const isMobile = useIsMobile();
  // start/end time
  const [_start, _setStart] = useState<Dayjs | undefined>();
  const [_end, _setEnd] = useState<Dayjs | undefined>();
  const _startHmma = _start ? TimeUtils.dayjsToString(hmma, _start) : "";
  const _endHmma = _end ? TimeUtils.dayjsToString(hmma, _end) : "";
  // const [_start, _setStart] = useState<string | undefined>();
  // const [_end, _setEnd] = useState<string | undefined>();
  const areTimesValid =
    _endHmma === "12:00 AM" ||
    TimeUtils.compareTime(hmma, _startHmma, _endHmma);
  // attraction
  const [attraction, setAttraction] = useState<Attraction | undefined>();
  // attraction finder
  const [openFinder, setOpenFinder] = useState<boolean>(false);
  // attraction marker
  const markers = attraction
    ? [
        {
          id: attraction.hereId,
          label: attraction.title,
          lat: attraction.lat,
          lng: attraction.lng,
          zoom: MapUtils.resultTypeToZoom(attraction.resultType),
        },
      ]
    : [];
  // action button
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const actionButtonIcon = isProcessing ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : tao ? (
    <EditIcon />
  ) : (
    <AddIcon />
  );
  const actionButtonLabel = (tao ? "update" : "create") + " event";

  // rerender initial states on tao
  useEffect(() => {
    // init patch states
    if (open) {
      if (tao) {
        _setStart(dayjs(tao.start, hhmmss));
        _setEnd(dayjs(tao.end, hhmmss));
        setAttraction(tao.attraction);
      } else {
        _setStart(dayjs(start!, hhmm));
        _setEnd(dayjs(end!, hhmm));
      }
    }
  }, [open]);

  // handle set start/end
  const handleSetStart = (start: Dayjs | null) => {
    _setStart(start ?? undefined);
  };

  const handleSetEnd = (end: Dayjs | null) => {
    _setEnd(end ?? undefined);
  };

  // handle action
  const handleClose = () => {
    handleClearAttraction();
    onClose();
  };

  const handleClearAttraction = () => {
    setAttraction(undefined);
  };

  const handleClickActionButton = async () => {
    let _dayId = dayId || tao?.dayId;
    if (_dayId && _start && _end && areTimesValid && attraction) {
      try {
        setIsProcessing(true);

        let startTime = TimeUtils.dayjsToString(HHmmss, _start);
        let endTime = TimeUtils.dayjsToString(HHmmss, _end);

        if (tao) {
          let isSameAttraction = tao?.attraction.id === attraction.id;
          let _tao = {
            dayId: _dayId,
            start: startTime,
            end: endTime,
            attractionId: isSameAttraction ? undefined : attraction.id,
          };

          let updatedTao = await taosService.patchTao(tao.id, _tao);

          if (asyncEditDayTaos) asyncEditDayTaos(updatedTao);
        } else {
          let _tao = {
            dayId: _dayId,
            start: startTime,
            end: endTime,
            attractionId: attraction.id,
          };
          let newTao = await taosService.postTao(_dayId, _tao);

          if (asyncAddDayTaos) asyncAddDayTaos(newTao);
        }
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }

      setIsProcessing(false);
      handleClose();
    }
  };

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box className={clsx("tao-form-box", isMobile && "mobile")}>
        {/* tao form header */}
        <Box className="tao-form-header-box">
          <Typography className="tao-form-header-text">
            Plan Event — Day {dayIndex}
          </Typography>
        </Box>

        <Divider variant="middle" flexItem />

        <Box className="tao-form-content-box">
          {/* tao form content */}
          <Box>
            <Box className="tao-form-content">
              {/* start time picker */}
              <Box className="tao-form-time-box">
                <Typography className="tao-form-time-text">
                  Start Time:
                </Typography>
                <TTTimePicker
                  value={_start}
                  setValue={handleSetStart}
                  minutesStep={15}
                />
              </Box>

              {/* end time picker */}
              <Box className="tao-form-time-box">
                <Typography className="tao-form-time-text">
                  End Time:
                </Typography>
                <TTTimePicker
                  value={_end}
                  setValue={handleSetEnd}
                  minutesStep={15}
                />
              </Box>

              {!areTimesValid ? (
                <Typography className="tao-form-time-helper-text" color="error">
                  Start time must be earlier than end time.
                </Typography>
              ) : undefined}

              {/* attraction content */}
              {attraction ? (
                <React.Fragment>
                  {/* attraction */}
                  <Box
                    className={clsx(
                      "tao-form-attraction-box",
                      isMobile && "mobile",
                    )}
                  >
                    {/* map */}
                    <Box
                      className={clsx("tao-form-map-box", isMobile && "mobile")}
                    >
                      <Map
                        readonly
                        markers={markers}
                        focusId={attraction.hereId}
                      />
                    </Box>

                    {/* attraction info */}
                    <Box>
                      <Typography className="tao-form-header-text">
                        {attraction.title}
                      </Typography>
                      <Typography className="tao-form-address">
                        {attraction.address}
                      </Typography>

                      <TTButton
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={handleClearAttraction}
                      >
                        clear attraction
                      </TTButton>
                    </Box>
                  </Box>
                </React.Fragment>
              ) : (
                <Box>
                  <TTButton
                    color="info"
                    startIcon={<SearchIcon />}
                    onClick={() => setOpenFinder(true)}
                  >
                    Find an Attraction
                  </TTButton>
                  <AttractionFinder
                    open={openFinder}
                    setOpen={setOpenFinder}
                    lastGeoCoordinate={lastGeoCoordinate}
                    setLastGeoCoordinate={setLastGeoCoordinate}
                    setParentAttraction={setAttraction}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* action button */}
        <Box className="tao-form-action-button-box">
          <TTButton
            className="tao-form-action-button"
            color="info"
            onClick={handleClickActionButton}
            startIcon={actionButtonIcon}
            label={actionButtonLabel}
            disabled={!Boolean(attraction) || !areTimesValid || isProcessing}
          />
        </Box>
      </Box>
    </TTDialog>
  );
};

export default TaoForm;
