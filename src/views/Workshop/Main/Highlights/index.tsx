import HighlightForm from "@components/Forms/HighlightForm";
import TTHighlightCard from "@components/TTHighlightCard";
import { Box } from "@mui/material";
import { type Attraction, type AttractionHighlights } from "@services/attractions";
import { useState } from "react";

type HighlightsProps = {
  highlights: AttractionHighlights[];
  selected: number[];
  addSelected: (state: number) => void;
  removeSelected: (state: number) => void;
  setIsUpdated: () => void;
};

const Highlights = ({
  highlights,
  selected,
  addSelected,
  removeSelected,
  setIsUpdated,
}: HighlightsProps) => {
  const [highlight, setHighlight] = useState<Attraction | undefined>();

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      flexWrap="wrap"
      gap={2}
      mt={2}
    >
      {highlights.map((ah) => (
        <TTHighlightCard
          key={`attraction-${ah.id}`}
          attractionHighlights={ah}
          setHighlight={setHighlight}
          selected={selected}
          addSelected={addSelected}
          removeSelected={removeSelected}
        />
      ))}
    </Box>
  );
};

export default Highlights;
