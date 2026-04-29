import { Box, Grid, Typography } from "@mui/material";
import type { Day } from "@services/days";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router";
import { useIsMobile } from "@hooks/useIsMobile";
import React, { useCallback } from "react";
import clsx from "clsx";
import "./index.scss";

type DayOverviewComponentProps = {
  days: Day[];
  focusId: number;
  setFocusId: (state: number) => void;
};

const DayOverviewComponent = ({
  days,
  focusId,
  setFocusId,
}: DayOverviewComponentProps) => {
  // others
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleClick = useCallback(
    (dayId: number, i: number) => {
      if (focusId !== dayId) {
        setFocusId(dayId);
      } else {
        navigate(`day/${i + 1}`);
      }
    },
    [focusId, setFocusId, navigate],
  );

  // components

  type DayOverviewItemProps = {
    day: Day;
    index: number;
    focusId: number;
    onClick: (dayId: number, index: number) => void;
  };

  const DayOverviewItem = React.memo(
    ({ day, index, focusId, onClick }: DayOverviewItemProps) => (
      <Grid size={6} key={day.id}>
        <Box
          className="trip-profile-day-overview-comp-day-box"
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
      </Grid>
    ),
  );

  return (
    <React.Fragment>
      {days.length > 0 ? (
        <React.Fragment>
          <Typography className="trip-profile-day-overview-comp-header">
            Schedule
          </Typography>
          <Grid container columns={!isMobile ? 12 : 6} spacing={2}>
            {days.map((day, i) => (
              <DayOverviewItem
                key={day.id}
                day={day}
                index={i}
                focusId={focusId}
                onClick={handleClick}
              />
            ))}
          </Grid>
        </React.Fragment>
      ) : undefined}
    </React.Fragment>
  );
};

export default DayOverviewComponent;
