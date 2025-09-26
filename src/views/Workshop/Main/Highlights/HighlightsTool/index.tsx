import ListToolBar from "@components/ListToolBar";
import { attractionsService, type AttractionV2 } from "@services/attractions";
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
    state: AttractionV2[] | ((prevState: AttractionV2[]) => AttractionV2[])
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
