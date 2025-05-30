import { Box, Button, Dialog, Grid, Typography } from "@mui/material";
import type { ReactNode } from "react";

type DeleteConfirmFormProps = {
  title: string;
  open: any;
  onClose: () => void;
  onDelete: () => void;
  children: ReactNode;
};

const DeleteConfirmForm = ({
  open,
  title,
  onClose,
  onDelete,
  children,
}: DeleteConfirmFormProps) => {
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
        <Grid size={12}>{children}</Grid>

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

export default DeleteConfirmForm;
