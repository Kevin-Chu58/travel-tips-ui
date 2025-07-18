import { Box, Dialog, type DialogProps, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import "./index.scss";

type TTDialogProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  hideBackdrop?: boolean;
  hidePadding?: boolean;
  children: ReactNode;
  sx?: SxProps;
};

const TTDialog = ({
  className,
  maxWidth = false,
  hideBackdrop = false,
  hidePadding = false,
  open,
  onClose,
  children,
  sx,
}: TTDialogProps) => {
  // styling
  const TTDialogBoxClassName = hidePadding ? "" : "TTDialog-box";

  return (
    <Dialog
      className={`TTDialog ${className}`}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
      slotProps={{
        paper: {
          sx: sx,
        },
      }}
    >
      <Box className={TTDialogBoxClassName}>
        {/* content */}
        {children}
      </Box>
    </Dialog>
  );
};

export default TTDialog;
