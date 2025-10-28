import { Box, Container, Drawer, Fab, Typography } from "@mui/material";
import { type Trip } from "@services/trips";
import { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { NavTab } from "@constants/Types";
import { Headers } from "@constants/Layouts";
import TripForm from "@components/Forms/TripForm";
import { Route, Routes } from "react-router";
import Trips from "./Trips";
import TripsTool from "./Trips/TripsTool";
import HighlightsTool from "./Highlights/HighlightsTool";
import { type Attraction } from "@services/attractions";
import Highlights from "./Highlights";
import AttractionFinder from "@components/AttractionFinder";
import TTDrawer from "@components/TTDrawer";
import { Turn as Hamburger } from "hamburger-react";
import { useIsMobile } from "@hooks/useIsMobile";

const Main = () => {
  // windows
  const isMobile = useIsMobile();
  // basic strcutures
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // Trips
  const tripsRef = useRef<Trip[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [areTripsUpdated, setAreTripsUpdated] = useState<boolean>(false);
  // Highlights
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [areAttractionsUpdated, setAreAttractionsUpdated] =
    useState<boolean>(false);
  // open form status
  const [isAddTripOpen, setIsAddTripOpen] = useState<boolean>(false);
  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState<boolean>(false);
  // tool values
  const [sortTypeIndex, setSortTypeIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number[]>([]);
  // drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const renderTrips = () => {
    setAreTripsUpdated((prev) => !prev);
  };

  const renderHighlights = () => {
    setAreAttractionsUpdated((prev) => !prev);
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

  const asyncTrips = (trips: Trip[]) => {
    tripsRef.current = trips;
    setTrips(trips);
  };

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
          setIsUpdated={renderTrips}
        />
      ),
      tool: (
        <TripsTool
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          selected={selected}
          setSelected={setSelected}
          tripsRef={tripsRef}
          asyncTrips={asyncTrips}
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
      addFabOnClick: () => setIsAddTripOpen(true),
      addFabLabel: "New Trip",
    },
    {
      name: "Highlights",
      path: "/highlight",
      element: (
        <Highlights
          attractions={attractions}
        />
      ),
      tool: (
        <HighlightsTool
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          setAttractions={setAttractions}
          syncAttractions={areAttractionsUpdated}
        />
      ),
      addForm: (
        <AttractionFinder
          open={isAddHighlightOpen}
          setOpen={setIsAddHighlightOpen}
          setIsParentUpdated={renderHighlights}
        />
      ),
      addFabOnClick: () => setIsAddHighlightOpen(true),
      addFabLabel: "New Highlight",
    },
  ];

  const drawer = (
    <TTDrawer
      navTabs={navTabs}
      navTabValue={navTabValue}
      setNavTabValue={setNavTabValue}
      isMobile={isMobile}
    />
  );

  return (
    <Routes>
      {workshopMainRoutes.map((route) => (
        <Route
          key={route.name}
          index={route.index}
          path={route.path}
          element={
            <Container
              maxWidth={false}
              // maxWidth="lg"
              disableGutters
            >
              <Box
                width="100%"
                display="flex"
                flexDirection="row"
                position="relative"
                sx={{
                  height: `calc(100vh - ${Headers}px)`,
                  color: "black",
                }}
              >
                {/* nav drawer */}
                {isMobile ? (
                  <Drawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <Box width={200} bgcolor="secondary.main" height="100vh">
                      {drawer}
                    </Box>
                  </Drawer>
                ) : (
                  <Box
                    width={200}
                    sx={{
                      transition: ".2s linear eidth",
                    }}
                  >
                    {drawer}
                  </Box>
                )}

                {/* content */}
                <Box
                  display="flex"
                  width="100%"
                  flexDirection="column"
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    overflowY: "auto",
                  }}
                >
                  <Box display="flex" flexDirection="row" alignItems="center">
                    {isMobile && (
                      <Hamburger toggled={false} toggle={setOpenDrawer} />
                    )}
                    <Typography variant="h4" ml={0.5}>
                      {route.name}
                    </Typography>
                  </Box>

                  {/* tools */}
                  <Box mt={1}>{route.tool}</Box>

                  {/* content list */}
                  {route.element}
                </Box>

                {/* add icon */}
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
                    textTransform: "capitalize",
                    ":hover": {
                      bgcolor: "primary.main",
                      filter: "brightness(.9)",
                    },
                  }}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  {route.addFabLabel}
                </Fab>

                {/* new Item form */}
                {route.addForm}
              </Box>
            </Container>
          }
        />
      ))}
    </Routes>
  );
};

export default Main;
