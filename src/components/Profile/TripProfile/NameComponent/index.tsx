import {
  Box,
  Button,
  Chip,
  FormControl,
  OutlinedInput,
  Skeleton,
  Typography,
} from "@mui/material";
import { tripsService, type Trip, type TripPatch } from "@services/trips";
import TimeUtils from "@utils/TimeUtils";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import TTChipButton from "@components/TTChipButton";
import TagForm from "@components/Forms/TagForm";
import ToolTip from "@components/ToolTip";
import type { RegionComplete } from "@services/search/regions";
import { RegionUtils } from "@utils/RegionUtils";
import { StringUtils } from "@utils/StringUtils";
import "./index.scss";

type NameComponentProps = {
  tripBasicRef: React.RefObject<Trip | undefined>;
  tripBasic: Trip | undefined;
  asyncTrip: () => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  readonly?: boolean;
};

const NameComponent = ({
  tripBasicRef,
  tripBasic,
  asyncTrip,
  isLoading,
  inputRef,
  readonly = false,
}: NameComponentProps) => {
  // title
  const [title, setTitle] = useState<string | undefined>(tripBasic?.title);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  // form
  const [openTagForm, setOpenTagForm] = useState<boolean>(false);

  const handleUpdateRegion = async (regionId?: number) => {
    try {
      if (tripBasicRef.current) {
        const completeRegion = (await tripsService.patchTripRegionTag(
          tripBasicRef.current.id,
          regionId
        )) as RegionComplete;
        tripBasicRef.current.region =
          Object.keys(completeRegion).length > 0 ? completeRegion : undefined;
        asyncTrip();

        enqueueSnackbar("Region tag updated.", {
          variant: "success",
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleUpdateBudget = async (budget?: number) => {
    try {
      if (tripBasicRef.current) {
        const newBudget = (await tripsService.patchTripBudgetTag(
          tripBasicRef.current.id,
          budget
        )) as number;

        tripBasicRef.current.budget = newBudget;
        asyncTrip();

        enqueueSnackbar("Budget tag updated.", {
          variant: "success",
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

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
        asyncTrip();
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
    <Box className="trip-profile-name-comp">
      {!isLoading ? (
        <React.Fragment>
          {/* title */}
          {!readonly ? (
            isEditingTitle ? (
              <FormControl variant="outlined">
                <OutlinedInput
                  className="input"
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
                className="title-button"
                onClick={() => setIsEditingTitle(true)}
              >
                <Typography className="title">
                  {tripBasicRef.current?.title}
                </Typography>
              </Button>
            )
          ) : (
            <Typography className="title-readonly">
              {tripBasicRef.current?.title}
            </Typography>
          )}

          {/* days & tags */}
          <Box className="tag-container">
            <Typography className="num-days">
              {TimeUtils.formatDays(tripBasicRef.current?.numDays ?? 0)}
            </Typography>
            {/* region tag */}
            {tripBasicRef?.current?.region ? (
              <Chip
                color="region"
                size="small"
                label={RegionUtils.getRegionAddress(
                  tripBasicRef?.current?.region
                )}
                onDelete={
                  !readonly ? () => handleUpdateRegion(undefined) : undefined
                }
              />
            ) : undefined}
            {/* budget tag */}
            {tripBasicRef.current?.budget ? (
              <Chip
                color="success"
                size="small"
                label={StringUtils.getBudgetStr(tripBasicRef.current.budget)}
                onDelete={
                  !readonly ? () => handleUpdateBudget(undefined) : undefined
                }
              />
            ) : undefined}
            {/* tag form button */}
            {!readonly ? (
              <ToolTip title="Update Tags" offsetY={-8}>
                <TTChipButton
                  className="setting-button"
                  color="utility"
                  icon={<SettingsIcon />}
                  label="tags"
                  size="small"
                  onClick={() => setOpenTagForm(true)}
                />
              </ToolTip>
            ) : undefined}
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Skeleton className="title-skeleton" />
          <Skeleton className="days-skeleton" />
        </React.Fragment>
      )}

      {/* form */}
      <TagForm
        open={openTagForm}
        onClose={() => setOpenTagForm(false)}
        trip={tripBasicRef.current}
        onUpdateRegion={handleUpdateRegion}
        onUpdateBudget={handleUpdateBudget}
      />
    </Box>
  );
};

export default NameComponent;
