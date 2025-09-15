import ListTool from "@components/ListToolBar";
import type { RootState } from "@redux/store";
import { tripsService, type Trip } from "@services/trips";
import SortUtils, {
  sortTypeDayAsc,
  sortTypeDayDesc,
  sortTypeTitleAsc,
  sortTypeTitleDesc,
} from "@utils/SortUtils";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const sortTypes = [
  sortTypeTitleAsc,
  sortTypeTitleDesc,
  sortTypeDayAsc,
  sortTypeDayDesc,
];

type TripsToolProps = {
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  selected: number[];
  setSelected: (state: number[]) => void;
  tripsRef: React.RefObject<Trip[]>;
  asyncTrips: (state: Trip[]) => void;
  isUpdated: boolean;
  setIsUpdated: () => void;
};

const TripsTool = ({
  sortTypeIndex,
  setSortTypeIndex,
  selected,
  setSelected,
  tripsRef,
  asyncTrips,
  isUpdated,
  setIsUpdated,
}: TripsToolProps) => {
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender on access token and isUpdated
  useEffect(() => {
    const getMyTrips = async () => {
      if (token) {
        const myTrips = await tripsService.getMyTrips(token);
        asyncTrips(SortUtils.sortList(myTrips, sortTypes, sortTypeIndex));
      }
    };
    getMyTrips();
  }, [token, isUpdated]);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    asyncTrips(SortUtils.sortList(tripsRef.current, sortTypes, sortTypeIndex));
  }, [sortTypeIndex]);

  const handlePublish = async (isPublished: boolean) => {
    if (token && selected.length > 0) {
      await tripsService.patchTripIsPublic(selected, isPublished, token);
      if (setIsUpdated) setIsUpdated();
      setSelected([]);
    }
  };

  const handleDelete = async () => {
    if (token && selected.length > 0) {
      await tripsService.patchTripIsHidden(selected, true, token);
      if (setIsUpdated) setIsUpdated();
      setSelected([]);
    }
  };

  return (
    <ListTool
      showSort
      showFilter
      showSelect
      sortType={sortTypeIndex}
      setSortType={setSortTypeIndex}
      sortTypes={sortTypes}
      selected={selected}
      handlePublish={handlePublish}
      handleDelete={handleDelete}
    />
  );
};

export default TripsTool;
