import { mild_box_shadow_lg } from "@constants/Shadows";
import { Box, Dialog, type DialogProps, type SxProps } from "@mui/material";
import type { ReactNode } from "react";

type TTDialogProps = {
  open: boolean;
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  hideBackdrop?: boolean;
  hidePadding?: boolean;
  children: ReactNode;
  sx?: SxProps,
};

const TTDialog = ({
  maxWidth = false,
  hideBackdrop = false,
  hidePadding = false,
  open,
  onClose,
  children,
  sx,
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
            ...sx,
          },
        },
      }}
    >
      <Box p={hidePadding ? 0 : 2}>
        {/* content */}
        {children}
      </Box>
    </Dialog>
  );
};

export default TTDialog;
