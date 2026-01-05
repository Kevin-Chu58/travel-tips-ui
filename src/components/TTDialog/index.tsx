import { Box, Dialog, type DialogProps, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import "./index.scss";
import clsx from "clsx";

type TTDialogProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  maxWidth?: DialogProps["maxWidth"];
  hideBackdrop?: boolean;
  hidePadding?: boolean;
  panel?: boolean;
  children: ReactNode;
  sx?: SxProps;
};

const TTDialog = ({
  className,
  maxWidth = false,
  hideBackdrop = false,
  hidePadding = false,
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
