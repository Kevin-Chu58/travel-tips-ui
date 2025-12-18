import ListToolBar from "@components/ListTool";
import { Box, IconButton } from "@mui/material";
import { type Attraction } from "@services/attractions";
import SortUtils from "@utils/SortUtils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useEffect } from "react";
import ToolTip from "@components/ToolTip";
import type { SortType } from "@constants/Types";
import "./index.scss";

type HighlightsToolProps = {
  sortTypes: SortType[];
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  addOnClick: () => void;
  attractionsRef: React.RefObject<Attraction[]>;
  getMyAttractions: () => void;
  asyncAttractions: (state: Attraction[]) => void;
  showHovers: boolean;
  setShowHovers: React.Dispatch<React.SetStateAction<boolean>>;
};

const HighlightsTool = ({
  sortTypes,
  sortTypeIndex,
  setSortTypeIndex,
  addOnClick,
  attractionsRef,
  getMyAttractions,
  asyncAttractions,
  showHovers,
  setShowHovers,
}: HighlightsToolProps) => {
  // rerender on access token
  useEffect(() => {
    getMyAttractions();
  }, []);

  const showHoverButton = (
    <ToolTip key="show-hover-button" title={showHovers ? "Hide Details" : "Show Details"} offsetY={-8}>
      <IconButton size="small" onClick={() => setShowHovers((prev) => !prev)}>
        {showHovers ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
    </ToolTip>
  );

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    asyncAttractions(
      SortUtils.sortList(attractionsRef.current, sortTypes, sortTypeIndex)
    );
  }, [sortTypeIndex]);

  return (
    <Box className="workshop-main-content-highlights-tool-container">
      <ListToolBar
        showSort
        showFilter
        sortType={sortTypeIndex}
        setSortType={setSortTypeIndex}
        sortTypes={sortTypes}
        addOnClick={addOnClick}
        addLabel="New Highlight"
        otherButtons={[showHoverButton]}
      />
    </Box>
  );
};

export default HighlightsTool;
