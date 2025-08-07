import TTButton from "@components/TTButton";
import {
  Box,
  Button,
  Divider,
  FormControl,
  OutlinedInput,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { daysService, type Day } from "@services/days";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { useIsMobile } from "@hooks/useIsMobile";
import { enqueueSnackbar } from "notistack";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import DaySchedule from "@components/DaySchedule";
import clsx from "clsx";
import "./index.scss";
import type { Tao } from "@services/taos";

type DayComponentProps = {
  day: Day | undefined;
  taos: Tao[] | undefined;
  navTabValue: number;
  setIsParentUpdated: () => void;
  setAreTaosUpdated: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const DayComponent = ({
  day,
  taos,
  navTabValue,
  setIsParentUpdated,
  setAreTaosUpdated,
  inputRef,
}: DayComponentProps) => {
  // window
  const isMobile = useIsMobile();
  // day title
  const [dayTitle, setDayTitle] = useState<string | undefined>();
  const [openDayTitle, setOpenDayTitle] = useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const updateDayTitle = async () => {
    try {
      const trimmedDayTitle = dayTitle?.trim();

      if (trimmedDayTitle && trimmedDayTitle.length > 50) {
        enqueueSnackbar("Day title is too long.", { variant: "error" });
        handleCloseDayTitle();
        return;
      }

      if (day?.title !== trimmedDayTitle && day?.id && token) {
        let dayPatch = { title: trimmedDayTitle };
        await daysService.patchDay(day.id, dayPatch, token);

        BehaviorUtils.sleep();
        enqueueSnackbar("Successfully updated day title.", {
          variant: "success",
        });
        setIsParentUpdated();
      }
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }

    handleCloseDayTitle();
  };

  const handleDayTitleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      updateDayTitle();
    }
  };

  const handleOpenDayTitle = () => {
    setOpenDayTitle(true);
    setDayTitle(day?.title);
  };

  const handleCloseDayTitle = () => {
    setOpenDayTitle(false);
    setDayTitle(undefined);
  };

  return (
    <React.Fragment>
      <Box
        className={clsx(
          "trip-profile-day-comp-header-box",
          isMobile && "mobile"
        )}
      >
        <Box>
          <Typography className="trip-profile-day-comp-title-box">
            Day {navTabValue}
          </Typography>
        </Box>

        {openDayTitle ? (
          <React.Fragment>
            <FormControl variant="outlined">
              <OutlinedInput
                className="trip-profile-day-comp-input"
                ref={inputRef}
                value={dayTitle}
                onChange={(e) => setDayTitle(e.target.value)}
                endAdornment={`${dayTitle?.length}/50`}
                onBlur={updateDayTitle}
                onKeyDown={(e) => handleDayTitleKeyDown(e)}
                autoFocus
                size="small"
              />
            </FormControl>
          </React.Fragment>
        ) : day?.title ? (
          <React.Fragment>
            <Button
              className={clsx(
                "trip-profile-day-comp-title-button",
                isMobile && "mobile"
              )}
              onClick={handleOpenDayTitle}
            >
              <Typography className="trip-profile-day-comp-title">
                {day?.title}
              </Typography>
            </Button>
          </React.Fragment>
        ) : (
          <TTButton
            className={clsx(
              "trip-profile-day-comp-add-title-button",
              isMobile && "mobile"
            )}
            startIcon={<AddIcon />}
            color="primary"
            onClick={handleOpenDayTitle}
          >
            add title
          </TTButton>
        )}
      </Box>

      <Divider variant="middle" flexItem />

      {/** TODO - trip attraction orders */}
      <Box className="trip-profile-day-comp-content-box">
        <Box
          className={clsx(
            "trip-profile-day-comp-schedule-box",
            isMobile && "mobile"
          )}
        >
          <DaySchedule dayIndex={navTabValue} dayId={day?.id} taos={taos} setIsParentUpdated={setAreTaosUpdated} />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default DayComponent;
