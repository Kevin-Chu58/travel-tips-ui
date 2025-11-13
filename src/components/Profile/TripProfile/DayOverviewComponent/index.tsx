import { Box, Grid, Typography } from "@mui/material";
import type { Day } from "@services/days";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router";
import { useIsMobile } from "@hooks/useIsMobile";
import React from "react";
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

  const handleClick = (dayId: number, i: number) => {
    if (focusId !== dayId) {
      setFocusId(dayId);
    } else {
      navigate(`day/${i + 1}`);
    }
  };

  return (
    <React.Fragment>
      {days.length > 0 ? (
        <React.Fragment>
          <Typography className="trip-profile-day-overview-comp-header">
            Schedule
          </Typography>
          <Grid container columns={!isMobile ? 12 : 6} spacing={2}>
            {days.map((day, i) => (
              <Grid size={6} key={day.id}>
                <Box
                  className="trip-profile-day-overview-comp-day-box"
                  onClick={() => handleClick(day.id, i)}
                >
                  {/* day-header */}
                  <Typography
                    className={clsx(
                      "trip-profile-day-overview-comp-day-header",
                      focusId === day.id && "focus"
                    )}
                  >
                    {`Day ${i + 1}`}
                  </Typography>

                  {/* arrow-right */}
                  <Typography
                    className={clsx(
                      "trip-profile-day-overview-comp-day-arrow-button",
                      focusId === day.id && "focus"
                    )}
                  >
                    <ArrowRight />
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      ) : undefined}
    </React.Fragment>
  );
};

export default DayOverviewComponent;
