import Map from "@components/Map";
import type { NavTab } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import {
  Box,
  Button,
  FormControl,
  OutlinedInput,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import { type Trip, type TripPatch, tripsService } from "@services/trips";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useSnackbar } from "notistack";
import DescriptionTextField from "@components/TextField/DescriptionTextField";
import TTButton from "@components/TTButton";
import "./index.scss";
import TTTabs from "@components/TTTabs";
import TimeUtils from "@utils/TimeUtils";
import ImageSelector from "@components/ImageSelector";
import TLogo from "@assets/T.svg";
import AddIcon from "@mui/icons-material/Add";
import TTChipButton from "@components/TTChipButton";
import { type Image } from "@services/images";
import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import clsx from "clsx";
import TTIconButton from "@components/TTIconButton";
import ToolTip from "@components/ToolTip";

type TripProfileProps = {
  uri?: string;
};

const TripProfile = ({ uri = "/" }: TripProfileProps) => {
  // window
  const isMobile = useIsMobile();
  // snackbar
  const { enqueueSnackbar } = useSnackbar();
  // nav tab
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // trip basic
  const [tripBasic, setTripBasic] = useState<Trip | undefined>();
  // trip images
  const [images, setImages] = useState<Image[]>([]);
  // trip title
  const [title, setTitle] = useState<string>("");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  // trip description
  const [description, setDescription] = useState<string | undefined>();
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { tripId } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const correctUri = uri.length > 1 ? uri : "";

  const maxImageCount = 4;
  const isMaxImageCountReached = images.length === maxImageCount;

  // render trip on initiation
  useEffect(() => {
    const initTrip = async () => {
      if (tripId && token) {
        getTripImages();

        // get trip basic
        let tripBasic = await tripsService.getMyTripById(Number(tripId), token);
        setTripBasic(tripBasic);

        setTitle(tripBasic.title);
        setDescription(tripBasic.description);
      }
    };
    initTrip();
  }, [tripId, token]);

  const navTabs = [
    {
      name: "Overview",
      label: "Overview",
      to: `${correctUri}/trip/${tripId}`,
    },
  ] as NavTab[];

  // title
  const updateTitle = async () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === tripBasic?.title || trimmedTitle.length > 50) {
      if (trimmedTitle.length > 50) {
        enqueueSnackbar("Trip title is too long.", { variant: "error" });
      }
      setIsEditingTitle(false);
      setTitle(tripBasic!.title);
      return;
    }

    if (tripBasic && token) {
      let tripPatch = { title: trimmedTitle } as TripPatch;
      tripPatch = await tripsService.patchTrip(tripBasic?.id, tripPatch, token);
      setTripBasic({ ...tripBasic, title: tripPatch.title ?? title });
      setIsEditingTitle(false);

      enqueueSnackbar("Successfully updated trip title.", {
        variant: "success",
      });
    }
  };

  const handleTitleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      updateTitle();
    }
  };

  // description
  const helperText = "What makes this trip special?\nTell others about it!";

  const handleDescriptionClose = () => {
    setIsEditingDescription(false);
  };

  const handleDescriptionUpdate = async () => {
    const trimmedDescription = description?.trim();
    if (tripBasic?.description === trimmedDescription) {
      setIsEditingDescription(false);
      setDescription(tripBasic?.description);
      return;
    }

    if (tripBasic && token) {
      let tripPatch = { description: trimmedDescription } as TripPatch;
      tripPatch = await tripsService.patchTrip(tripBasic?.id, tripPatch, token);
      setTripBasic({ ...tripBasic, description: tripPatch.description });
      setIsEditingDescription(false);

      enqueueSnackbar("Successfully updated trip summary.", {
        variant: "success",
      });
    }
  };

  // images

  const getTripImages = async () => {
    if (token) {
      // get trip image
      let tripImages = await tripsService.getImagesByTripId(
        Number(tripId),
        token
      );
      setImages(tripImages);
    }
  };

  const deleteTripImage = async (index: number) => {
    if (tripBasic && token) {
      try {
        let imageId = images[index].id;
        await tripsService.deleteTripImage(tripBasic.id, imageId, token);

        let updatedImages = images.filter((i) => i.id !== imageId);
        setImages(updatedImages);

        enqueueSnackbar("Successfully detached image", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  // components

  const NameComponent = (
    <React.Fragment>
      {isEditingTitle ? (
        <FormControl variant="outlined">
          <OutlinedInput
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            endAdornment={`${title.length}/50`}
            onBlur={updateTitle}
            onKeyDown={(e) => handleTitleKeyDown(e)}
            autoFocus
            size="small"
            sx={{ ml: -1 }}
          />
        </FormControl>
      ) : (
        <Button
          className="trip-profile-title-button"
          onClick={() => setIsEditingTitle(true)}
        >
          <Typography className="trip-profile-title">
            {tripBasic?.title}
          </Typography>
        </Button>
      )}
      <Typography className="trip-profile-num-days">
        {TimeUtils.formatDays(tripBasic?.numDays ?? 0)}
      </Typography>
    </React.Fragment>
  );

  const DescriptionComponent = (
    <React.Fragment>
      <Typography mb={".5rem"}>Summary</Typography>
      {isEditingDescription ? (
        <React.Fragment>
          <DescriptionTextField
            value={description ?? ""}
            setValue={setDescription}
            placeholder={helperText}
          />
          <Box className="trip-profile-description-edit-button-box">
            <TTButton
              label="cancel"
              variant="text"
              color="primary"
              onClick={handleDescriptionClose}
            />
            <TTButton
              label="update"
              color="primary"
              onClick={handleDescriptionUpdate}
            />
          </Box>
        </React.Fragment>
      ) : Boolean(description) ? (
        <Button
          className="trip-profile-description-button"
          onClick={() => setIsEditingDescription(true)}
        >
          <Typography className="trip-profile-text">
            {tripBasic?.description}
          </Typography>
        </Button>
      ) : (
        <Button
          className="trip-profile-description-empty-button"
          onClick={() => setIsEditingDescription(true)}
          fullWidth
        >
          <Typography className="trip-profile-text">{helperText}</Typography>
        </Button>
      )}
    </React.Fragment>
  );

  return (
    <Box className="trip-profile-box">
      {false ? (
        <></>
      ) : (
        <React.Fragment>
          {/* map */}
          <Box className="trip-profile-map-box">
            <Map correctionBias={10} correctionDirection="E" />

            {/* content */}
            <Box
              className={clsx("trip-profile-content-box", isMobile && "mobile")}
            >
              {/* header */}
              <Box className="trip-profile-header-box">
                {/* profile images  */}
                <Box className="trip-profile-image-box">
                  {images.length > 0 ? (
                    <PreloadCarousel
                      images={images}
                      height={isMobile ? 180 : 200}
                      onDelete={deleteTripImage}
                    />
                  ) : (
                    <Box
                      bgcolor="primary.main"
                      display="flex"
                      justifyContent="center"
                    >
                      {/* image when no images available */}
                      <img src={TLogo} height={isMobile ? 180 : 200} />
                    </Box>
                  )}

                  {/* image selector */}
                  <Box position="absolute" right={10} bottom={10}>
                    <ImageSelector
                      tripId={tripBasic?.id}
                      imageIds={images.map((image) => image.id)}
                      disabled={isMaxImageCountReached}
                      setIsParentUpdated={getTripImages}
                    >
                      <TTChipButton
                        className="trip-profile-image-chip-button"
                        label={`${images.length}/${maxImageCount}`}
                        size="small"
                        icon={isMaxImageCountReached ? undefined : <AddIcon />}
                      />
                    </ImageSelector>
                  </Box>
                </Box>

                {/* name */}
                <Box className="trip-profile-title-box">{NameComponent}</Box>

                {/* section */}
                <Box className="trip-profile-nav-tab-box">
                  <TTTabs
                    navTabs={navTabs}
                    navTabValue={navTabValue}
                    setNavTabValue={setNavTabValue}
                  />

                  {/* add day button */}
                    <ToolTip title="Add new day" offsetY={-8}>
                  <Box className="trip-profile-nav-tab-button-box">
                      <TTIconButton size="small" className="trip-profile-add-day-button" onClick={() => {}}>
                        <AddIcon />
                      </TTIconButton>
                  </Box>
                    </ToolTip>
                </Box>
              </Box>

              {/* description */}
              <Box className="trip-profile-description-box">
                {DescriptionComponent}
              </Box>
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default TripProfile;
