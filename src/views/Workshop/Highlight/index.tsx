import HighlightProfile from "@components/Profile/HighlightProfile";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import TTButton from "@components/TTButton";
import { Box, Container } from "@mui/material";
import "./index.scss";

const Highlight = () => {

  return (
    <Container maxWidth={false} disableGutters>
      {/* nav back button */}
      <Box className="highlight-container">
        <TTButton
          className="highlight-back-button"
          label="back"
          // color="info"
          variant="text"
          startIcon={<NavigateBeforeIcon />}
          to="/workshop/highlights"
        />
        <HighlightProfile />
      </Box>
    </Container>
  );
};

export default Highlight;
