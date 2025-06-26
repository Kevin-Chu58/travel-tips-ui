import ConditionalSuccessIconGroup from "@components/ButtonGroup/ConditionalSuccessButtonGroup";
import TTIconButton from "@components/TTIconButton";
import { Headers, WorkshopToNavTab } from "@constants/Layouts";
import {
  Box,
  Divider,
  Grid,
  TextField,
  Typography,
  type SxProps,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TimeUtils from "@utils/TimeUtils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import type { Day } from "@services/days";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddTaoButton from "../AddTaoButton";
import { Timeline } from "@mui/lab";
import { useTripTimeline } from "../TripTimelineProvider";
import DayTimelineItem from "./DayTimelineItem";
import type { MapRouteType } from "@constants/Maps";
import type { Route } from "@constants/Types";

type DayTimelineProps = {
  i: number;
  day: Day;
  setOnDay: (stete: Day | undefined) => void;
  setMapFocusId?: (state: string | undefined) => void;
  readonly?: boolean;
  sx?: SxProps;

  mapRoutes?: Route[];
  mapRouteTypes: string[];
  mapFocusId?: string;
  updateRoutes?: (
    dayId: number,
    taoId: number,
    type: MapRouteType,
    coords: [number, number][]
  ) => void;
};

const DayTimeline = React.memo(
  ({
    i,
    day,
    setOnDay,
    setMapFocusId = () => {},
    readonly = false,
    sx,

    mapRoutes,
    mapRouteTypes,
    mapFocusId,
    updateRoutes,
  }: DayTimelineProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const {
      editDay,
      setEditDay,
      setDeleteDay,
      dayFormData,
      updateOpenEditTao,
      handleDayFormChange,
      handleUpdateDay,
    } = useTripTimeline();

    // return false if Taos is undefined or empty, true otherwise
    const isTaosValid = () => {
      return day.tripAttractionOrders && day.tripAttractionOrders?.length > 0;
    };

    const handleHover = () => {
      setIsHovered(true);
      setMapFocusId(undefined);
    };

    return (
      <Grid
        onMouseEnter={handleHover}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
        size={12}
        width="100%"
      >
        <Box
          pt={2}
          pl={2}
          sx={{
            zIndex: 10,
            position: "sticky",
            top: WorkshopToNavTab - Headers,
            bgcolor: "secondary.main",
            ...sx,
          }}
        >
          {editDay === day.id ? (
            <>
              <Grid container alignItems="center">
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Day {i + 1}
                </Typography>
                <ConditionalSuccessIconGroup
                  onClose={() => setEditDay(undefined)}
                  onConfirm={() => handleUpdateDay()}
                  sx={{ ml: "auto", mr: 2 }}
                />
              </Grid>
              <Grid p={2}>
                <TextField
                  label="Name"
                  value={dayFormData.name}
                  sx={{ ".MuiInputBase-input": { fontWeight: "bold" } }}
                  onChange={(e) => handleDayFormChange("name", e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={1} alignItems="center" my={1}>
                    <Grid>
                      <TimePicker
                        label=""
                        value={dayFormData.start}
                        onChange={(value) =>
                          handleDayFormChange("start", value)
                        }
                      />
                    </Grid>
                    <Grid>to</Grid>
                    <Grid>
                      <TimePicker
                        label=""
                        value={dayFormData.end}
                        onChange={(value) => handleDayFormChange("end", value)}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
                <TextField
                  id="day-description"
                  value={dayFormData.description}
                  label="Description"
                  placeholder="description"
                  onChange={(e) =>
                    handleDayFormChange("description", e.target.value)
                  }
                  multiline
                  fullWidth
                  sx={{ width: "50%" }}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid container size={12} direction="row" alignItems="center">
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Day {i + 1}
                </Typography>
                <Typography variant="h6" fontWeight="bold" ml={1}>
                  {day.name}
                </Typography>
                {!readonly 
                && isHovered
                 && (
                  <Box position="absolute" right={10}>
                    <TTIconButton
                      size="small"
                      sx={{
                        color: "secondary.main",
                        bgcolor: "secondary.900",
                        ":hover": {
                          bgcolor: "secondary.dark",
                        },
                      }}
                      onClick={() => setEditDay(day.id)}
                    >
                      <EditIcon />
                    </TTIconButton>
                    <TTIconButton
                      size="small"
                      sx={{
                        color: "secondary.main",
                        bgcolor: "error.main",
                        ":hover": {
                          bgcolor: "error.dark",
                        },
                      }}
                      onClick={() => setDeleteDay(day)}
                    >
                      <DeleteIcon />
                    </TTIconButton>
                  </Box>
                )}
              </Grid>
              <Typography>
                {TimeUtils.formatTime(day.start)} -{" "}
                {TimeUtils.formatTime(day.end)}{" "}
                {/** TODO - the day is overnight is not updated when day updates */}
                {day.isOverNight ? "overnight" : ""}
              </Typography>
              <Typography whiteSpace="pre-line">{day.description}</Typography>
            </>
          )}
          <Divider />
        </Box>

        {/* trip attraction orders */}
        <Timeline
          key={day.id}
          sx={{
            ".MuiTypography-root": {
              mr: 0,
              flex: 0,
              WebkitFlex: 0,
            },
            maxWidth: "100%",
            position: "relative",
            ...sx,
          }}
        >
          {!readonly && !isTaosValid() ? (
            <AddTaoButton onClick={() => updateOpenEditTao(undefined, 0)} />
          ) : (
            <>
              {/* trip attraction orders */}
              {day.tripAttractionOrders?.map((tao, j) => (
                <DayTimelineItem
                  key={tao.id}
                  day={day}
                  setOnDay={setOnDay}
                  tao={tao}
                  route={mapRoutes?.at(j)}
                  i={i}
                  j={j}
                  mapRouteType={mapRouteTypes?.at(j) ?? ""}
                  mapFocusId={mapFocusId}
                  setMapFocusId={setMapFocusId}
                  updateRoutes={updateRoutes}
                  readonly={readonly}
                />
              ))}
            </>
          )}
        </Timeline>
      </Grid>
    );
  }
);

export default DayTimeline;
