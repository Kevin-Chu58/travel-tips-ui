import { getHex } from "@constants/Colors";
import { Box, Grid, Switch, Typography } from "@mui/material";
import { tripsService, type Trip } from "@services/trips";
import TimeUtils from "@utils/TimeUtils";
import { useNavigate } from "react-router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import TTChipButton from "@components/TTChipButton";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Memorial from "@assets/Lincoln_Memorial.jpeg";

type TTTripCardProps = {
  trip: Trip;
  isFocused?: boolean;
  setIsFocused?: (state: number) => void;
  setParentUpdate?: () => void;
};

const TTTripCard = ({
  trip,
  isFocused,
  setIsFocused,
  setParentUpdate,
}: TTTripCardProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();

  const updateTripIsPublic = async (id: number) => {
    if (token) {
      await tripsService.patchTripIsPublic([id], !trip.isPublic, token);
      if (setParentUpdate) setParentUpdate();
    }
  };

  const hideTrip = async (id: number) => {
    if (token) {
      await tripsService.patchTripIsHidden([id], true, token);
      if (setParentUpdate) setParentUpdate();
    }
  };

  return (
    <Grid
      container
      size={{ xs: 12, md: 6 }}
      key={`my-trip-${trip.id}`}
      onClick={() => (setIsFocused ? setIsFocused(trip.id) : {})}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        color: "white",
        bgcolor: getHex("steelblue"),
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        height: 160,
        cursor: "pointer",
      }}
    >
      {/* trip info */}
      <Grid
        container
        direction="column"
        spacing={0}
        size={7}
        p={1}
        position="relative"
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          textTransform="capitalize"
          display="flex"
          alignItems="center"
        >
          {trip.name}
        </Typography>

        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{
            color: "lightgrey",
            fontStyle: trip.numDays ? "none" : "italic",
          }}
        >
          {TimeUtils.formatDays(trip.numDays ?? 0)}
        </Typography>

        <Box display="flex" alignItems="center" p={.5}>
            {trip.isPublic ? <VisibilityIcon/> : <VisibilityOffIcon/>}
            <Switch checked={trip.isPublic} color="secondary" onClick={(e) => {
                e.stopPropagation();
                updateTripIsPublic(trip.id);
              }} />
        </Box>

        {/* last updated */}

        <Typography
          variant="body2"
          fontStyle="italic"
          bottom={8}
          left={8}
          position="absolute"
        >
          Updated · {trip.lastUpdatedAt.toString().split("T")[0]}
        </Typography>
      </Grid>

      {/* trip image */}
      <Grid size={5} position="relative">
        <Box
          component="img"
          src={Memorial}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 40%",
          }}
        />

        {/* hovered options */}
        <Box
          position="absolute"
          top={isHovered ? 0 : "100%"}
          right={0}
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          zIndex={5}
          sx={{
            background: "rgba(0, 0, 0, .8)",
            borderBottomLeftRadius: 6,
            transition: ".2s ease-in-out all",
            opacity: isHovered ? 1 : 0,
          }}
        >
          {/* description */}
          <Box flex={1} sx={{ overflowX: "hidden", overflowY: "auto" }}>
            <Typography p={1} variant="body2" whiteSpace="pre-line" color="white">
              {trip.description}
            </Typography>
          </Box>
          {/* options - edit, delete */}
          <Box height={40} display="flex" justifyContent="center">
            <TTChipButton
              label="EDIT"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/workshop/trip/${trip.id}`);
              }}
              sx={{
                mr: 4,
                bgcolor: "transparent",
                color: getHex("deepskyblue"),
                border: "2px solid",
                borderColor: getHex("deepskyblue"),
                fontWeight: "bold",
                fontFamily: "arial",
                ":hover": {
                  filter: "brightness(1.2)",
                },
              }}
            />
            <TTChipButton
              label="DELETE"
              onClick={(e) => {
                e.stopPropagation();
                hideTrip(trip.id);
              }}
              sx={{
                bgcolor: "transparent",
                color: "error.main",
                border: "2px solid",
                borderColor: "error.main",
                fontWeight: "bold",
                fontFamily: "arial",
                ":hover": {
                  filter: "brightness(1.2)",
                },
              }}
            />
          </Box>
        </Box>
      </Grid>

      {/* focused status */}
      {isFocused && (
        <Box
          position="absolute"
          top={0}
          right={0}
          width={40}
          height={40}
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={10}
          sx={{
            background: "rgba(0, 0, 0, .8)",
            borderBottomLeftRadius: 6,
          }}
        >
          <CheckCircleIcon fontSize="large" sx={{ color: "success.light" }} />
        </Box>
      )}
    </Grid>
  );
};

export default TTTripCard;
