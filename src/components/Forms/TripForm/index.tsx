import TTTextField from "@components/TTTextField";
import { Box, Button, Dialog, Typography } from "@mui/material";
import type { RootState } from "@redux/store";
import { tripsService } from "@services/trips";
import { useState } from "react";
import { useSelector } from "react-redux";

type TripFormProps = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  setIsParentUpdated: () => void;
};

const TripForm = ({ isOpen, setIsOpen, setIsParentUpdated }: TripFormProps) => {
  // new trip attributes
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorParams, setErrorParams] = useState<string[]>([]);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // new trip menu

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const clearName = () => {
    setName("");
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const clearDescription = () => {
    setDescription("");
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
    clearName();
    clearDescription();
  };

  const handleConfirm = async () => {
    let invalidParams = [];
    if (name.length === 0) invalidParams.push("name");
    if (description.length > 1000) invalidParams.push("description");

    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      const newTrip = {
        name: name,
        description: description,
      };

      if (token) {
        await tripsService.postNewTrip(newTrip, token);
        handleCloseMenu();
        setIsParentUpdated();
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCloseMenu}
      disablePortal={false}
      maxWidth="md"
    >
      <Box m={4}>
        <Typography variant="h4" fontWeight={600} mb={4}>
          New Trip
        </Typography>
        {errorParams.length > 0 && (
          <Typography variant="body1" color="error">
            Invalid inputs: {errorParams?.toString()}
          </Typography>
        )}
        <Typography variant="body1">Name*</Typography>
        <TTTextField
          id="new-trip-name"
          input={name}
          placeholder="name"
          onChange={handleChangeName}
          clearInput={clearName}
        />
        <Typography variant="body1">Description</Typography>
        <TTTextField
          id="new-trip-description"
          input={description}
          placeholder="description"
          onChange={handleChangeDescription}
          clearInput={clearDescription}
        />
        <Box display="flex" flexDirection="row" mt={2}>
          <Button onClick={handleCloseMenu} variant="outlined" disableRipple>
            cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ ml: "auto" }}
            disableRipple
          >
            confirm
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TripForm;
