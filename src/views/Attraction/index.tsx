import AttractionProfile from "@components/Profile/AttractionProfile";
import { Box, Container } from "@mui/material";
import "./index.scss";

const Attraction = () => {

  return (
    <Container maxWidth={false} disableGutters>
      <Box className="attraction-container">
        <AttractionProfile back />
      </Box>
    </Container>
  );
};

export default Attraction;
