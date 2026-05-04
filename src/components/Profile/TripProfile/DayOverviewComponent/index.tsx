import { Box, Divider, Grid, Typography } from "@mui/material";
import { daysService, type Day } from "@services/days";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router";
import { useIsMobile } from "@hooks/useIsMobile";
import React, { useCallback, useMemo, useState } from "react";
import ToolTip from "@components/ToolTip";
import TTIconButton from "@components/TTIconButton";
import { enqueueSnackbar } from "notistack";
import type { Trip } from "@services/trips";
import { max_day_per_trip } from "@constants/Restrictions";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteDayForm from "@components/Forms/DeleteDayForm";
import ClearIcon from "@mui/icons-material/Clear";
import clsx from "clsx";
import "./index.scss";

// components

type DayOverviewItemProps = {
  day: Day;
  index: number;
  focusId: number;
  onClick: (dayId: number, index: number) => void;
  deleteMode: boolean;
  onDeleteClick: (state: Day) => void;
};

const DayOverviewItem = React.memo(
  ({
    day,
    index,
    focusId,
    onClick,
    deleteMode,
    onDeleteClick,
  }: DayOverviewItemProps) => (
    <Grid size={6} key={day.id}>
      <Box className="trip-profile-day-overview-comp-day-overview-item">
        <Box
          className={clsx(
            "trip-profile-day-overview-comp-day-box",
            focusId === day.id && "focus",
          )}
          onClick={() => onClick(day.id, index)}
        >
          <Typography
            className={clsx(
              "trip-profile-day-overview-comp-day-header",
              focusId === day.id && "focus",
            )}
          >
            {`Day ${index + 1}`}
          </Typography>
          <Typography
            className={clsx(
              "trip-profile-day-overview-comp-day-arrow-button",
              focusId === day.id && "focus",
            )}
          >
            <ArrowRight />
          </Typography>
        </Box>
        {deleteMode && (
          <Box className="delete-box">
            <TTIconButton
              className="delete-icon-button"
              onClick={() => onDeleteClick(day)}
              noBorder
            >
              <ClearIcon />
            </TTIconButton>
          </Box>
        )}
      </Box>
    </Grid>
  ),
);

type DayOverviewComponentProps = {
  trip: Trip | undefined;
  days: Day[];
  setDays: React.Dispatch<React.SetStateAction<Day[]>>;
  focusId: number;
  setFocusId: (state: number) => void;
  readonly: boolean;
};

const DayOverviewComponent = ({
  trip,
  days,
  setDays,
  focusId,
  setFocusId,
  readonly,
}: DayOverviewComponentProps) => {
  // form open status
  const [openDeleteDayForm, setOpenDeleteDayForm] = useState<boolean>(false);
  const [dayFocus, setDayFocus] = useState<Day>();
  // behavior
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  // others
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const dayId = useMemo(
    () =>
      dayFocus ? days.findIndex((d) => d.id === dayFocus.id) + 1 : undefined,
    [dayFocus],
  );

  // async functions

  const asyncDeleteDay = useCallback(() => {
    let _days = days.filter((d) => d.id !== dayFocus?.id);
    setDays([..._days]);
  }, [dayFocus, days, setDays]);

  // handle functions

  const handleClick = useCallback(
    (dayId: number, i: number) => {
      const scrollY = window.scrollY; // save position

      if (focusId !== dayId) {
        setFocusId(dayId);
      } else {
        navigate(`day/${i + 1}`);
      }

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY); // restore after render
      });
    },
    [focusId, setFocusId, navigate],
  );

  const handlePostDay = useCallback(async () => {
    // check if max day is reached
    if (days.length >= max_day_per_trip) {
      enqueueSnackbar("Max number of days reached per trip.", {
        variant: "error",
      });
      return;
    }

    if (trip) {
      try {
        const newDay = await daysService.postNewDay(trip.id);
        setDays((prev) => [...prev, newDay]);
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  }, [trip, days, enqueueSnackbar, navigate]);

  const handleDeleteMode = useCallback(() => {
    setDeleteMode((prev) => !prev);
  }, []);

  const handleDeleteDay = useCallback((day: Day) => {
    setDayFocus(day);
    setOpenDeleteDayForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setDayFocus(undefined);
    setOpenDeleteDayForm(false);
  }, [setOpenDeleteDayForm]);

  return (
    <React.Fragment>
      {days.length > 0 ? (
        <React.Fragment>
          <Box className="row full">
            <Typography className="trip-profile-day-overview-comp-header">
              Overview
            </Typography>
            {/* add/delete day button */}
            {!readonly && (
              <Box className="row right">
                <ToolTip title="Add new day" offsetY={-8}>
                  <Box>
                    <TTIconButton size="small" onClick={handlePostDay} noBorder>
                      <AddIcon fontSize="small" />
                    </TTIconButton>
                  </Box>
                </ToolTip>
                <Divider orientation="vertical" variant="middle" flexItem />
                <ToolTip title="Delete day" offsetY={-8}>
                  <Box>
                    <TTIconButton
                      size="small"
                      onClick={handleDeleteMode}
                      noBorder
                    >
                      <RemoveIcon fontSize="small" />
                    </TTIconButton>
                  </Box>
                </ToolTip>
              </Box>
            )}
          </Box>
          <Grid container columns={!isMobile ? 12 : 6} spacing={2}>
            {days.map((day, i) => (
              <DayOverviewItem
                key={day.id}
                day={day}
                index={i}
                focusId={focusId}
                onClick={handleClick}
                deleteMode={deleteMode}
                onDeleteClick={handleDeleteDay}
              />
            ))}
          </Grid>
        </React.Fragment>
      ) : undefined}
      {openDeleteDayForm && (
        <DeleteDayForm
          open
          onClose={handleCloseForm}
          day={dayFocus}
          dayId={dayId}
          asyncDeleteDay={asyncDeleteDay}
        />
      )}
    </React.Fragment>
  );
};

export default DayOverviewComponent;
