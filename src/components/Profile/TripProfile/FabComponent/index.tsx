import ToolTip from "@components/ToolTip";
import { Badge, Fab, type FabOwnProps } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import { enqueueSnackbar } from "notistack";
import { tripsService, type Trip } from "@services/trips";
import DownloadIcon from "@mui/icons-material/Download";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import type { Tao } from "@services/taos";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { UtilityItem } from "@constants/Types";
import { usersService } from "@services/users";
import clsx from "clsx";
import "./index.scss";

type FabComponentProps = {
  tripBasicRef: React.RefObject<Trip | undefined>;
  tripBasic: Trip | undefined;
  tao: Tao | undefined;
  isOverview: boolean;
  setOpenForm: React.Dispatch<
    React.SetStateAction<
      "deleteDay" | "editTao" | "deleteTao" | "share" | "pdf" | null
    >
  >;
  isRestricted?: boolean;
  readonly?: boolean;
};

const FabComponent = ({
  tripBasicRef,
  tripBasic,
  tao,
  isOverview,
  setOpenForm,
  isRestricted = false,
  readonly = false,
}: FabComponentProps) => {
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const sharedUserNum = useMemo(
    () => tripBasicRef?.current?.sharedUsers.length ?? 0,
    [tripBasic], // tripBasic as proxy since ref changes won't trigger re-render
  );

  useEffect(() => {
    if (tripBasic) {
      setIsPublished(tripBasic.isPublic);
      setIsBookmarked(tripBasic.isBookmarked);
    }
  }, [tripBasic]);

  const togglePublishStatus = useCallback(async () => {
    if (!tripBasicRef.current) return;
    try {
      let newPublishState = !tripBasicRef.current.isPublic;
      await tripsService.patchTripIsPublic(
        [tripBasicRef.current.id],
        newPublishState,
      );
      tripBasicRef.current.isPublic = newPublishState;
      setIsPublished(newPublishState);
      enqueueSnackbar(
        `Successfully make the trip ${newPublishState ? "public" : "private"}.`,
        { variant: "success" },
      );
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  }, [tripBasicRef]);

  const toggleIsBookmarked = useCallback(async () => {
    if (!tripBasicRef.current) return;
    try {
      let newIsBookmarked = !tripBasicRef.current.isBookmarked;
      if (newIsBookmarked) {
        await tripsService.addBookmark(tripBasicRef.current.id);
      } else {
        await tripsService.removeBookmark(tripBasicRef.current.id);
      }
      tripBasicRef.current.isBookmarked = newIsBookmarked;
      setIsBookmarked(newIsBookmarked);
      enqueueSnackbar(
        `Successfully ${newIsBookmarked ? "bookmarked" : "unbookmarked"} the trip.`,
        { variant: "success" },
      );
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  }, [tripBasicRef]);

  const handleTripPdfClick = useCallback(async () => {
    try {
      await usersService.isMember();
      setOpenForm("pdf");
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  }, [setOpenForm]);

  const handleOpenShare = useCallback(
    () => setOpenForm("share"),
    [setOpenForm],
  );
  const handleOpenEditTao = useCallback(
    () => setOpenForm("editTao"),
    [setOpenForm],
  );
  const handleOpenDeleteTao = useCallback(
    () => setOpenForm("deleteTao"),
    [setOpenForm],
  );
  const handleOpenDeleteDay = useCallback(
    () => setOpenForm("deleteDay"),
    [setOpenForm],
  );

  const fabs = useMemo(
    () =>
      [
        {
          label: isBookmarked ? "Remove Bookmark" : "Add Bookmark",
          content: isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />,
          description: "utility",
          styling: "bookmark",
          stylingCondition: [
            !Boolean(tao) && "visible",
            isBookmarked && "bookmarked",
          ],
          onClick: toggleIsBookmarked,
        },
        {
          label: isPublished ? "Set Private" : "Set Public",
          condition: !readonly,
          content: isPublished ? <VisibilityIcon /> : <VisibilityOffIcon />,
          description: "utility",
          stylingCondition: [!Boolean(tao) && "visible"],
          onClick: togglePublishStatus,
        },
        {
          label: "Shared Users",
          condition: !readonly || isRestricted,
          content: sharedUserNum ? (
            <Badge badgeContent={sharedUserNum} color="primary">
              <GroupIcon />
            </Badge>
          ) : (
            <GroupIcon />
          ),
          description: "utility",
          stylingCondition: [!Boolean(tao) && "visible"],
          onClick: handleOpenShare,
        },
        {
          label: "Download as PDF",
          content: <DownloadIcon />,
          description: "utility",
          stylingCondition: [!Boolean(tao) && "visible"],
          onClick: handleTripPdfClick,
        },
        {
          label: "Add Event",
          condition: !readonly,
          content: <AddIcon />,
          description: "info",
          stylingCondition: [!Boolean(tao) && !isOverview && "visible"],
          onClick: handleOpenEditTao,
        },
        {
          label: "Edit event",
          condition: !readonly,
          content: <EditIcon />,
          description: "info",
          stylingCondition: [Boolean(tao) && "visible"],
          onClick: handleOpenEditTao,
        },
        {
          label: Boolean(tao) ? "Delete event" : "Delete day",
          condition: !readonly,
          content: <DeleteForeverIcon />,
          description: "error",
          stylingCondition: !isOverview && "visible",
          onClick: Boolean(tao) ? handleOpenDeleteTao : handleOpenDeleteDay,
        },
      ] as UtilityItem[],
    [
      tao,
      isOverview,
      isPublished,
      isBookmarked,
      sharedUserNum,
      readonly,
      isRestricted,
      toggleIsBookmarked,
      togglePublishStatus,
      handleOpenShare,
      handleTripPdfClick,
      handleOpenEditTao,
      handleOpenDeleteTao,
      handleOpenDeleteDay,
    ],
  );

  return (
    <React.Fragment>
      {fabs.map((fab, i) =>
        fab.condition !== false ? (
          <ToolTip key={i} title={fab.label} placement="right">
            <Fab
              color={fab.description as FabOwnProps["color"]}
              className={clsx(`trip-profile-fab-comp-tool-fab ${fab.styling}`, [
                fab.stylingCondition,
              ])}
              onClick={fab.onClick}
              size="medium"
            >
              {fab.content}
            </Fab>
          </ToolTip>
        ) : undefined,
      )}
    </React.Fragment>
  );
};

export default FabComponent;
