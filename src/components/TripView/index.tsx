import { Avatar, Box, Chip, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import type { Trip } from "@services/trips";
import { useNavigate } from "react-router";
import { TripDurationColors } from "@constants/Colors";

type TripViewProps = {
  trip?: Trip;
}

const TripView = ({trip}: TripViewProps) => {
  const tags = ["historical", "national park"];
  const navigate = useNavigate();

  const getTripDurationColor = (duration: number) => {
    if (duration === 0)
      return TripDurationColors.none;
    if (duration < 7)
      return TripDurationColors.days;
    if (duration < 30)
      return TripDurationColors.weeks;
    if (duration < 120)
      return TripDurationColors.months;
    else
      return TripDurationColors.seasons;
  }

  const formatTripDuration = (duration: number) => {
    if (duration === 0)
      return "- -";
    else
      return duration + "D";
  }

  return (
    <Grid
      size={{xs: 12, sm: 6, md: 4, lg: 3}}
      display="flex"
      flexDirection="column"
      maxHeight={350}
      pb={1}
      sx={{
        bgcolor: "white",
        border: "0 solid transparent",
        borderRadius: 2,
      }}
    >
      {/* image */}
      <Box
        component="img"
        // src="src/assets/Lincoln_Memorial.jpeg"
        src="src/assets/test.jpg"
        sx={{
          width: "100%",
          height: 150,
          objectFit: "cover",
          objectPosition: "50% 40%",
          border: "0 solid transparent",
          borderRadius: 2,
        }}
      />

      {/* content creator & duration */}
      <Box height={30} ml={1} mt={-4.5} display="flex">
        <Avatar
          alt="creator"
          src="src/assets/alone.png"
          sx={{ width: 30, height: 30, cursor: "pointer" }}
        />
          <Typography
          fontFamily="noto serif"
          variant="body2"
          my={0.5}
          mr={0}
          ml="auto"
          sx={{
            cursor: "pointer",
            border: "0 solid transparent",
            borderRadius: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            bgcolor: getTripDurationColor(trip?.numDays ?? 0),
            color: "white",
            px: 1,
            ":hover": {
              filter: "brightness(1.2)",
            },
          }}
        >
          {formatTripDuration(trip?.numDays ?? 0)}
        </Typography>
      </Box>

      <Box>
        {/* name */}
        <Typography
          fontFamily="tagesschrift"
          variant="body1"
          mt={1}
          mx={0.5}
          sx={{
            cursor: "pointer",
            ":hover": {
              color: "primary.main",
            },
          }}
          onClick={() => {navigate("/trip/"+trip?.id)}}
        >
          {trip?.name}
        </Typography>

        {/* address */}
        <Box>
          <Typography
            fontFamily="noto serif"
            variant="body2"
            mx={0.25}
            sx={{
              cursor: "pointer",
              ":hover": {
                color: "primary.main",
              },
            }}
          >
            Washington D.C.
          </Typography>
        </Box>

        {/* tags */}
        <Box display="flex" flexDirection="row">
          {tags.map((tag) => (
            <Chip
              key={`trip-view-tag-${tag}`}
              label={tag}
              size="small"
              sx={{
                fontSize: 12,
                m: 0.5,
                color: "white",
                bgcolor: grey[600],
                cursor: "pointer",
                fontFamily: "noto serif",
                ":hover": {
                  filter: "brightness(1.1)",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Grid>
  );
};

export default TripView;