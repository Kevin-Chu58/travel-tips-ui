import DescriptionTextField from "@components/TextField/DescriptionTextField";
import TTButton from "@components/TTButton";
import { Box, Button, IconButton, Skeleton, Typography } from "@mui/material";
import { tripsService, type Trip, type TripPatch } from "@services/trips";
import { enqueueSnackbar } from "notistack";
import MarkdownBox from "@components/MarkdownBox";
import React, { useCallback, useEffect, useState } from "react";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ToolTip from "@components/ToolTip";
import "./index.scss";

type DescriptionComponentProps = {
  tripBasicRef: React.RefObject<Trip | undefined>;
  asyncTrip: () => void;
  hideImages: boolean;
  setHideImages: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  readonly?: boolean;
};

const DescriptionComponent = ({
  tripBasicRef,
  asyncTrip,
  hideImages,
  setHideImages,
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

  useEffect(() => {
    if (isEditingDescription) setDescription(tripBasicRef.current?.description);
  }, [isEditingDescription]);

  const handleDescriptionClose = useCallback(() => {
    setIsEditingDescription(false);
  }, [setIsEditingDescription]);

  const handleDescriptionUpdate = useCallback(async () => {
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
          tripPatch,
        );

        enqueueSnackbar("Successfully updated trip summary.", {
          variant: "success",
        });

        tripBasicRef.current.description = tripPatch.description;
        asyncTrip();
        setIsEditingDescription(false);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  }, [
    description,
    setIsEditingDescription,
    setDescription,
    enqueueSnackbar,
    asyncTrip,
  ]);

  const handleIsEditingDescriptionTrue = useCallback(
    () => setIsEditingDescription(true),
    [setIsEditingDescription],
  );

  const handleHideImages = useCallback(
    () => setHideImages((prev) => !prev),
    [setHideImages],
  );

  return (
    <Box className="trip-profile-description-comp">
      {!isLoading ? (
        <React.Fragment>
          <Box className="header-container">
            <Typography className="header">Summary</Typography>
            <ToolTip title={hideImages ? "Zoom Out" : "Zoom In"} offsetY={-8}>
              <IconButton className="zoom-button" onClick={handleHideImages}>
                {hideImages ? <ZoomOutMapIcon /> : <ZoomInMapIcon />}
              </IconButton>
            </ToolTip>
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
                <MarkdownBox
                  text={tripBasicRef.current?.description}
                  disableGap
                />
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
            <MarkdownBox
              text={tripBasicRef.current?.description || "*Nothing to preview*"}
            />
          )}
        </React.Fragment>
      ) : (
        <Skeleton className="skeleton" />
      )}
    </Box>
  );
};

export default DescriptionComponent;
