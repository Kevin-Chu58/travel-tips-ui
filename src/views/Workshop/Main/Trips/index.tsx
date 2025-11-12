import TripCard from "@components/Cards/TripCard";
import { Box } from "@mui/material";
import type { Trip } from "@services/trips";
import { useNavigate } from "react-router";
import "./index.scss";

type TripsProps = {
  trips: Trip[];
  syncDeleteTrip: (state: Trip) => void;
};

const Trips = ({ trips, syncDeleteTrip }: TripsProps) => {
  const navigate = useNavigate();

  return (
    <Box className="workshop-main-content-trips-container">
      {trips.map((trip) => (
        <TripCard
          key={`trip-${trip.id}`}
          trip={trip}
          onClick={() => navigate(`/workshop/trip/${trip.id}`)}
          syncDeleteTrip={syncDeleteTrip}
        />
      ))}
    </Box>
  );
};

export default Trips;
