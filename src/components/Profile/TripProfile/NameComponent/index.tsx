import {
  Button,
  FormControl,
  OutlinedInput,
  Skeleton,
  Typography,
} from "@mui/material";
import { tripsService, type Trip, type TripPatch } from "@services/trips";
import TimeUtils from "@utils/TimeUtils";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "./index.scss";

type NameComponentProps = {
  tripBasicRef: React.RefObject<Trip | undefined>;
  syncTrip: () => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  readonly?: boolean;
};

const NameComponent = ({
  tripBasicRef,
  syncTrip,
  isLoading,
  inputRef,
  readonly = false,
}: NameComponentProps) => {
  const [title, setTitle] = useState<string | undefined>();
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  // render title on trip basic
  useEffect(() => {
    setTitle(tripBasicRef.current?.title);
  }, [tripBasicRef.current?.title]);

  const updateTitle = async () => {
    if (!title) {
      setIsEditingTitle(false);
      return;
    }

    const trimmedTitle = title.trim();

    if (
      trimmedTitle === tripBasicRef.current?.title ||
      trimmedTitle.length > 50
    ) {
      if (trimmedTitle.length > 50) {
        enqueueSnackbar("Trip title is too long.", { variant: "error" });
      }
      setIsEditingTitle(false);
      setTitle(tripBasicRef.current!.title);
      return;
    }

    if (tripBasicRef.current) {
      try {
        let tripPatch = { title: trimmedTitle } as TripPatch;
        tripPatch = await tripsService.patchTrip(
          tripBasicRef.current.id,
          tripPatch
        );

        enqueueSnackbar("Successfully updated trip title.", {
          variant: "success",
        });

        tripBasicRef.current.title = tripPatch.title!;
        syncTrip();
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }

    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      updateTitle();
    }
  };

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          {!readonly ? (
            isEditingTitle ? (
              <FormControl variant="outlined">
                <OutlinedInput
                  className="trip-profile-name-comp-input"
                  ref={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  endAdornment={`${title?.length ?? 0}/50`}
                  onBlur={updateTitle}
                  onKeyDown={(e) => handleTitleKeyDown(e)}
                  autoFocus
                  size="small"
                />
              </FormControl>
            ) : (
              <Button
                className="trip-profile-name-comp-title-button"
                onClick={() => setIsEditingTitle(true)}
              >
                <Typography className="trip-profile-name-comp-title">
                  {tripBasicRef.current?.title}
                </Typography>
              </Button>
            )
          ) : (
            <Typography className="trip-profile-name-comp-title-readonly">
              {tripBasicRef.current?.title}
            </Typography>
          )}
          <Typography className="trip-profile-name-comp-num-days">
            {TimeUtils.formatDays(tripBasicRef.current?.numDays ?? 0)}
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Skeleton className="trip-profile-name-comp-title-skeleton" />
          <Skeleton className="trip-profile-name-comp-days-skeleton" />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default NameComponent;
