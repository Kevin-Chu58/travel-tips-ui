import Map from "@components/Map";
import { getHex } from "@constants/Colors";
import { OsmTypes } from "@constants/Maps";
import { mild_box_shadow } from "@constants/Shadows";
import { Avatar, Box, Chip, Grid, Typography } from "@mui/material";
import type {
  Attraction,
  AttractionHighlights,
  Highlight,
} from "@services/attractions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Masonry } from "@mui/lab";
import { useMemo } from "react";
import EditIcon from "@mui/icons-material/Edit";
import TTIconButton from "@components/TTIconButton";

type TTHighlightCardProps = {
  attractionHighlights: AttractionHighlights;
  setHighlight: (state: Attraction) => void;
  selected: number[];
  addSelected: (state: number) => void;
  removeSelected: (state: number) => void;
};

const TTHighlightCard = ({
  attractionHighlights,
  setHighlight,
  selected,
  addSelected,
  removeSelected,
}: TTHighlightCardProps) => {
  const markers = useMemo(
    () => [
      {
        lat: attractionHighlights.lat,
        lng: attractionHighlights.lng,
        osmId: attractionHighlights.osmId,
        osmType: attractionHighlights.osmType,
      },
    ],
    [
      attractionHighlights.lat,
      attractionHighlights.lng,
      attractionHighlights.osmId,
      attractionHighlights.osmType,
    ]
  );

  const getHighlightInfo = (highlight: Highlight) => {
    return {
      ...attractionHighlights,
      id: highlight.id,
      description: highlight.description,
      linkId: highlight.linkId,
    } as Attraction;
  };

  return (
    <Grid
      container
      direction="column"
      size={12}
      key={`my-trip-${attractionHighlights.id}`}
      sx={{
        color: "black",
        bgcolor: getHex("gainsboro"),
        borderRadius: 2,
        // position: "relative",
      }}
    >
      {/* attraction content */}
      <Grid
        container
        size={12}
        boxShadow={mild_box_shadow}
        sx={{
          minHeight: 120,
          borderRadius: 2,
          bgcolor: "white",
          overflow: "hidden",
          position: "sticky",
          top: -12,
          scale: 1.01,
          zIndex: 10,
        }}
      >
        {/* attraction info */}
        <Grid container direction="column" size={7} p={1} position="relative">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography
              variant="h6"
              fontWeight="bold"
              textTransform="capitalize"
              display="flex"
              alignItems="center"
            >
              {attractionHighlights.name}
            </Typography>
            {attractionHighlights.osmType && (
              <Chip
                label={OsmTypes[attractionHighlights.osmType]}
                size="small"
                sx={{
                  ml: 1,
                }}
              />
            )}
          </Box>
          <Typography>{attractionHighlights.address}</Typography>
        </Grid>

        {/* attraction location on map (read-only) */}
        <Grid
          size={5}
          position="relative"
          sx={{ borderLeft: "1px solid", borderColor: "divider" }}
        >
          <Map
            height="100%"
            readonly
            updateOnMarkerFocus
            markers={markers}
            correctionZoom={-3}
          />
        </Grid>
      </Grid>

      {/* highlight list */}
      <Grid size={12} p={2} mt={2}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={2}>
          {attractionHighlights.highlights.map((highlight) => (
            <Box
              display="flex"
              key={`highlight-${highlight.id}`}
              onClick={() =>
                selected.includes(highlight.id)
                  ? removeSelected(highlight.id)
                  : addSelected(highlight.id)
              }
              sx={{
                position: "relative",
                cursor: "pointer",
                bgcolor: "white",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: mild_box_shadow,
              }}
            >
              <Grid size={12}>
                <Grid
                  container
                  size={12}
                  p={2}
                  alignItems="center"
                  sx={{
                    background: getHex("steelblue"),
                    postion: "relative",
                  }}
                >
                  <Avatar
                    // src="src/404-not-found"
                    alt={highlight.createdBy?.toString()}
                  />

                  <Box ml="auto" onClick={(e) => e.stopPropagation()}>
                    <TTIconButton
                      onClick={() => setHighlight(getHighlightInfo(highlight))}
                      sx={{
                        color: "secondary.main",
                        bgcolor: "secondary.900",
                        ":hover": {
                          bgcolor: "secondary.dark",
                        },
                      }}
                    >
                      <EditIcon />
                    </TTIconButton>
                  </Box>
                </Grid>

                <Typography
                  width="90%"
                  maxWidth={600}
                  whiteSpace="pre-wrap"
                  bgcolor="white"
                  fontFamily="tagesschrift"
                  p={2}
                  onClick={(e) => e.stopPropagation()}
                >
                  {highlight.description}
                </Typography>
              </Grid>

              {/* selected status */}
              {selected.includes(highlight.id) && (
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  width={40}
                  height={40}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  zIndex={0}
                  sx={{
                    bgcolor: "rgba(0, 0, 0, .8)",
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <CheckCircleIcon
                    fontSize="large"
                    sx={{ color: "success.light" }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Masonry>
      </Grid>
    </Grid>
  );
};

export default TTHighlightCard;
