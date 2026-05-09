import ListTool from "@components/ListTool";
import { useEffect } from "react";
import { useLocation } from "react-router";

type TripsToolProps = {
  selected: number[];
  addOnClick?: () => void;
  getMyTrips: () => void;
  getSharedTrips: () => void;
  getMyHiddenTrips: () => void;
  getMyBookmarkedTrips: () => void;
};

const TripsTool = ({
  selected,
  addOnClick,
  getMyTrips,
  getSharedTrips,
  getMyHiddenTrips,
  getMyBookmarkedTrips,
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
      case "/workshop/bookmark":
        getMyBookmarkedTrips();
        break;
    }
  }, [location.pathname]);

  return (
    <ListTool
      showFilter
      showSelect
      selected={selected}
      addOnClick={addOnClick}
      addLabel="New Trip"
    />
  );
};

export default TripsTool;
