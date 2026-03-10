import AttractionCard from "@components/Cards/AttractionCard";
import { type Attraction } from "@services/attractions";
import { Box } from "@mui/material";
import "./index.scss";

type HighlightsProps = {
  attractions: Attraction[];
  showHovers?: boolean;
};

const Highlights = ({ attractions, showHovers }: HighlightsProps) => {
  return (
    <Box className="workshop-main-content-highlights-container">
      {attractions.map((a) => (
        <AttractionCard
          key={`attraction-${a.id}`}
          attraction={a}
          showHovers={showHovers}
        />
      ))}
    </Box>
  );
};

export default Highlights;
