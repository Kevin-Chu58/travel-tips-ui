import { Box, Link, Typography } from "@mui/material";
import { PDF_HEIGHT, PDF_WIDTH } from "@constants/Pdf";
import TLogo from "@assets/T.svg";
import "./index.scss";

type PdfPageProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

const PdfPage = ({ header, footer, children }: PdfPageProps) => {
  const defaultHeader = (
    <Box className="header-content">
      <Link
        className="app-bar-icon-link"
        // TODO - href="https://www.google.com"
        underline="none"
      >
        <img className="icon-svg" src={TLogo} alt="TravelTips" />
      </Link>
      <Typography variant="caption">TravelTips</Typography>
    </Box>
  );

  return (
    <Box className="pdf-page" sx={{ width: PDF_WIDTH, height: PDF_HEIGHT }}>
      {/* Header */}
      <Box className="header">{header ?? defaultHeader}</Box>

      {/* Footer */}
      {footer ? <Box className="footer">{footer}</Box> : undefined}
      {children}
    </Box>
  );
};

export default PdfPage;
