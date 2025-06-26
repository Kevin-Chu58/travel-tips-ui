import { Box, IconButton, type SxProps } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type ConditonalIconGroupProps = {
  size?: "small" | "medium" | "large";
  onClose: () => void;
  onConfirm: () => void;
  isConditionMet?: boolean;
  sx?: SxProps;
};

const ConditionalSuccessIconGroup = ({
  size = "small",
  onClose,
  onConfirm,
  isConditionMet = true,
  sx,
}: ConditonalIconGroupProps) => {
  return (
    <Box sx={sx}>
      <IconButton
        onClick={onClose}
        size={size}
        color="error"
      >
        <CloseIcon />
      </IconButton>
      <IconButton
        disabled={!isConditionMet}
        onClick={onConfirm}
        size={size}
        color="success"
      >
        <CheckIcon />
      </IconButton>
    </Box>
  );
};

export default ConditionalSuccessIconGroup;
