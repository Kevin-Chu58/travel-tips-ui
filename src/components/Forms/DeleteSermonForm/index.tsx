import { Typography } from "@mui/material";
import FormBase from "../FormBase";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";

type DeleteSermonFormProps = {
  open: boolean;
  onClose: () => void;
  onAction: () => void;
};

const DeleteSermonForm = ({
  open,
  onClose,
  onAction,
}: DeleteSermonFormProps) => {
  return (
    <FormBase
      open={open}
      onClose={onClose}
      headerIcon={<WarningIcon color="error" />}
      headerTheme="error"
      title="Permanent Action"
      actionButtonTheme="error"
      actionButtonLabel="Delete"
      actionButtonStartIcon={<DeleteIcon />}
      actionButtonOnClick={onAction}
    >
      <Typography>Are you sure you want to delete this sermon?</Typography>
    </FormBase>
  );
};

export default DeleteSermonForm;
