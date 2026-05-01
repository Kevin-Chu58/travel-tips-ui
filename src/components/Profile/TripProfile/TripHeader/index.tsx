import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import { useIsMobile } from "@hooks/useIsMobile";
import type { Image } from "@services/images";
import { tripsService, type Trip } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import TLogo from "@assets/T.svg";
import UserAvatar from "@components/UserAvatar";
import { Box, Chip, Typography } from "@mui/material";
import ImageForm from "@components/Forms/ImageForm";
import { useNavToProfile } from "@hooks/useNavToProfile";
import AddIcon from "@mui/icons-material/Add";
import ToolTip from "@components/ToolTip";
import TTChipButton from "@components/TTChipButton";
import React from "react";

// lazy load
const ImageSelector = React.lazy(() => import("@components/ImageSelector"));

type TripHeaderProps = {
  trip: Trip | undefined;
  readonly: boolean;
};

const TripHeader = ({ trip, readonly }: TripHeaderProps) => {
  // window
  const isMobile = useIsMobile();
  // open image form
  const [openImageForm, setOpenImageForm] = useState<number | undefined>();
  // images
  const [images, setImages] = useState<Image[]>([]);
  // which image is displaying
  const [imageIndex, setImageIndex] = useState<number>(0);
  const image = useMemo(
    () => (openImageForm !== undefined ? images[openImageForm] : undefined),
    [images, openImageForm],
  ); // current image in images
  // nav to profile
  const navToProfile = useNavToProfile(trip?.createdBy);

  const imageIds = useMemo(() => images.map((image) => image.id), [images]);
  const maxImageCount = 4;
  const isMaxImageCountReached = images.length === maxImageCount;

  const addIcon = useMemo(
    () => (isMaxImageCountReached || readonly ? undefined : <AddIcon />),
    [isMaxImageCountReached, readonly],
  );

  // use effects

  useEffect(() => {
    if (!trip) return;

    setImages(trip.images ?? []);
  }, [trip]);

  // async functions

  const asyncAddImage = useCallback(
    async (imageId: number) => {
      if (trip) {
        const image = await tripsService.postTripImage(
          Number(trip.id),
          imageId,
        );
        setImages((prev) => [...prev, image]);
      }
    },
    [trip],
  );

  const asyncDetachImage = useCallback(
    (imageId: number) => {
      let _images = images.filter((i) => i.id !== imageId);
      setImages([..._images]);
    },
    [images],
  );

  const asyncUpdateImage = useCallback(
    (image: Image) => {
      var _images = [...images];
      let imageIndex = images.findIndex((img) => img.id === image.id);
      images[imageIndex] = image;

      setImages(_images);
    },
    [images, setImages],
  );

  // handle functions

  const handleDeleteTripImage = useCallback(
    async (index: number) => {
      if (trip?.id) {
        try {
          let imageId = images[index].id;
          await tripsService.deleteTripImage(trip.id, imageId);

          asyncDetachImage(imageId);

          enqueueSnackbar("Successfully detached image.", {
            variant: "success",
          });
        } catch (e) {
          if (e instanceof Error)
            enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    },
    [trip, images, asyncDetachImage, enqueueSnackbar],
  );

  const handleOpenImageForm = useCallback(
    () => setOpenImageForm(imageIndex),
    [imageIndex, setOpenImageForm],
  );

  const handleCloseImageForm = useCallback(
    () => setOpenImageForm(undefined),
    [setOpenImageForm],
  );

  const handleUsernameClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      navToProfile();
    },
    [navToProfile],
  );

  return (
    <Box className="image-box">
      {images.length > 0 ? (
        <PreloadCarousel
          images={images}
          index={imageIndex}
          setIndex={setImageIndex}
          height={isMobile ? 200 : 240}
          onDelete={handleDeleteTripImage}
          readonly={readonly}
          onClick={handleOpenImageForm}
          innerButtons
          aspectRatioType="trip-profile"
        />
      ) : (
        <Box className="default-image-box">
          {/* image when no images available */}
          <img src={TLogo} height={isMobile ? 180 : 200} />
        </Box>
      )}

      {/* creator avatar and username */}
      {trip ? (
        <Box className="row createdBy-box">
          <UserAvatar user={trip.createdBy} />
          <Chip
            label={
              <Typography className="username" onClick={handleUsernameClick}>
                {trip.createdBy.username}
              </Typography>
            }
            size="small"
            className="username-chip"
          />
        </Box>
      ) : undefined}

      {/* image selector */}
      <Box className="image-selector-box">
        {!readonly ? (
          <ImageSelector
            imageIds={imageIds}
            disabled={isMaxImageCountReached}
            asyncAddImage={asyncAddImage}
            readonly={readonly}
          >
            <ToolTip title="Add Images" offsetY={-8}>
              <TTChipButton
                label={`${images.length}/${maxImageCount}`}
                color="utility"
                size="small"
                icon={addIcon}
              />
            </ToolTip>
          </ImageSelector>
        ) : images.length > 0 ? (
          <TTChipButton
            label={`${imageIndex + 1}/${images.length}`}
            color="utility"
            size="small"
            icon={addIcon}
          />
        ) : undefined}
      </Box>

      {Boolean(image) && (
        <ImageForm
          image={image}
          onClose={handleCloseImageForm}
          asyncUpdateImage={asyncUpdateImage}
          asyncDeleteImage={asyncDetachImage}
          readonly={readonly}
        />
      )}
    </Box>
  );
};

export default TripHeader;
