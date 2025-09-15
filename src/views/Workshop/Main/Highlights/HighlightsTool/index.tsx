import ListToolBar from "@components/ListToolBar";
import type { RootState } from "@redux/store";
import { attractionsService, type AttractionV2 } from "@services/attractions";
import SortUtils, {
  sortTypeTitleAsc,
  sortTypeTitleDesc,
} from "@utils/SortUtils";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const sortTypes = [
  sortTypeTitleAsc,
  sortTypeTitleDesc,
];

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
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender on access token and syncAttractions
  useEffect(() => {
    const getMyHighlights = async () => {
      if (token) {
        const myAttractions = await attractionsService.getMyAttractionsByName(token);
        setAttractions(SortUtils.sortList(myAttractions, sortTypes, sortTypeIndex));
      }
    };
    getMyHighlights();
  }, [token, syncAttractions]);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    setAttractions((prevHighlights) =>
      SortUtils.sortList([...prevHighlights], sortTypes, sortTypeIndex)
    );
  }, [sortTypeIndex]);

  // const handleDelete = async () => {
  //   if (token && selected.length > 0) {
  //     await attractionsService.deleteHighlights(selected, token);
  //     setIsUpdated();
  //     setSelected([]);
  //   }
  // }

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
