import { Button, type ButtonOwnProps, type SxProps } from "@mui/material";

type TTButtonProps = {
  label?: string;
  color?: ButtonOwnProps["color"];
  size?: ButtonOwnProps["size"];
  variant?: ButtonOwnProps["variant"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disableRipple?: boolean;
  onClick: () => void;
  sx?: SxProps;
};

const TTButton = ({
  label,
  color = "inherit",
  size = "medium",
  variant = "contained",
  startIcon,
  endIcon,
  disableRipple = false,
  onClick,
  sx,
}: TTButtonProps) => {
  let muiButtonRootSx = {
    "&.MuiButton-root": {
      textTransform: "capitalize",
      ...sx,
    },
  } as SxProps;

  return (
    <Button
      role="button"
      size={size}
      color={color}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      disableTouchRipple={disableRipple}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      sx={muiButtonRootSx}
    >
      {label}
    </Button>
  );
};

export default TTButton;
