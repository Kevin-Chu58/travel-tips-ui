import TTIconButton from "@components/TTIconButton";
import { Box, Divider, Skeleton, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import HighlightForm from "@components/Forms/HighlightForm";
import HighlightItem from "@components/Item/HighlightItem";
import { getDefaultHighlight, type Highlight } from "@services/highlights";
import type { AttractionV2 } from "@services/attractions";
import TTButton from "@components/TTButton";
import clsx from "clsx";
import "./index.scss";

type HighlightsFragmentProps = {
  attraction: AttractionV2 | undefined;
  highlights: Highlight[];
  isHighlightLoading: boolean;
  allowChangeHighlight?: boolean;
  setDeleteHighlightId?: (state: number | undefined) => void;
  selectHighlightId?: number;
  setSelectHighlightId?: (state: number | undefined) => void;
  setSyncHighlights?: () => void;
};

const HighlightsFragment = ({
  attraction,
  highlights,
  isHighlightLoading,
  allowChangeHighlight = true,
  setDeleteHighlightId,
  selectHighlightId,
  setSelectHighlightId,
  setSyncHighlights,
}: HighlightsFragmentProps) => {
  // post
  const [openPost, setOpenPost] = useState<boolean>(false);

  let getHighlightItem = (highlight: Highlight, i: number) => (
    <HighlightItem
      key={highlight.id}
      highlight={highlight}
      showMenu={allowChangeHighlight}
      isLast={i + 1 === highlights.length}
      onDelete={setDeleteHighlightId}
    />
  );

  const handleClickSelectHighlight = (id: number) => {
    if (setSelectHighlightId) {
      if (selectHighlightId !== id) {
        setSelectHighlightId(id);
      }
      else {
        setSelectHighlightId(undefined);
      }
    }
  };

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
            {allowChangeHighlight && (
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
            )}
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
            highlights.map((highlight, i) =>
              setSelectHighlightId ? (
                <TTButton
                  key={`highlight-button-${highlight.id}`}
                  className={clsx(
                    "highlight-profile-highlights-fragment-highlight-select-button",
                    selectHighlightId === highlight.id && "focus"
                  )}
                  color="info"
                  variant="text"
                  onClick={() => handleClickSelectHighlight(highlight.id)}
                >
                  {getHighlightItem(highlight, i)}
                </TTButton>
              ) : (
                getHighlightItem(highlight, i)
              )
            )
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
