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
import React, { useEffect, useState } from "react";
import type { UtilityItem } from "@constants/Types";
import clsx from "clsx";
import "./index.scss";
import { usersService } from "@services/users";

type FabComponentProps = {
  tripBasicRef: React.RefObject<Trip | undefined>;
  tripBasic: Trip | undefined;
  tao: Tao | undefined;
  isOverview: boolean;
  setOpenTripShareForm: (state: boolean) => void;
  setOpenTripPdfForm: (state: boolean) => void;
  setOpenDeleteDayForm: (state: boolean) => void;
  setOpenEditTaoForm: (state: boolean) => void;
  setOpenDeleteTaoForm: (state: boolean) => void;
  isRestricted?: boolean;
  readonly?: boolean;
};

const FabComponent = ({
  tripBasicRef,
  tripBasic,
  tao,
  isOverview,
  setOpenTripShareForm,
  setOpenTripPdfForm,
  setOpenDeleteDayForm,
  setOpenEditTaoForm,
  setOpenDeleteTaoForm,
  isRestricted = false,
  readonly = false,
}: FabComponentProps) => {
  // status
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  // others
  const sharedUserNum = tripBasicRef?.current?.sharedUsers.length ?? 0;

  useEffect(() => {
    if (tripBasic) {
      setIsPublished(tripBasic.isPublic);
      setIsBookmarked(tripBasic.isBookmarked);
    }
  }, [tripBasic]);

  const togglePublishStatus = async () => {
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
        `Successfully make the trip ${
          tripBasicRef.current.isPublic ? "public" : "private"
        }.`,
        {
          variant: "success",
        },
      );
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const toggleIsBookmarked = async () => {
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
        `Successfully ${
          tripBasicRef.current.isBookmarked ? "bookmarked" : "unbookmarked"
        } the trip.`,
        {
          variant: "success",
        },
      );
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleTripPdfClick = async () => {
    try {
      await usersService.isMember();
      setOpenTripPdfForm(true);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  // fabs

  const fabs = [
    // bookmark action
    {
      label: tripBasicRef.current?.isBookmarked
        ? "Remove Bookmark"
        : "Add Bookmark",
      content: isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />,
      description: "utility",
      styling: "bookmark",
      stylingCondition: [
        !Boolean(tao) && "visible",
        isBookmarked && "bookmarked",
      ],
      onClick: toggleIsBookmarked,
    },
    // visibility action - private/public status
    {
      label: tripBasicRef.current?.isPublic ? "Set Private" : "Set Public",
      condition: !readonly,
      content: isPublished ? <VisibilityIcon /> : <VisibilityOffIcon />,
      description: "utility",
      stylingCondition: [!Boolean(tao) && "visible"],
      onClick: togglePublishStatus,
    },
    // shared group setting
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
      onClick: () => setOpenTripShareForm(true),
    },
    // download as PDF
    {
      label: "Download as PDF",
      content: <DownloadIcon />,
      description: "utility",
      stylingCondition: [!Boolean(tao) && "visible"],
      onClick: handleTripPdfClick,
    },
    // add action - tao
    {
      label: "Add Event",
      condition: !readonly,
      content: <AddIcon />,
      description: "info",
      stylingCondition: [!Boolean(tao) && !isOverview && "visible"],
      onClick: () => setOpenEditTaoForm(true),
    },
    // edit action - tao
    {
      label: "Edit event",
      condition: !readonly,
      content: <EditIcon />,
      description: "info",
      stylingCondition: [Boolean(tao) && "visible"],
      onClick: () => setOpenEditTaoForm(true),
    },
    // delete action - day, tao
    {
      label: Boolean(tao) ? "Delete event" : "Delete day",
      condition: !readonly,
      content: <DeleteForeverIcon />,
      description: "error",
      stylingCondition: !isOverview && "visible",
      onClick: Boolean(tao)
        ? () => setOpenDeleteTaoForm(true)
        : () => setOpenDeleteDayForm(true),
    },
  ] as UtilityItem[];

  return (
    <React.Fragment>
      {fabs.map((fab, i) => {
        return fab.condition !== false ? (
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
        ) : undefined;
      })}
    </React.Fragment>
  );
};

export default FabComponent;
