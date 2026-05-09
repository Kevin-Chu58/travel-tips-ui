import { Box, Container, Drawer, Typography } from "@mui/material";
import { tripsService, type Trip } from "@services/trips";
import { useEffect, useRef, useState } from "react";
import type { NavTab, WorkshopRoute } from "@constants/Types";
import TripForm from "@components/Forms/TripForm";
import { Route, Routes } from "react-router";
import Trips from "./Trips";
import TripsTool from "./Trips/TripsTool";
import HighlightsTool from "./Highlights/HighlightsTool";
import { attractionsService, type Attraction } from "@services/attractions";
import Highlights from "./Highlights";
import TTDrawer from "@components/TTDrawer";
import { Turn as Hamburger } from "hamburger-react";
import { useIsMobile } from "@hooks/useIsMobile";
import CropperDialog from "@components/ImageSelector/CropperDialog";
import { imagesService, type Image } from "@services/images";
import ImagesTool from "./Images/ImagesTool";
import Images from "./Images";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import type { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import React from "react";
import "./index.scss";

// lazy load
const AttractionFinder = React.lazy(
  () => import("@components/AttractionFinder"),
);

const Main = () => {
  // windows
  const isMobile = useIsMobile();
  // user
  const user = useSelector((state: RootState) => state.user);
  // nav tabs
  const [navTabValue, setNavTabValue] = useState<number>(0);
  const [subNavTabValue, setSubNavTabValue] = useState<number | undefined>();
  // cursor
  const [cursor, setCursor] = useState<string>();
  // Trips
  const [trips, setTrips] = useState<Trip[]>([]);
  // Highlights
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionShowHovers, setAttractionShowHovers] =
    useState<boolean>(false);
  // images
  const [images, setImages] = useState<Image[]>([]);
  // cropper image
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  // open form status
  const [isAddTripOpen, setIsAddTripOpen] = useState<boolean>(false);
  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState<boolean>(false);
  const [isAddImageOpen, setIsAddImageOpen] = useState<boolean>(false);
  // tool values
  const [selected, setSelected] = useState<number[]>([]);
  // drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // others
  const location = useLocation();

  // rerender to top of the scrollbar when nav tab changes
  useEffect(() => {
    const container = document.querySelector(
      ".content-container",
    ) as HTMLElement | null;
    if (!container) return;

    setTrips([]);
    setCursor(undefined);

    requestAnimationFrame(() => {
      container.style.scrollBehavior = "auto";
      container.scrollTop = 0;
    });
  }, [navTabValue, subNavTabValue]);

  // ==========================
  // Trips state & handlers
  // ==========================

  // async functions

  const asyncAddTrip = async (trip: Trip) => {
    setTrips((prev) => [...prev, trip]);
  };

  const asyncUpdateTrip = async (trip: Trip) => {
    const _trips = trips;
    const tripIndex = trips.findIndex((t) => t.id === trip.id);
    _trips[tripIndex] = trip;
    setTrips([..._trips]);
  };

  const asyncDeleteTrip = async (trip: Trip) => {
    let filteredTrips = trips.filter((_trip) => _trip.id !== trip.id);
    setTrips([...filteredTrips]);
  };

  // get trips

  const getMyTrips = async () => {
    if (trips.length > 0 && !cursor) return;

    setIsLoading(true);
    const myTrips = await tripsService.getMyTrips(cursor);

    cursor
      ? setTrips((prev) => [...prev, ...myTrips.results])
      : setTrips(myTrips.results);

    setCursor(myTrips.cursor);
    setIsLoading(false);
  };

  // get trips others shared with me
  const getSharedTrips = async () => {
    setIsLoading(true);
    const sharedTrips = await tripsService.getSharedTrips(cursor);

    cursor
      ? setTrips((prev) => [...prev, ...sharedTrips.results])
      : setTrips(sharedTrips.results);

    setCursor(sharedTrips.cursor);
    setIsLoading(false);
  };

  const getMyHiddenTrips = async () => {
    setIsLoading(true);
    const myHiddenTrips = await tripsService.getMyHiddenTrips(cursor);

    cursor
      ? setTrips((prev) => [...prev, ...myHiddenTrips.results])
      : setTrips(myHiddenTrips.results);

    setCursor(myHiddenTrips.cursor);
    setIsLoading(false);
  };

  const getMyBookmarkedTrips = async () => {
    setIsLoading(true);
    const bookmarkedTrips = await tripsService.getBookmarkedTrips(cursor);

    cursor
      ? setTrips((prev) => [...prev, ...bookmarkedTrips.results])
      : setTrips(bookmarkedTrips.results);

    setCursor(bookmarkedTrips.cursor);
    setIsLoading(false);
  };

  // ==========================
  // Attractions (with my highlights) state & handlers
  // ==========================

  const getMyAttractions = async () => {
    setIsLoading(true);
    if (user.id) {
      const myAttractions = await attractionsService.getAttractionsByParam({
        ownerId: user.id,
        cursor: cursor,
      });

      cursor
        ? setAttractions((prev) => [...prev, ...myAttractions.results])
        : setAttractions(myAttractions.results);

      setCursor(myAttractions.cursor);
    }

    setIsLoading(false);
  };

  const asyncAddAttraction = async (attraction: Attraction) => {
    let _attractions = attractions;
    const attractionIndex = _attractions.findIndex(
      (a) => a.id === attraction.id,
    );
    if (attractionIndex > -1) {
      attractions[attractionIndex].numHighlights! += 1;
    } else {
      attraction.numHighlights = 1;
      _attractions.push(attraction);
    }

    setAttractions(_attractions);
  };

  // ==========================
  // Images state & handlers
  // ==========================

  const getMyImages = async () => {
    setIsLoading(true);

    const myImages = await imagesService.getMyImages(cursor);

    cursor
      ? setImages((prev) => [...prev, ...myImages.results])
      : setImages(myImages.results);

    setCursor(myImages.cursor);

    setIsLoading(false);
  };

  const asyncAddImage = async (_: number) => {
    const myImages = await imagesService.getMyImages();

    cursor
      ? setImages((prev) => [...prev, ...myImages.results])
      : setImages(myImages.results);

    setCursor(myImages.cursor);

    setIsLoading(false);
  };

  const asyncUpdateImage = async (image: Image) => {
    let _images = [...images];
    let _imageId = _images.findIndex((_image) => _image.id === image.id);

    if (_imageId > -1) {
      _images[_imageId] = image;
      setImages(_images);
    }
  };

  const asyncDeleteImage = async (id: number) => {
    let filteredImages = images.filter((_image) => _image.id !== id);
    setImages(filteredImages);
  };

  // render the nav tab index and sub nav tab index focus when page initializes
  // refactored by: ChatGPT
  useEffect(() => {
    const pathname = location.pathname;

    // Find the most specific matching tab
    const navTabIndex =
      navTabs
        .map((tab, index) => ({ tab, index }))
        .filter(({ tab }) => tab.to && pathname.startsWith(tab.to))
        .sort((a, b) => b.tab.to!.length - a.tab.to!.length)[0]?.index ?? 0;

    const navTab = navTabs[navTabIndex];

    let subNavTabIndex: number | undefined = undefined;

    if (navTab?.subs) {
      const index = navTab.subs.findIndex((sub) => sub.to === pathname);
      if (index !== -1) {
        subNavTabIndex = index;
      }
    }

    setNavTabValue(navTabIndex);
    setSubNavTabValue(subNavTabIndex);
  }, [location.pathname]);

  // rerender on navTabValue to reset tool values
  useEffect(() => {
    setSelected([]);
  }, [navTabValue, subNavTabValue]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsAddImageOpen(true);

      // Reset so reselecting the same file works (double-click)
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const navTabs = [
    {
      name: "Trips",
      label: "Trips",
      to: "/workshop",
      subs: [
        {
          name: "Bookmark",
          label: "Bookmark",
          icon: <BookmarkIcon />,
          note: "Bookmarked Trips",
          to: "/workshop/bookmark",
        },
        {
          name: "Shared",
          label: "Shared",
          icon: <GroupIcon />,
          note: "Trips Shared With me",
          to: "/workshop/shared",
        },
        {
          name: "Archive",
          label: "Archive",
          icon: <ArchiveIcon />,
          note: "Archived Trips",
          to: "/workshop/archive",
        },
      ],
    },
    {
      name: "Highlights",
      label: "Highlights",
      to: "/workshop/highlights",
    },
    {
      name: "Images",
      label: "Images",
      to: "/workshop/images",
    },
  ] as NavTab[];

  // ==========================
  // Trips routes
  // ==========================

  const tripsElement = (
    getMore: () => void,
    emptyMessage: string = "",
    readonly: boolean = false,
  ) => (
    <Trips
      trips={trips}
      readonly={readonly}
      asyncUpdateTrip={asyncUpdateTrip}
      asyncDeleteTrip={asyncDeleteTrip}
      cursor={cursor}
      getMore={getMore}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
    />
  );

  const tripsTool = (add: boolean = false) => (
    <TripsTool
      selected={selected}
      addOnClick={add ? () => setIsAddTripOpen(true) : undefined}
      getMyTrips={getMyTrips}
      getSharedTrips={getSharedTrips}
      getMyHiddenTrips={getMyHiddenTrips}
      getMyBookmarkedTrips={getMyBookmarkedTrips}
    />
  );

  const tripsMainRoute = {
    name: "Trips",
    index: true,
    path: "",
    element: tripsElement(getMyTrips, "No trips created."),
    tool: tripsTool(true),
    addForm: (
      <TripForm
        isOpen={isAddTripOpen}
        setIsOpen={setIsAddTripOpen}
        asyncAddTrip={asyncAddTrip}
      />
    ),
  };

  const tripsSharedRoute = {
    name: "Trips Shared With Me",
    path: "/shared",
    element: tripsElement(getSharedTrips, "No trips shared with you.", true),
    tool: tripsTool(),
  };

  const tripsArchiveRoute = {
    name: "Archived Trips",
    path: "/archive",
    element: tripsElement(getMyHiddenTrips, "No trips in Archive."),
    tool: tripsTool(),
  };

  const tripsBookmarkedRoute = {
    name: "Bookmarked Trips",
    path: "/bookmark",
    element: tripsElement(getMyBookmarkedTrips, "No trips bookmarked.", true),
    tool: tripsTool(),
  };

  // ==========================
  // Attractions (with my highlights) routes
  // ==========================

  const attractionsMainRoute = {
    name: "Highlights",
    path: "/Highlights",
    element: (
      <Highlights
        attractions={attractions}
        cursor={cursor}
        getMore={getMyAttractions}
        showHovers={attractionShowHovers}
        isLoading={isLoading}
      />
    ),
    tool: (
      <HighlightsTool
        addOnClick={() => setIsAddHighlightOpen(true)}
        getMyAttractions={getMyAttractions}
        showHovers={attractionShowHovers}
        setShowHovers={setAttractionShowHovers}
      />
    ),
    addForm: (
      <AttractionFinder
        open={isAddHighlightOpen}
        setOpen={setIsAddHighlightOpen}
        asyncAddAttraction={asyncAddAttraction}
      />
    ),
  };

  // ==========================
  // Images routes
  // ==========================

  const imagesMainRoute = {
    name: "Images",
    path: "/images",
    element: (
      <Images
        images={images}
        cursor={cursor}
        getMore={getMyImages}
        asyncUpdateImage={asyncUpdateImage}
        asyncDeleteImage={asyncDeleteImage}
        isLoading={isLoading}
      />
    ),
    tool: (
      <ImagesTool
        addOnClick={openFileDialog}
        addInput={
          <input
            className="image-selector-cropper-file-input"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        }
        getMyImages={getMyImages}
      />
    ),
    addForm: (
      <CropperDialog
        open={isAddImageOpen}
        onClose={() => setIsAddImageOpen(false)}
        imageSrc={imageSrc}
        asyncAddImage={asyncAddImage}
      />
    ),
  };

  const workshopMainRoutes = [
    // trips
    tripsMainRoute,
    tripsSharedRoute,
    tripsArchiveRoute,
    tripsBookmarkedRoute,
    // highlights
    attractionsMainRoute,
    // images
    imagesMainRoute,
  ] as WorkshopRoute[];

  const drawer = (
    <TTDrawer
      navTabs={navTabs}
      navTabValue={navTabValue}
      setNavTabValue={setNavTabValue}
      subNavTabValue={subNavTabValue}
      setSubNavTabValue={setSubNavTabValue}
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
            <Container maxWidth={false} disableGutters>
              <Box className="workshop-main-route-container">
                {/* nav drawer */}
                {isMobile ? (
                  <Drawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <Box className="workshop-main-nav-drawer-container">
                      {drawer}
                    </Box>
                  </Drawer>
                ) : (
                  <Box className="workshop-main-nav-drawer-container">
                    {drawer}
                  </Box>
                )}

                {/* content */}
                <Box className="column flex content-container">
                  <Box className="content-header-container">
                    <Box className="content-title-container">
                      {isMobile && (
                        <Hamburger
                          size={24}
                          toggled={false}
                          toggle={setOpenDrawer}
                        />
                      )}
                      <Typography className="content-title">
                        {route.name}
                      </Typography>
                    </Box>

                    {/* tools */}
                    <Box>{route.tool}</Box>
                  </Box>

                  {/* content list */}
                  <Box className="column flex content-content-container">
                    {route.element}
                  </Box>
                </Box>

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
