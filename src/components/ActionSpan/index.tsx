import type { ReactNode } from "react";
import "./index.scss";

type ActionSpanProps = {
  className?: string;
  children: ReactNode;
};

const ActionSpan = ({ className, children }: ActionSpanProps) => {
  return <span className={`action-span ${className}`}>{children}</span>;
};

export default ActionSpan;
