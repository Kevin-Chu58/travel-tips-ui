import TTIconButton from "@components/TTIconButton";
import { Box, Divider, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import HighlightForm from "@components/Forms/HighlightForm";
import HighlightItem from "@components/Item/HighlightItem";
import { getDefaultHighlight, type Highlight } from "@services/highlights";
import TTButton from "@components/TTButton";
import clsx from "clsx";
import "./index.scss";

type HighlightsFragmentProps = {
  attractionId: number | undefined;
  highlights: Highlight[];
  isHighlightLoading?: boolean;
  allowChangeHighlight?: boolean;
  setDeleteHighlightId?: (state: number | undefined) => void;
  selectHighlightId?: number;
  setSelectHighlightId?: (state: number | undefined) => void;
  asyncAddHighlight?: (state?: Highlight) => void;
  asyncUpdateHighlight?: (state?: Highlight) => void;
};

const HighlightsFragment = ({
  attractionId,
  highlights,
  isHighlightLoading = false,
  allowChangeHighlight = true,
  setDeleteHighlightId,
  selectHighlightId,
  setSelectHighlightId,
  asyncAddHighlight,
  asyncUpdateHighlight,
}: HighlightsFragmentProps) => {
  // post
  const [openPost, setOpenPost] = useState<boolean>(false);

  let getHighlightItem = (
    highlight: Highlight,
    i: number,
    noDivider: boolean = false
  ) => (
    <HighlightItem
      key={highlight.id}
      highlight={highlight}
      showMenu={allowChangeHighlight}
      isLast={noDivider || i + 1 === highlights.length}
      onUpdate={asyncUpdateHighlight}
      onDelete={setDeleteHighlightId}
    />
  );

  const handleClickSelectHighlight = (id: number) => {
    if (setSelectHighlightId) {
      if (selectHighlightId !== id) {
        setSelectHighlightId(id);
      } else {
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
            {allowChangeHighlight ? (
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
            ) : undefined}
          </Box>
          <Divider flexItem />

          {/* new highlight form - highlight item in edit */}
          {openPost && attractionId && (
            <React.Fragment>
              <HighlightForm
                highlight={{ ...getDefaultHighlight(attractionId) }}
                onAction={asyncAddHighlight}
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
                  {getHighlightItem(highlight, i, true)}
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
        undefined
      )}
    </React.Fragment>
  );
};

export default HighlightsFragment;
