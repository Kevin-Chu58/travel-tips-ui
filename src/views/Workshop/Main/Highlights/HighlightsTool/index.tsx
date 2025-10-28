import ListToolBar from "@components/ListToolBar";
import { attractionsService, type Attraction } from "@services/attractions";
import SortUtils, {
  sortTypeTitleAsc,
  sortTypeTitleDesc,
} from "@utils/SortUtils";
import { useEffect } from "react";

const sortTypes = [sortTypeTitleAsc, sortTypeTitleDesc];

type HighlightsToolProps = {
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  setAttractions: (
    state: Attraction[] | ((prevState: Attraction[]) => Attraction[])
  ) => void;
  syncAttractions: boolean;
};

const HighlightsTool = ({
  sortTypeIndex,
  setSortTypeIndex,
  setAttractions,
  syncAttractions,
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
    <ListToolBar
      showSort
      showFilter
      sortType={sortTypeIndex}
      setSortType={setSortTypeIndex}
      sortTypes={sortTypes}
    />
  );
};

export default HighlightsTool;
