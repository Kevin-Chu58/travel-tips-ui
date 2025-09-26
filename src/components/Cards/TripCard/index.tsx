import { Avatar, Box, Chip, Typography } from "@mui/material";
import { tripsService, type Trip } from "@services/trips";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TimeUtils from "@utils/TimeUtils";
import TLogo from "@assets/T.svg";
import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import { useEffect, useState } from "react";
import type { Image } from "@services/images";
import DeleteIcon from "@mui/icons-material/Delete";
import { enqueueSnackbar } from "notistack";
import "./index.scss";

type TripCardProps = {
  trip: Trip;
  readonly?: boolean;
  onClick: () => void;
  setIsParentUpdated?: () => void;
};

const TripCard = ({
  trip,
  readonly = false,
  onClick,
  setIsParentUpdated,
}: TripCardProps) => {
  // trip images
  const [images, setImages] = useState<Image[]>([]);
  const [imageIndex, setImageIndex] = useState<number>(0);
  // others
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const initTripImages = async () => {
      if (trip && trip.isPublic) {
        // get trip image
        let tripImages = await tripsService.getImagesByTripId(trip.id);
        setImages(tripImages);
      }
    };
    initTripImages();
  }, [trip]);

  const handleDeleteTripClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (trip) {
      try {
        await tripsService.patchTripIsHidden([trip.id], true);
        if (setIsParentUpdated) setIsParentUpdated();

        enqueueSnackbar("Successfully deleted trip.", { variant: "success" });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  return (
    <Box
      className="trip-card-box"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* image container */}
      <Box className="trip-card-image-box">
        {/* images */}
        {images.length > 0 ? (
          <PreloadCarousel
            images={images}
            index={imageIndex}
            setIndex={setImageIndex}
            readonly
            height={200}
          />
        ) : (
          <img src={TLogo} className="trip-card-image" />
        )}

        {/* creator info */}
        <Box className="trip-card-image-creator-info-box">
          <Avatar className="trip-card-avatar" />

          <Chip
            label={
              <Typography className="trip-card-username">
                {trip.createdBy.username}
              </Typography>
            }
            size="small"
            className="trip-card-username-chip"
          />
        </Box>
      </Box>

      <Box className="trip-card-info-box">
        {/* title */}
        <Typography fontSize="1.1rem" className="trip-card-title">
          {trip.title}
        </Typography>

        {/* number of days */}
        <Typography className="trip-card-num-days">
          {TimeUtils.formatDays(trip.numDays ?? 0)}
        </Typography>
      </Box>

      {!readonly ? (
        <Box display="flex" my={0.5} gap=".5rem">
          <Chip
            icon={trip.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
            label={trip.isPublic ? "public" : "private"}
            size="small"
          />
          {isHovered ? (
            <Chip
              className="trip-card-delete-chip"
              icon={<DeleteIcon />}
              label="delete"
              size="small"
              onClick={(e) => handleDeleteTripClick(e)}
            />
          ) : undefined}
        </Box>
      ) : undefined}
    </Box>
  );
};

export default TripCard;
