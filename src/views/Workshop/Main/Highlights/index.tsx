import TTHighlightCard from "@components/TTHighlightCard";
import { WorkshopToNavTab } from "@constants/Layouts";
import { Grid, Typography } from "@mui/material";
import type { AttractionHighlights } from "@services/attractions";

type HighlightsProps = {
  highlights: AttractionHighlights[];
  selected: number[];
  addSelected: (state: number) => void;
  removeSelected: (state: number) => void;
  setIsUpdated: () => void;
}

const Highlights = ({
  highlights,
  selected,
  addSelected,
  removeSelected,
  setIsUpdated,
}: HighlightsProps) => {
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
          selected={selected}
          addSelected={addSelected}
          removeSelected={removeSelected}
        />
      ))}
      <Grid size={12} height={4} />
    </Grid>
  )
};

export default Highlights;
