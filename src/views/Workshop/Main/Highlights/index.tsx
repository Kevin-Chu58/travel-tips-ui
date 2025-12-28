import AttractionCard from "@components/Cards/AttractionCard";
import { Box } from "@mui/material";
import { type Attraction } from "@services/attractions";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type HighlightsProps = {
  attractions: Attraction[];
  showHovers?: boolean;
};

const Highlights = ({ attractions, showHovers }: HighlightsProps) => {
  const isMobile = useIsMobile();

  return (
    <Box
      className={clsx(
        "workshop-main-content-highlights-container",
        isMobile && "mobile"
      )}
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
