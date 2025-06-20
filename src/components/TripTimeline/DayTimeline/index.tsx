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
import { type ReactNode } from "react";
import type { Day } from "@services/days";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { DayFormParams } from "@constants/Types";
import AddTaoButton from "../AddTaoButton";
import { Timeline } from "@mui/lab";

type DayTimelineProps = {
  i: number;
  day: Day;
  onDay: Day | undefined;
  setOnDay: (stete: Day | undefined) => void;
  editDay: number | undefined;
  setEditDay: (state: number | undefined) => void;
  setDeleteDay: () => void;
  dayFormData: DayFormParams;
  handleDayFormChange: (key: string, value: any) => void;
  handleUpdateDay: () => void;
  setEditTao: (state: number | undefined, order?: number) => void;
  readonly?: boolean;
  children: ReactNode;
  sx?: SxProps;
};

const DayTimeline = ({
  i,
  day,
  onDay,
  setOnDay,
  editDay,
  setEditDay,
  setDeleteDay,
  dayFormData,
  handleDayFormChange,
  handleUpdateDay,
  setEditTao,
  readonly = false,
  children,
  sx,
}: DayTimelineProps) => {

  // return false if Taos is undefined or empty, true otherwise
  const isTaosValid = () => {
    return day.tripAttractionOrders && day.tripAttractionOrders?.length > 0;
  };

  return (
    <Grid
      key={`trip-day-${day.id}`}
      onMouseEnter={() => setOnDay(day)}
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
                      onChange={(value) => handleDayFormChange("start", value)}
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
              {!readonly && day.id === onDay?.id && (
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
                    onClick={setDeleteDay}
                  >
                    <DeleteIcon />
                  </TTIconButton>
                </Box>
              )}
            </Grid>
            <Typography>
              {TimeUtils.formatTime(day.start)} -{" "}
              {TimeUtils.formatTime(day.end)}{" "}
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
          <AddTaoButton onClick={() => setEditTao(undefined, 0)} />
        ) : (
          <>{children}</>
        )}
      </Timeline>
    </Grid>
  );
};

export default DayTimeline;
