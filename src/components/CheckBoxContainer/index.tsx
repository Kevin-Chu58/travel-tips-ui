import { Box, Checkbox } from "@mui/material";
import type { ReactNode } from "react";
import "./index.scss";

type CheckboxContainerProps = {
  checked?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
};

const CheckboxContainer = ({
  checked,
  onClick,
  disabled,
  children,
}: CheckboxContainerProps) => {
  return (
    <Box className="row start full check-box-container" onClick={onClick}>
      <Checkbox
        className="checkbox"
        color="default"
        checked={checked}
        disabled={disabled}
      />
      {children}
    </Box>
  );
};

export default CheckboxContainer;
