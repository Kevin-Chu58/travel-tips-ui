import { Box, type SxProps } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TTIconButton from "@components/TTIconButton";

type ConditonalIconGroupProps = {
  size?: "small" | "medium" | "large";
  onClose: () => void;
  onConfirm: () => void;
  isConditionMet?: boolean;
  sx?: SxProps;
};

const ConditionalIconGroup = ({
  size = "small",
  onClose,
  onConfirm,
  isConditionMet = true,
  sx,
}: ConditonalIconGroupProps) => {
  return (
    <Box sx={sx}>
      <TTIconButton
        onClick={onClose}
        size={size}
        sx={{
          color: "secondary.main",
          bgcolor: "secondary.900",
          ":hover": {
            bgcolor: "secondary.dark",
          },
        }}
      >
        <CloseIcon />
      </TTIconButton>
      <TTIconButton
        disabled={!isConditionMet}
        onClick={onConfirm}
        size={size}
        sx={{
          color: "secondary.main",
          bgcolor: isConditionMet ? "success.main" : "inherit",
          ":hover": {
            bgcolor: isConditionMet ? "success.dark" : "inherit",
          },
        }}
      >
        <CheckIcon />
      </TTIconButton>
    </Box>
  );
};

export default ConditionalIconGroup;
