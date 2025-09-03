import TripCard from "@components/Cards/TripCard";
import { Box, Grid } from "@mui/material";
import type { Trip } from "@services/trips";

type TripsProps = {
  trips: Trip[];
  setIsUpdated: () => void;
}

const Trips = ({
  trips,
  setIsUpdated,
}: TripsProps) => {

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      sx={{
        mt: 2,
        gap: 2,
      }}
    >
      {trips.map((trip) => (
        <TripCard
          key={`trip-${trip.id}`}
          trip={trip}
          setIsParentUpdated={setIsUpdated}
        />
      ))}
      <Grid size={12} height={4} />
    </Box>
  );
};

export default Trips;
