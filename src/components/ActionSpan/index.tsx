import type { ReactNode } from "react";
import "./index.scss";
import clsx from "clsx";

type ActionSpanProps = {
  className?: string;
  isKeyboard?: boolean;
  children: ReactNode;
};

const ActionSpan = ({
  className,
  isKeyboard = false,
  children,
}: ActionSpanProps) => {
  return (
    <span
      className={clsx(`action-span ${className}`, isKeyboard && "keyboard")}
    >
      {children}
    </span>
  );
};

export default ActionSpan;
