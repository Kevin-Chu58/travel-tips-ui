import { Box, CircularProgress } from "@mui/material";
import type { RootState } from "@redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddIcon from "@mui/icons-material/Add";
import DescriptionTextField from "@components/TextField/DescriptionTextField";
import { highlightsService, type Highlight } from "@services/highlights";
import TTButton from "@components/TTButton";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { useSnackbar } from "notistack";
import "./index.scss";

type HighlightFormProps = {
  highlight: Highlight;
  setHighlight?: (state: Highlight) => void;
  isPost?: boolean;
  onAction?: () => void;
  onClose: () => void;
};

const HighlightForm = ({
  highlight,
  setHighlight = () => {},
  isPost,
  onAction,
  onClose,
}: HighlightFormProps) => {
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // attributes
  const [_description, _setDescription] = useState<string>(
    highlight.description ?? ""
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const actionIconDefault = isPost ? <AddIcon /> : <FileUploadIcon />;
  const actionIcon = isUpdating ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    actionIconDefault
  );

  const handlePost = async () => {
    const trimedDescription = _description.trim();

    if (token && trimedDescription.length > 0) {
      try {
        setIsUpdating(true);
        let newHighlight = await highlightsService.postHighlight(
          { ...highlight, description: trimedDescription },
          token
        );
        await BehaviorUtils.sleep();

        onAction ? onAction() : setHighlight(newHighlight);

        enqueueSnackbar("Successfully posted highlight.", {
          variant: "success",
        });
        setIsUpdating(false);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
      setIsUpdating(false);
    }

    onClose();
  };

  const handleUpdate = async () => {
    const trimedDescription = _description.trim();
    const isChanged = highlight.description !== trimedDescription;

    if (isChanged && token && highlight.description) {
      try {
        setIsUpdating(true);
        let updatedHighlight = await highlightsService.patchHighlight(
          highlight.id,
          trimedDescription,
          token
        );
        await BehaviorUtils.sleep();
        onAction ? onAction() : setHighlight(updatedHighlight);

        enqueueSnackbar("Successfully updated highlight.", {
          variant: "success",
        });
        setIsUpdating(false);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }

    onClose();
  };

  return (
    <Box className="highlight-form-box">
      <DescriptionTextField value={_description} setValue={_setDescription} />
      <Box className="highlight-form-button-box">
        <TTButton
          label="cancel"
          variant="text"
          color="primary"
          onClick={onClose}
        />
        {isPost ? (
          <TTButton
            label="create"
            color="primary"
            startIcon={actionIcon}
            onClick={handlePost}
          />
        ) : (
          <TTButton
            label="update"
            color="primary"
            startIcon={actionIcon}
            onClick={handleUpdate}
          />
        )}
      </Box>
    </Box>
  );
};

export default HighlightForm;
