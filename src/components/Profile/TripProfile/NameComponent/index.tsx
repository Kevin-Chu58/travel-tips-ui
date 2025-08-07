import {
  Button,
  FormControl,
  OutlinedInput,
  Skeleton,
  Typography,
} from "@mui/material";
import type { RootState } from "@redux/store";
import { tripsService, type Trip, type TripPatch } from "@services/trips";
import TimeUtils from "@utils/TimeUtils";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./index.scss";

type NameComponentProps = {
  tripBasic: Trip | undefined;
  setTripBasic: (state: Trip | undefined) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const NameComponent = ({
  tripBasic,
  setTripBasic,
  isLoading,
  inputRef,
}: NameComponentProps) => {
  const [title, setTitle] = useState<string | undefined>();
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // render title on trip basic
  useEffect(() => {
    setTitle(tripBasic?.title);
  }, [tripBasic?.title]);

  const updateTitle = async () => {
    if (!title) {
      setIsEditingTitle(false);
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === tripBasic?.title || trimmedTitle.length > 50) {
      if (trimmedTitle.length > 50) {
        enqueueSnackbar("Trip title is too long.", { variant: "error" });
      }
      setIsEditingTitle(false);
      setTitle(tripBasic!.title);
      return;
    }

    if (tripBasic && token) {
      let tripPatch = { title: trimmedTitle } as TripPatch;
      tripPatch = await tripsService.patchTrip(tripBasic?.id, tripPatch, token);
      setTripBasic({ ...tripBasic, title: tripPatch.title ?? title });

      enqueueSnackbar("Successfully updated trip title.", {
        variant: "success",
      });
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
          {isEditingTitle ? (
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
                {tripBasic?.title}
              </Typography>
            </Button>
          )}
          <Typography className="trip-profile-name-comp-num-days">
            {TimeUtils.formatDays(tripBasic?.numDays ?? 0)}
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
