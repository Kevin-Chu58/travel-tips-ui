import ToolTip from "@components/ToolTip";
import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from "@mui/icons-material/Add";
import { enqueueSnackbar } from "notistack";
import { tripsService, type Trip } from "@services/trips";
import type { Tao } from "@services/taos";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import "./index.scss";

type FabComponentProps = {
  tripBasicRef: React.RefObject<Trip | undefined>;
  tripBasic: Trip | undefined;
  tao: Tao | undefined;
  isOverview: boolean;
  setOpenTripShareForm: (state: boolean) => void;
  setOpenDeleteDayForm: (state: boolean) => void;
  setOpenEditTaoForm: (state: boolean) => void;
  setOpenDeleteTaoForm: (state: boolean) => void;
  readonly?: boolean;
};

const FabComponent = ({
  tripBasicRef,
  tripBasic,
  tao,
  isOverview,
  setOpenTripShareForm,
  setOpenDeleteDayForm,
  setOpenEditTaoForm,
  setOpenDeleteTaoForm,
  readonly = false,
}: FabComponentProps) => {
  // status
  const [isPublished, setIsPublished] = useState<boolean>(false);

  useEffect(() => {
    if (tripBasic) {
      setIsPublished(tripBasic.isPublic);
    }
  }, [tripBasic]);

  const togglePublishStatus = async () => {
    if (tripBasicRef.current) {
      try {
        let newPublishState = !tripBasicRef.current.isPublic;

        await tripsService.patchTripIsPublic(
          [tripBasicRef.current.id],
          newPublishState
        );

        tripBasicRef.current.isPublic = newPublishState;
        setIsPublished(newPublishState);

        enqueueSnackbar(
          `Successfully make the trip ${
            tripBasicRef.current.isPublic ? "public" : "private"
          }.`,
          {
            variant: "success",
          }
        );
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  return (
    <React.Fragment>
      {/* visibility action - private/public status */}
      {!readonly ? (
        <ToolTip
          title={tripBasicRef.current?.isPublic ? "Private" : "Public"}
          placement="right"
        >
          <Fab
            color="primary"
            className={clsx(
              "trip-profile-fab-comp-tool-fab",
              !Boolean(tao) && "visible"
            )}
            onClick={togglePublishStatus}
            size="medium"
          >
            {isPublished ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </Fab>
        </ToolTip>
      ) : undefined}

      {/* shared group setting */}
      {!readonly ? (
        <ToolTip
          title="Shared Users"
          placement="right"
        >
          <Fab
            color="primary"
            className={clsx(
              "trip-profile-fab-comp-tool-fab",
              !Boolean(tao) && "visible"
            )}
            onClick={() => setOpenTripShareForm(true)}
            size="medium"
          >
            <GroupIcon />
          </Fab>
        </ToolTip>
      ) : undefined}

      {/* add action - tao */}
      {!readonly ? (
        <ToolTip title="Add Event" placement="right">
          <Fab
            color="info"
            className={clsx(
              "trip-profile-fab-comp-tool-fab",
              !Boolean(tao) && !isOverview && "visible"
            )}
            onClick={() => setOpenEditTaoForm(true)}
            size="medium"
          >
            <AddIcon />
          </Fab>
        </ToolTip>
      ) : undefined}

      {/* edit action - tao */}
      {!readonly ? (
        <ToolTip title="Edit event" placement="right">
          <Fab
            color="info"
            className={clsx(
              "trip-profile-fab-comp-tool-fab",
              Boolean(tao) && "visible"
            )}
            onClick={() => setOpenEditTaoForm(true)}
            size="medium"
          >
            <EditIcon />
          </Fab>
        </ToolTip>
      ) : undefined}

      {/* delete action - day, tao */}
      {!readonly ? (
        <ToolTip
          title={Boolean(tao) ? "Delete event" : "Delete day"}
          placement="right"
        >
          <Fab
            className={clsx(
              "trip-profile-fab-comp-tool-fab",
              "delete",
              !isOverview && "visible"
            )}
            onClick={
              Boolean(tao)
                ? () => setOpenDeleteTaoForm(true)
                : () => setOpenDeleteDayForm(true)
            }
            size="medium"
          >
            <DeleteForeverIcon />
          </Fab>
        </ToolTip>
      ) : undefined}
    </React.Fragment>
  );
};

export default FabComponent;
