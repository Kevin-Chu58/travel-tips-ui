import {
  IconButton,
  type IconButtonProps as MuiIconButtonProps,
  type SxProps,
} from "@mui/material";
import type { ReactNode } from "react";
import "./index.scss";
import clsx from "clsx";

type TTIconButtonProps = {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  sx?: SxProps;
} & MuiIconButtonProps;

const TTIconButton = ({
  className,
  disabled = false,
  onClick,
  children,
  sx,
}: TTIconButtonProps) => {
  return (
    <IconButton
      disabled={disabled}
      className={clsx("TTIconButton", className)}
      onClick={onClick}
      sx={sx}
    >
      {children}
    </IconButton>
  );
};

export default TTIconButton;
 