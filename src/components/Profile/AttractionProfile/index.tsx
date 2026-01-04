import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { RootState } from "@redux/store";
import { attractionsService } from "@services/attractions";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { highlightsService, type Highlight } from "@services/highlights";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { useSnackbar } from "notistack";
import AttractionFragment from "./AttractionFragment";
import HighlightsFragment from "./HighlightsFragment";
import { type HerePlace } from "@services/hereMap/hereMap";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./index.scss";

type HighlightPropfileProps = {
  back?: boolean;
};

const AttractionProfile = ({ back = false }: HighlightPropfileProps) => {
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // herePlace
  const [herePlace, setHerePlace] = useState<HerePlace | undefined>();
  // highlight
  const highlightsRef = useRef<Highlight[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
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
  const _attractionId = attractionId ? parseInt(attractionId) : undefined;
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  const deleteIcon = isDeleting ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <DeleteIcon />
  );

  // sync methods

  const asyncHighligts = () => {
    setHighlights([...highlightsRef.current]);
  };

  const asyncAddHighlight = (highlight?: Highlight) => {
    if (highlight) {
      highlightsRef.current.push(highlight);
      asyncHighligts();
    }
  };

  const asyncUpdateHighlight = (highlight?: Highlight) => {
    if (highlight) {
      let highlightId = highlightsRef.current.findIndex(
        (h) => h.id === highlight.id
      );

      if (highlightId >= 0) {
        highlightsRef.current[highlightId] = highlight;
        asyncHighligts();
      }
    }
  };

  const asyncDeleteHighlight = (highlight: Highlight) => {
    if (highlightsRef.current) {
      highlightsRef.current = highlightsRef.current.filter(
        (h) => h.id !== highlight.id
      );
      asyncHighligts();
    }
  };

  // render attraction on attractionId
  useEffect(() => {
    const getAttraction = async () => {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      if (_attractionId && !herePlace) {
        try {
          const hereMapPlace =
            await attractionsService.getHerePlaceByAttractionId(_attractionId);
          setHerePlace(hereMapPlace);
        } catch (_) {
          navigate("/");
        }
      }
    };
    getAttraction();
  }, [_attractionId]);

  // render highlights on userId
  useEffect(() => {
    const getHighlights = async () => {
      if (_attractionId && userId) {
        setIsHighlightLoading(true);
        let highlights = await highlightsService.getHighlightsByAttractionId(
          _attractionId,
          userId ?? undefined
        );
        highlightsRef.current = highlights;
        setHighlights(highlights);
        setIsHighlightLoading(false);
      }
    };
    getHighlights();
  }, [userId]);

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
      asyncDeleteHighlight(deletedHighlight);

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
        {/* nav back button */}
        {back ? (
          <Box>
            <TTButton
              label="back"
              variant="text"
              startIcon={<NavigateBeforeIcon />}
              onClick={() => navigate(-1)}
            />
          </Box>
        ) : undefined}

        {/* attraction */}
        <AttractionFragment herePlace={herePlace} />

        {/* highlights */}
        <HighlightsFragment
          attractionId={_attractionId}
          highlights={highlights}
          isHighlightLoading={isHighlightLoading}
          setDeleteHighlightId={setDeleteHighlightId}
          asyncAddHighlight={asyncAddHighlight}
          asyncUpdateHighlight={asyncUpdateHighlight}
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

export default AttractionProfile;
