import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import FormBase from "../FormBase";
import RegionForm from "../RegionForm";
import BudgetForm from "../BudgetForm";
import type { TripSearchParams } from "@services/trips";
import type { RegionComplete } from "@services/search/regions";
import type { TripOrderByEnum, UtilityItem } from "@constants/Types";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { usersService, type UserSimple } from "@services/users";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { enqueueSnackbar } from "notistack";
import UserCard from "@components/Cards/UserCard";
import TTChipButton from "@components/TTChipButton";
import ToolTip from "@components/ToolTip";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";

type TripSearchFormProps = {
  open: boolean;
  onClose: () => void;
  onAction: () => void;
  tripFilterParams: TripSearchParams;
  updateTripFilterParams: (state: Partial<TripSearchParams>) => void;
  setCompleteRegion: React.Dispatch<React.SetStateAction<RegionComplete>>;
};

const TripSearchForm = ({
  open,
  onClose,
  onAction,
  tripFilterParams,
  updateTripFilterParams,
  setCompleteRegion,
}: TripSearchFormProps) => {
  // user
  const user = useSelector((state: RootState) => state.user);
  // user - created by
  const [createdBy, setCreatedBy] = useState<UserSimple | null>(null);
  const [input, setInput] = useState<string>("");
  // user list - options type
  const [isGeneral, setIsGeneral] = useState<boolean>(true);
  // user list - general options
  const [generalOptions, setGeneralOptions] = useState<UserSimple[]>([]);
  const generalCursorRef = useRef<string | undefined>(undefined);
  // user list - following options
  const [followingOptions, setFollowingOptions] = useState<UserSimple[]>([]);
  const followingCursorRef = useRef<string | undefined>(undefined);
  const hasFollowingInit = useRef<boolean>(false);
  // user list - options
  const options = isGeneral ? generalOptions : followingOptions;
  const optionsContainerRef = useRef<HTMLDivElement | null>(null); // the popover menu in createdBy autoComplete
  const optionsIsLoadingRef = useRef<boolean>(false);

  // init general options and createdBy if tripFilterParams.createdBy is not undefined
  useEffect(() => {
    if (!open) return;

    if (tripFilterParams.createdBy && generalOptions.length === 0) {
      setGeneralOptions([tripFilterParams.createdBy]);
      setCreatedBy(tripFilterParams.createdBy);
    }
    else if (!tripFilterParams.createdBy) {
      setCreatedBy(null);
    }
  }, [open]);

  const sortBys = [
    {
      label: "Newest",
      content: "newest",
    },
    {
      label: "Oldest",
      content: "oldest",
    },
    {
      label: "Most Bookmarked",
      content: "mostBookmarked",
    },
    {
      label: "Least Bookmarked",
      content: "leastBookmarked",
    },
  ] as UtilityItem[];

  const updateCreatedBy = (user: UserSimple) => {
    setCreatedBy(user);
    updateTripFilterParams({ createdBy: user });
  };

  const removeCreatedBy = () => {
    setCreatedBy(null);
    updateTripFilterParams({ createdBy: undefined });
  };

  const getUsersByUsername = async (isNewSearch: boolean = false) => {
    if (!input) return;
    if (!isNewSearch && !generalCursorRef.current) return;

    try {
      const userResult = await usersService.getUsersByUsername({
        username: input,
        cursor: !isNewSearch ? generalCursorRef.current : undefined,
      });

      isNewSearch
        ? setGeneralOptions([...userResult.results])
        : setGeneralOptions((prev) => [...prev, ...userResult.results]);
      generalCursorRef.current = userResult.cursor;
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const getFollowings = async () => {
    if (!user.id) return;
    if (hasFollowingInit.current && !followingCursorRef.current) return;

    try {
      const followingResult = await usersService.getFollowers({
        userId: user.id,
        cursor: followingCursorRef.current,
      });

      !hasFollowingInit.current
        ? setFollowingOptions([...followingResult.results])
        : setFollowingOptions((prev) => [...prev, ...followingResult.results]);

      hasFollowingInit.current = true;
      followingCursorRef.current = followingResult.cursor;
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const searchUsers = isGeneral ? getUsersByUsername : getFollowings;

  // trigger when press enter when focus on search input
  const handleKeyDownUserSearch = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await getUsersByUsername(true);
    }
  };

  // trigger when scroll close to the bottom
  const handleGeneralScroll = async () => {
    if (optionsIsLoadingRef.current || !generalCursorRef.current) return;

    optionsIsLoadingRef.current = true;

    const container = optionsContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      await searchUsers();
    }

    optionsIsLoadingRef.current = false;
  };

  // trigger when scroll close to the bottom
  const handleFollowingScroll = async () => {
    if (optionsIsLoadingRef.current || !followingCursorRef.current) return;

    optionsIsLoadingRef.current = true;

    const container = optionsContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      await searchUsers();
    }

    optionsIsLoadingRef.current = false;
  };

  return (
    <FormBase
      className="trip-filter-form"
      open={open}
      onClose={onClose}
      title="Advanced Search"
      width="50vw"
      maxHeight="80vh"
      actionButtonLabel="Apply"
      actionButtonOnClick={onAction}
      panel
    >
      <Grid container columns={{ xs: 6, sm: 12 }} spacing={2}>
        {/* region filter */}
        <Grid size={12}>
          <Typography className="form-title">Regions</Typography>
          <RegionForm
            open
            countrySlug={tripFilterParams.countrySlug}
            stateSlug={tripFilterParams.stateSlug}
            onContentUpdate={updateTripFilterParams}
            setCompleteRegion={setCompleteRegion}
            content
          />
        </Grid>
        {/* budget filter */}
        <Grid size={6}>
          <Typography className="form-title">Budget</Typography>
          <BudgetForm
            open
            budget={tripFilterParams.budget}
            onUpdate={(e) => updateTripFilterParams({ budget: e })}
            content
          />
        </Grid>
        {/* created by filter */}
        <Grid size={6}>
          <Typography className="form-title">Created By</Typography>
          <Autocomplete
            className="createdBy-input"
            inputValue={input}
            onInputChange={(_, newInputValue) => {
              setInput(newInputValue);
            }}
            value={createdBy}
            options={options}
            getOptionLabel={(option) => option.username}
            onFocus={
              !isGeneral && !hasFollowingInit.current
                ? async () => await getFollowings()
                : undefined
            }
            slotProps={{
              listbox: {
                ref: optionsContainerRef,
                onScroll: isGeneral
                  ? handleGeneralScroll
                  : handleFollowingScroll,
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="User"
                placeholder="Enter username"
                onKeyDown={handleKeyDownUserSearch}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: params.InputProps.startAdornment,
                    endAdornment: isGeneral ? (
                      <IconButton onClick={() => getUsersByUsername(true)}>
                        <PersonSearchIcon />
                      </IconButton>
                    ) : (
                      params.InputProps.endAdornment
                    ),
                  },
                }}
              />
            )}
            renderValue={(selected) => (
              <Chip
                avatar={
                  <Avatar
                    src={selected?.picture}
                    alt={selected?.username}
                    slotProps={{ img: { loading: "lazy" } }}
                  />
                }
                label={
                  <Typography className="too-long">
                    {selected.username}
                  </Typography>
                }
                onDelete={removeCreatedBy}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <MenuItem
                  key={option.userId}
                  {...optionProps}
                  onClick={() => updateCreatedBy(option)}
                  disableGutters
                  disableRipple
                >
                  <UserCard user={option} hasMobileView={false} />
                </MenuItem>
              );
            }}
            fullWidth
          />

          <Box className="row createdBy-search-option-box">
            <Typography variant="caption">Search Option:</Typography>
            <ToolTip title="search all users" offsetY={-8}>
              <TTChipButton
                className="option"
                label="General"
                color={isGeneral ? "info" : "default"}
                onClick={() => setIsGeneral(true)}
              />
            </ToolTip>
            <ToolTip title="search users you followed" offsetY={-8}>
              <TTChipButton
                className="option"
                label="Following"
                color={!isGeneral ? "info" : "default"}
                onClick={() => setIsGeneral(false)}
              />
            </ToolTip>
          </Box>
        </Grid>

        <Grid size={12}>
          <Divider flexItem />
        </Grid>

        {/* Sort By */}
        <Grid size={12}>
          <Typography className="form-title">Sort By</Typography>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="newest"
              value={tripFilterParams.tripOrderByEnum}
              onChange={(e) =>
                updateTripFilterParams({
                  tripOrderByEnum: e.target.value as TripOrderByEnum,
                })
              }
            >
              {sortBys.map((sortBy) => (
                <FormControlLabel
                  key={sortBy.content as string}
                  value={sortBy.content as string}
                  control={<Radio />}
                  label={sortBy.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </FormBase>
  );
};

export default TripSearchForm;
