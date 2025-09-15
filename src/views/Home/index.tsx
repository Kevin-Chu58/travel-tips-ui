import { Chip, Container, Grid, Typography } from "@mui/material";
import TTSearch from "@components/TTSearch";
import { useEffect, useState } from "react";
import { tripsService, type Trip } from "@services/trips";
import { useNavigate, useSearchParams } from "react-router";
import TripCard from "@components/Cards/TripCard";

const Home = () => {
  // trips - search result
  const [trips, setTrips] = useState<Trip[]>([]);
  // input
  const [input, setInput] = useState<string>("");
  // uri
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  // others
  const navigate = useNavigate();

  useEffect(() => {
    setInput(search);
  }, [search]);

  useEffect(() => {
    const getResult = async () => {
      if (input.length > 0) {
        setTrips(await getTrips(input));
      } else {
        // TODO
      }
    };

    getResult();
  }, [input]);

  const getTrips = async (input: string) => {
    return await tripsService.getTripsByTitle(input);
  };

  const Recommendation = () => {
    return (
      <>
        <Grid size={12} display="flex" justifyContent="center">
          <Typography>No Result.</Typography>
        </Grid>
      </>
    );
  };

  const SearchResult = () => {
    return (
      <>
        <Grid size={12}>
          <Typography variant="h4" fontFamily="lily script one">
            Result
          </Typography>
        </Grid>
        <Grid size={12} mt={-2}>
          <Chip
            label={
              <Typography variant="body2">
                search: <strong>{input}</strong>
              </Typography>
            }
            size="small"
            onDelete={() => navigate("/home")}
          />
        </Grid>
        <Grid size={12} display="flex" flexWrap="wrap" gap={2}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => navigate(`/trip/${trip.id}`)}
              readonly
            />
          ))}
        </Grid>
      </>
    );
  };

  return (
    <Container
      className="home-page"
      maxWidth="lg"
      sx={{ color: "black", py: 2 }}
      disableGutters
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <TTSearch
            color="black"
            autoFocus={true}
            fullWidth={true}
            placeholder="pick a place"
            isTripSearch
            sx={{
              mx: "auto",
              ".MuiInput-root": {
                color: "black",
                ".MuiInputBase-input": {
                  width: "90%",
                },
                "&::after": {
                  borderBottom: "2px solid black",
                  transform: "scaleX(1) translateX(0)",
                },
              },
            }}
          />
        </Grid>
        {search.length > 0 ? <SearchResult /> : <Recommendation />}
      </Grid>
    </Container>
  );
};

export default Home;
