import ToolTip from "@components/ToolTip";
import { Fab, type FabOwnProps } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GroupIcon from "@mui/icons-material/Group";
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
  trip: Trip | undefined;
  tao: Tao | undefined;
  isOverview: boolean;
  setOpenForm: React.Dispatch<
    React.SetStateAction<"share" | "pdf" | null>
  >;
  isRestricted?: boolean;
  readonly?: boolean;
};

const FabComponent = ({
  trip,
  tao,
  isOverview,
  setOpenForm,
  isRestricted = false,
  readonly = false,
}: FabComponentProps) => {
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    if (trip) {
      setIsPublished(trip.isPublic);
      setIsBookmarked(trip.isBookmarked);
    }
  }, [trip]);

  const togglePublishStatus = useCallback(async () => {
    if (!trip) return;
    try {
      let newPublishState = !trip.isPublic;
      await tripsService.patchTripIsPublic([trip.id], newPublishState);
      trip.isPublic = newPublishState;
      setIsPublished(newPublishState);
      enqueueSnackbar(
        `Successfully make the trip ${newPublishState ? "public" : "private"}.`,
        { variant: "success" },
      );
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  }, [trip]);

  const toggleIsBookmarked = useCallback(async () => {
    if (!trip) return;
    try {
      let newIsBookmarked = !trip.isBookmarked;
      if (newIsBookmarked) {
        await tripsService.addBookmark(trip.id);
      } else {
        await tripsService.removeBookmark(trip.id);
      }
      trip.isBookmarked = newIsBookmarked;
      setIsBookmarked(newIsBookmarked);
      enqueueSnackbar(
        `Successfully ${newIsBookmarked ? "bookmarked" : "unbookmarked"} the trip.`,
        { variant: "success" },
      );
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  }, [trip]);

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
          content: <GroupIcon />,
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
      ] as UtilityItem[],
    [
      tao,
      isOverview,
      isPublished,
      isBookmarked,
      readonly,
      isRestricted,
      toggleIsBookmarked,
      togglePublishStatus,
      handleOpenShare,
      handleTripPdfClick,
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
