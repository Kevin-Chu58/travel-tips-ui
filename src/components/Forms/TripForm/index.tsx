import TTButton from "@components/TTButton";
import {
  Box,
  CircularProgress,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { tripsService, type Trip } from "@services/trips";
import { useState } from "react";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { useSnackbar } from "notistack";
import "./index.scss";

type TripFormProps = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  asyncAddTrip: (state: Trip) => void;
};

const TripForm = ({ isOpen, setIsOpen, asyncAddTrip }: TripFormProps) => {
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // new trip attributes
  const [name, setName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const actionIcon = isCreating ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AddIcon />
  );

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const clearName = () => {
    setName("");
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
    clearName();
  };

  const handleCreate = async () => {
    try {
      setIsCreating(true);

      let newTrip = await tripsService.postNewTrip(name);

      await BehaviorUtils.sleep();
      handleCloseMenu();
      asyncAddTrip(newTrip);

      enqueueSnackbar("Successfully created new trip.", {
        variant: "success",
      });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }

    setIsCreating(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCloseMenu}
      disablePortal={false}
      maxWidth="xs"
    >
      <Box className="trip-form-box">
        <Typography className="trip-form-title">New Trip</Typography>
        <Typography className="trip-form-notice">
          After creating a trip, you may proceed to edit its description and
          attach images as needed.
        </Typography>

        {/* title */}
        <TextField
          value={name}
          placeholder="Title"
          onChange={handleChangeName}
          slotProps={{
            input: {
              endAdornment: `${name?.length ?? 0}/50`,
            },
          }}
        />

        <Box className="trip-form-icon-box">
          <TTButton onClick={handleCloseMenu} variant="text" color="primary">
            cancel
          </TTButton>
          <TTButton
            onClick={handleCreate}
            variant="contained"
            color="primary"
            startIcon={actionIcon}
            disabled={!Boolean(name.trim())}
          >
            create
          </TTButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TripForm;
