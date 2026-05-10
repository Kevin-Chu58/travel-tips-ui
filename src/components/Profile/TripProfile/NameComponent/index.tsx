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
import { enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import TTChipButton from "@components/TTChipButton";
import ToolTip from "@components/ToolTip";
import { RegionUtils } from "@utils/RegionUtils";
import { StringUtils } from "@utils/StringUtils";
import GroupIcon from "@mui/icons-material/Group";
import { type RegionComplete } from "@services/search/regions";
import "./index.scss";

// lazy load
const TagForm = React.lazy(() => import("@components/Forms/TagForm"));

type NameComponentProps = {
  trip: Trip | undefined;
  isLoading?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isSharedUser?: boolean;
  readonly?: boolean;
};

const NameComponent = ({
  trip,
  isLoading,
  inputRef,
  isSharedUser = false,
  readonly = false,
}: NameComponentProps) => {
  // title
  const [title, setTitle] = useState<string>();
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  // tag form
  const [openTagForm, setOpenTagForm] = useState<boolean>(false);
  // tags
  const [regionTag, setRegionTag] = useState<RegionComplete>();
  const [budgetTag, setBudgetTag] = useState<number>();

  useEffect(() => {
    if (!trip) return;

    setTitle(trip.title);
    setRegionTag(trip.region);
    setBudgetTag(trip.budget);
  }, [trip]);

  const handleUpdateRegion = useCallback(
    async (regionId?: number) => {
      try {
        if (trip) {
          const completeRegion = await tripsService.patchTripRegionTag(
            trip.id,
            regionId,
          );

          setRegionTag(regionId ? completeRegion : undefined);
          enqueueSnackbar("Region tag updated.", { variant: "success" });
        }
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    },
    [trip, setRegionTag],
  );

  const handleUpdateBudget = useCallback(
    async (budget?: number) => {
      try {
        if (trip) {
          const newBudget = await tripsService.patchTripBudgetTag(
            trip.id,
            budget,
          );
          setBudgetTag(newBudget);

          enqueueSnackbar("Budget tag updated.", { variant: "success" });
        }
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    },
    [trip, setBudgetTag],
  );

  const updateTitle = useCallback(async () => {
    if (!trip) return;

    if (!title) {
      setIsEditingTitle(false);
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 50) {
      enqueueSnackbar("Trip title is too long.", { variant: "error" });
      setIsEditingTitle(false);
      setTitle(trip.title);
      return;
    }

    if (trip) {
      try {
        let tripPatch = { title: trimmedTitle } as TripPatch;
        tripPatch = await tripsService.patchTrip(trip.id, tripPatch);
        setTitle(trimmedTitle);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }

    setIsEditingTitle(false);
  }, [title, setTitle]);

  const handleTitleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === "Enter") updateTitle();
    },
    [updateTitle],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    [],
  );

  const handleStartEditing = useCallback(() => setIsEditingTitle(true), []);
  const handleOpenTagForm = useCallback(() => setOpenTagForm(true), []);
  const handleCloseTagForm = useCallback(() => setOpenTagForm(false), []);

  const handleDeleteRegion = useCallback(
    () => handleUpdateRegion(undefined),
    [handleUpdateRegion],
  );

  const handleDeleteBudget = useCallback(
    () => handleUpdateBudget(undefined),
    [handleUpdateBudget],
  );

  return (
    <Box className="trip-profile-name-comp">
      {!isLoading ? (
        <React.Fragment>
          {!readonly ? (
            isEditingTitle ? (
              <FormControl variant="outlined">
                <OutlinedInput
                  className="input"
                  ref={inputRef}
                  value={title}
                  onChange={handleTitleChange}
                  endAdornment={`${title?.length ?? 0}/50`}
                  onBlur={updateTitle}
                  onKeyDown={handleTitleKeyDown}
                  autoFocus
                  size="small"
                />
              </FormControl>
            ) : (
              <Button className="title-button" onClick={handleStartEditing}>
                <Typography className="title" variant="h6">
                  {title}
                </Typography>
              </Button>
            )
          ) : (
            <Typography className="title-readonly" variant="h6">
              {title} <span className="helper">#{trip?.id}</span>
            </Typography>
          )}

          <Box className="tag-container">
            {regionTag ? (
              <Chip
                color="region"
                size="small"
                label={RegionUtils.getRegionAddress(regionTag)}
                onDelete={!readonly ? handleDeleteRegion : undefined}
              />
            ) : undefined}
            {budgetTag ? (
              <Chip
                color="success"
                size="small"
                label={StringUtils.getBudgetStr(budgetTag)}
                onDelete={!readonly ? handleDeleteBudget : undefined}
              />
            ) : undefined}
            {isSharedUser ? (
              <Chip
                color="info"
                size="small"
                label={"Shared With"}
                icon={<GroupIcon />}
              />
            ) : undefined}
            {!readonly ? (
              <ToolTip title="Update Tags" offsetY={-8}>
                <TTChipButton
                  className="setting-button"
                  color="utility"
                  icon={<SettingsIcon />}
                  label="tags"
                  size="small"
                  onClick={handleOpenTagForm}
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

      {openTagForm && (
        <TagForm
          open
          onClose={handleCloseTagForm}
          tripId={trip?.id}
          region={regionTag}
          budget={budgetTag}
          onUpdateRegion={handleUpdateRegion}
          onUpdateBudget={handleUpdateBudget}
        />
      )}
    </Box>
  );
};

export default NameComponent;
