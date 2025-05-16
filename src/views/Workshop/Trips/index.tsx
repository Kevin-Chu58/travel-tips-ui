import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import { tripsService, type Trip } from "@services/trips";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import TextField from "@components/TextField";

const Trips = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorParams, setErrorParams] = useState<string[]>([]);
  const navigate = useNavigate();

  // rerender on trips length
  useEffect(() => {}, [trips.length]);

  // rerender on access token and isUpdated
  useEffect(() => {
    const getMyTrips = async () => {
      if (token) {
        const myTrips = await tripsService.getMyTrips(token);
        setTrips(myTrips);
      }
    };
    getMyTrips();
  }, [token, isUpdated]);

  const render = () => {
    setIsUpdated((prev) => !prev);
  };

  const handleOpenMenu = () => {
    setisOpen(true);
  };

  const handleCloseMenu = () => {
    setisOpen(false);
    clearName();
    clearDescription();
  };

  // trip

  const hideTrip = async (id: number) => {
    if (token) {
      await tripsService.hideTrip(id, token);
      render();
    }
  }

  // new trip menu

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const clearName = () => {
    setName("");
    inputRef.current?.focus();
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const clearDescription = () => {
    setDescription("");
    inputRef.current?.focus();
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
        render();
      }
    }
  };

  return (
    <Container maxWidth="lg" disableGutters>
      <Box width="100%" color="black" mt={2}>
        <Typography variant="h4">My Trips</Typography>
        <Box display="flex" flexDirection="row">
          <Button
            disableRipple
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenMenu}
          >
            New
          </Button>
          <Typography ml="auto">sort / filter</Typography>
        </Box>

        {trips.map((trip, i) => (
          <Paper key={`my-trip-${i}`} sx={{ m: 2 }}>
            <Typography>{trip.name}</Typography>
            <Typography>{trip.createdAt.toString()}</Typography>
            <Typography>{trip.lastUpdatedAt.toString()}</Typography>
            <Typography>Days: {trip.numDays}</Typography>
            <IconButton onClick={() => navigate(`trip/${trip.id}`)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => hideTrip(trip.id)}>
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>

      {/* new Trip */}
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
          <TextField
            id="new-trip-name"
            input={name}
            inputRef={inputRef}
            placeholder="name"
            onChange={handleChangeName}
            clearInput={clearName}
          />
          <Typography variant="body1">Description</Typography>
          <TextField
            id="new-trip-description"
            input={description}
            inputRef={inputRef}
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
    </Container>
  );
};

export default Trips;
