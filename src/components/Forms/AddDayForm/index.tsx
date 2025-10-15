import TTButton from "@components/TTButton";
import {
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { Sunrise } from "react-feather";
import { enqueueSnackbar } from "notistack";
import { daysService } from "@services/days";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import type { Trip } from "@services/trips";
import TTDialog from "@components/TTDialog";
import "./index.scss";

type AddDayFormProps = {
  tripId?: number;
  tripBasicRef: React.RefObject<Trip | undefined>;
  syncTrip: () => void;
  open: boolean;
  onClose: () => void;
};

const AddDayForm = ({
  tripId,
  tripBasicRef,
  syncTrip,
  open,
  onClose,
}: AddDayFormProps) => {
  // params
  const [title, setTitle] = useState<string>("");
  // behaviors
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const actionButtonIcon = isLoading ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AddIcon />
  );

  const handlePost = async () => {
    if (tripId) {
      try {
        var trimmedTitle = title.trim();

        if (trimmedTitle.length > 50) {
          enqueueSnackbar("Trip title is too long.", { variant: "error" });
          handleClose();
          return;
        }

        setIsLoading(true);

        await daysService.postNewDay(tripId, trimmedTitle);

        BehaviorUtils.sleep();

        tripBasicRef.current!.numDays! += 1;
        syncTrip();

        enqueueSnackbar("Successfully create a day.", { variant: "success" });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }

    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle("");
  };

  return (
    <TTDialog open={open} onClose={handleClose} hidePadding>
      <Box className="add-day-form-box">
        <Typography className="add-day-form-header">
          <Sunrise className="add-day-form-header-icon" /> New Day Dawning
        </Typography>
        <Typography className="add-day-form-description">
          You are about to create a new day.
        </Typography>

        <Box className="add-day-form-button-box">
          <TTButton
            label="cancel"
            color="primary"
            variant="text"
            onClick={handleClose}
            disabled={isLoading}
          />
          <TTButton
            startIcon={actionButtonIcon}
            label={isLoading ? "creating" : "create"}
            color="primary"
            onClick={handlePost}
            disabled={isLoading}
          />
        </Box>
      </Box>
    </TTDialog>
  );
};

export default AddDayForm;
