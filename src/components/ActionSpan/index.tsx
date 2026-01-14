import type { ReactNode } from "react";
import "./index.scss";
import clsx from "clsx";
// import type { SxProps } from "@mui/material";

type ActionSpanProps = {
  className?: string;
  isKeyboard?: boolean;
  children: ReactNode;
  fillColor?: string;
  textColor?: string;
};

const ActionSpan = ({
  className,
  isKeyboard = false,
  children,
  fillColor,
  textColor,
}: ActionSpanProps) => {
  return (
    <span
      className={clsx("action-span", className, isKeyboard && "keyboard")}
      style={{ color: textColor, backgroundColor: fillColor }}
    >
      {children}
    </span>
  );
};

export default ActionSpan;
