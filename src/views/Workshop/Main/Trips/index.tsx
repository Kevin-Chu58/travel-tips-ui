import TripCard from "@components/Cards/TripCard";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import type { Trip } from "@services/trips";
import { useNavigate, useLocation } from "react-router";
import ProgressBar from "@components/ProgressBar";
import TTButton from "@components/TTButton";
import "./index.scss";

type TripsProps = {
  trips: Trip[];
  asyncUpdateTrip?: (state: Trip) => void;
  asyncDeleteTrip: (state: Trip) => void;
  cursor?: string;
  getMore: () => void;
  isLoading: boolean;
  emptyMessage?: string;
  readonly?: boolean;
};

const Trips = ({
  trips,
  asyncUpdateTrip,
  asyncDeleteTrip,
  cursor,
  getMore,
  isLoading,
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
    <Box className="column flex workshop-trips-box">
      <Box className="progress-bar-box">
        <ProgressBar current={current} max={max} object="Trips" />
      </Box>
      {
        <Box className="trips-container">
          {trips.length > 0
            ? trips.map((trip) => (
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
            : !isLoading && (
                <Typography variant="h6">{emptyMessage}</Typography>
              )}
        </Box>
      }
      {isLoading ? (
        <Box className="column center v-center flex">
          <CircularProgress aria-label="Loading…" />
        </Box>
      ) : (
        cursor && (
          <Box className="row center section">
            <TTButton color="utility" onClick={getMore} disableRipple>
              Show More
            </TTButton>
          </Box>
        )
      )}
    </Box>
  );
};

export default Trips;
