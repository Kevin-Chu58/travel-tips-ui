import UsersForm from "@components/Forms/UsersForm";
import ToolTip from "@components/ToolTip";
import PersonIcon from "@mui/icons-material/Person";
import { Chip } from "@mui/material";
import {
  usersService,
  type UserProfileBasic,
  type UserSimple,
} from "@services/users";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";

type FollowerChipProps = {
  user?: UserProfileBasic;
};

const FollowerChip = ({ user }: FollowerChipProps) => {
  // form status
  const [openFollowerUserForm, setOpenFollowerUserForm] =
    useState<boolean>(false);
  const [openFollowingUserForm, setOpenFollowingUserForm] =
    useState<boolean>(false);
  // followers
  const [followers, setFollowers] = useState<UserSimple[]>([]);
  const followerCursorRef = useRef<string | undefined>(undefined);
  const isFollowerLoadingRef = useRef<boolean>(false);
  const followerContainerRef = useRef<HTMLDivElement | null>(null);
  // followings
  const [followings, setFollowings] = useState<UserSimple[]>([]);
  const followingCursorRef = useRef<string | undefined>(undefined);
  const isFollowingLoadingRef = useRef<boolean>(false);
  const followingContainerRef = useRef<HTMLDivElement | null>(null);
  // behavior
  const [hasFollowersInit, setHasFollowersInit] = useState<boolean>(false);
  const [hasFollowingsInit, setHasFollowingsInit] = useState<boolean>(false);

  // following chip components
  const _followerCount = user?.followerCount ?? 0;
  const _followingCount = user?.followingCount ?? 0;
  const followerText = `${_followerCount} ${_followerCount === 1 ? "follower" : "followers"}`;
  const followingText = `${_followingCount} following`;
  const followerSpan = (
    <ToolTip title="View followers">
      <span
        className="follow-span"
        onClick={() => setOpenFollowerUserForm(true)}
      >
        {followerText}
      </span>
    </ToolTip>
  );
  const followingSpan = (
    <ToolTip title="View followings">
      <span
        className="follow-span"
        onClick={() => setOpenFollowingUserForm(true)}
      >
        {followingText}
      </span>
    </ToolTip>
  );
  const followText = (
    <>
      {followerSpan} • {followingSpan}
    </>
  );

  // initiate followers
  useEffect(() => {
    const initiateFollowers = async () => {
      if (openFollowerUserForm && !hasFollowersInit) {
        await getFollowersByParams(true);
        setHasFollowersInit(true);
      }
    };

    initiateFollowers();
  }, [openFollowerUserForm]);

  // initiate followings
  useEffect(() => {
    const initiateFollowings = async () => {
      if (openFollowingUserForm && !hasFollowingsInit) {
        await getFollowingsByParams(true);
        setHasFollowingsInit(true);
      }
    };

    initiateFollowings();
  }, [openFollowingUserForm]);

  // followers

  const getFollowersByParams = async (isNewSearch: boolean = false) => {
    if (!user) return;
    if (!isNewSearch && !followerCursorRef.current) return;

    try {
      const followerResult = await usersService.getFollowers({
        userId: user.id,
        cursor: followerCursorRef.current,
      });
      setFollowers((prev) => [...prev, ...followerResult.results]);
      followerCursorRef.current = followerResult.cursor;
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  // trigger when scroll close to the bottom
  const handleFollowerScroll = async () => {
    console.log(followerCursorRef);
    if (isFollowerLoadingRef.current || !followerCursorRef.current) return;

    isFollowerLoadingRef.current = true;

    const container = followerContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      await getFollowersByParams();
    }

    isFollowerLoadingRef.current = false;
  };

  // followings

  const getFollowingsByParams = async (isNewSearch: boolean = false) => {
    if (!user) return;
    if (!isNewSearch && !followingCursorRef.current) return;

    try {
      const followingResult = await usersService.getFollowings({
        userId: user.id,
        cursor: followingCursorRef.current,
      });
      setFollowings((prev) => [...prev, ...followingResult.results]);
      followingCursorRef.current = followingResult.cursor;
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  // trigger when scroll close to the bottom
  const handleFollowingScroll = async () => {
    if (isFollowingLoadingRef.current || !followingCursorRef.current) return;

    isFollowingLoadingRef.current = true;

    const container = followingContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      await getFollowingsByParams();
    }

    isFollowingLoadingRef.current = false;
  };

  return (
    <React.Fragment>
      <Chip
        className="follow-chip"
        color="utility"
        icon={<PersonIcon />}
        label={followText}
      />

      {/* form - follower */}
      <UsersForm
        open={openFollowerUserForm}
        onClose={() => setOpenFollowerUserForm(false)}
        title={followerText}
        users={followers}
        containerRef={followerContainerRef}
        onScroll={handleFollowerScroll}
      />

      {/* form - following */}
      <UsersForm
        open={openFollowingUserForm}
        onClose={() => setOpenFollowingUserForm(false)}
        title={followingText}
        users={followings}
        containerRef={followingContainerRef}
        onScroll={handleFollowingScroll}
      />
    </React.Fragment>
  );
};

export default FollowerChip;
