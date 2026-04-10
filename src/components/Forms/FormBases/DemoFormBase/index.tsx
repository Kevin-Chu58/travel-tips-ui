import { Box, Dialog } from "@mui/material";
import clsx from "clsx";
import "./index.scss";

type DemoFormBaseLayouttProps = {
  width?: string; // vw
  minWidth?: number; // px
  height?: string; // vh
  maxHeight?: string; // vh
};

type DemoFormBaseProps = DemoFormBaseLayouttProps & {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  demoChildren: React.ReactNode;
  actionButton: React.ReactNode;
};

const DemoFormBase = ({
  open,
  onClose,
  className,
  children,
  demoChildren,
  actionButton,
  // layout
  width,
  minWidth = 300,
  height,
  maxHeight = "60vh",
}: DemoFormBaseProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={clsx("demo-form-base", className)}
      maxWidth={false}
    >
      <Box
        className="demo-form-base-container"
        width={width}
        minWidth={minWidth}
        height={height}
        maxHeight={maxHeight}
      >
        <Box className="row center demo-form-base-demo-box">
          <Box className="demo-content-box">{demoChildren}</Box>
        </Box>
        <Box className="demo-form-base-content-box">
          {children}
          <Box className="demo-form-base-footer"/>
          <Box className="action-button-box">{actionButton}</Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DemoFormBase;
