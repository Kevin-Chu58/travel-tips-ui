import TripCard from "@components/Cards/TripCard";
import { Box, Typography } from "@mui/material";
import type { Trip } from "@services/trips";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import "./index.scss";

type TripsProps = {
  trips: Trip[];
  asyncUpdateTrip?: (state: Trip) => void;
  asyncDeleteTrip: (state: Trip) => void;
  emptyMessage?: string;
  readonly?: boolean;
};

const Trips = ({
  trips,
  asyncUpdateTrip,
  asyncDeleteTrip,
  emptyMessage = "",
  readonly = false,
}: TripsProps) => {
  // others
  const navigate = useNavigate();
  const location = useLocation();
  const isBookmarkTab = location.pathname === "/workshop/bookmark";

  return (
    <Box className="workshop-main-content-trips-container">
      {trips.length > 0 ? (
        trips.map((trip) => (
          <TripCard
            key={`trip-${trip.id}`}
            trip={trip}
            readonly={readonly}
            onClick={() => navigate(`/workshop/trip/${trip.id}`)}
            asyncUpdateTrip={!isBookmarkTab ? asyncUpdateTrip : asyncDeleteTrip}
            asyncDeleteTrip={asyncDeleteTrip}
          />
        ))
      ) : (
        <Typography variant="h6">{emptyMessage}</Typography>
      )}
    </Box>
  );
};

export default Trips;
