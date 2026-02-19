import UserCard from "@components/Cards/UserCard";
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { usersService, type UserSimple } from "@services/users";
import { useIsMobile } from "@hooks/useIsMobile";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { enqueueSnackbar } from "notistack";
import { useCursorScroll } from "@hooks/useCursorScroll";
import ToolTip from "@components/ToolTip";
import TTChipButton from "@components/TTChipButton";
import clsx from "clsx";
import "./index.scss";

type UserSearchAutoCompleteProps = {
  open: boolean;
  user: UserSimple | undefined;
  setUser: (state: UserSimple | undefined) => void;
  size?: "small" | "medium";
};

const UserSearchAutoComplete = ({
  open,
  user,
  setUser,
  size = "medium",
}: UserSearchAutoCompleteProps) => {
  // window
  const isMobile = useIsMobile();
  // user
  const _user = useSelector((state: RootState) => state.user);
  // input
  const [input, setInput] = useState<string>("");
  // selected user
  const [selected, setSelected] = useState<UserSimple | null>(null);
  // user list - general options
  const [generalOptions, setGeneralOptions] = useState<UserSimple[]>([]);
  const generalCursorRef = useRef<string | undefined>(undefined);
  // user list - following options
  const [followingOptions, setFollowingOptions] = useState<UserSimple[]>([]);
  const followingCursorRef = useRef<string | undefined>(undefined);
  const hasFollowingInit = useRef<boolean>(false);
  // user list - options type
  const [isGeneral, setIsGeneral] = useState<boolean>(true);
  // user list - options
  const options = isGeneral ? generalOptions : followingOptions;
  const optionsContainerRef = useRef<HTMLDivElement | null>(null); // the popover menu in createdBy autoComplete
  const optionsIsLoadingRef = useRef<boolean>(false);

  // render pre-fetched user to auto-complete on open
  useEffect(() => {
    if (!open) return;

    if (user && generalOptions.length === 0) {
      setGeneralOptions([user]);
      setSelected(user);
    } else if (!user) {
      setSelected(null);
    }
  }, [open]);

  // rerender selected user on user change
  useEffect(() => {
    if (user?.id !== selected?.id) {
      setSelected(user ?? null);
    }
  }, [user]);

  const updateSelected = (user: UserSimple) => {
    setSelected(user);
    setUser(user);
  };

  const removeSelected = () => {
    setSelected(null);
    setUser(undefined);
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
    if (!_user.id) return;
    if (hasFollowingInit.current && !followingCursorRef.current) return;

    try {
      const followingResult = await usersService.getFollowers({
        userId: _user.id,
        cursor: followingCursorRef.current,
      });

      !hasFollowingInit.current
        ? setFollowingOptions([...followingResult.results])
        : setFollowingOptions((prev) => [...prev, ...followingResult.results]);

      if (!hasFollowingInit.current && followingResult.results.length === 0) {
        enqueueSnackbar("You have not followed anyone.", { variant: "info" });
      }

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

  const handleGeneralScroll = useCursorScroll(
    optionsContainerRef,
    optionsIsLoadingRef,
    generalCursorRef.current,
    searchUsers,
  );

  const handleFollowingScroll = useCursorScroll(
    optionsContainerRef,
    optionsIsLoadingRef,
    followingCursorRef.current,
    searchUsers,
  );

  return (
    <Box className="column full user-search-auto-complete-box">
      <Autocomplete
        className="user-search-auto-complete"
        inputValue={input}
        onInputChange={(_, newInputValue) => {
          setInput(newInputValue);
        }}
        size={size}
        value={selected}
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
            onScroll: isGeneral ? handleGeneralScroll : handleFollowingScroll,
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
                size: size,
                startAdornment: params.InputProps.startAdornment,
                endAdornment: isGeneral ? (
                  <IconButton
                    className="icon-button"
                    onClick={() => getUsersByUsername(true)}
                  >
                    <PersonSearchIcon className={clsx(size)} />
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
              <Typography className={clsx("too-long", isMobile && "mobile")}>
                {selected.username}
              </Typography>
            }
            onDelete={removeSelected}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <MenuItem
              key={option.userId}
              {...optionProps}
              onClick={() => updateSelected(option)}
              disableGutters
              disableRipple
            >
              <UserCard user={option} />
            </MenuItem>
          );
        }}
        fullWidth
      />

      <Box className="row option-box">
        <Typography variant="caption">Options:</Typography>
        <ToolTip title="Search all users" offsetY={-8}>
          <TTChipButton
            className="option"
            label="General"
            color={isGeneral ? "info" : "default"}
            onClick={() => setIsGeneral(true)}
          />
        </ToolTip>
        {Boolean(_user.id) ? (
          <ToolTip title="Search users you followed" offsetY={-8}>
            <TTChipButton
              className="option"
              label="Following"
              color={!isGeneral ? "info" : "default"}
              onClick={() => setIsGeneral(false)}
            />
          </ToolTip>
        ) : undefined}
      </Box>
    </Box>
  );
};

export default UserSearchAutoComplete;
