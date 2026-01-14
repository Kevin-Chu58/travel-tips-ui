import { mild_box_shadow } from "@constants/Shadows";
import { Tooltip, type TooltipProps } from "@mui/material";
import type { JSX } from "react";

type ToolTipProps = {
  title?: React.ReactNode;
  offsetX?: number;
  offsetY?: number;
  placement?: TooltipProps["placement"];
  children: JSX.Element;
};

const ToolTip = ({
  title,
  offsetX = 0,
  offsetY = 4,
  placement,
  children,
}: ToolTipProps) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [offsetX, offsetY], // [horizontal, vertical] — reduce from default 8
              },
            },
          ],
        },
        tooltip: {
          sx: {
            borderRadius: ".5rem",
            backgroundColor: "#121212ee",
            boxShadow: mild_box_shadow,
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default ToolTip;
