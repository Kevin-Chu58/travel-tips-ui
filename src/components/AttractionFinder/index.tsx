import Map from "@components/Map";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { osmService, type OsmEntity } from "@services/geoMap/osm";
import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { OsmTypes, type OsmType } from "@constants/Maps";
import { attractionsService, type Attraction } from "@services/attractions";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";

type AttractionFinderProps = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  updateAttraction: (attraction: Attraction) => void;
};

const AttractionFinder = ({
  open,
  setOpen,
  updateAttraction,
}: AttractionFinderProps) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const defualt_attraction_description = "No Highlight";

  // search and result
  const [search, setSearch] = useState<string>("");
  const [lastSearch, setLastSearch] = useState<string>("");
  const [result, setResult] = useState<OsmEntity[]>([]); // result from osm api
  // choose osm and attraction
  const [osmIdFocus, setOsmIdFocus] = useState<number | undefined>(); // focused osm id
  const [osmTypeFocus, setOsmTypeFocus] = useState<OsmType | undefined>(); // focused osm type
  const [attractionResult, setAttractionResult] = useState<Attraction[]>([]); // attractions available of the focused osm id
  const [attractionFocus, setAttractionFocus] = useState<Attraction | undefined>(); // focused attraction
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  // edit attraction
  const [openEditAttraction, setOpenEditAttraction] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  // rerender on osmIdFocus for highlight results
  useEffect(() => {
    const initAttractionResult = async () => {
      if (osmIdFocus) {
        const attraction = result.find((a) => a.osm_id === osmIdFocus);
        const highlightSearch =
          await attractionsService.getHighlightsByParams(
            undefined,
            attraction!.osm_id
          );
        setAttractionResult(highlightSearch.attractions);
      }
    };
    initAttractionResult();
  }, [osmIdFocus, isUpdated]);

  // update parent attribute on attraction
  useEffect(() => {
    if (attractionFocus) {
      updateAttraction(attractionFocus);
    }
  }, [attractionFocus]);

  const clear = () => {
    // clear attraction focus
    setOsmIdFocus(undefined);
    setOsmTypeFocus(undefined);
    setResult([]);
    setSearch("");
    setLastSearch("");
    setAttractionResult([]);
    setAttractionFocus(undefined);
    clearEditAttraction();
  };

  const handleClose = () => {
    setOpen(false);
    clear();
  };

  const handleSearch = async () => {
    if (search.toLowerCase().trim() !== lastSearch.toLowerCase().trim()) {
      const searchResult = await osmService.getOsmEntitiesByName(search);
      setResult(filterResult(searchResult));
      setLastSearch(search);
      clearEditAttraction();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleFocusOsm = (osmId: number, osmType: OsmType) => {
    clearEditAttraction();
    setOsmIdFocus(osmId);
    setOsmTypeFocus(osmType);
  };

  const handleFocusAttraction = async (attraction: Attraction | undefined) => {
    // if is focused on default attraction that does not exist yet
    // create it and substitute the focused attraction id
    if (!attraction) {
      let newAttraction = await postNewAttraction();
      attraction = newAttraction;
    }

    setAttractionFocus(attraction);
  };

  const filterResult = (result: OsmEntity[]) => {
    return result.filter((osm) => osm.osm_id !== undefined);
  };

  const markers = useMemo(() => {
  return result.map((r) => ({
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    label: r.name,
    osmId: r.osm_id,
    osmType: r.osm_type,
    zoom: r.place_rank,
  }));
}, [result]);

  // add/edit attraction

  const postNewAttraction = async (
    description?: string
  ): Promise<Attraction> => {
    let osmFocused = result.find((r) => r.osm_id === osmIdFocus);
    let newAttraction = {
      osmId: osmIdFocus!,
      osmType: osmFocused!.osm_type,
      lng: Number(osmFocused!.lon),
      lat: Number(osmFocused!.lat),
      name: osmFocused!.name,
      address: osmFocused!.display_name,
      description: description,
      linkId: undefined,
    };

    let attraction = await attractionsService.postNewHighlight(
      newAttraction,
      token!
    );
    clearEditAttraction();
    setIsUpdated((prev) => !prev);

    return attraction;
  };

  const clearEditAttraction = () => {
    setOpenEditAttraction(false);
    setDescription("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false}>
      <Grid
        container
        minWidth="60vw"
        height="80vh"
        sx={{
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
        }}
      >
        {/* left panel */}
        <Grid
          container
          direction="column"
          display="flex"
          flexDirection="column"
          size={4}
          spacing={2}
          height="100%"
          sx={{ overflowY: "auto" }}
        >
          <Grid size={12}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              my={2}
            >
              <Button
                variant="outlined"
                color="info"
                size="small"
                sx={{ position: "absolute", left: 10 }}
                onClick={handleClose}
                disableRipple
              >
                Close
              </Button>
              <Typography fontWeight="bold">Choose Attraction</Typography>
            </Box>
            <Divider />
          </Grid>

          {/* search */}
          <Grid size={12} position="relative" px={2}>
            <TextField
              size="small"
              placeholder="Search"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                ".MuiInputBase-root": {
                  borderRadius: 10,
                },
                ".MuiInputBase-input": {
                  width: "85%",
                },
              }}
            />
            <IconButton
              onClick={handleSearch}
              sx={{ position: "absolute", right: 15 }}
            >
              <SearchIcon />
            </IconButton>
          </Grid>
          {/* result list */}
          <Box
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              minHeight: 0,
              flex: 1,
              p: 1,
              pt: 0,
            }}
          >
            <Divider />
            <Grid container display="flex" flexDirection="column" size={12}>
              {result.length === 0 && (
                <Grid size={12} mt={1} display="flex" justifyContent="center">
                  <Typography>No match found.</Typography>
                </Grid>
              )}
              {result.map((osm, i) => (
                <Grid
                  size={12}
                  p={1}
                  key={`attraction-finder-result-${i}`}
                  color={osmIdFocus === osm.osm_id ? "primary.main" : "black"}
                  sx={{
                    cursor: "pointer",
                    ":hover": { bgcolor: "primary.100" },
                  }}
                  onClick={() => handleFocusOsm(osm.osm_id, osm.osm_type)}
                >
                  <Box display="flex" flexDirection="row" mt={1}>
                    <Typography fontWeight="bold">
                      {osm.name.length > 0 ? osm.name : osm.class}
                    </Typography>
                    {osm.osm_type && (
                      <Chip
                        label={OsmTypes[osm.osm_type]}
                        size="small"
                        sx={{
                          ml: 1,
                        }}
                      />
                    )}
                  </Box>
                  <Typography>{osm.display_name}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* right panel */}
        <Grid size={8}>
          <Box height="100%" position="relative">
            <Map
              height="100%"
              markers={markers}
              focusId={osmIdFocus}
              focusType={osmTypeFocus}
              correctionBias={4}
              correctionZoom={-1}
              updateOnMarkerFocus
            />
            {osmIdFocus && (
              <Grid
                size={12}
                position="absolute"
                bottom={0}
                zIndex={1000}
                bgcolor="white"
                sx={{
                  height: "60%",
                  overflowY: "auto",
                  border: "1px solid transparent",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  borderColor: "divider",
                  boxShadow: "inherit",
                }}
              >
                <Grid container size={12} p={1} px={3} mb={-2} alignItems="center">
                  <Typography fontWeight="bold">Choose a Highlight</Typography>
                  <IconButton sx={{ml: "auto"}} onClick={() => {setOsmIdFocus(undefined), setOsmTypeFocus(undefined)}}>
                    <CloseIcon/>
                  </IconButton>
                </Grid>

                {/* edit attraction description & link, no link for now */}
                {openEditAttraction ? (
                  <>
                    {/* edit form */}
                    <Grid size={12} p={0.5} mt={1}>
                      <Divider />
                    </Grid>
                    <Grid
                      container
                      direction="column"
                      size={12}
                      p={1}
                      px={3}
                      pb={2}
                    >
                      <Grid
                        container
                        size={12}
                        display="flex"
                        alignItems="center"
                      >
                        <Typography>New highlight</Typography>
                        <Box ml="auto">
                          <IconButton
                            disableRipple
                            color="error"
                            onClick={() => setOpenEditAttraction(false)}
                          >
                            <CloseIcon />
                          </IconButton>
                          <IconButton
                            disableRipple
                            color="success"
                            onClick={() => postNewAttraction(description)}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    {/* show attraction result */}
                    <Grid size={12} p={0.5}>
                      <Divider>
                        <Chip
                          icon={<AddIcon />}
                          label={<Typography>Add</Typography>}
                          onClick={() => setOpenEditAttraction(true)}
                          sx={{
                            cursor: "pointer",
                            ":hover": {
                              color: "white",
                              bgcolor: "primary.main",
                              ".MuiChip-icon": {
                                color: "white",
                              },
                            },
                          }}
                        />
                      </Divider>
                    </Grid>

                    {/* result content */}
                    <Grid
                      container
                      direction="column"
                      size={12}
                      spacing={1}
                      px={1}
                    >
                      {attractionResult.length > 0 ? (
                        attractionResult.map((a, i) => (
                          <Grid
                            key={`attraction-finder-attraction-result-${i}`}
                            size={12}
                            maxHeight={60}
                            p={0.5}
                            onClick={() => handleFocusAttraction(a)}
                            color={
                              attractionFocus?.id === a.id ? "primary.main" : ""
                            }
                            sx={{ ":hover": { bgcolor: "primary.100" } }}
                          >
                            {a.createdBy ? (
                              <>
                                <Chip
                                  avatar={<Avatar src="M" />}
                                  size="small"
                                  label={a.createdBy}
                                />
                                <Typography>{a.description}</Typography>
                                <Typography>{a.linkId}</Typography>
                              </>
                            ) : (
                              <>
                                <Chip size="small" label="default" />
                                <Typography>
                                  {defualt_attraction_description}
                                </Typography>
                              </>
                            )}
                          </Grid>
                        ))
                      ) : (
                        <Grid
                          size={12}
                          p={0.5}
                          onClick={() =>
                            handleFocusAttraction(undefined)
                          }
                          sx={{ ":hover": { bgcolor: "primary.100" } }}
                        >
                          <Grid container spacing={1}>
                            <Chip size="small" label="default" />
                          </Grid>
                          <Grid container spacing={1}>
                            <Typography>
                              {defualt_attraction_description}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AttractionFinder;
