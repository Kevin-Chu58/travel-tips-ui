import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type ConditonalIconGroupProps = {
  onClose: () => void;
  onConfirm: () => void;
  isConditionMet?: boolean;
};

const ConditionalIconGroup = ({
  onClose,
  onConfirm,
  isConditionMet = true,
}: ConditonalIconGroupProps) => {
  return (
    <>
      <IconButton disableRipple color="error" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <IconButton
        disableRipple
        color="success"
        disabled={!isConditionMet}
        onClick={onConfirm}
      >
        <CheckIcon />
      </IconButton>
    </>
  );
};

export default ConditionalIconGroup;
