import { Box, Dialog, type DialogProps, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import clsx from "clsx";
import "./index.scss";

type TTDialogProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  hideBackdrop?: boolean;
  hidePadding?: boolean;
  disableAutoFocus?: boolean;
  disableRestoreFocus?: boolean;
  panel?: boolean;
  children: ReactNode;
  sx?: SxProps;
};

const TTDialog = ({
  className,
  maxWidth = false,
  hideBackdrop = false,
  hidePadding = false,
  disableAutoFocus = false,
  disableRestoreFocus = false,
  panel = true,
  open,
  onClose,
  children,
  sx,
}: TTDialogProps) => {
  return (
    <Dialog
      className={clsx("TTDialog", className, panel && "panel")}
      maxWidth={maxWidth}
      disableAutoFocus={disableAutoFocus}
      disableRestoreFocus={disableRestoreFocus}
      open={open}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
      slotProps={{
        paper: {
          sx: sx,
        },
      }}
    >
      <Box className={clsx(!hidePadding && "TTDialog-box")}>
        {/* content */}
        {children}
      </Box>
    </Dialog>
  );
};

export default TTDialog;
