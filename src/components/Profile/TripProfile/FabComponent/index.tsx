import ToolTip from "@components/ToolTip";
import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { tripsService, type Trip } from "@services/trips";
import type { Tao } from "@services/taos";
import React from "react";
import clsx from "clsx";
import "./index.scss";

type FabComponentProps = {
  tripBasic: Trip | undefined;
  setTripBasic: (state: Trip) => void;
  tao: Tao | undefined;
  isOverview: boolean;
  setOpenDeleteDayForm: (state: boolean) => void;
  setOpenEditTaoForm: (state: boolean) => void;
  setOpenDeleteTaoForm: (state: boolean) => void;
};

const FabComponent = ({
  tripBasic,
  setTripBasic,
  tao,
  isOverview,
  setOpenDeleteDayForm,
  setOpenEditTaoForm,
  setOpenDeleteTaoForm,
}: FabComponentProps) => {
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const togglePublishStatus = async () => {
    if (tripBasic && token) {
      try {
        await tripsService.patchTripIsPublic(
          [tripBasic.id],
          !tripBasic.isPublic,
          token
        );

        enqueueSnackbar(
          `Successfully ${
            tripBasic.isPublic ? "unpublished" : "published"
          } the trip.`,
          {
            variant: "success",
          }
        );

        setTripBasic({ ...tripBasic, isPublic: !tripBasic.isPublic });
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  return (
    <React.Fragment>
      {/* publish action - private/public status */}
      <ToolTip
        title={tripBasic?.isPublic ? "Unpublish" : "Publish"}
        placement="right"
      >
        <Fab
          color="primary"
          className={clsx("trip-profile-fab-comp-tool-fab", !Boolean(tao) && "visible")}
          onClick={togglePublishStatus}
          size="medium"
        >
          {tripBasic?.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </Fab>
      </ToolTip>

      {/* edit action - tao */}
      <ToolTip title="Edit event" placement="right">
        <Fab
          color="info"
          className={clsx("trip-profile-fab-comp-tool-fab", Boolean(tao) && "visible")}
          onClick={() => setOpenEditTaoForm(true)}
          size="medium"
        >
          <EditIcon />
        </Fab>
      </ToolTip>

      {/* delete action - day, tao */}
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
    </React.Fragment>
  );
};

export default FabComponent;
