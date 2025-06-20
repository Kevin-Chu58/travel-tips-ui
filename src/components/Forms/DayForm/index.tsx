import type { DayFormParams } from "@constants/Types";
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

type DayFormProps = {
  dayFormData: DayFormParams;
  handleDayFormChange: (key: string, value: any) => void;
  errorParams: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DayForm = ({
  dayFormData,
  handleDayFormChange,
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
          value={dayFormData.name}
          label="Name"
          placeholder="name"
          onChange={(e) => handleDayFormChange("name", e.target.value)}
        />
        <TextField
          id="new-day-description"
          value={dayFormData.description}
          label="Description"
          placeholder="description"
          onChange={(e) => handleDayFormChange("description", e.target.value)}
          multiline
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container direction="column" spacing={1} my={1}>
            <Grid size={12}>
              <Typography variant="body1">Start Time*</Typography>
              <TimePicker
                label=""
                value={dayFormData.start}
                onChange={(value) => handleDayFormChange("start", value)}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="body1">End Time*</Typography>
              <TimePicker
                label=""
                value={dayFormData.end}
                onChange={(value) => handleDayFormChange("end", value)}
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
