import {
  Box,
  Button,
  Container,
  Dialog,
  Fab,
  Grid,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import { tripsService, type Trip } from "@services/trips";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import TextField from "@components/TextField";
import TTTabs from "@components/TTTabs";
import type { NavTab } from "@constants/Types";
import Layouts, { Headers, WorkshopToNavTab } from "@constants/Layouts";
import TTCard from "@components/TTCard";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TimeUtils from "@utils/TimeUtils";
import { getHex } from "@constants/Colors";
import StyleUtils from "@utils/StyleUtils";

const Main = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [navTabValue, setNavTabValue] = useState<number>(0);
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

  const handleOpenMenu = () => {
    setisOpen(true);
  };

  const handleCloseMenu = () => {
    setisOpen(false);
    clearName();
    clearDescription();
  };

  let navTabs = [
    {
      name: "Trips",
      label: "Trips",
      to: "/workshop",
    },
    {
      name: "Highlights",
      label: "Highlights",
      to: "/workshop/highlight",
    },
  ] as NavTab[];

  // trip

  const hideTrip = async (id: number) => {
    if (token) {
      await tripsService.hideTrip(id, token);
      setIsUpdated((prev) => !prev);
    }
  };

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
        setIsUpdated((prev) => !prev);
      }
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        position: "relative",
        height: `calc(100vh - ${Headers}px)`,
        overflowY: "hidden",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          mt: `${Layouts.WorkshopNameMt}px`,
          color: "black",
        }}
      >
        {/* left panel */}
        <Grid size={9} position="relative">
          <Box>
            {/* name */}
            <Box height={Layouts.WorkshopName}>
              <Typography variant="h4" fontWeight="bold">
                My Workshop
              </Typography>
            </Box>

            {/* nav tabs */}
            <Box
              sx={{
                height: Layouts.WorkshopNavTab,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <TTTabs
                navTabValue={navTabValue}
                navTabs={navTabs}
                setNavTabValue={setNavTabValue}
              />
            </Box>

            {/* content */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
              }}
            >
              <Grid
                container
                spacing={2}
                p={2}
                sx={{
                  maxHeight: `calc(100vh - ${WorkshopToNavTab}px)`,
                }}
              >
                {trips.map((trip) => (
                  <Grid
                    container
                    direction="row"
                    size={6}
                    key={`my-trip-${trip.id}`}
                    onDoubleClick={() => navigate(`trip/${trip.id}`)}
                    sx={{
                      color: "white",
                      background: StyleUtils.generateLinearGradientDarker(
                        getHex("steelblue")!
                      ),
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                      height: 160,
                      cursor: "pointer",
                    }}
                  >
                    {/* trip info */}
                    <Grid container direction="column" spacing={0} size={7} p={1} position="relative">
                      <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
                        {trip.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          color: trip.numDays ? "lightgrey" : "darkgrey",
                          fontStyle: trip.numDays ? "none" : "italic",
                        }}
                      >
                        {TimeUtils.formatDays(trip.numDays ?? 0)}
                      </Typography>

                      {/* last updated */}

                        <Typography
                          variant="body2"
                          fontStyle="italic"
                          bottom={8}
                          left={8}
                          position="absolute"
                        >
                          Last Updated ·{" "}
                          {trip.lastUpdatedAt.toString().split("T")[0]}
                        </Typography>

                        {/* <Box
                          bottom={0}
                          right={-8}
                          position="absolute"
                        >
                          <IconButton
                            size="small"
                            onClick={() => navigate(`trip/${trip.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => hideTrip(trip.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box> */}
                    </Grid>

                    {/* trip image */}
                    <Grid size={5}>
                      <Box
                        component="img"
                        src="src/assets/Lincoln_Memorial.jpeg"
                        // src="src/assets/test.jpg"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "50% 40%",
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
                <Grid size={12} height={4} />
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* right panel */}
        <Grid container size={3} direction="column">
          <TTCard
            color="black"
            bgcolor="white"
            title="Sort By"
            icon={<SortIcon />}
            sx={{ background: "white" }}
          >
            sort type
          </TTCard>
          <TTCard
            color="black"
            bgcolor="white"
            title="Filter"
            icon={<FilterAltIcon />}
            sx={{ background: "white", mt: 0 }}
          >
            filter params
          </TTCard>
        </Grid>
      </Grid>

      {/* add icon */}
      <Fab
        variant="extended"
        aria-label="add"
        onClick={handleOpenMenu}
        disableRipple
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          bgcolor: "primary.main",
          color: "white",
          ":hover": {
            bgcolor: "primary.main",
            filter: "brightness(.9)",
          },
        }}
      >
        <AddIcon sx={{ mr: 1 }} />
        New Trip
      </Fab>

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
            placeholder="name"
            onChange={handleChangeName}
            clearInput={clearName}
          />
          <Typography variant="body1">Description</Typography>
          <TextField
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
    </Container>
  );
};

export default Main;
