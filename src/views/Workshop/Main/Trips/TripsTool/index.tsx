import ListTool from "@components/ListTool";
import type { SortType } from "@constants/Types";
import { type Trip } from "@services/trips";
import SortUtils from "@utils/SortUtils";
import { useEffect } from "react";

type TripsToolProps = {
  sortTypes: SortType[];
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  selected: number[];
  tripsRef: React.RefObject<Trip[]>;
  getMyTrips: () => void;
  asyncTrips: (state: Trip[]) => void;
};

const TripsTool = ({
  sortTypes,
  sortTypeIndex,
  setSortTypeIndex,
  selected,
  tripsRef,
  getMyTrips,
  asyncTrips,
}: TripsToolProps) => {
  // rerender on access token and isUpdated
  useEffect(() => {
    getMyTrips();
  }, []);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    const updateTrips = async () => {
      asyncTrips(
        SortUtils.sortList(tripsRef.current, sortTypes, sortTypeIndex)
      );
    };
    updateTrips();
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

export default TripsTool;
