import FormBase from "../FormBase";
import { Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";

type DeleteHighlightFormProps = {
  open: boolean;
  onClose: () => void;
  onAction: () => void;
};

const DeleteHighlightForm = ({
  open,
  onClose,
  onAction,
}: DeleteHighlightFormProps) => {
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
      <Typography>Are you sure you want to delete this highlight?</Typography>
    </FormBase>
  );
};

export default DeleteHighlightForm;
