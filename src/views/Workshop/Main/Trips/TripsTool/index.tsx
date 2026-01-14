import ListTool from "@components/ListTool";
import type { SortType } from "@constants/Types";
import { type Trip } from "@services/trips";
import SortUtils from "@utils/SortUtils";
import { useEffect } from "react";
import { useLocation } from "react-router";

type TripsToolProps = {
  sortTypes: SortType[];
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  selected: number[];
  addOnClick?: () => void;
  tripsRef: React.RefObject<Trip[]>;
  getMyTrips: () => void;
  getSharedTrips: () => void;
  getMyHiddenTrips: () => void;
  asyncTrips: (state: Trip[]) => void;
};

const TripsTool = ({
  sortTypes,
  sortTypeIndex,
  setSortTypeIndex,
  selected,
  addOnClick,
  tripsRef,
  getMyTrips,
  getSharedTrips,
  getMyHiddenTrips,
  asyncTrips,
}: TripsToolProps) => {
  const location = useLocation();

  // rerender on access token and isUpdated
  useEffect(() => {
    switch (location.pathname) {
      case "/workshop":
        getMyTrips();
        break;
      case "/workshop/shared":
        getSharedTrips();
        break;
      case "/workshop/archive":
        getMyHiddenTrips();
        break;
    }
  }, [location.pathname]);

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
      addOnClick={addOnClick}
      addLabel="New Trip"
    />
  );
};

export default TripsTool;
