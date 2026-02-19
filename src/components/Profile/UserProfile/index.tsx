import { Avatar, Box, Chip, Grid, Typography } from "@mui/material";
import { usersService, type UserProfileBasic } from "@services/users";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TTButton from "@components/TTButton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { FaCrown } from "react-icons/fa";
import ToolTip from "@components/ToolTip";
import ImageSelector from "@components/ImageSelector";
import { setUser as setUserSlice } from "@redux/userSlice";
import React, { useEffect, useState } from "react";
import { tripsService, type Trip } from "@services/trips";
import TripCard from "@components/Cards/TripCard";
import { useNavigate } from "react-router";
import FollowerChip from "./FollowerChip";
import clsx from "clsx";
import "./index.scss";

type UserProfileProps = {
  user?: UserProfileBasic;
  setUser?: React.Dispatch<React.SetStateAction<UserProfileBasic | undefined>>;
};

const UserProfile = ({ user, setUser }: UserProfileProps) => {
  // window
  const isMobile = useIsMobile();
  // redux
  const dispatch = useDispatch();
  // user
  const _user = useSelector((state: RootState) => state.user);
  // top 5 bookmarked trips
  const [topTrips, setTopTrips] = useState<Trip[]>([]);

  // others
  const navigate = useNavigate();
  const hasRole = user?.isWriter || user?.isAdmin;
  const isMe = user?.id !== undefined && user?.id === _user.id;

  const _numTrips = user?.numTrips ?? 0;
  const _numBookmarks = user?.numBookmarks ?? 0;

  useEffect(() => {
    const initTopTrips = async () => {
      if (!user) return;

      const topTrips = await tripsService.getTripsByParams({
        createdBy: user,
        tripOrderByEnum: "mostBookmarked",
        limit: 5,
      });

      setTopTrips(topTrips.results);
    };

    initTopTrips();
  }, [user?.id]);

  // async functions

  const asyncUpdateUser = (partialUser: Partial<UserProfileBasic>) => {
    if (setUser && user) setUser((prev) => ({ ...prev!, ...partialUser }));
  };

  const asyncUpdateTopTrip = (trip: Trip) => {
    let _topTrips = [...topTrips];
    let tripIndex = _topTrips.findIndex((t) => t.id === trip.id);
    _topTrips[tripIndex] = trip;

    setTopTrips(_topTrips);

    const delta = trip.isBookmarked ? 1 : -1;
    asyncUpdateUser({ numBookmarks: user!.numBookmarks + delta });
  };

  // handle functions

  const handleUserIdCopy = async (e: React.MouseEvent<HTMLElement>) => {
    if (!user?.userId) return;
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(user.userId);
      enqueueSnackbar("Copied user id to clipboard!", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const updateUserPicture = async (imageId: number) => {
    const imageUrl = await usersService.updateUserPicture(imageId);

    dispatch(setUserSlice({ picture: imageUrl }));
    asyncUpdateUser({ picture: imageUrl });
  };

  const handleFollow = async () => {
    if (!user) return;

    try {
      const isFollowing = user?.isFollowing;
      const delta = isFollowing ? -1 : 1;

      isFollowing
        ? await usersService.unfollowUser(user.id)
        : await usersService.followUser(user.id);
      asyncUpdateUser({
        isFollowing: !isFollowing,
        followerCount: user.followerCount + delta,
      });

      const snackbarMessage = isFollowing
        ? "Unfollowed the user."
        : "Now following the user.";
      enqueueSnackbar(snackbarMessage, { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  if (!user) return;

  return (
    <Box className={clsx("column user-profile", isMobile && "mobile")}>
      {/* header */}
      <Box className="row start header">
        {/* avatar */}
        <Box className="avatar-box">
          <Avatar
            className={clsx("avatar", isMobile && "mobile")}
            alt={user?.username}
            src={user?.picture}
            slotProps={{ img: { loading: "lazy" } }}
          />

          {isMe ? (
            <Box className={clsx("avatar-overlay", isMobile && "mobile")}>
              <ImageSelector asyncAddImage={updateUserPicture}>
                <ToolTip title="Edit Picture" offsetY={-8}>
                  <EditOutlinedIcon />
                </ToolTip>
              </ImageSelector>
            </Box>
          ) : undefined}
        </Box>
        <Box className="column">
          <Typography
            className={clsx("username", isMobile && "mobile")}
            variant={isMobile ? "body1" : "h5"}
          >
            {user?.username}
          </Typography>
          {/* user role */}
          {hasRole ? (
            <Box className="row wrap">
              {user?.isAdmin ? (
                <Chip
                  color="region"
                  size="small"
                  icon={<FaCrown />}
                  label="Admin"
                />
              ) : undefined}
              {user?.isWriter ? (
                <Chip color="success" size="small" label="Sermon Writer" />
              ) : undefined}
            </Box>
          ) : undefined}
        </Box>
      </Box>

      <Box className={clsx("column container", isMobile && "mobile")}>
        {/* actions */}
        <Box className={clsx("row actions", isMobile && "mobile")}>
          {/* auth id */}
          <TTButton
            size="small"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={handleUserIdCopy}
          >
            Clip Auth0 ID
          </TTButton>
          {/* following */}
          {!isMe ? (
            <TTButton
              startIcon={
                user.isFollowing ? (
                  <PersonRemoveAlt1Icon />
                ) : (
                  <PersonAddAltIcon />
                )
              }
              size="small"
              color="utility"
              onClick={handleFollow}
            >
              {user.isFollowing ? "Followed" : "Follow"}
            </TTButton>
          ) : undefined}
        </Box>

        {/* auth0 id */}
        <Box className="row">
          <FollowerChip user={user} />
        </Box>

        {/* stats */}
        <Grid className="stats" container columns={{ xs: 12 }} spacing={1}>
          <Grid size={6}>
            <Box className="column center">
              <Typography className="number" variant="h3">
                {user?.numTrips}
              </Typography>
              <Typography variant="h6">
                {_numTrips === 1 ? "Trip" : "Trips"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={6}>
            <Box className="column center">
              <Typography className="number" variant="h3">
                {user?.numBookmarks}
              </Typography>
              <Typography variant="h6">
                {_numBookmarks === 1 ? "Bookmark" : "Bookmarks"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* top 5 trips - order by bookmarkCount */}
        <Typography className="caption">Top 5 Bookmarked Trips</Typography>
        <Box className="top-trip-box">
          {topTrips.length > 0 ? (
            topTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                readonly
                onClick={() => navigate(`/trip/${trip.id}`)}
                asyncUpdateTrip={asyncUpdateTopTrip}
              />
            ))
          ) : (
            <Typography>No trips published.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
