import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddIcon from "@mui/icons-material/Add";
import DescriptionTextField from "@components/TextField/DescriptionTextField";
import { highlightsService, type Highlight } from "@services/highlights";
import TTButton from "@components/TTButton";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { useSnackbar } from "notistack";
import "./index.scss";

type HighlightFormProps = {
  description?: string;
  setDescription?: (state: string) => void;
  highlight?: Highlight;
  setHighlight?: (state: Highlight) => void;
  isPost?: boolean;
  onAction?: (state?: Highlight) => void;
  onClose: () => void;
};

const HighlightForm = ({
  description,
  setDescription,
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
    highlight?.description ?? ""
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // update action
  const actualDescription = description ?? _description;
  const isDescriptionEmpty = actualDescription.trim().length === 0;
  const updateDescription = setDescription ?? _setDescription;

  const actionIconDefault = isPost ? <AddIcon /> : <FileUploadIcon />;
  const actionIcon = isUpdating ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    actionIconDefault
  );

  const handlePost = async () => {
    const trimmedDescription = _description.trim();

    try {
      setIsUpdating(true);

      if (highlight || onAction) {
        if (highlight && trimmedDescription.length > 0) {
          let newHighlight = await highlightsService.postHighlight({
            ...highlight,
            description: trimmedDescription,
          });
          await BehaviorUtils.sleep();
          setHighlight(newHighlight);

          enqueueSnackbar("Successfully posted highlight.", {
            variant: "success",
          });
          setIsUpdating(false);

          if (onAction) {
            onAction(newHighlight);
          }
        }
      }
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }

    setIsUpdating(false);
    onClose();
  };

  const handleUpdate = async () => {
    const trimmedDescription = actualDescription.trim();
    const isChanged = highlight?.description !== trimmedDescription;

    if (isDescriptionEmpty) {
      enqueueSnackbar("Highlight is Empty.", { variant: "error" });
      return;
    }

    if (isChanged && highlight) {
      try {
        setIsUpdating(true);

        let updatedHighlight = await highlightsService.patchHighlight(
          highlight.id,
          trimmedDescription
        );
        await BehaviorUtils.sleep();
        onAction ? onAction(updatedHighlight) : setHighlight(updatedHighlight);

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
      <DescriptionTextField
        value={actualDescription}
        setValue={updateDescription}
      />
      <Box className="highlight-form-button-box">
        <TTButton
          className="highlight-form-button"
          label="cancel"
          variant="text"
          color="primary"
          onClick={onClose}
        />
        {isPost ? (
          <TTButton
            className="highlight-form-button"
            label="create"
            color="primary"
            startIcon={actionIcon}
            disabled={isDescriptionEmpty}
            onClick={handlePost}
          />
        ) : (
          <TTButton
            className="highlight-form-button"
            label="update"
            color="primary"
            startIcon={actionIcon}
            disabled={isDescriptionEmpty}
            onClick={handleUpdate}
          />
        )}
      </Box>
    </Box>
  );
};

export default HighlightForm;
