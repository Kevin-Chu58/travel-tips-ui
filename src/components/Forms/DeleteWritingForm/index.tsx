import { Typography } from "@mui/material";
import FormBase from "../FormBases/FormBase";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";

type DeleteWritingFormProps = {
  open: boolean;
  onClose: () => void;
  onAction: () => void;
};

const DeleteWritingForm = ({
  open,
  onClose,
  onAction,
}: DeleteWritingFormProps) => {
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
      <Typography>Are you sure you want to delete this Writing?</Typography>
    </FormBase>
  );
};

export default DeleteWritingForm;
