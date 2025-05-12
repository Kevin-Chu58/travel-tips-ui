import { Grid } from "@mui/material";
import TripView from "@components/TripView";
import type { Trip } from "@services/trips";

type TripGalleryProps = {
  trips: Trip[];
};

const TripGallery = ({ trips }: TripGalleryProps) => {
  return (
    <Grid container spacing={2} columns={{ lg: 12, xl: 15 }}>
      {trips.map((trip) => (
        <TripView key={trip.id} trip={trip} />
      ))}
    </Grid>
  );
};

export default TripGallery;
