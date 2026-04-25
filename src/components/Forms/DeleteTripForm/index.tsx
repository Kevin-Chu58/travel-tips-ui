import { Box, CircularProgress, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { enqueueSnackbar } from "notistack";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { tripsService, type Trip } from "@services/trips";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { setUser } from "@redux/userSlice";
import { useState } from "react";
import "./index.scss";

type DeleteTripFormProps = {
  open: boolean;
  onClose: () => void;
  trip: Trip | undefined;
  asyncDeleteTrip: () => void;
};

const DeleteTripForm = ({
  open,
  onClose,
  trip,
  asyncDeleteTrip,
}: DeleteTripFormProps) => {
  // user
  const userSubExtend = useSelector(
    (state: RootState) => state.user.userSubExtend,
  );
  // redux
  const dispatch = useDispatch();
  // behavior
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
      if (trip) {
        setIsDeleting(true);

        await tripsService.deleteTrip(trip.id);

        BehaviorUtils.sleep();

        setIsDeleting(false);
        asyncDeleteTrip();

        if (userSubExtend)
          dispatch(
            setUser({
              userSubExtend: {
                ...userSubExtend,
                tripCount: userSubExtend.tripCount - 1,
              },
            }),
          );

        enqueueSnackbar("Successfully deleted trip.", { variant: "success" });
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
      <Box className="delete-trip-form-header-box">
        <WarningIcon color="error" />
        <Typography className="delete-trip-form-header" color="error">
          Permanent Action
        </Typography>
      </Box>
      <Typography>
        Are you sure you want to delete <strong>Trip - {trip?.title}</strong>?
      </Typography>
      <Box className="delete-trip-form-button-box">
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

export default DeleteTripForm;
