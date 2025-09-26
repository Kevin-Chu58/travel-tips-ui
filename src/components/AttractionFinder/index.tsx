import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import TTDialog from "@components/TTDialog";
import Map from "@components/Map";
import TTIconButton from "@components/TTIconButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import React from "react";
import { useIsMobile } from "@hooks/useIsMobile";
import AttractionSearch from "./AttractionSearch";
import AttractionSelectButton from "./AttractionSelectButton";
import AttractionList from "./AttractionList";
import { attractionsService, type AttractionV2 } from "@services/attractions";
import MapUtils from "@utils/MapUtils";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import AttractionFragment from "@components/Profile/HighlightProfile/AttractionFragment";
import DescriptionTextField from "@components/TextField/DescriptionTextField";
import AddIcon from "@mui/icons-material/Add";
import TTButton from "@components/TTButton";
import { highlightsService } from "@services/highlights";
import { useSnackbar } from "notistack";
import { type GeoCoordinate } from "@constants/Types";
import clsx from "clsx";
import "./index.scss";

type AttractionFinderProps = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  setIsParentUpdated?: () => void;
  setParentAttraction?: (state: AttractionV2) => void;
};

const AttractionFinder = ({
  open,
  setOpen,
  setIsParentUpdated,
  setParentAttraction,
}: AttractionFinderProps) => {
  // window
  const isMobile = useIsMobile();
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // geo coordinate
  const [geoCoordinate, setGeoCoordinate] = useState<
    GeoCoordinate | undefined
  >();
  const [isCoordMode, setIsCoordMode] = useState<boolean>(false);
  // search
  const [search, setSearch] = useState<string>("");
  // result
  const [result, setResult] = useState<AttractionV2[]>([]); // result from here map discover api
  // map focus
  const [focusId, setFocusId] = useState<string | undefined>(); // focused here id
  // mobile view
  const [showResult, setShowResult] = useState<boolean>(true);
  // attraction layer
  const [attraction, setAttraction] = useState<AttractionV2 | undefined>();
  const [isAttractionLoading, setIsAttractionLoading] =
    useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);

  useEffect(() => {
    const initGeoCoordinate = async () => {
      if (open) {
        const geoCoords = await MapUtils.getCurrentLocation();
        setGeoCoordinate(geoCoords);
      }
    };
    initGeoCoordinate();
  }, [open]);

  const clear = async () => {
    setSearch("");
    setFocusId(undefined);
    setResult([]);
    setGeoCoordinate(undefined);
    // hide the animation of shifting back to right side
    await BehaviorUtils.sleep(100);
    setAttraction(undefined);
  };

  const handleSelectClick = async () => {
    if (focusId) {
      try {
        setIsAttractionLoading(true);

        let attraction = await attractionsService.postNewAttraction(focusId);

        await BehaviorUtils.sleep();

        // if has setParentAttraction, then return the attraction to the parent
        // then skipping the attraction layer and close the dialog
        if (setParentAttraction !== undefined) {
          setParentAttraction(attraction);
          handleClose();
        } else {
          setAttraction(attraction);
          setIsAttractionLoading(false);
        }
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }

      setIsAttractionLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    clear();

    // optionally rerender the parent
    if (setIsParentUpdated) setIsParentUpdated();
  };

  const handleGeoCoordinateClick = (geoCoords: GeoCoordinate) => {
    setGeoCoordinate(geoCoords);
    setIsCoordMode(false);
  };

  const actionIcon = isPosting ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AddIcon />
  );

  const handlePost = async () => {
    const trimedDescription = description.trim();

    if (attraction && trimedDescription.length > 0) {
      try {
        setIsPosting(true);
        await highlightsService.postHighlight({
          attractionId: attraction.id,
          description: trimedDescription,
        });
        await BehaviorUtils.sleep();

        enqueueSnackbar("Successfully posted highlight.", {
          variant: "success",
        });
        setIsPosting(false);
        handleClose();
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
      setIsPosting(false);
    }
  };

  const markers = useMemo(() => {
    return result.map((r) => ({
      id: r.hereId,
      lat: r.lat,
      lng: r.lng,
      label: r.title,
      zoom: MapUtils.resultTypeToZoom(r.resultType),
    }));
  }, [result]);

  // components
  const attractionSearch = (
    <AttractionSearch
      search={search}
      setSearch={setSearch}
      geoCoordinate={geoCoordinate}
      setIsCoordMode={setIsCoordMode}
      setResult={setResult}
      setShowResult={setShowResult}
    />
  );

  const selectButton = (
    <AttractionSelectButton
      focusId={focusId}
      isAttractionLoading={isAttractionLoading}
      onClick={handleSelectClick}
    />
  );

  const attractionList = result.length > 0 && (
    <AttractionList
      result={result}
      setShowResult={setShowResult}
      focusId={focusId}
      setFocusId={setFocusId}
    />
  );

  const attractionListShowButton = (
    <TTIconButton
      className="attraction-finder-show-list-button"
      onClick={() => setShowResult(true)}
    >
      <NavigateNextIcon />
    </TTIconButton>
  );

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      {/* map layer */}
      <Box className="attraction-finder-map-box">
        <Map
          markers={markers}
          focusId={focusId}
          currentCoordinate={geoCoordinate}
          setCurrentCoordinate={
            isCoordMode ? handleGeoCoordinateClick : undefined
          }
        />
      </Box>

      {/* UI layer */}
      {!isCoordMode &&
        (isMobile ? (
          <React.Fragment>
            {/* UI layer - search */}
            <Box className="attraction-finder-search-box-mobile">
              {attractionSearch}
            </Box>

            {/* UI layer - next button */}
            <Box className="attraction-finder-next-button-box-mobile">
              {selectButton}
            </Box>

            {/* UI layer - result */}
            <Box
              className={clsx(
                "attraction-finder-result-box-mobile",
                showResult && "focus"
              )}
            >
              {/* result list - attractions */}
              {attractionList}
            </Box>

            {/* UI layer - result button */}
            {!showResult && (
              <Box className="attraction-finder-result-button-box-mobile">
                {/* result list - attractions */}
                {attractionListShowButton}
              </Box>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* UI layer - search */}
            <Box className="attraction-finder-search-box">
              {attractionSearch}
            </Box>

            {/* UI layer - next button */}
            <Box className="attraction-finder-next-button-box">
              {selectButton}
            </Box>

            {/* UI layer - result */}
            <Box className="attraction-finder-result-box">
              {/* result list - attractions */}
              {attractionList}
            </Box>
          </React.Fragment>
        ))}

      {/* attraction layer */}
      <Box
        className={clsx(
          "attraction-finder-attraction-box",
          attraction && "focus"
        )}
      >
        <Box className="attraction-finder-attraction-box-nav-box">
          {/* nav back button */}
          <TTButton
            className="attraction-finder-attraction-box-nav-back-button"
            label="back"
            color="info"
            variant="text"
            startIcon={<NavigateBeforeIcon />}
            onClick={() => setAttraction(undefined)}
          />
        </Box>

        <Box className="attraction-finder-attraction-fragment-box">
          <AttractionFragment
            attraction={attraction}
            isAttractionLoading={false}
            isMobile={isMobile}
          />
        </Box>

        <Box className="attraction-finder-new-highlight-box">
          <Typography className="attraction-finder-new-highlight-header">
            New Highlight
          </Typography>
          <DescriptionTextField value={description} setValue={setDescription} />
          <Box className="attraction-finder-new-highlight-button-box">
            <TTButton
              label="create"
              color="primary"
              startIcon={actionIcon}
              onClick={handlePost}
              disabled={!Boolean(description.trim())}
            />
          </Box>
        </Box>
      </Box>
    </TTDialog>
  );
};

export default AttractionFinder;
