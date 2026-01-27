import {
  IconButton,
  type IconButtonProps as MuiIconButtonProps,
  type SxProps,
} from "@mui/material";
import type { ReactNode } from "react";
import clsx from "clsx";
import "./index.scss";

type TTIconButtonProps = {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: (...state: any[]) => void;
  noBorder?: boolean;
  children: ReactNode;
  sx?: SxProps;
} & MuiIconButtonProps;

const TTIconButton = ({
  className,
  disabled = false,
  loading = false,
  noBorder = false,
  onClick,
  children,
  sx,
}: TTIconButtonProps) => {
  return (
    <IconButton
      disabled={disabled}
      loading={loading}
      className={clsx("TTIconButton", noBorder && "no-border", className)}
      onClick={onClick}
      sx={sx}
    >
      {children}
    </IconButton>
  );
};

export default TTIconButton;
