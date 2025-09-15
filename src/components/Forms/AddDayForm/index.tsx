import TTButton from "@components/TTButton";
import {
  Dialog,
  FormControl,
  OutlinedInput,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { Sunrise } from "react-feather";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { enqueueSnackbar } from "notistack";
import { daysService } from "@services/days";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import type { Trip } from "@services/trips";
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
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handlePost = async () => {
    if (tripId && token) {
      try {
        var trimmedTitle = title.trim();

        if (trimmedTitle.length > 50) {
          enqueueSnackbar("Trip title is too long.", { variant: "error" });
          handleClose();
          return;
        }

        setIsLoading(true);

        await daysService.postNewDay(token, tripId, trimmedTitle);

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

  const handleDayTitleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box className="add-day-form-box">
        <Typography className="add-day-form-header">
          <Sunrise className="add-day-form-header-icon" /> New Day Dawning
        </Typography>
        <Typography className="add-day-form-description">
          You are about to create a new day, want to make it special?
        </Typography>

        <FormControl variant="outlined">
          <OutlinedInput
            size="small"
            value={title}
            placeholder="sub title - optional"
            onChange={(e) => handleDayTitleTextFieldChange(e)}
            endAdornment={`${title.length}/50`}
            autoFocus
          />
        </FormControl>

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
    </Dialog>
  );
};

export default AddDayForm;
