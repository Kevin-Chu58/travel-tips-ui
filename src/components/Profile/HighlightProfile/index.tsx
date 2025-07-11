import TTButton from "@components/TTButton";
import { Box, Container, Divider, Typography } from "@mui/material";
import type { RootState } from "@redux/store";
import { attractionsService, type AttractionV2 } from "@services/attractions";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Map from "@components/Map";
import { mild_box_shadow } from "@constants/Shadows";
import { highlightsService, type Highlight } from "@services/highlights";
import HighlightItem from "@components/Item/HighlightItem";
import TTChipButton from "@components/TTChipButton";
import GoogleIcon from "@mui/icons-material/Google";
import MapUtils from "@utils/MapUtils";

const HighlightProfile = () => {
  // attraction
  const [attraction, setAttraction] = useState<AttractionV2>();
  // highlight
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.user.id);
  const { attractionId } = useParams();
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  const markers = attraction
    ? [
        {
          lat: attraction.lat,
          lng: attraction.lng,
          osmId: attraction.osmId,
          osmType: attraction.osmType,
          label: attraction.name,
        },
      ]
    : [];

  useEffect(() => {
    const getAttraction = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      if (attractionId && !attraction) {
        try {
          const attraction = await attractionsService.getAttractionById(
            parseInt(attractionId)
          );
          setAttraction(attraction);
        } catch (_) {
          navigate("/");
        }
      }
    };
    getAttraction();
  }, [attractionId]);

  useEffect(() => {
    const getHighlights = async () => {
      if (attractionId && userId && highlights.length === 0) {
        let highlights = await highlightsService.getHighlightsByAttractionId(
          parseInt(attractionId),
          userId
        );
        setHighlights(highlights);
      }
    };
    getHighlights();
  }, [userId]);

  return (
    <Container
      maxWidth={false}
      sx={{
        // height: `calc(100vh - ${Headers}px)`,
        color: "black",
        overflowY: "auto",
        display: "flex",
        position: "relative",
        justifyContent: "center",
        bgcolor: "secondary.main",
      }}
    >
      <Box maxWidth="lg" p={2} pt={4}>
        {/* nav back button */}
        <TTButton
          label="back"
          color="info"
          variant="text"
          startIcon={<NavigateBeforeIcon />}
          onClick={() => navigate("/workshop/highlight")}
          sx={{ fontSize: "1rem" }}
        />

        {/* attraction */}
        {attraction ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box
              display="flex"
              flexDirection="row"
              gap={2}
              bgcolor="white"
              p={2}
              borderRadius={2}
              border="1px solid"
              borderColor="divider"
            >
              <Box>
                {/* title */}
                <Typography
                  textTransform="capitalize"
                  display="flex"
                  alignItems="center"
                  fontSize="2rem"
                >
                  {attraction.name}
                </Typography>

                {/* address */}
                <Typography fontSize=".9rem" color="dimgrey">
                  {attraction.address}
                </Typography>

                {/* links */}
                <Box mt={1}>
                  <a
                    href={MapUtils.getGoogleMapLink(attraction.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TTChipButton icon={<GoogleIcon />} label="Google Map" />
                  </a>
                </Box>
              </Box>

              {/* map */}
              <Box
                width={240}
                height={200}
                sx={{
                  ml: "auto",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: mild_box_shadow,
                }}
              >
                <Map
                  height="100%"
                  readonly
                  updateOnMarkerFocus
                  markers={markers}
                  correctionZoom={-3}
                />
              </Box>
            </Box>

            {/* highlights */}
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              bgcolor="white"
              p={2}
              borderRadius={2}
              border="1px solid"
              borderColor="divider"
            >
              <Typography fontSize="1.2rem">Highlights</Typography>
              <Divider flexItem />

              {highlights.map((highlight, i) => (
                <HighlightItem
                  key={highlight.id}
                  highlight={highlight}
                  isLast={i + 1 === highlights.length}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Container>
  );
};

export default HighlightProfile;
