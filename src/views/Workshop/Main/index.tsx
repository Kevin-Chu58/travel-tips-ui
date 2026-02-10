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
import AttractionFinder from "@components/AttractionFinder";
import TTDrawer from "@components/TTDrawer";
import { Turn as Hamburger } from "hamburger-react";
import { useIsMobile } from "@hooks/useIsMobile";
import CropperDialog from "@components/ImageSelector/CropperDialog";
import { ImagesService, type Image } from "@services/images";
import ImagesTool from "./Images/ImagesTool";
import Images from "./Images";
import SortUtils, {
  workshopAttractionsSortTypes,
  workshopImagesSortTypes,
  workshopTripsSortTypes,
} from "@utils/SortUtils";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import type { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import "./index.scss";

const Main = () => {
  // windows
  const isMobile = useIsMobile();
  // user
  const user = useSelector((state: RootState) => state.user);
  // nav tabs
  const [navTabValue, setNavTabValue] = useState<number>(0);
  const [subNavTabValue, setSubNavTabValue] = useState<number | undefined>();
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
  const tripsSortTypes = workshopTripsSortTypes;
  const attractionsSortTypes = workshopAttractionsSortTypes;
  const imagesSortTypes = workshopImagesSortTypes;
  // others
  const location = useLocation();

  // rerender to top of the scrollbar when nav tab changes
  useEffect(() => {
    const container = document.querySelector(
      ".content-container",
    ) as HTMLElement | null;
    if (!container) return;

    asyncTrips([]);

    requestAnimationFrame(() => {
      container.style.scrollBehavior = "auto";
      container.scrollTop = 0;
    });
  }, [navTabValue, subNavTabValue]);

  // ==========================
  // Trips state & handlers
  // ==========================

  // async functions

  const asyncTrips = (trips: Trip[]) => {
    tripsRef.current = trips;
    setTrips(trips);
  };

  // async functions

  const getMyTrips = async () => {
    const myTrips = await tripsService.getMyTrips();
    asyncTrips(SortUtils.sortList(myTrips, tripsSortTypes, sortTypeIndex));
  };

  // get trips others shared with me
  const getSharedTrips = async () => {
    const sharedTrips = await tripsService.getSharedTrips();
    asyncTrips(SortUtils.sortList(sharedTrips, tripsSortTypes, sortTypeIndex));
  };

  const getMyHiddenTrips = async () => {
    const myHiddenTrips = await tripsService.getMyHiddenTrips();
    asyncTrips(
      SortUtils.sortList(myHiddenTrips, tripsSortTypes, sortTypeIndex),
    );
  };

  const getMyBookmarkedTrips = async () => {
    const bookmarkedTrips = await tripsService.getBookmarkedTrips();
    asyncTrips(
      SortUtils.sortList(bookmarkedTrips, tripsSortTypes, sortTypeIndex),
    );
  };

  const asyncAddTrip = async (trip: Trip) => {
    tripsRef.current.push(trip);
    asyncTrips(
      SortUtils.sortList(tripsRef.current, tripsSortTypes, sortTypeIndex),
    );
  };

  const asyncUpdateTrip = async (trip: Trip) => {
    const trips = tripsRef.current;
    const tripIndex = trips.findIndex((t) => t.id === trip.id);
    trips[tripIndex] = trip;
    asyncTrips(SortUtils.sortList(trips, tripsSortTypes, sortTypeIndex));
  };

  const asyncDeleteTrip = async (trip: Trip) => {
    let filteredTrips = tripsRef.current.filter(
      (_trip) => _trip.id !== trip.id,
    );
    asyncTrips(
      SortUtils.sortList(filteredTrips, tripsSortTypes, sortTypeIndex),
    );
  };

  // ==========================
  // Attractions (with my highlights) state & handlers
  // ==========================

  const asyncAttractions = (attractions: Attraction[]) => {
    attractionsRef.current = attractions;
    setAttractions(attractions);
  };

  const getMyAttractions = async () => {
    if (user.id) {
      const myAttractions = await attractionsService.getAttractionsByParam({
        ownerId: user.id,
      });
      asyncAttractions(
        SortUtils.sortList(myAttractions, attractionsSortTypes, sortTypeIndex),
      );
    }
  };

  const asyncAddAttraction = async (attraction: Attraction) => {
    let attractions = attractionsRef.current;
    const attractionIndex = attractions.findIndex(
      (_attraction) => _attraction.id === attraction.id,
    );
    if (attractionIndex > -1) {
      attractions[attractionIndex].numHighlights! += 1;
    } else {
      attraction.numHighlights = 1;
      attractions.push(attraction);
    }

    asyncAttractions(
      SortUtils.sortList(attractions, attractionsSortTypes, sortTypeIndex),
    );
  };

  // ==========================
  // Images state & handlers
  // ==========================

  const asyncImages = (images: Image[]) => {
    imagesRef.current = images;
    setImages(images);
  };

  const getMyImages = async () => {
    const myImages = await ImagesService.getMyImages();
    asyncImages(SortUtils.sortList(myImages, imagesSortTypes, sortTypeIndex));
  };

  const asyncAddImage = async (_: number) => {
    const images = await ImagesService.getMyImages();
    imagesRef.current = images;
    asyncImages(
      SortUtils.sortList(imagesRef.current, imagesSortTypes, sortTypeIndex),
    );
  };

  const asyncUpdateImage = async (image: Image) => {
    let _image = imagesRef.current.find((_image) => _image.id === image.id);
    if (_image) {
      _image.name = image.name;
      asyncImages(
        SortUtils.sortList(imagesRef.current, imagesSortTypes, sortTypeIndex),
      );
    }
  };

  const asyncDeleteImage = async (id: number) => {
    let filteredImages = imagesRef.current.filter((_image) => _image.id !== id);
    asyncImages(
      SortUtils.sortList(filteredImages, imagesSortTypes, sortTypeIndex),
    );
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
    setSortTypeIndex(0);
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
          note: "Others Shared With me",
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
    emptyMessage: string = "",
    readonly: boolean = false,
  ) => (
    <Trips
      trips={trips}
      readonly={readonly}
      asyncUpdateTrip={asyncUpdateTrip}
      asyncDeleteTrip={asyncDeleteTrip}
      emptyMessage={emptyMessage}
    />
  );

  const tripsTool = (add: boolean = false) => (
    <TripsTool
      sortTypes={tripsSortTypes}
      sortTypeIndex={sortTypeIndex}
      setSortTypeIndex={setSortTypeIndex}
      selected={selected}
      addOnClick={add ? () => setIsAddTripOpen(true) : undefined}
      tripsRef={tripsRef}
      getMyTrips={getMyTrips}
      getSharedTrips={getSharedTrips}
      getMyHiddenTrips={getMyHiddenTrips}
      getMyBookmarkedTrips={getMyBookmarkedTrips}
      asyncTrips={asyncTrips}
    />
  );

  const tripsMainRoute = {
    name: "Trips",
    index: true,
    path: "",
    element: tripsElement("No trips created."),
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
    element: tripsElement("No trips shared with you.", true),
    tool: tripsTool(),
  };

  const tripsArchiveRoute = {
    name: "Archived Trips",
    path: "/archive",
    element: tripsElement("No trips in Archive."),
    tool: tripsTool(),
  };

  const tripsBookmarkedRoute = {
    name: "Bookmarked Trips",
    path: "/bookmark",
    element: tripsElement("No trips bookmarked.", true),
    tool: tripsTool(),
  };

  // ==========================
  // Attractions (with my highlights) routes
  // ==========================

  const attractionsMainRoute = {
    name: "Highlights",
    path: "/Highlights",
    element: (
      <Highlights attractions={attractions} showHovers={attractionShowHovers} />
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
        asyncUpdateImage={asyncUpdateImage}
        asyncDeleteImage={asyncDeleteImage}
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
                <Box className="content-container">
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
                  <Box className="content-content-container">
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
