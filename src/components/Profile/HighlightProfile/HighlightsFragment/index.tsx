import TTIconButton from "@components/TTIconButton";
import { Box, Divider, Skeleton, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import HighlightForm from "@components/Forms/HighlightForm";
import HighlightItem from "@components/Item/HighlightItem";
import { getDefaultHighlight, type Highlight } from "@services/highlights";
import type { AttractionV2 } from "@services/attractions";
import "./index.scss";

type HighlightsFragmentProps = {
  attraction: AttractionV2 | undefined;
  highlights: Highlight[];
  isHighlightLoading: boolean;
  setDeleteHighlightId: (state: number | undefined) => void;
  setSyncHighlights: () => void;
};

const HighlightsFragment = ({
  attraction,
  highlights,
  isHighlightLoading,
  setDeleteHighlightId,
  setSyncHighlights,
}: HighlightsFragmentProps) => {
  // post
  const [openPost, setOpenPost] = useState<boolean>(false);

  return (
    <React.Fragment>
      {!isHighlightLoading ? (
        <Box className="highlight-profile-highlights-fragment-box">
          {/* header bar */}
          <Box className="highlight-profile-highlights-fragment-header-bar">
            <Typography className="highlight-profile-highlights-fragment-header-title">
              Highlights
            </Typography>
            {/* add icon */}
            <Tooltip
              title="Write a new highlight"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -14],
                      },
                    },
                  ],
                },
              }}
            >
              <TTIconButton
                onClick={() => setOpenPost(true)}
                className="highlight-profile-highlights-fragment-header-add-button"
              >
                <AddIcon />
              </TTIconButton>
            </Tooltip>
          </Box>
          <Divider flexItem />

          {/* new highlight form - highlight item in edit */}
          {openPost && attraction && (
            <React.Fragment>
              <HighlightForm
                highlight={{ ...getDefaultHighlight(attraction.id) }}
                onAction={setSyncHighlights}
                onClose={() => setOpenPost(false)}
                isPost
              />
              {highlights.length > 0 && <Divider flexItem />}
            </React.Fragment>
          )}

          {highlights.length > 0 ? (
            highlights.map((highlight, i) => (
              <HighlightItem
                key={highlight.id}
                highlight={highlight}
                isLast={i + 1 === highlights.length}
                onDelete={setDeleteHighlightId}
              />
            ))
          ) : (
            <Typography>No highlights available.</Typography>
          )}
        </Box>
      ) : (
        <Skeleton
          className="highlight-profile-highlights-fragment-skeleton"
          variant="rectangular"
        />
      )}
    </React.Fragment>
  );
};

export default HighlightsFragment;
