import { mild_box_shadow_lg } from "@constants/Shadows";
import { Box, Dialog, type DialogProps } from "@mui/material";
import type { ReactNode } from "react";

type TTDialogProps = {
  open: boolean;
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  hideBackdrop?: boolean;
  children: ReactNode;
};

const TTDialog = ({
  maxWidth = "md",
  hideBackdrop = false,
  open,
  onClose,
  children,
}: TTDialogProps) => {
  return (
    <Dialog
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
      slotProps={{
        paper: {
          sx: {
            boxShadow: mild_box_shadow_lg,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          },
        },
      }}
    >
      <Box p={2}>
        {/* content */}
        {children}
      </Box>
    </Dialog>
  );
};

export default TTDialog;
