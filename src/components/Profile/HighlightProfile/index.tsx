import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import { attractionsService, type AttractionV2 } from "@services/attractions";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Map from "@components/Map";
import { mild_box_shadow } from "@constants/Shadows";
import {
  getDefaultHighlight,
  highlightsService,
  type Highlight,
} from "@services/highlights";
import HighlightItem from "@components/Item/HighlightItem";
import TTChipButton from "@components/TTChipButton";
import GoogleIcon from "@mui/icons-material/Google";
import MapUtils from "@utils/MapUtils";
import { useIsMobile } from "@hooks/useIsMobile";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import HighlightForm from "@components/Forms/HighlightForm";
import TTIconButton from "@components/TTIconButton";

const HighlightProfile = () => {
  // window
  const isMobile = useIsMobile();
  // attraction
  const [attraction, setAttraction] = useState<AttractionV2>();
  // highlight
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [syncHighlights, setSyncHighlights] = useState<boolean>(false);
  // post
  const [openPost, setOpenPost] = useState<boolean>(false);
  // delete
  const [deleteHighlightId, setDeleteHighlightId] = useState<
    number | undefined
  >();
  const openDelete = Boolean(deleteHighlightId);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.user.id);
  const { attractionId } = useParams();
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  const deleteIcon = isDeleting ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <DeleteIcon />
  );

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
      if (attractionId && userId) {
        let highlights = await highlightsService.getHighlightsByAttractionId(
          parseInt(attractionId),
          userId
        );
        setHighlights(highlights);
      }
    };
    getHighlights();
  }, [userId, syncHighlights]);

  const handleDeleteClose = () => {
    setDeleteHighlightId(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (token && deleteHighlightId) {
      setIsDeleting(true);

      const deletedHighlight = await highlightsService.deleteHighlight(
        deleteHighlightId,
        token
      );

      await BehaviorUtils.sleep(600);
      setHighlights(highlights.filter((h) => h.id !== deletedHighlight.id));

      setIsDeleting(false);
    }
    setDeleteHighlightId(undefined);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        color: "black",
        overflowY: "auto",
        display: "flex",
        position: "relative",
        justifyContent: "center",
      }}
    >
      <Box p={2} pt={4}>
        {/* nav back button */}
        <TTButton
          label="back"
          color="info"
          variant="text"
          startIcon={<NavigateBeforeIcon />}
          onClick={() => navigate("/workshop/highlight")}
          sx={{ fontSize: "1rem" }}
        />

        <Box display="flex" flexDirection="column" gap={2}>
          {/* attraction */}
          {attraction ? (
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
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
                <Box>
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
                width={isMobile ? "100%" : 240}
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
          ) : (
            <Skeleton width="100%" height={240} variant="rectangular" />
          )}

          {/* highlights */}
          {highlights ? (
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
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography fontSize="1.2rem">Highlights</Typography>
                {/* add icon */}
                <Tooltip
                  title="Write a new highlight"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <TTIconButton
                    // size="small"
                    onClick={() => setOpenPost(true)}
                    sx={{ ml: "auto" }}
                  >
                    <AddIcon />
                  </TTIconButton>
                </Tooltip>
              </Box>
              <Divider flexItem />

              {/* new highlight form - highlight item in edit */}
              {openPost && attraction && (
                <React.Fragment>
                  <HighlightForm
                    highlight={{ ...getDefaultHighlight(attraction.id) }}
                    onAction={() => setSyncHighlights((prev) => !prev)}
                    onClose={() => setOpenPost(false)}
                    isPost
                  />
                  {highlights.length > 0 && <Divider flexItem />}
                </React.Fragment>
              )}

              {highlights.map((highlight, i) => (
                <HighlightItem
                  key={highlight.id}
                  highlight={highlight}
                  isLast={i + 1 === highlights.length}
                  onDelete={setDeleteHighlightId}
                />
              ))}
            </Box>
          ) : (
            <Skeleton width="100%" height={240} variant="rectangular" />
          )}
        </Box>
      </Box>

      {/* dialog - confirm delete */}
      <TTDialog open={openDelete} onClose={handleDeleteClose}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <WarningIcon color="error" />
            <Typography fontSize="1.2rem" color="error">
              Permanent Action
            </Typography>
          </Box>
          <Typography fontSize="1rem">
            Are you sure you want to delete this highlight?
          </Typography>
          <Box display="flex" gap={1} justifyContent="right" mt={1}>
            <TTButton
              label="cancel"
              variant="text"
              color="error"
              onClick={handleDeleteClose}
            />
            <TTButton
              label="confirm"
              color="error"
              startIcon={deleteIcon}
              onClick={handleDeleteConfirm}
            />
          </Box>
        </Box>
      </TTDialog>
    </Container>
  );
};

export default HighlightProfile;
