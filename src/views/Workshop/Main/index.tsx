import {
  Box,
  Drawer,
  Fab,
  Typography,
} from "@mui/material";
import { type Trip } from "@services/trips";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { NavTab } from "@constants/Types";
import { Headers } from "@constants/Layouts";
import TripForm from "@components/Forms/TripForm";
import { Route, Routes } from "react-router";
import Trips from "./Trips";
import TripsTool from "./Trips/TripsTool";
import HighlightsTool from "./Highlights/HighlightsTool";
import { type AttractionHighlights } from "@services/attractions";
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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [areTripsUpdated, setAreTripsUpdated] = useState<boolean>(false);
  // Highlights
  const [highlights, setHighlights] = useState<AttractionHighlights[]>([]);
  const [areHighlightsUpdated, setAreHighlightsUpdated] =
    useState<boolean>(false);
  // open form status
  const [isAddTripOpen, setIsAddTripOpen] = useState<boolean>(false);
  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState<boolean>(false);
  // tool values
  const [sortTypeIndex, setSortTypeIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number[]>([]);
  // drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(!isMobile);

  const renderTrips = () => {
    setAreTripsUpdated((prev) => !prev);
  };

  const renderHighlights = () => {
    setAreHighlightsUpdated((prev) => !prev);
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
      addFabOnClick: () => setIsAddTripOpen(true),
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
          setIsUpdated={renderHighlights}
        />
      ),
      tool: (
        <HighlightsTool
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          setHighlights={setHighlights}
          isUpdated={areHighlightsUpdated}
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

  return (
    <Routes>
      {workshopMainRoutes.map((route) => (
        <Route
          key={route.name}
          index={route.index}
          path={route.path}
          element={
            <Box
              display="flex"
              flexDirection="row"
              position="relative"
              sx={{
                height: `calc(100vh - ${Headers}px)`,
                bgcolor: "secondary.main",
                color: "black",
              }}
            >
              {/* nav drawer */}
              {openDrawer &&
                (isMobile ? (
                  <Drawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <Box width={200} bgcolor="secondary.main" height="100vh">
                      <TTDrawer
                        navTabs={navTabs}
                        navTabValue={navTabValue}
                        setNavTabValue={setNavTabValue}
                        isMobile
                      />
                    </Box>
                  </Drawer>
                ) : (
                  <Box width={200}>
                    <TTDrawer
                      navTabs={navTabs}
                      navTabValue={navTabValue}
                      setNavTabValue={setNavTabValue}
                    />
                  </Box>
                ))}

              {/* content */}
              <Box
                display="flex"
                flex={1}
                flexDirection="column"
                sx={{
                  p: 2,
                  bgcolor: "white",
                  overflowY: "auto",
                }}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Hamburger toggled={openDrawer} toggle={setOpenDrawer} />
                  <Typography variant="h4" ml={0.5}>
                    {route.name}
                  </Typography>
                </Box>
                {route.element}
              </Box>

              {/* tools */}
              <Box px={1} width={200} bgcolor="secondary.main">
                {route.tool}

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
                    ":hover": {
                      bgcolor: "primary.main",
                      filter: "brightness(.9)",
                    },
                  }}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  {route.addFabLabel}
                </Fab>
              </Box>

              {/* new Item form */}
              {route.addForm}
            </Box>
          }
        />
      ))}
    </Routes>
  );
};

export default Main;
