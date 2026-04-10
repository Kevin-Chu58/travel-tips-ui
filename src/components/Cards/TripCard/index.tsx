import {
  Box,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
// import ShareIcon from "@mui/icons-material/Share";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import LockIcon from "@mui/icons-material/Lock";
import { StringUtils } from "@utils/StringUtils";
import type { UtilityItem } from "@constants/Types";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import UserAvatar from "@components/UserAvatar";
import { useNavToProfile } from "@hooks/useNavToProfile";
import DeleteTripForm from "@components/Forms/DeleteTripForm";
import clsx from "clsx";
import "./index.scss";

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
    useState<HTMLButtonElement | null>(null);
  // open form status
  const [openDeleteTrip, setOpenDeleteTrip] = useState<boolean>(false);
  // nav to profile
  const navToProfile = useNavToProfile(trip.createdBy);
  // others
  const _numBookmarks = trip?.bookmarkCount;
  const _bookmarkText =
    _numBookmarks > 0
      ? ` • ${trip.bookmarkCount} bookmark${_numBookmarks === 1 ? "" : "s"}`
      : "";

  // rerender on trip isPublic
  useEffect(() => {}, [trip.isPublic]);

  const handleClick = () => {
    if (!trip.isHidden) onClick();
  };

  const handleUsernameClick = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    navToProfile();
  };

  const handleVisibilityTripClick = async (
    e: React.MouseEvent<HTMLLIElement>,
  ) => {
    e.stopPropagation();

    if (!trip) return;

    try {
      await tripsService.patchTripIsPublic([trip.id], !trip.isPublic);
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
  };

  const handleBookmarkClick = async (
    e: React.MouseEvent<HTMLLIElement | HTMLButtonElement>,
  ) => {
    e.stopPropagation();

    if (!trip) return;

    try {
      trip.isBookmarked
        ? await tripsService.removeBookmark(trip.id)
        : await tripsService.addBookmark(trip.id);

      // triggers direct UI update on chip
      setPopoverAnchorEl(null);

      if (asyncUpdateTrip) {
        const delta = trip.isBookmarked ? -1 : 1;
        asyncUpdateTrip({
          ...trip,
          isBookmarked: !trip.isBookmarked,
          bookmarkCount: trip.bookmarkCount + delta,
        } as Trip);
      }
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleHiddenTripClick = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();

    if (!trip) return;

    try {
      await tripsService.patchTripIsHidden([trip.id], !trip.isHidden);
      if (asyncDeleteTrip) asyncDeleteTrip(trip);

      enqueueSnackbar(
        `Successfully ${trip.isHidden ? "unarchived" : "archived"} trip.`,
        { variant: "success" },
      );
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
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

  const handleDeleteTrip = async () => {
    if (asyncDeleteTrip) asyncDeleteTrip(trip);
  };

  // buttons

  // TODO: button - share
  // const shareButton = (
  //   <MenuItem key="share" onClick={(e) => e.stopPropagation()}>
  //     <ListItemIcon>
  //       <ShareIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Share" />
  //   </MenuItem>
  // );

  // button - public/private
  const visibilityButton = (
    <MenuItem key="visibility" onClick={(e) => handleVisibilityTripClick(e)}>
      <ListItemIcon>
        {trip.isPublic ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </ListItemIcon>
      <ListItemText primary={`Set ${trip.isPublic ? "Private" : "Public"}`} />
    </MenuItem>
  );

  // button - bookmark
  const bookmarkButton = (
    <MenuItem key="bookmark" onClick={(e) => handleBookmarkClick(e)}>
      <ListItemIcon>
        {trip.isBookmarked ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
      </ListItemIcon>
      <ListItemText
        primary={`${trip.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}`}
      />
    </MenuItem>
  );

  // button - archive
  const archiveButton = (
    <MenuItem
      key="archive"
      className="error"
      onClick={(e) => handleHiddenTripClick(e)}
    >
      <ListItemIcon>
        <ArchiveIcon />
      </ListItemIcon>
      <ListItemText primary="Archive" />
    </MenuItem>
  );

  // button - unarchive
  const unarchiveButton = (
    <MenuItem key="unarchive" onClick={(e) => handleHiddenTripClick(e)}>
      <ListItemIcon>
        <UnarchiveIcon />
      </ListItemIcon>
      <ListItemText primary="Unarchive" />
    </MenuItem>
  );

  const deleteButton = (
    <MenuItem
      key="delete"
      className="error"
      onClick={() => setOpenDeleteTrip(true)}
    >
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Delete" />
    </MenuItem>
  );

  const menuButtonList = [
    // {
    //   content: shareButton,
    //   condition: trip.isPublic && !trip.isHidden,
    // },
    {
      content: visibilityButton,
      condition: !readonly && !trip.isHidden,
    },
    {
      content: bookmarkButton,
      condition: trip.isPublic && !trip.isHidden,
    },
    {
      content: archiveButton,
      condition: !readonly && !trip.isHidden,
    },
    {
      content: unarchiveButton,
      condition: !readonly && trip.isHidden,
    },
    {
      content: deleteButton,
      condition: !readonly && trip.isHidden,
    },
  ] as UtilityItem[];

  return (
    <Box className="trip-card-box" onClick={handleClick}>
      {/* image container */}
      <Box className="image-box">
        {/* images */}
        {trip.images && trip.images.length > 0 ? (
          <PreloadCarousel
            images={trip.images}
            index={imageIndex}
            setIndex={setImageIndex}
            readonly
            circularBorder
          />
        ) : (
          <img src={TLogo} className="image" />
        )}

        {/* creator info */}
        <Box className="image-creator-info-box">
          <UserAvatar user={trip.createdBy} highlight />
          <Chip
            className="username-chip"
            label={
              <Typography className="username" onClick={handleUsernameClick}>
                {trip.createdBy.username}
              </Typography>
            }
            size="small"
          />
        </Box>

        <Box
          className={clsx("bookmark-box", trip.isBookmarked && "bookmarked")}
        >
          <IconButton onClick={(e) => handleBookmarkClick(e)}>
            <BookmarkIcon />
          </IconButton>
        </Box>
      </Box>

      <Box className="info-box">
        {/* title */}
        <Box display="flex">
          <Typography fontSize="1.2rem" className="title">
            {trip.title}
            <span className="helper">#{trip.id}</span>
          </Typography>

          <Box className="menu-button-box">
            <IconButton size="small" onClick={(e) => handleOpenPopover(e)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {/* button menu */}
        <Menu
          className="TT-menu flex"
          anchorEl={popoverAnchorEl}
          open={Boolean(popoverAnchorEl)}
          onClose={(e) => handleClosePopover(e)}
        >
          {menuButtonList.map((button) => button.condition && button.content)}
        </Menu>

        {/* number of days & bookmark count */}
        <Typography className="num-days" variant="body2">
          {TimeUtils.formatDays(trip.numDays ?? 0)} {_bookmarkText}
        </Typography>
      </Box>

      <Box className="row">
        {/* visibility tag */}
        {!readonly ? (
          <Chip
            icon={trip.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
            label={trip.isPublic ? "public" : "private"}
            size="small"
          />
        ) : undefined}

        {/* readonly tag - caused by expired membership */}
        {trip.isReadonly && !readonly ? (
          <Chip icon={<LockIcon />} label="read-only" size="small" />
        ) : undefined}
      </Box>

      <Box className="chip-container">
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

      {/* forms */}
      {openDeleteTrip ? (
        <DeleteTripForm
          open={openDeleteTrip}
          onClose={() => setOpenDeleteTrip(false)}
          trip={trip}
          asyncDeleteTrip={handleDeleteTrip}
        />
      ) : undefined}
    </Box>
  );
};

export default TripCard;
