import ListToolBar from "@components/ListToolBar";
import { Box, IconButton } from "@mui/material";
import { attractionsService, type Attraction } from "@services/attractions";
import SortUtils, {
  sortTypeTitleAsc,
  sortTypeTitleDesc,
  sortTypeNumHighlightsAsc,
  sortTypeNumHighlightsDesc,
} from "@utils/SortUtils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useEffect } from "react";
import ToolTip from "@components/ToolTip";

const sortTypes = [
  sortTypeTitleAsc,
  sortTypeTitleDesc,
  sortTypeNumHighlightsAsc,
  sortTypeNumHighlightsDesc,
];

type HighlightsToolProps = {
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  setAttractions: (
    state: Attraction[] | ((prevState: Attraction[]) => Attraction[])
  ) => void;
  syncAttractions: boolean;
  showHovers: boolean;
  setShowHovers: React.Dispatch<React.SetStateAction<boolean>>;
};

const HighlightsTool = ({
  sortTypeIndex,
  setSortTypeIndex,
  setAttractions,
  syncAttractions,
  showHovers,
  setShowHovers,
}: HighlightsToolProps) => {
  // rerender on access token and syncAttractions
  useEffect(() => {
    const getMyHighlights = async () => {
      const myAttractions = await attractionsService.getMyAttractionsByName();
      setAttractions(
        SortUtils.sortList(myAttractions, sortTypes, sortTypeIndex)
      );
    };
    getMyHighlights();
  }, [syncAttractions]);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    setAttractions((prevHighlights) =>
      SortUtils.sortList([...prevHighlights], sortTypes, sortTypeIndex)
    );
  }, [sortTypeIndex]);

  return (
    <Box display="flex" gap=".5rem">
      <ListToolBar
        showSort
        showFilter
        sortType={sortTypeIndex}
        setSortType={setSortTypeIndex}
        sortTypes={sortTypes}
      />

      <ToolTip
        title={showHovers ? "Hide Details" : "Show Details"}
        offsetY={-12}
      >
        <IconButton size="small" onClick={() => setShowHovers((prev) => !prev)}>
          {showHovers ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </ToolTip>
    </Box>
  );
};

export default HighlightsTool;
