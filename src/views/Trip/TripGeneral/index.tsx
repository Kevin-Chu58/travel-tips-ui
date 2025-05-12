import { Avatar, Box, Container, Grid, Paper, Typography } from "@mui/material";
import type { TripDetail } from "@services/trips";
import { useEffect } from "react";
import { useParams } from "react-router";
import test from "@assets/Lincoln_Memorial.jpeg";
import { TripDurationColors } from "@constants/Colors";
import { grey } from "@mui/material/colors";

type TripGeneralProps = {
  tripDetail: TripDetail | undefined;
  setTripId: (tripId: number) => void;
};

const TripGeneral = ({ tripDetail, setTripId }: TripGeneralProps) => {
  const { tripId } = useParams();

  // render on mount
  useEffect(() => setTripId(Number(tripId)), []);

  return (
    <Container
      className="home-page"
      maxWidth={false}
      sx={{ color: "black", position: "relative" }}
      disableGutters
    >
      <Box sx={{ position: "relative", width: "100%", minHeight: "80vh" }}>
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
									pl: 8,
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
											mr: -2,
											my: .7,
											px: 3,
                    }}
                  >
                    {tripDetail?.days?.length}D
                  </Typography>
                </Grid>

								{/* last updated at */}
								<Grid size={12}>
                  <Typography variant="body2" fontFamily="arial" color={grey[700]}>
										Updated: {tripDetail?.lastUpdatedAt.toString().split("T")[0]}
									</Typography>
								</Grid>
								
								{/* creator */}
								<Grid size={12} display="flex" alignItems="center" my={1}>
                  <Avatar/>
									<Typography variant="body2" fontFamily="arial" color={grey[700]}>
										{tripDetail?.createdBy}
									</Typography>
								</Grid>

              </Paper>
            </Grid>
            <Grid size={3}></Grid>
          </Grid>
        </Grid>
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
