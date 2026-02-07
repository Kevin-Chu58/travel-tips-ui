import { Avatar, Box, Chip, Typography } from "@mui/material";
import { usersService, type UserBasic } from "@services/users";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TTButton from "@components/TTButton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { FaCrown } from "react-icons/fa";
import ToolTip from "@components/ToolTip";
import ImageSelector from "@components/ImageSelector";
import { setUser as setUserSlice } from "@redux/userSlice";
import React from "react";
import clsx from "clsx";
import "./index.scss";

type UserProfileProps = {
  user?: UserBasic;
  setUser?: React.Dispatch<React.SetStateAction<UserBasic>>;
};

const UserProfile = ({ user, setUser }: UserProfileProps) => {
  // window
  const isMobile = useIsMobile();
  // redux
  const dispatch = useDispatch();
  // user
  const _user = useSelector((state: RootState) => state.user);
  // others
  const hasRole = user?.isWriter || user?.isAdmin;
  const isMe = user?.id !== undefined && user?.id === _user.id;
  const pictureSrc = isMe ? _user.picture : user?.picture;

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
    if (setUser) setUser((prev) => ({ ...prev, picture: imageUrl }));
  };

  return (
    <Box className={clsx("column user-profile", isMobile && "mobile")}>
      {/* header */}
      <Box className="row start header">
        {/* avatar */}
        <Box className="avatar-box">
          <Avatar
            className={clsx("avatar", isMobile && "mobile")}
            alt={user?.username}
            src={pictureSrc ?? undefined}
          />

          <Box className={clsx("avatar-overlay", isMobile && "mobile")}>
            <ImageSelector asyncAddImage={updateUserPicture}>
              <ToolTip title="Edit Picture" offsetY={-8}>
                <EditOutlinedIcon />
              </ToolTip>
            </ImageSelector>
          </Box>
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
        <Box className="row actions">
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
              startIcon={<PersonOutlineOutlinedIcon />}
              size="small"
              color="utility"
            >
              Follow
            </TTButton>
          ) : undefined}
        </Box>

        {/* auth0 id */}
        <Box className="row">
          <Chip
            color="utility"
            icon={<PersonIcon />}
            label={`100 followers • 10 following`}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
