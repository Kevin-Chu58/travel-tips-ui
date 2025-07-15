import HighlightProfile from "@components/Profile/HighlightProfile";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import TTButton from "@components/TTButton";
import { Container } from "@mui/material";

const Highlight = () => {

  return (
    <Container maxWidth="lg" disableGutters>
      {/* nav back button */}
      <TTButton
        label="back"
        color="info"
        variant="text"
        startIcon={<NavigateBeforeIcon />}
        to="/workshop/highlight"
        sx={{ fontSize: "1rem", mt: 1 }}
      />
      <HighlightProfile />
    </Container>
  );
};

export default Highlight;
