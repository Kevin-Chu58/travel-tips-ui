import { Chip, type ChipProps } from "@mui/material";
import clsx from "clsx";
import "./index.scss";

const TTChipButton = ({ sx, className, color = "info", ...props }: ChipProps) => {
  return <Chip {...props} className={clsx("TTChipButton", className, color)} />;
};

export default TTChipButton;
