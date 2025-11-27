import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { tripsService, type Trip } from "@services/trips";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TimeUtils from "@utils/TimeUtils";
import TLogo from "@assets/T.svg";
import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { enqueueSnackbar } from "notistack";
import "./index.scss";

type TripCardProps = {
  trip: Trip;
  readonly?: boolean;
  onClick: () => void;
  syncDeleteTrip?: (state: Trip) => void;
};

const TripCard = ({
  trip,
  readonly = false,
  onClick,
  syncDeleteTrip,
}: TripCardProps) => {
  // trip images
  const [imageIndex, setImageIndex] = useState<number>(0);
  // popover
  const [popoverAnchorEl, setPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const handleDeleteTripClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (trip) {
      try {
        await tripsService.patchTripIsHidden([trip.id], true);
        if (syncDeleteTrip) syncDeleteTrip(trip);

        enqueueSnackbar("Successfully deleted trip.", { variant: "success" });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handleOpenPopover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setPopoverAnchorEl(e.currentTarget);
  };

  const handleClosePopover = (e: unknown) => {
    if (e && typeof e === "object" && "stopPropagation" in e) {
      (e as React.MouseEvent<HTMLElement>).stopPropagation();
    }

    setPopoverAnchorEl(null);
  };

  return (
    <Box className="trip-card-box" onClick={onClick}>
      {/* image container */}
      <Box className="trip-card-image-box">
        {/* images */}
        {trip.images && trip.images.length > 0 ? (
          <PreloadCarousel
            images={trip.images}
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
        <Box display="flex">
          <Typography fontSize="1.1rem" className="trip-card-title">
            {trip.title}
          </Typography>

          <Box sx={{ ml: "auto" }}>
            <IconButton size="small" onClick={(e) => handleOpenPopover(e)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Popover
          anchorEl={popoverAnchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(popoverAnchorEl)}
          onClose={(e) => handleClosePopover(e)}
        >
          <List>
            {/* button - delete */}
            {!readonly ? (
              <ListItemButton onClick={(e) => handleDeleteTripClick(e)}>
                <ListItemIcon className="image-selector-list-item-error-icon">
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "var(--error-main)" }}
                  primary="Delete"
                />
              </ListItemButton>
            ) : undefined}
          </List>
        </Popover>

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
        </Box>
      ) : undefined}
    </Box>
  );
};

export default TripCard;
