import AttractionCard from "@components/Cards/AttractionCard";
import { Box } from "@mui/material";
import { type AttractionV2 } from "@services/attractions";

type HighlightsProps = {
  attractions: AttractionV2[];
};

const Highlights = ({
  attractions,
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
        />
      ))}
    </Box>
  );
};

export default Highlights;
