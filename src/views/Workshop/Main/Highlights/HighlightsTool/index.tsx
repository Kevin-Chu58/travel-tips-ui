import ListTool from "@components/ListTool";
import type { RootState } from "@redux/store";
import { attractionsService, type AttractionHighlights } from "@services/attractions";
import SortUtils, {
  sortTypeIdAsc,
  sortTypeIdDesc,
  sortTypeNameAsc,
  sortTypeNameDesc,
} from "@utils/SortUtils";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const sortTypes = [
  sortTypeIdAsc,
  sortTypeIdDesc,
  sortTypeNameAsc,
  sortTypeNameDesc,
];

type HighlightsToolProps = {
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  setHighlights: (
    state: AttractionHighlights[] | ((prevState: AttractionHighlights[]) => AttractionHighlights[])
  ) => void;
  isUpdated: boolean;
};

const HighlightsTool = ({
  sortTypeIndex,
  setSortTypeIndex,
  setHighlights,
  isUpdated,
}: HighlightsToolProps) => {
  // others
  const userId = useSelector((state: RootState) => state.user.id);

  // rerender on access token and isUpdated
  useEffect(() => {
    const getMyHighlights = async () => {
      if (userId) {
        const myAttractionHighlights = await attractionsService.getAttractionHighlightsByUserId(userId);
        setHighlights(SortUtils.sortList(myAttractionHighlights, sortTypes, sortTypeIndex));
      }
    };
    getMyHighlights();
  }, [userId, isUpdated]);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    setHighlights((prevHighlights) =>
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
    <ListTool
      showSort
      showFilter
      sortType={sortTypeIndex}
      setSortType={setSortTypeIndex}
      sortTypes={sortTypes}
    />
  );
};

export default HighlightsTool;
