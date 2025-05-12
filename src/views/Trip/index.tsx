import { Navigate, Route, Routes } from "react-router";
import SubHeaderBar from "@components/SubHeaderBar";
import { useEffect, useState } from "react";
import TripGeneral from "./TripGeneral";
import { type Trip, tripsService } from "@services/trips";

const Trip = () => {
  // const token = useSelector((state: RootState) => state.auth.accessToken);
  const [tripId, setTripId] = useState<number>();
  const [trip, setTrip] = useState<Trip>();

  // render when tripId exists
  useEffect(() => {
    const getTrip = async () => {
      if (tripId) {
        const trip = await tripsService.getTripDetailById(tripId);
        setTrip(trip);
      }
    };
    getTrip();
  }, [tripId]);

  let headerItems = [{
    name: "General",
    to: `/trip/${tripId}`,
  }, {
    name: "Schedule",
    to: `/trip/${tripId}/schedule`,
  }, {
    name: "Map",
    to: `/trip/${tripId}/map`,
  }]

  

  return (
    <>
      <SubHeaderBar items={headerItems} />
      <Routes>
        <Route index element={<Navigate to={"/home"} />} />
        <Route path="/:tripId" element={<TripGeneral tripDetail={trip} setTripId={setTripId} />} />
        {/* <Route path="/:tripId/schedule" element={<TripPage />} />
        <Route path="/:tripId/map" element={<TripPage />} /> */}
      </Routes>
    </>
  );
};

export default Trip;
