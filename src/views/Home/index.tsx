import { Container, Grid, Typography } from "@mui/material";
import TripGallery from "@components/TripGallery";
import Search from "@components/Search";
import "./index.css";
import { useEffect, useState } from "react";
import { tripsService, type Trip } from "@services/trips";

const Home = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  // render on mount
  useEffect(() => {
    const getTrips = async () => {
      const handpickTrips = await tripsService.getTripsByName("t");
      setTrips(handpickTrips);
    }

    getTrips();
  }, []);

  return (
    <Container
      className="home-page"
      maxWidth="lg"
      sx={{ color: "black", p: 2 }}
      disableGutters
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Search
            className="home-page-search"
            color="black"
            autoFocus={true}
            fullWidth={true}
            placeholder="pick a place"
            sx={{ mx: "auto" }}
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="h4" fontFamily="lily script one">
            Hand-Pick
          </Typography>
        </Grid>
        <Grid size={12}>
          <TripGallery trips={trips} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
