import { Box, Container, Typography } from "@mui/material";
import { useIsMobile } from "@hooks/useIsMobile";
import TLogo from "@assets/T.svg";
import clsx from "clsx";
import "./index.scss";

const Main = () => {
  const isMobile = useIsMobile();

  return (
    <Container className="main-page-container" maxWidth={false} disableGutters>
      <Box className="main-page-content-container">
        {/* slogan */}
        <Box
          className={clsx("main-page-slogan-container", isMobile && "mobile")}
        >
            {isMobile ? <img className="main-page-logo" src={TLogo} /> : undefined}
          <Typography
            variant={isMobile ? "h3" : "h1"}
            className="main-page-slogan-highlight"
          >
            Enjoy Peace
          </Typography>
          <Typography
            variant={isMobile ? "h5" : "h3"}
            className="main-page-slogan"
          >
            before everyone
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Main;
