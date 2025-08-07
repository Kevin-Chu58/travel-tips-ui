import { Navigate, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import { tripsService, type Trip } from "@services/trips";
import { Container, Divider, Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import { Headers } from "@constants/Layouts";

const TripView = () => {
  // components
  const [trip, setTrip] = useState<Trip>();
  // url
  const { tripId } = useParams();

  if (!/^\d+$/.test(tripId ?? "")) {
    return <Navigate to="/home" />;
  }

  let queryKey = ["trip", tripId];

  // render the nav tab index focus when page initializes
  // useEffect(() => {
  //   const getTrip = async () => {
  //     if (tripId) {
  //       const trip = await tripsService.getTripDetailById(
  //         Number.parseInt(tripId)
  //       );
  //       setTrip(trip);
  //     }
  //   };
  //   getTrip();
  // }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        color: "black",
        overflowX: "hidden",
        overflowY: "auto",
        height: `calc(100vh - ${Headers}px)`,
      }}
    >
      <Grid container direction="column" position="relative" spacing={4}>
        {/* name */}
        <Grid
          size={12}
          display="flex"
          py={2}
          px={4}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            color: "white",
            bgcolor: "rgba(0, 0, 0, .8)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* <Typography variant="h5" fontWeight="bold">
            {trip?.name}
          </Typography> */}
        </Grid>

        {/* content */}
        <Grid
          container
          size={12}
          direction="column"
          spacing={10}
          maxWidth="lg"
          mx="auto"
        >
          {/* description */}
          {trip?.description && (
            <Grid size={12}>
              <Typography variant="h4" fontWeight="bold">
                Introduction
              </Typography>
              <Divider
                sx={{ borderBottomWidth: 2, borderColor: "black", mb: 2 }}
              />
              <Typography variant="h6" whiteSpace="pre-wrap">
                {trip?.description}
              </Typography>
            </Grid>
          )}

          {/* timeline */}
          <Grid size={12}>
            <Typography variant="h4" fontWeight="bold">
              Timeline
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

const Trip = () => {
  return (
    <Routes>
      <Route path=":tripId" element={<TripView />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default Trip;
