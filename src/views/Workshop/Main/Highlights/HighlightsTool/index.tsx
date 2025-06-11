import ListTool from "@components/ListTool";
import type { RootState } from "@redux/store";
import { attractionsService, type Attraction, type AttractionHighlights } from "@services/attractions";
import { tripsService } from "@services/trips";
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
  selected: number[];
  setSelected: (state: number[]) => void;
  setHighlights: (
    state: AttractionHighlights[] | ((prevState: AttractionHighlights[]) => AttractionHighlights[])
  ) => void;
  isUpdated: boolean;
  setIsUpdated: () => void;
};

const HighlightsTool = ({
  sortTypeIndex,
  setSortTypeIndex,
  selected,
  setSelected,
  setHighlights,
  isUpdated,
  setIsUpdated,
}: HighlightsToolProps) => {
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender on access token and isUpdated
  useEffect(() => {
    const getMyTrips = async () => {
      if (token) {
        const myAttractionHighlights = await attractionsService.getAttractionHighlightsByUserId(4);
        setHighlights(SortUtils.sortList(myAttractionHighlights, sortTypes, sortTypeIndex));
      }
    };
    getMyTrips();
  }, [token, isUpdated]);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    setHighlights((prevHighlights) =>
      SortUtils.sortList([...prevHighlights], sortTypes, sortTypeIndex)
    );
  }, [sortTypeIndex]);

  return (
    <ListTool
      showSort
      showFilter
      showSelect
      sortType={sortTypeIndex}
      setSortType={setSortTypeIndex}
      sortTypes={sortTypes}
      selected={selected}
    />
  );
};

export default HighlightsTool;
