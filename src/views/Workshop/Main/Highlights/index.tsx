import HighlightForm from "@components/Forms/HighlightForm";
import TTHighlightCard from "@components/TTHighlightCard";
import { WorkshopToNavTab } from "@constants/Layouts";
import { Grid } from "@mui/material";
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
    <Grid
      container
      spacing={8}
      columns={12}
      p={2}
      sx={{
        maxHeight: `calc(100vh - ${WorkshopToNavTab}px)`,
      }}
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
      <Grid size={12} height={4} />

      <HighlightForm
        highlight={highlight}
        open={Boolean(highlight)}
        setOpen={setHighlight}
        setIsParentUpdated={setIsUpdated}
      />
    </Grid>
  );
};

export default Highlights;
