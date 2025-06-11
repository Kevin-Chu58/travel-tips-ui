import Map from "@components/Map";
import { getHex } from "@constants/Colors";
import { OsmTypes } from "@constants/Maps";
import { mild_box_shadow } from "@constants/Shadows";
import { Avatar, Box, Chip, Grid, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import type { AttractionHighlights } from "@services/attractions";

type TTHighlightCardProps = {
  attractionHighlights: AttractionHighlights;
  isFocused: boolean;
  setIsFocused?: (state: number) => void;
  setParentUpdate?: () => void;
};

const TTHighlightCard = ({
  attractionHighlights,
  isFocused,
  setIsFocused,
  setParentUpdate,
}: TTHighlightCardProps) => {
  return (
    <Grid
      container
      direction="column"
      size={12}
      key={`my-trip-${attractionHighlights.id}`}
      // onClick={() => (setIsFocused ? setIsFocused(trip.id) : {})}
      sx={{
        color: "black",
        bgcolor: getHex("gainsboro"),
        borderRadius: 2,
        position: "relative",
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
          position: "relative",
        }}
      >
        {/* attraction info */}
        <Grid
          container
          direction="column"
          size={8}
          p={1}
          position="relative"
        >
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
          <Typography>
            {attractionHighlights.address}
          </Typography>
        </Grid>

        {/* attraction location on map (read-only) */}
        <Grid size={4} position="relative" sx={{borderLeft: "1px solid", borderColor: "divider"}}>
          <Map
            height="100%"
            readonly
            updateOnMarkerFocus
            focusId={attractionHighlights.osmId}
            focusType={attractionHighlights.osmType}
            markers={[{
              lat: attractionHighlights.lat,
              lng: attractionHighlights.lng,
              osmId: attractionHighlights.osmId,
              osmType: attractionHighlights.osmType,
            }]}
            correctionZoom={-3}
          />
        </Grid>
      </Grid>

      {/* highlight list */}
      <Grid container direction="column" size={12}>
        {attractionHighlights.highlights.map((highlight) =>

          <Grid container key={`highlight-${highlight.id}`} size={12}
            sx={{
              p: 2,
              cursor: "pointer",
              ":hover": {
                ".description": {
                  bgcolor: green[600],
                  color: "white",
                  ":before": {
                    borderRight: `10px solid ${green[600]}`,
                  }
                }
              }
            }}
          >

            <Box width={60}>
              <Avatar src="src/404-not-found" alt={highlight.createdBy?.toString()}/>
            </Box>

              <Box flex={1} display="flex" position="relative">
                <Typography width="90%" className="description" whiteSpace="pre-wrap" bgcolor="white" p={1} 
                sx={{
                  borderRadius: 2,
                  ":before": {
                    content: '""',
                    position: "absolute",
                    width: 0,
                    height: 0,
                    top: 10,
                    left: -9,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderRight: "10px solid white",
                  }
                }}
              >
                {highlight.description}
              </Typography>
              </Box>

              <Box width={60} display="flex" justifyContent="right">
                <Avatar src="src/404-not-found" alt={highlight.createdBy?.toString()}/>
              </Box>
          </Grid>
        )}
      </Grid>

      {/* focused status */}
      {/* {isFocused && (
        <Box
          position="absolute"
          top={0}
          right={0}
          width={40}
          height={40}
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={10}
          sx={{
            background: "rgba(0, 0, 0, .8)",
            borderBottomLeftRadius: 6,
          }}
        >
          <CheckCircleIcon fontSize="large" sx={{ color: "success.light" }} />
        </Box>
      )} */}
    </Grid>
  );
};

export default TTHighlightCard;
