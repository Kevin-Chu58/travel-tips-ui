import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import type { TripDetail } from "@services/trips";
import { useEffect } from "react";
import { useParams } from "react-router";
import test from "@assets/Lincoln_Memorial.jpeg";
import { TripDurationColors } from "@constants/Colors";
import { grey } from "@mui/material/colors";
import Map from "@components/Map";

type TripGeneralProps = {
  tripDetail: TripDetail | undefined;
  setTripId: (tripId: number) => void;
};

const TripGeneral = ({ tripDetail, setTripId }: TripGeneralProps) => {
  const { tripId } = useParams();

  const tags = ["historical", "national park"];

  // render on mount
  useEffect(() => setTripId(Number(tripId)), []);

  return (
    <Container
      maxWidth={false}
      sx={{ color: "black", position: "relative" }}
      disableGutters
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: `${window.innerHeight - 94}px`, // 94px: height of header bar + sub header bar
        }}
      >
        <Grid
          container
          justifyContent="center"
          spacing={2}
          sx={{
            display: "flex",
            top: "0%",
            width: "100%",
            height: "auto",
            color: "white",
            position: "relative",
            zIndex: 1,
            px: 10,
            pt: 10,
          }}
        >
          <Grid
            size={12}
            container
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* trip general info */}
            <Grid size={9}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  px: 4,
                  // pl: 8,
                  borderRadius: 4,
                  "&.MuiPaper-root": {
                    bgcolor: "#000000cc",
                    color: "white",
                  },
                }}
              >
                {/* title and duration */}
                <Grid size={12} display="flex" direction="column">
                  <Typography variant="h4">{tripDetail?.name}</Typography>
                  <Typography
                    variant="h6"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    fontFamily="noto serif"
                    sx={{
                      bgcolor: TripDurationColors.days,
                      ml: "auto",
                      mr: -4,
                      my: 0.7,
                      px: 3,
                    }}
                  >
                    {tripDetail?.days?.length}D
                  </Typography>
                </Grid>

                {/* last updated at */}
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    fontFamily="arial"
                    color={grey[700]}
                  >
                    Updated:{" "}
                    {tripDetail?.lastUpdatedAt.toString().split("T")[0]}
                  </Typography>
                </Grid>

                {/* tags */}
                <Grid size={12} ml={-0.5} mt={3}>
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
                </Grid>

                {/* description */}
                <Grid size={12} mt={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      wordSpacing: 2,
                      lineHeight: 1.5,
                      textAlign: "justify",
                      fontFamily: "sans-serif",
                    }}
                  >
                    The National Mall in Washington, D.C., is a historic park
                    stretching from the Capitol Building to the Lincoln
                    Memorial. Along its path, visitors can explore iconic
                    landmarks like the Washington Monument, the World War II
                    Memorial, and the Vietnam Veterans Memorial. The Mall is
                    home to several Smithsonian museums and offers beautiful
                    green spaces, making it a must-visit for anyone interested
                    in history and culture. <br/><br/> The National Mall in Washington,
                    D.C., is a historic park stretching from the Capitol
                    Building to the Lincoln Memorial. Along its path, visitors
                    can explore iconic landmarks like the Washington Monument,
                    the World War II Memorial, and the Vietnam Veterans
                    Memorial. The Mall is home to several Smithsonian museums
                    and offers beautiful green spaces, making it a must-visit
                    for anyone interested in history and culture.
                  </Typography>
                </Grid>
              </Paper>
            </Grid>

            {/* creator, map, and access */}
            <Grid container size={3} spacing={1} flexDirection="column">

              {/* creator */}
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  px: 4,
                  // pl: 8,
                  borderRadius: 4,
                  "&.MuiPaper-root": {
                    bgcolor: "#000000cc",
                  },
                }}
              >
                <Grid size={12} display="flex" alignItems="center" my={1}>
                  <Avatar/>
									<Typography variant="body2" fontFamily="arial" color={grey[700]} mx={2}>
										{tripDetail?.createdBy}
									</Typography>
								</Grid>
              </Paper>

              
              {/* map */}
              <Paper
                elevation={4}
                sx={{
                  overflow: "hidden",
                  borderRadius: 4,
                }}
              >
                <Map />
              </Paper>

              
              {/* access */}
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  px: 4,
                  // pl: 8,
                  borderRadius: 4,
                  "&.MuiPaper-root": {
                    bgcolor: "#000000cc",
                    color: "white",
                  },
                }}
              >
                <Grid size={12} display="flex" alignItems="center" my={1}>
                  access
								</Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* background image */}
        <Box
          component="img"
          src={test}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 40%",
            zIndex: 0,
          }}
        />
      </Box>
    </Container>
  );
};

export default TripGeneral;
