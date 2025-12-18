import { Box, Container, Drawer, Typography } from "@mui/material";
import { tripsService, type Trip } from "@services/trips";
import { useEffect, useRef, useState } from "react";
import type { NavTab } from "@constants/Types";
import TripForm from "@components/Forms/TripForm";
import { Route, Routes } from "react-router";
import Trips from "./Trips";
import TripsTool from "./Trips/TripsTool";
import HighlightsTool from "./Highlights/HighlightsTool";
import { attractionsService, type Attraction } from "@services/attractions";
import Highlights from "./Highlights";
import AttractionFinder from "@components/AttractionFinder";
import TTDrawer from "@components/TTDrawer";
import { Turn as Hamburger } from "hamburger-react";
import { useIsMobile } from "@hooks/useIsMobile";
import CropperDialog from "@components/ImageSelector/CropperDialog";
import { ImagesService, type Image } from "@services/images";
import Images from "./Images";
import ImagesTool from "./Images/ImagesTool";
import SortUtils, {
  sortTypeDayAsc,
  sortTypeDayDesc,
  sortTypeIdAsc,
  sortTypeIdDesc,
  sortTypeNameAsc,
  sortTypeNameDesc,
  sortTypeNumHighlightsAsc,
  sortTypeNumHighlightsDesc,
  sortTypeTitleAsc,
  sortTypeTitleDesc,
} from "@utils/SortUtils";
import "./index.scss";

const Main = () => {
  // windows
  const isMobile = useIsMobile();
  // basic strcutures
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // Trips
  const tripsRef = useRef<Trip[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  // Highlights
  const attractionsRef = useRef<Attraction[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [attractionShowHovers, setAttractionShowHovers] =
    useState<boolean>(false);
  // images
  const imagesRef = useRef<Image[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  // cropper image
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  // open form status
  const [isAddTripOpen, setIsAddTripOpen] = useState<boolean>(false);
  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState<boolean>(false);
  const [isAddImageOpen, setIsAddImageOpen] = useState<boolean>(false);
  // tool values
  const [sortTypeIndex, setSortTypeIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number[]>([]);
  // drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  //sortTypes
  const tripsSortTypes = [
    sortTypeTitleAsc,
    sortTypeTitleDesc,
    sortTypeDayAsc,
    sortTypeDayDesc,
  ];
  const attractionsSortTypes = [
    sortTypeTitleAsc,
    sortTypeTitleDesc,
    sortTypeNumHighlightsAsc,
    sortTypeNumHighlightsDesc,
  ];
  const imagesSortTypes = [
    sortTypeIdAsc,
    sortTypeIdDesc,
    sortTypeNameAsc,
    sortTypeNameDesc,
  ];

  // async functions

  const asyncTrips = (trips: Trip[]) => {
    tripsRef.current = trips;
    setTrips(trips);
  };

  const asyncAttractions = (attractions: Attraction[]) => {
    attractionsRef.current = attractions;
    setAttractions(attractions);
  };

  const asyncImages = (images: Image[]) => {
    imagesRef.current = images;
    setImages(images);
  };

  // sync functions

  const getMyTrips = async () => {
    const myTrips = await tripsService.getMyTrips();
    asyncTrips(SortUtils.sortList(myTrips, tripsSortTypes, sortTypeIndex));
  };

  const syncAddTrip = async (trip: Trip) => {
    tripsRef.current.push(trip);
    asyncTrips(
      SortUtils.sortList(tripsRef.current, tripsSortTypes, sortTypeIndex)
    );
  };

  const syncDeleteTrip = async (trip: Trip) => {
    let filteredTrips = tripsRef.current.filter(
      (_trip) => _trip.id !== trip.id
    );
    asyncTrips(
      SortUtils.sortList(filteredTrips, tripsSortTypes, sortTypeIndex)
    );
  };

  const getMyAttractions = async () => {
    const myAttractions = await attractionsService.getMyAttractionsByName();
    asyncAttractions(
      SortUtils.sortList(myAttractions, attractionsSortTypes, sortTypeIndex)
    );
  };

  const syncAddAttraction = async (attraction: Attraction) => {
    let attractions = attractionsRef.current;
    const attractionIndex = attractions.findIndex(
      (_attraction) => _attraction.id === attraction.id
    );
    if (attractionIndex > -1) {
      attractions[attractionIndex].numHighlights! += 1;
    } else {
      attraction.numHighlights = 1;
      attractions.push(attraction);
    }

    asyncAttractions(
      SortUtils.sortList(attractions, attractionsSortTypes, sortTypeIndex)
    );
  };

  const getMyImages = async () => {
    const myImages = await ImagesService.getMyImages();
    asyncImages(SortUtils.sortList(myImages, imagesSortTypes, sortTypeIndex));
  };

  const syncAddImage = async (image: Image) => {
    imagesRef.current.push(image);
    asyncImages(
      SortUtils.sortList(imagesRef.current, imagesSortTypes, sortTypeIndex)
    );
  };

  const syncUpdateImage = async (image: Image) => {
    let _image = imagesRef.current.find((_image) => _image.id === image.id);
    if (_image) {
      _image.name = image.name;
      asyncImages(
        SortUtils.sortList(imagesRef.current, imagesSortTypes, sortTypeIndex)
      );
    }
  };

  const syncDeleteImage = async (id: number) => {
    let filteredImages = imagesRef.current.filter((_image) => _image.id !== id);
    asyncImages(
      SortUtils.sortList(filteredImages, imagesSortTypes, sortTypeIndex)
    );
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

  const workshopMainRoutes = [
    {
      name: "Trips",
      index: true,
      path: "",
      element: <Trips trips={trips} syncDeleteTrip={syncDeleteTrip} />,
      tool: (
        <TripsTool
          sortTypes={tripsSortTypes}
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          selected={selected}
          addOnClick={() => setIsAddTripOpen(true)}
          tripsRef={tripsRef}
          getMyTrips={getMyTrips}
          asyncTrips={asyncTrips}
        />
      ),
      addForm: (
        <TripForm
          isOpen={isAddTripOpen}
          setIsOpen={setIsAddTripOpen}
          syncAddTrip={syncAddTrip}
        />
      ),
    },
    {
      name: "Highlights",
      path: "/highlights",
      element: (
        <Highlights
          attractions={attractions}
          showHovers={attractionShowHovers}
        />
      ),
      tool: (
        <HighlightsTool
          sortTypes={attractionsSortTypes}
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          addOnClick={() => setIsAddHighlightOpen(true)}
          attractionsRef={attractionsRef}
          getMyAttractions={getMyAttractions}
          asyncAttractions={asyncAttractions}
          showHovers={attractionShowHovers}
          setShowHovers={setAttractionShowHovers}
        />
      ),
      addForm: (
        <AttractionFinder
          open={isAddHighlightOpen}
          setOpen={setIsAddHighlightOpen}
          syncAddAttraction={syncAddAttraction}
        />
      ),
    },
    {
      name: "Images",
      path: "/images",
      element: (
        <Images
          images={images}
          syncUpdateImage={syncUpdateImage}
          syncDeleteImage={syncDeleteImage}
        />
      ),
      tool: (
        <ImagesTool
          sortTypes={imagesSortTypes}
          sortTypeIndex={sortTypeIndex}
          setSortTypeIndex={setSortTypeIndex}
          addOnClick={openFileDialog}
          addInput={
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="image-selector-cropper-file-input"
              onChange={handleFileChange}
            />
          }
          imagesRef={imagesRef}
          getMyImages={getMyImages}
          asyncImages={asyncImages}
        />
      ),
      addForm: (
        <CropperDialog
          open={isAddImageOpen}
          onClose={() => setIsAddImageOpen(false)}
          imageSrc={imageSrc}
          syncAddImage={syncAddImage}
        />
      ),
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
                <Box className="workshop-main-content-container">
                  <Box className="workshop-main-content-header-container">
                    <Box className="workshop-main-content-title-container">
                      {isMobile && (
                        <Hamburger toggled={false} toggle={setOpenDrawer} />
                      )}
                      <Typography
                        className="workshop-main-content-title"
                        variant="h4"
                      >
                        {route.name}
                      </Typography>
                    </Box>

                    {/* tools */}
                    <Box className="workshop-main-content-tool-container">
                      {route.tool}
                    </Box>
                  </Box>

                  {/* content list */}
                  <Box className="workshop-main-content-content-container">
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
