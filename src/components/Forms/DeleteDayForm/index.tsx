import { Box, CircularProgress, Typography } from "@mui/material";
import { daysService, type Day } from "@services/days";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import "./index.scss";

type DeleteDayFormProps = {
  open: boolean;
  onClose: () => void;
  day: Day | undefined;
  dayId: number | undefined;
  asyncDeleteDay: () => void;
};

const DeleteDayForm = ({
  open,
  onClose,
  day,
  dayId,
  asyncDeleteDay,
}: DeleteDayFormProps) => {
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
      if (day) {
        setIsDeleting(true);

        await daysService.deleteDay(day?.id);

        setIsDeleting(false);

        asyncDeleteDay();
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
      <Box className="delete-day-form-header-box">
        <WarningIcon color="error" />
        <Typography className="delete-day-form-header" color="error">
          Permanent Action
        </Typography>
      </Box>
      <Typography>
        Are you sure you want to delete <strong>Day {dayId}</strong>?
      </Typography>
      <Box className="delete-day-form-button-box">
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

export default DeleteDayForm;
