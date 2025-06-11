import TTTripCard from "@components/TTTripCard";
import { WorkshopToNavTab } from "@constants/Layouts";
import { Grid } from "@mui/material";
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
    <Grid
      container
      spacing={2}
      columns={12}
      p={2}
      sx={{
        maxHeight: `calc(100vh - ${WorkshopToNavTab}px)`,
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
    </Grid>
  );
};

export default Trips;
