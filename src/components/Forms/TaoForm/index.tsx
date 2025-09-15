import AttractionFinder from "@components/AttractionFinder";
import Map from "@components/Map";
import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { useIsMobile } from "@hooks/useIsMobile";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import type { RootState } from "@redux/store";
import type { AttractionV2 } from "@services/attractions";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import MapUtils from "@utils/MapUtils";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { taosService, type Tao } from "@services/taos";
import TimeUtils from "@utils/TimeUtils";
import { hmma } from "@constants/Times";
import TTMobileTimePicker from "@components/TTMobileTimePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import clsx from "clsx";
import "./index.scss";

type TaoFormProps = {
  open: boolean;
  onClose: () => void;
  dayIndex?: number;
  dayId?: number;
  tao?: Tao;
  start?: string;
  end?: string;
  syncAddDayTaos: (state: Tao) => void;
  syncEditDayTaos: (state: Tao) => void;
};

const TaoForm = ({
  open,
  onClose,
  dayIndex,
  dayId,
  tao,
  start,
  end,
  syncAddDayTaos,
  syncEditDayTaos,
}: TaoFormProps) => {
  // windows
  const isMobile = useIsMobile();
  // start/end time
  const [_start, _setStart] = useState<string | undefined>();
  const [_end, _setEnd] = useState<string | undefined>();
  const areTimesValid =
    _end === "12:00 AM" || TimeUtils.compareTime(hmma, _start, _end);
  // attraction
  const [attraction, setAttraction] = useState<AttractionV2 | undefined>();
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
  ) : (
    <AddIcon />
  );
  const actionButtonLabel = (tao ? "update" : "create") + " event";
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender initial states on tao
  useEffect(() => {
    // init patch states
    if (open) {
      if (tao) {
        _setStart(TimeUtils.formatTimeHHmmssTohmmA(tao.start));
        _setEnd(TimeUtils.formatTimeHHmmssTohmmA(tao.end));
        setAttraction(tao.attraction);
      } else {
        _setStart(TimeUtils.formatTimeHHmmTohmmA(start!));
        _setEnd(TimeUtils.formatTimeHHmmTohmmA(end!));
      }
    }
  }, [open]);

  // handle set start/end
  const handleSetStart = (start: Dayjs | null) => {
    _setStart(TimeUtils.dayjsToString(hmma, start));
  };

  const handleSetEnd = (end: Dayjs | null) => {
    _setEnd(TimeUtils.dayjsToString(hmma, end));
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
    if (_dayId && _start && _end && areTimesValid && attraction && token) {
      try {
        setIsProcessing(true);

        let startTime = TimeUtils.formatTimehmmAToHHmmss(_start);
        let endTime = TimeUtils.formatTimehmmAToHHmmss(_end);

        if (tao) {
          let isSameAttraction = tao?.attraction.id === attraction.id;
          let _tao = {
            dayId: _dayId,
            start: startTime,
            end: endTime,
            attractionId: isSameAttraction ? undefined : attraction.id,
          };

          let updatedTao = await taosService.patchTao(tao.id, _tao, token);

          syncEditDayTaos(updatedTao);
        } else {
          let _tao = {
            dayId: _dayId,
            start: startTime,
            end: endTime,
            attractionId: attraction.id,
          };
          let newTao = await taosService.postTao(_dayId, _tao, token);

          syncAddDayTaos(newTao);
        }

        await BehaviorUtils.sleep();
        enqueueSnackbar(
          `Succesfully ${tao ? "updated" : "created"} the event.`,
          {
            variant: "success",
          }
        );
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
                <TTMobileTimePicker
                  value={dayjs(_start, hmma)}
                  setValue={handleSetStart}
                  maxTime={
                    _end && _end !== "12:00 AM" ? dayjs(_end, hmma) : undefined
                  }
                  minutesStep={15}
                />
              </Box>

              {/* end time picker */}
              <Box className="tao-form-time-box">
                <Typography className="tao-form-time-text">
                  End Time:
                </Typography>
                <TTMobileTimePicker
                  value={dayjs(_end, hmma)}
                  setValue={handleSetEnd}
                  minTime={_start ? dayjs(_start, hmma) : undefined}
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
                      isMobile && "mobile"
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
