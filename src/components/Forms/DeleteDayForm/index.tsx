import { useTripTimeline } from "@components/TripTimelineMap/TripTimeline/TripTimelineProvider";
import { Box, Button, Dialog, Grid, Typography } from "@mui/material";
import TripUtils from "@utils/TripUtils";

const DeleteDayForm = () => {
  const { trip, deleteDay, setDeleteDay, handleDeleteDay } = useTripTimeline();
  const title = "Delete Day";
  const open = deleteDay;
  const onClose = () => setDeleteDay(undefined);
  const onDelete = () => handleDeleteDay(deleteDay!.id);

  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="md">
      <Grid container direction="column" spacing={1} m={4}>
        {/* title */}
        <Grid size={12}>
          <Typography variant="h4" fontWeight="bold">
            {title}
          </Typography>
        </Grid>

        {/* content */}
        <Grid size={12}>
          <Typography variant="h6" color="error">
            Are you sure you want to delete{" "}
            <strong>
              Day{" "}
              {(TripUtils.getDayIndexFromTrip(trip, deleteDay?.id ?? 0) ?? 0) +
                1}{" "}
              {deleteDay?.name && `- ${deleteDay?.name}`}
            </strong>
            ?
          </Typography>
        </Grid>

        {/* buttons */}
        <Grid size={12} justifyContent="center">
          <Box display="flex">
            <Button
              variant="outlined"
              color="primary"
              onClick={onClose}
              disableRipple
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onDelete}
              disableRipple
              sx={{ ml: "auto" }}
            >
              Delete
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default DeleteDayForm;
