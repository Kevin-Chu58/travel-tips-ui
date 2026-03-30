import TripCard from "@components/Cards/TripCard";
import { Box, Typography } from "@mui/material";
import type { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import type { Trip } from "@services/trips";
import { useNavigate, useLocation } from "react-router";
import ProgressBar from "@components/ProgressBar";
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
  // user
  const userSubExtend = useSelector(
    (state: RootState) => state.user.userSubExtend,
  );
  // trip count
  const current = userSubExtend?.tripCount ?? 0;
  const max = userSubExtend?.maxTripCount ?? 0;
  // others
  const navigate = useNavigate();
  const location = useLocation();
  const isBookmarkTab = location.pathname === "/workshop/bookmark";

  return (
    <Box className="workshop-trips-box">
      <Box className="progress-bar-box">
        <ProgressBar current={current} max={max} object="Trips" />
      </Box>
      <Box className="trips-container">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <TripCard
              key={`trip-${trip.id}`}
              trip={trip}
              readonly={readonly}
              onClick={() => navigate(`/workshop/trip/${trip.id}`)}
              asyncUpdateTrip={
                !isBookmarkTab ? asyncUpdateTrip : asyncDeleteTrip
              }
              asyncDeleteTrip={asyncDeleteTrip}
            />
          ))
        ) : (
          <Typography variant="h6">{emptyMessage}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Trips;
