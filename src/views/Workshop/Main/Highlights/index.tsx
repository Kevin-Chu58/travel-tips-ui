import AttractionCard from "@components/Cards/AttractionCard";
import { Box } from "@mui/material";
import { type Attraction } from "@services/attractions";

type HighlightsProps = {
  attractions: Attraction[];
  showHovers?: boolean;
};

const Highlights = ({
  attractions,
  showHovers,
}: HighlightsProps) => {

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      flexWrap="wrap"
      gap={2}
      mt={2}
    >
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
