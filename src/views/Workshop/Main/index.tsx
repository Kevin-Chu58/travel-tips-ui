import { Box, Container, Fab, Grid, Typography } from "@mui/material";
import { type Trip } from "@services/trips";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TTTabs from "@components/TTTabs";
import type { NavTab } from "@constants/Types";
import Layouts, { Headers } from "@constants/Layouts";
import TripForm from "@components/Forms/TripForm";
import { Route, Routes } from "react-router";
import Trips from "./Trips";
import TripsTool from "./Trips/TripsTool";
import HighlightsTool from "./Highlights/HighlightsTool";
import { type AttractionHighlights } from "@services/attractions";
import Highlights from "./Highlights";

const Main = () => {
  // basic strcutures
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // Trips
  const [trips, setTrips] = useState<Trip[]>([]);
  const [areTripsUpdated, setAreTripsUpdated] = useState<boolean>(false);
  // Highlights
  const [highlights, setHighlights] = useState<AttractionHighlights[]>([]);
  // open form status
  const [isAddTripOpen, setIsAddTripOpen] = useState<boolean>(false);
  // tool values
  const [sortTypeIndex, setSortTypeIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number[]>([]);

  const handleOpenMenu = () => {
    setIsAddTripOpen(true);
  };

  const renderTrips = () => {
    setAreTripsUpdated(prev => !prev);
  };

  const addSelected = (id: number) => {
    setSelected([...selected, id]);
  };

  const removeSelected = (id: number) => {
    let i = selected.indexOf(id);
    let _selected = [...selected];
    _selected.splice(i, 1);
    setSelected(_selected);
  };

  // render the nav tab index focus when page initializes
    useEffect(() => {
      let pathname = window.location.pathname;
      let navTabIndex = navTabs.findIndex((tab) => tab.to === pathname);
      setNavTabValue(navTabIndex);
    }, []);

  // rerender on navTabValue to reset tool values
  useEffect(() => {
    setSortTypeIndex(0);
    setSelected([]);
  }, [navTabValue]);

  const navTabs = [
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

  const workshopMainRoutes = [
    {
      name: "Trips",
      index: true,
      path: "",
      element: (
        <Trips
          trips={trips}
          selected={selected}
          addSelected={addSelected}
          removeSelected={removeSelected}
          setIsUpdated={renderTrips}
        />
      ),
      tool: (
        <TripsTool
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          selected={selected}
          setSelected={setSelected}
          setTrips={setTrips}
          isUpdated={areTripsUpdated}
          setIsUpdated={renderTrips}
        />
      ),
      addForm: (
        <TripForm
          isOpen={isAddTripOpen}
          setIsOpen={setIsAddTripOpen}
          setIsParentUpdated={renderTrips}
        />
      ),
      addFabOnClick: handleOpenMenu,
      addFabLabel: "New Trip",
    },
    {
      name: "Highlights",
      path: "/highlight",
      element: (
        <Highlights
          highlights={highlights}
          selected={selected}
          addSelected={addSelected}
          removeSelected={removeSelected}
          setIsUpdated={renderTrips}
        />
      ),
      tool: (
        <HighlightsTool
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          selected={selected}
          setSelected={setSelected}
          setHighlights={setHighlights}
          isUpdated={areTripsUpdated}
          setIsUpdated={renderTrips}
        />
      ),
      addForm: (
        <TripForm
          isOpen={isAddTripOpen}
          setIsOpen={setIsAddTripOpen}
          setIsParentUpdated={renderTrips}
        />
      ),
      addFabOnClick: handleOpenMenu,
      addFabLabel: "New Highlight",
    },
  ];

  return (
    <Container
      maxWidth={false}
      sx={{
        position: "relative",
        height: `calc(100vh - ${Headers}px)`,
        overflowY: "hidden",
      }}
    >
      <Routes>
        {workshopMainRoutes.map((route) => (
          <Route
            key={route.name}
            index={route.index}
            path={route.path}
            element={
              <>
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
                        {route.element}
                      </Box>
                    </Box>
                  </Grid>

                  {/* right panel */}
                  <Grid container size={3} direction="column">
                    {route.tool}
                  </Grid>
                </Grid>

                {/* add icon and new Item form */}
                <Fab
                  variant="extended"
                  aria-label="add"
                  onClick={route.addFabOnClick}
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
                  {route.addFabLabel}
                </Fab>
                {route.addForm}
              </>
            }
          />
        ))}
      </Routes>
    </Container>
  );
};

export default Main;
