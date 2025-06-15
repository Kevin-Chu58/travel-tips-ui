import Map from "@components/Map";
import type { OsmType } from "@constants/Maps";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import type { OsmEntity } from "@services/geoMap/osm";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import { attractionsService, type Attraction } from "@services/attractions";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";

type MapPanelProps = {
  result: OsmEntity[];
  attractionResult: Attraction[];
  attractionFocus: Attraction | undefined;
  setAttractionFocus: (state: Attraction | undefined) => void;
  osmIdFocus: number | undefined;
  osmTypeFocus: OsmType | undefined;
  openHighlight: boolean;
  setOpenHighlight: (state: boolean) => void;
  openEditAttraction: boolean;
  setOpenEditAttraction: (state: boolean) => void;
  description: string;
  setDescription: (state: string) => void;
  setIsParentUpdated: () => void;
  clearEditAttraction: () => void;
};

const MapPanel = ({
  result,
  attractionResult,
  attractionFocus,
  setAttractionFocus,
  osmIdFocus,
  osmTypeFocus,
  openHighlight,
  setOpenHighlight,
  openEditAttraction,
  setOpenEditAttraction,
  description,
  setDescription,
  setIsParentUpdated,
  clearEditAttraction,
}: MapPanelProps) => {
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const defualt_attraction_description = "No Highlight";

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
    setIsParentUpdated();

    return attraction;
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

  return (
    <Box height="100%" position="relative">
      <Map
        height="100%"
        markers={markers}
        focusId={osmIdFocus}
        focusType={osmTypeFocus}
        correctionBias={4.5}
        correctionZoom={-1}
        updateOnMarkerFocus
      />
      {osmIdFocus && openHighlight && (
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
            <IconButton
              sx={{ ml: "auto" }}
              onClick={() => {
                setOpenHighlight(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>

          {/* edit attraction description & link, no link for now */}
          {openEditAttraction ? (
            <>
              {/* edit form */}
              <Grid size={12} p={0.5} mt={1}>
                <Divider />
              </Grid>
              <Grid container direction="column" size={12} p={1} px={3} pb={2}>
                <Grid container size={12} display="flex" alignItems="center">
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
              <Grid container direction="column" size={12} spacing={1} px={1}>
                {attractionResult.length > 0 ? (
                  attractionResult.map((a, i) => (
                    <Grid
                      key={`attraction-finder-attraction-result-${i}`}
                      size={12}
                      p={0.5}
                      onClick={() => handleFocusAttraction(a)}
                      color={attractionFocus?.id === a.id ? "primary.main" : ""}
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
                    onClick={() => handleFocusAttraction(undefined)}
                    sx={{ ":hover": { bgcolor: "primary.100" } }}
                  >
                    <>
                      <Chip size="small" label="default" />
                      <Typography>{defualt_attraction_description}</Typography>
                    </>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default MapPanel;
