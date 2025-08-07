import DescriptionTextField from "@components/TextField/DescriptionTextField";
import TTButton from "@components/TTButton";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import type { RootState } from "@redux/store";
import { tripsService, type Trip, type TripPatch } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./index.scss";

type DescriptionComponentProps = {
  tripBasic: Trip | undefined;
  setTripBasic: (state: Trip | undefined) => void;
  isLoading: boolean;
};

const DescriptionComponent = ({
  tripBasic,
  setTripBasic,
  isLoading,
}: DescriptionComponentProps) => {
  const [description, setDescription] = useState<string | undefined>();
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const helperText = "What makes this trip special?\nTell others about it!";

  // render title on trip basic
  useEffect(() => {
    setDescription(tripBasic?.description);
  }, [tripBasic?.description]);

  const handleDescriptionClose = () => {
    setIsEditingDescription(false);
  };

  const handleDescriptionUpdate = async () => {
    const trimmedDescription = description?.trim();
    if (tripBasic?.description === trimmedDescription) {
      setIsEditingDescription(false);
      setDescription(tripBasic?.description);
      return;
    }

    if (tripBasic && token) {
      let tripPatch = { description: trimmedDescription } as TripPatch;
      tripPatch = await tripsService.patchTrip(tripBasic?.id, tripPatch, token);
      setTripBasic({ ...tripBasic, description: tripPatch.description });
      setIsEditingDescription(false);

      enqueueSnackbar("Successfully updated trip summary.", {
        variant: "success",
      });
    }
  };

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <Typography className="trip-profile-description-comp-header">
            Summary
          </Typography>
          {isEditingDescription ? (
            <React.Fragment>
              <DescriptionTextField
                value={description ?? ""}
                setValue={setDescription}
                placeholder={helperText}
              />
              <Box className="trip-profile-description-comp-edit-button-box">
                <TTButton
                  label="cancel"
                  variant="text"
                  color="primary"
                  onClick={handleDescriptionClose}
                />
                <TTButton
                  label="update"
                  color="primary"
                  onClick={handleDescriptionUpdate}
                />
              </Box>
            </React.Fragment>
          ) : Boolean(description) ? (
            <Button
              className="trip-profile-description-comp-button"
              onClick={() => setIsEditingDescription(true)}
            >
              <Typography className="trip-profile-text">
                {tripBasic?.description}
              </Typography>
            </Button>
          ) : (
            <Button
              className="trip-profile-description-comp-empty-button"
              onClick={() => setIsEditingDescription(true)}
              fullWidth
            >
              <Typography className="trip-profile-text">
                {helperText}
              </Typography>
            </Button>
          )}
        </React.Fragment>
      ) : (
        <Skeleton className="trip-profile-description-comp-skeleton" />
      )}
    </React.Fragment>
  );
};

export default DescriptionComponent;
