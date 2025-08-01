import { mild_box_shadow } from "@constants/Shadows";
import { Tooltip } from "@mui/material";
import type { JSX } from "react";

type ToolTipProps = {
  title: JSX.Element | string | number;
  offsetX?: number;
  offsetY?: number;
  children: JSX.Element;
};

const ToolTip = ({
  title,
  offsetX = 0,
  offsetY = 8,
  children,
}: ToolTipProps) => {
  return (
    <Tooltip
      title={title}
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
            backgroundColor: "#333333ee",
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
