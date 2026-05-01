import type { UserSimple } from "@services/users";
import GroupIcon from "@mui/icons-material/Group";
import FormBase from "../FormBases/FormBase";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserCard from "@components/Cards/UserCard";
import TTButton from "@components/TTButton";
import { tripsService, type Trip } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import GroupOffIcon from "@mui/icons-material/GroupOff";
import UserSearchAutoComplete from "@components/Search/UserSearchAutoComplete";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import clsx from "clsx";
import "./index.scss";

type TripShareFormProps = {
  open: boolean;
  onClose: () => void;
  trip: Trip | undefined;
  readonly?: boolean;
};

const TripShareForm = ({
  open,
  onClose,
  trip,
  readonly = false,
}: TripShareFormProps) => {
  // window
  const isMobile = useIsMobile();
  // selected
  const [selected, setSelected] = useState<UserSimple | undefined>(undefined);
  // shared users
  const [sharedUsers, setSharedUsers] = useState<UserSimple[]>([]);

  // use effects

  useEffect(() => {
    if (!trip) return;

    setSharedUsers(trip.sharedUsers);
  }, [trip]);

  // handle functions

  const handleClose = () => {
    onClose();
    setSelected(undefined);
  };

  const handleShareClick = async () => {
    if (!trip || !selected) return;

    try {
      const newShareWith = await tripsService.shareTripWithUser(
        trip.id,
        selected.userId,
      );

      setSharedUsers((prev) => [...prev, newShareWith]);

      enqueueSnackbar("Share trip with the user.", { variant: "success" });
      setSelected(undefined);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleUnshareClick = async (userId: string) => {
    if (!trip) return;

    try {
      await tripsService.unshareTripWithUser(trip.id, userId);

      let _sharedUsers = sharedUsers.filter((user) => user.userId != userId);
      setSharedUsers([..._sharedUsers]);

      enqueueSnackbar("Unshare trip with the user.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleUnshareAllClick = async () => {
    if (!trip) return;

    try {
      await tripsService.unshareTripWithAll(trip.id);

      setSharedUsers([]);

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
      width={!readonly ? "60vw" : undefined}
      height={isMobile ? "80vh" : "60vh"}
      maxHeight={isMobile ? "80vh" : undefined}
      panel
      title={
        <React.Fragment>
          <GroupIcon /> Shared Users
        </React.Fragment>
      }
      subTitle={
        <Box className="row primary">
          <LocalActivityIcon fontSize="small" /> Member Only
        </Box>
      }
      closeButtonLabel="Close"
      closeButtonTheme="utility"
      closeButtonVariant="contained"
    >
      {/* header bar */}
      {!readonly ? (
        <Box className={clsx("header-box", !isMobile ? "row start" : "column")}>
          <Box className="input-box">
            <UserSearchAutoComplete
              open={open}
              user={selected}
              setUser={setSelected}
              size="small"
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
      ) : (
        <></>
      )}

      {/* user list */}
      <Box>
        {sharedUsers.length > 0 ? (
          sharedUsers.map((user) => (
            <Box key={user.userId} className="user-box">
              <UserCard user={user} hasMobileView={!readonly} />
              {!readonly ? (
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
              ) : undefined}
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
