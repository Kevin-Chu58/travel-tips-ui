import { forwardRef } from "react";
import type { Theme } from "@emotion/react";
import { IconButton, type SxProps, type IconButtonProps as MuiIconButtonProps } from "@mui/material";

type TTIconButtonProps = {
  sx?: SxProps<Theme>;
} & MuiIconButtonProps; // extend MUI's IconButtonProps

// use forwardRef to show the parent mui-Tooltip that wraps around TTIconButton
const TTIconButton = forwardRef<HTMLButtonElement, TTIconButtonProps>(
  ({ sx, ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        disableRipple
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          scale: 0.7,
          ...sx,
        }}
        {...props}
      />
    );
  }
);

export default TTIconButton;
