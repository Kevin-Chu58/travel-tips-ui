import TTButton from "@components/TTButton";
import {
  Box,
  CircularProgress,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import AddIcon from "@mui/icons-material/Add";
import { tripsService } from "@services/trips";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import "./index.scss";

type TripFormProps = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  setIsParentUpdated: () => void;
};

const TripForm = ({ isOpen, setIsOpen, setIsParentUpdated }: TripFormProps) => {
  // new trip attributes
  const [name, setName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const actionIcon = isCreating ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <AddIcon />
  );
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // new trip menu

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
    if (token) {
      setIsCreating(true);

      await tripsService.postNewTrip(name, token);

      await BehaviorUtils.sleep();
      setIsCreating(false);
      handleCloseMenu();
      setIsParentUpdated();
    }
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
