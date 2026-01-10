import type { UserSimple } from "@services/users";
import GroupIcon from "@mui/icons-material/Group";
import FormBase from "../FormBase";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import UserCard from "@components/Cards/UserCard";
import TTButton from "@components/TTButton";
import { tripsService, type Trip } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import TTTextField from "@components/TTTextField";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import GroupOffIcon from "@mui/icons-material/GroupOff";
import clsx from "clsx";
import "./index.scss";

type TripShareFormProps = {
  open: boolean;
  onClose: () => void;
  tripBasicRef?: React.RefObject<Trip | undefined>;
  sharedUsers: UserSimple[];
  asyncTrip: () => void;
};

const TripShareForm = ({
  open,
  onClose,
  tripBasicRef,
  sharedUsers,
  asyncTrip,
}: TripShareFormProps) => {
  // window
  const isMobile = useIsMobile();
  // input
  const [value, setValue] = useState<string>("");

  // handle

  const handleClose = () => {
    onClose();
    setValue("");
  };

  const handleShareClick = async () => {
    if (!tripBasicRef?.current) return;
    if (!Boolean(value)) return;

    try {
      const newShareWith = await tripsService.shareTripWithUser(
        tripBasicRef.current.id,
        value
      );

      tripBasicRef.current.sharedUsers.push(newShareWith);
      asyncTrip();

      enqueueSnackbar("Share trip with the user.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleUnshareClick = async (userId: string) => {
    if (!tripBasicRef?.current) return;

    try {
      await tripsService.unshareTripWithUser(tripBasicRef.current.id, userId);

      tripBasicRef.current.sharedUsers =
        tripBasicRef.current.sharedUsers.filter(
          (user) => user.userId != userId
        );
      asyncTrip();

      enqueueSnackbar("Unshare trip with the user.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleUnshareAllClick = async () => {
    if (!tripBasicRef?.current) return;

    try {
      await tripsService.unshareTripWithAll(tripBasicRef.current.id);

      tripBasicRef.current.sharedUsers = [];
      asyncTrip();

      enqueueSnackbar("Unshare trip with all users.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <FormBase
      open={open}
      onClose={handleClose}
      className="trip-share-form"
      width="55vw"
      height={isMobile ? "80vh" : "40vh"}
      maxHeight={isMobile ? "80vh" : undefined}
      panel
      title={
        <React.Fragment>
          <GroupIcon /> Shared Users
        </React.Fragment>
      }
      closeButtonLabel="Close"
      closeButtonTheme="utility"
      closeButtonVariant="contained"
    >
      {/* header bar */}
      <Box className={clsx("header-box", isMobile && "mobile")}>
        <Box className="input-box">
          <TTTextField
            className="textfield"
            value={value}
            size="small"
            color="primary"
            placeholder="Enter Auth0 Id"
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            autoFocus
          />
        </Box>
        <Box className={clsx("action-button-box", isMobile && "mobile")}>
          <TTButton
            startIcon={<GroupAddIcon />}
            label="share with"
            color="utility"
            fullWidth={isMobile}
            size={isMobile ? "small" : "medium"}
            onClick={handleShareClick}
          />
          <TTButton
            startIcon={<GroupOffIcon />}
            label="unshare all"
            color="error"
            variant="text"
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
            onClick={handleUnshareAllClick}
          />
        </Box>
      </Box>
      {/* user list */}
      <Box>
        {sharedUsers.length > 0 ? (
          sharedUsers.map((user) => (
            <Box key={user.userId} className="user-box">
              <UserCard user={user} />
              <Box className={clsx("action-box", isMobile && "mobile")}>
                <TTButton
                  startIcon={<GroupRemoveIcon />}
                  size={isMobile ? "small" : "medium"}
                  color="error"
                  variant="outlined"
                  onClick={() => handleUnshareClick(user.userId)}
                >
                  unshare
                </TTButton>
              </Box>
            </Box>
          ))
        ) : (
          <Box className="no-content-box">
            <Typography variant={isMobile ? "body1" : "h6"}>
              No shared users yet.
            </Typography>
          </Box>
        )}
      </Box>
    </FormBase>
  );
};

export default TripShareForm;
