import TTButton from "@components/TTButton";
import { useIsMobile } from "@hooks/useIsMobile";
import { Box, Chip, Divider, Typography } from "@mui/material";
import React from "react";
import "./index.scss";
import type { AttractionV2 } from "@services/attractions";

type AttractionListProps = {
  result: AttractionV2[];
  setShowResult: (state: boolean) => void;
  focusId: string | undefined;
  setFocusId: (state: string | undefined) => void;
};

const AttractionList = ({
  result,
  setShowResult,
  focusId,
  setFocusId,
}: AttractionListProps) => {
  // window
  const isMobile = useIsMobile();
  // styling
  const boxClassName = isMobile
    ? "attraction-list-box-mobile"
    : "attraction-list-box";

  const handleAttractionClick = (attraction: AttractionV2) => {
    setFocusId(attraction.hereId);

    if (isMobile) setShowResult(false);
  };

  return (
    <Box className={boxClassName}>
      {/* title - result */}
      <Box className="attraction-list-header-box">
        <Typography className="attraction-list-title">Result</Typography>
      </Box>
      {/* attraction items */}
      <Box className="attraction-list-items-box">
        {result.map((a, i) => (
          <React.Fragment key={a.hereId}>
            <TTButton
              fullWidth
              className={
                focusId === a.hereId
                  ? "attraction-list-item-focus"
                  : "attraction-list-item"
              }
              onClick={() => handleAttractionClick(a)}
              variant="text"
            >
              {/* attraction item content */}
              <Box className="attraction-list-item-content">
                {/* attraction item header */}
                <Box className="attraction-list-item-header">
                  <Typography>{a.title}</Typography>
                </Box>
                <Typography className="attraction-list-item-address">
                  {a.address}
                </Typography>

                {a.category && (
                  <Chip
                    size="small"
                    label={a.category}
                    className="attraction-list-item-chip"
                  />
                )}
              </Box>
            </TTButton>
            {i + 1 < result.length && <Divider flexItem />}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default AttractionList;
