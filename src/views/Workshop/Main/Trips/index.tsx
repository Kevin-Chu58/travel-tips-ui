import TripCard from "@components/Cards/TripCard";
import { Box, Typography } from "@mui/material";
import type { Trip } from "@services/trips";
import { useNavigate } from "react-router";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";
import { useLocation } from "react-router";

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
  // window
  const isMobile = useIsMobile();
  // others
  const navigate = useNavigate();
  const location = useLocation();
  const isBookmarkTab = location.pathname === "/workshop/bookmark";

  return (
    <Box
      className={clsx(
        "workshop-main-content-trips-container",
        isMobile && "mobile",
      )}
    >
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
