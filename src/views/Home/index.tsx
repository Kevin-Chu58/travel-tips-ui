import { Container, Grid, Typography } from "@mui/material";
import TripView from "../../components/TripView";
import TripGallery from "../../components/TripGallery";

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ color: "black", p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h4" fontFamily="lily script one">
            Hand-Pick
          </Typography>
        </Grid>
        <Grid container size={12} columns={{lg: 12, xl: 20 }} spacing={3}>
          <TripGallery />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
