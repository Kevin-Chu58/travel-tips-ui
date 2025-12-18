import TripCard from "@components/Cards/TripCard";
import { Box } from "@mui/material";
import type { Trip } from "@services/trips";
import { useNavigate } from "react-router";
import "./index.scss";
import clsx from "clsx";
import { useIsMobile } from "@hooks/useIsMobile";

type TripsProps = {
  trips: Trip[];
  syncDeleteTrip: (state: Trip) => void;
};

const Trips = ({ trips, syncDeleteTrip }: TripsProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <Box
      className={clsx(
        "workshop-main-content-trips-container",
        isMobile && "mobile"
      )}
    >
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
