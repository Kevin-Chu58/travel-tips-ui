import { Avatar, Box, Chip, Typography } from "@mui/material";
import type { Trip } from "@services/trips";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TimeUtils from "@utils/TimeUtils";
import TLogo from "@assets/T.svg";
import { useNavigate } from "react-router";
import "./index.scss";

type TripCardProps = {
  trip: Trip;
};

const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();

  return (
    <Box className="trip-card-box">
      {/* image container */}
      <Box
        className="trip-card-image-box"
        onClick={() => navigate(`/workshop/trip/${trip.id}`)}
      >
        {/* no images */}
        <img
          src={TLogo}
          className="trip-card-image"
        />

        {/* creator info */}
        <Box
          className="trip-card-image-creator-info-box"
        >
          <Avatar
            className="trip-card-avatar"
          />

          <Chip
            label={
              <Typography className="trip-card-username">
                {trip.createdBy.username}
              </Typography>
            }
            size="small"
            className="trip-card-username-chip"
          />
        </Box>
      </Box>

      <Box className="trip-card-info-box">
        {/* title */}
        <Typography
          fontSize="1.1rem"
          className="trip-card-title"
        >
          {trip.title}
        </Typography>

        {/* number of days */}
        <Typography className="trip-card-num-days">
          {TimeUtils.formatDays(trip.numDays ?? 0)}
        </Typography>
      </Box>

      <Chip
        icon={trip.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
        label={trip.isPublic ? "public" : "private"}
        size="small"
      />
    </Box>
  );
};

export default TripCard;
