import { Container, Grid, Typography } from "@mui/material";
import type { TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

type TripScheduleProps = {
  tripDetail: TripDetail | undefined;
  setTripId: (tripId: number) => void;
};

const TripSchedule = ({ tripDetail, setTripId }: TripScheduleProps) => {
  const { tripId } = useParams();
  const [trackId, setTrackId] = useState<number>(0);

  // render on mount
  useEffect(() => setTripId(Number(tripId)), []);

  // rerender on track id update
  useEffect(() => {}, [trackId]);

  return (
    <Container maxWidth="lg" sx={{ color: "black", position: "relative" }}>
      <Grid container spacing={2}>
        {/* tracking bar */}
        <Grid
          container
          size={2}
          spacing={1}
          flexDirection="column"
          p={1}
          sx={{ position: "relative", top: 0 }}
        >
          {tripDetail?.days?.map((day, i) => (
            <Grid
              key={`day-${i}-track`}
              borderLeft={10}
              borderColor={i === trackId ? "red" : "#333333"}
              height={i === trackId ? 120 : 80}
              sx={{ transition: ".2s linear all", ":hover": {height: 120, borderColor: "red"} }}
              onClick={() => {setTrackId(i)}}
              // onMouseEnter={() => {setTrackId(i)}}
            >
              {i === trackId && `DAY${i+1} ${day.name}`}
            </Grid>
          ))}
        </Grid>

        {/* schedule */}
        <Grid size={10} mt={2}>
          <Typography variant="h3">{tripDetail?.name}</Typography>

          {tripDetail?.days?.map((day, i) => (
            <Grid key={`day-${i}`} m={2}>
              <Typography variant="h5" color="primary">
                DAY{i + 1} - {day.name}
              </Typography>
              {day.isOverNight && (
                <Typography variant="h6" color="warning">
                  overnight
                </Typography>
              )}
              <Typography variant="h6" fontFamily="arial">
                {day.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TripSchedule;
