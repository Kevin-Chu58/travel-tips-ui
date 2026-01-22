import AttractionProfile from "@components/Profile/AttractionProfile";
import { Box, Container } from "@mui/material";
import "./index.scss";
import { useRef } from "react";

const Attraction = () => {
  // infinite scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Container maxWidth={false} disableGutters>
      <Box ref={containerRef} className="attraction-container">
        <AttractionProfile containerRef={containerRef} back />
      </Box>
    </Container>
  );
};

export default Attraction;
