import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { tripsService, type Trip } from "@services/trips";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TimeUtils from "@utils/TimeUtils";
import TLogo from "@assets/T.svg";
import PreloadCarousel from "@components/Carousel/PreloadCarousel";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { enqueueSnackbar } from "notistack";
import { RegionUtils } from "@utils/RegionUtils";
import ShareIcon from "@mui/icons-material/Share";
import "./index.scss";
import { StringUtils } from "@utils/StringUtils";

type TripCardProps = {
  trip: Trip;
  readonly?: boolean;
  onClick: () => void;
  asyncUpdateTrip?: (state: Trip) => void;
  asyncDeleteTrip?: (state: Trip) => void;
};

const TripCard = ({
  trip,
  readonly = false,
  onClick,
  asyncUpdateTrip,
  asyncDeleteTrip,
}: TripCardProps) => {
  // trip images
  const [imageIndex, setImageIndex] = useState<number>(0);
  // popover
  const [popoverAnchorEl, setPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  // rerender on trip isPublic
  useEffect(() => {}, [trip.isPublic]);

  const handleVisibilityTripClick = async (
    e: React.MouseEvent<HTMLLIElement>
  ) => {
    e.stopPropagation();

    if (trip) {
      try {
        tripsService.patchTripIsPublic([trip.id], !trip.isPublic);
        trip.isPublic = !trip.isPublic;
        if (asyncUpdateTrip) asyncUpdateTrip(trip);

        // triggers direct UI update on chip
        setPopoverAnchorEl(null);

        enqueueSnackbar("Successfully set trip visibility.", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handleDeleteTripClick = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();

    if (trip) {
      try {
        await tripsService.patchTripIsHidden([trip.id], true);
        if (asyncDeleteTrip) asyncDeleteTrip(trip);

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
            circularBorder
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
          <Typography fontSize="1.2rem" className="trip-card-title">
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
            {/* TODO: button - share */}
            <MenuItem>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="Share" />
            </MenuItem>
            {!readonly ? (
              <React.Fragment>
                {/* button - public/private */}
                <MenuItem onClick={(e) => handleVisibilityTripClick(e)}>
                  <ListItemIcon>
                    {trip.isPublic ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={`Set ${trip.isPublic ? "Private" : "Public"}`}
                  />
                </MenuItem>
                {/* button - delete */}
                <MenuItem
                  className="trip-card-error-menu-item"
                  onClick={(e) => handleDeleteTripClick(e)}
                >
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </MenuItem>
              </React.Fragment>
            ) : undefined}
          </List>
        </Popover>

        {/* number of days */}
        <Typography className="trip-card-num-days">
          {TimeUtils.formatDays(trip.numDays ?? 0)}
        </Typography>
      </Box>

      {/* visibility tag */}
      {!readonly ? (
        <Chip
          icon={trip.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
          label={trip.isPublic ? "public" : "private"}
          size="small"
        />
      ) : undefined}
      
      <Box className="trip-card-chip-container">
        {/* region tag */}
        {trip.region ? (
          <Chip
            color="region"
            size="small"
            label={RegionUtils.getRegionAddress(trip.region)}
          />
        ) : undefined}
        {/* budget tag */}
        {trip.budget ? (
          <Chip
            color="success"
            size="small"
            label={StringUtils.getBudgetStr(trip.budget)}
          />
        ) : undefined}
      </Box>
    </Box>
  );
};

export default TripCard;
