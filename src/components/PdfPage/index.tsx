import { Box, Link, Typography } from "@mui/material";
import { PDF_HEIGHT, PDF_WIDTH } from "@constants/Pdf";
import TLogo from "@assets/T.svg";
import React, { useMemo } from "react";
import "./index.scss";

type PdfPageProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

// defined outside component — never changes
const DefaultHeader = (
  <Box className="header-content">
    <Link className="app-bar-icon-link" underline="none">
      <img className="icon-svg" src={TLogo} alt="TravelTips" />
    </Link>
    <Typography variant="caption">TravelTips</Typography>
  </Box>
);

const PdfPage = React.memo(({ header, footer, children }: PdfPageProps) => {
  const sx = useMemo(() => ({ width: PDF_WIDTH, height: PDF_HEIGHT }), []);

  return (
    <Box className="pdf-page" sx={sx}>
      <Box className="header">{header ?? DefaultHeader}</Box>
      {footer ? <Box className="footer">{footer}</Box> : undefined}
      {children}
    </Box>
  );
});

export default PdfPage;
