import TripCard from "@components/Cards/TripCard";
import { Box } from "@mui/material";
import type { Trip } from "@services/trips";
import { useNavigate } from "react-router";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type TripsProps = {
  trips: Trip[];
  asyncUpdateTrip?: (state: Trip) => void;
  asyncDeleteTrip: (state: Trip) => void;
};

const Trips = ({ trips, asyncUpdateTrip, asyncDeleteTrip }: TripsProps) => {
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
          asyncUpdateTrip={asyncUpdateTrip}
          asyncDeleteTrip={asyncDeleteTrip}
        />
      ))}
    </Box>
  );
};

export default Trips;
