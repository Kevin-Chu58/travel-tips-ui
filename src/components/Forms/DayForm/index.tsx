import {
  Box,
  Button,
  Dialog,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import type { Dayjs } from "dayjs";

type DayFormProps = {
  name: string | undefined;
  description: string | undefined;
  start: Dayjs | null;
  end: Dayjs | null;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setStart: (start: Dayjs | null) => void;
  setEnd: (end: Dayjs | null) => void;
  errorParams: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DayForm = ({
  name,
  description,
  start,
  end,
  setName,
  setDescription,
  setStart,
  setEnd,
  errorParams,
  open,
  onClose,
  onConfirm,
}: DayFormProps) => {
  return (
    <Dialog open={open} onClose={onClose} disablePortal={false} maxWidth="md">
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
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="new-day-description"
          value={description}
          label="Description"
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
          multiline
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container direction="column" spacing={1} my={1}>
            <Grid size={12}>
              <Typography variant="body1">Start Time*</Typography>
              <TimePicker
                label=""
                value={start}
                onChange={(value) => setStart(value)}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="body1">End Time*</Typography>
              <TimePicker
                label=""
                value={end}
                onChange={(value) => setEnd(value)}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        <Box display="flex" flexDirection="row" mt={2}>
          <Button onClick={onClose} variant="outlined" disableRipple>
            cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{ ml: "auto" }}
            disableRipple
          >
            confirm
          </Button>
        </Box>
      </Grid>
    </Dialog>
  );
};

export default DayForm;
