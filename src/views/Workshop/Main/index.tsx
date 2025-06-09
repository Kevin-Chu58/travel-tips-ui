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
import TextField from "@components/TextField";
import TTTabs from "@components/TTTabs";
import type { NavTab, SortType } from "@constants/Types";
import Layouts, { Headers, WorkshopToNavTab } from "@constants/Layouts";
import ListTool from "@components/ListTool";
import TTTripCard from "@components/TTTripCard";
import SortUtils from "@utils/SortUtils";

const Main = () => {
  // basic strcutures
  const [navTabValue, setNavTabValue] = useState<number>(0);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  // items
  const [trips, setTrips] = useState<Trip[]>([]);
  // open form status
  const [isOpen, setisOpen] = useState<boolean>(false);
  // new trip attributes
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorParams, setErrorParams] = useState<string[]>([]);
  // tool values
  const [sortTypeIndex, setSortTypeIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number[]>([]);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender on trips length
  useEffect(() => {}, [trips.length]);

  // rerender on access token and isUpdated
  useEffect(() => {
    const getMyTrips = async () => {
      if (token) {
        const myTrips = await tripsService.getMyTrips(token);
        setTrips(sortTrips(myTrips));
        // setIsSorted(prev => !prev);
      }
    };
    getMyTrips();
  }, [token, isUpdated]);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    setTrips(prevTrips => sortTrips([...prevTrips]));
  }, [sortTypeIndex]);

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

  // list tool

  const sortTypes = [{
    label: "Id ASC",
    function: SortUtils.sortIdAsc,
  },{
    label: "Id DESC",
    function: SortUtils.sortIdDesc,
  },{
    label: "Name ASC",
    function: SortUtils.sortNameAsc,
  }, {
    label: "Name DESC",
    function: SortUtils.sortNameDesc,
  }, {
    label: "Days ASC",
    function: SortUtils.sortDayAsc,
  },{
    label: "Days DESC",
    function: SortUtils.sortDayDesc,
  },{
    label: "Last Updated ASC",
    function: SortUtils.sortLastUpdatedAsc,
  },{
    label: "Last Updated DESC",
    function: SortUtils.sortLastUpdatedDesc,
  }] as SortType[];

  const sortTrips = (list: any[]) => {
      let func = sortTypes[sortTypeIndex].function;
      return func(list);
    }

  const addSelected = (id: number) => {
    setSelected([...selected, id]);
  };

  const removeSelected = (id: number) => {
    let i = selected.indexOf(id);
    let _selected = [...selected];
    _selected.splice(i, 1);
    setSelected(_selected);
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
                columns={12}
                p={2}
                sx={{
                  maxHeight: `calc(100vh - ${WorkshopToNavTab}px)`,
                }}
              >
                {trips.map((trip) => (
                  <TTTripCard
                    key={`trip-${trip.id}`}
                    trip={trip}
                    isFocused={selected.includes(trip.id)}
                    setIsFocused={
                      selected.includes(trip.id) ? removeSelected : addSelected
                    }
                    setParentUpdate={() => setIsUpdated((prev) => !prev)}
                  />
                ))}
                <Grid size={12} height={4} />
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* right panel */}
        <Grid container size={3} direction="column">
          <ListTool
            sortType={sortTypeIndex}
            setSortType={setSortTypeIndex}
            sortTypes={sortTypes}
            selected={selected}
            setSelected={setSelected}
            setParentUpdate={() => setIsUpdated((prev) => !prev)}
          />
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
