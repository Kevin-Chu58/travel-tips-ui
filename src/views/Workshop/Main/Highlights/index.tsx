import AttractionCard from "@components/Cards/AttractionCard";
import { type Attraction } from "@services/attractions";
import { Box, CircularProgress, Typography } from "@mui/material";
import TTButton from "@components/TTButton";
import React from "react";
import "./index.scss";

type HighlightsProps = {
  attractions: Attraction[];
  cursor?: string;
  getMore: () => void;
  showHovers?: boolean;
  isLoading: boolean;
};

const Highlights = ({
  attractions,
  cursor,
  getMore,
  showHovers,
  isLoading,
}: HighlightsProps) => {
  return (
    <React.Fragment>
      {attractions.length > 0 ? (
        <Box className="workshop-main-content-highlights-container">
          {attractions.map((a) => (
            <AttractionCard
              key={`attraction-${a.id}`}
              attraction={a}
              showHovers={showHovers}
            />
          ))}
        </Box>
      ) : (
        !isLoading && <Typography>No highlights found.</Typography>
      )}
      {isLoading ? (
        <Box className="column center v-center flex">
          <CircularProgress aria-label="Loading…" />
        </Box>
      ) : (
        cursor && (
          <Box className="row center section">
            <TTButton color="utility" onClick={getMore} disableRipple>
              Show More
            </TTButton>
          </Box>
        )
      )}
    </React.Fragment>
  );
};

export default Highlights;
