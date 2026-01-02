import HighlightProfile from "@components/Profile/HighlightProfile";
import { Box, Container } from "@mui/material";
import "./index.scss";

const Attraction = () => {

  return (
    <Container maxWidth={false} disableGutters>
      <Box className="attraction-container">
        <HighlightProfile back />
      </Box>
    </Container>
  );
};

export default Attraction;
