import type { Theme } from "@emotion/react";
import { IconButton, type SxProps } from "@mui/material";

type IconButtonProps = {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  sx?: SxProps<Theme>;
  onClick?: () => void;
};

const TTIconButton = ({
  size = "medium",
  disabled = false,
  children,
  sx,
  onClick,
}: IconButtonProps) => {
  return (
    <IconButton
      disableRipple
      disabled={disabled}
      size={size}
      sx={{
        ...sx,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        scale: 0.7,
      }}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
};

export default TTIconButton;
