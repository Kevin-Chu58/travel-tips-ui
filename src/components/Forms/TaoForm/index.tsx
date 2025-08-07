import AttractionFinder from "@components/AttractionFinder";
import Map from "@components/Map";
import HighlightsFragment from "@components/Profile/HighlightProfile/HighlightsFragment";
import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { mild_box_shadow, mild_box_shadow_lg } from "@constants/Shadows";
import { useIsMobile } from "@hooks/useIsMobile";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import type { RootState } from "@redux/store";
import type { AttractionV2 } from "@services/attractions";
import { highlightsService, type Highlight } from "@services/highlights";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import MapUtils from "@utils/MapUtils";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import DescriptionTextField from "@components/TextField/DescriptionTextField";
import { enqueueSnackbar } from "notistack";
import { taosService } from "@services/taos";
import TimeUtils from "@utils/TimeUtils";

type TaoFormProps = {
  open: boolean;
  onClose: () => void;
  dayIndex: number;
  dayId: number | undefined;
  start: string | undefined;
  end: string | undefined;
  setIsParentUpdated?: () => void;
};

const TaoForm = ({
  open,
  onClose,
  dayIndex,
  dayId,
  start,
  end,
  setIsParentUpdated,
}: TaoFormProps) => {
  // windows
  const isMobile = useIsMobile();
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
  // highlights
  const [highlights, setHighlights] = useState<Highlight[] | undefined>();
  const [isHighlightLoading, setIsHighlightLoading] = useState<boolean>(false);
  // highlight mode
  // 1 - search for others' highlights, 2 - write your own
  const [highlightMode, setHighlightMode] = useState<number | undefined>();
  const [highlightValue, setHiHighlightValue] = useState<string>(""); // the highlight value if you write your own
  // selected highlight
  const [selectHighlightId, setSelectHighlightId] = useState<
    number | undefined
  >();
  // action button
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isCustomHighlight =
    highlightMode === 2 && highlightValue.trim().length > 0;
  const actionButtonIcon = isProcessing ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AddIcon />
  );
  const actionButtonLabel = !Boolean(attraction)
    ? "create event"
    : selectHighlightId
    ? "create event with others highlight"
    : isCustomHighlight
    ? "create event with custom highlight"
    : "create event without highlight";
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender on highlight mode
  useEffect(() => {
    const handleHighlightMode = async () => {
      if (highlightMode === 1) {
        if (highlights === undefined && attraction?.id) {
          setIsHighlightLoading(true);

          let highlights = await highlightsService.getHighlightsByAttractionId(
            attraction.id
          );

          await BehaviorUtils.sleep();
          setIsHighlightLoading(false);
          setHighlights(highlights);
        }
      }

      if (highlightMode !== 1) {
        setSelectHighlightId(undefined);
      }
    };

    handleHighlightMode();
  }, [highlightMode]);

  const handleClose = () => {
    onClose();
    setAttraction(undefined);
    setHighlights(undefined);
    setHighlightMode(0);
    setSelectHighlightId(undefined);
    setHiHighlightValue("");
  };

  const handleClearAttraction = () => {
    setAttraction(undefined);
    setHighlights(undefined);
    setHighlightMode(0);
  };

  const handleClickCreateTao = async () => {
    if (dayId && start && end && attraction && token) {
      try {
        setIsProcessing(true);

        // if has custom highlight, post that highlight first, then post tao
        let highlightId = selectHighlightId;

        if (isCustomHighlight) {

          let newHighlight = {
            attractionId: attraction.id,
            description: highlightValue.trim(),
          };

          let highlightViewModel = await highlightsService.postHighlight(newHighlight, token);
          highlightId = highlightViewModel.id;
        }

        let _start = TimeUtils.formatTimehmmAToHHmmss(start);
        let _end = TimeUtils.formatTimehmmAToHHmmss(end);

        let newTao = {
          dayId: dayId,
          start: _start,
          end: _end,
          attractionId: attraction.id,
          highlightId: highlightId,
        };

        await taosService.postTao(dayId, newTao, token);

        await BehaviorUtils.sleep();
        enqueueSnackbar("Succesfully created the event.", { variant: "success" });
        
        if (setIsParentUpdated)
          setIsParentUpdated();

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
      <Box
        display="flex"
        position="relative"
        flexDirection="column"
        width={{ xs: "80vw", md: "60vw" }}
        height="80vh"
      >
        {/* tao form header */}
        <Box p={2}>
          <Typography fontSize="1.4rem">Plan Event — Day {dayIndex}</Typography>
        </Box>

        <Divider variant="middle" flexItem />

        <Box flex={1} width="100%" mr="auto" py={2} sx={{ overflowY: "auto" }}>
          {/* tao form content */}
          <Box height="100%">
            <Box ml={4} mr={4} display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="left" gap={2} fontSize="1.2rem">
                <Typography fontSize="inherit">Start Time:</Typography>
                <Typography fontSize="inherit">{start}</Typography>
              </Box>

              <Box display="flex" alignItems="left" gap={2} fontSize="1.2rem">
                <Typography fontSize="inherit">End Time:</Typography>
                <Typography fontSize="inherit">{end}</Typography>
              </Box>

              {/* attraction & highlights*/}
              {attraction ? (
                <React.Fragment>
                  {/* attraction */}
                  <Box
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    gap={2}
                    my={2}
                  >
                    {/* map */}
                    <Box
                      width={isMobile ? "100%" : 240}
                      height={200}
                      borderRadius={2}
                      overflow="hidden"
                      boxShadow={mild_box_shadow_lg}
                    >
                      <Map
                        readonly
                        updateOnMarkerFocus
                        markers={markers}
                        focusId={attraction.hereId}
                      />
                    </Box>

                    {/* attraction info */}
                    <Box flex={1}>
                      <Typography fontSize="1.4rem">
                        {attraction.title}
                      </Typography>
                      <Typography fontSize="1rem" mb={2}>
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

                  {/* highlights */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    borderRadius={2}
                    p={2}
                    bgcolor="#0d47a1" // info.900
                    boxShadow={mild_box_shadow}
                  >
                    <Typography
                      p={2}
                      color="white"
                      textAlign="center"
                      whiteSpace="pre-wrap"
                      fontFamily="lexend deca"
                    >
                      Feel free to pick a highlight —{"\n"} or even better,
                      create your own!
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={2}>
                      <TTButton
                        color="info"
                        ariaLabel="option 1: search existing highlights"
                        onClick={() => setHighlightMode(1)}
                      >
                        looking for others
                      </TTButton>
                      <TTButton
                        color="inherit"
                        ariaLabel="option 2: write you own highlight"
                        onClick={() => setHighlightMode(2)}
                      >
                        write your own
                      </TTButton>
                    </Box>
                  </Box>

                  {/* highlights-mode-content */}

                  {highlightMode === 1 ? (
                    <HighlightsFragment
                      attraction={attraction}
                      highlights={highlights ?? []}
                      isHighlightLoading={isHighlightLoading}
                      selectHighlightId={selectHighlightId}
                      setSelectHighlightId={setSelectHighlightId}
                      allowChangeHighlight={false}
                    />
                  ) : highlightMode === 2 ? (
                    <DescriptionTextField
                      value={highlightValue}
                      setValue={setHiHighlightValue}
                    />
                  ) : (
                    <></>
                  )}

                  <Box height={30} />
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
        <Box position="absolute" bottom={20} right={20}>
          <TTButton
            color="info"
            onClick={handleClickCreateTao}
            startIcon={actionButtonIcon}
            label={actionButtonLabel}
            disabled={!Boolean(attraction) || isProcessing}
            sx={{ borderRadius: 20 }}
          />
        </Box>
      </Box>
    </TTDialog>
  );
};

export default TaoForm;
