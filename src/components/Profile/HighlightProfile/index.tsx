import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { RootState } from "@redux/store";
import { attractionsService, type AttractionV2 } from "@services/attractions";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { highlightsService, type Highlight } from "@services/highlights";
import { useIsMobile } from "@hooks/useIsMobile";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { useSnackbar } from "notistack";
import AttractionFragment from "./AttractionFragment";
import HighlightsFragment from "./HighlightsFragment";
import "./index.scss";

const HighlightProfile = () => {
  // window
  const isMobile = useIsMobile();
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // attraction
  const [attraction, setAttraction] = useState<AttractionV2 | undefined>();
  const [isAttractionLoading, setIsAttractionLoading] =
    useState<boolean>(false);
  // highlight
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [syncHighlights, setSyncHighlights] = useState<boolean>(false);
  const [isHighlightLoading, setIsHighlightLoading] = useState<boolean>(true);
  // delete
  const [deleteHighlightId, setDeleteHighlightId] = useState<
    number | undefined
  >();
  const openDelete = Boolean(deleteHighlightId);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // others
  const userId = useSelector((state: RootState) => state.user.id);
  const { attractionId } = useParams();
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  const deleteIcon = isDeleting ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <DeleteIcon />
  );

  useEffect(() => {
    const getAttraction = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      if (attractionId && !attraction) {
        try {
          setIsAttractionLoading(true);
          // TODO - update this to HereMap & UpStash API services, with better information returned
          const attraction = await attractionsService.getAttractionById(
            parseInt(attractionId)
          );
          setAttraction(attraction);
          setIsAttractionLoading(false);
        } catch (_) {
          navigate("/");
        }
      }
    };
    getAttraction();
  }, [attractionId]);

  useEffect(() => {
    const getHighlights = async () => {
      console.log(attractionId, userId);
      if (attractionId && userId) {
        setIsHighlightLoading(true);
        let highlights = await highlightsService.getHighlightsByAttractionId(
          parseInt(attractionId),
          userId ?? undefined
        );
        setHighlights(highlights);
        setIsHighlightLoading(false);
      }
    };
    getHighlights();
  }, [userId, syncHighlights]);

  const handleDeleteClose = () => {
    setDeleteHighlightId(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (deleteHighlightId) {
      setIsDeleting(true);

      const deletedHighlight = await highlightsService.deleteHighlight(
        deleteHighlightId
      );

      await BehaviorUtils.sleep();
      setHighlights(highlights.filter((h) => h.id !== deletedHighlight.id));

      setIsDeleting(false);
      enqueueSnackbar("Successfully deleted highlight.", {
        variant: "success",
      });
    }
    setDeleteHighlightId(undefined);
  };

  return (
    <Box className="highlight-profile-box" maxWidth="lg">
      <Box className="highlight-profile-content-box">
        {/* attraction */}
        <AttractionFragment
          attraction={attraction}
          isAttractionLoading={isAttractionLoading}
          isMobile={isMobile}
        />

        {/* highlights */}
        <HighlightsFragment
          attraction={attraction}
          highlights={highlights}
          isHighlightLoading={isHighlightLoading}
          setDeleteHighlightId={setDeleteHighlightId}
          setSyncHighlights={() => setSyncHighlights((prev) => !prev)}
        />
      </Box>

      {/* dialog - confirm delete - TODO: make a delete form in components/form*/}
      <TTDialog open={openDelete} onClose={handleDeleteClose}>
        <Box className="highlight-profile-dialog-box">
          <Box className="highlight-profile-dialog-header-box">
            <WarningIcon color="error" />
            <Typography
              className="highlight-profile-dialog-header"
              color="error"
            >
              Permanent Action
            </Typography>
          </Box>
          <Typography>
            Are you sure you want to delete this highlight?
          </Typography>
          <Box className="highlight-profile-dialog-button-box">
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
    </Box>
  );
};

export default HighlightProfile;
