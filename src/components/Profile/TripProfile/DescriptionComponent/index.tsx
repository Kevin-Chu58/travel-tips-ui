import DescriptionTextField from "@components/TextField/DescriptionTextField";
import TTButton from "@components/TTButton";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { tripsService, type Trip, type TripPatch } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "./index.scss";

type DescriptionComponentProps = {
  tripBasicRef: React.RefObject<Trip | undefined>;
  syncTrip: () => void;
  isLoading: boolean;
  readonly?: boolean;
};

const DescriptionComponent = ({
  tripBasicRef,
  syncTrip,
  isLoading,
  readonly = false,
}: DescriptionComponentProps) => {
  const [description, setDescription] = useState<string | undefined>();
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);

  const helperText = "What makes this trip special?\nTell others about it!";

  // render title on trip basic
  useEffect(() => {
    setDescription(tripBasicRef.current?.description);
  }, [tripBasicRef.current?.description]);

  const handleDescriptionClose = () => {
    setIsEditingDescription(false);
  };

  const handleDescriptionUpdate = async () => {
    const trimmedDescription = description?.trim();
    if (tripBasicRef.current?.description === trimmedDescription) {
      setIsEditingDescription(false);
      setDescription(tripBasicRef.current?.description);
      return;
    }

    if (tripBasicRef.current) {
      try {
        let tripPatch = { description: trimmedDescription } as TripPatch;
        tripPatch = await tripsService.patchTrip(
          tripBasicRef.current.id,
          tripPatch
        );

        enqueueSnackbar("Successfully updated trip summary.", {
          variant: "success",
        });

        tripBasicRef.current.description = tripPatch.description;
        syncTrip();
        setIsEditingDescription(false);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <Typography className="trip-profile-description-comp-header">
            Summary
          </Typography>

          {!readonly ? (
            isEditingDescription ? (
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
                  {tripBasicRef.current?.description}
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
            )
          ) : (
            <Typography className="trip-profile-text-readonly">
              {tripBasicRef.current?.description}
            </Typography>
          )}
        </React.Fragment>
      ) : (
        <Skeleton className="trip-profile-description-comp-skeleton" />
      )}
    </React.Fragment>
  );
};

export default DescriptionComponent;
