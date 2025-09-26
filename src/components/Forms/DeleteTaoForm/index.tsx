import { Box, CircularProgress, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import TTButton from "@components/TTButton";
import { useState } from "react";
import TTDialog from "@components/TTDialog";
import { enqueueSnackbar } from "notistack";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { taosService, type Tao } from "@services/taos";
import "./index.scss";

type DeleteTaoFormProps = {
  open: boolean;
  onClose: () => void;
  tao: Tao | undefined;
  setIsParentUpdated: () => void;
};

const DeleteTaoForm = ({
  open,
  onClose,
  tao,
  setIsParentUpdated,
}: DeleteTaoFormProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteIcon = isDeleting ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <DeleteIcon />
  );

  const handleDeleteClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      if (tao) {
        setIsDeleting(true);

        await taosService.deleteTao(tao.id);

        BehaviorUtils.sleep();
        setIsDeleting(false);

        enqueueSnackbar("Successfully deleted event.", { variant: "success" });
        setIsParentUpdated();
      }
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }

    setIsDeleting(false);
    onClose();
  };

  return (
    <TTDialog open={open} onClose={onClose}>
      <Box className="delete-tao-form-header-box">
        <WarningIcon color="error" />
        <Typography className="delete-tao-form-header" color="error">
          Permanent Action
        </Typography>
      </Box>
      <Typography>
        Are you sure you want to delete this event at{" "}
        <strong>{tao?.attraction.title}</strong>?
      </Typography>
      <Box className="delete-tao-form-button-box">
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
    </TTDialog>
  );
};

export default DeleteTaoForm;
