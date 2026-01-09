import type { UserSimple } from "@services/users";
import GroupIcon from "@mui/icons-material/Group";
import FormBase from "../FormBase";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import UserCard from "@components/Cards/UserCard";
import TTButton from "@components/TTButton";
import GroupOffIcon from "@mui/icons-material/GroupOff";
import { tripsService, type Trip } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
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
  // response
  const [response, setResponse] = useState<string>("");

  // handle

  const handleClose = () => {
    onClose();
    setResponse("");
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

  return (
    <FormBase
      open={open}
      onClose={handleClose}
      className="trip-share-form"
      width="55vw"
      height={isMobile ? "80vh" : "60vh"}
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
      <Box>TODO: input bar - add user by email</Box>
      <Box>
        {sharedUsers.length > 0 ? (
          sharedUsers.map((user) => (
            <Box key={user.userId} className="user-box">
              <UserCard user={user} />
              <Box className={clsx("action-box", isMobile && "mobile")}>
                <TTButton
                  startIcon={<GroupOffIcon />}
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
