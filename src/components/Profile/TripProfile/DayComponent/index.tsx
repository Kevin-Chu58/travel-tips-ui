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
import type { GeoCoordinate, NavTab } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import { enqueueSnackbar } from "notistack";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import DaySchedule from "@components/Schedule/DaySchedule";
import type { Tao } from "@services/taos";
import TTTabs from "@components/TTTabs";
import React, { useState } from "react";
import clsx from "clsx";
import "./index.scss";
import DayEvent from "@components/Schedule/DayEvent";

type DayComponentProps = {
  day: Day | undefined;
  taos: Tao[] | undefined;
  navTabValue: number;
  setTao: (state: Tao) => void;
  syncEditDay: (state: Day) => void;
  syncAddDayTaos: (state: Tao) => void;
  syncEditDayTaos: (state: Tao) => void;
  lastGeoCoordinate?: GeoCoordinate | undefined;
  setLastGeoCoordinate?: (state: GeoCoordinate) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  readonly?: boolean;
};

const DayComponent = ({
  day,
  taos,
  navTabValue,
  setTao,
  syncEditDay,
  syncAddDayTaos,
  syncEditDayTaos,
  lastGeoCoordinate,
  setLastGeoCoordinate,
  inputRef,
  readonly = false,
}: DayComponentProps) => {
  const viewNavTabs = [
    {
      name: "event",
      label: "Event",
    },
    {
      name: "calendar",
      label: "Calendar",
    },
  ] as NavTab[];

  // window
  const isMobile = useIsMobile();
  // day title
  const [dayTitle, setDayTitle] = useState<string | undefined>();
  const [openDayTitle, setOpenDayTitle] = useState<boolean>(false);
  // view - nav tabs
  const [viewNavTabValue, setViewNavTabValue] = useState<number>(0);

  const updateDayTitle = async () => {
    try {
      const trimmedDayTitle = dayTitle?.trim();

      if (trimmedDayTitle && trimmedDayTitle.length > 50) {
        enqueueSnackbar("Day title is too long.", { variant: "error" });
        handleCloseDayTitle();
        return;
      }

      if (day?.title !== trimmedDayTitle && day?.id) {
        let dayPatch = { title: trimmedDayTitle };
        let updatedDay = await daysService.patchDay(day.id, dayPatch);

        BehaviorUtils.sleep();

        syncEditDay(updatedDay);
        enqueueSnackbar("Successfully updated day title.", {
          variant: "success",
        });
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
        ) : !readonly ? (
          day?.title ? (
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
              className="trip-profile-day-comp-add-title-button"
              startIcon={<AddIcon />}
              color="primary"
              onClick={handleOpenDayTitle}
            >
              add title
            </TTButton>
          )
        ) : (
          <Typography className="trip-profile-day-comp-title">
            {day?.title}
          </Typography>
        )}
      </Box>

      {/* view nav tabs - switch variant */}
      <Box className="trip-profile-day-comp-view-tab-box">
        <TTTabs
          navTabs={viewNavTabs}
          navTabValue={viewNavTabValue}
          setNavTabValue={setViewNavTabValue}
          variant="switch"
        />
      </Box>

      <Divider variant="middle" flexItem />

      <Box className="trip-profile-day-comp-content-box">
        {/* views */}
        <Box
          className={clsx(
            "trip-profile-day-comp-schedule-box",
            viewNavTabValue === 1 && "day-schedule",
            isMobile && "mobile"
          )}
        >
          {viewNavTabValue === 0 ? (
            <DayEvent taos={taos} setTao={setTao} />
          ) : viewNavTabValue === 1 ? (
            <DaySchedule
              dayIndex={navTabValue}
              dayId={day?.id}
              taos={taos}
              setTao={setTao}
              syncAddDayTaos={syncAddDayTaos}
              syncEditDayTaos={syncEditDayTaos}
              lastGeoCoordinate={lastGeoCoordinate}
              setLastGeoCoordinate={setLastGeoCoordinate}
              readonly={readonly}
            />
          ) : undefined}
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default DayComponent;
