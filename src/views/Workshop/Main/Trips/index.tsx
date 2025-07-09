import TTTripCard from "@components/TTTripCard";
import { Box, Grid } from "@mui/material";
import type { Trip } from "@services/trips";

type TripsProps = {
  trips: Trip[];
  selected: number[];
  addSelected: (state: number) => void;
  removeSelected: (state: number) => void;
  setIsUpdated: () => void;
}

const Trips = ({
  trips,
  selected,
  addSelected,
  removeSelected,
  setIsUpdated,
}: TripsProps) => {

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      sx={{
        my: 1,
        gap: 2,
      }}
    >
      {trips.map((trip) => (
        <TTTripCard
          key={`trip-${trip.id}`}
          trip={trip}
          isFocused={selected.includes(trip.id)}
          setIsFocused={
            selected.includes(trip.id) ? removeSelected : addSelected
          }
          setParentUpdate={setIsUpdated}
        />
      ))}
      <Grid size={12} height={4} />
    </Box>
  );
};

export default Trips;
