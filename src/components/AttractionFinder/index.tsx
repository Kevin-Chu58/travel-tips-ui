import { Box, Chip, Divider, TextField, Typography } from "@mui/material";
import { osmService, type OsmEntity } from "@services/geoMap/osm";
import { useMemo, useState } from "react";
import IdentifierUtils from "@utils/IdentifierUtils";
import TTDialog from "@components/TTDialog";
import Map from "@components/Map";
import TTIconButton from "@components/TTIconButton";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { mild_box_shadow, mild_box_shadow_lg } from "@constants/Shadows";
import React from "react";
import TTButton from "@components/TTButton";
import { CompareUtils } from "@utils/CompareUtils";
import { HighlighterHelper } from "@helpers/HighlightHelper";
import { useIsMobile } from "@hooks/useIsMobile";
import { OsmTypes } from "@constants/Maps";

type AttractionFinderProps = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  setIsParentUpdated?: () => void;
};

const AttractionFinder = ({
  open,
  setOpen,
  setIsParentUpdated,
}: AttractionFinderProps) => {
  // window
  const isMobile = useIsMobile();
  // search
  const [search, setSearch] = useState<string>("");
  const [lastSearch, setLastSearch] = useState<string>("");
  // result
  const [result, setResult] = useState<OsmEntity[]>([]); // result from osm api
  // map focus
  const [focusId, setFocusId] = useState<string | undefined>(); // focused osm id

  // update parent attribute on attraction

  const clear = () => {
    setSearch("");
    setLastSearch("");
    setFocusId(undefined);
    setResult([]);
  };

  const handleClose = () => {
    setOpen(false);
    clear();

    // optionally rerender the parent
    if (setIsParentUpdated) setIsParentUpdated();
  };

  const handleSearch = async () => {
    if (search.toLowerCase().trim() !== lastSearch.toLowerCase().trim()) {
      const searchResult = await osmService.getOsmEntitiesByName(search);
      console.log(searchResult);
      setResult(filterResult(searchResult));
      setLastSearch(search);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const filterResult = (result: OsmEntity[]) => {
    return result.filter(
      (osm) =>
        osm.osm_id !== undefined &&
        CompareUtils.containsSomeWords(search, osm.name)
    );
  };

  const markers = useMemo(() => {
    return result.map((r) => ({
      id: IdentifierUtils.getOsmItemId(r),
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      label: r.name,
      osmId: r.osm_id,
      osmType: r.osm_type,
      zoom: r.place_rank,
    }));
  }, [result]);

  const handleAttractionClick = (osmEntity: OsmEntity) => {
    setFocusId(IdentifierUtils.getOsmItemId(osmEntity));
  };

  // components
  const attractionSearch = (
    <React.Fragment>
      {/* search */}
      <TextField
        size="small"
        placeholder="Find Attraction"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          ".MuiInputBase-root": {
            borderRadius: 10,
            bgcolor: "white",
            boxShadow: mild_box_shadow,
          },
        }}
      />
      <TTIconButton
        onClick={handleSearch}
        sx={{
          color: "white",
          bgcolor: "black",
          borderRadius: 20,
          boxShadow: mild_box_shadow_lg,
          ":hover": {
            bgcolor: "#333333",
          },
        }}
      >
        <SearchIcon />
      </TTIconButton>
    </React.Fragment>
  );

  const nextButton = (
    <TTButton
      color="primary"
      endIcon={<NavigateNextIcon />}
      disabled={!Boolean(focusId)}
      sx={{ borderRadius: 20, boxShadow: mild_box_shadow_lg }}
    >
      Next
    </TTButton>
  );

  const attractionList = result.length > 0 && (
    <Box
      sx={{
        width: 320,
        m: 1,
        p: 1,
        pr: 0,
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: mild_box_shadow,
      }}
    >
      {/* title - result */}
      <Typography fontSize="1.2rem">Result</Typography>
      {/* attraction items */}
      <Box
        sx={{
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {result.map((osmEntity, i) => (
          <React.Fragment key={IdentifierUtils.getOsmItemId(osmEntity)}>
            <TTButton
              fullWidth
              onClick={() => handleAttractionClick(osmEntity)}
              variant="text"
              sx={{
                textAlign: "left",
                justifyContent: "flex-start",
                bgcolor:
                  focusId === IdentifierUtils.getOsmItemId(osmEntity)
                    ? "primary.100"
                    : "white",
              }}
            >
              <Box width="100%" my={0.5}>
                <Box flex={1} display="flex" flexDirection="row">
                  <Box flex={1}>
                    <Typography fontSize="1rem">
                      {HighlighterHelper.getHighlightedText(
                        osmEntity.name,
                        lastSearch
                      )}
                    </Typography>
                  </Box>
                  <Chip size="small" label={OsmTypes[osmEntity.osm_type]} />
                </Box>
                <Box>
                  <Typography fontSize=".8rem" color="dimgrey">
                    {HighlighterHelper.getHighlightedText(
                      osmEntity.display_name,
                      lastSearch
                    )}
                  </Typography>
                </Box>
              </Box>
            </TTButton>
            {i + 1 < result.length && <Divider flexItem />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box
        display="flex"
        flexDirection="column"
        position="relative"
        width="80vw"
        maxHeight="90vh"
        sx={{ overflowY: "auto" }}
      >
        {/* map layer */}
        <Box height="90vh">
          <Map
            markers={markers}
            focusId={focusId}
            correctionZoom={8}
            updateOnMarkerFocus
          />
        </Box>
      </Box>

      {/* UI layer */}
      {!isMobile ? (
        <React.Fragment>
          {/* UI layer - search */}
          <Box
            position="absolute"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            zIndex={1100}
            top={10}
            left={10}
            gap={2}
          >
            {attractionSearch}
          </Box>

          {/* UI layer - search */}
          <Box position="absolute" zIndex={1100} top={10} right={10}>
            {nextButton}
          </Box>

          {/* UI layer - result */}
          <Box
            position="absolute"
            display="flex"
            flexDirection="column"
            zIndex={1100}
            top={60}
            left={4}
            gap={2}
          >
            {/* result list - attractions */}
            {attractionList}
          </Box>
        </React.Fragment>
      ) : (
        <></>
      )}

      {/* <Grid
        container
        minWidth={150}
        height="80vh"
      > */}
      {/* left panel */}
      {/* <Grid
          container
          direction="column"
          display="flex"
          flexDirection="column"
          size={4}
          spacing={2}
          height="100%"
          sx={{ overflowY: "auto" }}
        >
          <SearchPanel
            result={result}
            setResult={setResult}
            focusId={focusId}
            setIdFocus={setIdFocus}
            setOpenHighlight={setOpenHighlight}
            clearEditAttraction={clearEditAttraction}
            handleClose={handleClose}
          />
        </Grid> */}

      {/* right panel */}
      {/* <Grid size={8}>
          <MapPanel
            result={result}
            attractionResult={attractionResult}
            attractionFocus={attractionFocus}
            setAttractionFocus={setAttractionFocus}
            focusId={focusId}
            openHighlight={openHighlight}
            setOpenHighlight={setOpenHighlight}
            openEditAttraction={openEditAttraction}
            setOpenEditAttraction={setOpenEditAttraction}
            description={description}
            setDescription={setDescription}
            setIsParentUpdated={() => setIsUpdated(prev => !prev)}
            clearEditAttraction={clearEditAttraction}
          />
        </Grid> */}
      {/* </Grid> */}
    </TTDialog>
  );
};

export default AttractionFinder;
