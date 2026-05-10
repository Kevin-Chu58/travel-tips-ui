import DescriptionTextField from "@components/TextField/DescriptionTextField";
import TTButton from "@components/TTButton";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { tripsService, type Trip, type TripPatch } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import MarkdownBox from "@components/MarkdownBox";
import "./index.scss";

type DescriptionComponentProps = {
  trip: Trip | undefined;
  setTrip: (value: React.SetStateAction<Trip | undefined>) => void;
  isLoading: boolean;
  readonly?: boolean;
};

const DescriptionComponent = ({
  trip,
  setTrip,
  isLoading,
  readonly = false,
}: DescriptionComponentProps) => {
  const [description, setDescription] = useState<string | undefined>();
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);

  const helperText = "What makes this trip special?\nTell others about it!";

  // render title on trip basic
  useEffect(() => {
    if (!trip) return;

    setDescription(trip.description);
  }, [trip]);

  const handleDescriptionClose = useCallback(() => {
    setIsEditingDescription(false);
  }, [setIsEditingDescription]);

  const handleDescriptionUpdate = useCallback(async () => {
    if (!trip) return;

    const trimmedDescription = description?.trim();
    if (trip.description === trimmedDescription) {
      setIsEditingDescription(false);
      return;
    }

    try {
      let tripPatch = { description: trimmedDescription } as TripPatch;
      tripPatch = await tripsService.patchTrip(trip.id, tripPatch);

      if (trip)
        setTrip((prev) => ({ ...prev!, description: tripPatch.description }));
      setIsEditingDescription(false);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  }, [description, setIsEditingDescription, setDescription, enqueueSnackbar]);

  const handleIsEditingDescriptionTrue = useCallback(
    () => setIsEditingDescription(true),
    [setIsEditingDescription],
  );

  return (
    <Box className="trip-profile-description-comp">
      {!isLoading ? (
        <React.Fragment>
          <Box className="header-container">
            <Typography className="header">Summary</Typography>
          </Box>

          {!readonly ? (
            isEditingDescription ? (
              <React.Fragment>
                <DescriptionTextField
                  value={description ?? ""}
                  setValue={setDescription}
                  placeholder={helperText}
                  maxLength={800}
                />
                <Box className="edit-button-box">
                  <TTButton
                    className="edit-button"
                    label="cancel"
                    variant="text"
                    color="primary"
                    onClick={handleDescriptionClose}
                  />
                  <TTButton
                    className="edit-button"
                    label="update"
                    color="primary"
                    onClick={handleDescriptionUpdate}
                  />
                </Box>
              </React.Fragment>
            ) : Boolean(description) ? (
              <Button
                className="button"
                onClick={handleIsEditingDescriptionTrue}
              >
                <Suspense>
                  <MarkdownBox text={description} disableGap />
                </Suspense>
              </Button>
            ) : (
              <Button
                className="empty-button"
                onClick={handleIsEditingDescriptionTrue}
                fullWidth
              >
                <Typography className="trip-profile-text">
                  {helperText}
                </Typography>
              </Button>
            )
          ) : (
            <Suspense>
              <MarkdownBox text={description || "*Nothing to preview*"} />
            </Suspense>
          )}
        </React.Fragment>
      ) : (
        <Skeleton className="skeleton" />
      )}
    </Box>
  );
};

export default DescriptionComponent;
