import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { type TripDetail } from "@services/trips";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { daysService, type Day } from "@services/days";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import RouteEditor from "@components/RouteEditor";

dayjs.extend(customParseFormat);

type TripDaysProps = {
  tripDetail: TripDetail | undefined;
  token: string | null;
  render: () => void;
};

const TripDays = ({ tripDetail, token, render }: TripDaysProps) => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [errorParams, setErrorParams] = useState<string[]>([]);
  // add new day
  const startDefault = dayjs().hour(8).minute(0).second(0);
  const endDefault = dayjs().hour(20).minute(0).second(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [start, setStart] = useState<Dayjs | null>(startDefault);
  const [end, setEnd] = useState<Dayjs | null>(endDefault);
  // edit day
  const [editDay, setEditDay] = useState<number | undefined>();
  const [nameEdit, setNameEdit] = useState<string | undefined>();
  const [descriptionEdit, setDescriptionEdit] = useState<string | undefined>();
  const [startEdit, setStartEdit] = useState<Dayjs | null>(startDefault);
  const [endEdit, setEndEdit] = useState<Dayjs | null>(endDefault);
  // edit routes
  const [editTao, setEditTao] = useState<number | undefined>();

  const formatTime = (time: string, ampm: boolean = true) => {
    return dayjs(time, "HH:mm:ss").format(ampm ? "HH:mm A" : "HH:mm");
  }

  // day

  const handleDeleteDay = async (id: number) => {
    if (token) {
      await daysService.deleteDay(id, token);
      render();
    }
  };

  // new day menu

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
    setName("");
    setDescription("");
    setStart(startDefault);
    setEnd(endDefault);
  };

  const handleConfirm = async () => {
    let invalidParams = isDayValid(name, description, start, end);
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      const newDay = {
        name: name,
        description: description,
        start: (start ?? startDefault).format("HH:mm:ss"),
        end: (end ?? endDefault).format("HH:mm:ss"),
        tripId: Number(tripId),
      };

      if (token) {
        await daysService.postNewDay(newDay, token);
        handleCloseMenu();
        render();
      }
    }
  };

  const isDayValid = (
    name: string,
    description: string,
    start: Dayjs | null,
    end: Dayjs | null
  ) => {
    let invalidParams = [];
    if (name.length > 50) invalidParams.push("name");
    if (description.length > 1000) invalidParams.push("description");
    if (!start || !end || start?.isSame(end)) invalidParams.push("times");

    return invalidParams;
  };

  // edit day

  const handleToEditDay = (day: Day) => {
    setEditDay(day.id);
    setNameEdit(day.name);
    setDescriptionEdit(day.description);
    setStartEdit(dayjs(day.start, "HH:mm:ss"));
    setEndEdit(dayjs(day.end, "HH:mm:ss"));
    render();
  };

  const handleUpdateDay = async (id: number) => {
    let invalidParams = isDayValid(
      nameEdit ?? "",
      descriptionEdit ?? "",
      startEdit,
      endEdit
    );
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      const day = {
        name: nameEdit,
        description: descriptionEdit,
        start: (startEdit ?? startDefault).format("HH:mm:ss"),
        end: (endEdit ?? endDefault).format("HH:mm:ss"),
      };

      if (token) {
        await daysService.patchDay(id, day, token);
        setEditDay(undefined);
        render();
      }
    }
  };

  return (
    <Grid container size={14} columns={14} spacing={2} mt={2}>
      {/* day nav tab */}
      <Grid size={2}>
        <List sx={{ p: 0 }}>
          {tripDetail?.days?.map((day, i) => (
            <ListItem key={`trip-edit-day-${i}-nav`} disablePadding>
              <ListItemButton
                disableRipple
                // onClick={() => navigate(`/workshop/trip/${tripId}/days/${i+1}`)}
              >
                <ListItemText primary={`Day ${i + 1}`} />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteDay(day.id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key={`trip-edit-day-add`} disablePadding>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setIsOpen(true)}
              sx={{ mx: "auto" }}
            >
              new day
            </Button>
          </ListItem>
        </List>
      </Grid>

      {/* day content */}
      <Grid direction="column" size={12} spacing={1} sx={{maxHeight: "75vh"}}>
        {tripDetail?.days?.map((day, i) => (
          <Grid key={`trip-edit-day-${i}`} size={12}>
            <Box p={1}>
              {editDay !== day.id ? (
                <>
                  <Grid container size={12} direction="row">
                    <Typography variant="h6">
                      Day {i + 1} {day.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleToEditDay(day)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Grid>
                  <Typography>
                    {formatTime(day.start)} - {formatTime(day.end)} {day.isOverNight ? "overnight" : ""}
                  </Typography>
                  <Typography whiteSpace="pre-line">{day.description}</Typography>
                </>
              ) : (
                <>
                  <Grid container alignItems="center">
                    <Typography variant="h6">Day {i + 1}</Typography>
                      <IconButton
                        disableRipple
                        color="error"
                        onClick={() => setEditDay(undefined)}
                      >
                        <CloseIcon />
                      </IconButton>
                      <IconButton
                        disableRipple
                        color="success"
                        onClick={() => handleUpdateDay(day.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                  </Grid>
                  <Grid p={2}>
                    <TextField
                      label="Name"
                      value={nameEdit}
                      onChange={(e) => setNameEdit(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container spacing={1} alignItems="center" my={1}>
                        <Grid>
                          <TimePicker
                            label=""
                            value={startEdit}
                            onChange={(value) => setStartEdit(value)}
                          />
                        </Grid>
                        <Grid>to</Grid>
                        <Grid>
                          <TimePicker
                            label=""
                            value={endEdit}
                            onChange={(value) => setEndEdit(value)}
                          />
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                    <TextField
                      id="day-edit-description"
                      value={descriptionEdit}
                      label="Description"
                      placeholder="description"
                      onChange={(e) => setDescriptionEdit(e.target.value)}
                      multiline
                      fullWidth
                    />
                  </Grid>
                </>
              )}
            </Box>
            <Divider />

            {/* trip attraction orders */}
            <Timeline 
              onClick={() => setEditTao(day.id)}
             sx={{
              ".MuiTypography-root": {
                mr: 0,
                flex: 0,
                WebkitFlex: 0,
            }}}>
              <TimelineItem>
                <TimelineOppositeContent>
                  {formatTime(day.start)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Start</TimelineContent>
              </TimelineItem>
              {/* {day.tripAttractionOrder?.map((tao, i) => ( */}
                {/* <TimelineItem>
                <TimelineOppositeContent>
                  {day.start}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Start</TimelineContent>
              </TimelineItem> */}
              {/* ))} */}
              <TimelineItem>
                <TimelineOppositeContent>
                  {formatTime(day.end)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>End</TimelineContent>
              </TimelineItem>
            </Timeline>
          </Grid>
        ))}
      </Grid>

      {/* new Day */}
      <Dialog
        open={isOpen}
        onClose={handleCloseMenu}
        disablePortal={false}
        maxWidth="md"
      >
        <Grid container direction="column" spacing={1} m={4}>
          <Typography variant="h4" fontWeight={600} mb={4}>
            New Day
          </Typography>
          {errorParams.length > 0 && (
            <Typography variant="body1" color="error">
              Invalid inputs: {errorParams?.toString()}
            </Typography>
          )}
          <TextField
            id="new-day-name"
            value={name}
            label="Name"
            placeholder="name"
            onChange={handleChangeName}
          />
          <TextField
            id="new-day-description"
            value={description}
            label="Description"
            placeholder="description"
            onChange={handleChangeDescription}
            multiline
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container direction="column" spacing={1} my={1}>
              <Grid size={12}>
                <Typography variant="body1">Start Time</Typography>
                <TimePicker
                  label=""
                  value={start}
                  onChange={(value) => setStart(value)}
                />
              </Grid>
              <Grid size={12}>
                <Typography variant="body1">End Time</Typography>
                <TimePicker
                  label=""
                  value={end}
                  onChange={(value) => setEnd(value)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Box display="flex" flexDirection="row" mt={2}>
            <Button onClick={handleCloseMenu} variant="outlined" disableRipple>
              cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              sx={{ ml: "auto" }}
              disableRipple
            >
              confirm
            </Button>
          </Box>
        </Grid>
      </Dialog>

      {/* route editor */}
      <RouteEditor tripDetail={tripDetail} open={Boolean(editTao)} setOpen={setEditTao} />
    </Grid>
  );
};

export default TripDays;
