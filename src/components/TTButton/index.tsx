import { Button, type ButtonOwnProps, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

type TTButtonProps = {
  label?: string;
  ariaLabel?: string;
  className?: string;
  color?: ButtonOwnProps["color"];
  size?: ButtonOwnProps["size"];
  variant?: ButtonOwnProps["variant"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  to?: string;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  disableRipple?: boolean;
  circular?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  stopPropagation?: boolean;
  sx?: SxProps;
  children?: ReactNode;
};

const TTButton = ({
  label,
  ariaLabel,
  className,
  color = "inherit",
  size = "medium",
  variant = "contained",
  startIcon,
  endIcon,
  to,
  fullWidth = false,
  loading = false,
  disabled = false,
  disableRipple = false,
  circular = false,
  onClick = () => {},
  stopPropagation = true,
  sx,
  children,
}: TTButtonProps) => {
  const navigate = useNavigate();

  let muiButtonRootSx = {
    "&.MuiButton-root": {
      textTransform: "capitalize",
      borderRadius: circular ? "100rem" : "default",
      ...sx,
    },
  } as SxProps;

  return (
    <Button
      role="button"
      aria-label={ariaLabel}
      className={className}
      size={size}
      color={color}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled}
      disableTouchRipple={disableRipple}
      href={to}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        to ? navigate(to) : onClick(e);
      }}
      sx={muiButtonRootSx}
    >
      {label}
      {children}
    </Button>
  );
};

export default TTButton;
