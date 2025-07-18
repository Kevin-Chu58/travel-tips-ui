import { Button, type ButtonOwnProps, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

type TTButtonProps = {
  label?: string;
  className?: string;
  color?: ButtonOwnProps["color"];
  size?: ButtonOwnProps["size"];
  variant?: ButtonOwnProps["variant"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  to?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  disableRipple?: boolean;
  onClick?: () => void;
  sx?: SxProps;
  children?: ReactNode;
};

const TTButton = ({
  label,
  className,
  color = "inherit",
  size = "medium",
  variant = "contained",
  startIcon,
  endIcon,
  to,
  fullWidth = false,
  disabled = false,
  disableRipple = false,
  onClick = () => {},
  sx,
  children,
}: TTButtonProps) => {
  const navigate = useNavigate();

  let muiButtonRootSx = {
    "&.MuiButton-root": {
      textTransform: "capitalize",
      ...sx,
    },
  } as SxProps;

  return (
    <Button
      role="button"
      className={className}
      size={size}
      color={color}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      disabled={disabled}
      disableTouchRipple={disableRipple}
      href={to}
      onClick={(e) => {
        e.stopPropagation();
        to ? navigate(to) : onClick();
      }}
      sx={muiButtonRootSx}
    >
      {label}
      {children}
    </Button>
  );
};

export default TTButton;
