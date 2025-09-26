import HighlightsFragment from "@components/Profile/HighlightProfile/HighlightsFragment";
import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { type Highlight, highlightsService } from "@services/highlights";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { taosService, type Tao } from "@services/taos";
import { useEffect, useState } from "react";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type DiscoverHighlightsFormProps = {
  tao: Tao | undefined;
  syncEditDayTaos: (state: Tao) => void;
  open: boolean;
  onClose: () => void;
};

const DiscoverHighlightsForm = ({
  tao,
  syncEditDayTaos,
  open,
  onClose,
}: DiscoverHighlightsFormProps) => {
  // windows
  const isMobile = useIsMobile();
  // attraction
  const attraction = tao?.attraction;
  // highlights
  const [highlights, setHighlights] = useState<Highlight[] | undefined>();
  const [selectedHighlightId, setSelectHighlightId] = useState<
    number | undefined
  >();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  // condition
  const isValid = selectedHighlightId !== tao?.highlight?.id;
  // action button
  const actionIcon = isProcessing ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AttachFileIcon />
  );

  // rerender highlight list on open
  useEffect(() => {
    const initHighlights = async () => {
      if (open && attraction) {
        let highlights = await highlightsService.getHighlightsByAttractionId(
          attraction.id
        );
        setHighlights(highlights);
      }
    };

    initHighlights();
  }, [open]);

  const handleClickAattach = async () => {
    if (isValid && tao) {
      try {
        setIsProcessing(true);

        let taoPatch = { highlightId: selectedHighlightId };

        let updatedTao = await taosService.patchTao(tao.id, taoPatch);

        await BehaviorUtils.sleep();
        syncEditDayTaos(updatedTao);

        enqueueSnackbar("Successfully attached highlight.", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
      setIsProcessing(false);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setSelectHighlightId(undefined);
  };

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box
        className={clsx("discover-highlights-form-box", isMobile && "mobile")}
      >
        <Box className="discover-highlights-form-content-box">
          {/* header */}
          <Box className="discover-highlights-form-header-box">
            <Typography className="discover-highlights-form-large-text">
              Discover Highlights
            </Typography>
            <Typography>{attraction?.title}</Typography>
          </Box>
          <Divider flexItem />

          {/* highlight list */}
          <Box className="discover-highlights-form-highlight-list-box">
            {highlights ? (
              <HighlightsFragment
                attraction={attraction}
                highlights={highlights}
                allowChangeHighlight={false}
                selectHighlightId={selectedHighlightId}
                setSelectHighlightId={setSelectHighlightId}
              />
            ) : undefined}
          </Box>
        </Box>

        {/* action button */}
        <Box className="discover-highlights-form-action-button-box">
          <TTButton
            className="discover-highlights-form-attach-button"
            color="info"
            startIcon={actionIcon}
            disabled={!isValid || isProcessing}
            onClick={handleClickAattach}
          >
            attach highlight
          </TTButton>
        </Box>
      </Box>
    </TTDialog>
  );
};

export default DiscoverHighlightsForm;
